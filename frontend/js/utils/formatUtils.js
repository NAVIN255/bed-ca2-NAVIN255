/**
 * Formatting Utility Functions
 * Data formatting and display helpers
 */

const FormatUtils = {
  
  // ===============================
  // DATE FORMATTING
  // ===============================
  
  formatDate(date, options = {}) {
    if (!date) return '';
    
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) return 'Invalid Date';
    
    const defaultOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    };
    
    return dateObj.toLocaleDateString('en-US', { ...defaultOptions, ...options });
  },

  formatDateTime(date) {
    return this.formatDate(date, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  },

  formatRelativeTime(date) {
    if (!date) return '';
    
    const now = new Date();
    const dateObj = new Date(date);
    const diffMs = now - dateObj;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return this.formatDate(date);
  },

  // ===============================
  // NUMBER FORMATTING
  // ===============================
  
  formatNumber(number, decimals = 0) {
    if (typeof number !== 'number') return '0';
    return number.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  },

  formatPoints(points) {
    if (!points || points === 0) return '0 points';
    if (points === 1) return '1 point';
    return `${this.formatNumber(points)} points`;
  },

  formatPercentage(value, total) {
    if (!total || total === 0) return '0%';
    const percentage = (value / total) * 100;
    return `${Math.round(percentage)}%`;
  },

  // ===============================
  // TEXT FORMATTING
  // ===============================
  
  truncateText(text, maxLength = 100, suffix = '...') {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength - suffix.length) + suffix;
  },

  capitalizeFirst(text) {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  },

  capitalizeWords(text) {
    if (!text) return '';
    return text.split(' ')
      .map(word => this.capitalizeFirst(word))
      .join(' ');
  },

  // ===============================
  // RATING FORMATTING
  // ===============================
  
  formatRating(rating, maxRating = 5) {
    if (!rating || rating < 0) return '☆'.repeat(maxRating);
    
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = maxRating - fullStars - (hasHalfStar ? 1 : 0);
    
    return '★'.repeat(fullStars) + 
           (hasHalfStar ? '☆' : '') + 
           '☆'.repeat(emptyStars);
  },

  formatRatingText(rating, reviewCount = 0) {
    if (!rating) return 'No ratings yet';
    
    const stars = this.formatRating(rating);
    const ratingText = rating.toFixed(1);
    const countText = reviewCount === 1 ? '1 review' : `${reviewCount} reviews`;
    
    return `${stars} ${ratingText} (${countText})`;
  },

  // ===============================
  // CHALLENGE FORMATTING
  // ===============================
  
  formatChallengeStatus(completed, inProgress = false) {
    if (completed) return { text: 'Completed', class: 'status-completed' };
    if (inProgress) return { text: 'In Progress', class: 'status-progress' };
    return { text: 'Available', class: 'status-available' };
  },

  formatDifficulty(skillpoints) {
    if (skillpoints <= 10) return { text: 'Easy', class: 'difficulty-easy' };
    if (skillpoints <= 25) return { text: 'Medium', class: 'difficulty-medium' };
    if (skillpoints <= 50) return { text: 'Hard', class: 'difficulty-hard' };
    return { text: 'Expert', class: 'difficulty-expert' };
  },

  // ===============================
  // PROGRESS FORMATTING
  // ===============================
  
  formatProgress(current, total) {
    if (!total || total === 0) return { percentage: 0, text: '0%' };
    
    const percentage = Math.min((current / total) * 100, 100);
    return {
      percentage: Math.round(percentage),
      text: `${current}/${total} (${Math.round(percentage)}%)`
    };
  },

  // ===============================
  // ERROR FORMATTING
  // ===============================
  
  formatErrorMessage(error) {
    if (typeof error === 'string') return error;
    if (error && error.message) return error.message;
    return 'An unexpected error occurred';
  },

  // ===============================
  // HTML FORMATTING
  // ===============================
  
  escapeHtml(text) {
    if (!text) return '';
    
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  },

  formatLineBreaks(text) {
    if (!text) return '';
    return text.replace(/\n/g, '<br>');
  },

  // ===============================
  // SEARCH/FILTER FORMATTING
  // ===============================
  
  highlightSearchTerm(text, searchTerm) {
    if (!text || !searchTerm) return text;
    
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  },

  // ===============================
  // UTILITY FORMATTERS
  // ===============================
  
  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },

  formatDuration(seconds) {
    if (!seconds || seconds < 0) return '0 seconds';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  }
};

// Export for use in other modules
window.FormatUtils = FormatUtils;