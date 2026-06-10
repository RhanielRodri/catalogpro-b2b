# CatalogPro B2B API

Backend inicial da Fase 2 do CatalogPro B2B.

## Stack

- Node.js
- Express
- Prisma
- SQLite
- JavaScript
- CORS
- dotenv

## Como rodar

```bash
npm install
npx prisma migrate deploy
npm run prisma:seed
npm run dev
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
