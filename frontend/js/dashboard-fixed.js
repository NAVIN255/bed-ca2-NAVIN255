// ===============================
// AUTH CHECK
// ===============================
if (!localStorage.getItem("accessToken")) {
  window.location.href = "index.html";
}

// ===============================
// API SETUP
// ===============================
const apiService = new APIService();
apiService.token = localStorage.getItem("accessToken");

// ===============================
// STATE
// ===============================
let currentChallenges = [];

let userStats = {
  totalPoints: 0,
  completedChallenges: 0,
  activeChallenges: 0,
  level: 1,
  badges: [],
  activeSpellId: null,
  activeSpellName: null
};

// ===============================
// LEVEL CONFIG
// ===============================
const LEVELS = [
  { level: 1, required: 0 },
  { level: 2, required: 200 },
  { level: 3, required: 500 },
  { level: 4, required: 1000 }
];

// ===============================
// INIT
// ===============================
document.addEventListener("DOMContentLoaded", initializeDashboard);

async function initializeDashboard() {
  await loadUserProfile();
  await loadChallenges();
  await loadCompletedCount();
  showChallenges(); // ✅ default view
}

// ===============================
// USER PROFILE
// ===============================
async function loadUserProfile() {
  try {
    const profile = await apiService.getUserProfile();

    userStats.totalPoints = profile.skillpoints || 0;
    userStats.activeSpellId = profile.active_spell_id || null;
    userStats.activeSpellName = null; // resolved in loadSpells()

    updateStatsDisplay();
    updateLevelProgress();
    renderBadges();
    updateActiveSpellDisplay();

  } catch (err) {
    console.error("Failed to load profile:", err);
  }
}

// ===============================
// STATS
// ===============================
function updateStatsDisplay() {
  document.getElementById("totalPoints").textContent =
    userStats.totalPoints;

  document.getElementById("completedChallenges").textContent =
    userStats.completedChallenges;

  document.getElementById("activeChallenges").textContent =
    userStats.activeChallenges;
}

function updateActiveSpellDisplay() {
  const el = document.getElementById("activeSpell");
  if (!el) return;

  el.textContent = userStats.activeSpellName || "None";
}

// ===============================
// LEVEL + BADGES
// ===============================
function updateLevelProgress() {
  let currentLevel = LEVELS[0];
  let nextLevel = LEVELS[1];

  for (let i = 0; i < LEVELS.length; i++) {
    if (userStats.totalPoints >= LEVELS[i].required) {
      currentLevel = LEVELS[i];
      nextLevel = LEVELS[i + 1] || null;
    }
  }

  const bar = document.getElementById("levelProgressBar");
  const text = document.getElementById("levelProgressText");
  if (!bar || !text) return;

  if (!nextLevel) {
    bar.style.width = "100%";
    text.textContent = "Max level reached";
    return;
  }

  const progress =
    ((userStats.totalPoints - currentLevel.required) /
      (nextLevel.required - currentLevel.required)) * 100;

  bar.style.width = `${Math.round(progress)}%`;
  text.textContent =
    `${userStats.totalPoints} / ${nextLevel.required} points to Level ${nextLevel.level}`;
}

function renderBadges() {
  const badgeList = document.getElementById("badgeList");
  if (!badgeList) return;

  if (!userStats.badges.length) {
    badgeList.innerHTML =
      "<span class='badge badge-info'>No badges yet</span>";
    return;
  }

  badgeList.innerHTML = userStats.badges
    .map(b => `<span class="badge badge-success">${b}</span>`)
    .join(" ");
}

// ===============================
// CHALLENGES
// ===============================
async function loadChallenges() {
  try {
    currentChallenges = await apiService.getChallenges();
    userStats.activeChallenges = currentChallenges.length;
    updateStatsDisplay();
    renderChallenges();
  } catch (err) {
    console.error("Load challenges error:", err);
  }
}

function renderChallenges() {
  const list = document.getElementById("challengeList");
  if (!list) return;

  if (!currentChallenges.length) {
    list.innerHTML = "<p>No active challenges</p>";
    return;
  }

  list.innerHTML = currentChallenges.map(c => `
    <div class="challenge-card">
      <h4>${c.challenge}</h4>
      <p>${c.skillpoints} points</p>
      <button class="btn btn-success btn-sm"
        onclick="completeChallenge(${c.challenge_id})">
        Complete
      </button>
    </div>
  `).join("");
}

async function completeChallenge(id) {
  try {
    await apiService.completeChallenge(id, {
      completed: true,
      review_amt: 5,
      notes: "Completed"
    });

    await loadUserProfile();
    await loadChallenges();
    await loadCompletedCount();

    alert("🎉 Challenge completed!");

  } catch (err) {
    if (err.message?.includes("already")) {
      await loadChallenges();
      return;
    }
    alert("Failed to complete challenge");
  }
}

// ===============================
// COMPLETED COUNT
// ===============================
async function loadCompletedCount() {
  try {
    const res = await apiService.makeAuthenticatedRequest(
      "/challenges/completed/count",
      { method: "GET" }
    );

    userStats.completedChallenges =
      res.completedChallenges || 0;

    updateStatsDisplay();

  } catch (err) {
    console.error("Completed count error:", err);
  }
}

// ===============================
// SPELL SHOP
// ===============================
async function loadSpells() {
  try {
    const spells = await apiService.getSpells();
    const shop = document.getElementById("shopContent");
    if (!shop) return;

    shop.innerHTML = spells.map(spell => {
      const isActive =
        spell.spell_id === userStats.activeSpellId;

      const canAfford =
        userStats.totalPoints >= spell.skillpoint_required;

      if (isActive) {
        userStats.activeSpellName = spell.name;
      }

      let buttonText = "Activate";
      let disabled = false;

      if (isActive) {
        buttonText = "✅ Active";
        disabled = true;
      } else if (!canAfford) {
        buttonText = "❌ Not enough points";
        disabled = true;
      }

      return `
        <div class="card">
          <h4>🔮 ${spell.name}</h4>
          <p>Cost: ${spell.skillpoint_required} points</p>
          <button class="btn btn-primary btn-sm"
            ${disabled ? "disabled" : ""}
            onclick="activateSpell(${spell.spell_id})">
            ${buttonText}
          </button>
        </div>
      `;
    }).join("");

    updateActiveSpellDisplay();

  } catch (err) {
    console.error("Load spells error:", err);
  }
}

async function activateSpell(id) {
  try {
    await apiService.makeAuthenticatedRequest("/spells/activate", {
      method: "POST",
      body: JSON.stringify({ spell_id: id })
    });

    alert("🔮 Spell activated!");

    await loadUserProfile();
    await loadSpells();

  } catch (err) {
    alert(err.message || "Failed to activate spell");
  }
}

// ===============================
// UI NAVIGATION
// ===============================
function hideAllSections() {
  document
    .querySelectorAll("section[id]")
    .forEach(s => s.classList.add("hidden"));
}

window.showChallenges = () => {
  hideAllSections();
  document.getElementById("challenges")
    ?.classList.remove("hidden");
};

window.showGamificationSection = () => {
  hideAllSections();
  document.getElementById("gamification")
    ?.classList.remove("hidden");
  loadSpells();
};

window.showProgressSection = () => {
  hideAllSections();
  document.getElementById("progress")
    ?.classList.remove("hidden");
};

// ===============================
// CREATE CHALLENGE MODAL
// ===============================
window.openCreateChallengeModal = () =>
  document.getElementById("createChallengeModal")
    ?.classList.add("show");

window.closeCreateChallengeModal = () =>
  document.getElementById("createChallengeModal")
    ?.classList.remove("show");

window.createChallenge = async () => {
  const form =
    document.getElementById("createChallengeForm");

  const data =
    Object.fromEntries(new FormData(form));

  await apiService.createChallenge({
    challenge: data.challenge,
    skillpoints: Number(data.skillpoints)
  });

  closeCreateChallengeModal();
  loadChallenges();
};

// ===============================
// LOGOUT
// ===============================
document
  .getElementById("logoutBtn")
  ?.addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "index.html";
  });

console.log("🔥 Dashboard fully loaded (A+ build)");
