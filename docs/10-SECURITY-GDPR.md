# SNORQ - Security & GDPR Compliance

## Security Overview

SNORQ takes security seriously. This document outlines our security practices, data handling procedures, and GDPR compliance measures.

---

## Security Principles

1. **Defense in Depth**: Multiple layers of security
2. **Least Privilege**: Minimal access rights
3. **Encryption Everywhere**: Data protected at rest and in transit
4. **Zero Trust**: Verify every request
5. **Transparency**: Clear data practices

---

## Authentication & Authorization

### Authentication Methods

| Method | Implementation | Use Case |
|--------|----------------|----------|
| Google OAuth 2.0 | Primary login | User authentication |
| JWT Access Tokens | API requests | Short-lived (15 min) |
| JWT Refresh Tokens | Token renewal | Long-lived (7 days) |
| API Keys | Business tier | Programmatic access |

### Token Security

```typescript
// Token configuration
const TOKEN_CONFIG = {
  access: {
    expiresIn: '15m',
    algorithm: 'HS256',
    issuer: 'snorq.com'
  },
  refresh: {
    expiresIn: '7d',
    algorithm: 'HS256',
    issuer: 'snorq.com'
  }
};

// Cookie settings
const COOKIE_OPTIONS = {
  httpOnly: true,      // Not accessible via JavaScript
  secure: true,        // HTTPS only
  sameSite: 'strict',  // CSRF protection
  path: '/',
  domain: '.snorq.com'
};
```

### Authorization Model

```typescript
// Role-based access control
enum MemberRole {
  OWNER = 'OWNER',   // Full access, billing
  ADMIN = 'ADMIN',   // Manage members, settings
  MEMBER = 'MEMBER'  // View/send messages
}

// Permission checks
const permissions = {
  OWNER: ['*'],
  ADMIN: [
    'read:conversations',
    'write:conversations',
    'read:messages',
    'write:messages',
    'manage:members',
    'manage:settings',
    'manage:platforms'
  ],
  MEMBER: [
    'read:conversations',
    'write:conversations',
    'read:messages',
    'write:messages'
  ]
};
```

---

## Data Encryption

### Encryption at Rest

| Data Type | Encryption Method |
|-----------|------------------|
| Database | PostgreSQL TDE (via Railway) |
| Platform Tokens | AES-256-GCM |
| Files | AES-256 (future) |
| Backups | Encrypted by default |

### Platform Token Encryption

```typescript
// src/utils/crypto.ts
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const KEY = Buffer.from(process.env.ENCRYPTION_KEY!, 'hex');

export function encryptToken(token: string): string {
  const iv = randomBytes(16);
  const cipher = createCipheriv(ALGORITHM, KEY, iv);
  
  let encrypted = cipher.update(token, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag();
  
  // Format: iv:authTag:encryptedData
  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
}

export function decryptToken(encryptedToken: string): string {
  const [ivHex, authTagHex, encrypted] = encryptedToken.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');
  
  const decipher = createDecipheriv(ALGORITHM, KEY, iv);
  decipher.setAuthTag(authTag);
  
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}
```

### Encryption in Transit

- All traffic over HTTPS (TLS 1.3)
- WebSocket connections over WSS
- API requests require valid tokens
- Webhook payloads verified via signatures

```typescript
// Force HTTPS redirect
app.addHook('onRequest', (request, reply, done) => {
  if (
    process.env.NODE_ENV === 'production' &&
    request.headers['x-forwarded-proto'] !== 'https'
  ) {
    return reply.redirect(301, `https://${request.hostname}${request.url}`);
  }
  done();
});
```

---

## Security Headers

```typescript
// Fastify helmet configuration
fastify.register(helmet, {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'", "wss:", "https://api.snorq.com"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: []
    }
  },
  crossOriginEmbedderPolicy: true,
  crossOriginOpenerPolicy: { policy: 'same-origin' },
  crossOriginResourcePolicy: { policy: 'same-origin' },
  originAgentCluster: true,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  strictTransportSecurity: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  xContentTypeOptions: true,
  xDnsPrefetchControl: { allow: false },
  xDownloadOptions: true,
  xFrameOptions: { action: 'deny' },
  xPermittedCrossDomainPolicies: { permittedPolicies: 'none' },
  xXssProtection: true
});
```

---

## Rate Limiting

### Configuration

```typescript
// Rate limiting by plan
const rateLimits = {
  FREE: { max: 60, timeWindow: '1 minute' },
  PRO: { max: 300, timeWindow: '1 minute' },
  BUSINESS: { max: 1000, timeWindow: '1 minute' }
};

fastify.register(rateLimit, {
  global: true,
  max: async (request) => {
    const user = request.user;
    if (!user) return 30; // Unauthenticated
    
    const org = await getOrganization(user.organizationId);
    return rateLimits[org.plan].max;
  },
  timeWindow: '1 minute',
  keyGenerator: (request) => {
    return request.user?.id || request.ip;
  },
  errorResponseBuilder: (request, context) => ({
    success: false,
    error: {
      code: 429,
      message: 'Too many requests',
      details: `Rate limit exceeded. Try again in ${context.after}`
    }
  })
});
```

### Rate Limit Headers

```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1703614800
```

---

## Input Validation

### Request Validation

```typescript
// Using Fastify JSON Schema validation
const createMessageSchema = {
  body: {
    type: 'object',
    required: ['content'],
    properties: {
      content: { 
        type: 'string', 
        minLength: 1, 
        maxLength: 4096 
      },
      contentType: { 
        type: 'string', 
        enum: ['TEXT', 'IMAGE', 'VIDEO'] 
      }
    },
    additionalProperties: false
  }
};

fastify.post(
  '/conversations/:id/messages',
  { schema: createMessageSchema },
  handler
);
```

### SQL Injection Prevention

Prisma ORM automatically parameterizes queries:

```typescript
// Safe - Prisma parameterizes this
const user = await prisma.user.findUnique({
  where: { email: userInput }
});

// Never do this (raw queries)
// await prisma.$queryRaw`SELECT * FROM users WHERE email = ${userInput}`
```

### XSS Prevention

```typescript
// React automatically escapes values
<div>{userContent}</div> // Safe

// If you must use dangerouslySetInnerHTML, sanitize first
import DOMPurify from 'dompurify';

<div 
  dangerouslySetInnerHTML={{ 
    __html: DOMPurify.sanitize(htmlContent) 
  }} 
/>
```

---

## Webhook Security

### Signature Verification

```typescript
// Verify webhook signatures before processing
function verifyWebhookSignature(
  signature: string,
  payload: string,
  secret: string
): boolean {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(`sha256=${expectedSignature}`)
  );
}

// Usage in webhook handler
fastify.post('/webhooks/whatsapp', async (request, reply) => {
  const signature = request.headers['x-hub-signature-256'];
  const payload = JSON.stringify(request.body);
  
  if (!verifyWebhookSignature(signature, payload, WEBHOOK_SECRET)) {
    return reply.code(401).send({ error: 'Invalid signature' });
  }
  
  // Process webhook...
});
```

---

## Audit Logging

### What We Log

| Event | Data Logged |
|-------|-------------|
| Login | User ID, IP, timestamp, success/failure |
| Platform Connection | User ID, platform, timestamp |
| Message Sent | User ID, conversation ID, timestamp |
| Settings Change | User ID, changed settings, timestamp |
| Member Added/Removed | Admin ID, affected user, timestamp |
| API Key Created/Revoked | User ID, key ID (not value), timestamp |

### Audit Log Implementation

```typescript
// src/services/audit.service.ts
interface AuditEvent {
  type: string;
  userId: string;
  organizationId: string;
  ip: string;
  userAgent: string;
  metadata: Record<string, any>;
  timestamp: Date;
}

export async function logAuditEvent(event: AuditEvent): Promise<void> {
  await prisma.auditLog.create({
    data: {
      type: event.type,
      userId: event.userId,
      organizationId: event.organizationId,
      ip: event.ip,
      userAgent: event.userAgent,
      metadata: event.metadata,
      createdAt: event.timestamp
    }
  });
  
  // Also send to external logging if configured
  if (process.env.LOG_EXTERNAL) {
    await sendToExternalLog(event);
  }
}
```

### Log Retention

| Plan | Retention Period |
|------|------------------|
| Free | 7 days |
| Pro | 30 days |
| Business | 90 days |

---

## GDPR Compliance

### Lawful Basis for Processing

| Data | Lawful Basis | Purpose |
|------|--------------|---------|
| User email, name | Contract | Account management |
| Messages | Legitimate interest | Core service function |
| Platform tokens | Contract | Platform integration |
| Usage analytics | Legitimate interest | Service improvement |

### User Rights Implementation

#### 1. Right to Access (Data Export)

```typescript
// GET /api/v1/users/me/export
export async function exportUserData(userId: string): Promise<UserExport> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      memberships: {
        include: { organization: true }
      }
    }
  });
  
  const conversations = await prisma.conversation.findMany({
    where: { 
      organization: { 
        members: { some: { userId } } 
      } 
    },
    include: { messages: true }
  });
  
  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt
    },
    organizations: user.memberships.map(m => ({
      name: m.organization.name,
      role: m.role,
      joinedAt: m.joinedAt
    })),
    conversations: conversations.map(c => ({
      platform: c.platform,
      contactName: c.contactName,
      messageCount: c.messages.length,
      createdAt: c.createdAt
    })),
    exportedAt: new Date()
  };
}
```

#### 2. Right to Erasure (Account Deletion)

```typescript
// DELETE /api/v1/users/me
export async function deleteUser(userId: string): Promise<void> {
  await prisma.$transaction(async (tx) => {
    // Get user's owned organizations
    const ownedOrgs = await tx.organization.findMany({
      where: { ownerId: userId }
    });
    
    // Delete all owned organizations (cascades to all data)
    for (const org of ownedOrgs) {
      await tx.organization.delete({ where: { id: org.id } });
    }
    
    // Remove from other organizations
    await tx.organizationMember.deleteMany({
      where: { userId }
    });
    
    // Delete user
    await tx.user.delete({ where: { id: userId } });
    
    // Log deletion
    await logAuditEvent({
      type: 'USER_DELETED',
      userId,
      metadata: { deletedAt: new Date() }
    });
  });
  
  // Revoke all active sessions
  await revokeAllSessions(userId);
}
```

#### 3. Right to Rectification

```typescript
// PATCH /api/v1/users/me
export async function updateUser(
  userId: string, 
  data: { name?: string }
): Promise<User> {
  return prisma.user.update({
    where: { id: userId },
    data: {
      name: data.name,
      updatedAt: new Date()
    }
  });
}
```

#### 4. Right to Portability

```typescript
// GET /api/v1/users/me/export?format=json
export async function exportPortableData(userId: string): Promise<string> {
  const data = await exportUserData(userId);
  return JSON.stringify(data, null, 2);
}
```

### Data Processing Agreement (DPA)

For Business tier customers, we provide a Data Processing Agreement covering:

- Data processing purposes
- Data security measures
- Sub-processor list
- Data transfer mechanisms
- Breach notification procedures

### Cookie Policy

| Cookie | Type | Purpose | Duration |
|--------|------|---------|----------|
| `access_token` | Essential | Authentication | Session |
| `refresh_token` | Essential | Token renewal | 7 days |
| `session_id` | Essential | Session tracking | Session |

No marketing or analytics cookies without consent.

---

## Privacy by Design

### Data Minimization

```typescript
// Only collect necessary data
const createUserSchema = {
  email: { required: true },  // Needed for auth
  name: { required: false },  // Optional display name
  // No: phone, address, etc.
};
```

### Pseudonymization

```typescript
// External IDs never exposed to other users
interface ConversationPublic {
  id: string;              // Internal ID
  contactName: string;     // Displayed name
  // Never: contactExternalId, platform tokens, etc.
}
```

### Data Retention

| Data Type | Free Tier | Pro/Business |
|-----------|-----------|--------------|
| Messages | 30 days | Unlimited |
| Audit Logs | 7 days | 90 days |
| Deleted Accounts | 30 days | 30 days |

```typescript
// Retention cleanup job (runs daily)
async function cleanupOldData(): Promise<void> {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  // Delete old messages for free tier
  await prisma.message.deleteMany({
    where: {
      createdAt: { lt: thirtyDaysAgo },
      conversation: {
        organization: { plan: 'FREE' }
      }
    }
  });
}
```

---

## Security Incident Response

### Incident Classification

| Severity | Description | Response Time |
|----------|-------------|---------------|
| Critical | Data breach, system compromise | Immediate |
| High | Attempted breach, vulnerability | 4 hours |
| Medium | Suspicious activity | 24 hours |
| Low | Minor security issue | 72 hours |

### Response Procedure

1. **Detection**: Automated monitoring or user report
2. **Containment**: Isolate affected systems
3. **Assessment**: Determine scope and impact
4. **Notification**: Inform affected users (within 72 hours per GDPR)
5. **Remediation**: Fix vulnerability
6. **Post-mortem**: Document and improve

### Breach Notification Template

```
Subject: Important Security Notice from SNORQ

Dear [User Name],

We are writing to inform you of a security incident that may have affected your SNORQ account.

**What Happened:**
[Description of incident]

**What Information Was Involved:**
[List of affected data types]

**What We Are Doing:**
[Steps taken to address the issue]

**What You Can Do:**
[Recommended actions for users]

**For More Information:**
Contact our security team at security@snorq.com

Sincerely,
The SNORQ Team
```

---

## Third-Party Security

### Platform API Security

| Platform | Authentication | Data Access |
|----------|----------------|-------------|
| TikTok | OAuth 2.0 | DMs only, user-consented |
| WhatsApp | Cloud API Token | Messages only |
| Facebook | Page Access Token | Messenger only |

### Sub-Processors

| Service | Purpose | Location |
|---------|---------|----------|
| Railway | Hosting | US/EU |
| Cloudflare | CDN/Security | Global |
| Google | OAuth | US |
| Meta | WhatsApp/FB APIs | US |

---

## Security Checklist

### Development

- [ ] Input validation on all endpoints
- [ ] Output encoding for all user content
- [ ] Parameterized queries (Prisma)
- [ ] Secrets in environment variables
- [ ] HTTPS enforced
- [ ] Security headers configured

### Pre-Deployment

- [ ] Dependency vulnerability scan
- [ ] Static code analysis
- [ ] Penetration testing (critical features)
- [ ] Security review of new features

### Production

- [ ] SSL certificate valid
- [ ] Rate limiting active
- [ ] Monitoring and alerting
- [ ] Backup integrity verified
- [ ] Access logs reviewed

### Periodic Reviews

- [ ] Quarterly: Access rights review
- [ ] Quarterly: Dependency updates
- [ ] Annually: Security audit
- [ ] Annually: Penetration test

---

## Contact

**Security Team**: security@snorq.com
**Privacy Inquiries**: privacy@snorq.com
**Data Protection Officer**: dpo@snorq.com

For responsible disclosure of security vulnerabilities, please email security@snorq.com with:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Your contact information (if you'd like acknowledgment)

We aim to respond to security reports within 24 hours.
