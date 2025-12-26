# SNORQ - Deployment Guide

## Overview

This guide covers deploying SNORQ to **Railway** (recommended), with instructions for alternative platforms.

---

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              CLOUDFLARE                                  │
│                    (DNS, CDN, SSL, DDoS Protection)                      │
│                                                                           │
│                        snorq.com → Frontend                              │
│                        api.snorq.com → Backend                           │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                              RAILWAY                                      │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐         │
│  │    Frontend     │  │     Backend     │  │    Databases    │         │
│  │   (Static/SSR)  │  │   (Fastify)     │  │  PostgreSQL +   │         │
│  │                 │  │                 │  │     Redis       │         │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Railway Deployment (Recommended)

### Why Railway?
- Simple, developer-friendly platform
- Built-in PostgreSQL and Redis
- Automatic deployments from GitHub
- Generous free tier
- Easy environment management

### Step 1: Create Railway Account

1. Go to [Railway.app](https://railway.app)
2. Sign up with GitHub
3. Create new project

### Step 2: Setup Databases

#### PostgreSQL

1. In Railway project, click **+ New**
2. Select **Database** → **PostgreSQL**
3. Click on PostgreSQL service
4. Copy connection string from **Connect** tab:
   - `DATABASE_URL` (use the internal URL for services in same project)

#### Redis

1. Click **+ New** → **Database** → **Redis**
2. Copy connection string:
   - `REDIS_URL`

### Step 3: Deploy Backend

#### Method A: GitHub Integration

1. Click **+ New** → **GitHub Repo**
2. Select your repository
3. Choose `backend` as root directory
4. Railway auto-detects Node.js

#### Method B: Railway CLI

```bash
# Install CLI
npm install -g @railway/cli

# Login
railway login

# Initialize in backend folder
cd backend
railway init

# Deploy
railway up
```

#### Configure Backend

Set these environment variables in Railway:

```env
# Server
NODE_ENV=production
PORT=3000

# Database (Railway provides this automatically if linked)
DATABASE_URL=${{Postgres.DATABASE_URL}}

# Redis (Railway provides this automatically if linked)
REDIS_URL=${{Redis.REDIS_URL}}

# JWT & Encryption
JWT_SECRET=your-production-jwt-secret
ENCRYPTION_KEY=your-production-encryption-key

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=https://api.snorq.com/api/v1/auth/google/callback

# Platform credentials (add as needed)
TIKTOK_CLIENT_KEY=...
TIKTOK_CLIENT_SECRET=...
WHATSAPP_APP_ID=...
# etc.

# Frontend URL
FRONTEND_URL=https://snorq.com
```

#### Configure Build

Create `railway.json` in backend:

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm run build && npm run db:migrate"
  },
  "deploy": {
    "startCommand": "npm run start",
    "healthcheckPath": "/api/v1/health",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 3
  }
}
```

#### Backend package.json Scripts

```json
{
  "scripts": {
    "build": "tsc",
    "start": "node dist/server.js",
    "db:migrate": "prisma migrate deploy",
    "db:generate": "prisma generate"
  }
}
```

### Step 4: Deploy Frontend

#### For Static SPA (Vite)

1. Click **+ New** → **GitHub Repo**
2. Select repository, set root to `frontend`
3. Set environment variables:

```env
VITE_API_URL=https://api.snorq.com/api/v1
VITE_WS_URL=https://api.snorq.com
```

#### Create `railway.json` in frontend:

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm run build"
  },
  "deploy": {
    "startCommand": "npx serve dist -s -l 3000"
  }
}
```

### Step 5: Configure Domains

1. In Railway, click on your service
2. Go to **Settings** → **Networking**
3. Click **Generate Domain** or add custom domain
4. For custom domains:
   - Add your domain (e.g., `api.snorq.com`)
   - Configure DNS (see Cloudflare section)

---

## Cloudflare Setup

### DNS Configuration

1. Add site to Cloudflare
2. Update nameservers at your registrar
3. Configure DNS records:

| Type | Name | Content | Proxy |
|------|------|---------|-------|
| CNAME | @ | frontend.railway.app | ✅ Proxied |
| CNAME | api | backend.railway.app | ✅ Proxied |
| CNAME | www | snorq.com | ✅ Proxied |

### SSL/TLS Settings

1. Go to **SSL/TLS** → **Overview**
2. Set encryption mode to **Full (strict)**
3. Enable **Always Use HTTPS**

### Security Settings

1. **Firewall Rules**: Block known bad actors
2. **Rate Limiting**: Add rate limiting rules
3. **Bot Management**: Enable bot protection
4. **DDoS Protection**: Already enabled by default

### Caching

1. Go to **Caching** → **Configuration**
2. Set caching level: **Standard**
3. For API routes, create Page Rule:
   - URL: `api.snorq.com/*`
   - Setting: Cache Level = Bypass

---

## CI/CD Pipeline

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Railway

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

env:
  RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci --workspaces
      
      - name: Run linting
        run: npm run lint
      
      - name: Run backend tests
        run: npm run test -w backend
        env:
          DATABASE_URL: ${{ secrets.TEST_DATABASE_URL }}
      
      - name: Run frontend tests
        run: npm run test -w frontend

  deploy-backend:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    steps:
      - uses: actions/checkout@v4
      
      - name: Install Railway CLI
        run: npm install -g @railway/cli
      
      - name: Deploy Backend
        run: |
          cd backend
          railway up --service backend
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}

  deploy-frontend:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    steps:
      - uses: actions/checkout@v4
      
      - name: Install Railway CLI
        run: npm install -g @railway/cli
      
      - name: Deploy Frontend
        run: |
          cd frontend
          railway up --service frontend
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
```

### GitHub Secrets

Add these secrets to your GitHub repository:

| Secret | Description |
|--------|-------------|
| `RAILWAY_TOKEN` | From Railway dashboard → Account Settings |
| `TEST_DATABASE_URL` | Test database for CI tests |

---

## Database Migrations

### Production Migrations

```bash
# Railway runs migrations automatically on deploy via:
# npm run db:migrate

# Manual migration (if needed)
railway run npx prisma migrate deploy
```

### Rollback Strategy

```bash
# Check migration status
railway run npx prisma migrate status

# Rollback (create down migration manually)
railway run npx prisma migrate resolve --rolled-back <migration_name>
```

---

## Monitoring & Logging

### Railway Observability

1. Click on service → **Observability**
2. View logs, metrics, and events
3. Set up alerts for failures

### Application Logging

Configure structured logging in production:

```typescript
// src/utils/logger.ts
import pino from 'pino';

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: process.env.NODE_ENV === 'development' 
    ? { target: 'pino-pretty' }
    : undefined,
  formatters: {
    level: (label) => ({ level: label.toUpperCase() })
  }
});
```

### Health Checks

```typescript
// src/routes/health.ts
fastify.get('/health', async (request, reply) => {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version,
    services: {
      database: await checkDatabase(),
      redis: await checkRedis()
    }
  };
  
  const allHealthy = Object.values(health.services).every(s => s === 'connected');
  
  return reply
    .code(allHealthy ? 200 : 503)
    .send(health);
});
```

---

## Scaling

### Horizontal Scaling (Railway Pro)

1. Go to service settings
2. Configure replicas (Pro plan required)
3. Railway handles load balancing

### Database Scaling

1. **Read Replicas**: Add PostgreSQL read replica for heavy read loads
2. **Connection Pooling**: Use PgBouncer for connection management

### Redis Scaling

1. Upgrade to larger instance
2. Consider Redis Cluster for high availability

---

## Backup Strategy

### Database Backups

Railway PostgreSQL includes automatic backups:
- Daily backups (7-day retention on free, 30-day on Pro)
- Point-in-time recovery (Pro)

### Manual Backup

```bash
# Create backup
railway run pg_dump $DATABASE_URL > backup.sql

# Restore backup
railway run psql $DATABASE_URL < backup.sql
```

### Export User Data (GDPR)

```typescript
// Implement data export endpoint
app.get('/api/v1/users/me/export', async (req, res) => {
  const userData = await exportUserData(req.user.id);
  res.json(userData);
});
```

---

## Security Checklist

### Pre-Deployment

- [ ] All secrets in environment variables (never in code)
- [ ] HTTPS enforced everywhere
- [ ] CORS configured correctly
- [ ] Rate limiting enabled
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention (Prisma handles this)
- [ ] XSS prevention (React handles most cases)

### Post-Deployment

- [ ] SSL certificate valid
- [ ] Security headers configured
- [ ] Error messages don't leak sensitive info
- [ ] Logging doesn't include sensitive data
- [ ] OAuth redirect URIs updated to production URLs
- [ ] Webhook secrets rotated from development

### Security Headers

Configure in Cloudflare or backend:

```typescript
// Fastify security headers
fastify.register(require('@fastify/helmet'), {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "wss:", "https:"]
    }
  }
});
```

---

## Rollback Procedures

### Quick Rollback

Railway keeps deployment history:

1. Go to service → **Deployments**
2. Find last working deployment
3. Click **Redeploy**

### Database Rollback

```bash
# If migration caused issues
railway run npx prisma migrate resolve --rolled-back <migration_name>

# Restore from backup if needed
railway run psql $DATABASE_URL < backup.sql
```

---

## Alternative Platforms

### Render

Similar to Railway, supports automatic deployments:

```yaml
# render.yaml
services:
  - type: web
    name: snorq-backend
    env: node
    buildCommand: npm install && npm run build
    startCommand: npm start
    envVars:
      - key: DATABASE_URL
        fromDatabase:
          name: snorq-db
          property: connectionString

  - type: web
    name: snorq-frontend
    env: static
    buildCommand: npm install && npm run build
    staticPublishPath: ./dist

databases:
  - name: snorq-db
    plan: starter
```

### Vercel + PlanetScale + Upstash

- **Frontend**: Vercel (optimal for React/Next.js)
- **Backend**: Vercel Serverless Functions
- **Database**: PlanetScale (serverless MySQL)
- **Redis**: Upstash (serverless Redis)

### DigitalOcean App Platform

Similar managed platform experience:

```yaml
# .do/app.yaml
name: snorq
services:
  - name: backend
    source:
      repo: username/snorq
      branch: main
      source_dir: backend
    build_command: npm run build
    run_command: npm start
    environment_slug: node-js

  - name: frontend
    source:
      repo: username/snorq
      branch: main
      source_dir: frontend
    build_command: npm run build
    environment_slug: node-js
    output_dir: dist
```

---

## Cost Estimation

### Railway (Recommended)

| Resource | Hobby | Pro |
|----------|-------|-----|
| Backend | $5/mo | $20/mo |
| Frontend | $5/mo | $10/mo |
| PostgreSQL | Included | Included |
| Redis | Included | Included |
| **Total** | **~$10/mo** | **~$30/mo** |

### Cloudflare

| Service | Cost |
|---------|------|
| DNS | Free |
| CDN | Free |
| SSL | Free |
| DDoS Protection | Free |
| **Total** | **Free** |

### Platform APIs

| Platform | Cost |
|----------|------|
| TikTok | Free (rate limited) |
| WhatsApp Cloud API | $0.005-0.09/message |
| Facebook Messenger | Free (within limits) |

---

## Maintenance

### Regular Tasks

| Task | Frequency |
|------|-----------|
| Review logs | Daily |
| Check error rates | Daily |
| Database backup verification | Weekly |
| Dependency updates | Weekly |
| Security patches | As needed |
| SSL certificate renewal | Automatic (Cloudflare) |

### Updating Dependencies

```bash
# Check for updates
npm outdated

# Update patch versions
npm update

# Update major versions (review breaking changes)
npm install package@latest
```
