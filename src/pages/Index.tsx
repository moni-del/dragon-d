import { useEffect, useState } from 'react';
import SpaceBackground from '@/components/SpaceBackground';
import LoginPage from '@/components/LoginPage';
import JoinDiscord from '@/components/JoinDiscord';
import StorePage from '@/components/StorePage';
import { CartProvider } from '@/contexts/CartContext';

type Step = 'login' | 'joinDiscord' | 'store';

const Index = () => {
  const [step, setStep] = useState<Step>('login');

  // Use same origin (Firebase Hosting domain) by default for API calls
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || window.location.origin;

  const checkStatusAndUpdateStep = () => {
    fetch(`${API_BASE_URL}/api/status`, { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => {
        if (!data.loggedIn) {
          setStep('login');
        } else if (data.inServer) {
          setStep('store');
        } else {
          setStep('joinDiscord');
        }
      })
      .catch(() => {
        setStep('login');
      });
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const loggedIn = params.get('loggedIn') === 'true';

    if (!loggedIn) return;

    checkStatusAndUpdateStep();
  }, []);

  // While user is in store, periodically verify they are still in the required channel/server
  useEffect(() => {
    if (step !== 'store') return;

    const interval = setInterval(() => {
      checkStatusAndUpdateStep();
    }, 5000); // كل 5 ثواني

    return () => clearInterval(interval);
  }, [step]);

  // While user is on joinDiscord step, periodically check if they have joined the required channel
  useEffect(() => {
    if (step !== 'joinDiscord') return;

    const interval = setInterval(() => {
      checkStatusAndUpdateStep();
    }, 5000);

    return () => clearInterval(interval);
  }, [step]);

  return (
    <CartProvider>
      <div className="relative min-h-screen">
        <SpaceBackground />
        {step === 'login' && <LoginPage onLogin={() => setStep('joinDiscord')} />}
        {step === 'joinDiscord' && (
          <JoinDiscord onJoin={checkStatusAndUpdateStep} onBack={() => setStep('login')} />
        )}
        {step === 'store' && <StorePage onLogout={() => setStep('login')} />}
      </div>
    </CartProvider>
  );
};

export default Index;
