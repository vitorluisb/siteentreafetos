-- =====================================================
-- SCRIPT DE RESET E SETUP COMPLETO - Entre Afetos
-- Este script vai DROPAR tudo e recriar do zero
-- Execute no SQL Editor do Supabase
-- =====================================================

-- ATENÇÃO: Isso vai APAGAR TODOS OS DADOS das tabelas!
-- Se você tem dados importantes, NÃO execute este script!

-- =====================================================
-- PASSO 1: DROPAR POLÍTICAS EXISTENTES
-- =====================================================

DROP POLICY IF EXISTS "Usuários autenticados podem ler avisos" ON public.notices;
DROP POLICY IF EXISTS "Admin e psicólogos podem criar avisos" ON public.notices;
DROP POLICY IF EXISTS "Admin e psicólogos podem atualizar avisos" ON public.notices;
DROP POLICY IF EXISTS "Apenas admin pode excluir avisos" ON public.notices;

DROP POLICY IF EXISTS "Usuários autenticados podem ler mensagens" ON public.messages;
DROP POLICY IF EXISTS "Usuários autenticados podem enviar mensagens" ON public.messages;
DROP POLICY IF EXISTS "Autor ou admin podem atualizar mensagens" ON public.messages;
DROP POLICY IF EXISTS "Autor ou admin podem excluir mensagens" ON public.messages;

DROP POLICY IF EXISTS "Usuários autenticados podem ler eventos" ON public.events;
DROP POLICY IF EXISTS "Admin e psicólogos podem criar eventos" ON public.events;
DROP POLICY IF EXISTS "Admin e psicólogos podem atualizar eventos" ON public.events;
DROP POLICY IF EXISTS "Apenas admin pode excluir eventos" ON public.events;

DROP POLICY IF EXISTS "Usuários autenticados podem ler documentos" ON public.documents;
DROP POLICY IF EXISTS "Usuários autenticados podem fazer upload de documentos" ON public.documents;
DROP POLICY IF EXISTS "Autor ou admin podem atualizar documentos" ON public.documents;
DROP POLICY IF EXISTS "Autor ou admin podem excluir documentos" ON public.documents;

DROP POLICY IF EXISTS "Usuários autenticados podem ler enquetes" ON public.polls;
DROP POLICY IF EXISTS "Admin e psicólogos podem criar enquetes" ON public.polls;
DROP POLICY IF EXISTS "Admin e psicólogos podem atualizar enquetes" ON public.polls;
DROP POLICY IF EXISTS "Apenas admin pode excluir enquetes" ON public.polls;

DROP POLICY IF EXISTS "Usuários autenticados podem ler votos" ON public.poll_votes;
DROP POLICY IF EXISTS "Usuários podem votar" ON public.poll_votes;
DROP POLICY IF EXISTS "Usuários podem alterar seus votos" ON public.poll_votes;

-- =====================================================
-- PASSO 2: DROPAR TABELAS (em ordem reversa de dependências)
-- =====================================================

DROP TABLE IF EXISTS public.poll_votes CASCADE;
DROP TABLE IF EXISTS public.poll_options CASCADE;
DROP TABLE IF EXISTS public.polls CASCADE;
DROP TABLE IF EXISTS public.documents CASCADE;
DROP TABLE IF EXISTS public.messages CASCADE;
DROP TABLE IF EXISTS public.events CASCADE;
DROP TABLE IF EXISTS public.notices CASCADE;

-- =====================================================
-- PASSO 3: RECRIAR TABELAS
-- =====================================================

-- Tabela: notices
CREATE TABLE public.notices (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    sector TEXT NOT NULL,
    author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela: messages
CREATE TABLE public.messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    content TEXT NOT NULL,
    sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela: events
CREATE TABLE public.events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    date TIMESTAMPTZ NOT NULL,
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ,
    location TEXT,
    color TEXT DEFAULT '#3182CE',
    all_day BOOLEAN DEFAULT FALSE,
    created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela: documents
CREATE TABLE public.documents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    file_url TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_size INTEGER,
    file_type TEXT,
    sector TEXT NOT NULL,
    uploaded_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela: polls
CREATE TABLE public.polls (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    question TEXT NOT NULL,
    description TEXT,
    author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    active BOOLEAN DEFAULT TRUE,
    multiple_choice BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    ends_at TIMESTAMPTZ
);

-- Tabela: poll_options
CREATE TABLE public.poll_options (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    poll_id UUID NOT NULL REFERENCES public.polls(id) ON DELETE CASCADE,
    option_text TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela: poll_votes
CREATE TABLE public.poll_votes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    poll_id UUID NOT NULL REFERENCES public.polls(id) ON DELETE CASCADE,
    option_id UUID NOT NULL REFERENCES public.poll_options(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(poll_id, user_id)
);

-- =====================================================
-- PASSO 4: HABILITAR RLS
-- =====================================================

ALTER TABLE public.notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.poll_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.poll_votes ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- PASSO 5: CRIAR POLÍTICAS SIMPLES (TEMPORÁRIAS PARA TESTE)
-- =====================================================

-- Políticas ABERTAS para teste (todos autenticados podem tudo)
-- Depois você aplica o script completo com políticas restritivas

-- NOTICES
CREATE POLICY "temp_select_notices" ON public.notices FOR SELECT TO authenticated USING (true);
CREATE POLICY "temp_insert_notices" ON public.notices FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "temp_update_notices" ON public.notices FOR UPDATE TO authenticated USING (true);
CREATE POLICY "temp_delete_notices" ON public.notices FOR DELETE TO authenticated USING (true);

-- MESSAGES
CREATE POLICY "temp_select_messages" ON public.messages FOR SELECT TO authenticated USING (true);
CREATE POLICY "temp_insert_messages" ON public.messages FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "temp_update_messages" ON public.messages FOR UPDATE TO authenticated USING (true);
CREATE POLICY "temp_delete_messages" ON public.messages FOR DELETE TO authenticated USING (true);

-- EVENTS
CREATE POLICY "temp_select_events" ON public.events FOR SELECT TO authenticated USING (true);
CREATE POLICY "temp_insert_events" ON public.events FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "temp_update_events" ON public.events FOR UPDATE TO authenticated USING (true);
CREATE POLICY "temp_delete_events" ON public.events FOR DELETE TO authenticated USING (true);

-- DOCUMENTS
CREATE POLICY "temp_select_documents" ON public.documents FOR SELECT TO authenticated USING (true);
CREATE POLICY "temp_insert_documents" ON public.documents FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "temp_update_documents" ON public.documents FOR UPDATE TO authenticated USING (true);
CREATE POLICY "temp_delete_documents" ON public.documents FOR DELETE TO authenticated USING (true);

-- POLLS
CREATE POLICY "temp_select_polls" ON public.polls FOR SELECT TO authenticated USING (true);
CREATE POLICY "temp_insert_polls" ON public.polls FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "temp_update_polls" ON public.polls FOR UPDATE TO authenticated USING (true);
CREATE POLICY "temp_delete_polls" ON public.polls FOR DELETE TO authenticated USING (true);

-- POLL_OPTIONS
CREATE POLICY "temp_select_poll_options" ON public.poll_options FOR SELECT TO authenticated USING (true);
CREATE POLICY "temp_insert_poll_options" ON public.poll_options FOR INSERT TO authenticated WITH CHECK (true);

-- POLL_VOTES
CREATE POLICY "temp_select_poll_votes" ON public.poll_votes FOR SELECT TO authenticated USING (true);
CREATE POLICY "temp_insert_poll_votes" ON public.poll_votes FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "temp_update_poll_votes" ON public.poll_votes FOR UPDATE TO authenticated USING (true);

-- =====================================================
-- PASSO 6: CRIAR ÍNDICES
-- =====================================================

CREATE INDEX idx_notices_author ON public.notices(author_id);
CREATE INDEX idx_notices_created_at ON public.notices(created_at DESC);
CREATE INDEX idx_messages_sender ON public.messages(sender_id);
CREATE INDEX idx_messages_created_at ON public.messages(created_at DESC);
CREATE INDEX idx_events_created_by ON public.events(created_by);
CREATE INDEX idx_events_date ON public.events(date);
CREATE INDEX idx_documents_uploaded_by ON public.documents(uploaded_by);
CREATE INDEX idx_documents_uploaded_at ON public.documents(uploaded_at DESC);
CREATE INDEX idx_polls_author ON public.polls(author_id);
CREATE INDEX idx_poll_votes_user ON public.poll_votes(user_id);
CREATE INDEX idx_poll_votes_poll ON public.poll_votes(poll_id);

-- =====================================================
-- VERIFICAÇÃO FINAL
-- =====================================================

SELECT 'Tabelas Criadas:' as info;
SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename IN ('notices', 'messages', 'events', 'documents', 'polls', 'poll_options', 'poll_votes') ORDER BY tablename;

SELECT 'RLS Habilitado:' as info;
SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public' AND tablename IN ('notices', 'messages', 'events', 'documents', 'polls', 'poll_options', 'poll_votes') ORDER BY tablename;

SELECT 'Total de Políticas:' as info;
SELECT tablename, COUNT(*) as total FROM pg_policies WHERE schemaname = 'public' GROUP BY tablename ORDER BY tablename;

