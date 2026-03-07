# Build context: monorepo root
# docker build -f services/auth/Dockerfile .

FROM node:22-alpine AS builder
WORKDIR /repo

RUN corepack enable

# Copy workspace manifests for layer caching
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY services/auth/package.json ./services/auth/
COPY packages/schemas/package.json ./packages/schemas/
COPY packages/types/package.json ./packages/types/

# Install deps for this service only
RUN pnpm install --filter @file-store/service-auth... --frozen-lockfile

# Copy source
COPY tsconfig.base.json ./
COPY services/auth/src ./services/auth/src
COPY services/auth/tsconfig.json ./services/auth/
COPY packages/schemas ./packages/schemas
COPY packages/types ./packages/types

# Compile TypeScript
WORKDIR /repo/services/auth
RUN pnpm exec tsc

# Create self-contained deployment bundle (flat node_modules, no symlinks)
RUN pnpm deploy --filter @file-store/service-auth --prod --legacy /deploy

# ---- Runtime ----
FROM node:22-alpine AS runner
WORKDIR /app

COPY --from=builder /repo/services/auth/dist ./dist
COPY --from=builder /deploy/node_modules ./node_modules

EXPOSE 3001
ENV NODE_ENV=production
CMD ["node", "dist/index.js"]
