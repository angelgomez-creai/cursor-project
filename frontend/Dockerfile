# =============================================================================
# Optimized Multi-stage Dockerfile for E-commerce Frontend
# Node.js 18 Alpine with pnpm, minimal production image with nginx
# =============================================================================

# -----------------------------------------------------------------------------
# Stage 1: Base - Node.js 18 Alpine with pnpm
# -----------------------------------------------------------------------------
FROM node:18-alpine as base

# Install pnpm globally (lightweight package manager)
RUN corepack enable && corepack prepare pnpm@8.15.0 --activate

# Set working directory
WORKDIR /app

# Set environment variables
ENV PNPM_HOME="/pnpm" \
    PATH="$PNPM_HOME:$PATH" \
    NODE_ENV=production

# -----------------------------------------------------------------------------
# Stage 2: Dependencies - Install dependencies only
# -----------------------------------------------------------------------------
FROM base as dependencies

# Copy package files for dependency installation
COPY package.json pnpm-workspace.yaml* ./

# Install dependencies (including dev for build)
# Use --frozen-lockfile for reproducible builds
RUN pnpm install --frozen-lockfile --prefer-offline && \
    # Clean pnpm cache
    pnpm store prune && \
    rm -rf /root/.pnpm-store

# -----------------------------------------------------------------------------
# Stage 3: Builder - Build the application
# -----------------------------------------------------------------------------
FROM dependencies as builder

# Copy source code
COPY . .

# Build with optimizations
RUN pnpm run build && \
    find dist -name "*.map" -delete && \
    rm -rf node_modules .pnpm-store /root/.pnpm-store && \
    pnpm store prune && \
    rm -rf /tmp/* /var/tmp/* /root/.cache

# -----------------------------------------------------------------------------
# Stage 4: Development - Development server
# -----------------------------------------------------------------------------
FROM base as development

# Copy package files
COPY package.json pnpm-workspace.yaml* ./

# Install all dependencies (including dev)
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})" || exit 1

# Start development server
CMD ["pnpm", "run", "dev", "--host", "0.0.0.0"]

# -----------------------------------------------------------------------------
# Stage 5: Production - Minimal nginx image with built assets
# -----------------------------------------------------------------------------
FROM nginx:alpine as production

# Install only curl for health checks (minimal)
RUN apk add --no-cache --virtual .healthcheck \
    curl \
    && rm -rf /var/cache/apk/*

# Remove default nginx config
RUN rm -rf /etc/nginx/conf.d/default.conf

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets from builder stage (only dist folder)
COPY --from=builder --chown=nginx:nginx /app/dist /usr/share/nginx/html

# Create nginx directories and set permissions
RUN mkdir -p /var/cache/nginx/client_temp \
    /var/cache/nginx/proxy_temp \
    /var/cache/nginx/fastcgi_temp \
    /var/cache/nginx/uwsgi_temp \
    /var/cache/nginx/scgi_temp \
    && chown -R nginx:nginx /var/cache/nginx \
    && chown -R nginx:nginx /var/log/nginx \
    && chown -R nginx:nginx /etc/nginx/conf.d \
    && chown -R nginx:nginx /usr/share/nginx/html \
    # Remove unnecessary nginx files
    && rm -rf /usr/share/nginx/html/*.map \
    && find /usr/share/nginx/html -name "*.map" -delete

# Switch to nginx user (already exists in nginx:alpine, UID 101)
USER nginx

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=15s --timeout=5s --start-period=10s --retries=3 \
    CMD curl -f http://localhost/health || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
