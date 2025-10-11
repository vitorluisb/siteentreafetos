# ⚡ Quick Start - Entre Afetos Admin

## 🔥 Correção Rápida dos Erros 400 e 409

### 1️⃣ Configure o Ambiente (2 minutos)

```powershell
# 1. Crie o arquivo .env.local
echo "VITE_SUPABASE_URL=https://seu-projeto.supabase.co" > .env.local
echo "VITE_SUPABASE_ANON_KEY=sua-chave-aqui" >> .env.local
```

**📌 Como pegar as credenciais**:
1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto
3. Settings → API
4. Copie `URL` e `anon public`

---

### 2️⃣ Crie as Tabelas (1 minuto)

1. No Supabase: **SQL Editor**
2. Cole o conteúdo de `supabase-tables-setup.sql`
3. Clique em **Run**

---

### 3️⃣ Configure Segurança (1 minuto)

1. No Supabase: **SQL Editor**
2. Cole o conteúdo de `supabase-rls-policies.sql`
3. Clique em **Run**

---

### 4️⃣ Crie seu Usuário Admin (1 minuto)

1. Supabase → **Authentication** → **Users** → **Add user**
2. Preencha email e senha
3. Clique no usuário → **User Metadata** → Edit
4. Cole:
   ```json
   {
     "name": "Seu Nome",
     "role": "admin"
   }
   ```
5. Save

---

### 5️⃣ Rode a Aplicação

```bash
npm install
npm run dev
```

---

### 6️⃣ Teste

✅ Acesse: http://localhost:5173/admin/login  
✅ Faça login  
✅ **Sem erros!** 🎉

---

## 🐛 Ainda com Problemas?

### Erro: "Missing Supabase environment variables"
```bash
# Verifique se o arquivo existe:
dir .env.local

# Se não existir, crie manualmente com:
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave
```

### Erro 400
- ✅ Verifique se `.env.local` existe
- ✅ Verifique se as credenciais estão corretas
- ✅ Reinicie o servidor (`Ctrl+C` e `npm run dev`)

### Erro 409
- ✅ Execute `supabase-tables-setup.sql`
- ✅ Execute `supabase-rls-policies.sql`
- ✅ Verifique se as tabelas existem: Supabase → **Table Editor**

---

## 📚 Documentação Completa

- **SETUP_GUIDE.md** - Guia completo passo a passo
- **FIXES_APPLIED.md** - Detalhes técnicos das correções
- **supabase-tables-setup.sql** - Script de criação de tabelas
- **supabase-rls-policies.sql** - Script de políticas de segurança

---

## ✅ Checklist Rápido

```
[ ] .env.local criado
[ ] Credenciais do Supabase configuradas
[ ] supabase-tables-setup.sql executado
[ ] supabase-rls-policies.sql executado
[ ] Usuário admin criado com metadata
[ ] npm install executado
[ ] npm run dev rodando
[ ] Login funcionando sem erros 400/409
```

---

**Tempo total**: ~5 minutos  
**Dificuldade**: ⭐⭐☆☆☆ Fácil

