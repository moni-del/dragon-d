import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/card';
import { Button } from '@/ui/button';
import { Badge } from '@/ui/badge';
import { 
  Globe, 
  ShoppingCart, 
  Users, 
  Settings, 
  Code, 
  Zap, 
  Shield,
  Rocket,
  Database,
  Cloud,
  Smartphone,
  Monitor,
  Cpu
} from 'lucide-react';

const WebPortal = () => {
  const stats = [
    { label: 'المستخدمون النشطون', value: '1,234', change: '+12%', icon: <Users className="h-5 w-5" /> },
    { label: 'الطلبات اليوم', value: '89', change: '+8%', icon: <ShoppingCart className="h-5 w-5" /> },
    { label: 'معدل التحويل', value: '3.2%', change: '+2%', icon: <Zap className="h-5 w-5" /> },
    { label: 'وقت التحميل', value: '1.2s', change: '-15%', icon: <Monitor className="h-5 w-5" /> }
  ];

  const features = [
    { 
      icon: <Globe className="h-8 w-8 text-blue-400" />, 
      title: 'موقع ويب متجاوب', 
      description: 'يعمل على جميع الأجهزة والشاشات',
      tech: ['React', 'TypeScript', 'TailwindCSS']
    },
    { 
      icon: <ShoppingCart className="h-8 w-8 text-green-400" />, 
      title: 'متجر إلكتروني', 
      description: 'منتجات وخدمات متكاملة',
      tech: ['Cart System', 'Payment Gateway', 'Inventory']
    },
    { 
      icon: <Shield className="h-8 w-8 text-purple-400" />, 
      title: 'تسجيل دخول آمن', 
      description: 'مصادقة Discord OAuth2',
      tech: ['OAuth2', 'JWT', 'Session Management']
    },
    { 
      icon: <Cloud className="h-8 w-8 text-cyan-400" />, 
      title: 'سحابة عالية الأداء', 
      description: 'بنية تحتية قابلة للتوسع',
      tech: ['VPS', 'CDN', 'Load Balancer']
    }
  ];

  const technologies = [
    { name: 'React', icon: <Code className="h-6 w-6" />, color: 'bg-blue-500' },
    { name: 'Node.js', icon: <Cpu className="h-6 w-6" />, color: 'bg-green-500' },
    { name: 'Discord API', icon: <Shield className="h-6 w-6" />, color: 'bg-purple-500' },
    { name: 'Express', icon: <Database className="h-6 w-6" />, color: 'bg-yellow-500' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-cyan-900 to-teal-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-4 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl shadow-2xl">
              <Globe className="h-10 w-10" />
            </div>
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                بوابة الويب
              </h1>
              <p className="text-xl text-gray-300">DDT Web Portal - المنصة الرسمية</p>
            </div>
          </div>
          <div className="flex gap-4 flex-wrap">
            <Badge className="bg-blue-600 text-white px-4 py-2">
              <Globe className="h-4 w-4 ml-2" />
              متصل بالإنترنت
            </Badge>
            <Badge className="bg-green-600 text-white px-4 py-2">
              <Zap className="h-4 w-4 ml-2" />
              عالي الأداء
            </Badge>
            <Badge className="bg-cyan-600 text-white px-4 py-2">
              <Shield className="h-4 w-4 ml-2" />
              آمن ومحمي
            </Badge>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-blue-400">
                    {stat.icon}
                  </div>
                  <span className={`text-sm font-semibold ${
                    stat.change.startsWith('+') ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {stat.change}
                  </span>
                </div>
                <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
                <p className="text-gray-300 text-sm">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-6">مميزات المنصة</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/10 rounded-lg">
                      {feature.icon}
                    </div>
                    <div>
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                      <CardDescription className="text-gray-300">
                        {feature.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {feature.tech.map((tech, techIndex) => (
                      <Badge key={techIndex} variant="outline" className="border-white/20 text-white">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Technologies */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-6">التقنيات المستخدمة</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {technologies.map((tech, index) => (
              <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20 text-center">
                <CardContent className="p-6">
                  <div className={`inline-flex p-4 rounded-lg ${tech.color} mb-4`}>
                    {tech.icon}
                  </div>
                  <h3 className="text-lg font-semibold">{tech.name}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Rocket className="h-6 w-6 text-blue-400" />
                الإطلاق والنشر
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-gray-300">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>نشر تلقائي مع كل تحديث</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>نسخ احتياطية يومية</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>مراقبة الأداء 24/7</span>
                </div>
              </div>
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                عرض لوحة التحكم
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Smartphone className="h-6 w-6 text-blue-400" />
                التطبيقات المقترحة
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-gray-300">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>تطبيق Android أصلي</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>تطبيق iOS أصلي</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>تطبيق Progressive Web App</span>
                </div>
              </div>
              <Button className="w-full bg-purple-600 hover:bg-purple-700">
                استكشاف التطبيقات
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default WebPortal;
