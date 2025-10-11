# 🚀 Guia de Deploy para Vercel - Site Entre Afetos

## ✅ Status do Projeto

### Configurações Verificadas
- ✅ **vercel.json** configurado com otimizações
- ✅ **Build de produção** testado e funcionando
- ✅ **Otimizações de performance** implementadas
- ✅ **GitHub** atualizado com últimas mudanças
- ✅ **Headers de cache** otimizados

## 🔧 Configuração do Vercel

### 1. Arquivo vercel.json
O projeto já possui um arquivo `vercel.json` configurado com:
- Build estático usando `@vercel/static-build`
- Rewrites para SPA (Single Page Application)
- Headers de cache otimizados para todos os assets
- Configuração de diretório de build (`dist`)

### 2. Variáveis de Ambiente
Configure as seguintes variáveis no painel do Vercel:

```bash
# Supabase
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase

# Outras configurações (se necessário)
NODE_VERSION=18
```

## 🚀 Processo de Deploy

### Opção 1: Deploy via GitHub (Recomendado)
1. **Conectar Repositório**:
   - Acesse [vercel.com](https://vercel.com)
   - Clique em "New Project"
   - Conecte com GitHub: `https://github.com/vitorluisb/siteentreafetos.git`

2. **Configurações do Projeto**:
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

3. **Deploy Automático**:
   - Cada push para `main` fará deploy automático
   - Preview deployments para outras branches

### Opção 2: Deploy via CLI
```bash
# Instalar Vercel CLI
npm i -g vercel

# Login no Vercel
vercel login

# Deploy
vercel --prod
```

## 📊 Otimizações Implementadas

### Performance
- ✅ **Lazy Loading** de imagens
- ✅ **Preload inteligente** de imagens críticas
- ✅ **Compressão de imagens** (até 94% de redução)
- ✅ **Cache headers** otimizados (1 ano para assets)
- ✅ **Code splitting** automático
- ✅ **Placeholders shimmer** para melhor UX

### Build Otimizado
- ✅ **Vite** com plugins de otimização
- ✅ **Imagemin** para compressão de imagens
- ✅ **Bundle splitting** inteligente
- ✅ **Tree shaking** automático

## 🔍 Verificação Pós-Deploy

### 1. Teste de Performance
Execute o script de teste:
```bash
npm run test:performance
```

### 2. Verificações Manuais
- [ ] Site carrega corretamente
- [ ] Imagens são carregadas com lazy loading
- [ ] Cache headers estão funcionando
- [ ] Formulários funcionam corretamente
- [ ] Navegação entre páginas funciona

### 3. Ferramentas de Análise
- **Lighthouse**: Teste de performance
- **GTmetrix**: Análise de velocidade
- **WebPageTest**: Teste detalhado de carregamento

## 🌐 URLs do Projeto

### Produção
- **Site**: https://siteentreafetos.vercel.app (será gerado após deploy)
- **GitHub**: https://github.com/vitorluisb/siteentreafetos

### Desenvolvimento
- **Local**: http://localhost:5173
- **Preview**: URLs geradas automaticamente para PRs

## 🔧 Comandos Úteis

```bash
# Desenvolvimento
npm run dev

# Build de produção
npm run build

# Preview do build
npm run preview

# Teste de performance
node scripts/test-performance.js

# Deploy para Vercel
vercel --prod
```

## 📈 Melhorias Esperadas

### Performance
- **30-50%** redução no tempo de carregamento
- **90+** score no Lighthouse Performance
- **Redução significativa** no uso de dados
- **Melhor experiência** em conexões lentas

### SEO
- **Headers otimizados** para cache
- **Lazy loading** não bloqueia renderização
- **Preload** de recursos críticos

## 🚨 Troubleshooting

### Problemas Comuns
1. **Build falha**: Verificar dependências no package.json
2. **Imagens não carregam**: Verificar paths relativos
3. **Variáveis de ambiente**: Confirmar configuração no Vercel
4. **Cache issues**: Limpar cache do navegador

### Logs de Deploy
- Acesse o painel do Vercel para ver logs detalhados
- Use `vercel logs` para logs via CLI

## 📞 Suporte

Para problemas específicos:
1. Verificar logs no painel do Vercel
2. Consultar documentação do Vite
3. Verificar issues no repositório GitHub

---

**Última atualização**: $(date)
**Versão**: 2.0 com otimizações de performance