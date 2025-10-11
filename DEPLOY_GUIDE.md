# ========================================
# GUIA COMPLETO PARA DEPLOY DA EDGE FUNCTION
# ========================================

## 📋 **Passo a Passo:**

### **1. Instalar Supabase CLI**
```bash
# Opção 1: Via npx (recomendado)
npx supabase --version

# Opção 2: Via Chocolatey (Windows)
choco install supabase

# Opção 3: Via Scoop (Windows)
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase
```

### **2. Fazer Login no Supabase**
```bash
npx supabase login
```
- Abrirá o navegador para fazer login
- Autorize o acesso ao Supabase

### **3. Linkar com o Projeto**
```bash
npx supabase link --project-ref SEU_PROJECT_ID
```
- Substitua `SEU_PROJECT_ID` pelo ID do seu projeto
- Você encontra o ID na URL do Supabase Dashboard

### **4. Deploy da Edge Function**
```bash
npx supabase functions deploy create-user
```

### **5. Verificar se Deployou**
```bash
npx supabase functions list
```

## 🔍 **Como Encontrar o Project ID:**

1. Abra o **Supabase Dashboard**
2. Vá para **Settings > General**
3. Copie o **Project Reference ID**
4. Use esse ID no comando `link`

## 📁 **Estrutura de Arquivos Necessária:**

```
clinentreafetos/
├── supabase/
│   ├── functions/
│   │   └── create-user/
│   │       └── index.ts
│   └── config.toml
└── ...
```

## ⚠️ **Possíveis Problemas:**

### **Erro de Permissão:**
- Certifique-se de estar logado como admin do projeto
- Verifique se tem permissões para deploy de Edge Functions

### **Erro de Configuração:**
- Verifique se o arquivo `supabase/config.toml` existe
- Confirme se a estrutura de pastas está correta

### **Erro de Token:**
- Faça logout e login novamente: `npx supabase logout` e `npx supabase login`
- Verifique se o token não expirou

## ✅ **Após o Deploy:**

1. **Teste a criação** de usuários no painel
2. **Verifique os logs** se houver erro: `npx supabase functions logs create-user`
3. **Confirme** que o login funciona imediatamente

## 🚀 **Comando Rápido:**

```bash
# Sequência completa
npx supabase login
npx supabase link --project-ref SEU_PROJECT_ID
npx supabase functions deploy create-user
```

## 📞 **Se Precisar de Ajuda:**

1. Execute com `--debug` para mais detalhes
2. Verifique os logs da função
3. Confirme se todas as variáveis de ambiente estão corretas
