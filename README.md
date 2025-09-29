# Clínica Entre Afetos - Site Institucional

Site multipágina profissional para a Clínica Entre Afetos, especializada em psicologia infanto-juvenil.

## 🚀 Características

- **Design Moderno e Acolhedor**: Paleta de cores suaves e design responsivo
- **Navegação Intuitiva**: Menu fixo com botão WhatsApp destacado
- **Hero Section Impactante**: Animações suaves e chamadas para ação
- **Cards Flip da Equipe**: Efeito hover com informações dos profissionais
- **Mapa Interativo**: Localização das unidades com marcadores personalizados
- **Formulário de Contato**: Validação e integração com WhatsApp
- **Totalmente Responsivo**: Otimizado para desktop, tablet e mobile
- **Acessibilidade**: Foco em navegação por teclado e leitores de tela

## 🛠️ Tecnologias Utilizadas

- **React.js** - Framework principal
- **React Router** - Navegação entre páginas
- **Framer Motion** - Animações suaves
- **React Icons** - Ícones modernos
- **Google Maps** - Mapas interativos
- **CSS3** - Estilos customizados com variáveis CSS

## 📱 Páginas

1. **Início** (`/`) - Hero section, destaques e depoimentos
2. **Sobre** (`/sobre`) - História, valores e equipe com cards flip
3. **Especialidades** (`/especialidades`) - Serviços oferecidos com ícones
4. **Contato** (`/contato`) - Formulário e mapa com 3 unidades

## 🎨 Paleta de Cores

- **Primária**: #E8B4B8 (Rosa suave)
- **Secundária**: #F5E6E8 (Rosa muito claro)
- **Destaque**: #D4A5A9 (Rosa médio)
- **WhatsApp**: #25D366 (Verde WhatsApp)

## 🚀 Como Executar

1. **Instalar dependências**:
   ```bash
   npm install
   ```

2. **Configurar Google Maps API**:
   - Obtenha uma API Key em: https://console.cloud.google.com/google/maps-apis
   - Ative as APIs: Maps JavaScript API, Places API, Geocoding API
   - Crie um arquivo `.env` na raiz do projeto:
   ```bash
   REACT_APP_GOOGLE_MAPS_API_KEY=sua_chave_aqui
   ```

3. **Executar em desenvolvimento**:
   ```bash
   npm start
   ```

4. **Build para produção**:
   ```bash
   npm run build
   ```

## 📍 Localizações

O site exibe 3 unidades da clínica:

1. **Guarabira Centro** - Manoel Lordão, 219
2. **Guarabira** - José Bonifácio, 15
3. **Solânea** - Rua Cirilo da Costa Maranhão, 284

## 📞 Contato

- **Telefone**: (83) 99999-9999
- **WhatsApp**: Integrado em todo o site
- **E-mail**: contato@entreafetos.com

## ✨ Funcionalidades Especiais

### Hero Section
- Animação de entrada com stagger
- Elementos flutuantes animados
- Estatísticas da clínica
- Botões de ação destacados

### Cards Flip da Equipe
- Efeito hover com rotação 3D
- Informações profissionais no verso
- Acessível via teclado e touch

### Mapa Interativo (Google Maps)
- 3 marcadores personalizados com ícones da clínica
- InfoWindows com informações completas
- Lista de unidades abaixo do mapa
- **Clique nos endereços** para focar no mapa
- Zoom automático ao selecionar uma unidade
- Estilo personalizado do mapa
- Loading state com animação

### Formulário de Contato
- Validação em tempo real
- Integração com WhatsApp
- Feedback visual de envio

## 🔧 Personalização

Para personalizar o site:

1. **Cores**: Edite as variáveis CSS em `src/styles/variables.css`
2. **Conteúdo**: Modifique os componentes em `src/pages/`
3. **Informações de Contato**: Atualize os números e endereços nos componentes
4. **Logo**: Substitua os placeholders por imagens reais

## 📱 Responsividade

O site é totalmente responsivo com breakpoints:
- **Desktop**: > 1024px
- **Tablet**: 768px - 1024px
- **Mobile**: < 768px

## ♿ Acessibilidade

- Navegação por teclado
- Contraste adequado
- Textos alternativos
- Estados de foco visíveis
- Suporte a leitores de tela

## 🚀 Deploy

Para fazer deploy:

1. Execute `npm run build`
2. Faça upload da pasta `build` para seu servidor
3. Configure redirecionamentos para SPA (Single Page Application)

## 📄 Documentação do Projeto

- PRP — Plano de Requisitos do Projeto: `src/styles/docs/PRP.md`

## 📄 Licença

Este projeto foi desenvolvido especificamente para a Clínica Entre Afetos.