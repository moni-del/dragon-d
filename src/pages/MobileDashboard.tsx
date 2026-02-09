import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/card';
import { Button } from '@/ui/button';
import { Badge } from '@/ui/badge';
import { Smartphone, Home, ShoppingCart, User, Settings, LogOut, Bell, Package, CreditCard, HelpCircle, TrendingUp, Calendar, DollarSign, Percent } from 'lucide-react';
import { logoutMobileUser } from '@/firebase/config';
import { useNavigate } from 'react-router-dom';

const MobileDashboard = () => {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('mobileUserLoggedIn');
    const email = localStorage.getItem('mobileUserEmail');
    
    if (!isLoggedIn) {
      navigate('/mobile');
    } else {
      setUserEmail(email || '');
    }
  }, [navigate]);

  const handleLogout = async () => {
    const result = await logoutMobileUser();
    if (result.success) {
      localStorage.removeItem('mobileUserLoggedIn');
      localStorage.removeItem('mobileUserEmail');
      localStorage.removeItem('mobileUserId');
      navigate('/mobile');
    }
  };

  const menuItems = [
    {
      title: 'الرئيسية',
      description: 'الصفحة الرئيسية للتطبيق',
      icon: <Home className="h-6 w-6" />,
      color: 'bg-blue-500',
      action: () => navigate('/mobile/products')
    },
    {
      title: 'إدارة المنتجات',
      description: 'إضافة وتعديل وحذف المنتجات والأقسام',
      icon: <Package className="h-6 w-6" />,
      color: 'bg-green-500',
      action: () => navigate('/admin/products')
    },
    {
      title: 'أكود الخصم',
      description: 'إنشاء أكواد خصم',
      icon: <Percent className="h-6 w-6" />,
      color: 'bg-yellow-500',
      action: () => navigate('/admin/discounts')
    },
    {
      title: 'الملف الشخصي',
      description: 'إدارة حسابك الشخصي',
      icon: <User className="h-6 w-6" />,
      color: 'bg-purple-500',
      action: () => console.log('Navigate to profile')
    },
    {
      title: 'الإشعارات',
      description: 'عرض جميع الإشعارات',
      icon: <Bell className="h-6 w-6" />,
      color: 'bg-red-500',
      action: () => console.log('Navigate to notifications')
    },
    {
      title: 'الدفع',
      description: 'طرق الدفع والفواتير',
      icon: <CreditCard className="h-6 w-6" />,
      color: 'bg-indigo-500',
      action: () => console.log('Navigate to payment')
    },
    {
      title: 'الإعدادات',
      description: 'إعدادات التطبيق',
      icon: <Settings className="h-6 w-6" />,
      color: 'bg-gray-500',
      action: () => console.log('Navigate to settings')
    },
    {
      title: 'المساعدة',
      description: 'الدعم والمساعدة',
      icon: <HelpCircle className="h-6 w-6" />,
      color: 'bg-cyan-500',
      action: () => console.log('Navigate to help')
    }
  ];

  const stats = [
    { label: 'المبيعات اليومية', value: '156', change: '+12%', icon: <DollarSign className="h-5 w-5" />, color: 'text-green-400' },
    { label: 'المبيعات الأسبوعية', value: '1,092', change: '+8%', icon: <TrendingUp className="h-5 w-5" />, color: 'text-blue-400' },
    { label: 'المبيعات الشهرية', value: '4,368', change: '+15%', icon: <Calendar className="h-5 w-5" />, color: 'text-purple-400' },
    { label: 'المنتجات', value: '24', change: '+3', icon: <Package className="h-5 w-5" />, color: 'text-orange-400' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg">
              <Smartphone className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">تطبيق DDT</h1>
              <p className="text-gray-300 text-sm">{userEmail}</p>
            </div>
          </div>
          <Button 
            onClick={handleLogout}
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10"
          >
            <LogOut className="h-4 w-4 ml-2" />
            تسجيل الخروج
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-4 text-center">
                <div className={`${stat.color} mb-2`}>
                  {stat.icon}
                </div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-gray-300 text-sm">{stat.label}</p>
                <p className={`text-xs mt-1 ${stat.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                  {stat.change}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {menuItems.map((item, index) => (
            <Card 
              key={index}
              className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all cursor-pointer"
              onClick={item.action}
            >
              <CardHeader className="text-center pb-3">
                <div className={`inline-flex p-3 rounded-lg ${item.color} text-white mx-auto mb-2`}>
                  {item.icon}
                </div>
                <CardTitle className="text-white text-lg">{item.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-gray-300 text-sm">
                  {item.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Smartphone className="h-5 w-5" />
              إجراءات سريعة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button 
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => navigate('/mobile/products')}
              >
                <ShoppingCart className="h-4 w-4 ml-2" />
                تسوق الآن
              </Button>
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                <Package className="h-4 w-4 ml-2" />
                طلباتي
              </Button>
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                <Bell className="h-4 w-4 ml-2" />
                الإشعارات
              </Button>
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                <Settings className="h-4 w-4 ml-2" />
                الإعدادات
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-400 text-sm">
          <p>تطبيق DDT الإصدار 2.0.0</p>
          <p className="mt-1">© 2024 DDT Mobile Application</p>
        </div>
      </div>
    </div>
  );
};

export default MobileDashboard;
