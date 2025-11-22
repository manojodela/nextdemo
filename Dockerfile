# Multi-stage Dockerfile for Next.js (App Router) production build
# Builder stage
FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
COPY pnpm-lock.yaml* ./
RUN npm ci --production=false || true
RUN npm install

# Copy the rest
COPY . .

# Build the Next.js app
RUN npm run build

# Runner stage
FROM node:20-alpine AS runner
WORKDIR /app

# Only copy necessary files
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.mjs ./next.config.mjs

# Install only production deps
RUN npm ci --production

ENV NODE_ENV=production
EXPOSE 3000

CMD ["npm", "start"]
