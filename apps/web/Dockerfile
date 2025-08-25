
FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm i --workspaces

COPY tsconfig.base.json ./
COPY apps ./apps

ARG NEXT_PUBLIC_API_BASE
ENV NEXT_PUBLIC_API_BASE=$NEXT_PUBLIC_API_BASE

RUN npm run build:web

EXPOSE 3000
CMD ["npm","run","start:web"]
