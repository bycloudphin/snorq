# SNORQ Brand Guidelines

## Brand Identity

### Tagline
**"All your conversation. One intelligent workspace."**

The tagline emphasizes SNORQ's core value proposition:
- **Unified**: Bringing all conversations together
- **Intelligent**: Smart workspace that helps teams work better
- **Singular Focus**: One place for everything

Alternative supporting copy:
- "Bring every business conversation into focus."

## Logo

The SNORQ logo consists of:
- **Wordmark**: "SNORQ" in bold, black sans-serif typeface
- **Icon**: Lime green chat bubble integrated into the letter "Q"
- **Format**: Horizontal lockup with icon as part of the wordmark

### Logo Files
- Primary Logo: `/public/logo.png`
- Favicon: `/public/favicon.png`

### Usage
- Minimum height: 24px for web
- Clear space: Maintain minimum 16px of clear space around the logo
- Do not modify colors, proportions, or separate elements

## Color Palette

### Primary Colors

**Lime Green** (Primary Brand Color)
- Hex: `#8cc63f`
- RGB: rgb(140, 198, 63)
- Usage: Primary CTAs, accents, interactive elements, focus states
- CSS Variable: `--accent`

**Lime Green Hover**
- Hex: `#7ab82e`
- RGB: rgb(122, 184, 46)
- Usage: Hover states for primary elements
- CSS Variable: `--accent-hover`

**Black** (Primary Text)
- Hex: `#000000`
- RGB: rgb(0, 0, 0)
- Usage: Headings, primary text, wordmark
- CSS Variable: `--text-primary`

### Supporting Colors

**Slate Gray** (Secondary Text)
- Hex: `#64748b`
- RGB: rgb(100, 116, 139)
- Usage: Secondary text, descriptions, labels
- CSS Variable: `--text-secondary`

**Light Gray** (Borders)
- Hex: `#e2e8f0`
- RGB: rgb(226, 232, 240)
- Usage: Borders, dividers
- CSS Variable: `--border-color`

**White** (Background)
- Hex: `#ffffff`
- RGB: rgb(255, 255, 255)
- Usage: Primary backgrounds, cards
- CSS Variable: `--bg-primary`

**Light Slate** (Secondary Background)
- Hex: `#f8fafc`
- RGB: rgb(248, 250, 252)
- Usage: Secondary backgrounds, subtle sections
- CSS Variable: `--bg-secondary`

### Lime Green Shades (Tailwind Scale)

```css
primary-50: #f4fae8    /* Lightest - backgrounds */
primary-100: #e6f4c7   /* Very light - hover backgrounds */
primary-200: #d4ed92   /* Light - borders */
primary-300: #b9e04e   /* Medium light */
primary-400: #a3d63d   /* Medium */
primary-500: #8cc63f   /* Primary brand color */
primary-600: #7ab82e   /* Hover/active states */
primary-700: #5e9122   /* Dark */
primary-800: #4a721b   /* Darker */
primary-900: #3d5e19   /* Darkest - text on light backgrounds */
```

## Typography

### Font Families

**Inter** - Primary Sans-Serif
- Usage: Body text, UI elements, navigation
- Weights: 400 (Regular), 500 (Medium), 600 (Semi-Bold), 700 (Bold)

**Playfair Display** - Serif (Accent)
- Usage: Display headings, featured content
- Weights: 400 (Regular), 500 (Medium), 600 (Semi-Bold), 700 (Bold)

### Type Scale

```css
heading-xl: 4xl-6xl (responsive) - Bold
heading-lg: 3xl-4xl (responsive) - Bold  
heading-md: 2xl-3xl (responsive) - Bold
text-body: base-lg (responsive) - Regular
text-small: sm - Regular
```

## UI Components

### Buttons

**Primary Button**
- Background: Lime Green (#8cc63f)
- Text: White
- Hover: Lime Green Hover (#7ab82e)
- Border Radius: 8px (rounded-lg)

**Secondary Button**
- Background: Slate 900 (#0f172a)
- Text: White
- Hover: Slate 800
- Border Radius: 8px (rounded-lg)

**Outline Button**
- Border: Slate 200
- Text: Slate 900
- Hover Background: Slate 50
- Border Radius: 8px (rounded-lg)

### Inputs
- Border: Slate 200
- Focus Ring: Lime Green with 20% opacity
- Focus Border: Lime Green
- Border Radius: 8px (rounded-lg)

### Cards
- Background: White
- Border: Slate 100
- Border Radius: 16px (rounded-2xl)

## Platform Colors

**TikTok**
- Primary: #000000 (Black)
- Accent: #fe2c55 (Pink)

**WhatsApp**
- Primary: #25d366 (Green)
- Dark: #128c7e

**Facebook/Messenger**
- Primary: #1877f2 (Blue)
- Dark: #0866ff

## Design Principles

1. **Clean & Modern**: Use ample white space and clean lines
2. **Accessible**: Maintain WCAG AA contrast ratios
3. **Consistent**: Apply design system consistently across all touchpoints
4. **Professional**: Balance playfulness of lime green with professional black
5. **Responsive**: Design mobile-first, scale up gracefully

## Theme Configuration

The brand colors are configured in:
- `/frontend/src/styles/index.css` - CSS custom properties
- `/frontend/tailwind.config.js` - Tailwind theme extension
- `/frontend/index.html` - Theme color meta tag

## Updates Made

Based on the SNORQ logo (January 2026):
- ✅ Updated primary color from green (#22c55e) to lime green (#8cc63f)
- ✅ Updated text primary color from slate to pure black
- ✅ Replaced icon-based logos with actual SNORQ logo image
- ✅ Updated favicon to lime green chat bubble
- ✅ Updated theme color meta tag
- ✅ Applied branding consistently across Header, Footer, and Sidebar components
