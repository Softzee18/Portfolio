// API configuration
const API_URL = 'http://localhost:3000/api'; // Change in production to your backend URL

// Testimonials API service
const TestimonialsAPI = {
  // Get approved testimonials
  async getApproved() {
    try {
      const response = await fetch(`${API_URL}/testimonials`);
      const { success, data } = await response.json();
      if (!success) throw new Error('Failed to fetch testimonials');
      return data;
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      return [];
    }
  },

  // Submit new testimonial
  async submit(testimonial) {
    try {
      const response = await fetch(`${API_URL}/testimonials`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testimonial)
      });
      const { success, data } = await response.json();
      if (!success) throw new Error('Failed to submit testimonial');
      return data;
    } catch (error) {
      console.error('Error submitting testimonial:', error);
      throw error;
    }
  },

  // Admin: Get pending testimonials
  async getPending(token) {
    try {
      const response = await fetch(`${API_URL}/testimonials/pending`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const { success, data } = await response.json();
      if (!success) throw new Error('Failed to fetch pending testimonials');
      return data;
    } catch (error) {
      console.error('Error fetching pending testimonials:', error);
      return [];
    }
  },

  // Admin: Approve testimonial
  async approve(id, token) {
    try {
      const response = await fetch(`${API_URL}/testimonials/${id}/approve`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const { success } = await response.json();
      if (!success) throw new Error('Failed to approve testimonial');
      return true;
    } catch (error) {
      console.error('Error approving testimonial:', error);
      throw error;
    }
  },

  // Admin: Delete testimonial
  async delete(id, token) {
    try {
      const response = await fetch(`${API_URL}/testimonials/${id}`, {
        method: 'DELETE',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const { success } = await response.json();
      if (!success) throw new Error('Failed to delete testimonial');
      return true;
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      throw error;
    }
  }
};

// Auth API service
const AuthAPI = {
  // Admin login
  async login(credentials) {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      const { success, token } = await response.json();
      if (!success) throw new Error('Login failed');
      return token;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }
};