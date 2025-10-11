# Guia de Configuração - Entre Afetos Admin

## 🚨 Problemas Resolvidos

Este guia corrige os seguintes erros:
- ❌ `Failed to load resource: the server responded with a status of 400` (erro de autenticação)
- ❌ `Failed to load resource: the server responded with a status of 409` (erro de RLS/conflito)

## 📋 Pré-requisitos

1. Node.js >= 18.0.0
2. Conta no Supabase (gratuita)
3. Git

## 🔧 Passo a Passo da Configuração

### 1. Configurar Variáveis de Ambiente

1. **Crie um arquivo `.env.local`** na raiz do projeto:
   ```bash
   cp .env.local.example .env.local
   ```

2. **Acesse o Supabase Dashboard**:
   - Vá para [https://supabase.com/dashboard](https://supabase.com/dashboard)
   - Selecione seu projeto (ou crie um novo)
   - Navegue para: **Settings** → **API**

3. **Copie as credenciais** e cole no arquivo `.env.local`:
   ```env
   VITE_SUPABASE_URL=https://seu-projeto-id.supabase.co
   VITE_SUPABASE_ANON_KEY=sua-chave-anonima-aqui
   ```

### 2. Criar Tabelas no Banco de Dados

No **SQL Editor** do Supabase, execute o seguinte script:

```sql
-- Criar tabela de avisos
CREATE TABLE IF NOT EXISTS public.notices (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    sector TEXT NOT NULL,
    author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de mensagens (chat)
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    content TEXT NOT NULL,
    sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de eventos
CREATE TABLE IF NOT EXISTS public.events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    date TIMESTAMP WITH TIME ZONE NOT NULL,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE,
    location TEXT,
    created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de documentos
CREATE TABLE IF NOT EXISTS public.documents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    file_url TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_size INTEGER,
    file_type TEXT,
    sector TEXT NOT NULL,
    uploaded_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de enquetes
CREATE TABLE IF NOT EXISTS public.polls (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    question TEXT NOT NULL,
    description TEXT,
    author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ends_at TIMESTAMP WITH TIME ZONE
);

-- Criar tabela de opções de enquete
CREATE TABLE IF NOT EXISTS public.poll_options (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    poll_id UUID NOT NULL REFERENCES public.polls(id) ON DELETE CASCADE,
    option_text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de votos
CREATE TABLE IF NOT EXISTS public.poll_votes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    poll_id UUID NOT NULL REFERENCES public.polls(id) ON DELETE CASCADE,
    option_id UUID NOT NULL REFERENCES public.poll_options(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(poll_id, user_id)
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_notices_author ON public.notices(author_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON public.messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_events_created_by ON public.events(created_by);
CREATE INDEX IF NOT EXISTS idx_documents_uploaded_by ON public.documents(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_polls_author ON public.polls(author_id);
CREATE INDEX IF NOT EXISTS idx_poll_votes_user ON public.poll_votes(user_id);
```

### 3. Configurar Políticas de Segurança (RLS)

Execute o script `supabase-rls-policies.sql` no **SQL Editor** do Supabase:

```bash
# O arquivo já está no projeto: supabase-rls-policies.sql
```

**Importante**: As políticas RLS garantem que:
- ✅ Usuários autenticados podem ler conteúdo
- ✅ Admin e psicólogos podem criar/editar avisos e enquetes
- ✅ Apenas o autor ou admin pode excluir conteúdo
- ✅ Todos podem enviar mensagens no chat

### 4. Criar Usuário Administrador

1. **Acesse o Supabase Authentication**:
   - No dashboard: **Authentication** → **Users**
   - Clique em **Add user** → **Create new user**

2. **Preencha os dados**:
   - Email: `vitor.dev25@gmail.com` (ou seu email)
   - Password: Escolha uma senha forte
   - Clique em **Create user**

3. **Configurar como Admin**:
   - Clique no usuário criado
   - Role até **User Metadata**
   - Clique em **Edit**
   - Adicione o seguinte JSON:
   ```json
   {
     "name": "Vitor",
     "role": "admin"
   }
   ```
   - Clique em **Save**

### 5. Instalar Dependências e Rodar o Projeto

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev

# Build para produção
npm run build
```

### 6. Testar a Aplicação

1. **Acesse**: `http://localhost:5173/admin/login`
2. **Faça login** com as credenciais criadas
3. **Teste as funcionalidades**:
   - ✅ Dashboard
   - ✅ Avisos
   - ✅ Chat
   - ✅ Documentos
   - ✅ Enquetes
   - ✅ Agenda

## 🔍 Solução de Problemas

### Erro 400 (Bad Request)
**Causa**: Credenciais Supabase incorretas ou faltando
**Solução**: 
1. Verifique se o arquivo `.env.local` existe
2. Confirme que as credenciais estão corretas
3. Reinicie o servidor de desenvolvimento

### Erro 409 (Conflict)
**Causa**: Políticas RLS não configuradas ou tabelas não existem
**Solução**:
1. Execute os scripts SQL do passo 2 e 3
2. Verifique se as tabelas foram criadas no **Table Editor**
3. Confirme que RLS está habilitado nas tabelas

### Erro de Permissão ao Criar/Editar Conteúdo
**Causa**: User metadata sem o campo `role`
**Solução**:
1. Acesse **Authentication** → **Users** no Supabase
2. Edite o usuário e adicione `"role": "admin"` no metadata
3. Faça logout e login novamente

### Nomes de Usuários Não Aparecem
**Status**: ✅ **Resolvido**
- Os nomes agora aparecem como "Equipe Entre Afetos" ou "Você" (para o usuário logado)
- Não é necessário criar tabela `users` separada

## 📚 Estrutura do Banco de Dados

```
auth.users (gerenciado pelo Supabase)
├── id (UUID)
├── email
└── user_metadata
    ├── name
    └── role (admin, psicologo, equipe, user)

public.notices
├── id
├── title
├── content
├── sector
├── author_id → auth.users.id
└── created_at

public.messages
├── id
├── content
├── sender_id → auth.users.id
└── created_at

public.events
├── id
├── title
├── date
├── created_by → auth.users.id
└── ...

public.documents
├── id
├── title
├── file_url
├── uploaded_by → auth.users.id
└── ...

public.polls
├── id
├── question
├── author_id → auth.users.id
└── ...
```

## 🎯 Próximos Passos

1. ✅ Configurar Supabase Storage para upload de arquivos
2. ✅ Adicionar mais usuários e definir roles
3. ✅ Configurar email templates para autenticação
4. ✅ Deploy no Netlify/Vercel

## 🆘 Suporte

Se encontrar problemas:
1. Verifique o console do navegador (F12)
2. Verifique os logs do Supabase (Dashboard → Logs)
3. Confirme que todas as tabelas foram criadas
4. Teste a conexão com Supabase usando a página `/admin/diagnostic`

## 📝 Notas Importantes

- ⚠️ Nunca commite o arquivo `.env.local` no Git
- ⚠️ Use variáveis de ambiente no deploy (Netlify/Vercel)
- ⚠️ Mantenha a chave `ANON_KEY` (nunca use `SERVICE_ROLE_KEY` no frontend)
- ✅ As políticas RLS protegem os dados mesmo com a chave anon exposta

