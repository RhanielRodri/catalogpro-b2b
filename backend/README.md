# CatalogPro B2B API

Backend do CatalogPro B2B preparado para produção com PostgreSQL.

## Stack

- Node.js
- Express
- Prisma
- PostgreSQL
- JavaScript
- CORS
- dotenv

## Variáveis de ambiente

Crie um arquivo `.env` local ou configure as variáveis na plataforma de deploy:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
PORT=3333
FRONTEND_URL="https://catalogpro-b2b.vercel.app"
```

## Como rodar localmente com PostgreSQL

1. Crie um banco PostgreSQL local ou em uma plataforma como Render/Railway.
2. Configure `DATABASE_URL` apontando para esse banco.
3. Instale dependências e aplique migrations:

```bash
npm install
npx prisma migrate deploy
npm run prisma:seed
npm run dev
```

## Como rodar em produção

Na plataforma de deploy, configure:

```text
Build Command: npm install && npx prisma migrate deploy
Start Command: npm start
```

Variáveis obrigatórias:

```text
DATABASE_URL
FRONTEND_URL
PORT
```

Após o primeiro deploy, rode o seed uma vez no shell/job da plataforma:

```bash
npm run prisma:seed
```

## Endpoints

```text
GET /api/health
GET /api/products
GET /api/products/:id
GET /api/categories
GET /api/brands
POST /api/quotes
GET /api/quotes
GET /api/quotes/:id
PATCH /api/quotes/:id/status
```

## Status permitidos

```text
NEW
IN_REVIEW
ANSWERED
CLOSED
```

## Exemplo de cotação

```json
{
  "name": "Rhaniel Rodrigues",
  "company": "Rhaniel Tech",
  "phone": "(27) 99999-9999",
  "email": "contato@email.com",
  "notes": "Gostaria de saber prazo de entrega.",
  "items": [
    {
      "productId": 1,
      "quantity": 2
    }
  ]
}
```
