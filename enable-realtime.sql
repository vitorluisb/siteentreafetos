-- =====================================================
-- HABILITAR REALTIME PARA TABELAS - Entre Afetos
-- Execute no SQL Editor do Supabase
-- =====================================================

-- Verificar se Realtime está habilitado
SELECT 
    schemaname, 
    tablename,
    (SELECT count(*) FROM pg_publication_tables WHERE tablename = t.tablename) > 0 as realtime_enabled
FROM pg_tables t
WHERE schemaname = 'public' 
    AND tablename IN ('messages', 'notices', 'events', 'documents', 'polls', 'poll_votes')
ORDER BY tablename;

-- Habilitar Realtime para a tabela messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;

-- Habilitar Realtime para outras tabelas (opcional)
ALTER PUBLICATION supabase_realtime ADD TABLE public.notices;
ALTER PUBLICATION supabase_realtime ADD TABLE public.events;

-- Verificar novamente
SELECT 
    schemaname, 
    tablename,
    (SELECT count(*) FROM pg_publication_tables WHERE tablename = t.tablename) > 0 as realtime_enabled
FROM pg_tables t
WHERE schemaname = 'public' 
    AND tablename IN ('messages', 'notices', 'events')
ORDER BY tablename;
