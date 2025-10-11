-- Políticas RLS para Entre Afetos
-- Execute este script no SQL Editor do Supabase para configurar as políticas de segurança

-- =====================================================
-- TABELA: notices (Avisos/Notícias)
-- =====================================================

-- Habilitar RLS na tabela notices
ALTER TABLE public.notices ENABLE ROW LEVEL SECURITY;

-- Política para leitura de avisos (todos os usuários autenticados podem ler)
CREATE POLICY "Usuários autenticados podem ler avisos" ON public.notices
    FOR SELECT 
    TO authenticated 
    USING (true);

-- Política para criação de avisos (apenas admin e psicólogos)
CREATE POLICY "Admin e psicólogos podem criar avisos" ON public.notices
    FOR INSERT 
    TO authenticated 
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND (
                (auth.users.raw_user_meta_data->>'role')::text IN ('admin', 'psicologo')
                OR auth.users.user_metadata->>'role' IN ('admin', 'psicologo')
            )
        )
    );

-- Política para atualização de avisos (apenas admin e psicólogos)
CREATE POLICY "Admin e psicólogos podem atualizar avisos" ON public.notices
    FOR UPDATE 
    TO authenticated 
    USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND (
                (auth.users.raw_user_meta_data->>'role')::text IN ('admin', 'psicologo')
                OR auth.users.user_metadata->>'role' IN ('admin', 'psicologo')
            )
        )
    );

-- Política para exclusão de avisos (apenas admin)
CREATE POLICY "Apenas admin pode excluir avisos" ON public.notices
    FOR DELETE 
    TO authenticated 
    USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND (
                (auth.users.raw_user_meta_data->>'role')::text = 'admin'
                OR auth.users.user_metadata->>'role' = 'admin'
            )
        )
    );

-- =====================================================
-- TABELA: documents (Documentos)
-- =====================================================

-- Habilitar RLS na tabela documents
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- Política para leitura de documentos (todos os usuários autenticados podem ler)
CREATE POLICY "Usuários autenticados podem ler documentos" ON public.documents
    FOR SELECT 
    TO authenticated 
    USING (true);

-- Política para upload de documentos (todos os usuários autenticados podem fazer upload)
CREATE POLICY "Usuários autenticados podem fazer upload de documentos" ON public.documents
    FOR INSERT 
    TO authenticated 
    WITH CHECK (uploaded_by = auth.uid());

-- Política para atualização de documentos (apenas o autor ou admin)
CREATE POLICY "Autor ou admin podem atualizar documentos" ON public.documents
    FOR UPDATE 
    TO authenticated 
    USING (
        uploaded_by = auth.uid() 
        OR EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND (
                (auth.users.raw_user_meta_data->>'role')::text = 'admin'
                OR auth.users.user_metadata->>'role' = 'admin'
            )
        )
    );

-- Política para exclusão de documentos (apenas o autor ou admin)
CREATE POLICY "Autor ou admin podem excluir documentos" ON public.documents
    FOR DELETE 
    TO authenticated 
    USING (
        uploaded_by = auth.uid() 
        OR EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND (
                (auth.users.raw_user_meta_data->>'role')::text = 'admin'
                OR auth.users.user_metadata->>'role' = 'admin'
            )
        )
    );

-- =====================================================
-- TABELA: polls (Enquetes)
-- =====================================================

-- Habilitar RLS na tabela polls
ALTER TABLE public.polls ENABLE ROW LEVEL SECURITY;

-- Política para leitura de enquetes (todos os usuários autenticados podem ler)
CREATE POLICY "Usuários autenticados podem ler enquetes" ON public.polls
    FOR SELECT 
    TO authenticated 
    USING (true);

-- Política para criação de enquetes (apenas admin e psicólogos)
CREATE POLICY "Admin e psicólogos podem criar enquetes" ON public.polls
    FOR INSERT 
    TO authenticated 
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND (
                (auth.users.raw_user_meta_data->>'role')::text IN ('admin', 'psicologo')
                OR auth.users.user_metadata->>'role' IN ('admin', 'psicologo')
            )
        )
    );

-- Política para atualização de enquetes (apenas admin e psicólogos)
CREATE POLICY "Admin e psicólogos podem atualizar enquetes" ON public.polls
    FOR UPDATE 
    TO authenticated 
    USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND (
                (auth.users.raw_user_meta_data->>'role')::text IN ('admin', 'psicologo')
                OR auth.users.user_metadata->>'role' IN ('admin', 'psicologo')
            )
        )
    );

-- Política para exclusão de enquetes (apenas admin)
CREATE POLICY "Apenas admin pode excluir enquetes" ON public.polls
    FOR DELETE 
    TO authenticated 
    USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND (
                (auth.users.raw_user_meta_data->>'role')::text = 'admin'
                OR auth.users.user_metadata->>'role' = 'admin'
            )
        )
    );

-- =====================================================
-- TABELA: poll_votes (Votos das Enquetes)
-- =====================================================

-- Habilitar RLS na tabela poll_votes (se existir)
ALTER TABLE public.poll_votes ENABLE ROW LEVEL SECURITY;

-- Política para leitura de votos (todos os usuários autenticados podem ler)
CREATE POLICY "Usuários autenticados podem ler votos" ON public.poll_votes
    FOR SELECT 
    TO authenticated 
    USING (true);

-- Política para criação de votos (usuários podem votar)
CREATE POLICY "Usuários podem votar" ON public.poll_votes
    FOR INSERT 
    TO authenticated 
    WITH CHECK (user_id = auth.uid());

-- Política para atualização de votos (usuários podem alterar seus próprios votos)
CREATE POLICY "Usuários podem alterar seus votos" ON public.poll_votes
    FOR UPDATE 
    TO authenticated 
    USING (user_id = auth.uid());

-- =====================================================
-- TABELA: messages (Mensagens do Chat)
-- =====================================================

-- Habilitar RLS na tabela messages
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Política para leitura de mensagens (todos os usuários autenticados podem ler)
CREATE POLICY "Usuários autenticados podem ler mensagens" ON public.messages
    FOR SELECT 
    TO authenticated 
    USING (true);

-- Política para criação de mensagens (todos os usuários autenticados podem enviar)
CREATE POLICY "Usuários autenticados podem enviar mensagens" ON public.messages
    FOR INSERT 
    TO authenticated 
    WITH CHECK (sender_id = auth.uid());

-- Política para atualização de mensagens (apenas o autor ou admin)
CREATE POLICY "Autor ou admin podem atualizar mensagens" ON public.messages
    FOR UPDATE 
    TO authenticated 
    USING (
        sender_id = auth.uid() 
        OR EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND (
                (auth.users.raw_user_meta_data->>'role')::text = 'admin'
                OR auth.users.user_metadata->>'role' = 'admin'
            )
        )
    );

-- Política para exclusão de mensagens (apenas o autor ou admin)
CREATE POLICY "Autor ou admin podem excluir mensagens" ON public.messages
    FOR DELETE 
    TO authenticated 
    USING (
        sender_id = auth.uid() 
        OR EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND (
                (auth.users.raw_user_meta_data->>'role')::text = 'admin'
                OR auth.users.user_metadata->>'role' = 'admin'
            )
        )
    );

-- =====================================================
-- TABELA: events (Eventos do Calendário)
-- =====================================================

-- Habilitar RLS na tabela events
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Política para leitura de eventos (todos os usuários autenticados podem ler)
CREATE POLICY "Usuários autenticados podem ler eventos" ON public.events
    FOR SELECT 
    TO authenticated 
    USING (true);

-- Política para criação de eventos (apenas admin e psicólogos)
CREATE POLICY "Admin e psicólogos podem criar eventos" ON public.events
    FOR INSERT 
    TO authenticated 
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND (
                (auth.users.raw_user_meta_data->>'role')::text IN ('admin', 'psicologo')
                OR auth.users.user_metadata->>'role' IN ('admin', 'psicologo')
            )
        )
    );

-- Política para atualização de eventos (apenas admin e psicólogos)
CREATE POLICY "Admin e psicólogos podem atualizar eventos" ON public.events
    FOR UPDATE 
    TO authenticated 
    USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND (
                (auth.users.raw_user_meta_data->>'role')::text IN ('admin', 'psicologo')
                OR auth.users.user_metadata->>'role' IN ('admin', 'psicologo')
            )
        )
    );

-- Política para exclusão de eventos (apenas admin)
CREATE POLICY "Apenas admin pode excluir eventos" ON public.events
    FOR DELETE 
    TO authenticated 
    USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND (
                (auth.users.raw_user_meta_data->>'role')::text = 'admin'
                OR auth.users.user_metadata->>'role' = 'admin'
            )
        )
    );

-- =====================================================
-- TABELA: users (Perfis de Usuários)
-- =====================================================

-- Habilitar RLS na tabela users (se existir uma tabela de perfis personalizada)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Política para leitura de perfis (usuários podem ver todos os perfis)
CREATE POLICY "Usuários autenticados podem ler perfis" ON public.users
    FOR SELECT 
    TO authenticated 
    USING (true);

-- Política para atualização de perfis (usuários podem atualizar apenas seu próprio perfil ou admin pode atualizar qualquer um)
CREATE POLICY "Usuários podem atualizar seu próprio perfil" ON public.users
    FOR UPDATE 
    TO authenticated 
    USING (
        id = auth.uid() 
        OR EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND (
                (auth.users.raw_user_meta_data->>'role')::text = 'admin'
                OR auth.users.user_metadata->>'role' = 'admin'
            )
        )
    );

-- Política para criação de perfis (apenas admin pode criar novos usuários)
CREATE POLICY "Apenas admin pode criar usuários" ON public.users
    FOR INSERT 
    TO authenticated 
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND (
                (auth.users.raw_user_meta_data->>'role')::text = 'admin'
                OR auth.users.user_metadata->>'role' = 'admin'
            )
        )
    );

-- =====================================================
-- STORAGE: Políticas para o bucket de documentos
-- =====================================================

-- Política para leitura de arquivos no storage (todos os usuários autenticados podem ler)
CREATE POLICY "Usuários autenticados podem ler arquivos" ON storage.objects
    FOR SELECT 
    TO authenticated 
    USING (bucket_id = 'documents');

-- Política para upload de arquivos no storage (todos os usuários autenticados podem fazer upload)
CREATE POLICY "Usuários autenticados podem fazer upload" ON storage.objects
    FOR INSERT 
    TO authenticated 
    WITH CHECK (
        bucket_id = 'documents' 
        AND (storage.foldername(name))[1] = auth.uid()::text
    );

-- Política para atualização de arquivos no storage (apenas o proprietário)
CREATE POLICY "Proprietário pode atualizar arquivos" ON storage.objects
    FOR UPDATE 
    TO authenticated 
    USING (
        bucket_id = 'documents' 
        AND (storage.foldername(name))[1] = auth.uid()::text
    );

-- Política para exclusão de arquivos no storage (apenas o proprietário ou admin)
CREATE POLICY "Proprietário ou admin podem excluir arquivos" ON storage.objects
    FOR DELETE 
    TO authenticated 
    USING (
        bucket_id = 'documents' 
        AND (
            (storage.foldername(name))[1] = auth.uid()::text
            OR EXISTS (
                SELECT 1 FROM auth.users 
                WHERE auth.users.id = auth.uid() 
                AND (
                    (auth.users.raw_user_meta_data->>'role')::text = 'admin'
                    OR auth.users.user_metadata->>'role' = 'admin'
                )
            )
        )
    );

-- =====================================================
-- INSTRUÇÕES DE USO
-- =====================================================

/*
INSTRUÇÕES PARA APLICAR ESTAS POLÍTICAS:

1. Acesse o painel do Supabase (https://supabase.com/dashboard)
2. Selecione seu projeto
3. Vá para "SQL Editor" no menu lateral
4. Cole este script completo
5. Execute o script clicando em "Run"

IMPORTANTE:
- Certifique-se de que as tabelas mencionadas existem no seu banco
- Ajuste os nomes das tabelas se necessário
- Verifique se o campo 'role' está sendo armazenado corretamente nos metadados do usuário
- Teste cada funcionalidade após aplicar as políticas

VERIFICAÇÃO:
Após aplicar as políticas, teste:
1. Login com o usuário vitor.dev25@gmail.com
2. Acesso às páginas de avisos, documentos, enquetes, etc.
3. Criação, edição e exclusão de conteúdo conforme as permissões

Se alguma tabela não existir, você receberá um erro. Neste caso, comente ou remova as políticas para essas tabelas específicas.
*/