-- ========================================
-- CORREÇÃO: FUNÇÕES RPC DE PRESENÇA
-- ========================================
-- Execute este script no Supabase SQL Editor
-- Dashboard → SQL Editor → Cole e execute
-- ========================================

-- 1. Criar tabela de presença se não existir
CREATE TABLE IF NOT EXISTS public.user_presence (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  is_online BOOLEAN DEFAULT false,
  last_seen TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Habilitar RLS
ALTER TABLE public.user_presence ENABLE ROW LEVEL SECURITY;

-- 3. Políticas RLS
DROP POLICY IF EXISTS "Authenticated users can view presence" ON public.user_presence;
CREATE POLICY "Authenticated users can view presence" ON public.user_presence
FOR SELECT TO authenticated
USING (true);

DROP POLICY IF EXISTS "Users can update own presence" ON public.user_presence;
CREATE POLICY "Users can update own presence" ON public.user_presence
FOR ALL TO authenticated
USING (auth.uid() = id);

-- 4. FUNÇÃO: update_user_presence
CREATE OR REPLACE FUNCTION public.update_user_presence(user_id UUID, online_status BOOLEAN)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.user_presence (id, is_online, last_seen, updated_at)
  VALUES (user_id, online_status, NOW(), NOW())
  ON CONFLICT (id) 
  DO UPDATE SET 
    is_online = online_status,
    last_seen = CASE WHEN online_status THEN NOW() ELSE user_presence.last_seen END,
    updated_at = NOW();
END;
$$;

-- 5. FUNÇÃO: get_online_users
CREATE OR REPLACE FUNCTION public.get_online_users()
RETURNS TABLE (
  id UUID,
  full_name TEXT,
  display_name TEXT,
  role TEXT,
  avatar_url TEXT,
  is_online BOOLEAN,
  last_seen TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Verificar se o usuário atual é admin
  IF NOT EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = auth.uid() 
    AND (auth.users.raw_user_meta_data->>'role' = 'admin' 
         OR auth.users.user_metadata->>'role' = 'admin')
  ) THEN
    RAISE EXCEPTION 'Acesso negado: apenas administradores podem ver usuários online';
  END IF;

  -- Retornar usuários online com seus perfis
  RETURN QUERY
  SELECT 
    up.id,
    up.full_name,
    up.display_name,
    up.role,
    up.avatar_url,
    COALESCE(pr.is_online, false) as is_online,
    COALESCE(pr.last_seen, up.created_at) as last_seen
  FROM public.user_profiles up
  LEFT JOIN public.user_presence pr ON up.id = pr.id
  WHERE COALESCE(pr.is_online, false) = true
  ORDER BY pr.last_seen DESC;
END;
$$;

-- 6. FUNÇÃO: cleanup_offline_users
CREATE OR REPLACE FUNCTION public.cleanup_offline_users()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.user_presence 
  SET is_online = false, updated_at = NOW()
  WHERE is_online = true 
    AND updated_at < NOW() - INTERVAL '5 minutes';
END;
$$;

-- 7. Trigger para timestamp
CREATE OR REPLACE FUNCTION public.update_presence_timestamp()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS update_user_presence_timestamp ON public.user_presence;
CREATE TRIGGER update_user_presence_timestamp
  BEFORE UPDATE ON public.user_presence
  FOR EACH ROW
  EXECUTE FUNCTION public.update_presence_timestamp();

-- 8. Habilitar Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_presence;

-- 9. Conceder permissões
GRANT SELECT, INSERT, UPDATE ON public.user_presence TO authenticated;
GRANT EXECUTE ON FUNCTION public.update_user_presence(UUID, BOOLEAN) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_online_users() TO authenticated;
GRANT EXECUTE ON FUNCTION public.cleanup_offline_users() TO authenticated;

-- 10. Testar as funções
SELECT 'Funções criadas com sucesso!' as status;

-- ========================================
-- INSTRUÇÕES:
-- 1. Copie todo este script
-- 2. Vá para Supabase Dashboard → SQL Editor
-- 3. Cole o script e execute
-- 4. Verifique se aparece "Funções criadas com sucesso!"
-- ========================================