# 🚀 Deploy na Vercel - Clínica Entre Afetos

## 📋 Pré-requisitos

- [ ] Conta na [Vercel](https://vercel.com)
- [ ] Projeto no GitHub/GitLab/Bitbucket
- [ ] Variáveis de ambiente configuradas

## 🔧 Configuração das Variáveis de Ambiente

### 1. No Dashboard da Vercel

Acesse: **Project Settings > Environment Variables**

Adicione as seguintes variáveis:

```env
VITE_SUPABASE_URL=https://eauisleumvlaszvgfoqv.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVhdWlzbGV1bXZsYXN6dmdmb3F2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5MDE2MzAsImV4cCI6MjA3NTQ3NzYzMH0.ZieRFisaFrf7cpc9rqAokmdvtSG2pycFfUG_7TEl4xc
NODE_ENV=production
VITE_APP_ENV=production
```

### 2. Variáveis Opcionais

```env
VITE_GOOGLE_MAPS_API_KEY=sua-chave-google-maps-aqui
VITE_APP_URL=https://seu-dominio.vercel.app
```

## 🚀 Processo de Deploy

### Método 1: Deploy Automático (Recomendado)

1. **Conecte o repositório:**
   - Acesse [vercel.com/new](https://vercel.com/new)
   - Selecione seu repositório
   - Clique em "Import"

2. **Configure o projeto:**
   - **Framework Preset:** Vite
   - **Root Directory:** `./` (raiz)
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

3. **Adicione as variáveis de ambiente** (conforme seção anterior)

4. **Deploy:**
   - Clique em "Deploy"
   - Aguarde o processo (2-5 minutos)

### Método 2: Deploy via CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login na Vercel
vercel login

# Deploy
vercel

# Deploy para produção
vercel --prod
```

## 📁 Estrutura de Arquivos Importantes

```
clinentreafetos/
├── 📄 vercel.json              ← Configurações da Vercel
├── 📄 .env.example             ← Template de variáveis
├── 📄 vite.config.js           ← Configurações otimizadas
├── 📄 package.json             ← Scripts e dependências
└── 📁 dist/                    ← Build de produção
```

## ⚙️ Configurações Aplicadas

### vercel.json
- ✅ Configurado para Vite
- ✅ Rewrites para SPA
- ✅ Headers de cache otimizados
- ✅ Suporte a assets estáticos

### vite.config.js
- ✅ Minificação com Terser
- ✅ Code splitting otimizado
- ✅ Compressão de assets
- ✅ Remoção de console.log

## 🔍 Verificações Pós-Deploy

### 1. Funcionalidades Básicas
- [ ] Página inicial carrega
- [ ] Navegação entre páginas
- [ ] Responsividade mobile
- [ ] Imagens carregam corretamente

### 2. Funcionalidades Específicas
- [ ] Vídeo institucional (modal)
- [ ] Chatbot funciona
- [ ] Formulários enviam
- [ ] Galeria de fotos
- [ ] Sistema de publicações

### 3. Performance
- [ ] Lighthouse Score > 90
- [ ] Tempo de carregamento < 3s
- [ ] Assets comprimidos

## 🐛 Solução de Problemas

### Erro 404 em rotas
**Causa:** Configuração de rewrites
**Solução:** Verificar `vercel.json`

### Variáveis de ambiente não funcionam
**Causa:** Variáveis não configuradas
**Solução:** Verificar Environment Variables na Vercel

### Build falha
**Causa:** Dependências ou código
**Solução:** Testar `npm run build` localmente

### Assets não carregam
**Causa:** Paths incorretos
**Solução:** Verificar configurações de assets

## 📊 Monitoramento

### Analytics da Vercel
- Acesse: **Project > Analytics**
- Monitore: Pageviews, Performance, Errors

### Logs de Deploy
- Acesse: **Project > Deployments**
- Clique em qualquer deploy para ver logs

## 🔄 Atualizações Futuras

### Deploy Automático
- Push para `main` → Deploy automático
- Pull Requests → Preview deploys

### Rollback
```bash
# Via CLI
vercel rollback [deployment-url]

# Via Dashboard
Project > Deployments > Promote to Production
```

## 📞 Suporte

### Recursos Úteis
- [Documentação Vercel](https://vercel.com/docs)
- [Guia Vite + Vercel](https://vercel.com/guides/deploying-vite-to-vercel)
- [Troubleshooting](https://vercel.com/support)

### Comandos Úteis
```bash
# Verificar status
vercel ls

# Ver logs
vercel logs [deployment-url]

# Informações do projeto
vercel inspect [deployment-url]
```

---

## ✅ Checklist Final

- [ ] Variáveis de ambiente configuradas
- [ ] Build local testado (`npm run build`)
- [ ] Preview local testado (`npm run preview`)
- [ ] Deploy realizado
- [ ] Funcionalidades testadas em produção
- [ ] Performance verificada
- [ ] Domínio customizado configurado (opcional)

**🎉 Projeto pronto para produção!**