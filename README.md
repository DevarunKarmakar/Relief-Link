# 🔴 ReliefLink — Community Crisis Board

> An open, real-time noticeboard for disaster-affected communities. Post a need, offer help, save time.

![Firebase](https://img.shields.io/badge/Firebase-Firestore-orange?logo=firebase)
![HTML](https://img.shields.io/badge/Built%20With-HTML%20%2B%20CSS%20%2B%20JS-blue)
![Status](https://img.shields.io/badge/Status-Live-brightgreen)

---

## 🌐 Live Demo

👉 **[https://relieflink-6925e.web.app](https://relieflink-6925e.web.app)**

---

## 📌 What is ReliefLink?

ReliefLink is a lightweight, no-login community crisis board built for disaster-hit areas. Anyone can:

- 📢 Post a **need** (food, water, medical help, shelter, rescue)
- 🤝 Post an **offer** (what they can provide)
- 🔴 Mark posts as **URGENT**
- ✅ Mark posts as **Resolved** once addressed
- 🔍 Filter by category or urgency

All posts update in **real time** via Firebase Firestore — no account needed, no backend required.

---

## ✨ Features

- Real-time post board powered by **Firebase Firestore**
- Filter by category: Food / Water / Medical / Shelter / Rescue
- **Urgent Only** toggle to surface critical needs
- Post form modal with validation
- Resolve button to dim and archive handled posts
- Live post count in navbar
- Mobile responsive design
- No login, no backend — fully open and accessible

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| Database | Firebase Firestore (NoSQL, real-time) |
| Hosting | Firebase Hosting |
| Fonts | Syne (headings), DM Sans (body) |

---

## 📁 Project Structure

```
relieflink/
├── index.html          ← Main app (single page)
├── style.css           ← All styles
├── app.js              ← All logic (Firebase + UI)
├── firebase-config.js  ← Firebase credentials (keep private)
└── firebase.json       ← Firebase hosting config
```

---

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/DevarunKarmakar/Relief-Link.git
cd Relief-Link
```

### 2. Set up Firebase

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project
3. Enable **Firestore Database** in test mode
4. Go to **Project Settings** → **Your apps** → click `</>`
5. Copy the `firebaseConfig` object and paste it into `firebase-config.js`:

```js
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### 3. Run locally

Just open `index.html` in your browser — no build step needed.

### 4. Deploy to Firebase

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| Background | `#0a0e1a` (dark navy) |
| Surface | `#131929` |
| Accent (Need/Urgent) | `#e63946` (red) |
| Accent (Offer) | `#2ec4b6` (teal) |
| Text | `#e8eaf0` |

---

## 📋 Firestore Data Model

Each post in the `posts` collection has the following fields:

```js
{
  type: "NEED" | "OFFER",
  category: "Food" | "Water" | "Medical" | "Shelter" | "Rescue",
  description: "string (max 120 chars)",
  location: "string",
  urgent: true | false,
  resolved: true | false,
  timestamp: Firestore ServerTimestamp
}
```

---

## 🙌 Built For

This project was built for a **H2S SOLUTION CHALLENGE** to demonstrate how a simple, no-barrier tool can make a real difference during disaster response — where every second counts.

---

## 👥 Team

| Name | GitHub |
|------|--------|
| **Devarun Karmakar** | [@DevarunKarmakar](https://github.com/DevarunKarmakar) |
| **Sayani Chatterjee** |[@Sayani-svg](https://github.com/Sayani-svg)|
| **Rupesh Saha** | — |

---

## 📄 License

This project is open source and free to use for humanitarian and community purposes.
