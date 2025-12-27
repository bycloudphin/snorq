# Railway Deployment Guide for SNORQ

This guide walks you through deploying SNORQ to Railway with the custom domain `snorq.xyz`.

## Prerequisites

1. A [Railway](https://railway.app) account
2. The Railway CLI installed (`npm install -g @railway/cli`)
3. Your domain `snorq.xyz` ready for configuration

## Architecture Overview

SNORQ is deployed as a **multi-service** application on Railway:

```
┌─────────────────────────────────────────────────────────┐
│                    Railway Project                       │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐  │
│  │  Frontend   │  │   Backend   │  │   PostgreSQL    │  │
│  │  (Vite)     │  │  (Fastify)  │  │    (Railway)    │  │
│  │             │  │             │  │                 │  │
│  │ snorq.xyz   │  │api.snorq.xyz│  │  Internal URL   │  │
│  └─────────────┘  └─────────────┘  └─────────────────┘  │
│                                                          │
│  ┌─────────────────┐                                     │
│  │     Redis       │                                     │
│  │   (Railway)     │                                     │
│  │   Internal URL  │                                     │
│  └─────────────────┘                                     │
└─────────────────────────────────────────────────────────┘
```

## Step 1: Login to Railway CLI

```bash
railway login
```

## Step 2: Create a New Project

```bash
# Navigate to your project root
cd /path/to/SNORQ

# Create a new Railway project
railway init
```

Select "Empty Project" when prompted.

## Step 3: Add PostgreSQL Database

1. Go to your Railway project dashboard
2. Click **"+ New"** → **"Database"** → **"PostgreSQL"**
3. Railway will automatically provision the database
4. Copy the `DATABASE_URL` from the PostgreSQL service variables

## Step 4: Add Redis

1. In your Railway project dashboard
2. Click **"+ New"** → **"Database"** → **"Redis"**
3. Copy the `REDIS_URL` from the Redis service variables

## Step 5: Deploy the Backend Service

### Create the Backend Service

1. Click **"+ New"** → **"GitHub Repo"**
2. Select your SNORQ repository
3. In the service settings:
   - **Root Directory**: `backend`
   - **Build Command**: `npm ci && npm run build`
   - **Start Command**: `npm run db:migrate && npm start`

### Configure Backend Environment Variables

Add these environment variables in the Railway dashboard:

```env
NODE_ENV=production
PORT=3000
HOST=0.0.0.0

# Database (use Railway's variable reference)
DATABASE_URL=${{Postgres.DATABASE_URL}}

# Redis (use Railway's variable reference)
REDIS_URL=${{Redis.REDIS_URL}}

# JWT & Auth (generate secure values)
JWT_SECRET=<generate-with-crypto>
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# Encryption (generate secure value)
ENCRYPTION_KEY=<generate-64-char-hex>

# Frontend URL (for CORS)
FRONTEND_URL=https://snorq.xyz

# Google OAuth (if using)
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REDIRECT_URI=https://api.snorq.xyz/api/v1/auth/google/callback
```

### Generate Secret Keys

Run these commands to generate secure keys:

```bash
# Generate JWT_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate ENCRYPTION_KEY
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Step 6: Deploy the Frontend Service

### Create the Frontend Service

1. Click **"+ New"** → **"GitHub Repo"**
2. Select your SNORQ repository (same repo, different service)
3. In the service settings:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm ci && npm run build`
   - **Start Command**: `npx serve -s dist -l $PORT`

### Configure Frontend Environment Variables

Add these environment variables:

```env
VITE_API_URL=https://api.snorq.xyz/api/v1
VITE_WS_URL=https://api.snorq.xyz
VITE_APP_NAME=SNORQ
VITE_APP_DESCRIPTION=Unified Chat System
```

## Step 7: Configure Custom Domain (snorq.xyz)

### Frontend Domain (snorq.xyz)

1. Select the **Frontend** service in Railway
2. Go to **Settings** → **Networking** → **Custom Domain**
3. Add `snorq.xyz` and `www.snorq.xyz`
4. Railway will provide DNS records to configure

### Backend Domain (api.snorq.xyz)

1. Select the **Backend** service in Railway
2. Go to **Settings** → **Networking** → **Custom Domain**
3. Add `api.snorq.xyz`
4. Railway will provide DNS records

### DNS Configuration

Add these records to your domain registrar (for snorq.xyz):

| Type  | Name | Value                          |
|-------|------|--------------------------------|
| CNAME | @    | `<frontend-service>.up.railway.app` |
| CNAME | www  | `<frontend-service>.up.railway.app` |
| CNAME | api  | `<backend-service>.up.railway.app`  |

> **Note**: If your registrar doesn't support CNAME on root (@), use Railway's provided IP address as an A record instead.

## Step 8: Verify Deployment

1. **Backend Health Check**: Visit `https://api.snorq.xyz/api/v1/health`
2. **Frontend**: Visit `https://snorq.xyz`

## Environment Variables Summary

### Backend (Required)

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `REDIS_URL` | Redis connection string |
| `JWT_SECRET` | Secret for JWT signing |
| `ENCRYPTION_KEY` | Key for encryption |
| `FRONTEND_URL` | Frontend URL for CORS |

### Frontend (Required)

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API URL |
| `VITE_WS_URL` | WebSocket URL |

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure `FRONTEND_URL` in backend matches your frontend domain exactly
2. **Database Connection**: Verify PostgreSQL is running and `DATABASE_URL` is correct
3. **Build Failures**: Check Railway build logs for errors

### View Logs

```bash
# Using Railway CLI
railway logs -s backend
railway logs -s frontend
```

## Continuous Deployment

Railway automatically deploys on every push to your main branch. To disable:

1. Go to service settings
2. Disable "Auto Deploy"

## Cost Estimation

Railway pricing (as of 2024):
- **Starter Plan**: $5/month credit included
- **Pro Plan**: $20/month + usage

For SNORQ with moderate traffic:
- Frontend: ~$3-5/month
- Backend: ~$5-10/month
- PostgreSQL: ~$5-10/month
- Redis: ~$3-5/month

**Estimated Total**: ~$15-30/month

---

## Quick Deploy Commands

```bash
# Login to Railway
railway login

# Link to project (after creating in dashboard)
railway link

# Deploy manually
railway up

# View logs
railway logs

# Open dashboard
railway open
```

For questions or issues, check Railway's [documentation](https://docs.railway.app/).
