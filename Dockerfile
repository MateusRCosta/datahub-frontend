FROM node:24-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ARG NEXT_PUBLIC_BACKEND_URL

RUN npm run build && npm prune --omit=dev

FROM node:24-alpine

WORKDIR /app
ENV NODE_ENV=production

COPY --chown=node:node --from=build /app/package*.json ./
COPY --chown=node:node --from=build /app/node_modules ./node_modules
COPY --chown=node:node --from=build /app/.next ./.next
COPY --chown=node:node --from=build /app/public ./public

EXPOSE 3000

USER node

CMD ["npm", "start"]
