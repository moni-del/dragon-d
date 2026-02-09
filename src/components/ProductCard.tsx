import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
import { Product, rarityColors, rarityLabels, rarityGlow } from '@/data/products';
import { useCart } from '@/contexts/CartContext';

interface ProductCardProps {
  product: Product;
  index: number;
  onSelect: (product: Product) => void;
}

const ProductCard = ({ product, index, onSelect }: ProductCardProps) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    addToCart(product, rect);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -5, scale: 1.02 }}
      onClick={() => onSelect(product)}
      className={`relative group cursor-pointer overflow-hidden rounded-2xl border-2 transition-all duration-300 hover:shadow-2xl ${
        product.rarity === 'legendary' ? 'border-yellow-400/60 shadow-[0_0_30px_hsl(45_100%_50%/0.3)]' :
        product.rarity === 'rare' ? 'border-purple-400/60 shadow-[0_0_25px_hsl(270_80%_60%/0.3)]' :
        product.rarity === 'epic' ? 'border-green-400/60 shadow-[0_0_25px_hsl(120_80%_50%/0.3)]' :
        'border-gray-400/60 shadow-[0_0_20px_hsl(220_10%_50%/0.2)]'
      }`}
    >
      {/* Image area */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-secondary to-muted">
        {product.image ? (
          <img
            src={product.image}
            alt={product.nameAr}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className={`flex h-full items-center justify-center bg-gradient-to-br ${product.gradient}`}>
            <span className="text-6xl opacity-80">
              {product.category === 'cars' ? '🏎️' : product.category === 'weapons' ? '🔫' : product.category === 'characters' ? '👤' : '📦'}
            </span>
          </div>
        )}
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-60" />
        
        {/* Rarity badge */}
        <motion.span
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: index * 0.05 + 0.2 }}
          className={`absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-bold shadow-lg ${
            product.rarity === 'legendary' ? 'bg-yellow-500/90 text-yellow-950 border-2 border-yellow-300' :
            product.rarity === 'rare' ? 'bg-purple-500/90 text-white border-2 border-purple-300' :
            product.rarity === 'epic' ? 'bg-green-500/90 text-white border-2 border-green-300' :
            'bg-gray-500/90 text-white border-2 border-gray-300'
          }`}
        >
          {rarityLabels[product.rarity]}
        </motion.span>
        
        {/* Discount badge */}
        {product.originalPrice && 
   Number(product.originalPrice) > 0 && 
   String(product.originalPrice).trim() !== '0' && 
   String(product.originalPrice).trim() !== '' && (
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.05 + 0.3 }}
            className="absolute left-0 top-0 bg-destructive text-destructive-foreground text-xs font-bold px-3 py-1 rounded-br-lg shadow-lg"
          >
            خصم {Math.round(((Number(product.originalPrice) - Number(product.price)) / Number(product.originalPrice)) * 100)}%
          </motion.div>
        )}
      </div>

      {/* Info */}
      <div className="p-4" dir="rtl">
        <h3 className="mb-1 font-heading text-sm font-bold text-foreground line-clamp-1">{product.nameAr}</h3>
        <p className="mb-3 text-xs text-muted-foreground">{product.categoryAr}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-heading text-xl font-black text-primary">${product.price} USD</span>
            {product.originalPrice && 
   Number(product.originalPrice) > 0 && 
   String(product.originalPrice).trim() !== '0' && 
   String(product.originalPrice).trim() !== '' && 
   product.originalPrice !== null && (
              <span className="text-sm text-muted-foreground line-through">${product.originalPrice} USD</span>
            )}
          </div>
          <motion.button
            whileHover={{ scale: 1.15, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleAddToCart}
            className="neon-button rounded-xl p-2.5"
          >
            <ShoppingCart className="h-4 w-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
