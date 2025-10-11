-- ========================================
-- FUNÇÕES RPC SIMPLIFICADAS - APENAS ADMIN E USER
-- ========================================
-- Esta versão remove a função psicologo e mantém apenas admin e user
-- ========================================

-- 1. Remover funções existentes
DROP FUNCTION IF EXISTS get_user_profiles_for_admin();
DROP FUNCTION IF EXISTS create_user_profile_by_admin(TEXT, TEXT, TEXT, TEXT);
DROP FUNCTION IF EXISTS update_user_profile_by_admin(UUID, TEXT, TEXT);
DROP FUNCTION IF EXISTS delete_user_profile_by_admin(UUID);

-- 2. Atualizar tabela user_profiles para aceitar apenas admin e user
ALTER TABLE public.user_profiles 
DROP CONSTRAINT IF EXISTS user_profiles_role_check;

ALTER TABLE public.user_profiles 
ADD CONSTRAINT user_profiles_role_check 
CHECK (role IN ('admin', 'user'));

-- 3. Função simplificada para listar perfis de usuários
CREATE OR REPLACE FUNCTION get_user_profiles_for_admin()
RETURNS TABLE (
  id UUID,
  full_name TEXT,
  display_name TEXT,
  role TEXT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
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

  -- Retornar perfis de usuários
  RETURN QUERY
  SELECT 
    p.id,
    p.full_name,
    p.display_name,
    p.role,
    p.created_at,
    p.updated_at
  FROM public.user_profiles p
  ORDER BY p.created_at DESC;
END;
$$;

-- 4. Função para criar perfil de usuário
CREATE OR REPLACE FUNCTION create_user_profile_by_admin(
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

  -- Validar role (apenas admin ou user)
  IF user_role NOT IN ('admin', 'user') THEN
    RAISE EXCEPTION 'Role deve ser admin ou user';
  END IF;

  -- Gerar UUID para o novo usuário
  new_user_id := gen_random_uuid();

  -- Inserir perfil do usuário
  INSERT INTO public.user_profiles (id, full_name, role, display_name)
  VALUES (new_user_id, user_full_name, user_role, user_full_name);

  -- Retornar resultado
  result := json_build_object(
    'success', true,
    'message', 'Perfil criado. Crie o usuário no Supabase Auth com este ID: ' || new_user_id,
    'user_id', new_user_id,
    'email', user_email,
    'full_name', user_full_name,
    'role', user_role
  );

  RETURN result;
END;
$$;

-- 5. Função para atualizar perfil de usuário
CREATE OR REPLACE FUNCTION update_user_profile_by_admin(
  user_id UUID,
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
  IF user_id IS NULL OR user_full_name IS NULL THEN
    RAISE EXCEPTION 'Parâmetros obrigatórios: user_id, full_name';
  END IF;

  -- Validar role se fornecido
  IF user_role IS NOT NULL AND user_role NOT IN ('admin', 'user') THEN
    RAISE EXCEPTION 'Role deve ser admin ou user';
  END IF;

  -- Atualizar perfil do usuário
  UPDATE public.user_profiles
  SET 
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
    'message', 'Perfil atualizado com sucesso',
    'user_id', user_id,
    'full_name', user_full_name,
    'role', COALESCE(user_role, 'user')
  );

  RETURN result;
END;
$$;

-- 6. Função para excluir perfil de usuário
CREATE OR REPLACE FUNCTION delete_user_profile_by_admin(user_id UUID)
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

  -- Excluir perfil do usuário
  DELETE FROM public.user_profiles WHERE id = user_id;

  -- Verificar se a exclusão foi bem-sucedida
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Usuário não encontrado';
  END IF;

  -- Retornar resultado
  result := json_build_object(
    'success', true,
    'message', 'Perfil excluído. Exclua o usuário no Supabase Auth manualmente.',
    'user_id', user_id
  );

  RETURN result;
END;
$$;

-- 7. Conceder permissões de execução para usuários autenticados
GRANT EXECUTE ON FUNCTION get_user_profiles_for_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION create_user_profile_by_admin(TEXT, TEXT, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION update_user_profile_by_admin(UUID, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION delete_user_profile_by_admin(UUID) TO authenticated;

-- ========================================
-- ✅ EXECUTE ESTE SQL NO SUPABASE:
--    Dashboard → SQL Editor → Colar e executar
-- ========================================
