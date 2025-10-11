-- ========================================
-- CONFIGURAÇÃO PARA GESTÃO DE USUÁRIOS (VERSÃO LIMPA)
-- ========================================
-- Este script remove políticas existentes e recria tudo do zero
-- para evitar conflitos de políticas duplicadas
-- ========================================

-- 1. Remover políticas existentes (se existirem)
DROP POLICY IF EXISTS "Admins can view all user profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins can insert user profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins can update user profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins can delete user profiles" ON public.user_profiles;

-- 2. Remover triggers existentes (se existirem)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;

-- 3. Remover funções existentes (se existirem)
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.handle_user_update();

-- 4. Remover tabela existente (se existir) - CUIDADO: isso apaga dados!
DROP TABLE IF EXISTS public.user_profiles CASCADE;

-- 5. Criar tabela user_profiles novamente
CREATE TABLE public.user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'user', 'psicologo')),
  display_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Habilitar RLS na tabela user_profiles
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- 7. Criar políticas RLS
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

-- 8. Criar funções
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, full_name, role, display_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'role', 'user'),
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.handle_user_update()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.user_profiles
  SET 
    full_name = COALESCE(NEW.raw_user_meta_data->>'name', OLD.raw_user_meta_data->>'name'),
    role = COALESCE(NEW.raw_user_meta_data->>'role', OLD.raw_user_meta_data->>'role'),
    display_name = COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'name', OLD.raw_user_meta_data->>'name'),
    updated_at = NOW()
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 9. Criar triggers
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TRIGGER on_auth_user_updated
  AFTER UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_user_update();

-- 10. Criar índices
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON public.user_profiles(role);
CREATE INDEX IF NOT EXISTS idx_user_profiles_full_name ON public.user_profiles(full_name);

-- 11. Comentários para documentação
COMMENT ON TABLE public.user_profiles IS 'Perfis adicionais dos usuários do sistema';
COMMENT ON COLUMN public.user_profiles.full_name IS 'Nome completo do usuário';
COMMENT ON COLUMN public.user_profiles.role IS 'Função do usuário: admin, user ou psicologo';
COMMENT ON COLUMN public.user_profiles.display_name IS 'Nome de exibição preferido pelo usuário';

-- ========================================
-- ✅ EXECUTE ESTE SQL NO SUPABASE:
--    Dashboard → SQL Editor → Colar e executar
-- ========================================
