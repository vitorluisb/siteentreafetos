-- Expand user listing to include all Auth users, even without profiles
-- Created: 2025-10-09

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
    au.id,
    COALESCE(up.email, au.email),
    COALESCE(up.full_name, au.raw_user_meta_data->>'name', ''),
    COALESCE(up.display_name, au.raw_user_meta_data->>'display_name', ''),
    COALESCE(up.role, au.raw_user_meta_data->>'role', 'user'),
    up.avatar_url,
    COALESCE(up.created_at, au.created_at),
    TRUE as auth_exists
  FROM auth.users au
  LEFT JOIN public.user_profiles up ON up.id = au.id
  ORDER BY COALESCE(up.created_at, au.created_at) DESC;
END;
$$ LANGUAGE plpgsql;