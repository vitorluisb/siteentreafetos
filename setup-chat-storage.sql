-- ====================================================
-- CONFIGURAÇÃO DE STORAGE PARA CHAT - EXECUTAR NO SUPABASE
-- ====================================================
-- Copie e cole este script no SQL Editor do Supabase
-- Dashboard > SQL Editor > New Query
-- ====================================================

-- 1. CRIAR BUCKET PARA ARQUIVOS DO CHAT
-- ====================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'chat-attachments', 
  'chat-attachments', 
  true,
  52428800, -- 50MB em bytes
  ARRAY[
    'image/jpeg',
    'image/png', 
    'image/gif',
    'image/webp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
    'audio/mpeg',
    'audio/wav',
    'video/mp4',
    'video/webm'
  ]::text[]
)
ON CONFLICT (id) DO UPDATE SET 
  public = true,
  file_size_limit = 52428800,
  allowed_mime_types = ARRAY[
    'image/jpeg',
    'image/png', 
    'image/gif',
    'image/webp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
    'audio/mpeg',
    'audio/wav',
    'video/mp4',
    'video/webm'
  ]::text[];

-- 2. ADICIONAR CAMPOS PARA ARQUIVOS NA TABELA MESSAGES
-- ====================================================

-- Adicionar campo files para armazenar informações dos arquivos
ALTER TABLE public.messages 
ADD COLUMN IF NOT EXISTS files JSONB;

-- Adicionar campo message_type para diferenciar mensagens de texto e arquivos
ALTER TABLE public.messages 
ADD COLUMN IF NOT EXISTS message_type TEXT DEFAULT 'text';

-- Adicionar comentários para documentação
COMMENT ON COLUMN public.messages.files IS 'Array JSON com informações dos arquivos anexados';
COMMENT ON COLUMN public.messages.message_type IS 'Tipo da mensagem: text, file, image, etc.';

-- 3. CONFIGURAR POLÍTICAS RLS PARA STORAGE
-- ====================================================

-- Remover políticas antigas se existirem
DROP POLICY IF EXISTS "Usuários autenticados podem ler arquivos do chat" ON storage.objects;
DROP POLICY IF EXISTS "Usuários autenticados podem fazer upload no chat" ON storage.objects;
DROP POLICY IF EXISTS "Usuários podem deletar seus próprios arquivos do chat" ON storage.objects;

-- Política para leitura de arquivos do chat (todos os usuários autenticados podem ler)
CREATE POLICY "Usuários autenticados podem ler arquivos do chat" ON storage.objects
    FOR SELECT 
    TO authenticated 
    USING (bucket_id = 'chat-attachments');

-- Política para upload de arquivos do chat (todos os usuários autenticados podem fazer upload)
CREATE POLICY "Usuários autenticados podem fazer upload no chat" ON storage.objects
    FOR INSERT 
    TO authenticated 
    WITH CHECK (bucket_id = 'chat-attachments');

-- Política para exclusão de arquivos do chat (apenas admins podem excluir)
CREATE POLICY "Admins podem excluir arquivos do chat" ON storage.objects
    FOR DELETE 
    TO authenticated 
    USING (
        bucket_id = 'chat-attachments'
        AND EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND (auth.users.raw_user_meta_data->>'role')::text = 'admin'
        )
    );

-- 4. CRIAR ÍNDICES PARA PERFORMANCE
-- ====================================================

-- Índice para buscar mensagens com arquivos
CREATE INDEX IF NOT EXISTS idx_messages_files ON public.messages USING GIN (files);

-- Índice para buscar por tipo de mensagem
CREATE INDEX IF NOT EXISTS idx_messages_type ON public.messages (message_type);

-- 5. FUNÇÃO PARA LIMPAR ARQUIVOS ÓRFÃOS (OPCIONAL)
-- ====================================================

-- Função para limpar arquivos que não estão mais referenciados em mensagens
CREATE OR REPLACE FUNCTION cleanup_orphaned_chat_files()
RETURNS void AS $$
DECLARE
    file_record RECORD;
BEGIN
    -- Buscar arquivos no storage que não estão referenciados em mensagens
    FOR file_record IN 
        SELECT name FROM storage.objects 
        WHERE bucket_id = 'chat-attachments'
        AND NOT EXISTS (
            SELECT 1 FROM public.messages 
            WHERE files IS NOT NULL 
            AND files::text LIKE '%' || storage.objects.name || '%'
        )
    LOOP
        -- Deletar arquivo órfão
        DELETE FROM storage.objects 
        WHERE bucket_id = 'chat-attachments' 
        AND name = file_record.name;
    END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comentário da função
COMMENT ON FUNCTION cleanup_orphaned_chat_files() IS 'Remove arquivos do chat que não estão mais referenciados em mensagens';

-- ====================================================
-- INSTRUÇÕES DE USO
-- ====================================================

/*
APÓS EXECUTAR ESTE SCRIPT:

1. ✅ Bucket 'chat-attachments' criado
2. ✅ Campos 'files' e 'message_type' adicionados à tabela messages
3. ✅ Políticas RLS configuradas para segurança
4. ✅ Índices criados para performance
5. ✅ Função de limpeza disponível

VERIFICAÇÃO:
- Vá para Storage > chat-attachments (deve existir)
- Vá para Table Editor > messages (deve ter campos files e message_type)
- Teste o upload de arquivos no chat

LIMPEZA PERIÓDICA (OPCIONAL):
Para remover arquivos órfãos, execute:
SELECT cleanup_orphaned_chat_files();

TIPOS DE ARQUIVO SUPORTADOS:
- Imagens: JPEG, PNG, GIF, WebP
- Documentos: PDF, Word, Excel
- Texto: TXT
- Áudio: MP3, WAV
- Vídeo: MP4, WebM

LIMITES:
- Tamanho máximo por arquivo: 50MB
- Apenas tipos de arquivo permitidos
- Usuários autenticados podem fazer upload
- Apenas admins podem deletar arquivos
*/