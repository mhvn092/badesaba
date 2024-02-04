FROM node:18-slim as development

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .
RUN npm run build:accounting

FROM node:18-slim as production
ENV NODE_ENV=production
ENV PORT=3002
EXPOSE ${PORT}

USER node
WORKDIR /app

COPY --from=development /app/dist/apps/accounting ./
RUN npm install --only=production

CMD ["node", "main"]