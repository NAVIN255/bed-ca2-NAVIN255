// ===============================
// AUTH CHECK (MUST BE FIRST)
// ===============================
if (!requireAuth()) {
  // requireAuth handles redirect
}

// ===============================
// API SERVICE SETUP
// ===============================
let apiService = window.apiService;
if (!apiService) {
  apiService = new APIService();
  window.apiService = apiService;
}

apiService.token = localStorage.getItem("accessToken");
console.log("APIService token:", apiService.token ? "FOUND" : "MISSING");

// ===============================
// STATE
// ===============================
let currentChallenges = [];

let userStats = {
  totalPoints: 0,
  completedChallenges: 0,
  activeChallenges: 0
};
// ===============================
// HELPER FUNCTIONS
// ===============================
function getDifficulty(points) {
  if (points <= 10) return { level: "easy", text: "🌱 Easy" };
  if (points <= 25) return { level: "medium", text: "⚡ Medium" };
  return { level: "hard", text: "🔥 Hard" };
}

function updateStatsDisplay() {
  document.getElementById("totalPoints").textContent = userStats.totalPoints;
  document.getElementById("completedChallenges").textContent = userStats.completedChallenges;
  document.getElementById("activeChallenges").textContent = userStats.activeChallenges;
}

function updateProgressUI() {
  const weeklyGoal = 5;
  const progress = Math.min(userStats.completedChallenges, weeklyGoal);
  const percent = Math.round((progress / weeklyGoal) * 100);

  const bar = document.querySelector(".progress-fill");
  const text = document.querySelector(".progress-item p");

  if (bar) bar.style.width = percent + "%";
  if (text) text.textContent = `${percent}% complete (${progress}/${weeklyGoal} challenges)`;
}

function hideAllSections() {
  document.querySelectorAll("section[id]").forEach(sec => {
    sec.classList.add("hidden");
  });
}

// ===============================
// RENDER CHALLENGES
// ===============================
function renderChallenges(challenges) {
  const challengeList = document.getElementById("challengeList");

  if (!challenges || challenges.length === 0) {
    challengeList.innerHTML = `
      <div class="card text-center">
        <h3>No challenges yet 🎯</h3>
        <button class="btn btn-primary" onclick="openCreateChallengeModal()">Create Challenge</button>
        <button class="btn btn-secondary" onclick="createSampleChallenge()">Add Sample</button>
      </div>
    `;
    return;
  }

  challengeList.innerHTML = challenges.map(challenge => {
    const diff = getDifficulty(challenge.skillpoints);

    return `
      <div class="challenge-card">
        <h4>${challenge.challenge}</h4>
        <p>${challenge.skillpoints} points — ${diff.text}</p>
        <button class="btn btn-success btn-sm"
          onclick="completeChallenge(${challenge.challenge_id})">
          Complete
        </button>
      </div>
    `;
  }).join("");
}

// ===============================
// INITIALIZATION
// ===============================
document.addEventListener("DOMContentLoaded", initializeDashboard);

async function initializeDashboard() {
await loadUserProfile();
await loadChallenges();
await loadCompletedCount();
}

// ===============================
// USER INFO
// ===============================
async function loadUserInfo() {
  const welcome = document.getElementById("welcome");
  if (welcome) welcome.textContent = "Welcome back 👋";
}

async function loadUserProfile() {
  try {
    const profile = await apiService.getUserProfile();

    userStats.totalPoints = profile.skillpoints || 0;

    updateStatsDisplay();
  } catch (err) {
    console.error("Failed to load user profile", err);
  }
}

async function loadCompletedCount() {
  try {
    const res = await apiService.makeAuthenticatedRequest(
      "/challenges/completed/count",
      { method: "GET" }
    );

    userStats.completedChallenges = res.completedChallenges || 0;
    updateStatsDisplay();
    updateProgressUI();

  } catch (err) {
    console.error("Failed to load completed count", err);
  }
}
// ===============================
// LOAD CHALLENGES
// ===============================
async function loadChallenges() {
  try {
    const challenges = await apiService.getChallenges();

    currentChallenges = Array.isArray(challenges) ? challenges : [];

    userStats.activeChallenges = currentChallenges.length;

    updateStatsDisplay();
    renderChallenges(currentChallenges);

  } catch (err) {
    console.error("Load challenges error:", err);
  }
}


// ===============================
// CREATE CHALLENGE
// ===============================
window.openCreateChallengeModal = () =>
  document.getElementById("createChallengeModal").classList.add("show");

window.closeCreateChallengeModal = () =>
  document.getElementById("createChallengeModal").classList.remove("show");

window.createChallenge = async () => {
  const form = document.getElementById("createChallengeForm");
  const data = Object.fromEntries(new FormData(form));

  if (!data.challenge || data.challenge.length < 5) {
    alert("Challenge too short");
    return;
  }

  data.skillpoints = Number(data.skillpoints);

  await apiService.createChallenge(data);
  closeCreateChallengeModal();
  loadChallenges();
};

// ===============================
// SAMPLE CHALLENGE
// ===============================
window.createSampleChallenge = async () => {
  await apiService.createChallenge({
    challenge: "Walk 10,000 steps today",
    skillpoints: 10
  });
  loadChallenges();
};

// ===============================
// COMPLETE CHALLENGE
// ===============================
window.completeChallenge = async (id) => {
  try {
    await apiService.completeChallenge(id, {
      completed: true,
      review_amt: 5,
      notes: "Challenge completed"
    });

    // 🔁 Reload everything from backend (single source of truth)
    await loadUserProfile();
    await loadChallenges();

    alert("🎉 Challenge completed!");

  } catch (err) {
    if (err.message.includes("already")) {
      // Still reload to stay in sync
      await loadChallenges();
      return;
    }

    console.error("Complete challenge error:", err);
    alert("Failed to complete challenge");
  }
};
// ===============================
// NAVIGATION
// ===============================
window.showGamificationSection = () => {
  hideAllSections();
  document.getElementById("gamification").classList.remove("hidden");

  document.getElementById("shopContent").innerHTML = `
    <div class="grid grid-3">
      <div class="card"><h4>🔮 Focus Spell</h4><p>50 points</p></div>
      <div class="card"><h4>💚 Energy Potion</h4><p>75 points</p></div>
      <div class="card"><h4>💎 Wellness Crystal</h4><p>100 points</p></div>
    </div>
  `;
};

window.showProgressSection = () => {
  hideAllSections();
  document.getElementById("progress").classList.remove("hidden");
};

// ===============================
// LOGOUT
// ===============================
document.getElementById("logoutBtn")?.addEventListener("click", () => {
  localStorage.clear();
  window.location.href = "index.html";
});

console.log("Dashboard JS ready ✅");