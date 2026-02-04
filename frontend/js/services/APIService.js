/**
 * Centralized API Service for backend communication
 * Handles authentication, requests, and error management
 */
class APIService {
  constructor() {
    this.baseURL = 'http://localhost:3000/api';
    this.token = localStorage.getItem('accessToken');
    this.refreshToken = localStorage.getItem('refreshToken');
  }

  // ===============================
  // AUTHENTICATION METHODS
  // ===============================
  
  async login(credentials) {
    try {
      const response = await this.makeRequest('/login', {
        method: 'POST',
        body: JSON.stringify(credentials)
      });
      
      if (response.accessToken && response.refreshToken) {
        this.setTokens(response.accessToken, response.refreshToken);
      }
      
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async register(userData) {
    try {
      const response = await this.makeRequest('/register', {
        method: 'POST',
        body: JSON.stringify(userData)
      });
      
      if (response.accessToken && response.refreshToken) {
        this.setTokens(response.accessToken, response.refreshToken);
      }
      
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // ===============================
  // CHALLENGE METHODS
  // ===============================
  
  async getChallenges() {
    return this.makeAuthenticatedRequest('/challenges', { method: 'GET' });
  }

async createChallenge(challengeData) {
  return this.makeAuthenticatedRequest("/challenges", {
    method: "POST",
    body: JSON.stringify(challengeData)
  });
}

  async updateChallenge(id, challengeData) {
    return this.makeAuthenticatedRequest(`/challenges/${id}`, {
      method: 'PUT',
      body: JSON.stringify(challengeData)
    });
  }

  

  async deleteChallenge(id) {
    return this.makeAuthenticatedRequest(`/challenges/${id}`, {
      method: 'DELETE'
    });
  }

async completeChallenge(challengeId, completionData) {
  return this.makeAuthenticatedRequest(
    `/challenges/${challengeId}/completions`,
    {
      method: "POST",
      body: JSON.stringify(completionData)
    }
  );
}

  async getChallengeCompletions(id) {
    return this.makeAuthenticatedRequest(`/challenges/${id}/completions`, {
      method: 'GET'
    });
  }

  
  // ===============================
  // GAMIFICATION METHODS
  // ===============================
  
  async getSpells() {
    return this.makeAuthenticatedRequest('/spells', { method: 'GET' });
  }

  async getIngredients() {
    return this.makeAuthenticatedRequest('/ingredients', { method: 'GET' });
  }

  async getResources() {
    return this.makeAuthenticatedRequest('/resources', { method: 'GET' });
  }

  async getUserResources(userId) {
    return this.makeAuthenticatedRequest(`/user-resources/${userId}`, {
      method: 'GET'
    });
  }

  async addUserResource(resourceData) {
    return this.makeAuthenticatedRequest('/user-resources', {
      method: 'POST',
      body: JSON.stringify(resourceData)
    });
  }

  // ===============================
  // REVIEW METHODS
  // ===============================
  
  async getReviews(challengeId) {
    return this.makeAuthenticatedRequest(`/reviews?challenge_id=${challengeId}`, {
      method: 'GET'
    });
  }

  async submitReview(reviewData) {
    return this.makeAuthenticatedRequest('/reviews', {
      method: 'POST',
      body: JSON.stringify(reviewData)
    });
  }

  // ===============================
  // USER METHODS
  // ===============================
  
  async getUserById(userId) {
    return this.makeAuthenticatedRequest(`/users/${userId}`, {
      method: 'GET'
    });
  }

  async updateUser(userId, userData) {
    return this.makeAuthenticatedRequest(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(userData)
    });
  }

  async getMyProfile() {
  return this.makeAuthenticatedRequest("/users/me", {
    method: "GET"
  });
}

async getUserProfile() {
  return this.makeAuthenticatedRequest("/users/profile", {
    method: "GET"
  });
}

  // ===============================
  // UTILITY METHODS
  // ===============================
  
async makeRequest(endpoint, options = {}) {
  const url = `${this.baseURL}${endpoint}`;

  const requestOptions = {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    }
  };

  // ✅ Only attach body if it exists
  if (options.body) {
    requestOptions.body = options.body;
  }

  const response = await fetch(url, requestOptions);
  return this.handleResponse(response);
}

  async makeAuthenticatedRequest(endpoint, options = {}) {
  // If no token, force login
  if (!this.token) {
    alert("Please log in again");
    window.location.href = "index.html";
    throw new Error("Not authenticated");
  }

  const authOptions = {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${this.token}`
    }
  };

  return this.makeRequest(endpoint, authOptions);
}

  async handleResponse(response) {
    const data = await response.json().catch(() => ({}));
    
    if (!response.ok) {
      const error = new Error(data.message || 'Request failed');
      error.status = response.status;
      error.data = data;
      throw error;
    }
    
    return data;
  }

  handleError(error) {
    console.error('API Error:', error);
    
    // Return user-friendly error messages
    const userError = new Error();
    userError.originalError = error;
    
    switch (error.status) {
      case 400:
        userError.message = 'Invalid request. Please check your input.';
        break;
      case 401:
        userError.message = 'Session expired. Please log in again.';
        break;
      case 403:
        userError.message = "You don't have permission for this action.";
        break;
      case 404:
        userError.message = 'The requested resource was not found.';
        break;
      case 409:
        userError.message = error.message || 'Conflict occurred.';
        break;
      case 500:
        userError.message = 'Server error. Please try again later.';
        break;
      default:
        userError.message = error.message || 'An unexpected error occurred.';
    }
    
    return userError;
  }

  // ===============================
  // TOKEN MANAGEMENT
  // ===============================
  
  setTokens(accessToken, refreshToken) {
    this.token = accessToken;
    this.refreshToken = refreshToken;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }

  clearTokens() {
    this.token = null;
    this.refreshToken = null;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  isAuthenticated() {
    return !!this.token;
  }

  getToken() {
    return this.token;
  }
}

// Export for use in other modules
window.APIService = APIService;