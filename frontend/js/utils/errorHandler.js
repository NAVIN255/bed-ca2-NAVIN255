/**
 * Error Handling and User Feedback System
 * Centralized error handling and user notification management
 */

const ErrorHandler = {
  
  // ===============================
  // NOTIFICATION SYSTEM
  // ===============================
  
  init() {
    // Create notification container if it doesn't exist
    if (!document.getElementById('notification-container')) {
      const container = document.createElement('div');
      container.id = 'notification-container';
      container.className = 'notification-container';
      document.body.appendChild(container);
    }
  },

  showNotification(message, type = 'info', duration = 5000) {
    this.init();
    
    const container = document.getElementById('notification-container');
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const icon = this.getNotificationIcon(type);
    notification.innerHTML = `
      <div class="notification-content">
        <span class="notification-icon">${icon}</span>
        <span class="notification-message">${message}</span>
        <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
      </div>
    `;
    
    container.appendChild(notification);
    
    // Auto-remove after duration
    if (duration > 0) {
      setTimeout(() => {
        if (notification.parentNode) {
          notification.remove();
        }
      }, duration);
    }
    
    // Animate in
    setTimeout(() => notification.classList.add('show'), 10);
    
    return notification;
  },

  getNotificationIcon(type) {
    const icons = {
      success: '✓',
      error: '✗',
      warning: '⚠',
      info: 'ℹ'
    };
    return icons[type] || icons.info;
  },

  // ===============================
  // SPECIFIC NOTIFICATION TYPES
  // ===============================
  
  showSuccess(message, duration = 3000) {
    return this.showNotification(message, 'success', duration);
  },

  showError(message, duration = 7000) {
    return this.showNotification(message, 'error', duration);
  },

  showWarning(message, duration = 5000) {
    return this.showNotification(message, 'warning', duration);
  },

  showInfo(message, duration = 4000) {
    return this.showNotification(message, 'info', duration);
  },

  // ===============================
  // LOADING STATES
  // ===============================
  
  showLoading(element, message = 'Loading...') {
    if (!element) return;
    
    element.classList.add('loading-state');
    element.setAttribute('data-original-content', element.innerHTML);
    
    element.innerHTML = `
      <div class="loading-spinner">
        <div class="spinner"></div>
        <span class="loading-text">${message}</span>
      </div>
    `;
  },

  hideLoading(element) {
    if (!element) return;
    
    element.classList.remove('loading-state');
    const originalContent = element.getAttribute('data-original-content');
    
    if (originalContent) {
      element.innerHTML = originalContent;
      element.removeAttribute('data-original-content');
    }
  },

  // ===============================
  // ERROR HANDLING
  // ===============================
  
  handleAPIError(error, context = '') {
    console.error(`API Error ${context}:`, error);
    
    let message = 'An unexpected error occurred';
    
    if (error.message) {
      message = error.message;
    } else if (error.status) {
      switch (error.status) {
        case 400:
          message = 'Invalid request. Please check your input.';
          break;
        case 401:
          message = 'Session expired. Please log in again.';
          this.handleAuthError();
          break;
        case 403:
          message = "You don't have permission for this action.";
          break;
        case 404:
          message = 'The requested resource was not found.';
          break;
        case 409:
          message = 'This action conflicts with existing data.';
          break;
        case 500:
          message = 'Server error. Please try again later.';
          break;
        default:
          message = `Request failed (${error.status})`;
      }
    }
    
    this.showError(message);
    return message;
  },

  handleAuthError() {
    // Clear tokens and redirect to login
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 2000);
  },

  handleNetworkError(error) {
    console.error('Network Error:', error);
    
    if (!navigator.onLine) {
      this.showWarning('You appear to be offline. Please check your connection.');
    } else {
      this.showError('Network error. Please check your connection and try again.');
    }
  },

  handleValidationErrors(errors, form = null) {
    if (form && ValidationUtils) {
      ValidationUtils.showFormErrors(form, errors);
    }
    
    // Show first error as notification
    const firstError = Object.values(errors)[0];
    if (firstError) {
      this.showError(firstError);
    }
  },

  // ===============================
  // CONFIRMATION DIALOGS
  // ===============================
  
  showConfirmDialog(message, onConfirm, onCancel = null) {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    
    const dialog = document.createElement('div');
    dialog.className = 'confirm-dialog';
    dialog.innerHTML = `
      <div class="dialog-content">
        <h3>Confirm Action</h3>
        <p>${message}</p>
        <div class="dialog-buttons">
          <button class="btn btn-secondary cancel-btn">Cancel</button>
          <button class="btn btn-danger confirm-btn">Confirm</button>
        </div>
      </div>
    `;
    
    overlay.appendChild(dialog);
    document.body.appendChild(overlay);
    
    const confirmBtn = dialog.querySelector('.confirm-btn');
    const cancelBtn = dialog.querySelector('.cancel-btn');
    
    const cleanup = () => overlay.remove();
    
    confirmBtn.addEventListener('click', () => {
      cleanup();
      if (onConfirm) onConfirm();
    });
    
    cancelBtn.addEventListener('click', () => {
      cleanup();
      if (onCancel) onCancel();
    });
    
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        cleanup();
        if (onCancel) onCancel();
      }
    });
    
    return overlay;
  },

  // ===============================
  // RETRY MECHANISM
  // ===============================
  
  async retryOperation(operation, maxRetries = 3, delay = 1000) {
    let lastError;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;
        
        if (attempt === maxRetries) {
          throw error;
        }
        
        // Exponential backoff
        const waitTime = delay * Math.pow(2, attempt - 1);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        
        this.showWarning(`Attempt ${attempt} failed. Retrying...`);
      }
    }
    
    throw lastError;
  },

  // ===============================
  // OFFLINE HANDLING
  // ===============================
  
  initOfflineHandling() {
    window.addEventListener('online', () => {
      this.showSuccess('Connection restored!');
    });
    
    window.addEventListener('offline', () => {
      this.showWarning('You are now offline. Some features may not work.');
    });
  },

  // ===============================
  // FORM ERROR DISPLAY
  // ===============================
  
  showFormError(form, message) {
    this.clearFormErrors(form);
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'form-error';
    errorDiv.textContent = message;
    
    form.insertBefore(errorDiv, form.firstChild);
  },

  clearFormErrors(form) {
    const existingErrors = form.querySelectorAll('.form-error');
    existingErrors.forEach(error => error.remove());
  },

  // ===============================
  // BUTTON STATE MANAGEMENT
  // ===============================
  
  setButtonLoading(button, loadingText = 'Loading...') {
    if (!button) return;
    
    button.disabled = true;
    button.setAttribute('data-original-text', button.textContent);
    button.textContent = loadingText;
    button.classList.add('loading');
  },

  resetButton(button) {
    if (!button) return;
    
    button.disabled = false;
    const originalText = button.getAttribute('data-original-text');
    if (originalText) {
      button.textContent = originalText;
      button.removeAttribute('data-original-text');
    }
    button.classList.remove('loading');
  }
};

// Initialize offline handling when the script loads
document.addEventListener('DOMContentLoaded', () => {
  ErrorHandler.initOfflineHandling();
});

// Export for use in other modules
window.ErrorHandler = ErrorHandler;