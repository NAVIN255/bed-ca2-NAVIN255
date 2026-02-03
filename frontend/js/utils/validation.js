/**
 * Validation Utility Functions
 * Form validation and data validation helpers
 */

const ValidationUtils = {
  
  // ===============================
  // EMAIL VALIDATION
  // ===============================
  
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // ===============================
  // PASSWORD VALIDATION
  // ===============================
  
  isValidPassword(password) {
    // At least 6 characters
    return password && password.length >= 6;
  },

  getPasswordStrength(password) {
    if (!password) return { score: 0, text: 'Enter a password' };
    
    let score = 0;
    let feedback = [];
    
    // Length check
    if (password.length >= 8) {
      score += 1;
    } else {
      feedback.push('Use at least 8 characters');
    }
    
    // Uppercase check
    if (/[A-Z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('Add uppercase letters');
    }
    
    // Lowercase check
    if (/[a-z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('Add lowercase letters');
    }
    
    // Number check
    if (/\d/.test(password)) {
      score += 1;
    } else {
      feedback.push('Add numbers');
    }
    
    // Special character check
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      score += 1;
    } else {
      feedback.push('Add special characters');
    }
    
    const strengthLevels = {
      0: { text: 'Very Weak', class: 'very-weak' },
      1: { text: 'Weak', class: 'weak' },
      2: { text: 'Fair', class: 'fair' },
      3: { text: 'Good', class: 'good' },
      4: { text: 'Strong', class: 'strong' },
      5: { text: 'Very Strong', class: 'very-strong' }
    };
    
    return {
      score,
      ...strengthLevels[score],
      feedback: feedback.slice(0, 2) // Show max 2 suggestions
    };
  },

  // ===============================
  // TEXT VALIDATION
  // ===============================
  
  isNotEmpty(value) {
    return value && value.trim().length > 0;
  },

  isValidLength(value, min = 0, max = Infinity) {
    if (!value) return min === 0;
    return value.length >= min && value.length <= max;
  },

  containsOnlyWhitespace(value) {
    return !value || value.trim().length === 0;
  },

  // ===============================
  // NUMBER VALIDATION
  // ===============================
  
  isValidNumber(value, min = -Infinity, max = Infinity) {
    const num = parseFloat(value);
    return !isNaN(num) && num >= min && num <= max;
  },

  isPositiveInteger(value) {
    const num = parseInt(value);
    return !isNaN(num) && num > 0 && num === parseFloat(value);
  },

  // ===============================
  // CHALLENGE VALIDATION
  // ===============================
  
  validateChallenge(challengeData) {
    const errors = {};
    
    if (!this.isNotEmpty(challengeData.challenge)) {
      errors.challenge = 'Challenge description is required';
    } else if (!this.isValidLength(challengeData.challenge, 10, 500)) {
      errors.challenge = 'Challenge description must be between 10 and 500 characters';
    }
    
    if (!this.isPositiveInteger(challengeData.skillpoints)) {
      errors.skillpoints = 'Skill points must be a positive number';
    } else if (!this.isValidNumber(challengeData.skillpoints, 1, 1000)) {
      errors.skillpoints = 'Skill points must be between 1 and 1000';
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  },

  // ===============================
  // REVIEW VALIDATION
  // ===============================
  
  validateReview(reviewData) {
    const errors = {};
    
    if (!this.isValidNumber(reviewData.review_amt, 1, 5)) {
      errors.review_amt = 'Rating must be between 1 and 5 stars';
    }
    
    if (!this.isNotEmpty(reviewData.notes)) {
      errors.notes = 'Review comment is required';
    } else if (!this.isValidLength(reviewData.notes, 10, 1000)) {
      errors.notes = 'Review must be between 10 and 1000 characters';
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  },

  // ===============================
  // USER REGISTRATION VALIDATION
  // ===============================
  
  validateRegistration(userData) {
    const errors = {};
    
    if (!this.isNotEmpty(userData.username)) {
      errors.username = 'Username is required';
    } else if (!this.isValidLength(userData.username, 3, 20)) {
      errors.username = 'Username must be between 3 and 20 characters';
    }
    
    if (!this.isValidEmail(userData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!this.isValidPassword(userData.password)) {
      errors.password = 'Password must be at least 6 characters long';
    }
    
    if (userData.confirmPassword && userData.password !== userData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  },

  // ===============================
  // LOGIN VALIDATION
  // ===============================
  
  validateLogin(loginData) {
    const errors = {};
    
    if (!this.isValidEmail(loginData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!this.isNotEmpty(loginData.password)) {
      errors.password = 'Password is required';
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  },

  // ===============================
  // FORM VALIDATION HELPERS
  // ===============================
  
  showFieldError(field, message) {
    this.clearFieldError(field);
    
    field.classList.add('error');
    
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    
    field.parentNode.insertBefore(errorElement, field.nextSibling);
  },

  clearFieldError(field) {
    field.classList.remove('error');
    
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
      existingError.remove();
    }
  },

  clearAllErrors(form) {
    const errorFields = form.querySelectorAll('.error');
    errorFields.forEach(field => this.clearFieldError(field));
    
    const errorMessages = form.querySelectorAll('.field-error');
    errorMessages.forEach(error => error.remove());
  },

  showFormErrors(form, errors) {
    this.clearAllErrors(form);
    
    Object.keys(errors).forEach(fieldName => {
      const field = form.querySelector(`[name="${fieldName}"]`);
      if (field) {
        this.showFieldError(field, errors[fieldName]);
      }
    });
  }
};

// Export for use in other modules
window.ValidationUtils = ValidationUtils;