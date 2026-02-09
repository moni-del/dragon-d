import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Product } from '@/data/products';
import { validateDiscountCode, useDiscountCode } from '@/firebase/discount';
import { initializeAnonymousAuth } from '@/firebase/database';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface FlyingItem {
  id: string;
  product: Product;
  startX: number;
  startY: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, buttonRect: DOMRect) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  discountCode: string;
  setDiscountCode: (code: string) => void;
  discountPercent: number;
  discountAmount: number;
  discountApplied: boolean;
  applyDiscount: () => Promise<{ success: boolean; error?: string }>;
  finalizePurchase: () => void;
  flyingItems: FlyingItem[];
  cartIconRef: React.RefObject<HTMLDivElement>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const VALID_CODES: Record<string, number> = {
  DT10: 10,
  DT20: 20,
  DT50: 50,
  WELCOME: 15,
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [discountCode, setDiscountCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [discountApplied, setDiscountApplied] = useState(false);
  const [flyingItems, setFlyingItems] = useState<FlyingItem[]>([]);
  const cartIconRef = React.useRef<HTMLDivElement>(null!);

  // Initialize anonymous auth on mount
  useEffect(() => {
    // Skip anonymous auth for now since it's disabled
    // initializeAnonymousAuth().catch(console.error);
  }, []);

  const addToCart = useCallback((product: Product, buttonRect: DOMRect) => {
    // Add flying animation item
    const flyId = `fly-${Date.now()}`;
    setFlyingItems(prev => [...prev, {
      id: flyId,
      product,
      startX: buttonRect.left + buttonRect.width / 2,
      startY: buttonRect.top + buttonRect.height / 2,
    }]);

    setTimeout(() => {
      setFlyingItems(prev => prev.filter(item => item.id !== flyId));
    }, 800);

    setItems(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setItems(prev => prev.filter(item => item.product.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems(prev => prev.filter(item => item.product.id !== productId));
    } else {
      setItems(prev => prev.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      ));
    }
  }, []);

  const clearCart = useCallback(() => {
  setItems([]);
  setDiscountCode('');
  setDiscountPercent(0);
  setDiscountAmount(0);
  setDiscountApplied(false);
}, []);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const totalPrice = Math.max(0, subtotal - discountAmount);

  const applyDiscount = useCallback(async () => {
  const code = discountCode.toUpperCase().trim();
  if (!code) {
    return { success: false, error: 'يرجى إدخال كود الخصم' };
  }

  // Prevent multiple applications of the same code
  if (discountApplied && discountCode.toUpperCase() === code) {
    return { success: false, error: 'هذا الكود مطبق بالفعل' };
  }

  console.log('Trying to validate discount code:', code);

  // First try Firebase discount codes
  const firebaseResult = await validateDiscountCode(code);
  console.log('Firebase result:', firebaseResult);
  
  if (firebaseResult.success && firebaseResult.valid) {
    const discountData = firebaseResult.code!;
    const subtotal = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    
    console.log('Discount data:', discountData);
    console.log('Subtotal:', subtotal);
    
    // Check minimum order value
    if (discountData.minOrderValue > 0 && subtotal < discountData.minOrderValue) {
      return { success: false, error: `الحد الأدنى للطلب هو ${discountData.minOrderValue} USD` };
    }

    // Calculate discount
    if (discountData.discountType === 'percentage') {
      setDiscountPercent(discountData.discountValue);
      setDiscountAmount(subtotal * (discountData.discountValue / 100));
    } else {
      setDiscountPercent(0);
      setDiscountAmount(discountData.discountValue);
    }

    // Use the discount code
    await useDiscountCode(code);
    setDiscountApplied(true);
    return { success: true };
  }

  // Fallback to hardcoded codes
  if (VALID_CODES[code]) {
    setDiscountPercent(VALID_CODES[code]);
    const subtotal = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    setDiscountAmount(subtotal * (VALID_CODES[code] / 100));
    setDiscountApplied(true);
    return { success: true };
  }

  return { success: false, error: 'كود الخصم غير صالح' };
}, [discountCode, items, discountApplied]);

  const finalizePurchase = useCallback(() => {
    // This function is called when payment is completed
    // The discount code was already used when applyDiscount was called
    // So we just need to clear the cart
    clearCart();
  }, [clearCart]);

  return (
    <CartContext.Provider value={{
      items, addToCart, removeFromCart, updateQuantity, clearCart,
      totalItems, totalPrice, discountCode, setDiscountCode, discountPercent,
      discountAmount, discountApplied, applyDiscount, finalizePurchase, flyingItems, cartIconRef,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
