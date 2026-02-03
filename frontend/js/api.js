// Import utilities
// Note: These will be loaded via script tags in HTML

// ===============================
// AUTH HELPERS (Legacy - keeping for compatibility)
// ===============================
function getToken() {
  return localStorage.getItem("accessToken");
}

function requireAuth() {
  const token = getToken();
  console.log("Checking authentication, token:", token ? "Found" : "Not found");
  
  if (!token) {
    console.log("No token found, redirecting to login");
    alert("You must be logged in to access this page");
    window.location.href = "index.html";
    return false;
  }
  
  console.log("Authentication successful");
  return true;
}

// ===============================
// INITIALIZE API SERVICE (avoid conflicts)
// ===============================
if (typeof window.apiService === 'undefined') {
  window.apiService = new APIService();
}

// ===============================
// ENHANCED LOGIN
// ===============================
document.getElementById("loginForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const msg = document.getElementById("msg");
  const submitBtn = e.target.querySelector('button[type="submit"]');
  const btnText = submitBtn.querySelector('.btn-text');

  // Clear previous messages
  msg.innerHTML = "";
  msg.className = "auth-message";

  // Validate input
  const validation = ValidationUtils.validateLogin({ email, password });
  if (!validation.isValid) {
    ValidationUtils.showFormErrors(e.target, validation.errors);
    msg.innerHTML = Object.values(validation.errors)[0];
    msg.classList.add('error');
    return;
  }

  // Show loading state
  submitBtn.disabled = true;
  btnText.textContent = "Signing in...";

  try {
    const response = await window.apiService.login({ email, password });

    msg.innerHTML = "Login successful! Redirecting...";
    msg.classList.add('success');
    
    // Redirect after short delay
    setTimeout(() => {
      window.location.href = "dashboard.html";
    }, 1000);

  } catch (error) {
    console.error("Login error:", error);
    msg.innerHTML = error.message || "Login failed. Please try again.";
    msg.classList.add('error');
  } finally {
    submitBtn.disabled = false;
    btnText.textContent = "Sign In";
  }
});