-- Create or fix RPC to delete a user profile by id
-- Ensures correct column (id) and grants execute to authenticated
-- Created: 2025-10-09

CREATE OR REPLACE FUNCTION public.delete_user_profile_simple(user_id UUID)
RETURNS JSON
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  result JSON;
BEGIN
  -- Validate parameter
  IF user_id IS NULL THEN
    RAISE EXCEPTION 'Parâmetro obrigatório: user_id';
  END IF;

  -- Delete profile by primary key id
  DELETE FROM public.user_profiles WHERE id = user_id;

  -- Check if anything was deleted
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Usuário não encontrado';
  END IF;

  -- Return success JSON
  result := json_build_object(
    'success', true,
    'message', 'Perfil excluído com sucesso',
    'user_id', user_id
  );

  RETURN result;
END;
$$;

GRANT EXECUTE ON FUNCTION public.delete_user_profile_simple(UUID) TO authenticated;