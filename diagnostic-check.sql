-- =====================================================
-- SCRIPT DE DIAGNÓSTICO - Entre Afetos
-- Execute no SQL Editor do Supabase para verificar o que está faltando
-- =====================================================

-- 1. VERIFICAR TABELAS CRIADAS
SELECT 
    'TABELAS' as tipo,
    tablename as nome, 
    CASE WHEN tablename IN ('notices', 'messages', 'events', 'documents', 'polls', 'poll_options', 'poll_votes') 
        THEN '✅ OK' 
        ELSE '❌ FALTANDO' 
    END as status
FROM pg_tables 
WHERE schemaname = 'public' 
    AND tablename IN ('notices', 'messages', 'events', 'documents', 'polls', 'poll_options', 'poll_votes')
ORDER BY tablename;

-- 2. VERIFICAR RLS HABILITADO
SELECT 
    'RLS' as tipo,
    tablename as nome,
    CASE WHEN rowsecurity THEN '✅ HABILITADO' ELSE '❌ DESABILITADO' END as status
FROM pg_tables 
WHERE schemaname = 'public' 
    AND tablename IN ('notices', 'messages', 'events', 'documents', 'polls', 'poll_options', 'poll_votes')
ORDER BY tablename;

-- 3. VERIFICAR POLÍTICAS CRIADAS
SELECT 
    'POLÍTICAS' as tipo,
    schemaname || '.' || tablename as tabela,
    policyname as nome_politica,
    '✅ OK' as status
FROM pg_policies 
WHERE schemaname = 'public' 
    AND tablename IN ('notices', 'messages', 'events', 'documents', 'polls', 'poll_options', 'poll_votes')
ORDER BY tablename, policyname;

-- 4. CONTAR POLÍTICAS POR TABELA
SELECT 
    'RESUMO POLÍTICAS' as tipo,
    tablename as tabela,
    COUNT(*) as total_politicas
FROM pg_policies 
WHERE schemaname = 'public' 
    AND tablename IN ('notices', 'messages', 'events', 'documents', 'polls')
GROUP BY tablename
ORDER BY tablename;

-- 5. VERIFICAR ESTRUTURA DA TABELA NOTICES
SELECT 
    'COLUNAS NOTICES' as tipo,
    column_name as coluna,
    data_type as tipo_dado,
    is_nullable as permite_null
FROM information_schema.columns 
WHERE table_schema = 'public' 
    AND table_name = 'notices'
ORDER BY ordinal_position;

