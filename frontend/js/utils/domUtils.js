/**
 * DOM Utility Functions
 * Helper functions for DOM manipulation and element creation
 */

const DOMUtils = {
  
  // ===============================
  // ELEMENT CREATION
  // ===============================
  
  createElement(tag, className = '', textContent = '') {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (textContent) element.textContent = textContent;
    return element;
  },

  createButton(text, className = '', onClick = null) {
    const button = this.createElement('button', className, text);
    if (onClick) button.addEventListener('click', onClick);
    return button;
  },

  createInput(type, placeholder = '', className = '') {
    const input = this.createElement('input', className);
    input.type = type;
    if (placeholder) input.placeholder = placeholder;
    return input;
  },

  createCard(title, content, className = 'card') {
    const card = this.createElement('div', className);
    
    if (title) {
      const titleElement = this.createElement('h3', 'card-title', title);
      card.appendChild(titleElement);
    }
    
    if (content) {
      const contentElement = this.createElement('div', 'card-content');
      if (typeof content === 'string') {
        contentElement.innerHTML = content;
      } else {
        contentElement.appendChild(content);
      }
      card.appendChild(contentElement);
    }
    
    return card;
  },

  // ===============================
  // ELEMENT MANIPULATION
  // ===============================
  
  show(element) {
    if (element) element.style.display = '';
  },

  hide(element) {
    if (element) element.style.display = 'none';
  },

  toggle(element) {
    if (element) {
      element.style.display = element.style.display === 'none' ? '' : 'none';
    }
  },

  addClass(element, className) {
    if (element && className) element.classList.add(className);
  },

  removeClass(element, className) {
    if (element && className) element.classList.remove(className);
  },

  toggleClass(element, className) {
    if (element && className) element.classList.toggle(className);
  },

  // ===============================
  // CONTENT MANIPULATION
  // ===============================
  
  clearContent(element) {
    if (element) element.innerHTML = '';
  },

  setContent(element, content) {
    if (element) {
      if (typeof content === 'string') {
        element.innerHTML = content;
      } else {
        this.clearContent(element);
        element.appendChild(content);
      }
    }
  },

  appendContent(element, content) {
    if (element) {
      if (typeof content === 'string') {
        element.innerHTML += content;
      } else {
        element.appendChild(content);
      }
    }
  },

  // ===============================
  // FORM UTILITIES
  // ===============================
  
  getFormData(form) {
    const formData = new FormData(form);
    const data = {};
    for (let [key, value] of formData.entries()) {
      data[key] = value;
    }
    return data;
  },

  setFormData(form, data) {
    Object.keys(data).forEach(key => {
      const input = form.querySelector(`[name="${key}"]`);
      if (input) input.value = data[key];
    });
  },

  clearForm(form) {
    if (form) form.reset();
  },

  // ===============================
  // EVENT UTILITIES
  // ===============================
  
  onReady(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  },

  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  // ===============================
  // LOADING STATES
  // ===============================
  
  showLoading(element, text = 'Loading...') {
    if (element) {
      element.innerHTML = `<div class="loading">${text}</div>`;
      this.addClass(element, 'loading-state');
    }
  },

  hideLoading(element) {
    if (element) {
      this.removeClass(element, 'loading-state');
    }
  },

  // ===============================
  // ANIMATION UTILITIES
  // ===============================
  
  fadeIn(element, duration = 300) {
    if (element) {
      element.style.opacity = '0';
      element.style.display = '';
      
      let start = performance.now();
      
      function animate(currentTime) {
        let elapsed = currentTime - start;
        let progress = elapsed / duration;
        
        if (progress < 1) {
          element.style.opacity = progress;
          requestAnimationFrame(animate);
        } else {
          element.style.opacity = '1';
        }
      }
      
      requestAnimationFrame(animate);
    }
  },

  fadeOut(element, duration = 300) {
    if (element) {
      let start = performance.now();
      
      function animate(currentTime) {
        let elapsed = currentTime - start;
        let progress = elapsed / duration;
        
        if (progress < 1) {
          element.style.opacity = 1 - progress;
          requestAnimationFrame(animate);
        } else {
          element.style.opacity = '0';
          element.style.display = 'none';
        }
      }
      
      requestAnimationFrame(animate);
    }
  }
};

// Export for use in other modules
window.DOMUtils = DOMUtils;