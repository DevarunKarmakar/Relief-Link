/* ============================================
   RELIEFLINK - MAIN APP LOGIC
   ============================================ */

// ========== FIREBASE INITIALIZATION ==========
// Initialize Firebase using the config from firebase-config.js
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const postsRef = db.collection("posts");

// ========== STATE VARIABLES ==========
// These variables store the current state of the app
let activeFilter = "All";     // Which category filter is selected (All, Food, Water, etc.)
let urgentOnly = false;        // Whether we're showing only urgent posts
let allPosts = [];             // Local cache of all posts from Firestore
let selectedType = null;       // Type selected in form (NEED or OFFER)

// ========== SEED DATA FUNCTION ==========
// Pre-load 8 realistic posts into Firestore for demo purposes
// Call this function ONCE manually in browser console, or it will run on first load if collection is empty
async function seedData() {
  try {
    // Check if posts collection already has data
    const snapshot = await postsRef.limit(1).get();
    if (!snapshot.empty) {
      console.log("Data already seeded. Skipping...");
      return;
    }

    console.log("Seeding data...");

    const seedPosts = [
      {
        type: "NEED",
        category: "Food",
        description: "Family of 5 needs food packets, 3 days without supply",
        location: "Sector 4, Gandhinagar",
        urgent: true,
        resolved: false,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      },
      {
        type: "OFFER",
        category: "Water",
        description: "We have 200L clean water, can deliver within 2km",
        location: "Near Civil Hospital",
        urgent: false,
        resolved: false,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      },
      {
        type: "NEED",
        category: "Medical",
        description: "Elderly man needs insulin, diabetic, critical",
        location: "Relief Camp B",
        urgent: true,
        resolved: false,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      },
      {
        type: "OFFER",
        category: "Shelter",
        description: "Community hall open, can hold 40 people overnight",
        location: "Gandhi Maidan",
        urgent: false,
        resolved: false,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      },
      {
        type: "NEED",
        category: "Rescue",
        description: "3 people stranded on rooftop, rising water",
        location: "Ward 12, River Lane",
        urgent: true,
        resolved: false,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      },
      {
        type: "OFFER",
        category: "Food",
        description: "Home-cooked meals available, 50 portions ready",
        location: "Shivaji Nagar",
        urgent: false,
        resolved: false,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      },
      {
        type: "NEED",
        category: "Shelter",
        description: "Single mother with infant, needs safe shelter",
        location: "Old Bus Stand Area",
        urgent: true,
        resolved: false,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      },
      {
        type: "OFFER",
        category: "Medical",
        description: "Doctor available for free consultations today",
        location: "Primary Health Centre",
        urgent: false,
        resolved: false,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      }
    ];

    // Add each post to Firestore
    for (let post of seedPosts) {
      await postsRef.add(post);
    }

    console.log("✓ Seeding complete! 8 posts added.");
  } catch (error) {
    console.error("Error seeding data:", error);
  }
}

// ========== REAL-TIME FIREBASE LISTENER ==========
// Listen to Firestore in real time - this runs whenever the database changes
postsRef.orderBy("timestamp", "desc").onSnapshot(snapshot => {
  // Convert Firebase documents to JavaScript objects
  allPosts = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));

  console.log(`Posts updated: ${allPosts.length} total posts`);

  // Update the navbar post count and re-render the board
  updatePostCount();
  renderBoard();
});

// ========== UPDATE POST COUNT FUNCTION ==========
// Count unresolved posts and update the navbar badge
function updatePostCount() {
  const unresolvedPosts = allPosts.filter(post => !post.resolved).length;
  const badge = document.getElementById("post-count");
  badge.textContent = `${unresolvedPosts} active post${unresolvedPosts !== 1 ? 's' : ''}`;
}

// ========== RENDER BOARD FUNCTION ==========
// Filter posts based on current filters and display them
function renderBoard() {
  const board = document.getElementById("board");
  board.innerHTML = ""; // Clear the board

  // Filter posts based on activeFilter (category)
  let filteredPosts = allPosts;
  if (activeFilter !== "All") {
    filteredPosts = filteredPosts.filter(post => post.category === activeFilter);
  }

  // Further filter by urgent status if toggle is on
  if (urgentOnly) {
    filteredPosts = filteredPosts.filter(post => post.urgent && !post.resolved);
  }

  // Sort: urgent unresolved first, then by timestamp
  filteredPosts.sort((a, b) => {
    if (a.resolved && !b.resolved) return 1;
    if (!a.resolved && b.resolved) return -1;
    if (a.urgent && !b.urgent) return -1;
    if (!a.urgent && b.urgent) return 1;
    return 0;
  });

  // Show empty state if no posts match
  if (filteredPosts.length === 0) {
    board.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">📋</div>
        <p>No posts yet. Be the first to share!</p>
      </div>
    `;
    updateVisibleCount(0);
    return;
  }

  // Create and append a card for each post
  filteredPosts.forEach((post, index) => {
    const card = createCard(post);
    board.appendChild(card);

    // Staggered animation: each card appears with a slight delay
    card.style.animationDelay = `${index * 50}ms`;
  });

  updateVisibleCount(filteredPosts.length);
}

// ========== CREATE CARD FUNCTION ==========
// Build an HTML card element for a single post
function createCard(post) {
  // Create the main card div
  const card = document.createElement("div");
  card.className = `card ${post.type.toLowerCase()} ${post.urgent ? 'urgent' : ''} ${post.resolved ? 'resolved' : ''}`;
  card.dataset.id = post.id;

  // Build category class for styling
  const categoryClass = `category-pill ${post.category.toLowerCase()}`;

  // Format timestamp to human-readable time
  const timeAgo = formatTimeAgo(post.timestamp);

  // Build the card HTML
  const typeColor = post.type === "NEED" ? "red" : "green";

  card.innerHTML = `
    <div class="card-top">
      <span class="type-badge">${post.type}</span>
      <span class="${categoryClass}">${post.category}</span>
      ${post.urgent ? '<span class="urgent-badge">🔴 URGENT</span>' : ''}
    </div>
    
    <p class="description">${escapeHtml(post.description)}</p>
    
    <div class="card-footer">
      <span class="location">📍 ${escapeHtml(post.location)}</span>
      <span class="time">${timeAgo}</span>
    </div>
    
    ${!post.resolved ? `<button class="resolve-btn" onclick="resolvePost('${post.id}')">✓ Mark Resolved</button>` : ''}
  `;

  return card;
}

// ========== RESOLVE POST FUNCTION ==========
// Mark a post as resolved in Firestore
async function resolvePost(postId) {
  try {
    await postsRef.doc(postId).update({
      resolved: true
    });
    console.log(`Post ${postId} marked as resolved`);
    // The real-time listener will automatically update the board
  } catch (error) {
    console.error("Error resolving post:", error);
    alert("Failed to resolve post. Try again.");
  }
}

// ========== TIME AGO HELPER FUNCTION ==========
// Convert Firestore timestamp to human-readable format
function formatTimeAgo(timestamp) {
  // Handle null/undefined timestamps
  if (!timestamp) return "just now";

  // Convert Firestore timestamp to JavaScript Date
  const postTime = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  const now = new Date();
  const diffMs = now - postTime;
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;

  return postTime.toLocaleDateString();
}

// ========== ESCAPE HTML HELPER ==========
// Prevent XSS attacks by escaping HTML special characters
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

// ========== UPDATE VISIBLE COUNT ==========
// Show how many posts are currently visible after filtering
function updateVisibleCount(count) {
  const countElement = document.getElementById("visible-count");
  countElement.textContent = `${count} post${count !== 1 ? 's' : ''} visible`;
}

// ========== FORM SUBMISSION ==========
// Handle creating a new post
document.getElementById("post-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  // Get form values
  const type = selectedType;
  const category = document.getElementById("category").value;
  const description = document.getElementById("description").value.trim();
  const location = document.getElementById("location").value.trim();
  const urgent = document.getElementById("urgent").checked;

  // Clear previous error messages
  document.querySelectorAll(".error-msg").forEach(el => el.classList.remove("show"));

  // Validate form fields
  let isValid = true;

  if (!type) {
    document.getElementById("type-error").textContent = "Please select NEED or OFFER";
    document.getElementById("type-error").classList.add("show");
    isValid = false;
  }

  if (!category) {
    document.getElementById("category-error").textContent = "Please select a category";
    document.getElementById("category-error").classList.add("show");
    isValid = false;
  }

  if (!description) {
    document.getElementById("description-error").textContent = "Description is required";
    document.getElementById("description-error").classList.add("show");
    isValid = false;
  }

  if (!location) {
    document.getElementById("location-error").textContent = "Location is required";
    document.getElementById("location-error").classList.add("show");
    isValid = false;
  }

  // Stop if validation failed
  if (!isValid) return;

  // Try to add the post to Firestore
  try {
    await postsRef.add({
      type,
      category,
      description,
      location,
      urgent,
      resolved: false,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });

    console.log("✓ Post added successfully!");

    // Close modal and reset form
    closeModal();
    resetForm();
  } catch (error) {
    console.error("Error adding post:", error);
    alert("Failed to post. Check console for details.");
  }
});

// ========== FILTER BUTTON CLICK HANDLERS ==========
document.querySelectorAll(".filter-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    // Remove active class from all buttons, add to clicked one
    document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    // Update filter and re-render
    activeFilter = btn.dataset.filter;
    renderBoard();
  });
});

// ========== URGENT TOGGLE HANDLER ==========
document.getElementById("urgent-toggle").addEventListener("change", (e) => {
  urgentOnly = e.target.checked;
  renderBoard();
});

// ========== MODAL CONTROL ==========
// Get modal elements
const modal = document.getElementById("modal-overlay");
const fab = document.getElementById("fab");
const modalClose = document.getElementById("modal-close");
const heroBtn = document.getElementById("hero-cta");

// Open modal when FAB or hero button clicked
fab.addEventListener("click", openModal);
heroBtn.addEventListener("click", openModal);

// Close modal when X button clicked
modalClose.addEventListener("click", closeModal);

// Close modal when clicking outside of it (on the overlay)
modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    closeModal();
  }
});

// Prevent modal from closing when clicking inside it
document.getElementById("modal").addEventListener("click", (e) => {
  e.stopPropagation();
});

function openModal() {
  modal.classList.remove("hidden");
  document.body.style.overflow = "hidden"; // Prevent scrolling
}

function closeModal() {
  modal.classList.add("hidden");
  document.body.style.overflow = "auto"; // Re-enable scrolling
}

// ========== TYPE TOGGLE IN FORM ==========
// Handle NEED / OFFER button clicks
document.querySelectorAll(".type-btn").forEach(btn => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    
    // Remove active from all type buttons
    document.querySelectorAll(".type-btn").forEach(b => b.classList.remove("active"));
    
    // Add active to clicked button
    btn.classList.add("active");
    
    // Store selected type
    selectedType = btn.dataset.type;
    
    // Clear error message if it was shown
    document.getElementById("type-error").classList.remove("show");
  });
});

// ========== CHARACTER COUNTER FOR DESCRIPTION ==========
document.getElementById("description").addEventListener("input", (e) => {
  const count = e.target.value.length;
  document.getElementById("char-used").textContent = count;
});

// ========== RESET FORM ==========
function resetForm() {
  document.getElementById("post-form").reset();
  selectedType = null;
  document.querySelectorAll(".type-btn").forEach(btn => btn.classList.remove("active"));
  document.getElementById("char-used").textContent = "0";
  document.querySelectorAll(".error-msg").forEach(el => el.classList.remove("show"));
}

// ========== INITIALIZATION ==========
// Run seed data on first load if collection is empty
window.addEventListener("load", async () => {
  console.log("ReliefLink app loaded");
  await seedData();
});

// Log for debugging (you can check this in browser console)
console.log("ReliefLink App initialized. If board is empty, type: seedData() in console");
