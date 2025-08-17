const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 
  (process.env.NODE_ENV === 'production' 
    ? 'https://miraim-backend.icymoss-273d47c5.australiaeast.azurecontainerapps.io'
    : 'http://localhost:8000');

class ApiClient {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async getFeatures() {
    return this.request('/features');
  }

  async getHelpFaqs() {
    return this.request('/help/faqs');
  }
}

export const apiClient = new ApiClient();