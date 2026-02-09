import { useMemo, useEffect, useState } from 'react';

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
  twinkleSpeed: number;
  color: string;
}

interface ShootingStar {
  id: number;
  x: number;
  y: number;
  length: number;
  speed: number;
  angle: number;
}

const SpaceBackground = () => {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [shootingStars, setShootingStars] = useState<ShootingStar[]>([]);

  // Generate stars with different layers for parallax effect
  const starLayers = useMemo(() => {
    const layers: Star[][] = [[], [], []];
    const colors = [
      'rgba(255, 255, 255, 1)',
      'rgba(0, 255, 255, 1)',
      'rgba(200, 150, 255, 1)',
      'rgba(255, 200, 100, 1)',
    ];

    // Far stars (slow, small)
    for (let i = 0; i < 80; i++) {
      layers[0].push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.5 + 0.3,
        speed: 0.02,
        twinkleSpeed: Math.random() * 8 + 12,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    // Mid stars (medium)
    for (let i = 0; i < 60; i++) {
      layers[1].push({
        id: i + 100,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.6 + 0.4,
        speed: 0.05,
        twinkleSpeed: 6,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    // Near stars (fast, large, bright)
    for (let i = 0; i < 40; i++) {
      layers[2].push({
        id: i + 200,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 2,
        opacity: Math.random() * 0.4 + 0.6,
        speed: 0.1,
        twinkleSpeed: 6,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    return layers;
  }, []);

  // Parallax effect on mouse move
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      setOffset({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Shooting stars
  useEffect(() => {
    const createShootingStar = () => {
      const speed = Math.random() * 1.5 + 2.5; // أبطأ قليلاً لنعومة الحركة
      const newStar: ShootingStar = {
        id: Date.now(),
        x: Math.random() * 100,
        y: Math.random() * 30,
        length: Math.random() * 60 + 60,
        speed,
        angle: Math.random() * 15 + 25,
      };
      setShootingStars(prev => [...prev, newStar]);

      setTimeout(() => {
        setShootingStars(prev => prev.filter(s => s.id !== newStar.id));
      }, speed * 1000 + 800); // مدة أطول بقليل من زمن الأنيميشن حتى لا تختفي فجأة
    };

    const interval = setInterval(createShootingStar, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      {/* Animated gradient background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 ease-out"
        style={{
          backgroundImage:
            'radial-gradient(circle at 10% 10%, rgba(56,189,248,0.22) 0, transparent 55%), radial-gradient(circle at 85% 85%, rgba(129,140,248,0.3) 0, transparent 60%), radial-gradient(circle at 50% 0%, rgba(59,130,246,0.35) 0, transparent 65%), radial-gradient(circle at 0% 100%, rgba(236,72,153,0.18) 0, transparent 60%)',
          transform: `scale(1.1) translate(${offset.x * 0.5}px, ${offset.y * 0.5}px)`,
        }}
      />

      {/* Dark overlay with gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/70 to-background/90" />

      {/* Nebula effect layers */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: 'radial-gradient(ellipse at 20% 30%, hsl(190 100% 50% / 0.15) 0%, transparent 50%)',
          transform: `translate(${offset.x * 0.3}px, ${offset.y * 0.3}px)`,
          transition: 'transform 0.5s ease-out',
        }}
      />
      <div
        className="absolute inset-0 opacity-20"
        style={{
          background: 'radial-gradient(ellipse at 80% 70%, hsl(270 80% 60% / 0.2) 0%, transparent 50%)',
          transform: `translate(${-offset.x * 0.2}px, ${-offset.y * 0.2}px)`,
          transition: 'transform 0.5s ease-out',
        }}
      />

      {/* Star layers with parallax */}
      {starLayers.map((layer, layerIndex) => (
        <div
          key={layerIndex}
          className="absolute inset-0"
          style={{
            transform: `translate(${offset.x * (layerIndex + 1) * 0.3}px, ${offset.y * (layerIndex + 1) * 0.3}px)`,
            transition: 'transform 0.3s ease-out',
          }}
        >
          {layer.map(star => (
            <div
              key={star.id}
              className="absolute rounded-full"
              style={{
                left: `${star.x}%`,
                top: `${star.y}%`,
                width: `${star.size}px`,
                height: `${star.size}px`,
                backgroundColor: star.color,
                opacity: star.opacity,
                boxShadow: star.size > 2
                  ? `0 0 ${star.size * 4}px ${star.color}, 0 0 ${star.size * 8}px ${star.color}`
                  : `0 0 ${star.size * 2}px ${star.color}`,
                animation: `twinkle ${star.twinkleSpeed}s ease-in-out infinite alternate`,
                animationDelay: `${Math.random() * star.twinkleSpeed}s`,
              }}
            />
          ))}
        </div>
      ))}

      {/* Shooting stars */}
      {shootingStars.map(star => (
        <div
          key={star.id}
          className="absolute pointer-events-none"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.length}px`,
            height: '3px',
            borderRadius: '999px',
            background:
              'linear-gradient(90deg, rgba(15,23,42,0) 0%, rgba(56,189,248,0.85) 40%, rgba(129,140,248,0.6) 70%, rgba(15,23,42,0) 100%)',
            transform: `rotate(${star.angle}deg)`,
            animation: `shooting-star ${star.speed}s ease-out forwards`,
            boxShadow: '0 0 18px rgba(56,189,248,0.7)',
          }}
        />
      ))}

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={`particle-${i}`}
            className="absolute rounded-full bg-primary/30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 4 + 1}px`,
              height: `${Math.random() * 4 + 1}px`,
              animation: `float-particle ${Math.random() * 10 + 10}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default SpaceBackground;
