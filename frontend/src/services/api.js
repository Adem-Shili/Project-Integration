// API Configuration
// Use relative URLs in development (Vite proxy) or full URL in production
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

/**
 * Generic API request function
 */
async function apiRequest(endpoint, options = {}) {
  // Use full URL if API_BASE_URL is set, otherwise use relative URL (Vite proxy)
  const baseUrl = API_BASE_URL || '';
  const url = `${baseUrl}${endpoint}`;
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  // Add auth token if available
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, config);
    
    // Handle empty responses first (e.g., DELETE requests with 204 No Content)
    if (response.status === 204 || response.status === 201) {
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        return null;
      }
    }
    
    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } else {
          const text = await response.text();
          if (text) {
            errorMessage = text;
          }
        }
      } catch (parseError) {
        // If we can't parse the error, use the status text
        errorMessage = response.statusText || errorMessage;
      }
      throw new Error(errorMessage);
    }
    
    // Handle empty responses (e.g., DELETE requests with 204 No Content or 200 OK with no body)
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return null;
    }
    
    const text = await response.text();
    if (!text || text.trim() === '') {
      return null;
    }
    
    try {
      return JSON.parse(text);
    } catch (parseError) {
      console.error('Failed to parse JSON response:', text);
      return null;
    }
  } catch (error) {
    console.error('API Request Error:', error);
    
    // Provide better error messages for network issues
    const errorMessage = error.message || String(error);
    if (
      error.name === 'TypeError' || 
      errorMessage.includes('fetch') || 
      errorMessage.includes('Failed to fetch') ||
      errorMessage.includes('NetworkError') ||
      errorMessage.includes('Network request failed')
    ) {
      throw new Error('Cannot connect to the server. Please make sure the backend is running on http://localhost:8081. Start it with: cd backend && ./mvnw spring-boot:run');
    }
    
    // Re-throw the error if it's already an Error with a message
    if (error instanceof Error) {
      throw error;
    }
    
    // Fallback for unknown errors
    throw new Error(errorMessage || 'An unexpected error occurred');
  }
}

// Auth API
export const authAPI = {
  login: async (email, password) => {
    return apiRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  register: async (name, email, password, phone, role) => {
    return apiRequest('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, phone, role }),
    });
  },
};

// Products API
export const productsAPI = {
  getAll: async () => {
    return apiRequest('/api/products');
  },

  getById: async (id) => {
    return apiRequest(`/api/products/${id}`);
  },

  getByCategory: async (categoryId) => {
    return apiRequest(`/api/products/category/${categoryId}`);
  },

  search: async (keyword) => {
    return apiRequest(`/api/products/search?keyword=${encodeURIComponent(keyword)}`);
  },

  getBestSellers: async () => {
    return apiRequest('/api/products/bestsellers');
  },

  getByShop: async (shopId) => {
    return apiRequest(`/api/products/shop/${shopId}`);
  },

  create: async (productData) => {
    return apiRequest('/api/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  },

  update: async (id, productData) => {
    return apiRequest(`/api/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  },

  delete: async (id) => {
    return apiRequest(`/api/products/${id}`, {
      method: 'DELETE',
    });
  },
};

// Categories API
export const categoriesAPI = {
  getAll: async () => {
    return apiRequest('/api/categories');
  },

  getById: async (id) => {
    return apiRequest(`/api/categories/${id}`);
  },
};

// Cart API
export const cartAPI = {
  getCart: async (userId) => {
    return apiRequest(`/api/cart/${userId}`);
  },

  addItem: async (userId, productId, quantity = 1) => {
    return apiRequest('/api/cart/add', {
      method: 'POST',
      body: JSON.stringify({ userId, productId, quantity }),
    });
  },

  updateItem: async (userId, cartItemId, quantity) => {
    return apiRequest(`/api/cart/${userId}/item/${cartItemId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    });
  },

  removeItem: async (userId, cartItemId) => {
    return apiRequest(`/api/cart/${userId}/item/${cartItemId}`, {
      method: 'DELETE',
    });
  },

  clearCart: async (userId) => {
    return apiRequest(`/api/cart/${userId}/clear`, {
      method: 'DELETE',
    });
  },
};

// Orders API
export const ordersAPI = {
  create: async (orderData) => {
    return apiRequest('/api/orders/create', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  },

  getByUser: async (userId) => {
    return apiRequest(`/api/orders/user/${userId}`);
  },

  getById: async (id) => {
    return apiRequest(`/api/orders/${id}`);
  },

  getByNumber: async (orderNumber) => {
    return apiRequest(`/api/orders/number/${orderNumber}`);
  },
};

// Delivery API
export const deliveryAPI = {
  track: async (trackingNumber) => {
    return apiRequest(`/api/delivery/track/${trackingNumber}`);
  },

  getByOrderNumber: async (orderNumber) => {
    return apiRequest(`/api/delivery/order-number/${orderNumber}`);
  },
};

// User API
export const userAPI = {
  getById: async (userId) => {
    return apiRequest(`/api/users/${userId}`);
  },

  getCurrent: async () => {
    return apiRequest('/api/users/me');
  },

  update: async (userId, userData) => {
    return apiRequest(`/api/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },

  updateCurrent: async (userData) => {
    return apiRequest('/api/users/me', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },

  delete: async (userId) => {
    return apiRequest(`/api/users/${userId}`, {
      method: 'DELETE',
    });
  },
};

// Subscription Plans API
export const subscriptionPlansAPI = {
  getAll: async () => {
    return apiRequest('/api/subscription-plans');
  },

  getById: async (id) => {
    return apiRequest(`/api/subscription-plans/${id}`);
  },
};

// Shops API
export const shopsAPI = {
  create: async (shopData) => {
    return apiRequest('/api/shops', {
      method: 'POST',
      body: JSON.stringify(shopData),
    });
  },

  getMyShop: async () => {
    return apiRequest('/api/shops/my-shop');
  },

  getMyShops: async () => {
    return apiRequest('/api/shops/my-shops');
  },

  getById: async (id) => {
    return apiRequest(`/api/shops/${id}`);
  },

  getAll: async (active) => {
    const url = active !== undefined ? `/api/shops?active=${active}` : '/api/shops';
    return apiRequest(url);
  },

  getMyShopStatistics: async () => {
    return apiRequest('/api/shops/my-shop/statistics');
  },

  getShopStatistics: async (shopId) => {
    return apiRequest(`/api/shops/${shopId}/statistics`);
  },

  update: async (shopId, shopData) => {
    return apiRequest(`/api/shops/${shopId}`, {
      method: 'PUT',
      body: JSON.stringify(shopData),
    });
  },
};

// Admin API
export const adminAPI = {
  getStatistics: async () => {
    return apiRequest('/api/admin/statistics');
  },

  getAllShops: async () => {
    return apiRequest('/api/admin/shops');
  },
};


