# Meta Integration Plan (Facebook, Instagram, WhatsApp)

## 1. Meta App Configuration
To support Facebook, Instagram, and WhatsApp messaging, we need a Meta App configured as a **Business** app type.

### Required Products:
1.  **Facebook Login for Business**: Handling OAuth and permissions.
2.  **Messenger**: For Facebook Page messages.
3.  **Instagram Graph API**: For Instagram Direct messages.
4.  **WhatsApp Business Platform**: For WhatsApp messaging.

### Required Permissions (Scopes):
*   `public_profile`, `email`: Basic user info.
*   `pages_show_list`: To list pages the user manages (to select which one to connect).
*   `pages_messaging`: To send/receive messages on Facebook Page.
*   `pages_manage_metadata`: To subscribe to webhooks.
*   `instagram_basic`: To read Instagram account info.
*   `instagram_manage_messages`: To read/respond to Instagram DMs.
*   `whatsapp_business_messaging`: If using Embedded Signup for WhatsApp.

## 2. Integration Flows

### A. Facebook Page & Messenger
1.  **Connect**: User clicks "Connect Facebook" on Dashboard.
2.  **OAuth**: Redirect to Facebook Login dialog.
3.  **Select Pages**: User selects which Facebook Pages to allow.
4.  **Callback**: We receive `code`, exchange for long-lived `user_access_token`.
5.  **Page Selection**: We fetch list of pages (`GET /me/accounts`) and ask user to confirm which one to link to SNORQ.
6.  **Page Token**: We fetch the specific `page_access_token` for that page.
7.  **Webhooks**: We subscribe the app to the Page's `messages`, `messaging_postbacks`, etc.
8.  **Storage**: Save `page_id` and `page_access_token` in `PlatformConnection` table.

### B. Instagram Direct
*   *Prerequisite*: The Instagram Professional account must be connected to a Facebook Page.
1.  **Flow**: This is handled *during* the Facebook Page connection above.
2.  **Discovery**: After getting the Page Token, we query `GET /{page-id}?fields=instagram_business_account`.
3.  **Link**: If an IG account exists, we create a separate `PlatformConnection` record for Instagram (type: `INSTAGRAM`), using the same Page Token (or a dedicated one if needed) to manage it.

### C. WhatsApp Business
*   *Mechanism*: **WhatsApp Embedded Signup**.
1.  **Launch**: User clicks "Connect WhatsApp".
2.  **Popup**: Launches the Facebook SDK Embedded Signup flow.
3.  **Onboarding**: User creates/selects a WABA (WhatsApp Business Account) and Phone Number inside the Meta popup.
4.  **Callback**: The popup returns a `code` and `waba_id`.
5.  **Token Exchange**: Exchange code for a System User Access Token (long-lived).
6.  **Webhooks**: Subscribe to `messages`.

## 3. Database Updates
We need to update the `Platform` enum to support Instagram specifically if we want to track it separately from Facebook.

```prisma
enum Platform {
  TIKTOK
  WHATSAPP
  FACEBOOK
  INSTAGRAM
}
```

## 4. Implementation Steps (Immediate)
1.  **Settings UI**: Create a "Connect" card for Facebook.
2.  **Frontend Logic**: Implement the Facebook OAuth URL construction.
3.  **Backend API**: Create endpoints to handle the OAuth callback and token exchange.
