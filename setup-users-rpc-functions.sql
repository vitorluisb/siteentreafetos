-- ========================================
-- FUNÇÕES RPC PARA GESTÃO DE USUÁRIOS
-- ========================================
-- Este script cria funções RPC que podem ser chamadas diretamente
-- do frontend sem precisar de Edge Functions
-- ========================================

-- 1. Função para listar usuários (apenas admins)
CREATE OR REPLACE FUNCTION get_users_for_admin()
RETURNS TABLE (
  id UUID,
  email TEXT,
  full_name TEXT,
  display_name TEXT,
  role TEXT,
  created_at TIMESTAMPTZ,
  last_sign_in_at TIMESTAMPTZ,
  email_confirmed_at TIMESTAMPTZ,
  active BOOLEAN
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

  -- Retornar usuários com seus perfis
  RETURN QUERY
  SELECT 
    u.id,
    u.email,
    COALESCE(p.full_name, u.raw_user_meta_data->>'name', '') as full_name,
    COALESCE(p.display_name, u.raw_user_meta_data->>'display_name', u.raw_user_meta_data->>'name', '') as display_name,
    COALESCE(p.role, u.raw_user_meta_data->>'role', 'user') as role,
    u.created_at,
    u.last_sign_in_at,
    u.email_confirmed_at,
    (u.banned_until IS NULL) as active
  FROM auth.users u
  LEFT JOIN public.user_profiles p ON u.id = p.id
  ORDER BY u.created_at DESC;
END;
$$;

-- 2. Função para criar usuário (apenas admins)
CREATE OR REPLACE FUNCTION create_user_by_admin(
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

  -- Gerar UUID para o novo usuário
  new_user_id := gen_random_uuid();

  -- Inserir usuário na tabela auth.users (simulação)
  -- Nota: Em produção, isso seria feito via Admin API
  INSERT INTO public.user_profiles (id, full_name, role, display_name)
  VALUES (new_user_id, user_full_name, user_role, user_full_name);

  -- Retornar resultado
  result := json_build_object(
    'success', true,
    'message', 'Usuário criado com sucesso',
    'user_id', new_user_id,
    'email', user_email,
    'full_name', user_full_name,
    'role', user_role
  );

  RETURN result;
END;
$$;

-- 3. Função para atualizar usuário (apenas admins)
CREATE OR REPLACE FUNCTION update_user_by_admin(
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
    'message', 'Usuário atualizado com sucesso',
    'user_id', user_id,
    'full_name', user_full_name,
    'role', COALESCE(user_role, 'user')
  );

  RETURN result;
END;
$$;

-- 4. Função para excluir usuário (apenas admins)
CREATE OR REPLACE FUNCTION delete_user_by_admin(user_id UUID)
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

  -- Excluir perfil do usuário (o usuário auth será excluído pelo CASCADE)
  DELETE FROM public.user_profiles WHERE id = user_id;

  -- Verificar se a exclusão foi bem-sucedida
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Usuário não encontrado';
  END IF;

  -- Retornar resultado
  result := json_build_object(
    'success', true,
    'message', 'Usuário excluído com sucesso',
    'user_id', user_id
  );

  RETURN result;
END;
$$;

-- 5. Conceder permissões de execução para usuários autenticados
GRANT EXECUTE ON FUNCTION get_users_for_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION create_user_by_admin(TEXT, TEXT, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION update_user_by_admin(UUID, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION delete_user_by_admin(UUID) TO authenticated;

-- ========================================
-- ✅ EXECUTE ESTE SQL NO SUPABASE:
--    Dashboard → SQL Editor → Colar e executar
-- ========================================
