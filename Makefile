# Miraim開発環境用 Makefile

.PHONY: help install dev build test lint clean docker-dev docker-prod

# デフォルトヘルプ
help:
	@echo "Available commands:"
	@echo "  make install      - Install dependencies (local)"
	@echo "  make dev          - Start development servers (local)"
	@echo "  make build        - Build for production (local)"
	@echo "  make test         - Run tests (local)"
	@echo "  make lint         - Run linting (local)"
	@echo "  make clean        - Clean build artifacts"
	@echo "  make docker-dev   - Start Docker development environment"
	@echo "  make docker-prod  - Start Docker production environment"
	@echo "  make docker-stop  - Stop Docker containers"
	@echo "  make setup        - First-time setup"

# 初回セットアップ
setup:
	@echo "🚀 Setting up Miraim development environment..."
	@echo "📦 Installing frontend dependencies..."
	cd frontend && npm install
	@echo "🐍 Installing backend dependencies..."
	cd backend && pip install -r requirements.txt
	cd backend && pip install -r requirements-dev.txt
	@echo "🔧 Setting up environment variables..."
	cp config/.env.example config/.env.development
	@echo "✅ Setup complete! Run 'make dev' to start development"

# ローカル開発環境
install:
	@echo "📦 Installing dependencies..."
	cd frontend && npm install
	cd backend && pip install -r requirements.txt
	cd backend && pip install -r requirements-dev.txt

dev:
	@echo "🚀 Starting development servers..."
	@echo "Frontend: http://localhost:3000"
	@echo "Backend: http://localhost:8000"
	@echo "API Docs: http://localhost:8000/docs"
	@make -j2 dev-frontend dev-backend

dev-frontend:
	cd frontend && npm run dev

dev-backend:
	cd backend && uvicorn main:app --reload --host 0.0.0.0 --port 8000

build:
	@echo "🏗️  Building for production..."
	cd frontend && npm run build
	cd backend && echo "Backend build completed"

test:
	@echo "🧪 Running tests..."
	cd frontend && npm test
	cd backend && pytest

lint:
	@echo "🔍 Running linting..."
	cd frontend && npm run lint
	cd backend && flake8 . && black --check .

clean:
	@echo "🧹 Cleaning build artifacts..."
	cd frontend && rm -rf .next out
	cd backend && rm -rf __pycache__ .pytest_cache htmlcov
	rm -rf node_modules

# Docker環境
docker-dev:
	@echo "🐳 Starting Docker development environment..."
	docker-compose -f docker-compose.development.yml up -d
	@echo "✅ Docker development environment started"
	@echo "Frontend: http://localhost:3000"
	@echo "Backend: http://localhost:8000"

docker-prod:
	@echo "🐳 Starting Docker production environment..."
	docker-compose -f docker-compose.prod.yml up -d
	@echo "✅ Docker production environment started"

docker-stop:
	@echo "🛑 Stopping Docker containers..."
	docker-compose -f docker-compose.development.yml down
	docker-compose -f docker-compose.prod.yml down

docker-logs:
	docker-compose -f docker-compose.development.yml logs -f

# データベース関連
db-migrate:
	@echo "🗄️  Running database migrations..."
	cd backend && alembic upgrade head

db-reset:
	@echo "🗄️  Resetting database..."
	docker-compose -f docker-compose.development.yml down -v
	docker-compose -f docker-compose.development.yml up -d db
	sleep 10
	@make db-migrate

# セキュリティ関連
security-setup:
	@echo "🔒 Setting up security..."
	./config/secrets/setup-keyvault.sh

security-encrypt:
	@echo "🔒 Encrypting production secrets..."
	./config/secrets/encrypt.sh

security-decrypt:
	@echo "🔓 Decrypting production secrets..."
	./config/secrets/decrypt.sh