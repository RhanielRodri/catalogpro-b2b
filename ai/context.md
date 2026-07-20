---
project: CatalogPro B2B
updated_at: "2026-07-20T01:38:06-03:00"
status: active
product_type: demonstração de catálogo B2B com cotação e painel administrativo
primary_action: cliente monta e envia uma cotação; equipe comercial acompanha o pedido
target_user: empresas que vendem produtos por cotação e suas equipes comerciais
stack:
  - React 19
  - Vite
  - Node.js
  - Express
  - Prisma 5
  - PostgreSQL
repository: "."
production: declarada na documentação como Vercel, Render e PostgreSQL; runtime atual não confirmado
source_of_truth: Git e código observável no repositório
---

# Contexto do projeto

## Problema resolvido

Centraliza um catálogo corporativo, a solicitação pública de cotações e o acompanhamento comercial em um painel protegido.

## Fluxo principal

O visitante consulta e filtra produtos, adiciona itens a uma cotação, informa seus dados e envia a solicitação para a API. A equipe comercial autentica-se no painel, consulta os pedidos e atualiza o status.

## Arquitetura confirmada

- Frontend React/Vite em `catalogpro-b2b/`.
- API REST Node/Express em `backend/`.
- Persistência PostgreSQL acessada por Prisma.
- Autenticação administrativa por senha configurada no ambiente e cookie `httpOnly`.
- Frontend configurado para Vercel e backend configurado para Render.

## Ambientes e integrações observados

- Desenvolvimento local declarado para frontend, API e PostgreSQL.
- Produção declarada na documentação em Vercel e Render.
- Variáveis exigidas observadas: `VITE_API_URL`, `DATABASE_URL`, `FRONTEND_URL`, `ADMIN_SECRET`, `NODE_ENV` e `PORT`.
- Existe arquivo `.env` local no backend; somente sua existência foi observada, sem leitura de valores.

## Fontes autoritativas

- Git e código do repositório para funcionalidades e arquitetura.
- `package.json`, `render.yaml`, `vercel.json` e schema Prisma para scripts, ambientes e integrações.
- README e registro técnico global somente como declarações a confrontar com o observável.

## Limites de confiança

Esta adoção não executou testes, build, aplicação, banco ou deploy. O status remoto do Vercel ligado ao commit técnico foi consultado, mas a saúde atual do frontend, da API, do banco, do fluxo de cotação e do painel não foi confirmada em runtime.
