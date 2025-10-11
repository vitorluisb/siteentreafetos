-- ========================================
-- SISTEMA AUTOMÁTICO VIA EDGE FUNCTION
-- ========================================
-- Este script prepara o banco para trabalhar com Edge Functions
-- ========================================

-- 1. Limpar funções existentes
DROP FUNCTION IF EXISTS get_user_profiles_for_admin();
DROP FUNCTION IF EXISTS create_user_profile_simple(TEXT, TEXT, TEXT, TEXT);
DROP FUNCTION IF EXISTS update_user_profile_simple(UUID, TEXT, TEXT, TEXT);
DROP FUNCTION IF EXISTS delete_user_profile_simple(UUID);

-- 2. Garantir que a tabela user_profiles tem o campo email
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS email TEXT;

-- 3. Função para listar usuários
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

-- 4. Função para criar perfil (será chamada pela Edge Function)
CREATE OR REPLACE FUNCTION create_user_profile_for_edge_function(
  user_id UUID,
  user_email TEXT,
  user_full_name TEXT,
  user_role TEXT DEFAULT 'user'
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSON;
BEGIN
  -- Validar parâmetros
  IF user_id IS NULL OR user_email IS NULL OR user_full_name IS NULL THEN
    RAISE EXCEPTION 'Parâmetros obrigatórios: user_id, email, full_name';
  END IF;

  -- Validar role
  IF user_role NOT IN ('admin', 'user') THEN
    RAISE EXCEPTION 'Role deve ser admin ou user';
  END IF;

  -- Verificar se email já existe
  IF EXISTS (SELECT 1 FROM public.user_profiles WHERE email = user_email) THEN
    RAISE EXCEPTION 'Email já está em uso';
  END IF;

  -- Inserir perfil
  INSERT INTO public.user_profiles (id, email, full_name, role, display_name)
  VALUES (user_id, user_email, user_full_name, user_role, user_full_name);

  -- Retornar resultado
  result := json_build_object(
    'success', true,
    'message', 'Perfil criado com sucesso',
    'user_id', user_id,
    'email', user_email,
    'full_name', user_full_name,
    'role', user_role
  );

  RETURN result;
END;
$$;

-- 5. Função para atualizar perfil
CREATE OR REPLACE FUNCTION update_user_profile_simple(
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
  -- Validar parâmetros
  IF user_id IS NULL OR user_email IS NULL OR user_full_name IS NULL THEN
    RAISE EXCEPTION 'Parâmetros obrigatórios: user_id, email, full_name';
  END IF;

  -- Validar role
  IF user_role IS NOT NULL AND user_role NOT IN ('admin', 'user') THEN
    RAISE EXCEPTION 'Role deve ser admin ou user';
  END IF;

  -- Atualizar perfil
  UPDATE public.user_profiles
  SET 
    email = user_email,
    full_name = user_full_name,
    role = COALESCE(user_role, role),
    display_name = user_full_name,
    updated_at = NOW()
  WHERE id = user_id;

  -- Verificar se atualizou
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Usuário não encontrado';
  END IF;

  -- Retornar resultado
  result := json_build_object(
    'success', true,
    'message', 'Perfil atualizado com sucesso',
    'user_id', user_id,
    'email', user_email,
    'full_name', user_full_name,
    'role', COALESCE(user_role, 'user')
  );

  RETURN result;
END;
$$;

-- 6. Função para excluir perfil
CREATE OR REPLACE FUNCTION delete_user_profile_simple(user_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSON;
BEGIN
  -- Validar parâmetros
  IF user_id IS NULL THEN
    RAISE EXCEPTION 'Parâmetro obrigatório: user_id';
  END IF;

  -- Excluir perfil
  DELETE FROM public.user_profiles WHERE id = user_id;

  -- Verificar se excluiu
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Usuário não encontrado';
  END IF;

  -- Retornar resultado
  result := json_build_object(
    'success', true,
    'message', 'Perfil excluído com sucesso',
    'user_id', user_id
  );

  RETURN result;
END;
$$;

-- 7. Conceder permissões
GRANT EXECUTE ON FUNCTION get_user_profiles_for_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION create_user_profile_for_edge_function(UUID, TEXT, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION update_user_profile_simple(UUID, TEXT, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION delete_user_profile_simple(UUID) TO authenticated;

-- ========================================
-- ✅ EXECUTE ESTE SQL NO SUPABASE:
--    Dashboard → SQL Editor → Colar e executar
-- ========================================
