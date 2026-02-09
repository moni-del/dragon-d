import { ShoppingCart, Search, LogOut, Sparkles } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { motion, AnimatePresence } from 'framer-motion';

interface HeaderProps {
  onCartOpen: () => void;
  onLogout: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

const Header = ({ onCartOpen, onLogout, searchQuery, onSearchChange }: HeaderProps) => {
  const { totalItems, cartIconRef } = useCart();

  return (
    <header className="sticky top-0 z-40 border-b border-border/50 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2"
        >
          <img src="/logo.webp" alt="DT_STORE" className="h-5 w-5 rounded-full" />
          <h1 className="font-heading text-xl font-black tracking-wider md:text-2xl">
            <span className="text-primary">DT</span>
            <span className="text-foreground">_STORE</span>
          </h1>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative mx-4 hidden flex-1 max-w-md md:block"
        >
          <Search className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="ابحث عن منتج..."
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            className="w-full rounded-xl border-2 border-border bg-input/50 px-4 py-2.5 pr-11 text-sm text-foreground placeholder:text-muted-foreground transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-input"
            dir="rtl"
          />
        </motion.div>

        <div className="flex items-center gap-2">
          {/* Cart */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onCartOpen}
            className="relative rounded-xl p-2.5 text-foreground transition-all hover:bg-secondary glass-card"
          >
            <div ref={cartIconRef}>
              <ShoppingCart className="h-5 w-5" />
            </div>
            <AnimatePresence>
              {totalItems > 0 && (
                <motion.span
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0 }}
                  className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground shadow-lg"
                >
                  {totalItems}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          {/* Logout */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onLogout}
            className="rounded-xl p-2.5 text-muted-foreground transition-all hover:bg-secondary hover:text-foreground glass-card"
          >
            <LogOut className="h-5 w-5" />
          </motion.button>
        </div>
      </div>

      {/* Mobile search */}
      <div className="border-t border-border/30 px-4 py-3 md:hidden">
        <div className="relative">
          <Search className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="ابحث عن منتج..."
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            className="w-full rounded-xl border-2 border-border bg-input/50 px-4 py-2.5 pr-11 text-sm text-foreground placeholder:text-muted-foreground transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            dir="rtl"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
