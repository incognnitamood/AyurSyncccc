const API_BASE_URL = 'http://localhost:3001/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('authToken');
  }

  // Set authentication token
  setToken(token) {
    this.token = token;
    localStorage.setItem('authToken', token);
  }

  // Get authentication headers
  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }
    
    return headers;
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getHeaders(),
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      
      // Check if it's a connection error
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Backend server is not running. Please start the backend server.');
      }
      
      throw error;
    }
  }

  // GET request
  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    return this.request(url, { method: 'GET' });
  }

  // POST request
  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // PUT request
  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // DELETE request
  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }

  // Patient API methods
  async getPatients(params = {}) {
    return this.get('/patients', params);
  }

  async getPatient(id) {
    return this.get(`/patients/${id}`);
  }

  async createPatient(patientData) {
    return this.post('/patients', patientData);
  }

  async updatePatient(id, patientData) {
    return this.put(`/patients/${id}`, patientData);
  }

  async deletePatient(id) {
    return this.delete(`/patients/${id}`);
  }

  async getPatientStats() {
    return this.get('/patients/stats');
  }

  async getPatientsByDosha(dosha) {
    return this.get(`/patients/dosha/${dosha}`);
  }

  // Recipe API methods
  async getRecipes(params = {}) {
    return this.get('/recipes', params);
  }

  async getRecipe(id) {
    return this.get(`/recipes/${id}`);
  }

  async createRecipe(recipeData) {
    return this.post('/recipes', recipeData);
  }

  async updateRecipe(id, recipeData) {
    return this.put(`/recipes/${id}`, recipeData);
  }

  async deleteRecipe(id) {
    return this.delete(`/recipes/${id}`);
  }

  async getRecipeStats() {
    return this.get('/recipes/stats');
  }

  async getRecipesByDosha(dosha, effect = '↓') {
    return this.get(`/recipes/dosha/${dosha}`, { effect });
  }

  async searchRecipes(query, params = {}) {
    return this.get('/recipes', { search: query, ...params });
  }

  async getPopularRecipes(limit = 10) {
    return this.get('/recipes/popular', { limit });
  }

  async analyzeRecipesNutrition(recipeIds, quantities = []) {
    return this.post('/recipes/analyze', { recipeIds, quantities });
  }

  // Diet Plan API methods
  async getDietPlans(params = {}) {
    return this.get('/diet-plans', params);
  }

  async getDietPlan(id) {
    return this.get(`/diet-plans/${id}`);
  }

  async generateDietPlan(patientId, options = {}) {
    return this.post(`/diet-plans/generate/${patientId}`, options);
  }

  async updateDietPlan(id, dietPlanData) {
    return this.put(`/diet-plans/${id}`, dietPlanData);
  }

  async deleteDietPlan(id) {
    return this.delete(`/diet-plans/${id}`);
  }

  async markDayCompleted(planId, dayIndex, feedback = {}) {
    return this.post(`/diet-plans/${planId}/complete/${dayIndex}`, feedback);
  }

  async getDietPlanStats() {
    return this.get('/diet-plans/stats');
  }

  async getRecipeSuggestions(patientId, mealType, preferences = {}) {
    return this.get(`/diet-plans/suggestions/${patientId}`, { 
      mealType, 
      preferences: JSON.stringify(preferences) 
    });
  }

  async regenerateDietPlan(planId, modifications) {
    return this.post(`/diet-plans/${planId}/regenerate`, modifications);
  }

  // Health check
  async healthCheck() {
    return this.request('/health', { method: 'GET' });
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService;
