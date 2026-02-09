import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Trash2, Tag, ArrowLeft } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useState } from 'react';
import { toast } from 'sonner';

interface CartSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: () => void;
}

const CartSheet = ({ isOpen, onClose, onCheckout }: CartSheetProps) => {
  const { items, removeFromCart, updateQuantity, totalPrice, totalItems, discountCode, setDiscountCode, discountPercent, discountAmount, discountApplied, applyDiscount } = useCart();
  const [codeInput, setCodeInput] = useState('');
  const [isApplying, setIsApplying] = useState(false);

  const handleApply = async () => {
    if (isApplying) return; // Prevent multiple clicks
    
    setIsApplying(true);
    setDiscountCode(codeInput);
    const result = await applyDiscount();
    if (result.success) {
      toast.success('تم تطبيق كود الخصم بنجاح!');
    } else {
      toast.error(result.error || 'كود الخصم غير صالح');
    }
    setIsApplying(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 top-0 z-50 flex w-full max-w-md flex-col border-r border-border bg-background"
            dir="rtl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border p-4">
              <h2 className="font-heading text-xl font-bold text-foreground">
                السلة ({totalItems})
              </h2>
              <button onClick={onClose} className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-4">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-muted-foreground">
                  <p className="text-lg">السلة فارغة</p>
                  <p className="mt-1 text-sm">أضف منتجات للبدء</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <AnimatePresence>
                    {items.map(item => (
                      <motion.div
                        key={item.product.id}
                        layout
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20, height: 0 }}
                        className="glass-card flex items-center gap-3 rounded-xl p-3"
                      >
                        {/* Product icon */}
                        <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${item.product.gradient}`}>
                          <span className="text-2xl">
                            {item.product.category === 'cars' ? '🏎️' : item.product.category === 'weapons' ? '🔫' : item.product.category === 'characters' ? '👤' : '📦'}
                          </span>
                        </div>

                        <div className="flex-1">
                          <h4 className="text-sm font-bold text-foreground line-clamp-1">{item.product.nameAr}</h4>
                          <p className="text-sm font-bold text-primary">${item.product.price} USD</p>
                        </div>

                        {/* Quantity */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="rounded-md bg-secondary p-1 text-foreground transition-colors hover:bg-secondary/80"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="w-6 text-center text-sm font-bold text-foreground">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="rounded-md bg-secondary p-1 text-foreground transition-colors hover:bg-secondary/80"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        {/* Remove */}
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="rounded-md p-1.5 text-destructive transition-colors hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Discount + Checkout */}
            {items.length > 0 && (
              <div className="border-t border-border p-4">
                {/* Discount code */}
                <div className="mb-4 flex gap-2">
                  <input
                    type="text"
                    placeholder="كود الخصم"
                    value={codeInput}
                    onChange={e => setCodeInput(e.target.value)}
                    className="flex-1 rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                  />
                  <button
                    onClick={handleApply}
                    disabled={isApplying || !codeInput.trim()}
                    className={`flex items-center gap-1 rounded-lg px-4 py-2 text-sm font-bold transition-colors ${
                      isApplying || !codeInput.trim() 
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                        : 'bg-secondary text-foreground hover:bg-secondary/80'
                    }`}
                  >
                    <Tag className="h-4 w-4" />
                    {isApplying ? 'جاري التطبيق...' : 'تطبيق'}
                  </button>
                </div>

                {(discountPercent > 0 || discountAmount > 0) && (
                  <p className="mb-3 text-center text-sm text-neon-green">
                    ✓ خصم مطبق: {discountPercent > 0 ? `${discountPercent}%` : `${discountAmount} USD`}
                    {discountApplied && <span className="mr-2 text-xs">(✓ تم تفعيل الكود)</span>}
                  </p>
                )}

                <div className="mb-4 flex justify-between text-lg font-bold text-foreground">
                  <span>المجموع:</span>
                  <span className="text-primary">${totalPrice.toFixed(2)} USD</span>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onCheckout}
                  className="neon-button flex w-full items-center justify-center gap-2 rounded-xl py-3 text-lg font-bold"
                >
                  <ArrowLeft className="h-5 w-5" />
                  التالي - طرق الدفع
                </motion.button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartSheet;
