# Makefile para E-commerce Docker Compose
.PHONY: help up down build logs ps shell clean backup restore

help:
	@echo "Available commands:"
	@echo "  make up          - Start all services (production)"
	@echo "  make up-dev      - Start all services (development)"
	@echo "  make down        - Stop all services"
	@echo "  make build       - Build all services"
	@echo "  make logs        - Show logs from all services"
	@echo "  make ps          - Show running services"
	@echo "  make shell-backend - Open shell in backend container"
	@echo "  make shell-postgres - Open PostgreSQL shell"
	@echo "  make shell-redis - Open Redis CLI"
	@echo "  make clean       - Stop and remove all containers, volumes"
	@echo "  make backup      - Backup PostgreSQL database"
	@echo "  make restore     - Restore PostgreSQL database"

# Start services
up:
	docker-compose up -d

up-dev:
	docker-compose -f docker-compose.dev.yml up -d

# Stop services
down:
	docker-compose down

# Build
build:
	docker-compose build

build-no-cache:
	docker-compose build --no-cache

# Logs
logs:
	docker-compose logs -f

logs-backend:
	docker-compose logs -f backend

logs-frontend:
	docker-compose logs -f frontend

logs-postgres:
	docker-compose logs -f postgres

logs-redis:
	docker-compose logs -f redis

logs-nginx:
	docker-compose logs -f nginx

# Status
ps:
	docker-compose ps

# Shell access
shell-backend:
	docker-compose exec backend /bin/bash

shell-frontend:
	docker-compose exec frontend /bin/sh

shell-postgres:
	docker-compose exec postgres psql -U ecommerce_user -d ecommerce

shell-redis:
	docker-compose exec redis redis-cli -a ${REDIS_PASSWORD:-redis_password_change_me}

shell-nginx:
	docker-compose exec nginx /bin/sh

# Database operations
backup:
	docker-compose exec postgres pg_dump -U ecommerce_user ecommerce > backup_$(shell date +%Y%m%d_%H%M%S).sql
	@echo "Backup created: backup_$(shell date +%Y%m%d_%H%M%S).sql"

restore:
	@echo "Usage: make restore FILE=backup.sql"
	@test -n "$(FILE)" || (echo "FILE is required" && exit 1)
	docker-compose exec -T postgres psql -U ecommerce_user ecommerce < $(FILE)

# Clean
clean:
	docker-compose down -v
	@echo "All containers and volumes removed"

clean-all:
	docker-compose down -v --rmi all
	@echo "All containers, volumes, and images removed"

# Health checks
health:
	@echo "Checking service health..."
	@docker-compose ps
	@echo "\nBackend health:"
	@curl -f http://localhost/api/health || echo "Backend unhealthy"
	@echo "\nFrontend health:"
	@curl -f http://localhost/health || echo "Frontend unhealthy"

# Restart
restart:
	docker-compose restart

restart-backend:
	docker-compose restart backend

restart-frontend:
	docker-compose restart frontend

# Stats
stats:
	docker stats

