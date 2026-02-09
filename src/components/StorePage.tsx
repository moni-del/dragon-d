import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from './Header';
import ProductCard from './ProductCard';
import ProductDetail from './ProductDetail';
import CartSheet from './CartSheet';
import Checkout from './Checkout';
import FlyingCartItem from './FlyingCartItem';
import { categories, Product } from '@/data/products';
import { getProducts as getFirebaseProducts, getCategories as getFirebaseCategories, Category as FirebaseCategory } from '@/firebase/database';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '@/firebase/database';
import { Sparkles } from 'lucide-react';

interface StorePageProps {
  onLogout: () => void;
}

const StorePage = ({ onLogout }: StorePageProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Helper to choose a default gradient based on category
  const getDefaultGradient = (category: string | undefined): string => {
    switch (category) {
      case 'cars':
        return 'from-cyan-400 via-blue-500 to-purple-600';
      case 'weapons':
        return 'from-green-400 via-emerald-500 to-teal-600';
      case 'characters':
        return 'from-blue-500 via-indigo-500 to-violet-600';
      case 'bundles':
        return 'from-yellow-400 via-orange-500 to-red-600';
      default:
        return 'from-sky-400 via-blue-500 to-indigo-600';
    }
  };

  // Map Firebase category shape to DT_STORE category shape
  const mapFirebaseCategory = (cat: FirebaseCategory): any => {
    return {
      id: cat.id || cat.name || 'unknown',
      name: cat.name || 'غير مصنف',
      icon: cat.icon || undefined, // Will be undefined if no icon provided
    };
  };

  // Map Firebase product shape into DT_STORE Product shape
  const mapFirebaseProduct = (p: any): Product => {
    const categoryMeta = categories.find(c => c.id === p.category) || 
                        categories.find(c => c.name === p.category) || 
                        categories[0];

    // Fix originalPrice: if it's 0 or "0", make it null
    const fixedOriginalPrice = p.originalPrice && 
                              Number(p.originalPrice) > 0 && 
                              String(p.originalPrice).trim() !== '0' 
                              ? Number(p.originalPrice) 
                              : null;

    return {
      id: p.id || p.name || Math.random().toString(36).slice(2),
      name: p.name || 'Product',
      nameAr: p.nameAr || p.name || 'منتج بدون اسم',
      price: typeof p.price === 'number' ? p.price : 0,
      originalPrice: fixedOriginalPrice,
      category: p.category || 'uncategorized',
      categoryAr: p.categoryAr || categoryMeta?.name || 'غير مصنف',
      image: p.image || '',
      description: p.description || '',
      descriptionAr: p.descriptionAr || p.description || '',
      rarity: p.rarity || 'rare',
      gradient: p.gradient || getDefaultGradient(p.category),
    };
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        // Load categories first
        const categoriesResult = await getFirebaseCategories();
        if (categoriesResult.success) {
          const mappedCategories = [
            { id: 'all', name: 'الكل' },
            ...(categoriesResult.categories || []).map(mapFirebaseCategory)
          ];
          setCategories(mappedCategories);
        } else {
          console.error('Failed to load categories from Firebase:', categoriesResult.error);
          setCategories([{ id: 'all', name: 'الكل' }]);
        }

        // Load products
        const productsResult = await getFirebaseProducts();
        if (productsResult.success) {
          const mapped = (productsResult.products || []).map(mapFirebaseProduct);
          setProducts(mapped);
        } else {
          console.error('Failed to load products from Firebase:', productsResult.error);
          setProducts([]);
        }
      } catch (err) {
        console.error('Error loading data from Firebase:', err);
        setCategories([{ id: 'all', name: 'الكل' }]);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    load();

    // Set up real-time listener for categories
    const unsubscribeCategories = onSnapshot(collection(db, 'categories'), (snapshot) => {
      const updatedCategories = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FirebaseCategory));
      const mappedCategories = [
        { id: 'all', name: 'الكل' },
        ...updatedCategories.map(mapFirebaseCategory)
      ];
      console.log('Categories loaded:', mappedCategories.map(c => ({id: c.id, name: c.name, nameAr: c.nameAr})));
      setCategories(mappedCategories);
    });

    // Set up real-time listener for products
    const unsubscribeProducts = onSnapshot(collection(db, 'products'), (snapshot) => {
      console.log('=== FIREBASE PRODUCTS DEBUG ===');
      const updatedProducts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
      
      updatedProducts.forEach((p, index) => {
        console.log(`Product ${index + 1}:`, {
          name: p.name,
          originalPrice: p.originalPrice,
          originalPriceType: typeof p.originalPrice,
          category: p.category
        });
      });
      
      const mapped = updatedProducts.map(mapFirebaseProduct);
      
      console.log('=== AFTER MAPPING DEBUG ===');
      mapped.forEach((p, index) => {
        console.log(`Mapped Product ${index + 1}:`, {
          name: p.name,
          originalPrice: p.originalPrice,
          originalPriceType: typeof p.originalPrice,
          category: p.category
        });
      });
      
      setProducts(mapped);
    });

    return () => {
      unsubscribeCategories();
      unsubscribeProducts();
    };
  }, []);

  const filtered = useMemo(() => {
    console.log('Active category:', activeCategory);
    console.log('Products before filter:', products.map(p => ({name: p.name, category: p.category})));
    console.log('Available categories:', categories.map(c => ({id: c.id, name: c.name})));
    
    const result = products.filter(p => {
      // Match by category name for consistency with admin panel
      const activeCategoryName = categories.find(c => c.id === activeCategory)?.name || activeCategory;
      const matchCat = activeCategory === 'all' || p.category === activeCategoryName;
      
      const matchSearch = !searchQuery ||
        (p.nameAr && p.nameAr.includes(searchQuery)) ||
        (p.name && p.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.descriptionAr && p.descriptionAr.includes(searchQuery));
      
      console.log(`Product "${p.name}": category="${p.category}", activeCategoryName="${activeCategoryName}", matchCat=${matchCat}, activeCategory="${activeCategory}"`);
      return matchCat && matchSearch;
    });
    
    console.log('Products after filter:', result.map(p => ({name: p.name, category: p.category})));
    return result;
  }, [products, searchQuery, activeCategory, categories]);

  return (
    <div className="relative z-10 min-h-screen">
      <Header
        onCartOpen={() => setCartOpen(true)}
        onLogout={onLogout}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <main className="mx-auto max-w-7xl px-4 py-8">
        {/* Welcome banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center justify-center gap-3 rounded-2xl glass-card neon-border p-4 text-center"
        >
          <img src="/logo.webp" alt="DT_STORE" className="h-8 w-8 rounded-full" />
          <p className="text-sm font-medium text-foreground">
            مرحباً بك في <span className="font-heading text-primary">DT_STORE</span> - اكتشف أفضل السكنات الحصرية!
          </p>
          <img src="/logo.webp" alt="DT_STORE" className="h-8 w-8 rounded-full" />
        </motion.div>

        {/* Categories */}
        <div className="mb-10 flex flex-wrap justify-center gap-3" dir="rtl">
          {categories.map((cat, i) => (
            <motion.button
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ scale: 1.08, y: -3 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
  console.log('Category clicked:', cat.id);
  setActiveCategory(cat.id);
}}
              className={`flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold transition-all ${
                activeCategory === cat.id
                  ? 'neon-button'
                  : 'glass-card text-foreground hover:border-primary/40 hover:shadow-[0_0_15px_hsl(190_100%_50%/0.2)]'
              }`}
            >
              {cat.icon && <span className="text-lg">{cat.icon}</span>}
              {cat.name}
            </motion.button>
          ))}
        </div>

        {/* Products grid */}
        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-24 text-center text-muted-foreground"
          >
            <p className="text-xl">جاري تحميل المنتجات من قاعدة البيانات...</p>
          </motion.div>
        ) : (
          <>
            <motion.div
              layout
              className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4"
            >
              {filtered.map((product, i) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={i}
                  onSelect={setSelectedProduct}
                />
              ))}
            </motion.div>

            {filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-24 text-center text-muted-foreground"
          >
            <p className="text-xl">لا توجد منتجات مطابقة</p>
            <p className="mt-2 text-sm">جرب البحث بكلمات أخرى</p>
          </motion.div>
            )}
          </>
        )}
      </main>

      {/* Modals */}
      <ProductDetail product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      <CartSheet isOpen={cartOpen} onClose={() => setCartOpen(false)} onCheckout={() => { setCartOpen(false); setCheckoutOpen(true); }} />
      <Checkout isOpen={checkoutOpen} onClose={() => setCheckoutOpen(false)} />
      <FlyingCartItem />
    </div>
  );
};

export default StorePage;
