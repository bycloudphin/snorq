# SNORQ - UI/UX Guidelines

## Brand Identity

### Brand Values
- **Simple**: Easy to use, no learning curve
- **Fast**: Real-time, responsive, snappy
- **Affordable**: Value for money
- **Unified**: One place for all conversations

### Brand Personality
- Professional yet friendly
- Modern and clean
- Trustworthy and reliable
- Efficient and focused

---

## Design System

### Color Palette

```css
:root {
  /* Primary - Indigo/Purple */
  --primary-50: #eef2ff;
  --primary-100: #e0e7ff;
  --primary-200: #c7d2fe;
  --primary-300: #a5b4fc;
  --primary-400: #818cf8;
  --primary-500: #6366f1;  /* Main brand color */
  --primary-600: #4f46e5;
  --primary-700: #4338ca;
  --primary-800: #3730a3;
  --primary-900: #312e81;
  
  /* Neutral - Slate */
  --neutral-50: #f8fafc;
  --neutral-100: #f1f5f9;
  --neutral-200: #e2e8f0;
  --neutral-300: #cbd5e1;
  --neutral-400: #94a3b8;
  --neutral-500: #64748b;
  --neutral-600: #475569;
  --neutral-700: #334155;
  --neutral-800: #1e293b;
  --neutral-900: #0f172a;
  
  /* Success - Green */
  --success-50: #f0fdf4;
  --success-500: #22c55e;
  --success-600: #16a34a;
  
  /* Warning - Amber */
  --warning-50: #fffbeb;
  --warning-500: #f59e0b;
  --warning-600: #d97706;
  
  /* Error - Red */
  --error-50: #fef2f2;
  --error-500: #ef4444;
  --error-600: #dc2626;
  
  /* Platform Colors */
  --tiktok: #000000;
  --tiktok-accent: #fe2c55;
  --whatsapp: #25d366;
  --facebook: #1877f2;
}
```

### Typography

```css
:root {
  /* Font Families */
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;
  
  /* Font Sizes */
  --text-xs: 0.75rem;     /* 12px */
  --text-sm: 0.875rem;    /* 14px */
  --text-base: 1rem;      /* 16px */
  --text-lg: 1.125rem;    /* 18px */
  --text-xl: 1.25rem;     /* 20px */
  --text-2xl: 1.5rem;     /* 24px */
  --text-3xl: 1.875rem;   /* 30px */
  --text-4xl: 2.25rem;    /* 36px */
  
  /* Font Weights */
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
  
  /* Line Heights */
  --leading-tight: 1.25;
  --leading-normal: 1.5;
  --leading-relaxed: 1.625;
}
```

### Spacing Scale

```css
:root {
  --space-0: 0;
  --space-1: 0.25rem;   /* 4px */
  --space-2: 0.5rem;    /* 8px */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;      /* 16px */
  --space-5: 1.25rem;   /* 20px */
  --space-6: 1.5rem;    /* 24px */
  --space-8: 2rem;      /* 32px */
  --space-10: 2.5rem;   /* 40px */
  --space-12: 3rem;     /* 48px */
  --space-16: 4rem;     /* 64px */
}
```

### Border Radius

```css
:root {
  --radius-sm: 0.25rem;   /* 4px */
  --radius-md: 0.375rem;  /* 6px */
  --radius-lg: 0.5rem;    /* 8px */
  --radius-xl: 0.75rem;   /* 12px */
  --radius-2xl: 1rem;     /* 16px */
  --radius-full: 9999px;
}
```

### Shadows

```css
:root {
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1);
}
```

---

## Component Library

### Buttons

```tsx
// Button variants

// Primary - Main actions
<button className="btn btn-primary">
  Send Message
</button>

// Secondary - Alternative actions
<button className="btn btn-secondary">
  Cancel
</button>

// Ghost - Subtle actions
<button className="btn btn-ghost">
  Learn More
</button>

// Danger - Destructive actions
<button className="btn btn-danger">
  Delete
</button>

// Sizes
<button className="btn btn-primary btn-sm">Small</button>
<button className="btn btn-primary btn-md">Medium</button>
<button className="btn btn-primary btn-lg">Large</button>
```

```css
/* Button Styles */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-lg);
  font-weight: var(--font-medium);
  font-size: var(--text-sm);
  transition: all 150ms ease;
  cursor: pointer;
  border: none;
}

.btn-primary {
  background: var(--primary-600);
  color: white;
}
.btn-primary:hover {
  background: var(--primary-700);
}

.btn-secondary {
  background: var(--neutral-100);
  color: var(--neutral-700);
}
.btn-secondary:hover {
  background: var(--neutral-200);
}

.btn-ghost {
  background: transparent;
  color: var(--neutral-600);
}
.btn-ghost:hover {
  background: var(--neutral-100);
}

.btn-danger {
  background: var(--error-600);
  color: white;
}
.btn-danger:hover {
  background: var(--error-700);
}
```

### Input Fields

```tsx
// Text input
<div className="input-group">
  <label htmlFor="email">Email</label>
  <input 
    type="email" 
    id="email" 
    placeholder="you@example.com"
    className="input"
  />
  <span className="input-hint">We'll never share your email.</span>
</div>

// With error
<div className="input-group input-error">
  <label htmlFor="password">Password</label>
  <input type="password" id="password" className="input" />
  <span className="input-error-message">Password is required</span>
</div>

// Search input
<div className="input-group">
  <SearchIcon className="input-icon" />
  <input 
    type="search" 
    placeholder="Search conversations..."
    className="input input-with-icon"
  />
</div>
```

### Cards

```tsx
// Basic card
<div className="card">
  <div className="card-header">
    <h3>Card Title</h3>
  </div>
  <div className="card-body">
    Content goes here
  </div>
  <div className="card-footer">
    <button className="btn btn-primary">Action</button>
  </div>
</div>

// Platform connection card
<div className="card card-platform">
  <div className="card-platform-icon">
    <TikTokIcon />
  </div>
  <div className="card-platform-info">
    <h4>TikTok</h4>
    <p>@yourusername</p>
  </div>
  <div className="card-platform-status">
    <span className="badge badge-success">Connected</span>
  </div>
</div>
```

### Badges

```tsx
// Status badges
<span className="badge badge-success">Connected</span>
<span className="badge badge-warning">Pending</span>
<span className="badge badge-error">Disconnected</span>
<span className="badge badge-neutral">Draft</span>

// Platform badges
<span className="badge badge-tiktok">TikTok</span>
<span className="badge badge-whatsapp">WhatsApp</span>
<span className="badge badge-facebook">Messenger</span>

// Count badges (notifications)
<span className="badge badge-count">5</span>
```

### Avatars

```tsx
// With image
<div className="avatar avatar-md">
  <img src={user.avatarUrl} alt={user.name} />
</div>

// Fallback to initials
<div className="avatar avatar-md avatar-fallback">
  <span>JD</span>
</div>

// With status indicator
<div className="avatar avatar-md">
  <img src={user.avatarUrl} alt={user.name} />
  <span className="avatar-status avatar-status-online" />
</div>

// Sizes
<div className="avatar avatar-xs" /> /* 24px */
<div className="avatar avatar-sm" /> /* 32px */
<div className="avatar avatar-md" /> /* 40px */
<div className="avatar avatar-lg" /> /* 48px */
<div className="avatar avatar-xl" /> /* 64px */
```

---

## Layout Patterns

### Main Application Layout

```
┌─────────────────────────────────────────────────────────────────┐
│  Header (fixed)                                        User Menu│
├────────────┬────────────────────────────────────────────────────┤
│            │                                                    │
│  Sidebar   │                  Main Content                      │
│  (fixed)   │                                                    │
│            │                                                    │
│  - Inbox   │  ┌──────────────────────────────────────────────┐ │
│  - Settings│  │                                              │ │
│  - Help    │  │     Page content goes here                   │ │
│            │  │                                              │ │
│            │  │                                              │ │
│            │  └──────────────────────────────────────────────┘ │
│            │                                                    │
└────────────┴────────────────────────────────────────────────────┘
```

### Inbox Layout

```
┌─────────────────────────────────────────────────────────────────┐
│  Header                                                         │
├────────┬──────────────────────────────────────────┬─────────────┤
│        │                                          │             │
│ Side   │  Conversation List     Chat Window       │ Contact     │
│ bar    │  ┌────────────────┐   ┌────────────────┐ │ Info        │
│        │  │ ● Jane Doe    │   │                │ │ (Optional)  │
│        │  │   Hi there... │   │   Messages     │ │             │
│        │  ├────────────────┤   │   scroll up    │ │ ┌─────────┐│
│        │  │ ● John Smith  │   │                │ │ │ Avatar  ││
│        │  │   Thanks!     │   │────────────────│ │ │ Name    ││
│        │  ├────────────────┤   │   New messages │ │ │ Platform││
│        │  │   Bob Wilson  │   │   appear here  │ │ │ Actions ││
│        │  │   Question... │   │                │ │ └─────────┘│
│        │  └────────────────┘   ├────────────────┤ │             │
│        │                       │ Message Input  │ │             │
│        │                       └────────────────┘ │             │
└────────┴──────────────────────────────────────────┴─────────────┘
```

### Responsive Breakpoints

```css
/* Mobile first approach */
:root {
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;
  --breakpoint-2xl: 1536px;
}

/* Mobile: Stack everything */
@media (max-width: 767px) {
  .inbox-layout {
    flex-direction: column;
  }
  .conversation-list {
    display: none; /* Show only when no chat selected */
  }
  .chat-window {
    display: none; /* Show only when chat selected */
  }
  .contact-info {
    display: none; /* Hide on mobile */
  }
}

/* Tablet: Two column */
@media (min-width: 768px) and (max-width: 1023px) {
  .conversation-list { width: 320px; }
  .chat-window { flex: 1; }
  .contact-info { display: none; }
}

/* Desktop: Three column */
@media (min-width: 1024px) {
  .conversation-list { width: 320px; }
  .chat-window { flex: 1; }
  .contact-info { width: 280px; }
}
```

---

## Animation Guidelines

### Micro-interactions

```css
/* Transitions */
.transition-fast { transition: all 150ms ease; }
.transition-normal { transition: all 200ms ease; }
.transition-slow { transition: all 300ms ease; }

/* Hover effects */
.hover-lift:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.hover-glow:hover {
  box-shadow: 0 0 0 3px var(--primary-100);
}

/* Button press */
.btn:active {
  transform: scale(0.98);
}

/* New message notification */
@keyframes message-pop {
  0% { transform: scale(0.8); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}

.message-new {
  animation: message-pop 200ms ease-out;
}

/* Typing indicator */
@keyframes typing-dot {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 1; }
}

.typing-indicator span {
  animation: typing-dot 1.4s infinite;
}
.typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
.typing-indicator span:nth-child(3) { animation-delay: 0.4s; }
```

### Loading States

```tsx
// Skeleton loader
<div className="skeleton skeleton-text" />
<div className="skeleton skeleton-avatar" />
<div className="skeleton skeleton-card" />

// Spinner
<div className="spinner spinner-sm" />
<div className="spinner spinner-md" />
<div className="spinner spinner-lg" />

// Progress bar
<div className="progress">
  <div className="progress-bar" style={{ width: '60%' }} />
</div>
```

---

## Accessibility (a11y)

### Keyboard Navigation

- All interactive elements must be keyboard accessible
- Use proper tab order
- Implement focus indicators
- Provide keyboard shortcuts with visible hints

```tsx
// Skip link
<a href="#main-content" className="skip-link">
  Skip to main content
</a>

// Focus indicator
<button className="btn btn-primary focus-visible:ring-2 focus-visible:ring-offset-2">
  Click me
</button>
```

### ARIA Labels

```tsx
// Screen reader labels
<button aria-label="Send message">
  <SendIcon />
</button>

// Live regions for updates
<div aria-live="polite" aria-atomic="true">
  {notification}
</div>

// Form labels
<label htmlFor="search" className="sr-only">Search conversations</label>
<input id="search" type="search" placeholder="Search..." />
```

### Color Contrast

- Text: Minimum 4.5:1 contrast ratio
- Large text (18px+): Minimum 3:1 contrast ratio
- Use tools like Stark or WebAIM to verify

---

## Dark Mode

```css
/* Light mode (default) */
:root {
  --bg-primary: var(--neutral-50);
  --bg-secondary: white;
  --text-primary: var(--neutral-900);
  --text-secondary: var(--neutral-600);
  --border: var(--neutral-200);
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
  :root {
    --bg-primary: var(--neutral-900);
    --bg-secondary: var(--neutral-800);
    --text-primary: var(--neutral-50);
    --text-secondary: var(--neutral-400);
    --border: var(--neutral-700);
  }
}

/* Manual toggle */
[data-theme="dark"] {
  --bg-primary: var(--neutral-900);
  --bg-secondary: var(--neutral-800);
  --text-primary: var(--neutral-50);
  --text-secondary: var(--neutral-400);
  --border: var(--neutral-700);
}
```

---

## Platform-Specific Styling

### TikTok

```css
.platform-tiktok {
  --platform-bg: #000000;
  --platform-accent: #fe2c55;
  --platform-text: #ffffff;
}

.badge-tiktok {
  background: linear-gradient(135deg, #25f4ee, #fe2c55);
  color: white;
}
```

### WhatsApp

```css
.platform-whatsapp {
  --platform-bg: #25d366;
  --platform-accent: #128c7e;
  --platform-text: #ffffff;
}

.badge-whatsapp {
  background: #25d366;
  color: white;
}
```

### Facebook Messenger

```css
.platform-facebook {
  --platform-bg: #1877f2;
  --platform-accent: #0866ff;
  --platform-text: #ffffff;
}

.badge-facebook {
  background: linear-gradient(180deg, #00c6ff, #0068ff);
  color: white;
}
```

---

## Iconography

### Recommended Icon Set

Use [Lucide Icons](https://lucide.dev/) for consistency:

```tsx
import {
  Inbox,
  MessageSquare,
  Settings,
  User,
  Search,
  Send,
  Paperclip,
  Image,
  MoreVertical,
  Check,
  CheckCheck,
  Clock,
  AlertCircle
} from 'lucide-react';

// Usage
<Inbox className="icon" size={20} />
```

### Icon Sizes

| Context | Size |
|---------|------|
| Inline with text | 16px |
| Buttons | 18-20px |
| Navigation | 24px |
| Empty states | 48-64px |

---

## Empty States

```tsx
// No conversations
<div className="empty-state">
  <InboxIcon className="empty-state-icon" />
  <h3>No conversations yet</h3>
  <p>Connect your social accounts to start receiving messages.</p>
  <button className="btn btn-primary">
    Connect Accounts
  </button>
</div>

// Search no results
<div className="empty-state">
  <SearchIcon className="empty-state-icon" />
  <h3>No results found</h3>
  <p>Try adjusting your search or filter to find what you're looking for.</p>
</div>
```

---

## Error States

```tsx
// Form error
<div className="alert alert-error">
  <AlertCircleIcon />
  <span>Please check the highlighted fields.</span>
</div>

// Page error
<div className="error-page">
  <h1>Something went wrong</h1>
  <p>We're having trouble loading this page.</p>
  <button onClick={retry} className="btn btn-primary">
    Try Again
  </button>
</div>

// Connection error
<div className="toast toast-error">
  <AlertCircleIcon />
  <span>Connection lost. Reconnecting...</span>
</div>
```

---

## Writing Guidelines

### Tone of Voice

- **Clear**: Use simple, direct language
- **Friendly**: Warm but professional
- **Helpful**: Guide users, don't lecture
- **Concise**: Get to the point

### Microcopy Examples

| Context | ❌ Bad | ✅ Good |
|---------|--------|---------|
| Button | Submit | Send Message |
| Error | Error 500 | Something went wrong. Please try again. |
| Empty | No data | No conversations yet |
| Loading | Loading... | Getting your messages... |
| Success | Success | Message sent! |
| Confirm | Are you sure? | Delete this conversation? This can't be undone. |

---

## Testing Checklist

### Visual QA

- [ ] Colors match design system
- [ ] Typography is consistent
- [ ] Spacing follows scale
- [ ] Components align properly
- [ ] Dark mode works correctly

### Responsive Testing

- [ ] Mobile (320px - 767px)
- [ ] Tablet (768px - 1023px)
- [ ] Desktop (1024px+)
- [ ] Touch targets are 44px minimum

### Accessibility Testing

- [ ] Keyboard navigation works
- [ ] Screen reader compatible
- [ ] Color contrast passes
- [ ] Focus indicators visible
- [ ] ARIA labels present

### Browser Testing

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari
- [ ] Chrome for Android
