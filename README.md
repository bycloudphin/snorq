# 🚀 SNORQ - Unified Chat System

> Empowering small businesses and creators to never miss a customer conversation, regardless of the platform.

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-20%2B-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/typescript-5.0%2B-blue.svg)](https://www.typescriptlang.org/)

---

## 📖 What is SNORQ?

SNORQ is an affordable, unified messaging platform that allows small businesses, freelancers, and influencers to manage all their social media conversations from a single dashboard. Think of it as a minimal, cost-effective alternative to enterprise solutions like Intercom, Zendesk, or Crisp.

### ✨ Key Features

- 📬 **Unified Inbox** - All your messages in one place
- ⚡ **Real-time Sync** - Instant message delivery via WebSockets
- 🎯 **Multi-Platform** - TikTok, WhatsApp, Facebook Messenger
- 💰 **Affordable** - Free tier available, Pro from $15/mo
- 🔒 **Secure** - End-to-end encryption, GDPR compliant

---

## 🏗️ Tech Stack

### Backend
- **Runtime**: Node.js 20+
- **Framework**: Fastify
- **Database**: PostgreSQL 15+
- **ORM**: Prisma
- **Real-time**: Socket.io
- **Cache**: Redis

### Frontend
- **Framework**: React 18+
- **Build Tool**: Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State**: Zustand + React Query

### Infrastructure
- **Hosting**: Railway
- **CDN**: Cloudflare
- **CI/CD**: GitHub Actions

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [Project Overview](./docs/01-PROJECT-OVERVIEW.md) | Vision, audience, and scope |
| [Technical Architecture](./docs/02-TECHNICAL-ARCHITECTURE.md) | System design and tech stack |
| [Database Schema](./docs/03-DATABASE-SCHEMA.md) | Prisma schema and data models |
| [API Documentation](./docs/04-API-DOCUMENTATION.md) | REST API and WebSocket events |
| [Platform Integrations](./docs/05-PLATFORM-INTEGRATIONS.md) | TikTok, WhatsApp, Facebook setup |
| [Development Setup](./docs/06-DEVELOPMENT-SETUP.md) | Getting started locally |
| [Deployment Guide](./docs/07-DEPLOYMENT-GUIDE.md) | Production deployment |
| [Feature Roadmap](./docs/08-FEATURE-ROADMAP.md) | Planned features by phase |
| [UI/UX Guidelines](./docs/09-UI-UX-GUIDELINES.md) | Design system and components |
| [Security & GDPR](./docs/10-SECURITY-GDPR.md) | Security practices and compliance |

---

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- PostgreSQL 15+
- Redis 7+
- Git

### Setup

```bash
# Clone the repository
git clone https://github.com/bycloudphin/snorq.git
cd snorq

# Install dependencies
npm run install:all

# Setup environment
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Start databases (Docker)
docker-compose up -d

# Run migrations
cd backend && npm run db:migrate

# Start development servers
npm run dev
```

### Access the App

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000/api/v1
- **API Health**: http://localhost:3000/api/v1/health

---

## 📁 Project Structure

```
snorq/
├── backend/              # Fastify API server
│   ├── src/
│   │   ├── routes/       # API endpoints
│   │   ├── services/     # Business logic
│   │   ├── middleware/   # Auth, rate limiting
│   │   ├── socket/       # WebSocket handlers
│   │   └── utils/        # Helpers, crypto
│   ├── prisma/           # Database schema
│   └── tests/            # Unit & integration tests
│
├── frontend/             # React + Vite client
│   ├── src/
│   │   ├── components/   # UI components
│   │   ├── pages/        # Route pages
│   │   ├── hooks/        # Custom React hooks
│   │   ├── services/     # API clients
│   │   └── store/        # Zustand stores
│   └── public/           # Static assets
│
├── docs/                 # Documentation
├── docker-compose.yml    # Local databases
└── README.md            # This file
```

---

## 💵 Pricing

| Plan | Price | Users | Features |
|------|-------|-------|----------|
| **Free** | $0/mo | 1 | Basic inbox, 30-day history |
| **Pro** | $15/mo | Up to 3 | Labels, notes, priority support |
| **Business** | $35/mo | Up to 4 | Analytics, API access |

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 🔒 Security

If you discover a security vulnerability, please email security@snorq.com instead of opening a public issue. We take all security reports seriously and will respond within 24 hours.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📞 Contact

- **Website**: https://snorq.com
- **Email**: hello@snorq.com
- **Twitter**: [@snorqapp](https://twitter.com/snorqapp)
- **Discord**: [Join our community](https://discord.gg/snorq)

---

<p align="center">
  Made with ❤️ for small businesses everywhere
</p>
