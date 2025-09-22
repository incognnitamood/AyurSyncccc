interface LoginCredentials {
  email: string;
  password: string;
}

interface Practitioner {
  id: string;
  fullName: string;
  email: string;
  specialization: string;
}

interface AuthResponse {
  success: boolean;
  data?: Practitioner;
  message?: string;
  token?: string;
}

export class AuthService {
  private static readonly STORAGE_KEY = 'ayursync_auth';
  private static readonly API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

  // Authenticate practitioner
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const result = await response.json();

      if (result.success && result.data) {
        // Store authentication data
        const authData = {
          user: result.data,
          token: result.token || 'demo-token',
          timestamp: Date.now()
        };
        
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(authData));
        
        return result;
      } else {
        return { 
          success: false, 
          message: result.message || 'Login failed' 
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      
      // Fallback for demo mode
      if (credentials.email === 'demo@ayursync.com' && credentials.password === 'demo123') {
        const demoUser = {
          id: 'demo-practitioner',
          fullName: 'Dr. Demo Practitioner',
          email: 'demo@ayursync.com',
          specialization: 'Ayurvedic Medicine'
        };

        const authData = {
          user: demoUser,
          token: 'demo-token',
          timestamp: Date.now()
        };
        
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(authData));
        
        return { 
          success: true, 
          data: demoUser,
          message: 'Demo login successful'
        };
      }
      
      return { 
        success: false, 
        message: 'Network error. Please check your connection.' 
      };
    }
  }

  // Check if user is authenticated
  static isAuthenticated(): boolean {
    const authData = this.getAuthData();
    if (!authData) return false;

    // Check if token is expired (24 hours)
    const isExpired = Date.now() - authData.timestamp > 24 * 60 * 60 * 1000;
    if (isExpired) {
      this.logout();
      return false;
    }

    return true;
  }

  // Get current user
  static getCurrentUser(): Practitioner | null {
    const authData = this.getAuthData();
    return authData?.user || null;
  }

  // Get authentication token
  static getToken(): string | null {
    const authData = this.getAuthData();
    return authData?.token || null;
  }

  // Logout user
  static logout(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  // Get stored auth data
  private static getAuthData(): any {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Error parsing auth data:', error);
      this.logout(); // Clear corrupted data
      return null;
    }
  }

  // Register new practitioner (future feature)
  static async register(practitionerData: any): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.API_BASE}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(practitionerData),
      });

      return await response.json();
    } catch (error) {
      return { 
        success: false, 
        message: 'Registration failed. Please try again.' 
      };
    }
  }

  // Refresh token
  static async refreshToken(): Promise<boolean> {
    try {
      const token = this.getToken();
      if (!token) return false;

      const response = await fetch(`${this.API_BASE}/api/auth/refresh`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();
      
      if (result.success && result.token) {
        const authData = this.getAuthData();
        if (authData) {
          authData.token = result.token;
          authData.timestamp = Date.now();
          localStorage.setItem(this.STORAGE_KEY, JSON.stringify(authData));
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error('Token refresh error:', error);
      return false;
    }
  }

  // Update user profile
  static async updateProfile(updates: Partial<Practitioner>): Promise<AuthResponse> {
    try {
      const token = this.getToken();
      if (!token) throw new Error('No authentication token');

      const response = await fetch(`${this.API_BASE}/api/auth/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      const result = await response.json();
      
      if (result.success && result.data) {
        // Update stored user data
        const authData = this.getAuthData();
        if (authData) {
          authData.user = { ...authData.user, ...result.data };
          localStorage.setItem(this.STORAGE_KEY, JSON.stringify(authData));
        }
      }
      
      return result;
    } catch (error) {
      return { 
        success: false, 
        message: 'Failed to update profile' 
      };
    }
  }

  // Get authentication headers for API requests
  static getAuthHeaders(): Record<string, string> {
    const token = this.getToken();
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }
}

export default AuthService;