const DEFAULT_DEV_API = 'http://localhost:5000/api';
const DEFAULT_PROD_API = 'https://api.brunopesenti.ch/api';

const API_BASE = (
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.DEV ? DEFAULT_DEV_API : DEFAULT_PROD_API)
).replace(/\/$/, '');

const normalizeProduct = (product) => {
  if (!product || typeof product !== 'object') return product;
  if (!product._id && product.id) {
    return { ...product, _id: product.id };
  }
  return product;
};

const normalizeProductResponse = (json) => {
  if (Array.isArray(json)) {
    return { success: true, data: json.map(normalizeProduct) };
  }
  if (json && Array.isArray(json.data)) {
    return { ...json, data: json.data.map(normalizeProduct) };
  }
  if (json && json.data) {
    return { ...json, data: normalizeProduct(json.data) };
  }
  return json;
};

export const api = {
  // Get all products
  getProducts: async () => {
    const response = await fetch(`${API_BASE}/products`);
    if (!response.ok) throw new Error('Failed to fetch products');
    const json = await response.json();
    return normalizeProductResponse(json);
  },

  // Get single product
  getProduct: async (id) => {
    const response = await fetch(`${API_BASE}/products/${id}`);
    if (!response.ok) throw new Error('Failed to fetch product');
    const json = await response.json();
    return normalizeProductResponse(json);
  },

  // Create product (admin)
  createProduct: async (productData, token) => {
    const response = await fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(productData),
    });
    if (!response.ok) throw new Error('Failed to create product');
    return response.json();
  },

  // Update product (admin)
  updateProduct: async (id, productData, token) => {
    const response = await fetch(`${API_BASE}/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(productData),
    });
    if (!response.ok) throw new Error('Failed to update product');
    return response.json();
  },

  // Delete product (admin)
  deleteProduct: async (id, token) => {
    const response = await fetch(`${API_BASE}/products/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Failed to delete product');
    return response.json();
  },

  // Login
  login: async (username, password) => {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
    if (!response.ok) throw new Error('Login failed');
    return response.json();
  },

  // Verify token
  verifyToken: async (token) => {
    const response = await fetch(`${API_BASE}/auth/verify`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Token verification failed');
    return response.json();
  },

  // Create reservation
  createReservation: async (reservationData) => {
    try {
      const response = await fetch(`${API_BASE}/reservations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reservationData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        return {
          success: false,
          message: errorData.message || 'Failed to create reservation'
        };
      }
      
      const jsonResponse = await response.json();
      // The backend returns { success: true, data: reservation }
      return {
        success: jsonResponse.success,
        data: jsonResponse.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  },

  // Get reservations (admin)
  getReservations: async (token) => {
    const response = await fetch(`${API_BASE}/reservations`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Failed to fetch reservations');
    return response.json();
  },

  // Update reservation status (admin)
  updateReservationStatus: async (id, status, token) => {
    const response = await fetch(`${API_BASE}/reservations/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });
    if (!response.ok) throw new Error('Failed to update reservation status');
    return response.json();
  },
};
