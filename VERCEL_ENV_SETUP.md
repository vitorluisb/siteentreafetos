# 🔧 Configuração de Variáveis de Ambiente na Vercel

## ❌ Problema Identificado
```
Uncaught Error: Missing Supabase environment variables. Please check your .env file.
```

## ✅ Solução: Configurar Variáveis na Vercel

### 1. Acesse o Dashboard da Vercel
1. Vá para [vercel.com](https://vercel.com)
2. Faça login na sua conta
3. Selecione o projeto `siteentreafetos`

### 2. Configure as Variáveis de Ambiente

#### Navegue para Settings > Environment Variables
1. No dashboard do projeto, clique em **Settings**
2. No menu lateral, clique em **Environment Variables**
3. Adicione as seguintes variáveis:

#### ⚠️ VARIÁVEIS OBRIGATÓRIAS (copie exatamente):

**VITE_SUPABASE_URL**
```
https://eauisleumvlaszvgfoqv.supabase.co
```

**VITE_SUPABASE_ANON_KEY**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVhdWlzbGV1bXZsYXN6dmdmb3F2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5MDE2MzAsImV4cCI6MjA3NTQ3NzYzMH0.ZieRFisaFrf7cpc9rqAokmdvtSG2pycFfUG_7TEl4xc
```

**NODE_ENV**
```
production
```

**VITE_APP_ENV**
```
production
```

#### 📋 Passo a Passo para Adicionar Cada Variável:

1. Clique em **Add New**
2. Em **Name**, digite o nome da variável (ex: `VITE_SUPABASE_URL`)
3. Em **Value**, cole o valor correspondente
4. Em **Environments**, selecione:
   - ✅ Production
   - ✅ Preview
   - ✅ Development
5. Clique em **Save**

### 3. Redeploy do Projeto

Após adicionar todas as variáveis:

1. Vá para a aba **Deployments**
2. Clique nos três pontos (...) do último deploy
3. Selecione **Redeploy**
4. Confirme clicando em **Redeploy**

### 4. Verificação

Após o redeploy:
1. Acesse seu site na URL da Vercel
2. Abra o Console do navegador (F12)
3. Verifique se não há mais erros relacionados ao Supabase
4. Teste a funcionalidade do site

## 🚨 Checklist de Verificação

- [ ] VITE_SUPABASE_URL configurada
- [ ] VITE_SUPABASE_ANON_KEY configurada  
- [ ] NODE_ENV=production configurada
- [ ] VITE_APP_ENV=production configurada
- [ ] Redeploy realizado
- [ ] Site funcionando sem erros no console
- [ ] Funcionalidades do Supabase testadas

## 🔍 Solução de Problemas

### Se ainda houver erro:
1. Verifique se todas as variáveis foram salvas corretamente
2. Confirme que o redeploy foi concluído
3. Limpe o cache do navegador (Ctrl+F5)
4. Verifique se não há espaços extras nos valores das variáveis

### Logs de Debug:
- Acesse **Functions** > **View Function Logs** na Vercel
- Verifique se há erros específicos nos logs de build

## 📞 Suporte
Se o problema persistir, verifique:
- Se o projeto Supabase está ativo
- Se as chaves não expiraram
- Se há limitações de uso no plano Supabase