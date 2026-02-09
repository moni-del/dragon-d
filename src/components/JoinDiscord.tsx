import { motion } from 'framer-motion';
import { Users, MessageCircle, Gift, ArrowLeft } from 'lucide-react';

interface JoinDiscordProps {
  onJoin: () => void;
  onBack: () => void;
}

const JoinDiscord = ({ onJoin, onBack }: JoinDiscordProps) => {
  const handleJoinClick = () => {
    const inviteUrl = import.meta.env.VITE_DISCORD_INVITE_URL;
    if (inviteUrl) {
      window.open(inviteUrl, '_blank');
    }

    if (onJoin) {
      onJoin();
    }
  };

  return (
    <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="glass-card neon-border w-full max-w-md rounded-2xl p-8 text-center"
      >
        {/* Back button */}
        <button
          onClick={onBack}
          className="absolute right-4 top-4 text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>

        {/* Discord icon */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[hsl(235_86%_60%)] shadow-[0_0_30px_hsl(235_86%_60%/0.4)]">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="white">
            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
          </svg>
        </div>

        <h2 className="mb-2 font-heading text-2xl font-bold text-foreground">انضم لسيرفر Discord</h2>
        <p className="mb-6 text-muted-foreground">
          للوصول إلى المتجر، يجب أن تنضم إلى مجتمعنا على Discord أولاً
        </p>

        <div className="mb-8 space-y-3">
          {[
            { icon: Users, text: '+10,000 عضو نشط' },
            { icon: MessageCircle, text: 'دعم فني على مدار الساعة' },
            { icon: Gift, text: 'هدايا وعروض حصرية للأعضاء' },
          ].map((item, i) => (
            <motion.div
              key={item.text}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.15 }}
              className="flex items-center gap-3 rounded-lg bg-secondary/50 px-4 py-3 text-right"
            >
              <item.icon className="h-5 w-5 shrink-0 text-primary" />
              <span className="text-sm text-foreground">{item.text}</span>
            </motion.div>
          ))}
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleJoinClick}
          className="discord-button w-full rounded-xl px-8 py-4 text-lg font-bold text-foreground transition-all"
        >
          انضم الآن وادخل المتجر
        </motion.button>
      </motion.div>
    </div>
  );
};

export default JoinDiscord;
