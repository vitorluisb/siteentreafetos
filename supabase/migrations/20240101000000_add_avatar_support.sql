-- Migration: Add Avatar Support
-- Created: 2024-01-01

-- 1. CRIAR BUCKET DE AVATARES
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars', 
  'avatars', 
  true,
  2097152,
  ARRAY['image/*']::text[]
)
ON CONFLICT (id) DO UPDATE SET 
  public = true,
  file_size_limit = 2097152,
  allowed_mime_types = ARRAY['image/*']::text[];

-- 2. ADICIONAR CAMPOS NAS TABELAS
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS avatar_url TEXT;

ALTER TABLE public.messages 
ADD COLUMN IF NOT EXISTS sender_avatar_url TEXT;

-- 3. CONFIGURAR POLÍTICAS RLS PARA STORAGE
DROP POLICY IF EXISTS "Users can upload their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view avatars" ON storage.objects;

CREATE POLICY "Users can upload their own avatar"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can update their own avatar"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'avatars' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can delete their own avatar"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'avatars' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Anyone can view avatars"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'avatars');

-- 4. ATUALIZAR RPC FUNCTION
DROP FUNCTION IF EXISTS get_user_profiles_for_admin();

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

-- 5. CRIAR TRIGGER PARA SINCRONIZAR AVATAR
CREATE OR REPLACE FUNCTION sync_user_avatar()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.raw_user_meta_data ? 'avatar_url' THEN
    UPDATE public.user_profiles
    SET avatar_url = NEW.raw_user_meta_data->>'avatar_url'
    WHERE user_id = NEW.id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_avatar_updated ON auth.users;
CREATE TRIGGER on_auth_user_avatar_updated
  AFTER UPDATE OF raw_user_meta_data ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION sync_user_avatar();

