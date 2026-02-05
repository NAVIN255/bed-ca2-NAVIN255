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
// INIT
// ===============================
document.addEventListener("DOMContentLoaded", loadProfile);

// ===============================
// LOAD PROFILE
// ===============================
async function loadProfile() {
  try {
    const profile = await apiService.getUserProfile();
    const spells = await apiService.makeAuthenticatedRequest("/spells/user");

    // --- Basic Info ---
    document.getElementById("profileUsername").textContent =
      profile.username;

    document.getElementById("profileEmail").textContent =
      profile.email;

    document.getElementById("profileLevel").textContent =
      profile.level;

    document.getElementById("profilePoints").textContent =
      profile.skillpoints;

    // --- Active Spell ---
    const activeSpellEl = document.getElementById("activeSpellDisplay");

    if (profile.active_spell_name) {
      activeSpellEl.textContent =
        `🔥 ${profile.active_spell_name} (${profile.active_spell_uses} / 3 uses left)`;
    } else {
      activeSpellEl.textContent = "No active spell";
    }

    // --- Owned Spells ---
    renderOwnedSpells(spells);

    // --- Badges ---
    renderBadges(profile.badges);

    // --- Completed Count ---
    const countRes = await apiService.makeAuthenticatedRequest(
      "/challenges/completed/count"
    );

    document.getElementById("completedCount").textContent =
      countRes.completedChallenges || 0;

  } catch (err) {
    console.error("Profile load failed:", err);
    alert("Failed to load profile");
  }
}

// ===============================
// RENDER OWNED SPELLS
// ===============================
function renderOwnedSpells(spells) {
  const container = document.getElementById("ownedSpells");

  if (!spells.length) {
    container.innerHTML = "<p>No spells owned yet</p>";
    return;
  }

  container.innerHTML = spells.map(spell => `
    <div class="card">
      <h4>🔮 ${spell.name}</h4>
      <span class="badge badge-success">Owned</span>
    </div>
  `).join("");
}

// ===============================
// RENDER BADGES
// ===============================
function renderBadges(badges = []) {
  const badgeList = document.getElementById("badgeList");

  if (!badges.length) {
    badgeList.innerHTML =
      "<span class='badge badge-info'>No badges yet</span>";
    return;
  }

  badgeList.innerHTML = badges
    .map(b => `<span class="badge badge-success">${b}</span>`)
    .join(" ");
}

// ===============================
// LOGOUT
// ===============================
document.getElementById("logoutBtn")
  ?.addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "index.html";
  });
