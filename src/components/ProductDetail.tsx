import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, Star, Shield, Zap, Sparkles } from 'lucide-react';
import { Product, rarityLabels } from '@/data/products';
import { useCart } from '@/contexts/CartContext';

interface ProductDetailProps {
  product: Product | null;
  onClose: () => void;
}

const ProductDetail = ({ product, onClose }: ProductDetailProps) => {
  const { addToCart } = useCart();

  if (!product) return null;

  const handleAdd = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    addToCart(product, rect);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-md"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={e => e.stopPropagation()}
          className="glass-card neon-border relative w-full max-w-lg overflow-hidden rounded-3xl"
        >
          {/* Close */}
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="absolute right-4 top-4 z-10 rounded-full bg-background/50 p-2 text-foreground backdrop-blur-sm transition-colors hover:bg-secondary"
          >
            <X className="h-5 w-5" />
          </motion.button>

          {/* Image */}
          <div className="relative h-64 overflow-hidden">
            {product.image ? (
              <motion.img
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
                src={product.image}
                alt={product.nameAr}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className={`flex h-full items-center justify-center bg-gradient-to-br ${product.gradient}`}>
                <span className="text-8xl opacity-80">
                  {product.category === 'cars' ? '🏎️' : product.category === 'weapons' ? '🔫' : product.category === 'characters' ? '👤' : '📦'}
                </span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
            
            {/* Floating sparkles */}
            <motion.div
              animate={{ y: [-5, 5, -5], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute bottom-4 left-4"
            >
              <Sparkles className="h-6 w-6 text-primary" />
            </motion.div>
          </div>

          {/* Content */}
          <div className="p-6" dir="rtl">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
                product.rarity === 'legendary' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                product.rarity === 'rare' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
                product.rarity === 'epic' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                'bg-gray-500/20 text-gray-400 border border-gray-500/30'
              }`}>
                <img src="/logo.webp" alt="DT" className="h-4 w-4 rounded-full" />
                {rarityLabels[product.rarity]}
              </span>
              <span className="text-xs text-muted-foreground">• {product.categoryAr}</span>
            </div>
            
            <h2 className="mb-3 font-heading text-2xl font-bold text-foreground">{product.nameAr}</h2>
            <p className="mb-5 text-sm leading-relaxed text-muted-foreground">{product.descriptionAr}</p>

            {/* Features */}
            <div className="mb-6 flex gap-4">
              {[
                { icon: Star, text: 'تقييم عالي', color: 'text-yellow-400' },
                { icon: Shield, text: 'مضمون 100%', color: 'text-green-400' },
                { icon: Zap, text: 'تسليم فوري', color: 'text-primary' },
              ].map((f, i) => (
                <motion.div
                  key={f.text}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.1 }}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground"
                >
                  <f.icon className={`h-4 w-4 ${f.color}`} />
                  {f.text}
                </motion.div>
              ))}
            </div>

            {/* Price + Add */}
            <div className="flex items-center justify-between rounded-2xl bg-secondary/50 p-4">
              <div className="flex items-center gap-3">
                <span className="font-heading text-3xl font-black text-primary">${product.price} USD</span>
                {product.originalPrice && 
   Number(product.originalPrice) > 0 && 
   String(product.originalPrice).trim() !== '0' && 
   String(product.originalPrice).trim() !== '' && (
                  <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground line-through">${product.originalPrice} USD</span>
                    <span className="text-xs text-green-400">وفر ${(Number(product.originalPrice) - Number(product.price)).toFixed(2)} USD</span>
                  </div>
                )}
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAdd}
                className="neon-button flex items-center gap-2 rounded-xl px-6 py-3 font-bold"
              >
                <ShoppingCart className="h-5 w-5" />
                أضف للسلة
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProductDetail;
