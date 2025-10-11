-- =====================================================
-- ADICIONAR CAMPO CATEGORY NA TABELA EVENTS
-- Execute no SQL Editor do Supabase
-- =====================================================

-- Adicionar coluna category
ALTER TABLE public.events 
ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'meeting';

-- Criar índice para melhor performance
CREATE INDEX IF NOT EXISTS idx_events_category ON public.events(category);

-- Verificar
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'events' 
  AND column_name = 'category';
