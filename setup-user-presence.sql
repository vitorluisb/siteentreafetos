-- ========================================
-- SISTEMA DE PRESENÇA DE USUÁRIOS
-- ========================================
-- Este arquivo configura o sistema de rastreamento de presença
-- para exibir usuários online na dashboard
-- ========================================

-- 1. Criar tabela de presença de usuários
CREATE TABLE IF NOT EXISTS public.user_presence (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  is_online BOOLEAN DEFAULT false,
  last_seen TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Habilitar RLS na tabela user_presence
ALTER TABLE public.user_presence ENABLE ROW LEVEL SECURITY;

-- 3. Políticas RLS para user_presence
-- Todos os usuários autenticados podem ver quem está online
CREATE POLICY "Authenticated users can view presence" ON public.user_presence
FOR SELECT TO authenticated
USING (true);

-- Usuários podem atualizar sua própria presença
CREATE POLICY "Users can update own presence" ON public.user_presence
FOR ALL TO authenticated
USING (auth.uid() = id);

-- 4. Função para atualizar presença do usuário
CREATE OR REPLACE FUNCTION update_user_presence(user_id UUID, online_status BOOLEAN)
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

-- 5. Função para obter usuários online (para admins)
CREATE OR REPLACE FUNCTION get_online_users()
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

-- 6. Função para limpar usuários offline (executar periodicamente)
CREATE OR REPLACE FUNCTION cleanup_offline_users()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Marcar como offline usuários que não atualizaram presença há mais de 5 minutos
  UPDATE public.user_presence 
  SET is_online = false, updated_at = NOW()
  WHERE is_online = true 
    AND updated_at < NOW() - INTERVAL '5 minutes';
END;
$$;

-- 7. Trigger para atualizar timestamp automaticamente
CREATE OR REPLACE FUNCTION update_presence_timestamp()
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
  EXECUTE FUNCTION update_presence_timestamp();

-- 8. Habilitar Realtime para a tabela user_presence
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_presence;

-- 9. Conceder permissões
GRANT SELECT, INSERT, UPDATE ON public.user_presence TO authenticated;
GRANT EXECUTE ON FUNCTION update_user_presence(UUID, BOOLEAN) TO authenticated;
GRANT EXECUTE ON FUNCTION get_online_users() TO authenticated;
GRANT EXECUTE ON FUNCTION cleanup_offline_users() TO authenticated;

-- 10. Comentários para documentação
COMMENT ON TABLE public.user_presence IS 'Tabela para rastrear presença online dos usuários';
COMMENT ON COLUMN public.user_presence.is_online IS 'Indica se o usuário está online no momento';
COMMENT ON COLUMN public.user_presence.last_seen IS 'Última vez que o usuário foi visto online';
COMMENT ON COLUMN public.user_presence.updated_at IS 'Timestamp da última atualização de presença';