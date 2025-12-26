# SNORQ - Development Setup Guide

## Prerequisites

Before starting, ensure you have the following installed:

| Tool | Version | Check Command |
|------|---------|---------------|
| Node.js | 20+ LTS | `node --version` |
| npm | 10+ | `npm --version` |
| PostgreSQL | 15+ | `psql --version` |
| Redis | 7+ | `redis-server --version` |
| Git | 2.40+ | `git --version` |

---

## Quick Start

```bash
# 1. Clone repository
git clone https://github.com/yourusername/snorq.git
cd snorq

# 2. Install dependencies
npm run install:all

# 3. Setup environment files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# 4. Start databases (if using Docker)
docker-compose up -d postgres redis

# 5. Run database migrations
cd backend && npm run db:migrate

# 6. Start development servers
npm run dev
```

---

## Detailed Setup

### 1. Repository Structure

```
snorq/
├── backend/          # Fastify API server
├── frontend/         # React + Vite client
├── docs/             # Documentation
├── docker-compose.yml
├── package.json      # Root workspace config
└── README.md
```

### 2. Backend Setup

#### Navigate to Backend

```bash
cd backend
```

#### Install Dependencies

```bash
npm install
```

#### Environment Configuration

Create `.env` file:

```env
# ===========================================
# SERVER
# ===========================================
NODE_ENV=development
PORT=3000
HOST=0.0.0.0

# ===========================================
# DATABASE
# ===========================================
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/snorq?schema=public"

# ===========================================
# REDIS
# ===========================================
REDIS_URL="redis://localhost:6379"

# ===========================================
# JWT & AUTH
# ===========================================
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# ===========================================
# ENCRYPTION
# ===========================================
ENCRYPTION_KEY=your-32-byte-hex-encryption-key-here

# ===========================================
# GOOGLE OAUTH
# ===========================================
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:3000/api/v1/auth/google/callback

# ===========================================
# TIKTOK
# ===========================================
TIKTOK_CLIENT_KEY=your-tiktok-client-key
TIKTOK_CLIENT_SECRET=your-tiktok-client-secret
TIKTOK_REDIRECT_URI=http://localhost:3000/api/v1/platforms/callback/tiktok
TIKTOK_WEBHOOK_SECRET=your-tiktok-webhook-secret

# ===========================================
# WHATSAPP (Meta Cloud API)
# ===========================================
WHATSAPP_APP_ID=your-whatsapp-app-id
WHATSAPP_APP_SECRET=your-whatsapp-app-secret
WHATSAPP_PHONE_NUMBER_ID=your-phone-number-id
WHATSAPP_VERIFY_TOKEN=your-custom-verify-token
WHATSAPP_ACCESS_TOKEN=your-access-token

# ===========================================
# FACEBOOK MESSENGER
# ===========================================
FACEBOOK_APP_ID=your-facebook-app-id
FACEBOOK_APP_SECRET=your-facebook-app-secret
FACEBOOK_PAGE_ACCESS_TOKEN=your-page-access-token
FACEBOOK_VERIFY_TOKEN=your-custom-verify-token

# ===========================================
# FRONTEND URL (for CORS & redirects)
# ===========================================
FRONTEND_URL=http://localhost:5173

# ===========================================
# LOGGING
# ===========================================
LOG_LEVEL=debug
```

#### Generate Encryption Key

```bash
# Generate 32-byte hex key
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

#### Setup Database

```bash
# Create database (if not using Docker)
createdb snorq

# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# Seed database (optional)
npm run db:seed
```

#### Start Development Server

```bash
npm run dev
```

The backend will be available at: `http://localhost:3000`

---

### 3. Frontend Setup

#### Navigate to Frontend

```bash
cd frontend
```

#### Install Dependencies

```bash
npm install
```

#### Environment Configuration

Create `.env` file:

```env
# ===========================================
# API
# ===========================================
VITE_API_URL=http://localhost:3000/api/v1
VITE_WS_URL=http://localhost:3000

# ===========================================
# APP
# ===========================================
VITE_APP_NAME=SNORQ
VITE_APP_DESCRIPTION=Unified Chat System
```

#### Start Development Server

```bash
npm run dev
```

The frontend will be available at: `http://localhost:5173`

---

### 4. Database Setup Options

#### Option A: Docker (Recommended)

```yaml
# docker-compose.yml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: snorq-postgres
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: snorq
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    container_name: snorq-redis
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

```bash
# Start services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f postgres

# Stop services
docker-compose down
```

#### Option B: Local Installation (macOS)

```bash
# Install PostgreSQL
brew install postgresql@15
brew services start postgresql@15

# Install Redis
brew install redis
brew services start redis

# Create database
createdb snorq
```

#### Option B: Local Installation (Ubuntu/Debian)

```bash
# Install PostgreSQL
sudo apt update
sudo apt install postgresql-15

# Start service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create user and database
sudo -u postgres createuser --interactive
sudo -u postgres createdb snorq

# Install Redis
sudo apt install redis-server
sudo systemctl start redis-server
```

---

### 5. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project or select existing
3. Navigate to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth client ID**
5. Configure consent screen if needed
6. Choose **Web application**
7. Add authorized redirect URIs:
   - `http://localhost:3000/api/v1/auth/google/callback` (development)
   - `https://api.snorq.com/api/v1/auth/google/callback` (production)
8. Copy **Client ID** and **Client Secret** to `.env`

---

### 6. Running the Full Stack

#### Using npm workspaces (from root)

```bash
# Install all dependencies
npm run install:all

# Start both frontend and backend
npm run dev

# Or start separately
npm run dev:backend
npm run dev:frontend
```

#### Package.json Scripts (root)

```json
{
  "workspaces": ["backend", "frontend"],
  "scripts": {
    "install:all": "npm install --workspaces",
    "dev": "concurrently \"npm run dev:backend\" \"npm run dev:frontend\"",
    "dev:backend": "npm run dev -w backend",
    "dev:frontend": "npm run dev -w frontend",
    "build": "npm run build -w backend && npm run build -w frontend",
    "lint": "npm run lint -w backend && npm run lint -w frontend",
    "test": "npm run test -w backend && npm run test -w frontend"
  }
}
```

---

## IDE Setup

### VS Code (Recommended)

#### Extensions

Install these extensions:

```
- ESLint
- Prettier - Code formatter
- Prisma
- Tailwind CSS IntelliSense
- ES7+ React/Redux/React-Native snippets
- GitLens
- Thunder Client (API testing)
```

#### Workspace Settings

Create `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "typescript.preferences.importModuleSpecifier": "relative",
  "typescript.updateImportsOnFileMove.enabled": "always",
  "tailwindCSS.includeLanguages": {
    "typescript": "javascript",
    "typescriptreact": "javascript"
  },
  "files.associations": {
    "*.css": "tailwindcss"
  },
  "[prisma]": {
    "editor.defaultFormatter": "Prisma.prisma"
  }
}
```

#### Launch Configuration

Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Backend",
      "type": "node",
      "request": "launch",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["run", "dev"],
      "cwd": "${workspaceFolder}/backend",
      "console": "integratedTerminal",
      "skipFiles": ["<node_internals>/**"]
    },
    {
      "name": "Debug Frontend",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:5173",
      "webRoot": "${workspaceFolder}/frontend/src"
    }
  ]
}
```

---

## Testing Webhooks Locally

### Using ngrok

```bash
# Install ngrok
brew install ngrok  # macOS
# or download from https://ngrok.com/

# Start ngrok tunnel
ngrok http 3000

# You'll get a URL like: https://abc123.ngrok.io
# Use this for webhook endpoints
```

### Webhook URLs for Development

| Platform | Webhook URL |
|----------|-------------|
| TikTok | `https://abc123.ngrok.io/api/v1/webhooks/tiktok` |
| WhatsApp | `https://abc123.ngrok.io/api/v1/webhooks/whatsapp` |
| Facebook | `https://abc123.ngrok.io/api/v1/webhooks/facebook` |

---

## Common Commands

### Backend

```bash
cd backend

# Development
npm run dev           # Start dev server with hot reload
npm run build         # Build for production
npm run start         # Start production server

# Database
npm run db:generate   # Generate Prisma client
npm run db:migrate    # Run pending migrations
npm run db:push       # Push schema changes (dev only)
npm run db:studio     # Open Prisma Studio (GUI)
npm run db:seed       # Seed database

# Testing
npm run test          # Run all tests
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Generate coverage report

# Linting
npm run lint          # Check for issues
npm run lint:fix      # Auto-fix issues
npm run format        # Format with Prettier
```

### Frontend

```bash
cd frontend

# Development
npm run dev           # Start dev server
npm run build         # Build for production
npm run preview       # Preview production build

# Testing
npm run test          # Run tests
npm run test:ui       # Run tests with UI

# Linting
npm run lint          # Check for issues
npm run format        # Format with Prettier
```

---

## Troubleshooting

### Database Connection Issues

```bash
# Check PostgreSQL is running
pg_isready

# Check if database exists
psql -l | grep snorq

# Reset database (WARNING: deletes all data)
npm run db:migrate reset
```

### Port Already in Use

```bash
# Find process using port
lsof -i :3000  # Backend
lsof -i :5173  # Frontend

# Kill process
kill -9 <PID>
```

### Node Module Issues

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
rm -rf backend/node_modules backend/package-lock.json
rm -rf frontend/node_modules frontend/package-lock.json
npm install
```

### Prisma Issues

```bash
cd backend

# Regenerate Prisma client
npm run db:generate

# Reset migrations (WARNING: deletes all data)
npx prisma migrate reset

# View current database state
npx prisma db pull
```

### TypeScript Errors

```bash
# Clear TypeScript cache
rm -rf node_modules/.cache

# Rebuild
npm run build
```

---

## Environment Variables Reference

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/snorq` |
| `REDIS_URL` | Redis connection string | `redis://localhost:6379` |
| `JWT_SECRET` | JWT signing secret (32+ chars) | Generated string |
| `ENCRYPTION_KEY` | AES encryption key (32 bytes hex) | Generated hex |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | `xxx.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | Secret string |

### Optional Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | 3000 | Backend server port |
| `NODE_ENV` | development | Environment mode |
| `LOG_LEVEL` | info | Logging verbosity |
| `FRONTEND_URL` | http://localhost:5173 | Frontend URL for CORS |

---

## Next Steps

After completing setup:

1. ✅ Verify backend is running: `http://localhost:3000/api/v1/health`
2. ✅ Verify frontend is running: `http://localhost:5173`
3. ✅ Connect Google OAuth
4. ✅ Test database connection: `npm run db:studio`
5. 📚 Continue to [API Documentation](./04-API-DOCUMENTATION.md)
6. 🔌 Configure platforms: [Platform Integrations](./05-PLATFORM-INTEGRATIONS.md)
