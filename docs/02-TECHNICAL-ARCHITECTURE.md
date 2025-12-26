# SNORQ - Technical Architecture

## Technology Stack

### Backend
| Technology | Purpose | Why Chosen |
|------------|---------|------------|
| **Node.js 20+** | Runtime | Fast, async, great for real-time apps |
| **Fastify** | Web Framework | Fastest Node.js framework, schema validation |
| **PostgreSQL 15+** | Database | Reliable, scalable, excellent JSON support |
| **Prisma** | ORM | Type-safe, auto-generated types, migrations |
| **Socket.io** | Real-time | Reliable WebSocket with fallbacks |
| **Redis** | Caching/Queues | Session storage, message queues, pub/sub |
| **Bull** | Job Queue | Background jobs for message sync |

### Frontend
| Technology | Purpose | Why Chosen |
|------------|---------|------------|
| **React 18+** | UI Framework | Component-based, large ecosystem |
| **Vite** | Build Tool | Fast HMR, optimized builds |
| **TypeScript** | Language | Type safety, better DX |
| **Tailwind CSS** | Styling | Rapid UI development, utility-first |
| **React Query** | Data Fetching | Caching, background updates |
| **Zustand** | State Management | Simple, lightweight |
| **Socket.io Client** | Real-time | WebSocket client |

### Infrastructure
| Technology | Purpose | Why Chosen |
|------------|---------|------------|
| **Railway** | Hosting | Simple deployment, PostgreSQL included |
| **Cloudflare** | CDN/DNS | Free tier, DDoS protection |
| **GitHub Actions** | CI/CD | Free, integrated with repo |

---

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                  CLIENTS                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                        │
│  │ Web Browser  │  │ Mobile (Future) │  │ API Clients │                       │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘                        │
└─────────┼─────────────────┼─────────────────┼────────────────────────────────┘
          │                 │                 │
          │         HTTPS / WSS              │
          ▼                 ▼                 ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLOUDFLARE CDN                                   │
│                    (SSL Termination, DDoS Protection)                         │
└─────────────────────────────────┬───────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              RAILWAY PLATFORM                                 │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │                         FRONTEND SERVICE                                │ │
│  │  ┌─────────────────────────────────────────────────────────────────┐   │ │
│  │  │                    React + Vite + Tailwind                       │   │ │
│  │  │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐            │   │ │
│  │  │  │ Inbox   │  │ Chat    │  │ Settings│  │ Auth    │            │   │ │
│  │  │  │ View    │  │ View    │  │ View    │  │ Pages   │            │   │ │
│  │  │  └─────────┘  └─────────┘  └─────────┘  └─────────┘            │   │ │
│  │  └─────────────────────────────────────────────────────────────────┘   │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                    │                                          │
│                                    ▼                                          │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │                         BACKEND SERVICE                                 │ │
│  │  ┌─────────────────────────────────────────────────────────────────┐   │ │
│  │  │                    Fastify + Node.js                             │   │ │
│  │  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │   │ │
│  │  │  │ REST API    │  │ WebSocket   │  │ OAuth       │              │   │ │
│  │  │  │ Routes      │  │ Server      │  │ Handler     │              │   │ │
│  │  │  └─────────────┘  └─────────────┘  └─────────────┘              │   │ │
│  │  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │   │ │
│  │  │  │ Platform    │  │ Message     │  │ Background  │              │   │ │
│  │  │  │ Connectors  │  │ Queue       │  │ Workers     │              │   │ │
│  │  │  └─────────────┘  └─────────────┘  └─────────────┘              │   │ │
│  │  └─────────────────────────────────────────────────────────────────┘   │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                    │                                          │
│          ┌─────────────────────────┼─────────────────────────┐               │
│          ▼                         ▼                         ▼               │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐           │
│  │   PostgreSQL     │  │      Redis       │  │   File Storage   │           │
│  │   (Primary DB)   │  │  (Cache/Queue)   │  │    (Future)      │           │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘           │
└─────────────────────────────────────────────────────────────────────────────┘
                                  │
          ┌───────────────────────┼───────────────────────┐
          ▼                       ▼                       ▼
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│   TikTok API     │  │  WhatsApp API    │  │  Facebook API    │
│   (Webhooks)     │  │  (Cloud API)     │  │  (Graph API)     │
└──────────────────┘  └──────────────────┘  └──────────────────┘
```

---

## Component Architecture

### Backend Modules

```
backend/
├── src/
│   ├── app.ts                 # Fastify app initialization
│   ├── server.ts              # Server entry point
│   │
│   ├── config/
│   │   ├── index.ts           # Environment config
│   │   ├── database.ts        # Database config
│   │   └── redis.ts           # Redis config
│   │
│   ├── routes/
│   │   ├── index.ts           # Route aggregator
│   │   ├── auth.ts            # Authentication routes
│   │   ├── users.ts           # User management routes
│   │   ├── conversations.ts   # Conversation routes
│   │   ├── messages.ts        # Message routes
│   │   ├── platforms.ts       # Platform connection routes
│   │   └── webhooks/
│   │       ├── tiktok.ts      # TikTok webhook handler
│   │       ├── whatsapp.ts    # WhatsApp webhook handler
│   │       └── facebook.ts    # Facebook webhook handler
│   │
│   ├── services/
│   │   ├── auth.service.ts    # Authentication logic
│   │   ├── user.service.ts    # User management
│   │   ├── conversation.service.ts
│   │   ├── message.service.ts
│   │   └── platforms/
│   │       ├── base.platform.ts      # Base platform class
│   │       ├── tiktok.platform.ts    # TikTok integration
│   │       ├── whatsapp.platform.ts  # WhatsApp integration
│   │       └── facebook.platform.ts  # Facebook integration
│   │
│   ├── workers/
│   │   ├── message-sync.worker.ts    # Background message sync
│   │   └── notification.worker.ts    # Future: notifications
│   │
│   ├── middleware/
│   │   ├── auth.middleware.ts        # JWT validation
│   │   ├── rate-limit.middleware.ts  # Rate limiting
│   │   └── error.middleware.ts       # Error handling
│   │
│   ├── utils/
│   │   ├── logger.ts          # Logging utility
│   │   ├── crypto.ts          # Encryption utilities
│   │   └── validators.ts      # Input validation
│   │
│   ├── types/
│   │   ├── index.ts           # Type exports
│   │   ├── api.types.ts       # API request/response types
│   │   ├── platform.types.ts  # Platform-specific types
│   │   └── socket.types.ts    # WebSocket event types
│   │
│   └── socket/
│       ├── index.ts           # Socket.io setup
│       ├── handlers.ts        # Socket event handlers
│       └── rooms.ts           # Room management
│
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── migrations/            # Database migrations
│
├── tests/
│   ├── unit/
│   └── integration/
│
├── package.json
├── tsconfig.json
└── .env.example
```

### Frontend Modules

```
frontend/
├── src/
│   ├── main.tsx               # App entry point
│   ├── App.tsx                # Root component
│   │
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Avatar.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Spinner.tsx
│   │   │   └── Toast.tsx
│   │   │
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── MainLayout.tsx
│   │   │   └── AuthLayout.tsx
│   │   │
│   │   ├── inbox/
│   │   │   ├── ConversationList.tsx
│   │   │   ├── ConversationItem.tsx
│   │   │   ├── ConversationFilter.tsx
│   │   │   └── SearchBar.tsx
│   │   │
│   │   ├── chat/
│   │   │   ├── ChatWindow.tsx
│   │   │   ├── MessageList.tsx
│   │   │   ├── MessageItem.tsx
│   │   │   ├── MessageInput.tsx
│   │   │   ├── ChatHeader.tsx
│   │   │   └── ContactInfo.tsx
│   │   │
│   │   ├── platforms/
│   │   │   ├── PlatformIcon.tsx
│   │   │   ├── PlatformBadge.tsx
│   │   │   └── ConnectPlatform.tsx
│   │   │
│   │   └── settings/
│   │       ├── ProfileSettings.tsx
│   │       ├── PlatformSettings.tsx
│   │       └── TeamSettings.tsx
│   │
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── Login.tsx
│   │   │   └── Callback.tsx
│   │   │
│   │   ├── dashboard/
│   │   │   └── Inbox.tsx
│   │   │
│   │   ├── settings/
│   │   │   ├── Profile.tsx
│   │   │   ├── Platforms.tsx
│   │   │   └── Team.tsx
│   │   │
│   │   └── NotFound.tsx
│   │
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useSocket.ts
│   │   ├── useConversations.ts
│   │   ├── useMessages.ts
│   │   └── usePlatforms.ts
│   │
│   ├── services/
│   │   ├── api.ts             # Axios instance
│   │   ├── auth.service.ts
│   │   ├── conversation.service.ts
│   │   ├── message.service.ts
│   │   └── platform.service.ts
│   │
│   ├── store/
│   │   ├── index.ts           # Zustand store
│   │   ├── authStore.ts
│   │   ├── conversationStore.ts
│   │   └── uiStore.ts
│   │
│   ├── utils/
│   │   ├── formatters.ts
│   │   ├── validators.ts
│   │   └── constants.ts
│   │
│   ├── types/
│   │   ├── index.ts
│   │   ├── api.types.ts
│   │   └── socket.types.ts
│   │
│   └── styles/
│       └── index.css          # Tailwind imports + custom CSS
│
├── public/
│   ├── favicon.ico
│   └── assets/
│
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
├── vite.config.ts
└── .env.example
```

---

## Data Flow

### 1. Incoming Message Flow

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  Platform    │────▶│   Webhook    │────▶│   Message    │────▶│   Database   │
│  (TikTok/    │     │   Handler    │     │   Service    │     │  (Postgres)  │
│  WhatsApp/FB)│     │              │     │              │     │              │
└──────────────┘     └──────────────┘     └──────┬───────┘     └──────────────┘
                                                 │
                                                 ▼
                     ┌──────────────┐     ┌──────────────┐
                     │    User's    │◀────│   Socket.io  │
                     │   Browser    │     │   Emit       │
                     └──────────────┘     └──────────────┘
```

### 2. Outgoing Message Flow

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│    User's    │────▶│   REST API   │────▶│   Message    │────▶│   Database   │
│   Browser    │     │   Endpoint   │     │   Service    │     │              │
└──────────────┘     └──────────────┘     └──────┬───────┘     └──────────────┘
                                                 │
                                                 ▼
                     ┌──────────────┐     ┌──────────────┐
                     │   Platform   │◀────│   Platform   │
                     │   (External) │     │   Service    │
                     └──────────────┘     └──────────────┘
```

---

## Real-time Architecture (Socket.io)

### Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `connection` | Client → Server | User connects |
| `authenticate` | Client → Server | Send auth token |
| `authenticated` | Server → Client | Auth successful |
| `join:inbox` | Client → Server | Join inbox room |
| `new:message` | Server → Client | New message received |
| `message:sent` | Server → Client | Message sent confirmation |
| `message:delivered` | Server → Client | Message delivered (future) |
| `message:read` | Server → Client | Message read (future) |
| `conversation:updated` | Server → Client | Conversation state changed |
| `platform:status` | Server → Client | Platform connection status |
| `typing:start` | Both | User started typing |
| `typing:stop` | Both | User stopped typing |
| `disconnect` | Client → Server | User disconnects |

### Rooms

| Room Pattern | Description |
|--------------|-------------|
| `user:{userId}` | Personal notifications |
| `org:{orgId}` | Organization-wide updates |
| `conversation:{conversationId}` | Specific conversation updates |

---

## Security Architecture

### Authentication Flow (Google OAuth)

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│  Client  │────▶│  Google  │────▶│  Backend │────▶│ Database │
│          │     │  OAuth   │     │          │     │          │
└──────────┘     └──────────┘     └──────────┘     └──────────┘
     │                │                │                │
     │  1. Click      │                │                │
     │  "Login"       │                │                │
     │───────────────▶│                │                │
     │                │                │                │
     │  2. Redirect   │                │                │
     │  to Google     │                │                │
     │◀───────────────│                │                │
     │                │                │                │
     │  3. User       │                │                │
     │  Authorizes    │                │                │
     │───────────────▶│                │                │
     │                │                │                │
     │  4. Redirect   │                │                │
     │  with code     │                │                │
     │◀───────────────│                │                │
     │                │                │                │
     │  5. Exchange   │                │                │
     │  code          │───────────────▶│                │
     │                │                │                │
     │                │  6. Get user   │                │
     │                │  info          │                │
     │                │◀───────────────│                │
     │                │                │                │
     │                │                │  7. Create/    │
     │                │                │  Update user   │
     │                │                │───────────────▶│
     │                │                │                │
     │  8. Set JWT    │                │                │
     │  cookie        │◀───────────────│                │
     │◀───────────────│                │                │
```

### Token Strategy

| Token Type | Storage | Lifetime | Purpose |
|------------|---------|----------|---------|
| Access Token | HTTP-only Cookie | 15 minutes | API authentication |
| Refresh Token | HTTP-only Cookie | 7 days | Token refresh |
| Platform Tokens | Encrypted in DB | Varies | Platform API access |

---

## Error Handling Strategy

### Error Codes

| Code Range | Category | Example |
|------------|----------|---------|
| 400-499 | Client Errors | 401 Unauthorized, 404 Not Found |
| 500-599 | Server Errors | 500 Internal Error |
| 1000-1999 | Auth Errors | 1001 Token Expired |
| 2000-2999 | Platform Errors | 2001 TikTok Connection Failed |
| 3000-3999 | Rate Limit | 3001 Too Many Requests |

### Error Response Format

```json
{
  "success": false,
  "error": {
    "code": 1001,
    "message": "Token expired",
    "details": "Your session has expired. Please log in again."
  },
  "timestamp": "2024-12-26T18:30:00Z"
}
```

---

## Performance Considerations

### Database Indexes

```sql
-- Most frequently queried
CREATE INDEX idx_messages_conversation ON messages(conversation_id, created_at DESC);
CREATE INDEX idx_conversations_org ON conversations(organization_id, updated_at DESC);
CREATE INDEX idx_conversations_platform ON conversations(platform, updated_at DESC);
CREATE INDEX idx_users_email ON users(email);
```

### Caching Strategy (Redis)

| Key Pattern | TTL | Purpose |
|-------------|-----|---------|
| `session:{userId}` | 24h | User session data |
| `conv:{conversationId}` | 5min | Conversation cache |
| `platform:{platformId}:status` | 1min | Platform health |
| `rate:{userId}:{endpoint}` | 1min | Rate limiting |

---

## Scalability Path

### Phase 1: Single Server (MVP)
- Single Railway instance
- PostgreSQL on Railway
- Redis on Railway
- Handles ~1000 concurrent users

### Phase 2: Horizontal Scaling
- Multiple backend instances
- Load balancer
- Redis for session sharing
- PostgreSQL read replicas

### Phase 3: Microservices (Future)
- Separate services for platforms
- Message queue between services
- Independent scaling per platform
