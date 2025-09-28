# Cartão Digital - Entre Afetos

## 📱 Visão Geral

O cartão de visita digital da Clínica Entre Afetos foi completamente modernizado com design interativo e atrativo, mantendo a identidade visual do projeto original.

## ✨ Funcionalidades Implementadas

### 🎨 Design Moderno
- **Efeitos de sombra suave** e bordas arredondadas nos cartões
- **Animações sutis** ao passar o mouse (hover) com efeito "lift"
- **Transições suaves** de background com gradientes delicados
- **Tipografia impactante** com efeito de entrada (fade in/slide in)
- **Modo escuro e claro** alternável

### 🎯 Interatividade
- **Dados de contato interativos** com botões e links clicáveis
- **Ícones animados** com microinterações
- **Fotos/avatar do profissional** com máscara circular e zoom no hover
- **Botões modernizados** com degradê, ícones e microinterações
- **Painel de endereços** em estilo "cards" com ícones de localização

### 🗺️ Funcionalidades de Mapa
- **Modal de mapa** ao clicar nos endereços
- **Botão para abrir no Google Maps** com animação
- **Informações detalhadas** de cada unidade

### 📱 Responsividade
- **Layout otimizado** para smartphones
- **Espaçamento bem ajustado** para diferentes telas
- **Design adaptativo** para tablets e desktops

### 🌐 Redes Sociais
- **Botões coloridos** com ícones animados
- **Tooltips** ao passar o mouse
- **Links diretos** para WhatsApp, Instagram e Facebook

### 📱 QR Code
- **Efeito de destaque** com animação pulsante
- **Design integrado** ao cartão

### 💬 Microcopy
- **Textos incentivadores** para interação
- **Dicas úteis** para o usuário
- **Mensagens acolhedoras** da clínica

## 🚀 Como Acessar

### Opção 1: Página React (Recomendada)
```bash
cd clinentreafetos
npm start
```
Acesse: `http://localhost:3000/cartao`

### Opção 2: Página HTML Standalone
Acesse diretamente: `http://localhost:3000/cartao.html`

### Produção
```bash
cd clinentreafetos
npm run build
```
Acesse: `https://seudominio.com/cartao` ou `https://seudominio.com/cartao.html`

## 📁 Estrutura de Arquivos

```
src/
├── components/
│   └── BusinessCard/
│       ├── index.js          # Componente principal
│       └── BusinessCard.css  # Estilos específicos
├── pages/
│   └── BusinessCard.js       # Página independente
└── styles/
    └── BusinessCard.css      # Estilos da página

public/
└── cartao.html               # Página HTML standalone
```

## 🎯 Características Especiais

### ✅ **Sem Navbar e Footer**
- O cartão é completamente independente
- Não renderiza navegação nem rodapé do site principal
- Foco total na experiência do cartão digital

### 🌐 **Duas Opções de Acesso**
1. **Página React** (`/cartao`) - Integrada ao sistema de rotas
2. **Página HTML** (`/cartao.html`) - Arquivo standalone independente

## 🎨 Paleta de Cores

O cartão mantém a identidade visual original:
- **Rosa suave**: `#E8B4B8`
- **Rosa claro**: `#F5E6E8`
- **Rosa médio**: `#D4A5A9`
- **Verde WhatsApp**: `#A8D5BA`

## 🔧 Personalização

### Alterar Informações de Contato
Edite o arquivo `src/components/BusinessCard/index.js`:

```javascript
const locations = [
  {
    id: 1,
    name: "Sua Unidade",
    address: "Seu Endereço",
    phone: "Seu Telefone",
    hours: "Seus Horários",
    // ...
  }
];
```

### Alterar Redes Sociais
```javascript
const socialLinks = [
  { name: 'WhatsApp', icon: FaWhatsapp, color: '#25D366', url: 'https://wa.me/SEUNUMERO' },
  // ...
];
```

### Alterar Informações do Profissional
```javascript
// No componente professional-details
<h2>Seu Nome</h2>
<p className="specialty">Sua Especialidade - CRP XXXXX</p>
<p className="experience">Sua Experiência</p>
```

## 📱 Recursos Técnicos

- **Framer Motion**: Animações fluidas e interativas
- **React Icons**: Ícones modernos e consistentes
- **CSS Grid/Flexbox**: Layout responsivo
- **CSS Custom Properties**: Tema dinâmico
- **Backdrop Filter**: Efeitos de vidro fosco
- **CSS Animations**: Microinterações suaves

## 🌟 Destaques do Design

1. **Cartão Principal**: Design glassmorphism com backdrop-filter
2. **Animações de Entrada**: Elementos aparecem com fade-in e slide
3. **Hover Effects**: Transformações suaves em todos os elementos interativos
4. **Modo Escuro**: Alternância dinâmica de tema
5. **Modal de Mapa**: Pop-up elegante com informações detalhadas
6. **Responsividade**: Adaptação perfeita para todos os dispositivos

## 🎯 Objetivos Alcançados

✅ Design moderno e interativo  
✅ Identidade visual preservada  
✅ Responsividade total  
✅ Animações sutis e elegantes  
✅ Funcionalidades de mapa integradas  
✅ Redes sociais interativas  
✅ Modo escuro/claro  
✅ Microcopy acolhedor  
✅ Página independente  
✅ Código limpo e organizado  

## 📞 Suporte

Para dúvidas ou sugestões sobre o cartão digital, entre em contato através do site principal da clínica.
