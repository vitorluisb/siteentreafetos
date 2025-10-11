-- ====================================================
-- CONFIGURAÇÃO MÍNIMA DE AVATARES
-- Execute este SQL primeiro para testar
-- ====================================================

-- 1. ADICIONAR CAMPOS NAS TABELAS
-- ====================================================

-- Adicionar avatar_url na tabela user_profiles
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS avatar_url TEXT;

COMMENT ON COLUMN public.user_profiles.avatar_url IS 'URL da foto de perfil do usuário';

-- Adicionar sender_avatar_url na tabela messages
ALTER TABLE public.messages 
ADD COLUMN IF NOT EXISTS sender_avatar_url TEXT;

COMMENT ON COLUMN public.messages.sender_avatar_url IS 'URL do avatar do remetente da mensagem';

-- 2. CRIAR BUCKET DE AVATARES (se não existir)
-- ====================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 3. ATUALIZAR RPC FUNCTION PARA INCLUIR AVATAR
-- ====================================================

-- Deletar a função antiga primeiro
DROP FUNCTION IF EXISTS get_user_profiles_for_admin();

-- Criar a nova versão com avatar_url
CREATE OR REPLACE FUNCTION get_user_profiles_for_admin()
RETURNS TABLE (
  id UUID,
  email TEXT,
  full_name TEXT,
  display_name TEXT,
  role TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ,
  auth_exists BOOLEAN
) 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    up.user_id as id,
    up.email,
    up.full_name,
    up.display_name,
    up.role,
    up.avatar_url,
    up.created_at,
    EXISTS(SELECT 1 FROM auth.users WHERE id = up.user_id) as auth_exists
  FROM user_profiles up
  ORDER BY up.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- 4. CONFIGURAR POLÍTICAS RLS BÁSICAS PARA STORAGE
-- ====================================================

-- Remover políticas antigas se existirem
DROP POLICY IF EXISTS "Users can upload their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view avatars" ON storage.objects;

-- Permitir upload
CREATE POLICY "Users can upload their own avatar"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'avatars');

-- Permitir atualização
CREATE POLICY "Users can update their own avatar"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'avatars');

-- Permitir deleção
CREATE POLICY "Users can delete their own avatar"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'avatars');

-- Permitir visualização pública
CREATE POLICY "Anyone can view avatars"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'avatars');

-- ====================================================
-- PRONTO! Agora teste o upload de avatar
-- ====================================================

