@echo off
echo ========================================
echo DEPLOY DA EDGE FUNCTION - SUPABASE
echo ========================================

echo.
echo 1. Fazendo login no Supabase...
npx supabase login

echo.
echo 2. Aguardando você fazer login no navegador...
pause

echo.
echo 3. Linkando com o projeto...
echo Digite o Project ID do seu Supabase:
set /p PROJECT_ID="Project ID: "
npx supabase link --project-ref %PROJECT_ID%

echo.
echo 4. Fazendo deploy da Edge Function...
npx supabase functions deploy create-user

echo.
echo 5. Verificando se deployou...
npx supabase functions list

echo.
echo ========================================
echo DEPLOY CONCLUÍDO!
echo ========================================
echo.
echo Agora teste a criação de usuários no painel!
pause
