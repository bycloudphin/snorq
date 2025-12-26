# SNORQ - Database Schema

## Overview

SNORQ uses **PostgreSQL** as the primary database with **Prisma** as the ORM. This document outlines the complete database schema, relationships, and design decisions.

---

## Entity Relationship Diagram

```
┌─────────────────────┐       ┌─────────────────────┐
│       User          │       │    Organization     │
├─────────────────────┤       ├─────────────────────┤
│ id (PK)             │       │ id (PK)             │
│ email               │◀──────│ owner_id (FK)       │
│ name                │       │ name                │
│ avatar_url          │       │ slug                │
│ google_id           │       │ plan                │
│ created_at          │       │ created_at          │
│ updated_at          │       │ updated_at          │
└─────────────────────┘       └─────────────────────┘
         │                              │
         │                              │
         ▼                              │
┌─────────────────────┐                 │
│  OrganizationMember │                 │
├─────────────────────┤                 │
│ id (PK)             │                 │
│ organization_id (FK)│◀────────────────┘
│ user_id (FK)        │
│ role                │
│ joined_at           │
└─────────────────────┘
         │
         │
         ▼
┌─────────────────────┐       ┌─────────────────────┐
│  PlatformConnection │       │    Conversation     │
├─────────────────────┤       ├─────────────────────┤
│ id (PK)             │       │ id (PK)             │
│ organization_id (FK)│       │ organization_id (FK)│
│ platform            │       │ platform_connection │
│ access_token (enc)  │       │   _id (FK)          │
│ refresh_token (enc) │       │ platform            │
│ platform_user_id    │       │ external_id         │
│ platform_username   │       │ contact_name        │
│ expires_at          │       │ contact_avatar      │
│ status              │       │ last_message        │
│ created_at          │       │ last_message_at     │
│ updated_at          │       │ unread_count        │
└─────────────────────┘       │ status              │
                              │ created_at          │
                              │ updated_at          │
                              └─────────────────────┘
                                        │
                                        │
                                        ▼
                              ┌─────────────────────┐
                              │      Message        │
                              ├─────────────────────┤
                              │ id (PK)             │
                              │ conversation_id (FK)│
                              │ external_id         │
                              │ direction           │
                              │ content             │
                              │ content_type        │
                              │ media_url           │
                              │ status              │
                              │ sent_by_user_id (FK)│
                              │ platform_timestamp  │
                              │ created_at          │
                              │ updated_at          │
                              └─────────────────────┘
```

---

## Prisma Schema

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ============================================
// USER & ORGANIZATION MODELS
// ============================================

model User {
  id                    String                 @id @default(cuid())
  email                 String                 @unique
  name                  String?
  avatarUrl             String?                @map("avatar_url")
  googleId              String?                @unique @map("google_id")
  
  // Timestamps
  createdAt             DateTime               @default(now()) @map("created_at")
  updatedAt             DateTime               @updatedAt @map("updated_at")
  
  // Relations
  ownedOrganizations    Organization[]         @relation("OrganizationOwner")
  memberships           OrganizationMember[]
  sentMessages          Message[]              @relation("SentByUser")
  
  @@map("users")
}

model Organization {
  id                    String                 @id @default(cuid())
  name                  String
  slug                  String                 @unique
  plan                  PlanType               @default(FREE)
  
  // Owner relation
  ownerId               String                 @map("owner_id")
  owner                 User                   @relation("OrganizationOwner", fields: [ownerId], references: [id], onDelete: Cascade)
  
  // Timestamps
  createdAt             DateTime               @default(now()) @map("created_at")
  updatedAt             DateTime               @updatedAt @map("updated_at")
  
  // Relations
  members               OrganizationMember[]
  platformConnections   PlatformConnection[]
  conversations         Conversation[]
  
  @@map("organizations")
}

model OrganizationMember {
  id                    String                 @id @default(cuid())
  role                  MemberRole             @default(MEMBER)
  
  // Relations
  organizationId        String                 @map("organization_id")
  organization          Organization           @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  
  userId                String                 @map("user_id")
  user                  User                   @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  // Timestamps
  joinedAt              DateTime               @default(now()) @map("joined_at")
  
  @@unique([organizationId, userId])
  @@map("organization_members")
}

// ============================================
// PLATFORM CONNECTION MODELS
// ============================================

model PlatformConnection {
  id                    String                 @id @default(cuid())
  platform              Platform
  
  // Platform-specific identifiers
  platformUserId        String                 @map("platform_user_id")
  platformUsername      String?                @map("platform_username")
  platformDisplayName   String?                @map("platform_display_name")
  
  // OAuth tokens (encrypted at rest)
  accessToken           String                 @map("access_token")
  refreshToken          String?                @map("refresh_token")
  tokenExpiresAt        DateTime?              @map("token_expires_at")
  
  // Connection status
  status                ConnectionStatus       @default(ACTIVE)
  lastSyncAt            DateTime?              @map("last_sync_at")
  errorMessage          String?                @map("error_message")
  
  // Organization relation
  organizationId        String                 @map("organization_id")
  organization          Organization           @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  
  // Timestamps
  createdAt             DateTime               @default(now()) @map("created_at")
  updatedAt             DateTime               @updatedAt @map("updated_at")
  
  // Relations
  conversations         Conversation[]
  
  @@unique([organizationId, platform, platformUserId])
  @@map("platform_connections")
}

// ============================================
// CONVERSATION & MESSAGE MODELS
// ============================================

model Conversation {
  id                    String                 @id @default(cuid())
  platform              Platform
  
  // External platform identifiers
  externalId            String                 @map("external_id")
  externalThreadId      String?                @map("external_thread_id")
  
  // Contact information
  contactExternalId     String                 @map("contact_external_id")
  contactName           String?                @map("contact_name")
  contactUsername       String?                @map("contact_username")
  contactAvatarUrl      String?                @map("contact_avatar_url")
  
  // Conversation state
  lastMessagePreview    String?                @map("last_message_preview")
  lastMessageAt         DateTime?              @map("last_message_at")
  unreadCount           Int                    @default(0) @map("unread_count")
  status                ConversationStatus     @default(OPEN)
  
  // Labels/Tags (future feature)
  labels                String[]               @default([])
  
  // Relations
  organizationId        String                 @map("organization_id")
  organization          Organization           @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  
  platformConnectionId  String                 @map("platform_connection_id")
  platformConnection    PlatformConnection     @relation(fields: [platformConnectionId], references: [id], onDelete: Cascade)
  
  // Timestamps
  createdAt             DateTime               @default(now()) @map("created_at")
  updatedAt             DateTime               @updatedAt @map("updated_at")
  
  // Relations
  messages              Message[]
  
  @@unique([platformConnectionId, externalId])
  @@index([organizationId, updatedAt(sort: Desc)])
  @@index([platform, updatedAt(sort: Desc)])
  @@map("conversations")
}

model Message {
  id                    String                 @id @default(cuid())
  
  // External platform identifier
  externalId            String?                @map("external_id")
  
  // Message content
  direction             MessageDirection
  content               String?
  contentType           ContentType            @default(TEXT) @map("content_type")
  
  // Media (for future media support)
  mediaUrl              String?                @map("media_url")
  mediaType             String?                @map("media_type")
  mediaThumbnail        String?                @map("media_thumbnail")
  
  // Message status
  status                MessageStatus          @default(SENT)
  
  // For outgoing messages, who sent it
  sentByUserId          String?                @map("sent_by_user_id")
  sentByUser            User?                  @relation("SentByUser", fields: [sentByUserId], references: [id])
  
  // Platform timestamp
  platformTimestamp     DateTime?              @map("platform_timestamp")
  
  // Relations
  conversationId        String                 @map("conversation_id")
  conversation          Conversation           @relation(fields: [conversationId], references: [id], onDelete: Cascade)
  
  // Timestamps
  createdAt             DateTime               @default(now()) @map("created_at")
  updatedAt             DateTime               @updatedAt @map("updated_at")
  
  @@index([conversationId, createdAt(sort: Desc)])
  @@map("messages")
}

// ============================================
// ENUMS
// ============================================

enum Platform {
  TIKTOK
  WHATSAPP
  FACEBOOK
}

enum PlanType {
  FREE
  PRO
  BUSINESS
}

enum MemberRole {
  OWNER
  ADMIN
  MEMBER
}

enum ConnectionStatus {
  ACTIVE
  EXPIRED
  ERROR
  DISCONNECTED
}

enum ConversationStatus {
  OPEN
  CLOSED
  ARCHIVED
}

enum MessageDirection {
  INBOUND
  OUTBOUND
}

enum ContentType {
  TEXT
  IMAGE
  VIDEO
  AUDIO
  FILE
  STICKER
  LOCATION
}

enum MessageStatus {
  PENDING
  SENT
  DELIVERED
  READ
  FAILED
}
```

---

## Table Details

### Users Table

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `cuid` | PK | Unique identifier |
| `email` | `string` | UNIQUE, NOT NULL | User's email address |
| `name` | `string` | NULLABLE | Display name |
| `avatar_url` | `string` | NULLABLE | Profile picture URL |
| `google_id` | `string` | UNIQUE, NULLABLE | Google OAuth ID |
| `created_at` | `timestamp` | NOT NULL | Record creation time |
| `updated_at` | `timestamp` | NOT NULL | Last update time |

### Organizations Table

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `cuid` | PK | Unique identifier |
| `name` | `string` | NOT NULL | Organization name |
| `slug` | `string` | UNIQUE, NOT NULL | URL-friendly identifier |
| `plan` | `enum` | NOT NULL, DEFAULT FREE | Subscription plan |
| `owner_id` | `cuid` | FK → users.id | Organization owner |
| `created_at` | `timestamp` | NOT NULL | Record creation time |
| `updated_at` | `timestamp` | NOT NULL | Last update time |

### Organization Members Table

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `cuid` | PK | Unique identifier |
| `organization_id` | `cuid` | FK → organizations.id | Parent organization |
| `user_id` | `cuid` | FK → users.id | Member user |
| `role` | `enum` | NOT NULL, DEFAULT MEMBER | Member role |
| `joined_at` | `timestamp` | NOT NULL | When user joined |

**Unique Constraint**: `(organization_id, user_id)` - User can only be member once

### Platform Connections Table

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `cuid` | PK | Unique identifier |
| `organization_id` | `cuid` | FK → organizations.id | Parent organization |
| `platform` | `enum` | NOT NULL | Platform type |
| `platform_user_id` | `string` | NOT NULL | Platform's user ID |
| `platform_username` | `string` | NULLABLE | Platform username |
| `platform_display_name` | `string` | NULLABLE | Display name on platform |
| `access_token` | `string` | NOT NULL, ENCRYPTED | OAuth access token |
| `refresh_token` | `string` | NULLABLE, ENCRYPTED | OAuth refresh token |
| `token_expires_at` | `timestamp` | NULLABLE | Token expiration |
| `status` | `enum` | NOT NULL, DEFAULT ACTIVE | Connection status |
| `last_sync_at` | `timestamp` | NULLABLE | Last message sync |
| `error_message` | `string` | NULLABLE | Error details if failed |
| `created_at` | `timestamp` | NOT NULL | Record creation time |
| `updated_at` | `timestamp` | NOT NULL | Last update time |

**Unique Constraint**: `(organization_id, platform, platform_user_id)`

### Conversations Table

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `cuid` | PK | Unique identifier |
| `organization_id` | `cuid` | FK → organizations.id | Parent organization |
| `platform_connection_id` | `cuid` | FK → platform_connections.id | Source connection |
| `platform` | `enum` | NOT NULL | Platform type (denormalized) |
| `external_id` | `string` | NOT NULL | Platform conversation ID |
| `external_thread_id` | `string` | NULLABLE | Thread ID if applicable |
| `contact_external_id` | `string` | NOT NULL | Contact's platform ID |
| `contact_name` | `string` | NULLABLE | Contact's name |
| `contact_username` | `string` | NULLABLE | Contact's username |
| `contact_avatar_url` | `string` | NULLABLE | Contact's avatar |
| `last_message_preview` | `string` | NULLABLE | Preview of last message |
| `last_message_at` | `timestamp` | NULLABLE | When last message arrived |
| `unread_count` | `int` | NOT NULL, DEFAULT 0 | Unread message count |
| `status` | `enum` | NOT NULL, DEFAULT OPEN | Conversation status |
| `labels` | `string[]` | DEFAULT [] | Tags/labels array |
| `created_at` | `timestamp` | NOT NULL | Record creation time |
| `updated_at` | `timestamp` | NOT NULL | Last update time |

**Unique Constraint**: `(platform_connection_id, external_id)`

**Indexes**:
- `(organization_id, updated_at DESC)` - For inbox listing
- `(platform, updated_at DESC)` - For platform filtering

### Messages Table

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `cuid` | PK | Unique identifier |
| `conversation_id` | `cuid` | FK → conversations.id | Parent conversation |
| `external_id` | `string` | NULLABLE | Platform message ID |
| `direction` | `enum` | NOT NULL | Inbound or outbound |
| `content` | `string` | NULLABLE | Message text content |
| `content_type` | `enum` | NOT NULL, DEFAULT TEXT | Type of content |
| `media_url` | `string` | NULLABLE | Media file URL |
| `media_type` | `string` | NULLABLE | Media MIME type |
| `media_thumbnail` | `string` | NULLABLE | Thumbnail for media |
| `status` | `enum` | NOT NULL, DEFAULT SENT | Delivery status |
| `sent_by_user_id` | `cuid` | FK → users.id, NULLABLE | Who sent (outbound) |
| `platform_timestamp` | `timestamp` | NULLABLE | Original platform time |
| `created_at` | `timestamp` | NOT NULL | Record creation time |
| `updated_at` | `timestamp` | NOT NULL | Last update time |

**Indexes**:
- `(conversation_id, created_at DESC)` - For message history

---

## Enum Values

### Platform
| Value | Description |
|-------|-------------|
| `TIKTOK` | TikTok DMs |
| `WHATSAPP` | WhatsApp Business |
| `FACEBOOK` | Facebook Messenger |

### PlanType
| Value | Description | Limits |
|-------|-------------|--------|
| `FREE` | Free tier | 1 user, 30-day history |
| `PRO` | Pro tier | 3 users, unlimited history |
| `BUSINESS` | Business tier | 4 users, API access |

### MemberRole
| Value | Description | Permissions |
|-------|-------------|-------------|
| `OWNER` | Organization owner | Full access, billing |
| `ADMIN` | Administrator | Manage members, settings |
| `MEMBER` | Regular member | View/send messages |

### ConnectionStatus
| Value | Description |
|-------|-------------|
| `ACTIVE` | Connection working |
| `EXPIRED` | Token expired, needs refresh |
| `ERROR` | Error occurred |
| `DISCONNECTED` | User disconnected manually |

### ConversationStatus
| Value | Description |
|-------|-------------|
| `OPEN` | Active conversation |
| `CLOSED` | Closed by user |
| `ARCHIVED` | Archived for reference |

### MessageDirection
| Value | Description |
|-------|-------------|
| `INBOUND` | Message from contact to user |
| `OUTBOUND` | Message from user to contact |

### ContentType
| Value | Description |
|-------|-------------|
| `TEXT` | Plain text message |
| `IMAGE` | Image file |
| `VIDEO` | Video file |
| `AUDIO` | Audio file/voice message |
| `FILE` | Generic file |
| `STICKER` | Sticker/emoji |
| `LOCATION` | Location share |

### MessageStatus
| Value | Description |
|-------|-------------|
| `PENDING` | Message queued |
| `SENT` | Message sent to platform |
| `DELIVERED` | Delivered to recipient |
| `READ` | Read by recipient |
| `FAILED` | Send failed |

---

## Database Migrations

### Initial Migration

```sql
-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE "Platform" AS ENUM ('TIKTOK', 'WHATSAPP', 'FACEBOOK');
CREATE TYPE "PlanType" AS ENUM ('FREE', 'PRO', 'BUSINESS');
CREATE TYPE "MemberRole" AS ENUM ('OWNER', 'ADMIN', 'MEMBER');
CREATE TYPE "ConnectionStatus" AS ENUM ('ACTIVE', 'EXPIRED', 'ERROR', 'DISCONNECTED');
CREATE TYPE "ConversationStatus" AS ENUM ('OPEN', 'CLOSED', 'ARCHIVED');
CREATE TYPE "MessageDirection" AS ENUM ('INBOUND', 'OUTBOUND');
CREATE TYPE "ContentType" AS ENUM ('TEXT', 'IMAGE', 'VIDEO', 'AUDIO', 'FILE', 'STICKER', 'LOCATION');
CREATE TYPE "MessageStatus" AS ENUM ('PENDING', 'SENT', 'DELIVERED', 'READ', 'FAILED');

-- Create tables (Prisma handles this automatically)
-- Run: npx prisma migrate dev --name init
```

---

## Indexes Strategy

### Primary Query Patterns

| Query | Index Used |
|-------|------------|
| Get user's inbox | `conversations(organization_id, updated_at DESC)` |
| Filter by platform | `conversations(platform, updated_at DESC)` |
| Get message history | `messages(conversation_id, created_at DESC)` |
| User login | `users(email)` UNIQUE |
| User OAuth | `users(google_id)` UNIQUE |

### Performance Considerations

1. **Denormalized `platform` on Conversation**
   - Avoids JOIN when filtering conversations by platform
   - Trade-off: Update both connection and conversation if needed

2. **`last_message_preview` on Conversation**
   - Avoids JOIN to get inbox preview
   - Updated via trigger or application logic

3. **Composite indexes**
   - All queries filter by `organization_id` first
   - Then sort by `updated_at` or filter by `platform`

---

## Data Integrity Rules

### Cascading Deletes

| Parent | Child | Behavior |
|--------|-------|----------|
| User (deleted) | Organizations (owned) | CASCADE |
| User (deleted) | OrganizationMember | CASCADE |
| Organization (deleted) | OrganizationMember | CASCADE |
| Organization (deleted) | PlatformConnection | CASCADE |
| Organization (deleted) | Conversation | CASCADE |
| PlatformConnection (deleted) | Conversation | CASCADE |
| Conversation (deleted) | Message | CASCADE |

### Business Rules

1. **Organization Owner**
   - Every organization must have exactly one owner
   - Owner cannot be removed without transferring ownership

2. **Platform Connection**
   - One connection per platform per organization
   - Connection deletion cascades to all conversations

3. **Message History**
   - Free tier: 30 days retention (handled by background job)
   - Pro/Business: Unlimited retention

---

## Future Schema Extensions

### Phase 2: Labels & Notes

```prisma
model Label {
  id              String           @id @default(cuid())
  name            String
  color           String           @default("#6366f1")
  organizationId  String           @map("organization_id")
  organization    Organization     @relation(fields: [organizationId], references: [id])
  conversations   ConversationLabel[]
  
  @@unique([organizationId, name])
  @@map("labels")
}

model ConversationLabel {
  conversationId  String           @map("conversation_id")
  conversation    Conversation     @relation(fields: [conversationId], references: [id])
  labelId         String           @map("label_id")
  label           Label            @relation(fields: [labelId], references: [id])
  
  @@id([conversationId, labelId])
  @@map("conversation_labels")
}

model Note {
  id              String           @id @default(cuid())
  content         String
  conversationId  String           @map("conversation_id")
  conversation    Conversation     @relation(fields: [conversationId], references: [id])
  authorId        String           @map("author_id")
  author          User             @relation(fields: [authorId], references: [id])
  createdAt       DateTime         @default(now()) @map("created_at")
  
  @@map("notes")
}
```

### Phase 3: Analytics

```prisma
model DailyAnalytics {
  id                String         @id @default(cuid())
  date              DateTime       @db.Date
  organizationId    String         @map("organization_id")
  organization      Organization   @relation(fields: [organizationId], references: [id])
  
  // Metrics
  messagesReceived  Int            @default(0) @map("messages_received")
  messagesSent      Int            @default(0) @map("messages_sent")
  conversationsNew  Int            @default(0) @map("conversations_new")
  avgResponseTime   Int?           @map("avg_response_time") // in seconds
  
  @@unique([organizationId, date])
  @@map("daily_analytics")
}
```

---

## Backup Strategy

### Automated Backups
- Railway PostgreSQL: Daily automatic backups
- Retention: 7 days (free tier), 30 days (paid)

### Manual Backups
```bash
# Create backup
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql

# Restore backup
psql $DATABASE_URL < backup_20241226.sql
```

---

## Encryption Notes

### Data at Rest
- PostgreSQL encryption handled by Railway
- Sensitive fields (tokens) encrypted at application level before storage

### Encryption Implementation
```typescript
// utils/crypto.ts
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const KEY = Buffer.from(process.env.ENCRYPTION_KEY!, 'hex'); // 32 bytes

export function encrypt(text: string): string {
  const iv = randomBytes(16);
  const cipher = createCipheriv(ALGORITHM, KEY, iv);
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag();
  
  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
}

export function decrypt(encryptedText: string): string {
  const [ivHex, authTagHex, encrypted] = encryptedText.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');
  
  const decipher = createDecipheriv(ALGORITHM, KEY, iv);
  decipher.setAuthTag(authTag);
  
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}
```
