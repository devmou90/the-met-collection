FROM node:22-alpine

WORKDIR /app

COPY apps/backend/package*.json ./
RUN npm install

COPY apps/backend/ ./

RUN npm run build

EXPOSE 4000

CMD ["npm", "run", "start"]
