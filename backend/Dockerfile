# =============================================================================
# Optimized Multi-stage Dockerfile for E-commerce Backend
# Python 3.11 Alpine with minimal image size and security best practices
# =============================================================================

# -----------------------------------------------------------------------------
# Stage 1: Base - Python 3.11 Alpine (minimal base image)
# -----------------------------------------------------------------------------
FROM python:3.11-alpine as base

# Set security and Python optimizations
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1 \
    PIP_DEFAULT_TIMEOUT=100 \
    PYTHONDONTWRITEBYTECODE=1

# Install minimal system dependencies for building
RUN apk add --no-cache --virtual .build-deps \
    gcc \
    g++ \
    musl-dev \
    postgresql-dev \
    curl \
    && rm -rf /var/cache/apk/*

# Create app directory
WORKDIR /app

# Create non-root user early
RUN addgroup -g 1000 -S appuser && \
    adduser -S -D -H -u 1000 -h /app -s /sbin/nologin -G appuser appuser

# -----------------------------------------------------------------------------
# Stage 2: Dependencies - Install Python dependencies only
# -----------------------------------------------------------------------------
FROM base as dependencies

# Copy only requirements first for better layer caching
COPY requirements.txt .

# Install Python dependencies in one layer
RUN pip install --upgrade --no-cache-dir pip setuptools wheel && \
    pip install --no-cache-dir -r requirements.txt && \
    pip cache purge

# -----------------------------------------------------------------------------
# Stage 3: Builder - Prepare application files
# -----------------------------------------------------------------------------
FROM base as builder

# Copy only Python packages from dependencies stage
COPY --from=dependencies /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
COPY --from=dependencies /usr/local/bin /usr/local/bin

# Copy application code (minimal files)
COPY src/ ./src/
COPY main.py .
COPY docker-entrypoint.sh /docker-entrypoint.sh

# Set ownership and permissions
RUN chown -R appuser:appuser /app && \
    chmod +x /docker-entrypoint.sh && \
    chmod -R 755 /app

# -----------------------------------------------------------------------------
# Stage 4: Development - Development environment
# -----------------------------------------------------------------------------
FROM base as development

# Copy dependencies from builder
COPY --from=builder /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin

# Install development dependencies separately
RUN pip install --no-cache-dir \
    pytest \
    pytest-asyncio \
    pytest-cov \
    black \
    flake8 \
    mypy && \
    pip cache purge

# Copy application code
COPY src/ ./src/
COPY main.py .
COPY tests/ ./tests/
COPY examples/ ./examples/
COPY docker-entrypoint.sh /docker-entrypoint.sh

# Set ownership
RUN chown -R appuser:appuser /app && \
    chmod +x /docker-entrypoint.sh && \
    chmod -R 755 /app

# Set development environment
ENV ENVIRONMENT=development \
    DEBUG=true \
    RELOAD=true

# Switch to non-root user
USER appuser

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# Set entrypoint
ENTRYPOINT ["/docker-entrypoint.sh"]

# Command for development
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload", "--log-level", "info"]

# -----------------------------------------------------------------------------
# Stage 5: Production - Minimal production image
# -----------------------------------------------------------------------------
FROM python:3.11-alpine as production

# Security: Run as non-root
RUN addgroup -g 1000 -S appuser && \
    adduser -S -D -H -u 1000 -h /app -s /sbin/nologin -G appuser appuser

# Set environment variables
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1 \
    ENVIRONMENT=production \
    DEBUG=false \
    RELOAD=false \
    LOG_LEVEL=INFO

# Install only runtime dependencies (minimal)
# Note: libpq-dev not needed, only libpq for runtime
RUN apk add --no-cache \
    curl \
    libpq \
    && rm -rf /var/cache/apk/* /tmp/* /var/tmp/*

# Create app directory
WORKDIR /app

# Copy only Python packages from dependencies (no build tools)
COPY --from=dependencies /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
COPY --from=dependencies /usr/local/bin /usr/local/bin

# Copy application code from builder
COPY --from=builder --chown=appuser:appuser /app/src ./src
COPY --from=builder --chown=appuser:appuser /app/main.py .
COPY --from=builder --chown=appuser:appuser /docker-entrypoint.sh /docker-entrypoint.sh

# Set permissions and clean unnecessary files
RUN chmod +x /docker-entrypoint.sh && \
    chmod -R 755 /app && \
    find /usr/local/lib/python3.11/site-packages -type d -name __pycache__ -exec rm -rf {} + 2>/dev/null || true && \
    find /usr/local/lib/python3.11/site-packages -type f -name "*.pyc" -delete 2>/dev/null || true && \
    find /usr/local/lib/python3.11/site-packages -type f -name "*.pyo" -delete 2>/dev/null || true && \
    rm -rf /tmp/* /var/tmp/* /root/.cache 2>/dev/null || true

# Switch to non-root user
USER appuser

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=15s --timeout=5s --start-period=30s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# Set entrypoint
ENTRYPOINT ["/docker-entrypoint.sh"]

# Production command with workers
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "4", "--log-level", "info", "--no-access-log"]
