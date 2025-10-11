# ========================================
# DEPLOY DA EDGE FUNCTION
# ========================================
# Execute este comando para fazer deploy da Edge Function
# ========================================

# 1. Instalar Supabase CLI (se não tiver)
# npm install -g supabase

# 2. Fazer login no Supabase
# supabase login

# 3. Linkar com o projeto
# supabase link --project-ref SEU_PROJECT_ID

# 4. Deploy da Edge Function
supabase functions deploy create-user

# ========================================
# COMANDO COMPLETO PARA EXECUTAR:
# ========================================
# 
# 1. Abra o terminal na pasta do projeto
# 2. Execute: supabase functions deploy create-user
# 3. Aguarde o deploy completar
# 4. Teste a criação de usuários no painel
# 
# ========================================
