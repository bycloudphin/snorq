# SNORQ - Feature Roadmap

## Overview

This document outlines the feature development roadmap for SNORQ, organized by phases and priorities.

---

## Roadmap Timeline

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              SNORQ ROADMAP 2025                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Q1 2025                 Q2 2025                 Q3 2025                    │
│  ─────────               ─────────               ─────────                  │
│                                                                              │
│  ┌─────────────┐        ┌─────────────┐        ┌─────────────┐             │
│  │   PHASE 1   │  ────▶ │   PHASE 2   │  ────▶ │   PHASE 3   │             │
│  │     MVP     │        │   GROWTH    │        │   SCALE     │             │
│  │  Weeks 1-6  │        │  Weeks 7-14 │        │  Weeks 15+  │             │
│  └─────────────┘        └─────────────┘        └─────────────┘             │
│                                                                              │
│  • Core Inbox           • Media Support         • AI Features               │
│  • 3 Platforms          • Labels & Tags         • Mobile Apps               │
│  • Real-time            • Team Features         • Analytics                 │
│  • Basic Search         • Pro Features          • API Access                │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Phase 1: MVP (Weeks 1-6)

**Goal**: Launch basic unified inbox with core functionality

### Week 1-2: Foundation

| Feature | Priority | Status | Notes |
|---------|----------|--------|-------|
| Project setup (monorepo) | 🔴 Critical | ⬜ Todo | Backend + Frontend + Docs |
| Database schema design | 🔴 Critical | ⬜ Todo | Prisma + PostgreSQL |
| Authentication (Google OAuth) | 🔴 Critical | ⬜ Todo | JWT + HTTP-only cookies |
| User & Organization models | 🔴 Critical | ⬜ Todo | Basic CRUD |
| Frontend routing & layout | 🔴 Critical | ⬜ Todo | React Router + Tailwind |

### Week 3-4: Platform Integrations

| Feature | Priority | Status | Notes |
|---------|----------|--------|-------|
| TikTok OAuth flow | 🔴 Critical | ⬜ Todo | Connect account |
| TikTok webhook handler | 🔴 Critical | ⬜ Todo | Receive messages |
| TikTok send message | 🔴 Critical | ⬜ Todo | Reply to DMs |
| WhatsApp integration | 🔴 Critical | ⬜ Todo | Cloud API |
| Facebook Messenger integration | 🔴 Critical | ⬜ Todo | Graph API |

### Week 5-6: Inbox Experience

| Feature | Priority | Status | Notes |
|---------|----------|--------|-------|
| Conversation list UI | 🔴 Critical | ⬜ Todo | Sortable, filterable |
| Message thread view | 🔴 Critical | ⬜ Todo | Chat-like interface |
| Real-time updates (WebSocket) | 🔴 Critical | ⬜ Todo | Socket.io |
| Message composer | 🔴 Critical | ⬜ Todo | Text input + send |
| Platform indicators | 🔴 Critical | ⬜ Todo | Visual differentiation |
| Basic search | 🟡 High | ⬜ Todo | Search contacts/messages |
| Settings page | 🟡 High | ⬜ Todo | Platform connections |

### MVP Definition of Done

- [ ] User can sign in with Google
- [ ] User can connect TikTok, WhatsApp, Facebook accounts
- [ ] Incoming messages appear in unified inbox in real-time
- [ ] User can reply to messages from any platform
- [ ] Conversations are sorted by most recent
- [ ] User can search conversations
- [ ] Responsive design works on mobile browsers

---

## Phase 2: Growth Features (Weeks 7-14)

**Goal**: Add Pro tier features and improve user experience

### Week 7-8: Media Support

| Feature | Priority | Status | Notes |
|---------|----------|--------|-------|
| Receive image messages | 🟡 High | ⬜ Todo | All platforms |
| Receive video messages | 🟡 High | ⬜ Todo | All platforms |
| Display media in chat | 🟡 High | ⬜ Todo | Lightbox/preview |
| Send images | 🟡 High | ⬜ Todo | Upload + send |
| File storage (S3/R2) | 🟡 High | ⬜ Todo | Cloudflare R2 |
| Voice message support | 🟢 Medium | ⬜ Todo | WhatsApp/FB |

### Week 9-10: Organization Features

| Feature | Priority | Status | Notes |
|---------|----------|--------|-------|
| Conversation labels | 🟡 High | ⬜ Todo | Custom tags |
| Internal notes | 🟡 High | ⬜ Todo | Team collaboration |
| Conversation status (open/closed) | 🟡 High | ⬜ Todo | Workflow management |
| Mark as unread | 🟢 Medium | ⬜ Todo | Follow-up reminders |
| Starred conversations | 🟢 Medium | ⬜ Todo | Quick access |
| Archive conversations | 🟢 Medium | ⬜ Todo | Cleanup inbox |

### Week 11-12: Team Features (Pro)

| Feature | Priority | Status | Notes |
|---------|----------|--------|-------|
| Invite team members | 🟡 High | ⬜ Todo | Email invites |
| Member roles (Admin/Member) | 🟡 High | ⬜ Todo | Permissions |
| Remove team members | 🟡 High | ⬜ Todo | Admin action |
| Audit log | 🟢 Medium | ⬜ Todo | Track actions |
| Activity indicators | 🟢 Medium | ⬜ Todo | Who's online |

### Week 13-14: Polish & Pro Features

| Feature | Priority | Status | Notes |
|---------|----------|--------|-------|
| Message read receipts | 🟡 High | ⬜ Todo | Visual indicators |
| Typing indicators | 🟢 Medium | ⬜ Todo | Real-time |
| Keyboard shortcuts | 🟢 Medium | ⬜ Todo | Power users |
| Message templates | 🟢 Medium | ⬜ Todo | Quick replies |
| Email notifications | 🟡 High | ⬜ Todo | Configurable |
| Browser notifications | 🟡 High | ⬜ Todo | Push API |
| Pro subscription (Stripe) | 🔴 Critical | ⬜ Todo | Payment flow |

---

## Phase 3: Scale Features (Week 15+)

**Goal**: Business tier features, AI, and mobile apps

### Analytics Dashboard (Business)

| Feature | Priority | Status | Notes |
|---------|----------|--------|-------|
| Response time metrics | 🟢 Medium | ⬜ Todo | Average, by team member |
| Message volume charts | 🟢 Medium | ⬜ Todo | Daily/weekly/monthly |
| Platform breakdown | 🟢 Medium | ⬜ Todo | Messages per platform |
| Team performance | 🟢 Medium | ⬜ Todo | Messages handled |
| Export reports | 🟢 Medium | ⬜ Todo | CSV/PDF |

### AI Features

| Feature | Priority | Status | Notes |
|---------|----------|--------|-------|
| Smart reply suggestions | 🟢 Medium | ⬜ Todo | Context-aware |
| Auto-categorization | 🟢 Medium | ⬜ Todo | ML classification |
| Sentiment analysis | 🔵 Low | ⬜ Todo | Positive/negative |
| Auto-translate | 🔵 Low | ⬜ Todo | Multi-language |
| Chatbot builder | 🔵 Low | ⬜ Todo | Basic automation |

### Mobile Applications

| Feature | Priority | Status | Notes |
|---------|----------|--------|-------|
| React Native app | 🟢 Medium | ⬜ Todo | iOS + Android |
| Push notifications | 🟢 Medium | ⬜ Todo | FCM/APNs |
| Offline support | 🔵 Low | ⬜ Todo | Local cache |
| Biometric auth | 🔵 Low | ⬜ Todo | Face ID, fingerprint |

### API & Integrations (Business)

| Feature | Priority | Status | Notes |
|---------|----------|--------|-------|
| Public REST API | 🟢 Medium | ⬜ Todo | Documented, versioned |
| API key management | 🟢 Medium | ⬜ Todo | Generate/revoke |
| Webhooks (outgoing) | 🟢 Medium | ⬜ Todo | Event notifications |
| Zapier integration | 🔵 Low | ⬜ Todo | 5000+ apps |
| Slack integration | 🔵 Low | ⬜ Todo | Forward messages |

### Additional Platforms

| Platform | Priority | Status | Notes |
|----------|----------|--------|-------|
| Instagram DMs | 🟢 Medium | ⬜ Todo | Meta API |
| Twitter/X DMs | 🔵 Low | ⬜ Todo | Limited API |
| LinkedIn Messages | 🔵 Low | ⬜ Todo | Requires approval |
| Telegram | 🔵 Low | ⬜ Todo | Bot API |
| Discord | 🔵 Low | ⬜ Todo | Bot integration |

---

## Feature Priorities Legend

| Icon | Priority | Description |
|------|----------|-------------|
| 🔴 | Critical | Must have for release |
| 🟡 | High | Important for user experience |
| 🟢 | Medium | Nice to have, adds value |
| 🔵 | Low | Future consideration |

## Status Legend

| Icon | Status | Description |
|------|--------|-------------|
| ⬜ | Todo | Not started |
| 🔄 | In Progress | Currently being worked on |
| ✅ | Done | Completed |
| ⏸️ | On Hold | Paused or blocked |
| ❌ | Cancelled | Removed from scope |

---

## Feature Request Process

### Adding New Features

1. **Submit Idea**: Create GitHub issue with `feature-request` label
2. **Discussion**: Community feedback and voting
3. **Evaluation**: Team reviews feasibility and priority
4. **Planning**: Add to roadmap with estimated phase
5. **Development**: Build, test, and deploy

### Feature Request Template

```markdown
## Feature Request

**Title**: [Short descriptive title]

**Problem**: 
What problem does this solve? Who is affected?

**Proposed Solution**:
What do you want to happen?

**Alternatives Considered**:
What other options did you consider?

**Additional Context**:
Screenshots, mockups, or examples from other products.

**Priority Suggestion**: [Critical/High/Medium/Low]
```

---

## Technical Debt Backlog

Items to address as time permits:

| Item | Priority | Notes |
|------|----------|-------|
| Add comprehensive test coverage | 🟡 High | Target 80%+ |
| Implement API versioning | 🟡 High | Future-proof |
| Add request/response logging | 🟢 Medium | Debugging |
| Optimize database queries | 🟢 Medium | N+1 prevention |
| Add caching layer | 🟢 Medium | Redis caching |
| Documentation improvements | 🟢 Medium | API docs, tutorials |
| Accessibility audit | 🟢 Medium | WCAG compliance |
| Performance monitoring | 🟢 Medium | APM integration |

---

## Success Metrics Per Phase

### Phase 1 Success Criteria

- [ ] 100 beta signups
- [ ] 50 active users (daily)
- [ ] 95% uptime
- [ ] < 2s message delivery latency
- [ ] < 5 critical bugs

### Phase 2 Success Criteria

- [ ] 500 active users
- [ ] 10% Pro conversion rate
- [ ] NPS score > 30
- [ ] < 3 unread feedback items
- [ ] 3+ team accounts active

### Phase 3 Success Criteria

- [ ] 2000 active users
- [ ] 15% paid conversion
- [ ] 50+ API integrations
- [ ] Mobile app 4+ star rating
- [ ] < 1% monthly churn

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 0.1.0 | TBD | MVP Release |
| 0.2.0 | TBD | Media Support |
| 0.3.0 | TBD | Team Features |
| 1.0.0 | TBD | Production Ready |
| 1.1.0 | TBD | Analytics |
| 2.0.0 | TBD | AI Features |

---

## Feedback & Suggestions

We value your input! Share your thoughts:

- 📝 GitHub Issues: Feature requests and bug reports
- 💬 Discord: Community discussions
- 📧 Email: feedback@snorq.com
