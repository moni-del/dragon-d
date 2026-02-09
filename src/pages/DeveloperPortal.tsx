import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/card';
import { Button } from '@/ui/button';
import { Badge } from '@/ui/badge';
import { Code, Terminal, Package, Settings, FileText, Github } from 'lucide-react';

const DeveloperPortal = () => {
  const sections = [
    {
      title: 'بناء التطبيق',
      description: 'خطوات بناء تطبيق APK من المشروع الحالي',
      icon: <Package className="h-6 w-6" />,
      commands: [
        'npm install @capacitor/core @capacitor/cli @capacitor/android',
        'npx cap init DDTAdmin com.ddt.admin',
        'npx cap add android',
        'npm run build',
        'npx cap sync android',
        'cd android && ./gradlew assembleDebug'
      ],
      color: 'bg-blue-500'
    },
    {
      title: 'إعدادات البيئة',
      description: 'متغيرات البيئة المطلوبة للتطبيق',
      icon: <Settings className="h-6 w-6" />,
      commands: [
        'JAVA_HOME="C:\\Program Files\\Java\\jdk-24"',
        'ANDROID_HOME="C:\\Users\\[USERNAME]\\AppData\\Local\\Android\\Sdk"'
      ],
      color: 'bg-green-500'
    },
    {
      title: 'هيكل المشروع',
      description: 'الملفات والمجلدات الرئيسية في المشروع',
      icon: <FileText className="h-6 w-6" />,
      commands: [
        'src/ - الملفات المصدرية',
        'android/ - مشروع Android الأصلي',
        'dist/ - الملفات المبنية',
        'public/ - الملفات العامة'
      ],
      color: 'bg-purple-500'
    },
    {
      title: 'الأوامر الأساسية',
      description: 'أوامر شائعة للتطوير',
      icon: <Terminal className="h-6 w-6" />,
      commands: [
        'npm run dev - تشغيل خادم التطوير',
        'npm run build - بناء المشروع',
        'npm run preview - معاينة البناء',
        'npx cap run android - تشغيل على Android'
      ],
      color: 'bg-orange-500'
    }
  ];

  const features = [
    { name: 'React + TypeScript', status: 'active' },
    { name: 'Capacitor', status: 'active' },
    { name: 'TailwindCSS', status: 'active' },
    { name: 'Discord Integration', status: 'active' },
    { name: 'OAuth2 Login', status: 'active' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 flex items-center gap-3">
            <Code className="h-10 w-10 text-purple-400" />
            بوابة المطورين - DDT Admin
          </h1>
          <p className="text-lg text-gray-300">
            مركز تطوير تطبيق DDT Admin APK - وثائق، أدوات، وإرشادات
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">{feature.name}</span>
                <Badge variant={feature.status === 'active' ? 'default' : 'secondary'}>
                  {feature.status === 'active' ? 'نشط' : 'غير نشط'}
                </Badge>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sections.map((section, index) => (
            <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${section.color} text-white`}>
                    {section.icon}
                  </div>
                  <div>
                    <CardTitle className="text-white">{section.title}</CardTitle>
                    <CardDescription className="text-gray-300">
                      {section.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-black/30 rounded-lg p-4 font-mono text-sm">
                  {section.commands.map((command, cmdIndex) => (
                    <div key={cmdIndex} className="text-green-400 mb-2">
                      {command.startsWith('npm') || command.startsWith('npx') || command.startsWith('cd') ? (
                        <span>$ {command}</span>
                      ) : (
                        <span>{command}</span>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 bg-white/10 backdrop-blur-sm rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
            <Github className="h-6 w-6" />
            معلومات التطوير
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">متطلبات التشغيل</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• Node.js 18+</li>
                <li>• Java JDK 24</li>
                <li>• Android SDK</li>
                <li>• Gradle</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">ملفات التكوين</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• capacitor.config.ts</li>
                <li>• package.json</li>
                <li>• vite.config.ts</li>
                <li>• .env</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-6 flex gap-4">
          <Button 
            onClick={() => window.open('https://capacitorjs.com/docs', '_blank')}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <FileText className="h-4 w-4 mr-2" />
            وثائق Capacitor
          </Button>
          <Button 
            onClick={() => window.open('https://react.dev', '_blank')}
            variant="outline"
          >
            <Code className="h-4 w-4 mr-2" />
            وثائق React
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeveloperPortal;
