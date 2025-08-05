# 🚚 Coliha – Client Frontend

Coliha is a web app that helps online store owners manage their orders more efficiently.

It connects directly to a Google Sheet that holds all the store's orders. These orders are displayed inside the Coliha app, where the seller can:

✅ View and manage products and orders

📥 Automatically import new orders from their online store (via the linked Sheet)

🚚 Send all confirmed orders at once to the shipping company (ZR Express) through a built-in API — no more copy-pasting orders one by one!

This bulk shipping feature is Coliha's biggest time-saver, especially for sellers dealing with large volumes of orders daily.

The app also includes a dashboard with detailed statistics, allowing sellers to:

💰 Track total profits and earnings

📉 See losses and canceled orders

🛍️ Monitor best-selling products

⏳ Check order processing times

📆 View daily/weekly/monthly sales trends

It’s everything a seller needs to stay organized, save time, and get clear insights — all in one place.

---

## 🧱 Project Structure Overview

client/
├── app/
│ ├── (auth)/ 
│ ├── dashboard/ 
│ ├── feature-a/ 
│ ├── feature-b/ 
│ ├── feature-c/ 
│ ├── feature-d/ 
│ ├── subscriptions/ 
│ ├── settings/ 
│ ├── no-access/ 
│ ├── unwanted-page/ 
│ ├── layout.js / page.js 
│ └── favicon.ico
├── components/ 
│ ├── auth/ 
│ ├── dashboard/ 
│ ├── errorBoundary/ 
│ └── subscriptions/ 
├── context/ 
├── hooks/ 
├── lib/ 
├── styles/ 
├── utils/ 
├── firebase.js 
├── .gitignore
├── package.json
└── README.md

---

## 🛠️ Features Overview

### ✅ Authentication

- Secure login/register system with **JWT**
- Email verification, reset password, forgot password flows

### 📦 Subscription & Plan Management

- Clients can view available plans and choose one
- Upload receipt for manual admin approval 
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
  - UserData/loadingState/loggedState (`authContext`)
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

- JWT-based client-side auth
- Login state is preserved and checked globally
- Routes are protected with both hooks and context logic
- Firebase is optionally used for image upload only

---

## 🔄 Limitations

- ❌ **No TypeScript** (currently using JavaScript)
- ❌ **No real-time sync** (orders stored in Google Sheets, not yet linked to real store)
- ❌ Feature C and D are not filled with advanced tools or automation
- ⚠️ **Firebase storage is public** – Anyone with the file URL can access uploads. **Do not use this setup in production**.

---

## 🚀 Getting Started

This project is already deployed and live on: https://coliha.vercel.app  
However, if you want to run it locally:

```bash
git clone github.com/ishakos/Coliha.git
npm install
npm run dev


