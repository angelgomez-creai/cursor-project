# Makefile para facilitar el uso de Docker - Frontend
.PHONY: help build-dev build-prod run-dev run-prod stop clean logs

help:
	@echo "Available commands:"
	@echo "  make build-dev     - Build development image"
	@echo "  make build-prod    - Build production image"
	@echo "  make run-dev       - Run development container"
	@echo "  make run-prod      - Run production container"
	@echo "  make stop          - Stop containers"
	@echo "  make clean         - Remove containers and images"
	@echo "  make logs          - Show container logs"
	@echo "  make shell         - Open shell in container"

# Build
build-dev:
	docker build --target development -t ecommerce-frontend:dev .

build-prod:
	docker build --target production -t ecommerce-frontend:prod .

# Run
run-dev:
	docker-compose up -d frontend-dev

run-prod:
	docker-compose up -d frontend-prod

# Stop
stop:
	docker-compose down

# Clean
clean:
	docker-compose down -v
	docker rmi ecommerce-frontend:dev ecommerce-frontend:prod 2>/dev/null || true

# Logs
logs:
	docker-compose logs -f frontend-dev

# Shell (development)
shell:
	docker-compose exec frontend-dev /bin/sh

