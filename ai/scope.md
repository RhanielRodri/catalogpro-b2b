---
updated_at: "2026-07-20T01:38:06-03:00"
status: active
---

# Escopo

## Dentro do escopo confirmado

- Catálogo público abastecido pela API, com fallback local de produtos.
- Busca e filtros por produto, SKU, categoria e marca.
- Detalhes de produto, seleção de itens e controle de quantidades.
- Formulário público de cotação com validação e persistência pela API.
- Interface em português e inglês.
- Login administrativo baseado em senha de ambiente e cookie `httpOnly`.
- Painel com listagem, detalhes, métricas e atualização do status de cotações.
- API REST em Node/Express com Prisma e PostgreSQL.

## Fora do escopo desta adoção

- Alterar código, configuração, banco ou arquivos preexistentes.
- Executar testes, build, lint, deploy, migration ou seed.
- Confirmar saúde de produção a partir de documentação histórica.
- Versionar, mover, limpar ou decidir automaticamente o destino de `catalogpro-b2b/docs/`.
- Definir nova funcionalidade, prioridade comercial ou mudança de foco.

## Critérios de aceite da adoção

- `ai/context.md`, `ai/scope.md` e `ai/state.md` descrevem somente fatos sustentados.
- Baseline técnica aponta para o último commit de código observado.
- Validação parcial fica limitada à evidência remota ligada ao commit.
- Conteúdo não rastreado é classificado e permanece separado.
- Nenhum secret ou caminho pessoal é persistido.

## Decisões adiadas

- Preservação ou descarte consciente das cópias não rastreadas em `catalogpro-b2b/docs/`.
- Validação atual do frontend, API, banco, cotação pública e painel administrativo.
- Confirmação do estado real dos ambientes declarados como produção.
