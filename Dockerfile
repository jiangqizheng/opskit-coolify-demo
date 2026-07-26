# syntax=docker/dockerfile:1.7

FROM node:24-alpine AS build

WORKDIR /app
RUN corepack enable && corepack prepare pnpm@10.27.0 --activate
COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=coolify-demo-pnpm-store,target=/pnpm/store,sharing=locked \
    pnpm config set store-dir /pnpm/store && \
    pnpm config set fetch-retries 5 && \
    pnpm config set fetch-retry-mintimeout 1000 && \
    pnpm config set fetch-retry-maxtimeout 20000 && \
    pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build

FROM node:24-alpine AS runtime

WORKDIR /app
ARG DEMO_RELEASE=local-dev
ARG DEMO_REGION=bj-2c8g
ARG DEMO_DOMAIN=coolify-demo.perphq.com
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000
ENV DEMO_RELEASE=${DEMO_RELEASE}
ENV DEMO_REGION=${DEMO_REGION}
ENV DEMO_DOMAIN=${DEMO_DOMAIN}
COPY --from=build --chown=node:node /app/.output ./.output
EXPOSE 3000
USER node
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 CMD ["node", "-e", "fetch('http://127.0.0.1:3000/healthz').then((response)=>{if(!response.ok)process.exit(1)}).catch(()=>process.exit(1))"]
CMD ["node", ".output/server/index.mjs"]
