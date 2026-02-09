import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/card';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { Label } from '@/ui/label';
import { Alert, AlertDescription } from '@/ui/alert';
import { Smartphone, Mail, Lock, Eye, EyeOff, AlertCircle, Shield } from 'lucide-react';
import { signInMobileUser } from '@/firebase/config';
import { useNavigate } from 'react-router-dom';

const MobileLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const result = await signInMobileUser(email, password);
    
    if (result.success) {
      setSuccess('تم تسجيل الدخول بنجاح!');
      localStorage.setItem('mobileUserLoggedIn', 'true');
      localStorage.setItem('mobileUserEmail', email);
      localStorage.setItem('mobileUserId', result.user?.uid || '');
      
      setTimeout(() => {
        navigate('/mobile/dashboard');
      }, 1000);
    } else {
      setError(result.error || 'فشل تسجيل الدخول');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Mobile App Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mb-4 shadow-2xl">
            <Smartphone className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">تطبيق DDT</h1>
          <p className="text-gray-300">DDT Mobile Application</p>
        </div>

        {/* Login Card */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-white flex items-center justify-center gap-2">
              <Shield className="h-5 w-5" />
              تسجيل الدخول
            </CardTitle>
            <CardDescription className="text-gray-300">
              أدخل بياناتك للوصول إلى التطبيق
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <Alert className="bg-red-500/20 border-red-500/50 text-red-200">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              {success && (
                <Alert className="bg-green-500/20 border-green-500/50 text-green-200">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">البريد الإلكتروني</Label>
                <div className="relative">
                  <Mail className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@example.com"
                    className="pr-10 bg-white/5 border-white/20 text-white placeholder-gray-400"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">كلمة المرور</Label>
                <div className="relative">
                  <Lock className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pr-10 bg-white/5 border-white/20 text-white placeholder-gray-400"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-2 top-2 h-6 w-6 p-0 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold"
                disabled={loading}
              >
                {loading ? 'جاري تسجيل الدخول...' : 'دخول إلى التطبيق'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-400 text-sm">MONAF المطور</p>
            </div>
          </CardContent>
        </Card>

        {/* Mobile Features Preview */}
        <div className="mt-8 text-center">
          <div className="grid grid-cols-3 gap-4 text-white">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
              <Shield className="h-6 w-6 mx-auto mb-1 text-purple-400" />
              <p className="text-xs">آمن</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
              <Smartphone className="h-6 w-6 mx-auto mb-1 text-pink-400" />
              <p className="text-xs">سريع</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
              <Mail className="h-6 w-6 mx-auto mb-1 text-indigo-400" />
              <p className="text-xs">Firebase</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileLogin;
