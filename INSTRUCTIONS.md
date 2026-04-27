# ReliefLink — Vibe Coding Guide

> A community crisis board for disaster-hit areas.  
> Stack: HTML + CSS + Vanilla JS + Firebase Firestore (no backend, no login)

---

## Project Structure

```
relieflink/
├── index.html          ← Main app (single page)
├── style.css           ← All styles
├── app.js              ← All logic (Firebase + UI)
└── firebase-config.js  ← Your Firebase credentials (keep private)
```

---

## Step 0 — Firebase Setup (do this first)

1. Go to [https://console.firebase.google.com](https://console.firebase.google.com)
2. Create a new project → call it `relieflink`
3. Go to **Firestore Database** → Create database → Start in **test mode**
4. Go to **Project Settings** → scroll to "Your apps" → click the `</>` web icon
5. Register the app, copy the `firebaseConfig` object
6. Paste it into `firebase-config.js` like this:

```js
// firebase-config.js
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

---

## Step 1 — index.html

Build a single HTML file with this exact structure:

```
<!DOCTYPE html>
<html lang="en">
<head>
  - meta charset, viewport
  - title: "ReliefLink — Community Crisis Board"
  - link to style.css
  - Google Fonts: Import "Syne" (headings) and "DM Sans" (body)
</head>
<body>

  <!-- NAVBAR -->
  <nav>
    - Logo: "ReliefLink" with a small red dot before it (●)
    - Tagline next to it: "Community Crisis Board"
    - Top right: a badge showing live post count e.g. "24 active posts"
  </nav>

  <!-- HERO BANNER -->
  <section id="hero">
    - Big heading: "Post a need. Offer help. Save time."
    - Subtext: "An open noticeboard for disaster-affected communities."
    - One big CTA button: "Post a Need or Offer →" (scrolls to form)
  </section>

  <!-- FILTER BAR -->
  <section id="filters">
    - Label: "Filter by:"
    - Buttons (toggle style): All | Food | Water | Medical | Shelter | Rescue
    - Right side: a toggle switch "Show Urgent Only"
    - Right side: a small text showing "X posts visible"
  </section>

  <!-- POSTS BOARD -->
  <section id="board">
    - A CSS grid of cards (auto-fill, min 280px)
    - Cards are injected here by JavaScript
    - Show a "No posts yet" empty state if board is empty
  </section>

  <!-- POST FORM MODAL -->
  <div id="modal-overlay" class="hidden">
    <div id="modal">
      - Close button (×) top right
      - Heading: "Share what you need or can offer"
      - Form fields:
          1. Toggle buttons: "I Need Help" / "I Can Help" (required)
          2. Dropdown: Category — Food / Water / Medical / Shelter / Rescue
          3. Text input: "Describe briefly" (max 120 chars, show counter)
          4. Text input: "Your location / landmark"
          5. Checkbox: "Mark as URGENT"
      - Submit button: "Post to Board"
    </div>
  </div>

  <!-- FLOATING ACTION BUTTON -->
  <button id="fab">+ Post</button>

  <!-- SCRIPTS -->
  - firebase-config.js
  - Firebase SDK via CDN (compat version):
      https://www.gstatic.com/firebasejs/9.x.x/firebase-app-compat.js
      https://www.gstatic.com/firebasejs/9.x.x/firebase-firestore-compat.js
  - app.js

</body>
</html>
```

---

## Step 2 — style.css

### Design Direction
- **Theme**: Emergency-functional. Dark navy background (`#0a0e1a`), white text, with **red (`#e63946`)** as the only accent color for urgent/need posts and **green (`#2ec4b6`)** for offer posts.
- **Fonts**: `Syne` for headings (700 weight), `DM Sans` for body text
- **Feel**: Like a real ops dashboard — not a pretty landing page

### CSS Variables to define at `:root`
```css
:root {
  --bg: #0a0e1a;
  --surface: #131929;
  --surface-2: #1c2438;
  --border: #2a3450;
  --text: #e8eaf0;
  --text-muted: #7a8299;
  --red: #e63946;
  --green: #2ec4b6;
  --amber: #f4a261;
  --font-head: 'Syne', sans-serif;
  --font-body: 'DM Sans', sans-serif;
  --radius: 12px;
}
```

### Key styles to write

**Navbar**
- Fixed top, full width, `background: var(--surface)`, border-bottom `1px solid var(--border)`
- Logo in `Syne` bold, the red dot is `color: var(--red)`
- Post count badge: small pill with `background: var(--red)` and white text

**Hero**
- Centered, padding `80px 20px`
- Big heading: `font-size: clamp(2rem, 5vw, 3.5rem)`, font Syne
- CTA button: red background, white text, rounded, hover lifts slightly with `transform: translateY(-2px)`

**Filter bar**
- Sticky below navbar, `background: var(--bg)`, `border-bottom: 1px solid var(--border)`
- Filter buttons: outlined by default, filled red on `.active`
- Urgent toggle: custom CSS toggle switch (red when on)

**Post cards**
- `background: var(--surface)`, border `1px solid var(--border)`, `border-radius: var(--radius)`
- Top colored strip: `4px` left border — red for NEED, green for OFFER
- Card has: type badge (NEED/OFFER), category pill, description text, location with 📍, timestamp, urgent badge if flagged, resolve button
- URGENT cards: add `border-color: var(--red)` and a subtle red glow: `box-shadow: 0 0 12px rgba(230,57,70,0.2)`
- Resolved cards: reduced opacity (`0.45`), grayscale filter, "✓ Resolved" overlay badge
- Hover: `transform: translateY(-3px)`, slightly brighter border

**Category pills** — color each differently:
```
Food     → background: #2d4a22  color: #7ecf5a
Water    → background: #1a3a4a  color: #5bc4e8
Medical  → background: #4a1f1f  color: #f08080
Shelter  → background: #2a2a1a  color: #d4c46a
Rescue   → background: #3a1a3a  color: #c47ed4
```

**Modal**
- Full screen overlay: `rgba(0,0,0,0.7)` backdrop, blur `4px`
- Modal box: `background: var(--surface-2)`, max-width `480px`, centered
- Form inputs: dark background `var(--surface)`, border `var(--border)`, white text
- Need/Offer toggle: two big side-by-side buttons, red highlight for NEED, green for OFFER
- Submit button: full width, red, bold

**FAB (Floating Action Button)**
- Fixed bottom-right, `border-radius: 50px`, red, shadow
- Pulse animation on load to draw attention:
```css
@keyframes pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(230,57,70,0.4); }
  50%       { box-shadow: 0 0 0 12px rgba(230,57,70,0); }
}
```

**Empty state**
- Centered in board, icon (you can use a simple SVG or emoji 📋), muted text

**Animations**
- Cards fade+slide in on load: `@keyframes cardIn { from { opacity:0; transform: translateY(16px); } to { opacity:1; transform: none; } }`
- Apply with staggered `animation-delay` using JS inline style

---

## Step 3 — app.js

Write all logic here. Structure it in this order:

### 3a. Firebase Init
```js
// Initialize Firebase using config from firebase-config.js
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const postsRef = db.collection("posts");
```

### 3b. State variables
```js
let activeFilter = "All";   // current category filter
let urgentOnly = false;      // urgent toggle state
let allPosts = [];           // local cache of all posts from Firestore
```

### 3c. Seed data function (call once manually or on first load if collection empty)
Pre-load 8 realistic posts into Firestore so the board isn't empty on demo day:
```
Post 1: NEED | Food     | "Family of 5 needs food packets, 3 days without supply" | Sector 4, Gandhinagar | urgent: true
Post 2: OFFER| Water    | "We have 200L clean water, can deliver within 2km"       | Near Civil Hospital   | urgent: false
Post 3: NEED | Medical  | "Elderly man needs insulin, diabetic, critical"          | Relief Camp B         | urgent: true
Post 4: OFFER| Shelter  | "Community hall open, can hold 40 people overnight"      | Gandhi Maidan         | urgent: false
Post 5: NEED | Rescue   | "3 people stranded on rooftop, rising water"             | Ward 12, River Lane   | urgent: true
Post 6: OFFER| Food     | "Home-cooked meals available, 50 portions ready"         | Shivaji Nagar         | urgent: false
Post 7: NEED | Shelter  | "Single mother with infant, needs safe shelter"          | Old Bus Stand Area    | urgent: true
Post 8: OFFER| Medical  | "Doctor available for free consultations today"          | Primary Health Centre | urgent: false
```
Each post document should have these fields:
```js
{
  type: "NEED" or "OFFER",
  category: "Food" / "Water" / "Medical" / "Shelter" / "Rescue",
  description: "...",
  location: "...",
  urgent: true/false,
  resolved: false,
  timestamp: firebase.firestore.FieldValue.serverTimestamp()
}
```

### 3d. Real-time listener
```js
// Listen to Firestore in real time
postsRef.orderBy("timestamp", "desc").onSnapshot(snapshot => {
  allPosts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  updatePostCount();
  renderBoard();
});
```

### 3e. renderBoard() function
- Filter `allPosts` based on `activeFilter` and `urgentOnly`
- Sort: urgent unresolved first, then by timestamp
- Clear `#board` innerHTML
- For each post, call `createCard(post)` and append to board
- If no posts match filters, show empty state HTML
- Apply staggered animation delay to each card

### 3f. createCard(post) function
Returns an HTML string or DOM element for one post card:
```
Structure of one card:
  <div class="card [need/offer] [urgent?] [resolved?]" data-id="...">
    <div class="card-top">
      <span class="type-badge">NEED or OFFER</span>
      <span class="category-pill">Food / Water / etc</span>
      [if urgent] <span class="urgent-badge">🔴 URGENT</span>
    </div>
    <p class="description">post.description</p>
    <div class="card-footer">
      <span class="location">📍 post.location</span>
      <span class="time">time ago (use timeAgo() helper)</span>
    </div>
    [if not resolved]
      <button class="resolve-btn" onclick="resolvePost('id')">✓ Mark Resolved</button>
    [if resolved]
      <div class="resolved-overlay">✓ Resolved</div>
  </div>
```

### 3g. resolvePost(id) function
```js
// Update the resolved field in Firestore
postsRef.doc(id).update({ resolved: true });
// Real-time listener will auto re-render the board
```

### 3h. Form submission
```js
// On submit button click:
// 1. Read all form values
// 2. Validate (type selected, category selected, description not empty, location not empty)
// 3. Show inline error messages if invalid
// 4. Add to Firestore:
postsRef.add({
  type, category, description, location, urgent,
  resolved: false,
  timestamp: firebase.firestore.FieldValue.serverTimestamp()
});
// 5. Close modal, reset form
```

### 3i. Filter logic
```js
// When a filter button is clicked:
// 1. Set activeFilter = button's category text
// 2. Remove .active from all filter buttons, add to clicked one
// 3. Call renderBoard()

// When urgent toggle is switched:
// 1. Set urgentOnly = toggle.checked
// 2. Call renderBoard()
```

### 3j. Modal open/close
```js
// FAB button → remove .hidden from #modal-overlay
// Close button / clicking overlay → add .hidden back
// Trap: clicking inside modal should NOT close it (stopPropagation)
```

### 3k. updatePostCount() helper
```js
// Count posts where resolved === false
// Update the navbar badge text
```

### 3l. timeAgo(timestamp) helper
```js
// Convert Firestore timestamp to human readable:
// "just now" / "5 min ago" / "2 hrs ago" / "yesterday"
// Handle null timestamps gracefully (show "just now")
```

---

## Step 4 — Final Checklist Before Demo

- [ ] Firebase project is in **test mode** (so anyone can read/write without login)
- [ ] Seed data is loaded and visible on board
- [ ] Posting a new need/offer appears on board within 2 seconds (real-time)
- [ ] Marking resolved dims the card correctly
- [ ] Filters work — especially "Urgent Only"
- [ ] Navbar post count updates live
- [ ] FAB pulse animation is visible
- [ ] App works on mobile (check on your phone)
- [ ] No console errors

---

## Demo Script (for your video)

1. Open app → board shows 8 live posts
2. Click "Urgent Only" → board shows only 4 urgent posts
3. Click "Medical" filter → shows medical posts only
4. Click "All" → reset
5. Click "+ Post" FAB → modal opens
6. Fill form: NEED | Food | "Children need biscuits and water" | Camp 3 near Stadium | check Urgent
7. Submit → new card appears instantly at top of board with 🔴 URGENT
8. Click "✓ Mark Resolved" on any card → it dims and shows resolved state
9. Navbar count decreases by 1

**That's your entire demo. Keep it under 3 minutes.**

---

## Notes for Vibe Coding

- Build `index.html` and `style.css` first — get the UI looking good with hardcoded fake cards
- Only then wire up Firebase in `app.js`
- Test Firebase read/write in browser console before building the full render logic
- If Firebase feels complex, use `localStorage` first to prove the concept, then swap to Firebase
- The app is intentionally one page — don't add routing or multiple pages