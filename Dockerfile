# syntax = docker/dockerfile:1

# Adjust NODE_VERSION as desired
ARG NODE_VERSION=22.21.1
FROM node:${NODE_VERSION}-slim AS base

LABEL fly_launch_runtime="Next.js/Prisma"

# Next.js/Prisma app lives here
WORKDIR /app

# Set production environment
ENV NODE_ENV="production"


# Throw-away build stage to reduce size of final image
FROM base AS build

# Install packages needed to build node modules
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential node-gyp openssl pkg-config python-is-python3 python3-pip python3-dev

# Install node modules
COPY package-lock.json package.json ./
COPY prisma .
RUN npm ci --include=dev

# Generate Prisma Client (this will pass now that url is removed from schema.prisma)
RUN npx prisma generate

# Copy application code
COPY . .
# Copy docker-entrypoint.js into the app directory
COPY docker-entrypoint.js .

# Setup Python virtual environment for AI services (DISABLED due to missing files)
# RUN python3 -m venv /app/ai/venv
# ENV PATH="/app/ai/venv/bin:$PATH"
# RUN pip install --no-cache-dir -r /app/ai/requirements.txt

# Copy the combined startup script
COPY start-combined.sh .
RUN chmod +x start-combined.sh

# Build application - Changed from npx next build to npm run build
RUN npm run build --experimental-build-mode compile

# Remove development dependencies
RUN npm prune --omit=dev


# Final stage for app image
FROM base

# Install packages needed for deployment
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y chromium chromium-sandbox openssl && \
    rm -rf /var/lib/apt/lists /var/cache/apt/archives

# Copy built application
COPY --from=build /app /app

# Setup sqlite3 on a separate volume
RUN mkdir -p /data
VOLUME /data

# Entrypoint prepares the database.
ENTRYPOINT [ "/app/docker-entrypoint.js" ]

# Start the server by default, this can be overwritten at runtime
EXPOSE 3000
# DATABASE_URL is now managed via Fly.io secrets for PostgreSQL
ENV PUPPETEER_EXECUTABLE_PATH="/usr/bin/chromium"
CMD [ "/app/start-combined.sh" ]
