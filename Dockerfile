FROM node:22.3-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app
COPY . .

RUN pnpm install
RUN chmod +x ./packages/node/entrypoint.sh

ENTRYPOINT ["/bin/bash", "./packages/node/entrypoint.sh"]
