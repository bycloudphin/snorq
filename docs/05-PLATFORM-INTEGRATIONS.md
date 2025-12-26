# SNORQ - Platform Integration Guide

## Overview

SNORQ integrates with three messaging platforms for MVP: **TikTok**, **WhatsApp Business**, and **Facebook Messenger**. This document details the integration architecture, setup requirements, and implementation for each platform.

---

## Integration Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           SNORQ BACKEND                                  │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                    Platform Service Layer                         │   │
│  │  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐    │   │
│  │  │ BasePlatform    │ │ BasePlatform    │ │ BasePlatform    │    │   │
│  │  │ (Abstract)      │ │ (Abstract)      │ │ (Abstract)      │    │   │
│  │  └────────┬────────┘ └────────┬────────┘ └────────┬────────┘    │   │
│  │           │                   │                   │              │   │
│  │  ┌────────▼────────┐ ┌────────▼────────┐ ┌────────▼────────┐    │   │
│  │  │ TikTokPlatform  │ │WhatsAppPlatform │ │FacebookPlatform │    │   │
│  │  │ Service         │ │ Service         │ │ Service         │    │   │
│  │  └────────┬────────┘ └────────┬────────┘ └────────┬────────┘    │   │
│  └───────────┼──────────────────┼──────────────────┼───────────────┘   │
│              │                  │                  │                    │
└──────────────┼──────────────────┼──────────────────┼────────────────────┘
               │                  │                  │
               ▼                  ▼                  ▼
      ┌────────────────┐ ┌────────────────┐ ┌────────────────┐
      │  TikTok API    │ │ WhatsApp Cloud │ │ Facebook Graph │
      │  (Content API) │ │     API        │ │     API        │
      └────────────────┘ └────────────────┘ └────────────────┘
```

---

## Base Platform Interface

All platform services implement a common interface:

```typescript
// src/services/platforms/base.platform.ts

export interface PlatformConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  webhookSecret?: string;
}

export interface PlatformMessage {
  externalId: string;
  content: string;
  contentType: ContentType;
  mediaUrl?: string;
  timestamp: Date;
}

export interface PlatformContact {
  externalId: string;
  username?: string;
  displayName?: string;
  avatarUrl?: string;
}

export abstract class BasePlatform {
  protected config: PlatformConfig;
  
  constructor(config: PlatformConfig) {
    this.config = config;
  }
  
  // OAuth flow
  abstract getAuthUrl(state: string): string;
  abstract exchangeCode(code: string): Promise<TokenResponse>;
  abstract refreshToken(refreshToken: string): Promise<TokenResponse>;
  
  // Message operations
  abstract sendMessage(accessToken: string, recipientId: string, content: string): Promise<string>;
  abstract getMessages(accessToken: string, conversationId: string): Promise<PlatformMessage[]>;
  
  // Webhook handling
  abstract verifyWebhook(signature: string, payload: string): boolean;
  abstract parseWebhook(payload: any): WebhookEvent;
  
  // User info
  abstract getUserInfo(accessToken: string): Promise<PlatformContact>;
}
```

---

# TikTok Integration

## Overview

TikTok integration uses the [TikTok Content Posting API](https://developers.tiktok.com/) for managing direct messages.

> ⚠️ **Note**: TikTok DM API access requires approval. Apply via TikTok for Business.

## Prerequisites

1. TikTok for Business account
2. Developer application approved for DM access
3. Verified business domain

## Setup Steps

### 1. Create TikTok Developer App

1. Go to [TikTok Developer Portal](https://developers.tiktok.com/)
2. Create new app
3. Request the following scopes:
   - `user.info.basic`
   - `message.read`
   - `message.send`

### 2. Environment Variables

```env
TIKTOK_CLIENT_KEY=your_client_key
TIKTOK_CLIENT_SECRET=your_client_secret
TIKTOK_REDIRECT_URI=https://api.snorq.com/api/v1/platforms/callback/tiktok
TIKTOK_WEBHOOK_SECRET=your_webhook_secret
```

### 3. OAuth Flow

```
User clicks "Connect TikTok"
        │
        ▼
Redirect to TikTok OAuth
https://www.tiktok.com/v2/auth/authorize?
  client_key={TIKTOK_CLIENT_KEY}&
  scope=user.info.basic,message.read,message.send&
  response_type=code&
  redirect_uri={TIKTOK_REDIRECT_URI}&
  state={encrypted_state}
        │
        ▼
User authorizes in TikTok
        │
        ▼
TikTok redirects to callback:
{TIKTOK_REDIRECT_URI}?code={auth_code}&state={state}
        │
        ▼
Exchange code for tokens
POST https://open.tiktokapis.com/v2/oauth/token/
        │
        ▼
Store encrypted tokens in database
```

## Implementation

### TikTok Platform Service

```typescript
// src/services/platforms/tiktok.platform.ts

import { BasePlatform, PlatformConfig, TokenResponse } from './base.platform';
import axios from 'axios';

export class TikTokPlatform extends BasePlatform {
  private baseUrl = 'https://open.tiktokapis.com/v2';
  
  getAuthUrl(state: string): string {
    const params = new URLSearchParams({
      client_key: this.config.clientId,
      scope: 'user.info.basic,message.read,message.send',
      response_type: 'code',
      redirect_uri: this.config.redirectUri,
      state
    });
    
    return `https://www.tiktok.com/v2/auth/authorize?${params}`;
  }
  
  async exchangeCode(code: string): Promise<TokenResponse> {
    const response = await axios.post(`${this.baseUrl}/oauth/token/`, {
      client_key: this.config.clientId,
      client_secret: this.config.clientSecret,
      code,
      grant_type: 'authorization_code',
      redirect_uri: this.config.redirectUri
    });
    
    return {
      accessToken: response.data.access_token,
      refreshToken: response.data.refresh_token,
      expiresIn: response.data.expires_in,
      scope: response.data.scope,
      openId: response.data.open_id
    };
  }
  
  async refreshToken(refreshToken: string): Promise<TokenResponse> {
    const response = await axios.post(`${this.baseUrl}/oauth/token/`, {
      client_key: this.config.clientId,
      client_secret: this.config.clientSecret,
      grant_type: 'refresh_token',
      refresh_token: refreshToken
    });
    
    return {
      accessToken: response.data.access_token,
      refreshToken: response.data.refresh_token,
      expiresIn: response.data.expires_in
    };
  }
  
  async sendMessage(
    accessToken: string,
    recipientId: string,
    content: string
  ): Promise<string> {
    const response = await axios.post(
      `${this.baseUrl}/dm/message/send/`,
      {
        recipient_id: recipientId,
        message_type: 'text',
        text: { text: content }
      },
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    return response.data.data.message_id;
  }
  
  async getMessages(
    accessToken: string,
    conversationId: string
  ): Promise<PlatformMessage[]> {
    const response = await axios.get(
      `${this.baseUrl}/dm/conversation/messages/`,
      {
        params: { conversation_id: conversationId },
        headers: { 'Authorization': `Bearer ${accessToken}` }
      }
    );
    
    return response.data.data.messages.map(this.transformMessage);
  }
  
  async getUserInfo(accessToken: string): Promise<PlatformContact> {
    const response = await axios.get(
      `${this.baseUrl}/user/info/`,
      {
        params: { fields: 'open_id,union_id,avatar_url,display_name' },
        headers: { 'Authorization': `Bearer ${accessToken}` }
      }
    );
    
    return {
      externalId: response.data.data.user.open_id,
      displayName: response.data.data.user.display_name,
      avatarUrl: response.data.data.user.avatar_url
    };
  }
  
  verifyWebhook(signature: string, payload: string): boolean {
    const hmac = crypto
      .createHmac('sha256', this.config.webhookSecret!)
      .update(payload)
      .digest('hex');
    return hmac === signature;
  }
  
  parseWebhook(payload: any): WebhookEvent {
    return {
      type: payload.event,
      timestamp: new Date(payload.timestamp * 1000),
      data: payload.data
    };
  }
  
  private transformMessage(msg: any): PlatformMessage {
    return {
      externalId: msg.message_id,
      content: msg.text?.text || '',
      contentType: this.mapContentType(msg.message_type),
      mediaUrl: msg.media?.url,
      timestamp: new Date(msg.create_time * 1000)
    };
  }
}
```

### TikTok Webhook Handler

```typescript
// src/routes/webhooks/tiktok.ts

import { FastifyPluginAsync } from 'fastify';
import { TikTokPlatform } from '../../services/platforms/tiktok.platform';
import { messageService } from '../../services/message.service';

const tiktokWebhook: FastifyPluginAsync = async (fastify) => {
  const platform = new TikTokPlatform(config.tiktok);
  
  // Webhook verification
  fastify.get('/webhooks/tiktok', async (request, reply) => {
    const { challenge } = request.query as { challenge: string };
    return reply.send(challenge);
  });
  
  // Incoming events
  fastify.post('/webhooks/tiktok', async (request, reply) => {
    const signature = request.headers['x-tiktok-signature'] as string;
    const payload = JSON.stringify(request.body);
    
    if (!platform.verifyWebhook(signature, payload)) {
      return reply.code(401).send({ error: 'Invalid signature' });
    }
    
    const event = platform.parseWebhook(request.body);
    
    switch (event.type) {
      case 'dm.message':
        await messageService.handleIncomingMessage('TIKTOK', event.data);
        break;
      case 'dm.message.read':
        await messageService.updateMessageStatus(event.data.message_id, 'READ');
        break;
    }
    
    return reply.send({ success: true });
  });
};

export default tiktokWebhook;
```

---

# WhatsApp Integration

## Overview

WhatsApp integration uses the [WhatsApp Business Cloud API](https://developers.facebook.com/docs/whatsapp/cloud-api/).

## Prerequisites

1. Meta Business Account
2. WhatsApp Business Account
3. Verified phone number
4. Access to Meta Developer Console

## Setup Steps

### 1. Create Meta App

1. Go to [Meta for Developers](https://developers.facebook.com/)
2. Create new Business app
3. Add WhatsApp product
4. Configure phone number

### 2. Environment Variables

```env
WHATSAPP_APP_ID=your_app_id
WHATSAPP_APP_SECRET=your_app_secret
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
WHATSAPP_VERIFY_TOKEN=your_custom_verify_token
WHATSAPP_ACCESS_TOKEN=your_permanent_access_token
```

### 3. Webhook Setup

```
Configure webhook URL:
https://api.snorq.com/api/v1/webhooks/whatsapp

Subscribe to events:
- messages
- message_template_status_update

Verify token: {WHATSAPP_VERIFY_TOKEN}
```

## Implementation

### WhatsApp Platform Service

```typescript
// src/services/platforms/whatsapp.platform.ts

import { BasePlatform, PlatformConfig, PlatformMessage } from './base.platform';
import axios from 'axios';

export class WhatsAppPlatform extends BasePlatform {
  private graphUrl = 'https://graph.facebook.com/v18.0';
  
  getAuthUrl(state: string): string {
    // WhatsApp uses business account linking, not per-user OAuth
    const params = new URLSearchParams({
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      state,
      config_id: process.env.WHATSAPP_CONFIG_ID!,
      response_type: 'code',
      override_default_response_type: 'true'
    });
    
    return `https://www.facebook.com/v18.0/dialog/oauth?${params}`;
  }
  
  async exchangeCode(code: string): Promise<TokenResponse> {
    const response = await axios.get(`${this.graphUrl}/oauth/access_token`, {
      params: {
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret,
        redirect_uri: this.config.redirectUri,
        code
      }
    });
    
    return {
      accessToken: response.data.access_token,
      expiresIn: response.data.expires_in || 0
    };
  }
  
  async sendMessage(
    accessToken: string,
    recipientPhone: string,
    content: string
  ): Promise<string> {
    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    
    const response = await axios.post(
      `${this.graphUrl}/${phoneNumberId}/messages`,
      {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: recipientPhone,
        type: 'text',
        text: { body: content }
      },
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    return response.data.messages[0].id;
  }
  
  async sendTemplateMessage(
    accessToken: string,
    recipientPhone: string,
    templateName: string,
    languageCode: string,
    components?: any[]
  ): Promise<string> {
    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    
    const response = await axios.post(
      `${this.graphUrl}/${phoneNumberId}/messages`,
      {
        messaging_product: 'whatsapp',
        to: recipientPhone,
        type: 'template',
        template: {
          name: templateName,
          language: { code: languageCode },
          components
        }
      },
      {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      }
    );
    
    return response.data.messages[0].id;
  }
  
  async markAsRead(accessToken: string, messageId: string): Promise<void> {
    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    
    await axios.post(
      `${this.graphUrl}/${phoneNumberId}/messages`,
      {
        messaging_product: 'whatsapp',
        status: 'read',
        message_id: messageId
      },
      {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      }
    );
  }
  
  verifyWebhook(signature: string, payload: string): boolean {
    const expectedSignature = crypto
      .createHmac('sha256', this.config.clientSecret)
      .update(payload)
      .digest('hex');
    
    return `sha256=${expectedSignature}` === signature;
  }
  
  parseWebhook(payload: any): WebhookEvent[] {
    const events: WebhookEvent[] = [];
    
    if (payload.entry) {
      for (const entry of payload.entry) {
        for (const change of entry.changes) {
          if (change.field === 'messages') {
            const value = change.value;
            
            // Handle incoming messages
            if (value.messages) {
              for (const message of value.messages) {
                events.push({
                  type: 'message',
                  timestamp: new Date(parseInt(message.timestamp) * 1000),
                  data: {
                    messageId: message.id,
                    from: message.from,
                    type: message.type,
                    content: this.extractContent(message),
                    contact: value.contacts?.[0]
                  }
                });
              }
            }
            
            // Handle status updates
            if (value.statuses) {
              for (const status of value.statuses) {
                events.push({
                  type: 'status',
                  timestamp: new Date(parseInt(status.timestamp) * 1000),
                  data: {
                    messageId: status.id,
                    status: status.status,
                    recipientId: status.recipient_id
                  }
                });
              }
            }
          }
        }
      }
    }
    
    return events;
  }
  
  private extractContent(message: any): string {
    switch (message.type) {
      case 'text':
        return message.text.body;
      case 'image':
        return '[Image]';
      case 'video':
        return '[Video]';
      case 'audio':
        return '[Audio]';
      case 'document':
        return `[Document: ${message.document.filename}]`;
      case 'sticker':
        return '[Sticker]';
      case 'location':
        return `[Location: ${message.location.latitude}, ${message.location.longitude}]`;
      default:
        return '[Unsupported message type]';
    }
  }
}
```

### WhatsApp Webhook Handler

```typescript
// src/routes/webhooks/whatsapp.ts

import { FastifyPluginAsync } from 'fastify';
import { WhatsAppPlatform } from '../../services/platforms/whatsapp.platform';
import { messageService } from '../../services/message.service';

const whatsappWebhook: FastifyPluginAsync = async (fastify) => {
  const platform = new WhatsAppPlatform(config.whatsapp);
  
  // Webhook verification (GET)
  fastify.get('/webhooks/whatsapp', async (request, reply) => {
    const {
      'hub.mode': mode,
      'hub.verify_token': verifyToken,
      'hub.challenge': challenge
    } = request.query as Record<string, string>;
    
    if (mode === 'subscribe' && verifyToken === process.env.WHATSAPP_VERIFY_TOKEN) {
      return reply.send(challenge);
    }
    
    return reply.code(403).send({ error: 'Verification failed' });
  });
  
  // Incoming events (POST)
  fastify.post('/webhooks/whatsapp', async (request, reply) => {
    const signature = request.headers['x-hub-signature-256'] as string;
    const payload = JSON.stringify(request.body);
    
    if (!platform.verifyWebhook(signature, payload)) {
      return reply.code(401).send({ error: 'Invalid signature' });
    }
    
    const events = platform.parseWebhook(request.body);
    
    for (const event of events) {
      switch (event.type) {
        case 'message':
          await messageService.handleIncomingMessage('WHATSAPP', event.data);
          break;
        case 'status':
          await messageService.updateMessageStatus(
            event.data.messageId,
            event.data.status.toUpperCase()
          );
          break;
      }
    }
    
    return reply.send({ success: true });
  });
};

export default whatsappWebhook;
```

---

# Facebook Messenger Integration

## Overview

Facebook Messenger integration uses the [Messenger Platform API](https://developers.facebook.com/docs/messenger-platform/).

## Prerequisites

1. Meta Business Account
2. Facebook Page for business
3. Meta Developer App with Messenger product

## Setup Steps

### 1. Create Meta App

1. Go to [Meta for Developers](https://developers.facebook.com/)
2. Create new Business app
3. Add Messenger product
4. Connect Facebook Page

### 2. Environment Variables

```env
FACEBOOK_APP_ID=your_app_id
FACEBOOK_APP_SECRET=your_app_secret
FACEBOOK_PAGE_ACCESS_TOKEN=your_page_access_token
FACEBOOK_VERIFY_TOKEN=your_custom_verify_token
```

### 3. Webhook Setup

```
Configure webhook URL:
https://api.snorq.com/api/v1/webhooks/facebook

Subscribe to Page events:
- messages
- messaging_postbacks
- messaging_optins
- message_deliveries
- message_reads

Verify token: {FACEBOOK_VERIFY_TOKEN}
```

## Implementation

### Facebook Platform Service

```typescript
// src/services/platforms/facebook.platform.ts

import { BasePlatform, PlatformConfig, PlatformMessage } from './base.platform';
import axios from 'axios';

export class FacebookPlatform extends BasePlatform {
  private graphUrl = 'https://graph.facebook.com/v18.0';
  
  getAuthUrl(state: string): string {
    const params = new URLSearchParams({
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      state,
      scope: 'pages_messaging,pages_manage_metadata,pages_read_engagement',
      response_type: 'code'
    });
    
    return `https://www.facebook.com/v18.0/dialog/oauth?${params}`;
  }
  
  async exchangeCode(code: string): Promise<TokenResponse> {
    // Exchange for user access token
    const userTokenResponse = await axios.get(`${this.graphUrl}/oauth/access_token`, {
      params: {
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret,
        redirect_uri: this.config.redirectUri,
        code
      }
    });
    
    const userAccessToken = userTokenResponse.data.access_token;
    
    // Get long-lived token
    const longLivedResponse = await axios.get(`${this.graphUrl}/oauth/access_token`, {
      params: {
        grant_type: 'fb_exchange_token',
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret,
        fb_exchange_token: userAccessToken
      }
    });
    
    // Get page access token
    const pagesResponse = await axios.get(`${this.graphUrl}/me/accounts`, {
      params: { access_token: longLivedResponse.data.access_token }
    });
    
    const page = pagesResponse.data.data[0]; // First page
    
    return {
      accessToken: page.access_token,
      pageId: page.id,
      pageName: page.name
    };
  }
  
  async sendMessage(
    accessToken: string,
    recipientPsid: string,
    content: string
  ): Promise<string> {
    const response = await axios.post(
      `${this.graphUrl}/me/messages`,
      {
        recipient: { id: recipientPsid },
        messaging_type: 'RESPONSE',
        message: { text: content }
      },
      {
        params: { access_token: accessToken }
      }
    );
    
    return response.data.message_id;
  }
  
  async sendQuickReplies(
    accessToken: string,
    recipientPsid: string,
    content: string,
    quickReplies: Array<{ title: string; payload: string }>
  ): Promise<string> {
    const response = await axios.post(
      `${this.graphUrl}/me/messages`,
      {
        recipient: { id: recipientPsid },
        messaging_type: 'RESPONSE',
        message: {
          text: content,
          quick_replies: quickReplies.map(qr => ({
            content_type: 'text',
            title: qr.title,
            payload: qr.payload
          }))
        }
      },
      {
        params: { access_token: accessToken }
      }
    );
    
    return response.data.message_id;
  }
  
  async getUserProfile(
    accessToken: string,
    psid: string
  ): Promise<PlatformContact> {
    const response = await axios.get(
      `${this.graphUrl}/${psid}`,
      {
        params: {
          access_token: accessToken,
          fields: 'first_name,last_name,profile_pic'
        }
      }
    );
    
    return {
      externalId: psid,
      displayName: `${response.data.first_name} ${response.data.last_name}`,
      avatarUrl: response.data.profile_pic
    };
  }
  
  verifyWebhook(signature: string, payload: string): boolean {
    const expectedSignature = crypto
      .createHmac('sha256', this.config.clientSecret)
      .update(payload)
      .digest('hex');
    
    return `sha256=${expectedSignature}` === signature;
  }
  
  parseWebhook(payload: any): WebhookEvent[] {
    const events: WebhookEvent[] = [];
    
    if (payload.entry) {
      for (const entry of payload.entry) {
        for (const messaging of entry.messaging || []) {
          if (messaging.message) {
            events.push({
              type: 'message',
              timestamp: new Date(messaging.timestamp),
              data: {
                messageId: messaging.message.mid,
                senderId: messaging.sender.id,
                recipientId: messaging.recipient.id,
                content: messaging.message.text || '',
                attachments: messaging.message.attachments,
                isEcho: messaging.message.is_echo || false
              }
            });
          } else if (messaging.delivery) {
            events.push({
              type: 'delivery',
              timestamp: new Date(messaging.timestamp),
              data: {
                messageIds: messaging.delivery.mids,
                watermark: messaging.delivery.watermark
              }
            });
          } else if (messaging.read) {
            events.push({
              type: 'read',
              timestamp: new Date(messaging.timestamp),
              data: {
                watermark: messaging.read.watermark,
                senderId: messaging.sender.id
              }
            });
          }
        }
      }
    }
    
    return events;
  }
}
```

### Facebook Webhook Handler

```typescript
// src/routes/webhooks/facebook.ts

import { FastifyPluginAsync } from 'fastify';
import { FacebookPlatform } from '../../services/platforms/facebook.platform';
import { messageService } from '../../services/message.service';

const facebookWebhook: FastifyPluginAsync = async (fastify) => {
  const platform = new FacebookPlatform(config.facebook);
  
  // Webhook verification (GET)
  fastify.get('/webhooks/facebook', async (request, reply) => {
    const {
      'hub.mode': mode,
      'hub.verify_token': verifyToken,
      'hub.challenge': challenge
    } = request.query as Record<string, string>;
    
    if (mode === 'subscribe' && verifyToken === process.env.FACEBOOK_VERIFY_TOKEN) {
      return reply.send(challenge);
    }
    
    return reply.code(403).send({ error: 'Verification failed' });
  });
  
  // Incoming events (POST)
  fastify.post('/webhooks/facebook', async (request, reply) => {
    const signature = request.headers['x-hub-signature-256'] as string;
    const payload = JSON.stringify(request.body);
    
    if (!platform.verifyWebhook(signature, payload)) {
      return reply.code(401).send({ error: 'Invalid signature' });
    }
    
    const events = platform.parseWebhook(request.body);
    
    for (const event of events) {
      // Skip echo messages (messages we sent)
      if (event.type === 'message' && event.data.isEcho) {
        continue;
      }
      
      switch (event.type) {
        case 'message':
          await messageService.handleIncomingMessage('FACEBOOK', event.data);
          break;
        case 'delivery':
          for (const messageId of event.data.messageIds) {
            await messageService.updateMessageStatus(messageId, 'DELIVERED');
          }
          break;
        case 'read':
          await messageService.markConversationAsRead(
            'FACEBOOK',
            event.data.senderId,
            event.data.watermark
          );
          break;
      }
    }
    
    return reply.send({ success: true });
  });
};

export default facebookWebhook;
```

---

## Message Service

Centralized service for handling messages across all platforms:

```typescript
// src/services/message.service.ts

import { prisma } from '../config/database';
import { socketServer } from '../socket';
import { Platform } from '@prisma/client';

export const messageService = {
  async handleIncomingMessage(platform: Platform, data: any) {
    // Find or create conversation
    const conversation = await this.getOrCreateConversation(platform, data);
    
    // Create message record
    const message = await prisma.message.create({
      data: {
        conversationId: conversation.id,
        externalId: data.messageId,
        direction: 'INBOUND',
        content: data.content,
        contentType: this.mapContentType(data.type),
        platformTimestamp: data.timestamp,
        status: 'DELIVERED'
      }
    });
    
    // Update conversation
    await prisma.conversation.update({
      where: { id: conversation.id },
      data: {
        lastMessagePreview: data.content?.substring(0, 100),
        lastMessageAt: new Date(),
        unreadCount: { increment: 1 }
      }
    });
    
    // Emit real-time event
    socketServer.to(`org:${conversation.organizationId}`).emit('new:message', {
      message,
      conversation
    });
    
    return message;
  },
  
  async sendMessage(conversationId: string, userId: string, content: string) {
    const conversation = await prisma.conversation.findUniqueOrThrow({
      where: { id: conversationId },
      include: { platformConnection: true }
    });
    
    // Create pending message
    const message = await prisma.message.create({
      data: {
        conversationId,
        direction: 'OUTBOUND',
        content,
        contentType: 'TEXT',
        status: 'PENDING',
        sentByUserId: userId
      }
    });
    
    // Send via platform
    const platformService = this.getPlatformService(conversation.platform);
    try {
      const externalId = await platformService.sendMessage(
        conversation.platformConnection.accessToken,
        conversation.contactExternalId,
        content
      );
      
      // Update message with external ID
      await prisma.message.update({
        where: { id: message.id },
        data: { externalId, status: 'SENT' }
      });
      
      // Update conversation
      await prisma.conversation.update({
        where: { id: conversationId },
        data: {
          lastMessagePreview: content.substring(0, 100),
          lastMessageAt: new Date()
        }
      });
      
      // Emit confirmation
      socketServer.to(`conversation:${conversationId}`).emit('message:sent', { message });
      
    } catch (error) {
      await prisma.message.update({
        where: { id: message.id },
        data: { status: 'FAILED' }
      });
      throw error;
    }
    
    return message;
  },
  
  async updateMessageStatus(externalId: string, status: string) {
    const message = await prisma.message.findFirst({
      where: { externalId },
      include: { conversation: true }
    });
    
    if (message) {
      await prisma.message.update({
        where: { id: message.id },
        data: { status: status as any }
      });
      
      socketServer
        .to(`conversation:${message.conversationId}`)
        .emit('message:status', { messageId: message.id, status });
    }
  }
};
```

---

## Platform Comparison

| Feature | TikTok | WhatsApp | Facebook |
|---------|--------|----------|----------|
| OAuth Flow | Standard | Business Linking | Standard |
| Message Types | Text, Media | Text, Media, Templates | Text, Media, Quick Replies |
| Read Receipts | ✅ | ✅ | ✅ |
| Delivery Receipts | ✅ | ✅ | ✅ |
| Typing Indicators | ❌ | ❌ | ✅ |
| Media Support | Images, Videos | Images, Videos, Docs, Audio | Images, Videos, Files |
| Rate Limits | 100 msg/day | 1000 msg/day | 200 msg/24h |
| Webhook Retry | Yes | Yes | Yes |

---

## Error Handling

### Platform-Specific Errors

```typescript
// src/utils/platform-errors.ts

export class PlatformError extends Error {
  constructor(
    public platform: Platform,
    public code: number,
    message: string
  ) {
    super(message);
    this.name = 'PlatformError';
  }
}

export const PLATFORM_ERROR_CODES = {
  TOKEN_EXPIRED: 2001,
  RATE_LIMITED: 2002,
  RECIPIENT_BLOCKED: 2003,
  INVALID_RECIPIENT: 2004,
  MESSAGE_TOO_LONG: 2005,
  MEDIA_UPLOAD_FAILED: 2006,
  PLATFORM_UNAVAILABLE: 2007
};
```

### Retry Strategy

```typescript
// For transient failures, implement exponential backoff
const retryConfig = {
  maxRetries: 3,
  baseDelay: 1000, // 1 second
  maxDelay: 30000, // 30 seconds
  
  shouldRetry: (error: any) => {
    return error.status === 429 || error.status >= 500;
  }
};
```

---

## Testing Platforms

### Sandbox/Test Modes

| Platform | Test Mode |
|----------|-----------|
| TikTok | Sandbox app with test users |
| WhatsApp | Test phone numbers provided |
| Facebook | Page role reviewers |

### Webhook Testing

Use ngrok for local development:

```bash
# Expose local server
ngrok http 3000

# Use the HTTPS URL for webhooks
# https://abc123.ngrok.io/api/v1/webhooks/whatsapp
```

---

## Security Considerations

1. **Token Storage**: All platform tokens encrypted at rest
2. **Webhook Verification**: Always verify signatures
3. **Rate Limiting**: Respect platform rate limits
4. **Token Refresh**: Auto-refresh before expiry
5. **Audit Logging**: Log all platform interactions
