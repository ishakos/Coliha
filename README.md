🚚 Coliha

The user-facing frontend of the Coliha logistics platform. Built with **Next.js**, it allows clients to manage their subscription, handle orders, interact with third-party shipping APIs, and track their activity — all through a secure, structured, and cleanly written UI.
> ✅ This project is designed to demonstrate full-stack web development skills including authentication, role-based access, data handling, component architecture, and feature planning.

---

## 🧱 Project Structure Overview

client/
├── app/
│ ├── (auth)/ # Auth pages (login, register, etc.)
│ ├── dashboard/ 
│ ├── feature-a/ # Order management (CRUD)
│ ├── feature-b/ # Shipping API integration
│ ├── feature-c/ # Reserved for future features
│ ├── feature-d/ # Reserved for future features
│ ├── subscriptions/ # Plan selection + receipt upload
│ ├── settings/ # Profile, password, tokens, verification
│ ├── no-access/ # Blocked access fallback
│ ├── unwanted-page/ # Session expired fallback
│ ├── layout.js / page.js # Layout & root routing
│ └── favicon.ico
├── components/ # UI and logic components
│ ├── auth/ # Auth-related forms
│ ├── dashboard/ # Dashboard widgets
│ ├── errorBoundary/ # Error handling components
│ └── subscriptions/ # Subscription UI
├── context/ # App-wide context (auth, subscription)
├── hooks/ # Custom hooks for routing, permissions
├── lib/ # Logic for auth and subscription context
├── styles/ # Global styles
├── utils/ # Wilaya and commune data
├── firebase.js # Firebase setup
├── .gitignore
├── package.json
└── README.md


---

## 🛠️ Features Overview

### 📦 Subscription & Plan Management

- Clients can view available plans and choose one
- Upload receipt for manual admin approval (back office)
- Access to features is locked behind subscription checks

### 📁 Orders & Dashboard

- **Feature A:** Full CRUD operations on user orders
- **Feature B:** Link confirmed orders to a shipping company via API
- **Dashboard:** See summarized order analytics/statistics
- **Feature C & D:** Placeholders for future features

### ⚙️ Settings

- Upload profile image
- Change password
- Re-send email verification
- Update shipping company token (used for API connection)

### 🧠 Utilities & Logic

- **Wilaya & Commune data** stored in `utils/wilayasData.js`
- **Context logic** handles:
  - User login/logout/loading (`authContext`)
  - Plan-level permissions (`subscribeContext`)
- **Hooks:**
  - `useRedirect`: Redirect user based on auth state
  - `useSubscribe`: Redirect user if their plan lacks access

### 🧱 Error Handling

- Global `ErrorBoundary` with fallback pages
- `Unwanted.js`: Handles out-of-session scenarios
- `no-access`: Handles access restrictions

---

## 🔐 Security & Auth

- Login state is preserved and checked globally
- Routes are protected with both hooks and context logic
- Firebase is optionally used for image upload or auth events

---

## 🔄 Limitations & Future Work

- ❌ **No TypeScript** (currently using JavaScript)
- ❌ **No real-time sync** (orders stored in Google Sheets, not yet linked to real store)
- ✅ Real-time store integration planned
- ✅ Feature C and D will be filled with advanced tools or automation
- 🟡 File uploads work, but no CDN or storage optimization yet

---

## 🚀 Getting Started

### Install dependencies:

```bash
npm install

```

⚠️ Firebase Setup Required
Run the development server:
npm run dev
App will be available at http://localhost:3000
