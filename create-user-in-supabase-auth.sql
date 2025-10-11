-- ========================================
-- SCRIPT PARA CRIAR USUÁRIO NO SUPABASE AUTH
-- ========================================
-- Este script mostra como criar usuários no Supabase Auth
-- usando o UUID gerado pelo sistema de perfis
-- ========================================

-- 1. Verificar perfis existentes
SELECT 
  id,
  email,
  full_name,
  role,
  created_at
FROM public.user_profiles 
ORDER BY created_at DESC;

-- 2. Exemplo de como criar usuário no Supabase Auth via SQL
-- (Nota: Isso deve ser feito via Dashboard ou API)

-- Para criar via Dashboard do Supabase:
-- 1. Vá para Authentication > Users
-- 2. Clique em "Add user"
-- 3. Use o UUID da tabela user_profiles
-- 4. Defina email e senha
-- 5. Adicione metadata: {"role": "user", "name": "Nome Completo"}

-- 3. Função para sincronizar perfil com auth.users (quando usuário for criado)
CREATE OR REPLACE FUNCTION sync_user_profile_with_auth()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Quando um usuário for criado no auth.users,
  -- atualizar o perfil correspondente se existir
  IF TG_OP = 'INSERT' THEN
    UPDATE public.user_profiles 
    SET 
      email = NEW.email,
      updated_at = NOW()
    WHERE id = NEW.id;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- 4. Trigger para sincronizar automaticamente
DROP TRIGGER IF EXISTS sync_user_profile_trigger ON auth.users;
CREATE TRIGGER sync_user_profile_trigger
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION sync_user_profile_with_auth();

-- ========================================
-- INSTRUÇÕES PARA CRIAR USUÁRIO:
-- ========================================
-- 
-- 1. EXECUTE ESTE SQL para ver os perfis criados
-- 2. COPIE o UUID do perfil que deseja ativar
-- 3. VÁ para Supabase Dashboard > Authentication > Users
-- 4. CLIQUE em "Add user"
-- 5. PREENCHA:
--    - User ID: [UUID copiado]
--    - Email: [email do perfil]
--    - Password: [senha desejada]
--    - Raw user meta data: {"role": "user", "name": "Nome Completo"}
-- 6. CLIQUE em "Create user"
-- 7. TESTE o login com email/senha
-- 
-- ========================================
