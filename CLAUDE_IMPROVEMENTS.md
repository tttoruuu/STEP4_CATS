# CLAUDE_IMPROVEMENTS.md

This file provides additional guidance to Claude Code (claude.ai/code) when working with code in this repository. This supplements the main CLAUDE.md file with more detailed information.

## Project Overview

**婚活男性向け「内面スタイリング」トータルサポートアプリ (Miraim)**

A matchmaking conversation practice application designed to help Japanese men improve their communication skills for dating scenarios, particularly those using marriage consultation services (結婚相談所).

**Target Users**: Men enrolled in marriage consultation services who struggle with communication, especially in first meetings.

**Core Features**:
1. **AI Counselor**: Consultation for dating concerns and profile creation support
2. **Conversation Practice**: Communication training focused on active listening skills
3. **Compatibility Diagnosis**: Personality and values assessment for matching support
4. **Styling Suggestions**: Age/season/type-specific appearance improvement recommendations

## Development Commands

### Quick Start
```bash
make setup        # First-time setup - installs all dependencies
make dev          # Start development servers (frontend:3000, backend:8000)
make docker-dev   # Start Docker development environment
```

### Frontend (Next.js PWA)
```bash
cd frontend
npm run dev       # Development server at http://localhost:3000
npm run build     # Production build
npm run lint      # Run ESLint
npm run type-check # TypeScript type checking
npm run format    # Format code with Prettier
```

### Backend (FastAPI)
```bash
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000  # Dev server
pytest            # Run tests (when implemented)
flake8 .          # Python linting
black .           # Format Python code
mypy .            # Type checking
alembic upgrade head  # Run database migrations
```

### Docker Commands
```bash
# Development
docker-compose -f docker-compose.development.yml up -d     # Start all services
docker-compose -f docker-compose.development.yml logs -f   # View logs
docker-compose -f docker-compose.development.yml down      # Stop services

# Production
docker-compose -f docker-compose.prod.yml up -d           # Start production
```

### Database Operations
```bash
make db-migrate   # Run migrations
make db-reset     # Reset database (development only)
```

### Testing Commands
```bash
make test         # Run all tests (frontend + backend)
make lint         # Run all linters

# Frontend specific (placeholder - tests not yet implemented)
cd frontend && npm test

# Backend specific
cd backend && pytest                    # Run all tests
cd backend && pytest --cov             # With coverage
cd backend && pytest -v                # Verbose mode
```

## Architecture Overview

### System Architecture
```
Next.js PWA (Frontend)
    ↓
API Gateway / BFF
    ↓
FastAPI Microservices
├── User Management Service
├── AI Dialogue Service (OpenAI Integration)
├── Voice Analysis Service
├── Diagnosis/Analysis Service
├── Styling Recommendation Service
└── External Integration Service (Mandom API)
    ↓
Data Layer (MySQL + Redis)
```

### Key Technologies
- **Frontend**: Next.js 15.2.4, React 18.2.0, TypeScript, Tailwind CSS, Material-UI
- **Backend**: FastAPI 0.104.1, SQLAlchemy 2.0.23, Pydantic
- **AI/ML**: OpenAI API 1.30.0, Speech-to-Text integration
- **Database**: MySQL (primary), Redis (cache/sessions)
- **Infrastructure**: Docker, Azure Container Apps, GitHub Actions CI/CD

### Directory Structure
```
/frontend          # Next.js PWA application
  /pages           # Page components (auth, profile, conversation, etc.)
  /components      # Reusable UI components
  /services        # API client services
  /hooks           # Custom React hooks
  /utils           # Utility functions
/backend           # FastAPI application
  /routers         # API endpoints
  /models          # SQLAlchemy models
  /schemas         # Pydantic schemas
  /services        # Business logic
  /core            # Core configurations
/config            # Configuration and secrets management
  /secrets         # Azure Key Vault scripts
/scripts           # Deployment and utility scripts
/docs              # Documentation and design specs
/.github/workflows # CI/CD pipelines
```

## API Endpoints

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /auth/refresh` - Token refresh
- `POST /auth/logout` - User logout

### Core Features
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile
- `POST /api/counselor/chat` - AI counselor dialogue
- `POST /api/conversation/practice` - Conversation practice session
- `GET /api/conversation/partners` - List conversation partners
- `POST /api/compatibility/diagnose` - Compatibility diagnosis
- `GET /api/styling/recommend` - Styling recommendations

### API Documentation
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Development Guidelines

### Code Style
- **Frontend**: ESLint + Prettier, TypeScript strict mode enabled
- **Backend**: Black + isort for formatting, Pydantic for type validation, docstrings required
- **Commits**: Use Conventional Commits format (feat:, fix:, docs:, etc.)
- **Branches**: `feature/feature-name`, `fix/issue-description`, `hotfix/critical-fix`

### Security Considerations
- All sensitive data must be encrypted
- Use Azure Key Vault for secrets management
- JWT authentication with proper expiration
- CORS properly configured for production domains
- Never commit `.env` files or secrets

### Environment Variables
Required environment variables (see `config/.env.example`):
```bash
# AI/ML
OPENAI_API_KEY=
SPEECH_API_KEY=

# Database
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_DATABASE=konkatsu_app
DATABASE_URL=mysql://user:password@localhost:3306/konkatsu_app

# Auth
JWT_SECRET=
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# External APIs
MANDAMU_API_KEY=
MANDAMU_API_SECRET=

# Azure (Production)
AZURE_CLIENT_ID=
AZURE_CLIENT_SECRET=
AZURE_TENANT_ID=
```

## Deployment

### Development Deployment
- Automatic deployment on push to `develop` branch via GitHub Actions
- Deploys to Azure Container Apps (development environment)

### Production Deployment
- Automatic deployment on push to `main` branch via GitHub Actions
- Deploys to Azure Container Apps (production environment)
- Requires manual approval in GitHub Actions

### Manual Deployment
```bash
./scripts/deploy-all.sh      # Deploy all services
./scripts/rollback.sh        # Rollback to previous version
```

## Common Development Tasks

### Adding a New API Endpoint
1. Create router in `backend/routers/`
2. Define Pydantic schemas in `backend/schemas/`
3. Implement business logic in `backend/services/`
4. Add router to `backend/main.py`
5. Update frontend API service in `frontend/services/`

### Working with the Database
1. Create/modify SQLAlchemy models in `backend/models/`
2. Generate migration: `cd backend && alembic revision --autogenerate -m "description"`
3. Review and apply migration: `alembic upgrade head`

### Implementing AI Features
1. AI services are centralized in `backend/services/ai/`
2. Use environment variables for API keys
3. Implement proper error handling and rate limiting
4. Add response caching where appropriate

## Project Status Notes

- **Testing**: Test infrastructure is set up but no tests are implemented yet
- **Frontend Tests**: Jest needs to be configured
- **Backend Tests**: pytest is installed but no test files exist
- **Current Branch**: `development-captain-fukabori` (active development)

## Recent Updates from Main Branch

### 1. **AI Counselor Feature** (GPT-4o-mini)
- Dating consultation and support
- Automatic profile generation
- Cost-effective AI model adoption

### 2. **Personality & Compatibility Features**
- MBTI personality test
- Marriage MBTI+ (marriage-focused version)
- Compatibility matching

### 3. **Conversation Practice Enhancements**
- Voice recognition (Whisper API)
- Shadowing practice
- Empathy/repetition/deep-diving practice modes
- Conversation quiz feature

### 4. **Infrastructure & Deployment Improvements**
- Azure Container Apps integration
- GitHub Actions CI/CD
- Production/development environment separation
- Docker optimization

### 5. **Documentation Organization**
- Project structure reorganization
- Deployment procedure documentation
- Security guidelines