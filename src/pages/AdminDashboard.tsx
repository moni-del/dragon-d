import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/card';
import { Button } from '@/ui/button';
import { Badge } from '@/ui/badge';
import { Shield, Users, ShoppingCart, Settings, LogOut, Activity, Database, Globe } from 'lucide-react';
import { logoutAdmin } from '@/firebase/config';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalOrders: 0,
    pendingOrders: 0
  });

  useEffect(() => {
    const isAdminLoggedIn = localStorage.getItem('isAdminLoggedIn');
    if (!isAdminLoggedIn) {
      navigate('/admin/login');
    }
  }, [navigate]);

  const handleLogout = async () => {
    const result = await logoutAdmin();
    if (result.success) {
      localStorage.removeItem('isAdminLoggedIn');
      navigate('/admin/login');
    }
  };

  const menuItems = [
    {
      title: 'إدارة المستخدمين',
      description: 'عرض وإدارة حسابات المستخدمين',
      icon: <Users className="h-6 w-6" />,
      color: 'bg-blue-500',
      path: '/admin/users'
    },
    {
      title: 'إدارة الطلبات',
      description: 'مراقبة ومعالجة طلبات المتجر',
      icon: <ShoppingCart className="h-6 w-6" />,
      color: 'bg-green-500',
      path: '/admin/orders'
    },
    {
      title: 'الإعدادات',
      description: 'إعدادات النظام والتكوين',
      icon: <Settings className="h-6 w-6" />,
      color: 'bg-purple-500',
      path: '/admin/settings'
    },
    {
      title: 'النشاط',
      description: 'سجل النشاط والتقارير',
      icon: <Activity className="h-6 w-6" />,
      color: 'bg-orange-500',
      path: '/admin/activity'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-600 rounded-lg">
              <Shield className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">لوحة تحكم المشرف</h1>
              <p className="text-gray-300">DDT Admin Dashboard</p>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm">إجمالي المستخدمين</p>
                  <p className="text-2xl font-bold">{stats.totalUsers}</p>
                </div>
                <Users className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm">المستخدمون النشطون</p>
                  <p className="text-2xl font-bold">{stats.activeUsers}</p>
                </div>
                <Activity className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm">إجمالي الطلبات</p>
                  <p className="text-2xl font-bold">{stats.totalOrders}</p>
                </div>
                <ShoppingCart className="h-8 w-8 text-orange-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm">الطلبات المعلقة</p>
                  <p className="text-2xl font-bold">{stats.pendingOrders}</p>
                </div>
                <Database className="h-8 w-8 text-red-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {menuItems.map((item, index) => (
            <Card 
              key={index}
              className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all cursor-pointer"
              onClick={() => navigate(item.path)}
            >
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${item.color} text-white`}>
                    {item.icon}
                  </div>
                  <div>
                    <CardTitle className="text-white text-lg">{item.title}</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-300">
                  {item.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white/10 backdrop-blur-sm rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">إجراءات سريعة</h2>
          <div className="flex flex-wrap gap-4">
            <Button 
              onClick={() => window.location.href = '/'}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
            >
              <Globe className="h-4 w-4 ml-2" />
              عرض الموقع
            </Button>
            <Button 
              onClick={() => window.location.href = '/developer'}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
            >
              <Settings className="h-4 w-4 ml-2" />
              بوابة المطورين
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
