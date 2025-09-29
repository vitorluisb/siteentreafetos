# PRP — Plano de Requisitos do Projeto
Projeto: Clínica Entre Afetos — Website SPA com Cartão Digital e Chatbot

## 1. Visão Geral
- Objetivo: Presença digital da clínica, captação via WhatsApp e apresentação de serviços/unidades.
- Stack: React + Vite, React Router, Framer Motion, React-Leaflet/Google Maps, Vercel.
- Páginas: Home, Sobre, Serviços, Contato, Cartão Digital (rota independente).
- Diferenciais: Chatbot com redirecionamento WhatsApp por unidade; cartão digital standalone; SPA otimizada para Vercel.

## 2. Escopo
- Deve: SPA completa, roteamento cliente, CTA para WhatsApp, mapa de unidades, chatbot embutido, cartão em `/cartao`, SEO básico, deploy Vercel.
- Não deve: Backend próprio; armazenamento de dados sensíveis; CMS no escopo atual.

## 3. Personas/Usuários
- Responsáveis (pais/mães) buscando atendimento infantil/juvenil.
- Adolescentes interessados em orientação/terapia.
- Equipe interna compartilhando o cartão digital.

## 4. Jornadas Principais
- Descoberta → Home → Serviços → Contato → WhatsApp.
- Decisão rápida → Cartão Digital `/cartao` → WhatsApp direto.
- Suporte guiado → Abrir Chatbot → Selecionar unidade → Preencher dados → WhatsApp.

## 5. Requisitos Funcionais
- RF-01: Navegação com rotas: `/`, `/sobre`, `/servicos`, `/contato`, `/cartao`.
- RF-02: Header responsivo com logo e menu; estado “scrolled”.
- RF-03: Footer com redes sociais, contatos, links rápidos, crédito discreto.
- RF-04: Home com Hero e vídeo da clínica (modal).
- RF-05: Serviços com cards animados (Framer Motion).
- RF-06: Contato com formulário (nome, telefone opcional, mensagem, unidade) → abrir `wa.me` com mensagem formatada.
- RF-07: Mapa das unidades (OpenStreetMap/Leaflet ou Google Maps) com pins e seleção.
- RF-08: Chatbot flutuante com etapas: saudação → seleção de unidade → formulário → redirecionar WhatsApp → reiniciar.
- RF-09: Cartão digital independente em `/cartao` (sem navbar/footer, experiência focada).
- RF-10: Assets estáticos servidos com cache de longo prazo.
- RF-11: Build e deploy na Vercel; rewrite SPA para `index.html`.

## 6. Requisitos Não Funcionais
- RNF-01: Performance — code splitting, minificação, cache headers; LCP < 2.5s em 4G razoável.
- RNF-02: Disponibilidade — 99,9% (herdada da Vercel).
- RNF-03: Acessibilidade — semântica, foco via teclado, labels, contraste.
- RNF-04: SEO — meta description, título, manifest, favicon; rotas públicas indexáveis.
- RNF-05: Segurança — sem segredos no client; sem XSS em inputs; uso de `rel="noopener noreferrer"`.
- RNF-06: Manutenibilidade — componentes coesos (SRP), `Layout` único, sem duplicação.
- RNF-07: Compatibilidade — Node >= 18; navegadores modernos (últimos 2).

## 7. Arquitetura de Software
- Frontend SPA (React + Vite).
- Roteamento: React Router.
- Animações: Framer Motion.
- Mapas: React-Leaflet e/ou Google Maps (via `@googlemaps/*`).
- Build: Vite com divisão manual de chunks (vendor/router/motion/icons/maps) e `terser`.
- Deploy: Vercel (`@vercel/static-build`, `dist`).
- Rewrites SPA: tudo exceto `_next|static|favicon.ico|logo|clinica|equipe|cartao.html|manifest.json|robots.txt` → `/index.html`.

## 8. Mapa de Rotas
- `/` — Home (Hero + vídeo + seções principais)
- `/sobre` — Institucional
- `/servicos` — Cards de especialidades
- `/contato` — Form + mapa + WhatsApp
- `/cartao` — Cartão digital standalone

## 9. Componentes Principais
- `Navigation` — Menu, responsivo, animações.
- `Footer` — Contatos, redes, links; crédito discreto.
- `Chatbot` — UI flutuante, estados, validação, WhatsApp redirect.
- `HeroSection` — Seção destaque.
- `OpenStreetMap/GoogleMap` — Mapa de unidades.
- `BusinessCard` — Cartão digital (página e componente).
- `Layout` — Envolve páginas comuns (nav + footer + chatbot).

## 10. Dados e Integrações
- WhatsApp: `wa.me/<numero>?text=<mensagem_url_encoded>`
- Números por unidade: `guarabira1`, `guarabira2`, `solanea`.
- Vídeo local (`mp4`) e imagens em `src/assets`.
- Manifest e favicon em `public/`.

## 11. Regras de Validação (Form/Chatbot)
- Nome: obrigatório, min 2 chars.
- Mensagem: obrigatória, min 10 chars (chatbot) / 5+ (contato).
- Telefone: opcional (limite 15).
- Unidade: obrigatória.
- Geração de mensagem multiline para WhatsApp (encodeURI).

## 12. Deploy/Infra
- Build: `npm run build` → `dist/`
- Vercel:
  - `vercel.json` com `rewrites` e `headers` de cache (assets, imagens, mídia).
  - `@vercel/static-build` usando `package.json`.
- Scripts: `dev`, `build`, `preview`.
- Node: `>=18`.

## 13. Critérios de Aceite
- CA-01: Todas as rotas carregam e funcionam no refresh (SPA rewrite).
- CA-02: Chatbot redireciona com mensagem correta para a unidade escolhida.
- CA-03: Formulário de Contato abre WhatsApp com mensagem formatada e limpa os campos.
- CA-04: Cartão em `/cartao` renderiza sem navbar/footer e com CTA de WhatsApp.
- CA-05: Navegação responsiva; menu mobile abre/fecha; estado scrolled aplicado.
- CA-06: Build de produção sem erros; deploy Vercel acessível por URL.
- CA-07: Performance aceitável (Lighthouse verde em Performance e A11y).
- CA-08: Sem erros graves de console em produção.

## 14. Riscos e Mitigações
- R1: Bloqueio de popup (window.open) — Mitigar com clique explícito em botão.
- R2: Links externos/WhatsApp — Validar encode e `noopener`.
- R3: Mapas — Chaves/limites de API Google; fallback para Leaflet.
- R4: Cache agressivo — Versionamento por hash (Vite) já aplicado.
- R5: SPA routing — `vercel.json` com rewrites já configurado.

## 15. Métricas/Monitoramento
- CTR dos CTAs de WhatsApp (via eventos/links mensuráveis).
- Engajamento do Chatbot (aberturas, cliques em enviar).
- Acesso ao `/cartao`.
- Performance (Lighthouse) e erros em runtime (Sentry opcional futuro).

## 16. Roadmap (Curto Prazo)
- v1.0: SPA + Chatbot + Cartão + Deploy Vercel (concluído).
- v1.1: Telemetria mínima (UTM nos links de WhatsApp).
- v1.2: SEO avançado (Open Graph, sitemap).
- v1.3: Painel leve para editar números/unidades (opcional).

## 17. Anexos/Referências
- Regras internas: `src/styles/docs/regras-vibe-coding.md`
- Modo arquiteto: `src/styles/docs/arquitetura-vibe-coding.md`
- Comandos úteis:
  - Dev: `npm run dev`
  - Build: `npm run build`
  - Preview: `npm run preview`
