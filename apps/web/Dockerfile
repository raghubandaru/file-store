# Build context: monorepo root
# docker build -f apps/web/Dockerfile .

FROM node:22-alpine AS builder
WORKDIR /repo

RUN corepack enable

# Copy workspace manifests first for layer caching
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY apps/web/package.json ./apps/web/
COPY packages/design-system/package.json ./packages/design-system/

RUN pnpm install --filter web... --frozen-lockfile

# Copy source
COPY apps/web ./apps/web
COPY packages/design-system ./packages/design-system

WORKDIR /repo/apps/web
RUN pnpm exec next build

# ---- Runtime ----
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Standalone output mirrors the full monorepo directory structure
COPY --from=builder /repo/apps/web/.next/standalone ./
COPY --from=builder /repo/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder /repo/apps/web/public ./apps/web/public

EXPOSE 3000
CMD ["node", "apps/web/server.js"]
