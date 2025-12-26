# SNORQ - API Documentation

## Overview

SNORQ provides a RESTful API for managing conversations, messages, and platform connections. All API endpoints are prefixed with `/api/v1`.

---

## Base URL

| Environment | URL |
|-------------|-----|
| Development | `http://localhost:3000/api/v1` |
| Production | `https://api.snorq.com/api/v1` |

---

## Authentication

All API requests (except auth endpoints) require authentication via JWT token in HTTP-only cookies.

### Authentication Flow

1. User initiates Google OAuth login
2. Backend exchanges OAuth code for tokens
3. JWT access token set in HTTP-only cookie
4. All subsequent requests include cookie automatically

### Token Types

| Token | Location | Lifetime |
|-------|----------|----------|
| Access Token | Cookie: `access_token` | 15 minutes |
| Refresh Token | Cookie: `refresh_token` | 7 days |

---

## Response Format

### Success Response

```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "hasMore": true
  }
}
```

### Error Response

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

## Error Codes

| Code | Category | Description |
|------|----------|-------------|
| 400 | Bad Request | Invalid request data |
| 401 | Unauthorized | Authentication required |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Error | Server error |
| 1001 | Auth | Token expired |
| 1002 | Auth | Invalid token |
| 2001 | Platform | TikTok connection failed |
| 2002 | Platform | WhatsApp connection failed |
| 2003 | Platform | Facebook connection failed |

---

## Rate Limiting

| Plan | Requests/minute | Burst |
|------|-----------------|-------|
| Free | 60 | 10 |
| Pro | 300 | 50 |
| Business | 1000 | 100 |

Rate limit headers:
```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1703614800
```

---

# API Endpoints

## Authentication

### GET `/auth/google`

Initiates Google OAuth flow. Redirects to Google login page.

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `redirect` | string | No | URL to redirect after login |

**Response:** Redirect to Google OAuth

---

### GET `/auth/google/callback`

Handles Google OAuth callback. Sets JWT cookies and redirects to app.

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `code` | string | Yes | OAuth authorization code |
| `state` | string | Yes | CSRF state token |

**Response:** Redirect to app with cookies set

---

### POST `/auth/logout`

Logs out user and clears auth cookies.

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Logged out successfully"
  }
}
```

---

### GET `/auth/me`

Returns currently authenticated user.

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "clx1234567890",
      "email": "user@example.com",
      "name": "John Doe",
      "avatarUrl": "https://...",
      "createdAt": "2024-12-01T00:00:00Z"
    },
    "organization": {
      "id": "clx0987654321",
      "name": "My Business",
      "slug": "my-business",
      "plan": "FREE"
    }
  }
}
```

---

### POST `/auth/refresh`

Refreshes access token using refresh token.

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Token refreshed"
  }
}
```

---

## Users

### GET `/users/me`

Get current user profile.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "clx1234567890",
    "email": "user@example.com",
    "name": "John Doe",
    "avatarUrl": "https://lh3.googleusercontent.com/...",
    "createdAt": "2024-12-01T00:00:00Z",
    "updatedAt": "2024-12-26T00:00:00Z"
  }
}
```

---

### PATCH `/users/me`

Update current user profile.

**Request Body:**
```json
{
  "name": "John Smith"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "clx1234567890",
    "email": "user@example.com",
    "name": "John Smith",
    "avatarUrl": "https://...",
    "updatedAt": "2024-12-26T18:30:00Z"
  }
}
```

---

## Organizations

### GET `/organizations/current`

Get current user's organization.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "clx0987654321",
    "name": "My Business",
    "slug": "my-business",
    "plan": "FREE",
    "owner": {
      "id": "clx1234567890",
      "name": "John Doe",
      "email": "user@example.com"
    },
    "memberCount": 1,
    "createdAt": "2024-12-01T00:00:00Z"
  }
}
```

---

### PATCH `/organizations/current`

Update organization details.

**Request Body:**
```json
{
  "name": "My Awesome Business"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "clx0987654321",
    "name": "My Awesome Business",
    "slug": "my-business",
    "updatedAt": "2024-12-26T18:30:00Z"
  }
}
```

---

### GET `/organizations/current/members`

Get organization members. (Pro/Business only)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "clx111111",
      "user": {
        "id": "clx1234567890",
        "name": "John Doe",
        "email": "john@example.com",
        "avatarUrl": "https://..."
      },
      "role": "OWNER",
      "joinedAt": "2024-12-01T00:00:00Z"
    }
  ]
}
```

---

## Platform Connections

### GET `/platforms`

Get all platform connections for organization.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "clx222222",
      "platform": "TIKTOK",
      "platformUsername": "@mybusiness",
      "platformDisplayName": "My Business",
      "status": "ACTIVE",
      "lastSyncAt": "2024-12-26T18:00:00Z",
      "createdAt": "2024-12-15T00:00:00Z"
    },
    {
      "id": "clx333333",
      "platform": "WHATSAPP",
      "platformUsername": "+1234567890",
      "platformDisplayName": "My Business",
      "status": "ACTIVE",
      "lastSyncAt": "2024-12-26T18:00:00Z",
      "createdAt": "2024-12-10T00:00:00Z"
    }
  ]
}
```

---

### GET `/platforms/connect/:platform`

Initiate platform OAuth connection.

**Parameters:**
| Parameter | Type | Values |
|-----------|------|--------|
| `platform` | string | `tiktok`, `whatsapp`, `facebook` |

**Response:** Redirect to platform OAuth

---

### GET `/platforms/callback/:platform`

Handle platform OAuth callback.

**Parameters:**
| Parameter | Type | Values |
|-----------|------|--------|
| `platform` | string | `tiktok`, `whatsapp`, `facebook` |

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `code` | string | OAuth authorization code |

**Response:** Redirect to app settings

---

### DELETE `/platforms/:id`

Disconnect a platform.

**Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | Platform connection ID |

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Platform disconnected successfully"
  }
}
```

---

### POST `/platforms/:id/sync`

Force sync messages from platform.

**Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | Platform connection ID |

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Sync initiated",
    "jobId": "job_123456"
  }
}
```

---

## Conversations

### GET `/conversations`

Get all conversations for organization.

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | number | 1 | Page number |
| `limit` | number | 20 | Items per page (max 50) |
| `platform` | string | all | Filter by platform |
| `status` | string | all | Filter by status |
| `search` | string | - | Search contact name |

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "clx444444",
      "platform": "TIKTOK",
      "contactName": "Customer Jane",
      "contactUsername": "@janeshopping",
      "contactAvatarUrl": "https://...",
      "lastMessagePreview": "Thanks for your help!",
      "lastMessageAt": "2024-12-26T17:30:00Z",
      "unreadCount": 2,
      "status": "OPEN",
      "labels": ["vip", "support"],
      "createdAt": "2024-12-20T00:00:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "hasMore": true
  }
}
```

---

### GET `/conversations/:id`

Get single conversation with details.

**Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | Conversation ID |

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "clx444444",
    "platform": "TIKTOK",
    "contactExternalId": "tiktok_user_123",
    "contactName": "Customer Jane",
    "contactUsername": "@janeshopping",
    "contactAvatarUrl": "https://...",
    "lastMessagePreview": "Thanks for your help!",
    "lastMessageAt": "2024-12-26T17:30:00Z",
    "unreadCount": 2,
    "status": "OPEN",
    "labels": ["vip", "support"],
    "platformConnection": {
      "id": "clx222222",
      "platform": "TIKTOK",
      "platformUsername": "@mybusiness"
    },
    "createdAt": "2024-12-20T00:00:00Z",
    "updatedAt": "2024-12-26T17:30:00Z"
  }
}
```

---

### PATCH `/conversations/:id`

Update conversation (status, labels).

**Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | Conversation ID |

**Request Body:**
```json
{
  "status": "CLOSED",
  "labels": ["resolved", "feedback-given"]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "clx444444",
    "status": "CLOSED",
    "labels": ["resolved", "feedback-given"],
    "updatedAt": "2024-12-26T18:30:00Z"
  }
}
```

---

### POST `/conversations/:id/read`

Mark conversation as read.

**Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | Conversation ID |

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "clx444444",
    "unreadCount": 0,
    "updatedAt": "2024-12-26T18:30:00Z"
  }
}
```

---

## Messages

### GET `/conversations/:conversationId/messages`

Get messages in a conversation.

**Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `conversationId` | string | Conversation ID |

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | number | 1 | Page number |
| `limit` | number | 50 | Items per page (max 100) |
| `before` | string | - | Message ID cursor (for infinite scroll) |

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "clx555555",
      "direction": "INBOUND",
      "content": "Hi, I have a question about my order",
      "contentType": "TEXT",
      "status": "READ",
      "platformTimestamp": "2024-12-26T17:00:00Z",
      "createdAt": "2024-12-26T17:00:01Z"
    },
    {
      "id": "clx666666",
      "direction": "OUTBOUND",
      "content": "Hi! I'd be happy to help. What's your order number?",
      "contentType": "TEXT",
      "status": "DELIVERED",
      "sentByUser": {
        "id": "clx1234567890",
        "name": "John Doe"
      },
      "platformTimestamp": "2024-12-26T17:05:00Z",
      "createdAt": "2024-12-26T17:05:01Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 50,
    "total": 15,
    "hasMore": false
  }
}
```

---

### POST `/conversations/:conversationId/messages`

Send a message to conversation.

**Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `conversationId` | string | Conversation ID |

**Request Body:**
```json
{
  "content": "Thanks for your patience! Your order will arrive tomorrow.",
  "contentType": "TEXT"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "clx777777",
    "direction": "OUTBOUND",
    "content": "Thanks for your patience! Your order will arrive tomorrow.",
    "contentType": "TEXT",
    "status": "PENDING",
    "sentByUser": {
      "id": "clx1234567890",
      "name": "John Doe"
    },
    "createdAt": "2024-12-26T18:30:00Z"
  }
}
```

---

### GET `/messages/:id`

Get single message details.

**Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | Message ID |

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "clx555555",
    "conversationId": "clx444444",
    "direction": "INBOUND",
    "content": "Hi, I have a question about my order",
    "contentType": "TEXT",
    "status": "READ",
    "externalId": "tiktok_msg_abc123",
    "platformTimestamp": "2024-12-26T17:00:00Z",
    "createdAt": "2024-12-26T17:00:01Z",
    "updatedAt": "2024-12-26T17:00:01Z"
  }
}
```

---

## Webhooks (Internal)

### POST `/webhooks/tiktok`

Handle incoming TikTok webhooks.

**Headers:**
```
X-TikTok-Signature: sha256=...
Content-Type: application/json
```

**Request Body:** (TikTok webhook payload)

**Response:** `200 OK`

---

### POST `/webhooks/whatsapp`

Handle incoming WhatsApp webhooks.

**Headers:**
```
X-Hub-Signature-256: sha256=...
Content-Type: application/json
```

**Request Body:** (WhatsApp webhook payload)

**Response:** `200 OK`

---

### GET `/webhooks/whatsapp`

WhatsApp webhook verification.

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `hub.mode` | string | Should be "subscribe" |
| `hub.verify_token` | string | Verification token |
| `hub.challenge` | string | Challenge to echo back |

**Response:** Echo `hub.challenge`

---

### POST `/webhooks/facebook`

Handle incoming Facebook Messenger webhooks.

**Headers:**
```
X-Hub-Signature-256: sha256=...
Content-Type: application/json
```

**Request Body:** (Facebook webhook payload)

**Response:** `200 OK`

---

### GET `/webhooks/facebook`

Facebook webhook verification.

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `hub.mode` | string | Should be "subscribe" |
| `hub.verify_token` | string | Verification token |
| `hub.challenge` | string | Challenge to echo back |

**Response:** Echo `hub.challenge`

---

## Health Check

### GET `/health`

Check API health status.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-12-26T18:30:00Z",
  "version": "1.0.0",
  "services": {
    "database": "connected",
    "redis": "connected",
    "tiktok": "operational",
    "whatsapp": "operational",
    "facebook": "operational"
  }
}
```

---

## WebSocket Events

Connection: `wss://api.snorq.com/socket`

### Connection

```javascript
import { io } from 'socket.io-client';

const socket = io('wss://api.snorq.com', {
  withCredentials: true, // Send cookies
  transports: ['websocket']
});

socket.on('connect', () => {
  console.log('Connected');
});
```

### Client → Server Events

| Event | Payload | Description |
|-------|---------|-------------|
| `join:inbox` | - | Join inbox room for updates |
| `join:conversation` | `{ conversationId }` | Join specific conversation |
| `leave:conversation` | `{ conversationId }` | Leave conversation room |
| `typing:start` | `{ conversationId }` | Start typing indicator |
| `typing:stop` | `{ conversationId }` | Stop typing indicator |

### Server → Client Events

| Event | Payload | Description |
|-------|---------|-------------|
| `authenticated` | `{ user }` | Auth successful |
| `new:message` | `{ message, conversation }` | New message received |
| `message:sent` | `{ message }` | Outgoing message confirmed |
| `message:status` | `{ messageId, status }` | Message status update |
| `conversation:updated` | `{ conversation }` | Conversation updated |
| `platform:status` | `{ platform, status }` | Platform connection status |
| `typing` | `{ conversationId, userId }` | Someone is typing |

### Example: Real-time Messages

```javascript
// Listen for new messages
socket.on('new:message', ({ message, conversation }) => {
  console.log('New message:', message);
  // Update UI
});

// Send message via REST, get real-time confirmation
socket.on('message:sent', ({ message }) => {
  console.log('Message sent:', message);
  // Update message status in UI
});

// Track delivery status
socket.on('message:status', ({ messageId, status }) => {
  console.log(`Message ${messageId} is now ${status}`);
  // Update message bubble with checkmarks
});
```

---

## SDKs & Examples

### JavaScript/TypeScript

```typescript
// Example API client
class SnorqClient {
  private baseUrl = '/api/v1';
  
  async getConversations(options?: {
    page?: number;
    limit?: number;
    platform?: string;
  }) {
    const params = new URLSearchParams();
    if (options?.page) params.set('page', String(options.page));
    if (options?.limit) params.set('limit', String(options.limit));
    if (options?.platform) params.set('platform', options.platform);
    
    const response = await fetch(`${this.baseUrl}/conversations?${params}`, {
      credentials: 'include'
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error.message);
    }
    
    return response.json();
  }
  
  async sendMessage(conversationId: string, content: string) {
    const response = await fetch(
      `${this.baseUrl}/conversations/${conversationId}/messages`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ content, contentType: 'TEXT' })
      }
    );
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error.message);
    }
    
    return response.json();
  }
}
```

### React Query Example

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Fetch conversations
export function useConversations(options?: ConversationFilters) {
  return useQuery({
    queryKey: ['conversations', options],
    queryFn: () => api.getConversations(options),
    staleTime: 1000 * 30 // 30 seconds
  });
}

// Send message
export function useSendMessage(conversationId: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (content: string) => api.sendMessage(conversationId, content),
    onSuccess: () => {
      queryClient.invalidateQueries(['messages', conversationId]);
      queryClient.invalidateQueries(['conversations']);
    }
  });
}
```

---

## Changelog

### v1.0.0 (MVP)
- Initial API release
- Authentication endpoints
- Conversation & message management
- TikTok, WhatsApp, Facebook integrations
- Real-time WebSocket support

### v1.1.0 (Planned)
- Media message support
- Conversation labels
- Internal notes
- Team member management
