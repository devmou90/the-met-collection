# THOUGHTS

## Estrutura geral
- Utilizei a abordagem de workspace (`apps/*`) pra separar backend (Node + Express) e frontend (React + TS), que acaba funcionando como um monorepo. Fiz um dockerfile para cada um, que pode ser orquestrado pelo Docker Compose, sendo assim, caso prefira é só rodar o projeto com `docker compose up`


## Backend
- O backend funciona como um proxy para a API do oficial do MET. Utilizei o axios para criar um client da API oficial (`/clients/metClient.ts`)
- Criei endpoints (`/api/search`, `/api/objects/:id` e `/api/departments`) para padronizar o contrato pro frontend.
- Coloquei um cache em memória com TTL. O Met tem rate limit e a latência dele é ok, mas manter a resposta em RAM por alguns minutos faz o proxy devolver os dados quase instantaneamente e evita bombardear a API oficial sem necessidade.

## Frontend
- O app é um SPA clássico: React + Vite com poucas dependências extras. React Router cuida das rotas, React Query faz o cache das requisições, Tailwind/Headless UI para estilização e componentes

## CI/CD
- Configurei um pipeline no GitHub Actions que roda lint/specs/build/deploy. O backend está no Render (`https://the-met-collection.onrender.com`) e o frontend roda na Vercel (`https://the-met-collection-frontend.vercel.app`), então qualquer merge na main já chega nessas URLs sem intervenção manual.


## Trade-offs e próximos passos
- Mantive o cache em memória mesmo sabendo que em produção isso escala só até certo ponto. É suficiente para a finalidade do projeto, mas caso fosse um projeto real, já pensaria mover o cache para um redis por exemplo.
- O App é um SPA bem simples, então numa evolução pensaria em migrar pra algo como Next ou Remix, implementar autenticação e guardar favoritos no backend.
- Os testes cobrem os principais pontos, mas uma próxima etapa seria adicionar testes de integração/E2E pra validar melhor a jornada do usuario.
- Outro ponto de melhoria é em relação as imagens, as imagens oficiais da API são bem grandes, o que impacta a UX e performance até certo ponto, mesmo trazendo elas com lazy loading, uma evolução seria implementar no backend uma forma de otimizar essas imagens, porém não é tão trivial pois para funcionar bem precisaria de um bom sistema de cache para isso também.

