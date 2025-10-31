# Makefile para facilitar el uso de Docker
.PHONY: help build-dev build-prod run-dev run-prod stop clean logs test

help:
	@echo "Available commands:"
	@echo "  make build-dev     - Build development image"
	@echo "  make build-prod    - Build production image"
	@echo "  make run-dev       - Run development container"
	@echo "  make run-prod      - Run production container"
	@echo "  make stop          - Stop containers"
	@echo "  make clean         - Remove containers and images"
	@echo "  make logs          - Show container logs"
	@echo "  make test          - Run tests in container"
	@echo "  make shell         - Open shell in container"

# Build
build-dev:
	docker build --target development -t ecommerce-backend:dev .

build-prod:
	docker build --target production -t ecommerce-backend:prod .

# Run
run-dev:
	docker-compose up -d backend-dev

run-prod:
	docker-compose up -d backend-prod

# Stop
stop:
	docker-compose down

# Clean
clean:
	docker-compose down -v
	docker rmi ecommerce-backend:dev ecommerce-backend:prod 2>/dev/null || true

# Logs
logs:
	docker-compose logs -f backend-dev

# Test
test:
	docker-compose exec backend-dev pytest tests/ -v

# Shell
shell:
	docker-compose exec backend-dev /bin/bash

