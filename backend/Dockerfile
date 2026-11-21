FROM node:22-bookworm-slim

WORKDIR /app

RUN apt-get update \
    && apt-get install -y --no-install-recommends openssl ca-certificates \
    && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./
RUN npm ci

COPY prisma ./prisma
COPY prisma.config.ts ./
RUN DATABASE_URL="postgresql://build:build@127.0.0.1:5432/build" npx prisma generate

COPY src ./src
COPY server.js ./

ENV NODE_ENV=production
EXPOSE 5000
CMD ["npm", "start"]
