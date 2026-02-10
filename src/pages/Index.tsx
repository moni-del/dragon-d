import { useEffect, useState } from 'react';
import SpaceBackground from '@/components/SpaceBackground';
import LoginPage from '@/components/LoginPage';

const Index = () => {
  // Use same origin (Netlify domain) by default for API calls
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://dragon-dtt.netlify.app';

  const handleDiscordLogin = () => {
    const clientId = import.meta.env.VITE_DISCORD_CLIENT_ID;
    const redirectUri = encodeURIComponent(import.meta.env.VITE_DISCORD_REDIRECT_URI || 'https://dragon-dtt.netlify.app/?callback=true');
    const scope = encodeURIComponent('identify guilds');

    if (!clientId) {
      console.error('VITE_DISCORD_CLIENT_ID is not set');
      return;
    }

    const authUrl = `https://discord.com/oauth2/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=${scope}`;
    window.location.href = authUrl;
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    
    if (code) {
      // Handle OAuth callback
      fetch(`${API_BASE_URL}/auth/discord/callback?code=${code}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            // Redirect to success page or show success message
            window.location.href = '/success';
          } else {
            console.error('OAuth failed:', data.error);
          }
        })
        .catch((err) => {
          console.error('OAuth callback error:', err);
        });
    }
  }, []);

  return (
    <div className="relative min-h-screen">
      <SpaceBackground />
      <LoginPage onLogin={handleDiscordLogin} />
    </div>
  );
};

export default Index;
