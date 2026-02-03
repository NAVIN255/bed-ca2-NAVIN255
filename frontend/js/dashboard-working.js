// Check authentication
if (!requireAuth()) {
  // requireAuth will handle redirect if not authenticated
}

// Use the global apiService instance created in api.js
let apiService = window.apiService;
if (!apiService) {
  console.log("Creating new APIService instance");
  apiService = new APIService();
  window.apiService = apiService;
}

// Ensure apiService has the latest tokens from localStorage
apiService.token = localStorage.getItem('accessToken');
apiService.refreshToken = localStorage.getItem('refreshToken');

console.log("APIService initialized with token:", apiService.token ? "Found" : "Missing");

let currentChallenges = [];
let currentShopItems = { spells: [], ingredients: [], resources: [] };
let userStats = { totalPoints: 0, completedChallenges: 0, activeChallenges: 0, currentStreak: 0 };

// ===============================
// HELPER FUNCTIONS
// ===============================

function getDifficulty(points) {
  if (points <= 10) return { level: 'easy', text: '🌱 Apprentice' };
  if (points <= 25) return { level: 'medium', text: '⚡ Adept' };
  return { level: 'hard', text: '🔥 Master' };
}

function updateStatsDisplay() {
  document.getElementById('totalPoints').textContent = userStats.totalPoints;
  document.getElementById('completedChallenges').textContent = userStats.completedChallenges;
  document.getElementById('activeChallenges').textContent = userStats.activeChallenges;
  document.getElementById('currentStreak').textContent = userStats.currentStreak;
}

// Helper function to extract user ID from JWT token
function getUserIdFromToken(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.user_id;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
}

function renderChallenges(challenges) {
  const challengeList = document.getElementById("challengeList");
  
  if (!challenges || challenges.length === 0) {
    challengeList.innerHTML = `
      <div class="card text-center">
        <h3>🎯 No magical quests yet! ✨</h3>
        <p>Create your first wellness quest to begin your magical journey.</p>
        <button class="btn btn-primary" onclick="openCreateChallengeModal()">🌟 Create Quest</button>
        <button class="btn btn-secondary" onclick="createSampleChallenge()">🎲 Add Sample Quests</button>
      </div>
    `;
    return;
  }

  challengeList.innerHTML = challenges.map(challenge => {
    const difficulty = getDifficulty(challenge.skillpoints);
    return `
      <div class="challenge-card fade-in" onclick="showChallengeDetail(${challenge.challenge_id || challenge.id})">
        <div class="challenge-title">${challenge.challenge}</div>
        <div class="challenge-meta">
          <span class="challenge-points">${challenge.skillpoints} points</span>
          <span class="challenge-difficulty difficulty-${difficulty.level}">${difficulty.text}</span>
        </div>
        <div class="challenge-actions">
          <button class="btn btn-success btn-sm" onclick="event.stopPropagation(); completeChallenge(${challenge.challenge_id || challenge.id})">
            ✨ Complete
          </button>
          <button class="btn btn-secondary btn-sm" onclick="event.stopPropagation(); showChallengeDetail(${challenge.challenge_id || challenge.id})">
            📖 Details
          </button>
        </div>
      </div>
    `;
  }).join('');
}

// ===============================
// INITIALIZATION
// ===============================
document.addEventListener('DOMContentLoaded', () => {
  console.log("Dashboard initializing...");
  initializeDashboard();
});

async function initializeDashboard() {
  try {
    await Promise.all([
      loadUserInfo(),
      loadChallenges(),
      loadUserStats(),
      loadGamificationItems()
    ]);
    
    // Add some animation delays
    setTimeout(() => {
      document.querySelectorAll('.fade-in').forEach((el, index) => {
        el.style.animationDelay = `${index * 0.1}s`;
      });
    }, 100);
    
  } catch (error) {
    console.error("Error initializing dashboard:", error);
    ErrorHandler.showError("Failed to load dashboard. Please refresh the page.");
  }
}

// ===============================
// AUTHENTICATION & LOGOUT
// ===============================
document.getElementById("logoutBtn").addEventListener("click", (e) => {
  e.preventDefault();
  console.log("Logout button clicked");
  
  // Show confirmation dialog
  if (confirm("Are you sure you want to logout?")) {
    // Clear tokens
    apiService.clearTokens();
    
    // Show success message
    if (typeof ErrorHandler !== 'undefined') {
      ErrorHandler.showSuccess("Logged out successfully!");
    } else {
      alert("Logged out successfully!");
    }
    
    // Redirect immediately
    window.location.href = "index.html";
  }
});

// ===============================
// USER INFO & STATS
// ===============================
async function loadUserInfo() {
  try {
    const welcome = document.getElementById("welcome");
    welcome.textContent = "🌟 Welcome back, Magical Wellness Warrior! ✨";
  } catch (error) {
    console.error("Error loading user info:", error);
  }
}

async function loadUserStats() {
  try {
    // Use mock data for now
    userStats = {
      totalPoints: Math.floor(Math.random() * 500) + 100,
      completedChallenges: Math.floor(Math.random() * 20) + 5,
      activeChallenges: Math.floor(Math.random() * 10) + 3,
      currentStreak: Math.floor(Math.random() * 15) + 1
    };
    
    updateStatsDisplay();
  } catch (error) {
    console.error("Error loading user stats:", error);
  }
}

// ===============================
// CHALLENGES MANAGEMENT
// ===============================
async function loadChallenges() {
  try {
    console.log("Loading challenges...");
    
    const challengeList = document.getElementById("challengeList");
    challengeList.innerHTML = '<div class="loading"><div class="spinner"></div><span>Loading challenges...</span></div>';
    
    const challenges = await apiService.getChallenges();
    console.log("Challenges received:", challenges);

    currentChallenges = Array.isArray(challenges) ? challenges : [];
    renderChallenges(currentChallenges);

  } catch (error) {
    console.error("Error loading challenges:", error);
    
    const challengeList = document.getElementById("challengeList");
    challengeList.innerHTML = `
      <div class="card text-center">
        <h3>Unable to load challenges 😔</h3>
        <p>Error: ${error.message}</p>
        <div class="mt-2">
          <button class="btn btn-primary" onclick="loadChallenges()">Retry</button>
          <button class="btn btn-secondary" onclick="createSampleChallenge()">Create Sample Challenge</button>
        </div>
      </div>
    `;
  }
}

// ===============================
// GAMIFICATION SYSTEM
// ===============================
async function loadGamificationItems() {
  try {
    // Mock data for now
    currentShopItems = {
      spells: [
        { id: 1, name: "🔥 Energy Boost Spell", description: "Increases motivation and energy for 24 hours", cost: 50 },
        { id: 2, name: "🧠 Focus Enhancement", description: "Improves concentration and mental clarity", cost: 75 },
        { id: 3, name: "💚 Healing Potion", description: "Restores health and vitality", cost: 100 },
        { id: 4, name: "⚡ Lightning Speed", description: "Boosts physical performance", cost: 120 },
        { id: 5, name: "🌟 Celestial Blessing", description: "Grants overall wellness enhancement", cost: 200 }
      ],
      ingredients: [
        { id: 1, name: "🌿 Mint Leaves", description: "Fresh and energizing herb", cost: 20 },
        { id: 2, name: "🌱 Ginseng Root", description: "Boosts energy naturally", cost: 35 },
        { id: 3, name: "💜 Lavender", description: "Promotes relaxation and calm", cost: 25 },
        { id: 4, name: "🍯 Golden Honey", description: "Sweet energy source", cost: 30 },
        { id: 5, name: "🌸 Cherry Blossoms", description: "Brings peace and serenity", cost: 40 }
      ],
      resources: [
        { id: 1, name: "💎 Wellness Crystal", description: "Amplifies positive energy", cost: 150 },
        { id: 2, name: "🧘‍♀️ Meditation Stone", description: "Enhances mindfulness practice", cost: 80 },
        { id: 3, name: "⚡ Energy Gem", description: "Provides sustained magical energy", cost: 120 },
        { id: 4, name: "🌙 Moonstone", description: "Brings balance and harmony", cost: 100 },
        { id: 5, name: "☀️ Sunstone", description: "Radiates warmth and vitality", cost: 110 }
      ]
    };
  } catch (error) {
    console.error("Error loading gamification items:", error);
  }
}

// ===============================
// GLOBAL FUNCTIONS (EXPOSED TO WINDOW)
// ===============================

window.openCreateChallengeModal = function() {
  const modal = document.getElementById('createChallengeModal');
  modal.classList.add('show');
  
  // Clear form
  document.getElementById('createChallengeForm').reset();
};

window.closeCreateChallengeModal = function() {
  const modal = document.getElementById('createChallengeModal');
  modal.classList.remove('show');
};

window.createChallenge = async function() {
  try {
    const form = document.getElementById('createChallengeForm');
    const formData = new FormData(form);
    
    const challengeData = {
      challenge: formData.get('challenge'),
      skillpoints: parseInt(formData.get('skillpoints'))
    };
    
    // Basic validation fallback
    if (!challengeData.challenge || challengeData.challenge.trim().length < 10) {
      ErrorHandler.showError("Challenge description must be at least 10 characters long");
      return;
    }
    if (!challengeData.skillpoints || challengeData.skillpoints < 1) {
      ErrorHandler.showError("Skill points must be at least 1");
      return;
    }
    
    console.log("Creating challenge:", challengeData);
    console.log("APIService token:", apiService.token ? "Present" : "Missing");
    console.log("APIService baseURL:", apiService.baseURL);
    
    const result = await apiService.createChallenge(challengeData);
    console.log("Challenge created in backend:", result);
    
    ErrorHandler.showSuccess("Magical quest created successfully! 🎉✨");
    window.closeCreateChallengeModal();
    
    // Reload challenges
    await loadChallenges();
    
    // Update stats
    userStats.activeChallenges += 1;
    updateStatsDisplay();
    
  } catch (error) {
    console.error("Error creating challenge:", error);
    ErrorHandler.showError(`Failed to create magical quest: ${error.message}`);
  }
};

window.createSampleChallenge = async function() {
  const sampleChallenges = [
    { challenge: "🚶‍♀️ Walk 10,000 magical steps today", skillpoints: 10 },
    { challenge: "💧 Drink 8 enchanted glasses of water", skillpoints: 8 },
    { challenge: "💪 Do 20 mystical push-ups", skillpoints: 15 },
    { challenge: "🧘‍♀️ Meditate for 10 minutes in tranquility", skillpoints: 12 },
    { challenge: "🥗 Eat 5 servings of magical fruits and vegetables", skillpoints: 18 },
    { challenge: "🏃‍♂️ Run for 30 minutes like the wind", skillpoints: 25 },
    { challenge: "🧘‍♂️ Practice yoga for inner balance", skillpoints: 20 },
    { challenge: "📚 Read for 1 hour to expand your mind", skillpoints: 15 }
  ];
  
  try {
    const randomChallenge = sampleChallenges[Math.floor(Math.random() * sampleChallenges.length)];
    
    console.log("Creating sample challenge:", randomChallenge);
    
    const result = await apiService.createChallenge(randomChallenge);
    console.log("Sample challenge created:", result);
    
    ErrorHandler.showSuccess("Magical quest added! 🎯✨");
    
    // Reload challenges
    await loadChallenges();
    
  } catch (error) {
    console.error("Error creating sample challenge:", error);
    ErrorHandler.showError(`Failed to create sample quest: ${error.message}`);
  }
};

window.completeChallenge = async function(challengeId) {
  try {
    const challenge = currentChallenges.find(c => (c.challenge_id || c.id) === challengeId);
    if (!challenge) {
      ErrorHandler.showError("Challenge not found");
      return;
    }
    
    console.log("Completing challenge:", challengeId);
    
    // Try to save completion to backend
    try {
      const completionData = {
        completed: true,
        review_amt: 5,
        notes: `Completed challenge: ${challenge.challenge}`
      };
      
      const result = await apiService.completeChallenge(challengeId, completionData);
      console.log("Challenge completion saved to backend:", result);
      
    } catch (backendError) {
      console.error("Backend completion failed:", backendError);
    }
    
    // Update local stats
    userStats.totalPoints += challenge.skillpoints;
    userStats.completedChallenges += 1;
    userStats.activeChallenges = Math.max(0, userStats.activeChallenges - 1);
    
    updateStatsDisplay();
    
    ErrorHandler.showSuccess(`Quest completed! You earned ${challenge.skillpoints} magical points! 🏆✨`);
    
    // Add some celebration animation
    const buttons = document.querySelectorAll(`[onclick*="completeChallenge(${challengeId})"]`);
    buttons.forEach(button => {
      button.textContent = "✅ Completed";
      button.disabled = true;
      button.classList.remove('btn-success');
      button.classList.add('btn-secondary');
    });
    
  } catch (error) {
    console.error("Error completing challenge:", error);
    ErrorHandler.showError(`Failed to complete challenge: ${error.message}`);
  }
};

window.showChallengeDetail = function(challengeId) {
  const challenge = currentChallenges.find(c => (c.challenge_id || c.id) === challengeId);
  if (!challenge) {
    ErrorHandler.showError("Challenge not found");
    return;
  }
  
  const modal = document.getElementById('challengeDetailModal');
  const title = document.getElementById('challengeDetailTitle');
  const body = document.getElementById('challengeDetailBody');
  const footer = document.getElementById('challengeDetailFooter');
  
  title.textContent = "Challenge Details";
  
  const difficulty = getDifficulty(challenge.skillpoints);
  
  body.innerHTML = `
    <div class="challenge-detail">
      <h4>${challenge.challenge}</h4>
      <div class="challenge-meta mb-3">
        <span class="badge badge-info">${challenge.skillpoints} points</span>
        <span class="badge badge-${difficulty.level === 'easy' ? 'success' : difficulty.level === 'medium' ? 'warning' : 'info'}">
          ${difficulty.text}
        </span>
      </div>
      <p><strong>Description:</strong> ${challenge.challenge}</p>
      <p><strong>Reward:</strong> ${challenge.skillpoints} wellness points</p>
      <p><strong>Difficulty:</strong> ${difficulty.text}</p>
    </div>
  `;
  
  footer.innerHTML = `
    <button class="btn btn-secondary" onclick="closeChallengeDetailModal()">Close</button>
    <button class="btn btn-success" onclick="completeChallenge(${challengeId}); closeChallengeDetailModal();">
      Complete Challenge
    </button>
  `;
  
  modal.classList.add('show');
};

window.closeChallengeDetailModal = function() {
  const modal = document.getElementById('challengeDetailModal');
  modal.classList.remove('show');
};

window.filterChallenges = function() {
  const difficultyFilter = document.getElementById('difficultyFilter').value;
  
  let filteredChallenges = currentChallenges;
  
  if (difficultyFilter) {
    filteredChallenges = currentChallenges.filter(challenge => {
      const difficulty = getDifficulty(challenge.skillpoints);
      return difficulty.level === difficultyFilter;
    });
  }
  
  renderChallenges(filteredChallenges);
};

window.showGamificationSection = function() {
  // Hide other sections
  document.getElementById('challenges').classList.add('hidden');
  document.getElementById('progress').classList.add('hidden');
  
  // Show gamification section
  document.getElementById('gamification').classList.remove('hidden');
  
  // Load spells by default
  window.showShopTab('spells');
  
  // Scroll to section
  document.getElementById('gamification').scrollIntoView({ behavior: 'smooth' });
};

window.showProgressSection = function() {
  // Hide other sections
  document.getElementById('challenges').classList.add('hidden');
  document.getElementById('gamification').classList.add('hidden');
  
  // Show progress section
  document.getElementById('progress').classList.remove('hidden');
  
  // Scroll to section
  document.getElementById('progress').scrollIntoView({ behavior: 'smooth' });
};

window.showShopTab = function(category) {
  // Update tab buttons
  document.querySelectorAll('.shop-tab').forEach(tab => {
    tab.classList.remove('active');
  });
  
  // Find the clicked tab and make it active
  const clickedTab = document.querySelector(`[onclick*="showShopTab('${category}')"]`);
  if (clickedTab) {
    clickedTab.classList.add('active');
  }
  
  // Render items
  const shopContent = document.getElementById('shopContent');
  const items = currentShopItems[category] || [];
  
  if (items.length === 0) {
    shopContent.innerHTML = `
      <div class="text-center">
        <p>No ${category} available at the moment.</p>
      </div>
    `;
    return;
  }
  
  shopContent.innerHTML = `
    <div class="grid grid-3">
      ${items.map(item => `
        <div class="card">
          <h4>${item.name}</h4>
          <p>${item.description}</p>
          <div class="item-cost">
            <span class="badge badge-warning">${item.cost} points</span>
          </div>
          <button class="btn btn-primary btn-sm w-full mt-2" 
                  onclick="purchaseItem('${category}', ${item.id}, ${item.cost})"
                  ${userStats.totalPoints < item.cost ? 'disabled' : ''}>
            ${userStats.totalPoints < item.cost ? 'Not enough points' : 'Purchase'}
          </button>
        </div>
      `).join('')}
    </div>
  `;
};

window.purchaseItem = function(category, itemId, cost) {
  if (userStats.totalPoints < cost) {
    ErrorHandler.showError("Not enough points to purchase this item!");
    return;
  }
  
  const item = currentShopItems[category].find(i => i.id === itemId);
  if (!item) {
    ErrorHandler.showError("Item not found!");
    return;
  }
  
  // Deduct points
  userStats.totalPoints -= cost;
  updateStatsDisplay();
  
  ErrorHandler.showSuccess(`Successfully purchased ${item.name}! 🛒✨`);
  
  // Refresh the shop display
  window.showShopTab(category);
};

window.loadChallenges = loadChallenges;

// ===============================
// NAVIGATION
// ===============================
document.addEventListener('click', (e) => {
  if (e.target.matches('a[href^="#"]')) {
    e.preventDefault();
    const targetId = e.target.getAttribute('href').substring(1);
    
    // Hide all sections
    document.querySelectorAll('section[id]').forEach(section => {
      if (section.id !== 'welcome-section' && section.id !== 'stats-section' && section.id !== 'quick-actions') {
        section.classList.add('hidden');
      }
    });
    
    // Show target section
    const targetSection = document.getElementById(targetId);
    if (targetSection) {
      targetSection.classList.remove('hidden');
      targetSection.scrollIntoView({ behavior: 'smooth' });
    }
  }
});

// ===============================
// MODAL CLICK OUTSIDE TO CLOSE
// ===============================
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.classList.remove('show');
  }
});

console.log("Dashboard script loaded successfully!");
console.log("Available functions:", {
  openCreateChallengeModal: typeof window.openCreateChallengeModal,
  showGamificationSection: typeof window.showGamificationSection,
  showProgressSection: typeof window.showProgressSection,
  filterChallenges: typeof window.filterChallenges
});