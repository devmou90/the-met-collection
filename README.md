# The Met Collection Explorer


## Estrutura do repositório
- `apps/backend`: API Express em TypeScript que faz proxy/cache das chamadas ao The Met.
- `apps/frontend`: SPA React + Vite responsável pela experiência de busca, filtros, favoritos e detalhes.

## Pré-requisitos
- Node.js 22.20.0 e npm 10+
- Docker e Docker Compose (opcional, apenas para rodar via containers)

## Configuração local
1. Instale dependências no root do workspace:
   ```bash
   npm install
   ```
2. Variáveis de ambiente:
   - Adicione um arquivo `apps/frontend/.env` (Dica: Renomeie o `.env.example`)
   - Ajuste `VITE_API_URL` caso rode o backend em outra URL/porta.

## Rodando em desenvolvimento
Abra dois terminais e execute:

- **Backend** (porta `4000`):
  ```bash
  npm run dev --workspace backend
  ```
- **Frontend** (porta `5173`):
  ```bash
  npm run dev --workspace frontend
  ```

Acesse `http://localhost:5173` para usar o app. As requisições do frontend são feitas para `http://localhost:4000/api`.

### Scripts úteis
- Lint: `npm run lint --workspace backend` / `npm run lint --workspace frontend`
- Format check: `npm run format --workspace <backend|frontend>`
- Testes unitários e de integração:
  ```bash
  npm test --workspace backend
  npm test --workspace frontend
  ```
  Use `test:coverage` em cada workspace para gerar cobertura (`vitest run --coverage`).

## Rodando com Docker
1. Construa e suba os serviços:
   ```bash
   docker compose up --build
   ```
2. Endpoints locais:
   - Frontend: `http://localhost:4173`
   - Backend: `http://localhost:4000/api`

O compose executa os builds de produção e já injeta `VITE_API_URL` apontando para o proxy interno.

## Links de produção
- Frontend (Vercel): https://the-met-collection-frontend.vercel.app
- Backend (Render): https://the-met-collection.onrender.com
