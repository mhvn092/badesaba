FROM node:18-slim as development

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .
RUN npm run build:auth

FROM node:18-slim as production
ENV NODE_ENV=production
ENV PORT=3001
EXPOSE ${PORT}

USER node
WORKDIR /app

COPY --from=development /app/dist/apps/auth ./
RUN npm install --only=production

CMD ["node", "main"]