# CatalogPro B2B

Sistema full stack de catálogo corporativo para empresas que vendem por cotação.

O cliente acessa o catálogo, pesquisa produtos por categoria, marca ou SKU, adiciona itens à cotação e envia a solicitação. A equipe comercial acompanha os pedidos em um painel administrativo protegido, visualiza os detalhes e atualiza o status de atendimento.

---

## Demonstração

| | URL |
|---|---|
| **Site** | https://catalogpro-b2b.vercel.app/ |
| **Painel admin** | https://catalogpro-b2b.vercel.app/admin |
| **API** | https://catalogpro-b2b-api.onrender.com/api/health |
| **Senha demo** | `catalogpro-demo` |

> A API está no Render (plano gratuito). O primeiro acesso pode levar até 30 segundos para o servidor inicializar.

---

## Funcionalidades

### Área pública

- Catálogo com produtos reais vindos da API
- Busca por nome, SKU, categoria e marca
- Filtros combinados por categoria e marca
- Modal de detalhes com especificações técnicas
- Drawer de cotação com controle de itens e quantidades
- Formulário de orçamento com validação
- Cache inteligente (sessionStorage, TTL 5 min) com stale-while-revalidate
- Skeleton cards durante o carregamento
- Estado de erro com retry automático
- Feedback visual ao adicionar produto à cotação
- Layout responsivo (desktop, tablet, mobile)

### Painel administrativo

- Tela de login protegida por cookie httpOnly
- Dashboard com métricas de cotações por status
- Listagem de solicitações recebidas
- Visualização completa de cada cotação (dados do cliente + produtos)
- Atualização de status (Nova → Em análise → Respondida → Fechada)
- Logout seguro com invalidação de sessão

---

## Tecnologias

**Frontend**
- React 19 + Vite
- CSS puro com custom properties (zero framework)
- Deploy: Vercel

**Backend**
- Node.js + Express
- Prisma ORM + PostgreSQL
- Deploy: Render

---

## Segurança

- Rotas admin protegidas por middleware de sessão
- Cookie `httpOnly` + `sameSite: none` + `secure` em produção
- CORS restrito a origens autorizadas
- Rate limit de cotações (5 por minuto por IP)
- Validação de payload no backend (tamanho, formato, campos obrigatórios)
- Nenhum segredo em arquivo versionado

---

## Arquitetura

```
Usuário
  │
  ▼
Frontend React/Vite — Vercel
  │  sessionStorage cache (5 min TTL)
  │  stale-while-revalidate
  ▼
API REST Node/Express — Render
  │  rate limit · validação · auth middleware
  ▼
Prisma ORM
  │
  ▼
PostgreSQL — Render
```

---

## Estrutura do projeto

```
CatalogPro B2B/
├── catalogpro-b2b/       Frontend React/Vite
│   ├── src/
│   │   ├── admin/        Painel administrativo
│   │   ├── components/   Componentes públicos
│   │   ├── data/         Fallback local
│   │   └── services/     Integração com API
│   └── dist/             Build de produção
├── backend/              API Node/Express/Prisma
│   └── src/
│       ├── controllers/
│       ├── middleware/
│       └── routes/
└── docs/
    └── screenshots/
```

---

## Endpoints da API

```
GET    /api/health
GET    /api/products
GET    /api/categories
GET    /api/brands
GET    /api/quotes              [auth]
GET    /api/quotes/:id          [auth]
POST   /api/quotes
PATCH  /api/quotes/:id/status   [auth]
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/check
```

---

## Como executar localmente

### Pré-requisitos

- Node.js 18+
- PostgreSQL
- Git

### Clonar

```bash
git clone https://github.com/RhanielRodri/catalogpro-b2b.git
cd "CatalogPro B2B"
```

### Frontend

```bash
cd catalogpro-b2b
npm install
npm run dev
```

`.env` do frontend:

```env
VITE_API_URL=http://localhost:3333/api
```

### Backend

```bash
cd backend
npm install
```

`.env` do backend:

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/catalogpro"
FRONTEND_URL="http://localhost:5173"
ADMIN_SECRET="sua_senha_admin"
PORT=3333
NODE_ENV=development
```

```bash
npm run prisma:deploy   # roda as migrations
npm run prisma:seed     # popula dados de demonstração
npm run dev             # inicia a API
```

### Build

```bash
# Frontend
cd catalogpro-b2b && npm run build

# Backend
cd backend && npm run build
```

---

## Deploy em produção

| Serviço | Plataforma |
|---|---|
| Frontend | Vercel |
| API | Render |
| Banco | PostgreSQL no Render |

Variáveis necessárias no Vercel:
```
VITE_API_URL=https://catalogpro-b2b-api.onrender.com/api
```

Variáveis necessárias no Render:
```
DATABASE_URL
FRONTEND_URL
ADMIN_SECRET
NODE_ENV=production
PORT=3333
```

---

## Screenshots

### Home — desktop
![Home desktop](docs/screenshots/home-desktop.png)

### Home — mobile
![Home mobile](docs/screenshots/home-mobile.png)

### Catálogo — desktop
![Catálogo desktop](docs/screenshots/catalogo-desktop.png)

### Catálogo — mobile
![Catálogo mobile](docs/screenshots/catalogo-mobile.png)

### Modal de produto
![Modal de produto](docs/screenshots/produto-modal.png)

### Drawer de cotação
![Drawer de cotação](docs/screenshots/drawer-cotacao.png)

### Admin — login
![Admin login](docs/screenshots/admin-login.png)

### Admin — dashboard
![Admin dashboard](docs/screenshots/admin-dashboard.png)

### Admin — mobile
![Admin mobile](docs/screenshots/admin-mobile.png)

---

## O que este projeto demonstra

- Aplicação full stack com frontend, backend e banco separados e em produção
- Cache inteligente no cliente para performance em APIs com cold start
- Autenticação cross-origin com cookie httpOnly seguro
- Painel administrativo com controle de acesso real
- Validação e rate limiting no backend
- Responsividade em múltiplos breakpoints
- Fluxo B2B real: catálogo → cotação → análise comercial

---

## Autor

Desenvolvido por Rhaniel Rodrigues.

GitHub: https://github.com/RhanielRodri
