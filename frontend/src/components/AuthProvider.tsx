import React, { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../services/api';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'practitioner' | 'patient';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('authToken');
    if (token) {
      // In a real app, you would validate the token with the backend
      // For now, we'll just set a mock user
      setUser({
        _id: '1',
        name: 'Dr. Ayurveda',
        email: 'doctor@ayursync.com',
        role: 'practitioner'
      });
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // In a real app, you would call the backend login API
      // For demo purposes, we'll simulate a successful login
      if (email === 'doctor@ayursync.com' && password === 'password') {
        const mockUser = {
          _id: '1',
          name: 'Dr. Ayurveda',
          email: 'doctor@ayursync.com',
          role: 'practitioner' as const
        };
        
        const mockToken = 'mock-jwt-token';
        apiService.setToken(mockToken);
        setUser(mockUser);
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    apiService.setToken('');
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    loading,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
