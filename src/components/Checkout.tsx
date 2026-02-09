import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, CreditCard, CheckCircle2 } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useState } from 'react';

interface CheckoutProps {
  isOpen: boolean;
  onClose: () => void;
}

const paymentMethods = [
  { id: 'paypal', name: 'PayPal', icon: '💳', color: 'from-blue-500 to-blue-700' },
  { id: 'visa', name: 'Visa / MasterCard', icon: '💳', color: 'from-indigo-500 to-purple-600' },
  { id: 'crypto', name: 'عملات رقمية', icon: '₿', color: 'from-orange-500 to-yellow-500' },
  { id: 'applepay', name: 'Apple Pay', icon: '🍎', color: 'from-gray-600 to-gray-800' },
  { id: 'googlepay', name: 'Google Pay', icon: '🔵', color: 'from-green-500 to-teal-600' },
  { id: 'steam', name: 'Steam Wallet', icon: '🎮', color: 'from-slate-600 to-slate-800' },
];

const Checkout = ({ isOpen, onClose }: CheckoutProps) => {
  const { items, totalPrice, discountPercent, discountAmount, finalizePurchase } = useCart();
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);

  const handlePay = () => {
    setCompleted(true);
    setTimeout(() => {
      finalizePurchase(); // This will clear the cart and reset discount states
      setCompleted(false);
      setSelectedMethod(null);
      onClose();
    }, 3000);
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
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed inset-x-4 bottom-4 top-4 z-50 mx-auto flex max-w-lg flex-col overflow-hidden rounded-2xl border border-border bg-background md:inset-x-auto md:inset-y-8"
            dir="rtl"
          >
            {completed ? (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex flex-1 flex-col items-center justify-center p-8 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.2 }}
                >
                  <CheckCircle2 className="mb-4 h-20 w-20 text-neon-green" />
                </motion.div>
                <h2 className="mb-2 font-heading text-2xl font-bold text-foreground">تم الدفع بنجاح!</h2>
                <p className="text-muted-foreground">شكراً لشرائك من DT_STORE</p>
              </motion.div>
            ) : (
              <>
                {/* Header */}
                <div className="flex items-center justify-between border-b border-border p-4">
                  <h2 className="font-heading text-xl font-bold text-foreground">إتمام الشراء</h2>
                  <button onClick={onClose} className="rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Order summary */}
                <div className="border-b border-border p-4">
                  <h3 className="mb-3 text-sm font-bold text-muted-foreground">ملخص الطلب</h3>
                  <div className="space-y-2">
                    {items.map(item => (
                      <div key={item.product.id} className="flex justify-between text-sm text-foreground">
                        <span>{item.product.nameAr} × {item.quantity}</span>
                        <span>${(item.product.price * item.quantity).toFixed(2)} USD</span>
                      </div>
                    ))}
                    {(discountPercent > 0 || discountAmount > 0) && (
                      <div className="flex justify-between text-sm text-neon-green">
                        <span>خصم: {discountPercent > 0 ? `${discountPercent}%` : `${discountAmount} USD`}</span>
                        <span>-${discountPercent > 0 ? (items.reduce((s, i) => s + i.product.price * i.quantity, 0) * discountPercent / 100).toFixed(2) : discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="border-t border-border pt-2 flex justify-between text-lg font-bold text-foreground">
                      <span>المجموع</span>
                      <span className="text-primary">${totalPrice.toFixed(2)} USD</span>
                    </div>
                  </div>
                </div>

                {/* Payment methods */}
                <div className="flex-1 overflow-y-auto p-4">
                  <h3 className="mb-3 text-sm font-bold text-muted-foreground">اختر طريقة الدفع</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {paymentMethods.map((method, i) => (
                      <motion.button
                        key={method.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        onClick={() => setSelectedMethod(method.id)}
                        className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all ${
                          selectedMethod === method.id
                            ? 'border-primary bg-primary/10 shadow-[0_0_15px_hsl(190_100%_50%/0.2)]'
                            : 'border-border bg-card hover:border-muted-foreground/30'
                        }`}
                      >
                        <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${method.color} text-lg`}>
                          {method.icon}
                        </div>
                        <span className="text-xs font-bold text-foreground">{method.name}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Pay button */}
                <div className="border-t border-border p-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={!selectedMethod}
                    onClick={handlePay}
                    className="neon-button flex w-full items-center justify-center gap-2 rounded-xl py-3 text-lg font-bold disabled:opacity-40 disabled:hover:shadow-none disabled:hover:translate-y-0"
                  >
                    <CreditCard className="h-5 w-5" />
                    ادفع ${totalPrice.toFixed(2)} USD
                  </motion.button>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Checkout;
