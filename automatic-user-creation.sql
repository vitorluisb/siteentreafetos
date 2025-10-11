-- ========================================
-- SISTEMA AUTOMÁTICO - CRIAÇÃO DIRETA NO SUPABASE AUTH
-- ========================================
-- Este script cria usuários diretamente no Supabase Auth via RPC
-- sem necessidade de intervenção manual
-- ========================================

-- 1. Remover funções existentes
DROP FUNCTION IF EXISTS get_user_profiles_for_admin();
DROP FUNCTION IF EXISTS create_complete_user_by_admin(TEXT, TEXT, TEXT, TEXT);
DROP FUNCTION IF EXISTS update_user_profile_by_admin(UUID, TEXT, TEXT, TEXT);
DROP FUNCTION IF EXISTS delete_user_profile_by_admin(UUID);

-- 2. Adicionar campo email à tabela user_profiles (se não existir)
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS email TEXT;

-- 3. Atualizar constraint de role
ALTER TABLE public.user_profiles 
DROP CONSTRAINT IF EXISTS user_profiles_role_check;

ALTER TABLE public.user_profiles 
ADD CONSTRAINT user_profiles_role_check 
CHECK (role IN ('admin', 'user'));

-- 4. Função para listar perfis de usuários
CREATE OR REPLACE FUNCTION get_user_profiles_for_admin()
RETURNS TABLE (
  id UUID,
  email TEXT,
  full_name TEXT,
  display_name TEXT,
  role TEXT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  auth_exists BOOLEAN
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Verificar se o usuário atual é admin
  IF NOT EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = auth.uid() 
    AND auth.users.raw_user_meta_data->>'role' = 'admin'
  ) THEN
    RAISE EXCEPTION 'Acesso negado: apenas administradores podem listar usuários';
  END IF;

  -- Retornar perfis de usuários com status do auth
  RETURN QUERY
  SELECT 
    p.id,
    p.email,
    p.full_name,
    p.display_name,
    p.role,
    p.created_at,
    p.updated_at,
    EXISTS(SELECT 1 FROM auth.users WHERE auth.users.id = p.id) as auth_exists
  FROM public.user_profiles p
  ORDER BY p.created_at DESC;
END;
$$;

-- 5. Função para criar usuário AUTOMATICAMENTE no Supabase Auth
CREATE OR REPLACE FUNCTION create_user_automatically_by_admin(
  user_email TEXT,
  user_password TEXT,
  user_full_name TEXT,
  user_role TEXT DEFAULT 'user'
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_user_id UUID;
  result JSON;
BEGIN
  -- Verificar se o usuário atual é admin
  IF NOT EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = auth.uid() 
    AND auth.users.raw_user_meta_data->>'role' = 'admin'
  ) THEN
    RAISE EXCEPTION 'Acesso negado: apenas administradores podem criar usuários';
  END IF;

  -- Validar parâmetros
  IF user_email IS NULL OR user_password IS NULL OR user_full_name IS NULL THEN
    RAISE EXCEPTION 'Parâmetros obrigatórios: email, password, full_name';
  END IF;

  -- Validar role
  IF user_role NOT IN ('admin', 'user') THEN
    RAISE EXCEPTION 'Role deve ser admin ou user';
  END IF;

  -- Verificar se email já existe
  IF EXISTS (SELECT 1 FROM auth.users WHERE email = user_email) THEN
    RAISE EXCEPTION 'Email já está em uso';
  END IF;

  -- Gerar UUID para o novo usuário
  new_user_id := gen_random_uuid();

  -- Criar usuário diretamente no Supabase Auth
  INSERT INTO auth.users (
    id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_user_meta_data,
    raw_app_meta_data,
    is_super_admin,
    role
  ) VALUES (
    new_user_id,
    user_email,
    crypt(user_password, gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    json_build_object(
      'role', user_role,
      'name', user_full_name,
      'display_name', user_full_name
    ),
    json_build_object(
      'provider', 'email',
      'providers', json_build_array('email')
    ),
    false,
    'authenticated'
  );

  -- Inserir perfil do usuário
  INSERT INTO public.user_profiles (id, email, full_name, role, display_name)
  VALUES (new_user_id, user_email, user_full_name, user_role, user_full_name);

  -- Retornar resultado
  result := json_build_object(
    'success', true,
    'message', 'Usuário criado com sucesso! Pode fazer login imediatamente.',
    'user_id', new_user_id,
    'email', user_email,
    'full_name', user_full_name,
    'role', user_role
  );

  RETURN result;
END;
$$;

-- 6. Função para atualizar perfil de usuário
CREATE OR REPLACE FUNCTION update_user_profile_by_admin(
  user_id UUID,
  user_email TEXT,
  user_full_name TEXT,
  user_role TEXT
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSON;
BEGIN
  -- Verificar se o usuário atual é admin
  IF NOT EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = auth.uid() 
    AND auth.users.raw_user_meta_data->>'role' = 'admin'
  ) THEN
    RAISE EXCEPTION 'Acesso negado: apenas administradores podem atualizar usuários';
  END IF;

  -- Validar parâmetros
  IF user_id IS NULL OR user_email IS NULL OR user_full_name IS NULL THEN
    RAISE EXCEPTION 'Parâmetros obrigatórios: user_id, email, full_name';
  END IF;

  -- Validar role
  IF user_role IS NOT NULL AND user_role NOT IN ('admin', 'user') THEN
    RAISE EXCEPTION 'Role deve ser admin ou user';
  END IF;

  -- Verificar se email já existe em outro usuário
  IF EXISTS (SELECT 1 FROM auth.users WHERE email = user_email AND id != user_id) THEN
    RAISE EXCEPTION 'Email já está em uso por outro usuário';
  END IF;

  -- Atualizar usuário no Supabase Auth
  UPDATE auth.users
  SET 
    email = user_email,
    raw_user_meta_data = json_build_object(
      'role', COALESCE(user_role, (raw_user_meta_data->>'role')),
      'name', user_full_name,
      'display_name', user_full_name
    ),
    updated_at = NOW()
  WHERE id = user_id;

  -- Atualizar perfil do usuário
  UPDATE public.user_profiles
  SET 
    email = user_email,
    full_name = user_full_name,
    role = COALESCE(user_role, role),
    display_name = user_full_name,
    updated_at = NOW()
  WHERE id = user_id;

  -- Verificar se a atualização foi bem-sucedida
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Usuário não encontrado';
  END IF;

  -- Retornar resultado
  result := json_build_object(
    'success', true,
    'message', 'Usuário atualizado com sucesso',
    'user_id', user_id,
    'email', user_email,
    'full_name', user_full_name,
    'role', COALESCE(user_role, 'user')
  );

  RETURN result;
END;
$$;

-- 7. Função para excluir usuário COMPLETAMENTE
CREATE OR REPLACE FUNCTION delete_user_completely_by_admin(user_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSON;
BEGIN
  -- Verificar se o usuário atual é admin
  IF NOT EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = auth.uid() 
    AND auth.users.raw_user_meta_data->>'role' = 'admin'
  ) THEN
    RAISE EXCEPTION 'Acesso negado: apenas administradores podem excluir usuários';
  END IF;

  -- Validar parâmetros
  IF user_id IS NULL THEN
    RAISE EXCEPTION 'Parâmetro obrigatório: user_id';
  END IF;

  -- Não permitir que admin exclua a si mesmo
  IF user_id = auth.uid() THEN
    RAISE EXCEPTION 'Você não pode excluir sua própria conta';
  END IF;

  -- Excluir usuário do Supabase Auth
  DELETE FROM auth.users WHERE id = user_id;

  -- Excluir perfil do usuário
  DELETE FROM public.user_profiles WHERE id = user_id;

  -- Verificar se a exclusão foi bem-sucedida
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Usuário não encontrado';
  END IF;

  -- Retornar resultado
  result := json_build_object(
    'success', true,
    'message', 'Usuário excluído completamente do sistema',
    'user_id', user_id
  );

  RETURN result;
END;
$$;

-- 8. Conceder permissões
GRANT EXECUTE ON FUNCTION get_user_profiles_for_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION create_user_automatically_by_admin(TEXT, TEXT, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION update_user_profile_by_admin(UUID, TEXT, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION delete_user_completely_by_admin(UUID) TO authenticated;

-- ========================================
-- ✅ EXECUTE ESTE SQL NO SUPABASE:
--    Dashboard → SQL Editor → Colar e executar
-- ========================================
