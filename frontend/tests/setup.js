/**
 * Test Setup and Configuration
 * Basic testing utilities for frontend property-based testing
 */

// Mock localStorage for testing
const mockLocalStorage = {
  store: {},
  getItem: function(key) {
    return this.store[key] || null;
  },
  setItem: function(key, value) {
    this.store[key] = value.toString();
  },
  removeItem: function(key) {
    delete this.store[key];
  },
  clear: function() {
    this.store = {};
  }
};

// Mock fetch for testing
const mockFetch = (responses = {}) => {
  return (url, options = {}) => {
    const method = options.method || 'GET';
    const key = `${method} ${url}`;
    
    if (responses[key]) {
      const response = responses[key];
      return Promise.resolve({
        ok: response.ok !== false,
        status: response.status || 200,
        json: () => Promise.resolve(response.data || {}),
        text: () => Promise.resolve(JSON.stringify(response.data || {}))
      });
    }
    
    // Default success response
    return Promise.resolve({
      ok: true,
      status: 200,
      json: () => Promise.resolve({}),
      text: () => Promise.resolve('{}')
    });
  };
};

// Test utilities
const TestUtils = {
  
  // Setup test environment
  setup() {
    // Mock browser APIs
    global.localStorage = mockLocalStorage;
    global.fetch = mockFetch();
    
    // Mock DOM elements
    global.document = {
      createElement: (tag) => ({
        tagName: tag.toUpperCase(),
        classList: {
          add: () => {},
          remove: () => {},
          toggle: () => {}
        },
        addEventListener: () => {},
        setAttribute: () => {},
        getAttribute: () => null,
        removeAttribute: () => {},
        appendChild: () => {},
        remove: () => {},
        innerHTML: '',
        textContent: '',
        style: {}
      }),
      getElementById: () => null,
      querySelector: () => null,
      querySelectorAll: () => [],
      body: {
        appendChild: () => {}
      },
      addEventListener: () => {},
      readyState: 'complete'
    };
    
    global.window = {
      localStorage: mockLocalStorage,
      location: { href: '' },
      addEventListener: () => {},
      navigator: { onLine: true }
    };
  },
  
  // Reset test environment
  reset() {
    mockLocalStorage.clear();
    if (global.fetch && global.fetch.mockClear) {
      global.fetch.mockClear();
    }
  },
  
  // Generate random test data
  randomString(length = 10) {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  },
  
  randomEmail() {
    return `${this.randomString(8)}@${this.randomString(6)}.com`;
  },
  
  randomNumber(min = 1, max = 100) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },
  
  randomBoolean() {
    return Math.random() < 0.5;
  },
  
  // Property test runner (simplified)
  async runPropertyTest(name, property, iterations = 100) {
    console.log(`Running property test: ${name}`);
    
    let passed = 0;
    let failed = 0;
    let errors = [];
    
    for (let i = 0; i < iterations; i++) {
      try {
        const result = await property();
        if (result === true) {
          passed++;
        } else {
          failed++;
          errors.push(`Iteration ${i + 1}: Property returned false`);
        }
      } catch (error) {
        failed++;
        errors.push(`Iteration ${i + 1}: ${error.message}`);
      }
    }
    
    const success = failed === 0;
    console.log(`${name}: ${passed}/${iterations} passed`);
    
    if (!success) {
      console.error(`Property test failed: ${name}`);
      errors.slice(0, 5).forEach(error => console.error(`  ${error}`));
    }
    
    return { success, passed, failed, errors };
  }
};

// Export for use in tests
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { TestUtils, mockLocalStorage, mockFetch };
} else {
  window.TestUtils = TestUtils;
}