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
    document.getElementById("profileUsername").textContent = profile.username;
    document.getElementById("profileEmail").textContent = profile.email;
    document.getElementById("profileLevel").textContent = profile.level;
    document.getElementById("profilePoints").textContent = profile.skillpoints;

    // --- Active Spell ---
    renderActiveSpell(profile);

    // --- Owned Spells ---
    renderOwnedSpells(spells, profile.active_spell_id);

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
// ACTIVE SPELL DISPLAY
// ===============================
function renderActiveSpell(profile) {
  const nameEl = document.getElementById("activeSpellName");
  const usesEl = document.getElementById("activeSpellUses");

  if (profile.active_spell_name) {
    nameEl.textContent = `🔮 ${profile.active_spell_name}`;
    usesEl.textContent = `🔥 ${profile.active_spell_uses} / 3 uses left`;
    usesEl.classList.remove("hidden");
  } else {
    nameEl.textContent = "No active spell";
    usesEl.classList.add("hidden");
  }
}

// ===============================
// OWNED SPELLS
// ===============================
function renderOwnedSpells(spells, activeSpellId) {
  const container = document.getElementById("ownedSpells");

  if (!spells.length) {
    container.innerHTML = "<p>No spells owned yet</p>";
    return;
  }

  container.innerHTML = spells.map(spell => {
    const isActive = spell.spell_id === activeSpellId;

    return `
      <div class="card ${isActive ? "magical-glow" : ""}">
        <h4>🔮 ${spell.name}</h4>

        <div class="mt-2">
          ${
            isActive
              ? `<span class="badge badge-success">Active</span>`
              : `<button class="btn btn-primary btn-sm"
                   onclick="activateSpell(${spell.spell_id})">
                   Activate
                 </button>`
          }
        </div>
      </div>
    `;
  }).join("");
}

// ===============================
// ACTIVATE SPELL
// ===============================
async function activateSpell(spellId) {
  try {
    await apiService.makeAuthenticatedRequest("/spells/activate", {
      method: "POST",
      body: JSON.stringify({ spell_id: spellId })
    });

    alert("🔮 Spell activated!");
    loadProfile(); // refresh UI

  } catch (err) {
    alert(err.message || "Failed to activate spell");
  }
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
