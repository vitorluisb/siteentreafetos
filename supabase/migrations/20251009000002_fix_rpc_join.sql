-- Fix RPC join to use user_profiles.id instead of user_id
-- Created: 2025-10-09

CREATE OR REPLACE FUNCTION public.get_user_profiles_for_admin()
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
LANGUAGE sql
AS $$
  SELECT 
    u.id,
    COALESCE(p.email, u.email) AS email,
    COALESCE(p.full_name, u.raw_user_meta_data->>'name', '') AS full_name,
    COALESCE(p.display_name, u.raw_user_meta_data->>'display_name', '') AS display_name,
    COALESCE(p.role, u.raw_user_meta_data->>'role', 'user') AS role,
    p.avatar_url,
    COALESCE(p.created_at, u.created_at) AS created_at,
    TRUE AS auth_exists
  FROM auth.users u
  LEFT JOIN public.user_profiles p ON p.id = u.id
  ORDER BY COALESCE(p.created_at, u.created_at) DESC
$$;