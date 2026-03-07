# Build context: monorepo root
# docker build -f services/users/Dockerfile .

FROM node:22-alpine AS builder
WORKDIR /repo

RUN corepack enable

# Copy workspace manifests for layer caching
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY services/users/package.json ./services/users/
COPY packages/types/package.json ./packages/types/

# Install deps for this service only
RUN pnpm install --filter @file-store/service-users... --frozen-lockfile

# Copy source
COPY tsconfig.base.json ./
COPY services/users/src ./services/users/src
COPY services/users/tsconfig.json ./services/users/
COPY packages/types ./packages/types

# Compile TypeScript
WORKDIR /repo/services/users
RUN pnpm exec tsc

# Create self-contained deployment bundle (flat node_modules, no symlinks)
RUN pnpm deploy --filter @file-store/service-users --prod --legacy /deploy

# ---- Runtime ----
FROM node:22-alpine AS runner
WORKDIR /app

COPY --from=builder /repo/services/users/dist ./dist
COPY --from=builder /deploy/node_modules ./node_modules

EXPOSE 3002
ENV NODE_ENV=production
CMD ["node", "dist/index.js"]
