-- ========================================
-- ADICIONAR INFORMAÇÕES DO REMETENTE NA TABELA MESSAGES
-- ========================================
-- Este script adiciona os campos sender_name e sender_role
-- para que as mensagens do chat possam exibir o nome correto
-- sem precisar fazer joins ou consultas adicionais.
-- ========================================

-- Adicionar coluna sender_name (nome de exibição do remetente)
ALTER TABLE public.messages 
ADD COLUMN IF NOT EXISTS sender_name TEXT;

-- Adicionar coluna sender_role (role do remetente: admin/user)
ALTER TABLE public.messages 
ADD COLUMN IF NOT EXISTS sender_role TEXT DEFAULT 'user';

-- Criar índice para melhorar performance de consultas
CREATE INDEX IF NOT EXISTS idx_messages_sender_name 
ON public.messages(sender_name);

-- Comentários para documentação
COMMENT ON COLUMN public.messages.sender_name IS 'Nome de exibição do remetente (display_name ou name)';
COMMENT ON COLUMN public.messages.sender_role IS 'Role do remetente (admin ou user)';

-- ========================================
-- ✅ EXECUTE ESTE SQL NO SUPABASE:
--    Dashboard → SQL Editor → Colar e executar
-- ========================================

