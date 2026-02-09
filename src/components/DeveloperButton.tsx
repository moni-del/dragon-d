import React from 'react';
import { Button } from '@/ui/button';
import { Code, Shield } from 'lucide-react';

const DeveloperButton = () => {
  return (
    <div className="fixed bottom-6 left-6 flex flex-col gap-3 z-50">
      <Button
        onClick={() => window.location.href = '/admin/login'}
        className="bg-red-600 hover:bg-red-700 text-white p-4 rounded-full shadow-lg"
        title="تسجيل دخول المشرف"
      >
        <Shield className="h-6 w-6" />
      </Button>
      <Button
        onClick={() => window.location.href = '/developer'}
        className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-full shadow-lg"
        title="بوابة المطورين"
      >
        <Code className="h-6 w-6" />
      </Button>
    </div>
  );
};

export default DeveloperButton;
