# Build context: monorepo root
# docker build -f services/files/Dockerfile .

FROM node:22-alpine AS builder
WORKDIR /repo

RUN corepack enable

# Copy workspace manifests for layer caching
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY services/files/package.json ./services/files/
COPY packages/schemas/package.json ./packages/schemas/
COPY packages/types/package.json ./packages/types/

# Install deps for this service only
RUN pnpm install --filter @file-store/service-files... --frozen-lockfile

# Copy source
COPY tsconfig.base.json ./
COPY services/files/src ./services/files/src
COPY services/files/tsconfig.json ./services/files/
COPY packages/schemas ./packages/schemas
COPY packages/types ./packages/types

# Compile TypeScript
WORKDIR /repo/services/files
RUN pnpm exec tsc

# Create self-contained deployment bundle (flat node_modules, no symlinks)
RUN pnpm deploy --filter @file-store/service-files --prod --legacy /deploy

# ---- Runtime ----
FROM node:22-alpine AS runner
WORKDIR /app

COPY --from=builder /repo/services/files/dist ./dist
COPY --from=builder /deploy/node_modules ./node_modules

EXPOSE 3003
ENV NODE_ENV=production
CMD ["node", "dist/index.js"]
