-- ========================================
-- CONFIGURAÇÃO PARA GESTÃO DE USUÁRIOS (VERSÃO SEGURA)
-- ========================================
-- Este script apenas remove políticas duplicadas sem apagar dados
-- ========================================

-- 1. Remover políticas existentes (se existirem)
DROP POLICY IF EXISTS "Admins can view all user profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins can insert user profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins can update user profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins can delete user profiles" ON public.user_profiles;

-- 2. Recriar políticas RLS
CREATE POLICY "Admins can view all user profiles" ON public.user_profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

CREATE POLICY "Users can view own profile" ON public.user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can insert user profiles" ON public.user_profiles
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

CREATE POLICY "Admins can update user profiles" ON public.user_profiles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

CREATE POLICY "Admins can delete user profiles" ON public.user_profiles
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- ========================================
-- ✅ EXECUTE ESTE SQL NO SUPABASE:
--    Dashboard → SQL Editor → Colar e executar
-- ========================================
