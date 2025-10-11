-- Adicionar campo avatar_url na tabela user_profiles
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Criar bucket de storage para avatares (executar via painel ou código)
-- Este comando deve ser executado via Supabase Dashboard em Storage > Create Bucket
-- Nome: avatars
-- Public: true (para permitir acesso às imagens)

-- Criar política de storage para permitir upload de avatares
-- Usuários podem fazer upload de sua própria foto
INSERT INTO storage.objects (bucket_id, name, owner, metadata)
SELECT 'avatars', '', auth.uid(), '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'avatars');

-- Políticas RLS para o bucket avatars
-- Permitir que usuários façam upload de suas próprias fotos
CREATE POLICY "Users can upload their own avatar"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Permitir que usuários atualizem suas próprias fotos
CREATE POLICY "Users can update their own avatar"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'avatars' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Permitir que usuários deletem suas próprias fotos
CREATE POLICY "Users can delete their own avatar"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'avatars' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Permitir que todos vejam as fotos (público)
CREATE POLICY "Anyone can view avatars"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'avatars');

-- Atualizar trigger para sincronizar avatar_url quando criar usuário
CREATE OR REPLACE FUNCTION sync_user_avatar()
RETURNS TRIGGER AS $$
BEGIN
  -- Se o usuário tem foto no user_metadata, sincronizar
  IF NEW.raw_user_meta_data ? 'avatar_url' THEN
    UPDATE public.user_profiles
    SET avatar_url = NEW.raw_user_meta_data->>'avatar_url'
    WHERE user_id = NEW.id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Criar trigger para atualização automática
DROP TRIGGER IF EXISTS on_auth_user_avatar_updated ON auth.users;
CREATE TRIGGER on_auth_user_avatar_updated
  AFTER UPDATE OF raw_user_meta_data ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION sync_user_avatar();

COMMENT ON COLUMN public.user_profiles.avatar_url IS 'URL da foto de perfil do usuário armazenada no Supabase Storage';

