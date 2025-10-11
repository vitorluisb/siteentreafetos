# 🌟 Clínica Entre Afetos - Site Institucional

Site multipágina profissional para a Clínica Entre Afetos, especializada em psicologia infanto-juvenil com foco no desenvolvimento emocional de crianças e adolescentes.

## 🚀 Características Principais

- **Design Moderno e Acolhedor**: Paleta de cores suaves e design responsivo
- **Navegação Intuitiva**: Menu fixo com botão WhatsApp destacado
- **Hero Section Impactante**: Animações suaves e chamadas para ação
- **Vídeo Institucional**: Player com modal ampliado e reprodução automática
- **Cards Flip da Equipe**: Efeito hover com informações dos profissionais
- **Mapa Interativo**: Localização das unidades com marcadores personalizados
- **Formulário de Contato**: Validação e integração com WhatsApp
- **Chatbot Integrado**: Assistente virtual para atendimento
- **Sistema de Publicações**: Blog com artigos sobre desenvolvimento infantil
- **Galeria de Fotos**: Showcase das instalações da clínica
- **Totalmente Responsivo**: Otimizado para desktop, tablet e mobile
- **Acessibilidade**: Foco em navegação por teclado e leitores de tela

## 🛠️ Tecnologias Utilizadas

- **React.js 18** - Framework principal com hooks modernos
- **Vite** - Build tool rápido e moderno
- **React Router DOM 7** - Navegação entre páginas
- **Framer Motion** - Animações suaves e interativas
- **React Icons & Lucide React** - Ícones modernos
- **Google Maps API** - Mapas interativos
- **Leaflet** - Mapas alternativos
- **Supabase** - Backend as a Service
- **React Hook Form** - Gerenciamento de formulários
- **CSS3 Moderno** - Estilos customizados com variáveis CSS
- **Chakra UI** - Componentes de interface

## 📱 Estrutura de Páginas

### Páginas Principais
1. **Início** (`/`) - Hero section, vídeo institucional, destaques e estatísticas
2. **Sobre** (`/sobre`) - História, valores e equipe
   - **História** (`/sobre/historia`) - Trajetória da clínica
   - **Equipe** (`/sobre/equipe`) - Profissionais com cards flip
3. **Especialidades** (`/especialidades`) - Serviços oferecidos
4. **Publicações** (`/publicacoes`) - Blog com artigos
5. **Galeria** (`/galeria`) - Fotos das instalações
6. **Contato** (`/contato`) - Formulário e localização
7. **Trabalhe Conosco** (`/trabalhe-conosco`) - Oportunidades de carreira

### Páginas Especiais
- **Cartão Digital** (`/cartao`) - Cartão de visita digital
- **Artigos** (`/publicacoes/:slug`) - Páginas individuais de artigos

## 🎨 Paleta de Cores

```css
:root {
  --primary-color: #E8B4B8;     /* Rosa suave */
  --secondary-color: #F5E6E8;   /* Rosa muito claro */
  --accent-color: #D4A5A9;      /* Rosa médio */
  --whatsapp-color: #25D366;    /* Verde WhatsApp */
  --text-primary: #333333;      /* Texto principal */
  --text-secondary: #666666;    /* Texto secundário */
  --background-light: #FAFAFA;  /* Fundo claro */
  --white: #FFFFFF;             /* Branco puro */
}
```

## 🚀 Como Executar

### Pré-requisitos
- Node.js >= 18.0.0
- npm ou yarn

### Instalação

1. **Clone o repositório**:
   ```bash
   git clone [url-do-repositorio]
   cd clinentreafetos
   ```

2. **Instalar dependências**:
   ```bash
   npm install
   ```

3. **Configurar variáveis de ambiente**:
   Crie um arquivo `.env` na raiz do projeto:
   ```bash
   # Google Maps API
   VITE_GOOGLE_MAPS_API_KEY=sua_chave_google_maps_aqui
   
   # Supabase (opcional - para funcionalidades avançadas)
   VITE_SUPABASE_URL=sua_url_supabase
   VITE_SUPABASE_ANON_KEY=sua_chave_supabase
   ```

4. **Executar em desenvolvimento**:
   ```bash
   npm run dev
   ```
   Acesse: http://localhost:5173

5. **Build para produção**:
   ```bash
   npm run build
   ```

6. **Preview da build**:
   ```bash
   npm run preview
   ```

## 🌐 Deploy na Vercel

### Deploy Automático (Recomendado)

1. **Conecte seu repositório à Vercel**:
   - Acesse [vercel.com](https://vercel.com)
   - Importe seu repositório do GitHub
   - Configure as variáveis de ambiente no painel da Vercel

2. **Variáveis de Ambiente na Vercel**:
   ```
   VITE_GOOGLE_MAPS_API_KEY=sua_chave_aqui
   VITE_SUPABASE_URL=sua_url_supabase (opcional)
   VITE_SUPABASE_ANON_KEY=sua_chave_supabase (opcional)
   ```

### Deploy Manual

1. **Instalar Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Fazer login**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   npm run vercel
   ```

## 📍 Localizações das Unidades

O site exibe 3 unidades da clínica:

1. **Guarabira Centro** 
   - Endereço: Manoel Lordão, 219
   - Telefone: (83) 99999-9999

2. **Guarabira Jardim** 
   - Endereço: José Bonifácio, 15
   - Telefone: (83) 99999-9999

3. **Solânea** 
   - Endereço: Rua Cirilo da Costa Maranhão, 284
   - Telefone: (83) 99999-9999

## ✨ Funcionalidades Especiais

### 🎥 Vídeo Institucional
- **Reprodução automática** (mudo) na página inicial
- **Modal ampliado** com áudio ao clicar
- **Design responsivo** para todos os dispositivos
- **Controles nativos** do navegador

### 🗺️ Mapa Interativo
- **Google Maps integrado** com marcadores personalizados
- **3 unidades** com informações completas
- **InfoWindows** com detalhes de cada unidade
- **Zoom automático** ao selecionar uma unidade
- **Estilo personalizado** do mapa

### 👥 Cards da Equipe
- **Efeito flip 3D** no hover
- **Informações profissionais** no verso
- **Acessível** via teclado e touch
- **Fotos profissionais** dos membros

### 💬 Chatbot
- **Assistente virtual** integrado
- **Respostas automáticas** para dúvidas frequentes
- **Integração com WhatsApp** para atendimento humano

### 📝 Sistema de Publicações
- **Blog integrado** com artigos sobre desenvolvimento infantil
- **Páginas individuais** para cada artigo
- **Navegação intuitiva** entre publicações

## 📱 Responsividade

### Breakpoints
- **Desktop**: > 1024px
- **Tablet**: 768px - 1024px
- **Mobile Large**: 480px - 768px
- **Mobile Small**: < 480px

### Otimizações Mobile
- **Menu hamburger** em dispositivos pequenos
- **Imagens otimizadas** para diferentes resoluções
- **Touch-friendly** buttons e interações
- **Performance otimizada** para conexões lentas

## ♿ Acessibilidade

- **Navegação por teclado** completa
- **Contraste adequado** (WCAG 2.1 AA)
- **Textos alternativos** em todas as imagens
- **Estados de foco** visíveis
- **Suporte a leitores de tela**
- **Semântica HTML** correta

## 🔧 Configuração e Personalização

### Alterando Conteúdo
- **Textos**: Edite os componentes em `src/pages/`
- **Imagens**: Substitua os arquivos em `public/`
- **Cores**: Modifique `src/styles/variables.css`

### Adicionando Novas Páginas
1. Crie o componente em `src/pages/`
2. Adicione a rota em `src/App.jsx`
3. Inclua no menu em `src/components/Navigation.jsx`

### Configurando Google Maps
1. Obtenha uma API Key em: [Google Cloud Console](https://console.cloud.google.com/google/maps-apis)
2. Ative as APIs necessárias:
   - Maps JavaScript API
   - Places API
   - Geocoding API
3. Configure a chave no arquivo `.env`

## 📊 Performance

### Otimizações Implementadas
- **Code splitting** automático com React Router
- **Lazy loading** de imagens
- **Compressão** de assets
- **Cache headers** configurados
- **Bundle optimization** com Vite

### Métricas Esperadas
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms

## 🔒 Segurança

- **HTTPS** obrigatório em produção
- **Sanitização** de inputs
- **Validação** client-side e server-side
- **Headers de segurança** configurados
- **Variáveis de ambiente** protegidas

## 📄 Documentação Adicional

- **Guia de Deploy**: `DEPLOY_GUIDE.md`
- **Configuração Mínima**: `SETUP_GUIDE.md`
- **Início Rápido**: `QUICKSTART.md`
- **PRP**: `src/styles/docs/PRP.md`

## 🐛 Solução de Problemas

### Problemas Comuns

1. **Erro de API do Google Maps**:
   - Verifique se a chave está correta
   - Confirme se as APIs estão ativadas
   - Verifique os limites de uso

2. **Build falhando**:
   - Execute `npm install` novamente
   - Verifique a versão do Node.js (>= 18)
   - Limpe o cache: `npm run build --force`

3. **Imagens não carregando**:
   - Verifique se estão na pasta `public/`
   - Confirme os caminhos relativos
   - Teste em modo de produção

## 📞 Suporte

Para suporte técnico ou dúvidas sobre o projeto:

- **Email**: suporte@entreafetos.com
- **WhatsApp**: (83) 99999-9999
- **Documentação**: Consulte os arquivos `.md` na raiz do projeto

## 📄 Licença

Este projeto foi desenvolvido especificamente para a **Clínica Entre Afetos**. 
Todos os direitos reservados.

---

**Desenvolvido com ❤️ para cuidar do desenvolvimento emocional de crianças e adolescentes.**