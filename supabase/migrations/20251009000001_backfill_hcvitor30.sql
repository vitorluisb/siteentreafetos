-- Backfill profile for specific email if missing
INSERT INTO public.user_profiles (id, email, full_name, display_name, role)
SELECT u.id,
       u.email,
       COALESCE(u.raw_user_meta_data->>'full_name', split_part(u.email, '@', 1)) AS full_name,
       COALESCE(u.raw_user_meta_data->>'display_name', split_part(u.email, '@', 1)) AS display_name,
       COALESCE(u.raw_user_meta_data->>'role', 'user') AS role
FROM auth.users u
WHERE lower(u.email) = 'hcvitor30@gmail.com'
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  display_name = EXCLUDED.display_name,
  role = EXCLUDED.role;