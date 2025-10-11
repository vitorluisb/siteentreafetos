-- Adicionar campo sender_avatar_url na tabela messages
ALTER TABLE public.messages 
ADD COLUMN IF NOT EXISTS sender_avatar_url TEXT;

COMMENT ON COLUMN public.messages.sender_avatar_url IS 'URL do avatar do remetente da mensagem';

