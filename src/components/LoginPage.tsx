import { motion } from 'framer-motion';
import { Car, Crosshair, User, Package, Shield, Zap, Sparkles } from 'lucide-react';

interface LoginPageProps {
  onLogin: () => void;
}

const features = [
  { icon: Car, label: 'سكنات سيارات', desc: 'تصاميم حصرية للسيارات', color: 'text-primary' },
  { icon: Crosshair, label: 'سكنات أسلحة', desc: 'أسلحة نادرة وأسطورية', color: 'text-neon-purple' },
  { icon: User, label: 'سكنات شخصيات', desc: 'شخصيات فريدة', color: 'text-neon-green' },
  { icon: Package, label: 'حزم خاصة', desc: 'عروض وخصومات حصرية', color: 'text-accent' },
  { icon: Shield, label: 'حماية كاملة', desc: 'معاملات آمنة ومضمونة', color: 'text-primary' },
  { icon: Zap, label: 'تسليم فوري', desc: 'استلم فوراً بعد الشراء', color: 'text-neon-green' },
];

const LoginPage = ({ onLogin }: LoginPageProps) => {
  return (
    <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-10">
      {/* Decorative elements */}
      <motion.div
        animate={{ y: [-10, 10, -10], rotate: [0, 5, -5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute left-10 top-20 hidden md:block"
      >
        <Sparkles className="h-8 w-8 text-primary/40" />
      </motion.div>
      <motion.div
        animate={{ y: [10, -10, 10], rotate: [0, -5, 5, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute right-20 top-40 hidden md:block"
      >
        <Sparkles className="h-6 w-6 text-neon-purple/40" />
      </motion.div>

      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5, y: -30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, type: 'spring', bounce: 0.4 }}
        className="mb-10 text-center"
      >
        <h1 className="font-heading text-5xl font-black tracking-wider neon-text md:text-8xl">
          <span className="text-primary">DT</span>
          <span className="text-foreground">_STORE</span>
        </h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-4 text-lg text-muted-foreground md:text-xl"
        >
          أفضل متجر سكنات ألعاب في الوطن العربي
        </motion.p>
      </motion.div>

      {/* Features grid */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="mb-12 grid max-w-4xl grid-cols-2 gap-4 md:grid-cols-3"
      >
        {features.map((f, i) => (
          <motion.div
            key={f.label}
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.4 + i * 0.1, type: 'spring' }}
            whileHover={{ scale: 1.05, y: -5 }}
            className="glass-card flex flex-col items-center rounded-2xl p-5 text-center transition-all duration-300"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, delay: i * 0.5 }}
            >
              <f.icon className={`mb-3 h-10 w-10 ${f.color}`} />
            </motion.div>
            <h3 className="text-sm font-bold text-foreground md:text-base">{f.label}</h3>
            <p className="mt-1 text-xs text-muted-foreground">{f.desc}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Discord Login Button */}
      <motion.button
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, type: 'spring' }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onLogin}
        className="discord-button flex items-center gap-3 rounded-2xl px-12 py-5 text-lg font-bold text-foreground transition-all md:text-xl"
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
        </svg>
        تسجيل الدخول عبر Discord
      </motion.button>

      {/* Bottom text */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3 }}
        className="mt-6 text-center text-xs text-muted-foreground"
      >
        بالتسجيل، أنت توافق على شروط الاستخدام وسياسة الخصوصية
      </motion.p>
    </div>
  );
};

export default LoginPage;
