
FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm i --workspaces

COPY tsconfig.base.json ./
COPY apps ./apps
COPY prisma ./prisma

RUN npx prisma generate --schema=apps/api/prisma/schema.prisma
RUN npm run build:api

EXPOSE 4000
CMD ["node","dist/apps/api/main.js"]
