-- ============================================
-- SOLUÇÃO ESPECÍFICA PARA FOREIGN KEY ERROR
-- ============================================
-- Execute TUDO de uma vez no Supabase SQL Editor

-- PASSO 1: Verificar se você existe no auth.users
SELECT 
    'Verificando usuário no auth.users:' as titulo,
    id,
    email,
    raw_user_meta_data
FROM auth.users 
WHERE email = 'hcvitor21@gmail.com';

-- PASSO 2: Criar tabela profiles se não existir
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    role TEXT DEFAULT 'user',
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- PASSO 3: Desabilitar RLS temporariamente
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- PASSO 4: FORÇAR inserção do perfil (com tratamento de erro)
DO $$
DECLARE
    user_uuid UUID;
    user_email TEXT;
BEGIN
    -- Buscar o ID do usuário
    SELECT id, email INTO user_uuid, user_email
    FROM auth.users 
    WHERE email = 'hcvitor21@gmail.com';
    
    IF user_uuid IS NULL THEN
        RAISE EXCEPTION 'Usuário não encontrado no auth.users';
    END IF;
    
    -- Deletar perfil existente se houver
    DELETE FROM public.profiles WHERE id = user_uuid;
    
    -- Inserir novo perfil
    INSERT INTO public.profiles (id, email, name, role, active)
    VALUES (user_uuid, user_email, user_email, 'admin', true);
    
    RAISE NOTICE 'Perfil criado com sucesso para: %', user_email;
    
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Erro ao criar perfil: %', SQLERRM;
END $$;

-- PASSO 5: Atualizar role no auth.users
UPDATE auth.users 
SET raw_user_meta_data = COALESCE(raw_user_meta_data, '{}'::jsonb) || '{"role": "admin"}'::jsonb
WHERE email = 'hcvitor21@gmail.com';

-- PASSO 6: Reabilitar RLS com política permissiva
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Remover políticas antigas
DROP POLICY IF EXISTS "super_permissive_policy" ON public.profiles;
DROP POLICY IF EXISTS "Allow all for authenticated users" ON public.profiles;

-- Criar política nova
CREATE POLICY "allow_all_authenticated" ON public.profiles
    FOR ALL 
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- PASSO 7: Configurar tabela notices se existir
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'notices') THEN
        -- Desabilitar RLS temporariamente
        ALTER TABLE public.notices DISABLE ROW LEVEL SECURITY;
        
        -- Remover políticas antigas
        DROP POLICY IF EXISTS "notices_super_permissive" ON public.notices;
        DROP POLICY IF EXISTS "notices_select_policy" ON public.notices;
        DROP POLICY IF EXISTS "notices_insert_policy" ON public.notices;
        
        -- Reabilitar RLS
        ALTER TABLE public.notices ENABLE ROW LEVEL SECURITY;
        
        -- Criar política permissiva
        CREATE POLICY "notices_allow_all_authenticated" ON public.notices
            FOR ALL 
            USING (auth.role() = 'authenticated')
            WITH CHECK (auth.role() = 'authenticated');
            
        RAISE NOTICE 'Políticas da tabela notices configuradas';
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Erro ao configurar notices: %', SQLERRM;
END $$;

-- PASSO 8: Verificação FINAL com detalhes
SELECT 
    '🔍 VERIFICAÇÃO FINAL:' as titulo,
    u.id as user_id,
    u.email as user_email,
    u.raw_user_meta_data->>'role' as auth_role,
    p.id as profile_id,
    p.email as profile_email,
    p.role as profile_role,
    p.active as profile_active,
    CASE 
        WHEN p.id IS NOT NULL THEN '✅ PERFIL EXISTE - FOREIGN KEY OK!'
        ELSE '❌ PERFIL NÃO EXISTE - FOREIGN KEY ERRO!'
    END as status_foreign_key
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE u.email = 'hcvitor21@gmail.com';

-- PASSO 9: Verificar se as tabelas existem
SELECT 
    'Status das Tabelas:' as titulo,
    CASE 
        WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') 
        THEN '✅ profiles existe'
        ELSE '❌ profiles NÃO existe'
    END as status_profiles,
    CASE 
        WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'notices') 
        THEN '✅ notices existe'
        ELSE '❌ notices NÃO existe'
    END as status_notices;

-- PASSO 10: Contar registros
SELECT 
    'Contagem de Registros:' as titulo,
    (SELECT COUNT(*) FROM auth.users WHERE email = 'hcvitor21@gmail.com') as usuarios_auth,
    (SELECT COUNT(*) FROM public.profiles WHERE email = 'hcvitor21@gmail.com') as perfis_profiles;

-- ============================================
-- 📋 INSTRUÇÕES:
-- 1. Execute este script no Supabase SQL Editor
-- 2. Procure por "✅ PERFIL EXISTE - FOREIGN KEY OK!"
-- 3. Se aparecer "❌ PERFIL NÃO EXISTE", me avise
-- 4. Faça logout e login na aplicação
-- 5. Teste criar notice novamente
-- ============================================