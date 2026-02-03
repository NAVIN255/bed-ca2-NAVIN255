// ===============================
// ENHANCED REGISTRATION
// ===============================
document.getElementById("registerForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const msg = document.getElementById("msg");
  const submitBtn = e.target.querySelector('button[type="submit"]');
  const btnText = submitBtn.querySelector('.btn-text');

  // Clear previous messages
  msg.innerHTML = "";
  msg.className = "auth-message";

  // Validate input
  const validation = ValidationUtils.validateRegistration({ username, email, password });
  if (!validation.isValid) {
    ValidationUtils.showFormErrors(e.target, validation.errors);
    msg.innerHTML = Object.values(validation.errors)[0];
    msg.classList.add('error');
    return;
  }

  // Show loading state
  submitBtn.disabled = true;
  btnText.textContent = "Creating account...";

  try {
    // Initialize API service
    const apiService = window.apiService || new APIService();
    const response = await apiService.register({ username, email, password });

    msg.innerHTML = "Registration successful! Redirecting to login...";
    msg.classList.add('success');
    
    setTimeout(() => {
      window.location.href = "index.html";
    }, 1500);

  } catch (error) {
    console.error("Registration error:", error);
    msg.innerHTML = error.message || "Registration failed. Please try again.";
    msg.classList.add('error');
  } finally {
    submitBtn.disabled = false;
    btnText.textContent = "Create Account";
  }
});