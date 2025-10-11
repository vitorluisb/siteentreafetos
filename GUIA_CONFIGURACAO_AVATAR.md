# 📸 Guia de Configuração do Sistema de Avatares

Sistema completo de fotos de perfil implementado! Siga os passos abaixo para ativar o recurso.

## ✅ O que foi implementado

1. **Página de Perfil** - Upload de foto com preview
2. **Chat** - Avatares nos balões de mensagem
3. **Listagem de Usuários** - Fotos na lista do painel admin
4. **Validações** - Limite de 2MB, apenas imagens

## 🚀 Passo a Passo de Configuração

### 1️⃣ Criar o Bucket de Storage

Acesse o **Supabase Dashboard** > **Storage** e crie um novo bucket:

- **Nome:** `avatars`
- **Public:** ✅ Sim (marcar como público)
- **File size limit:** 2MB
- **Allowed MIME types:** image/*

OU execute via SQL:

```sql
-- Criar bucket de avatars
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;
```

### 2️⃣ Executar as Migrations SQL

Abra o **SQL Editor** no Supabase Dashboard e execute:

#### a) Adicionar campo avatar_url na tabela user_profiles

```sql
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS avatar_url TEXT;

COMMENT ON COLUMN public.user_profiles.avatar_url IS 'URL da foto de perfil do usuário';
```

#### b) Adicionar campo sender_avatar_url na tabela messages

```sql
ALTER TABLE public.messages 
ADD COLUMN IF NOT EXISTS sender_avatar_url TEXT;

COMMENT ON COLUMN public.messages.sender_avatar_url IS 'URL do avatar do remetente da mensagem';
```

### 3️⃣ Configurar Políticas de Storage

Execute no **SQL Editor**:

```sql
-- Permitir que usuários façam upload de suas próprias fotos
CREATE POLICY "Users can upload their own avatar"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Permitir que usuários atualizem suas próprias fotos
CREATE POLICY "Users can update their own avatar"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'avatars' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Permitir que usuários deletem suas próprias fotos
CREATE POLICY "Users can delete their own avatar"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'avatars' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Permitir que todos vejam as fotos (público)
CREATE POLICY "Anyone can view avatars"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'avatars');
```

### 4️⃣ Atualizar a RPC Function (Opcional)

Se você estiver usando a função `get_user_profiles_for_admin`, certifique-se de que ela retorna o campo `avatar_url`:

```sql
CREATE OR REPLACE FUNCTION get_user_profiles_for_admin()
RETURNS TABLE (
  id UUID,
  email TEXT,
  full_name TEXT,
  display_name TEXT,
  role TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ,
  auth_exists BOOLEAN
) 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    up.user_id as id,
    up.email,
    up.full_name,
    up.display_name,
    up.role,
    up.avatar_url,
    up.created_at,
    EXISTS(SELECT 1 FROM auth.users WHERE id = up.user_id) as auth_exists
  FROM user_profiles up
  ORDER BY up.created_at DESC;
END;
$$ LANGUAGE plpgsql;
```

## 📱 Como Usar

### Para Usuários:

1. Acesse **Meu Perfil** no painel admin
2. Clique no ícone da **câmera** no avatar
3. Selecione uma imagem (máx 2MB)
4. A foto será atualizada automaticamente
5. Para remover, clique no ícone da **lixeira**

### Onde a Foto Aparece:

- ✅ Página de Perfil
- ✅ Chat (nos balões de mensagem)
- ✅ Listagem de Usuários (painel admin)
- ✅ Menu lateral (se houver avatar)
- ✅ Avisos e notificações (se houver)

## 🔒 Segurança

- Cada usuário só pode fazer upload/editar/deletar suas próprias fotos
- As fotos são armazenadas em pastas separadas por user_id
- Validação de tipo de arquivo (apenas imagens)
- Limite de tamanho (2MB)

## 🐛 Resolução de Problemas

### Erro: "Bucket não encontrado"
- Verifique se o bucket `avatars` foi criado no Storage
- Certifique-se de que está marcado como público

### Erro: "Sem permissão"
- Execute as políticas RLS do passo 3
- Verifique se o usuário está autenticado

### Foto não aparece no Chat
- Execute a migration para adicionar `sender_avatar_url` na tabela messages
- Envie uma nova mensagem para testar

### Foto não aparece na lista de usuários
- Execute a atualização da RPC function `get_user_profiles_for_admin`
- Recarregue a página de usuários

## 📋 Checklist de Validação

- [ ] Bucket `avatars` criado e público
- [ ] Campo `avatar_url` adicionado em `user_profiles`
- [ ] Campo `sender_avatar_url` adicionado em `messages`
- [ ] Políticas RLS configuradas no Storage
- [ ] RPC function atualizada
- [ ] Testado upload de foto
- [ ] Testado remoção de foto
- [ ] Foto aparece no perfil
- [ ] Foto aparece no chat
- [ ] Foto aparece na lista de usuários

---

## 🎉 Pronto!

Agora seu sistema tem fotos de perfil completas e funcionais em todo o painel admin!

