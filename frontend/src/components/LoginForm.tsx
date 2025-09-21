import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { Loader2, AlertCircle, Eye, EyeOff, Heart } from 'lucide-react';
import { useAuth } from './AuthProvider';

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email, password);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FDF8E4] via-[#F5F1E4] to-[#E1D1A5] flex items-center justify-center p-4">
      <Card className="w-full max-w-md card-rustic shadow-2xl">
        <CardHeader className="text-center pb-6">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-[#9E7E3D] to-[#F5C24D] rounded-full flex items-center justify-center">
              <Heart className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl text-[#9E7E3D] font-bold">
            Welcome to AyurSync
          </CardTitle>
          <p className="text-[#4C7A5A]/80 mt-2">
            Sign in to access your Ayurvedic practice management system
          </p>
        </CardHeader>
        
        <CardContent>
          {error && (
            <Alert className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#9E7E3D] font-medium">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="doctor@ayursync.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-[#9E7E3D]/20 focus:border-[#F5C24D] transition-all duration-300"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-[#9E7E3D] font-medium">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="border-[#9E7E3D]/20 focus:border-[#F5C24D] transition-all duration-300 pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-[#9E7E3D]/60" />
                  ) : (
                    <Eye className="h-4 w-4 text-[#9E7E3D]/60" />
                  )}
                </Button>
              </div>
            </div>
            
            <Button
              type="submit"
              className="w-full btn-rustic mt-6"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>
          
          <div className="mt-6 p-4 bg-gradient-to-r from-[#E1D1A5]/30 to-[#F5C24D]/10 rounded-lg border border-[#9E7E3D]/10">
            <p className="text-sm text-[#4C7A5A]/80 text-center">
              <strong>Demo Credentials:</strong><br />
              Email: doctor@ayursync.com<br />
              Password: password
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
