import { motion } from 'framer-motion';
import { useCart } from '@/contexts/CartContext';

const FlyingCartItem = () => {
  const { flyingItems, cartIconRef } = useCart();

  return (
    <>
      {flyingItems.map(item => {
        const cartRect = cartIconRef.current?.getBoundingClientRect();
        const endX = cartRect ? cartRect.left + cartRect.width / 2 : window.innerWidth - 60;
        const endY = cartRect ? cartRect.top + cartRect.height / 2 : 30;

        return (
          <motion.div
            key={item.id}
            initial={{
              x: item.startX - 30,
              y: item.startY - 30,
              scale: 1,
              opacity: 1,
              rotate: 0,
            }}
            animate={{
              x: endX - 30,
              y: endY - 30,
              scale: 0.15,
              opacity: 0.2,
              rotate: 360,
            }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="pointer-events-none fixed z-[100]"
          >
            <div className="relative h-14 w-14 overflow-hidden rounded-xl shadow-[0_0_30px_hsl(190_100%_50%/0.5)]">
              {item.product.image ? (
                <img src={item.product.image} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${item.product.gradient}`}>
                  <span className="text-2xl">
                    {item.product.category === 'cars' ? '🏎️' : item.product.category === 'weapons' ? '🔫' : item.product.category === 'characters' ? '👤' : '📦'}
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        );
      })}
    </>
  );
};

export default FlyingCartItem;
