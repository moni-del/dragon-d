import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/card';
import { Button } from '@/ui/button';
import { Badge } from '@/ui/badge';
import { Input } from '@/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/select';
import { 
  Home, 
  ShoppingCart, 
  Search, 
  Filter, 
  Star, 
  Heart, 
  Eye,
  Package,
  DollarSign,
  Grid,
  List,
  ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getProducts, getCategories, searchProducts, getProductsByCategory, Product } from '@/firebase/database';

const MobileProducts = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>(['الكل']);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('الكل');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('name');
  const [favorites, setFavorites] = useState<number[]>([]);

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  useEffect(() => {
    filterAndSortProducts();
  }, [products, searchTerm, selectedCategory, sortBy]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const result = await getProducts();
      if (result.success) {
        setProducts(result.products);
      } else {
        setError(result.error || 'فشل تحميل المنتجات');
      }
    } catch (err) {
      setError('فشل تحميل المنتجات');
    }
    setLoading(false);
  };

  const loadCategories = async () => {
    try {
      // For now, extract unique categories from products
      // In a real app, you'd fetch from categories collection
      const result = await getProducts();
      if (result.success) {
        const uniqueCategories = ['الكل', ...new Set(result.products.map(p => p.category))];
        setCategories(uniqueCategories);
      }
    } catch (err) {
      console.error('Failed to load categories');
    }
  };

  const filterAndSortProducts = () => {
    let filtered = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'الكل' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    setFilteredProducts(filtered);
  };

  const toggleFavorite = (productId: number) => {
    setFavorites(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const ProductCard = ({ product }: { product: Product }) => (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all">
      <CardHeader className="p-4">
        <div className="relative">
          <div className="w-full h-40 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center mb-3">
            <Package className="h-12 w-12 text-white" />
          </div>
          {product.discount > 0 && (
            <Badge className="absolute top-2 left-2 bg-red-600 text-white">
              -{product.discount}%
            </Badge>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleFavorite(Number(product.id))}
            className="absolute top-2 right-2 p-2 bg-white/10 hover:bg-white/20"
          >
            <Heart className={`h-4 w-4 ${favorites.includes(Number(product.id)) ? 'fill-red-500 text-red-500' : 'text-white'}`} />
          </Button>
        </div>
        <CardTitle className="text-white text-lg">{product.name}</CardTitle>
        <CardDescription className="text-gray-300 text-sm">
          {product.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="outline" className="border-white/20 text-white">
            {product.category}
          </Badge>
          <div className="flex items-center gap-1 text-yellow-400">
            <Star className="h-4 w-4 fill-current" />
            <span className="text-white text-sm">{product.rating}</span>
            <span className="text-gray-400 text-xs">({product.reviews})</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl font-bold text-white">{product.price} ريال</span>
          {product.originalPrice > product.price && (
            <span className="text-gray-400 line-through text-sm">{product.originalPrice} ريال</span>
          )}
        </div>

        <div className="flex gap-2">
          <Button 
            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            disabled={!product.inStock}
          >
            <ShoppingCart className="h-4 w-4 ml-2" />
            {product.inStock ? 'أضف للسلة' : 'غير متوفر'}
          </Button>
          <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const ProductListItem = ({ product }: { product: Product }) => (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all">
      <CardContent className="p-4">
        <div className="flex gap-4">
          <div className="relative w-24 h-24 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <Package className="h-8 w-8 text-white" />
            {product.discount > 0 && (
              <Badge className="absolute top-1 left-1 bg-red-600 text-white text-xs">
                -{product.discount}%
              </Badge>
            )}
          </div>
          
          <div className="flex-1">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-white font-semibold text-lg">{product.name}</h3>
                <p className="text-gray-300 text-sm mb-2">{product.description}</p>
                <Badge variant="outline" className="border-white/20 text-white text-xs">
                  {product.category}
                </Badge>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleFavorite(Number(product.id))}
                className="p-2 bg-white/10 hover:bg-white/20"
              >
                <Heart className={`h-4 w-4 ${favorites.includes(Number(product.id)) ? 'fill-red-500 text-red-500' : 'text-white'}`} />
              </Button>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div>
                  <span className="text-xl font-bold text-white">{product.price} ريال</span>
                  {product.originalPrice > product.price && (
                    <span className="text-gray-400 line-through text-sm mr-2">{product.originalPrice} ريال</span>
                  )}
                </div>
                <div className="flex items-center gap-1 text-yellow-400">
                  <Star className="h-4 w-4 fill-current" />
                  <span className="text-white text-sm">{product.rating}</span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  size="sm"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  disabled={!product.inStock}
                >
                  <ShoppingCart className="h-4 w-4 ml-2" />
                  {product.inStock ? 'أضف' : 'نفذ'}
                </Button>
                <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>جاري تحميل المنتجات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/mobile/dashboard')}
              className="p-2 bg-white/10 hover:bg-white/20"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">المنتجات</h1>
              <p className="text-gray-300">تصفح جميع منتجاتنا</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              onClick={() => setViewMode('grid')}
              className="p-2"
            >
              <Grid className="h-5 w-5" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              onClick={() => setViewMode('list')}
              className="p-2"
            >
              <List className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="ابحث عن منتج..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10 bg-white/5 border-white/20 text-white placeholder-gray-400"
                />
              </div>
              
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-48 bg-white/5 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full md:w-48 bg-white/5 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">الاسم</SelectItem>
                  <SelectItem value="price-low">السعر: منخفض</SelectItem>
                  <SelectItem value="price-high">السمر: مرتفع</SelectItem>
                  <SelectItem value="rating">التقييم</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-4 text-center">
              <Package className="h-6 w-6 mx-auto mb-2 text-purple-400" />
              <p className="text-2xl font-bold">{filteredProducts.length}</p>
              <p className="text-gray-300 text-sm">منتج</p>
            </CardContent>
          </Card>
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-4 text-center">
              <DollarSign className="h-6 w-6 mx-auto mb-2 text-green-400" />
              <p className="text-2xl font-bold">{filteredProducts.length > 0 ? Math.min(...filteredProducts.map(p => p.price)) : 0}</p>
              <p className="text-gray-300 text-sm">أقل سعر</p>
            </CardContent>
          </Card>
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-4 text-center">
              <Heart className="h-6 w-6 mx-auto mb-2 text-red-400" />
              <p className="text-2xl font-bold">{favorites.length}</p>
              <p className="text-gray-300 text-sm">مفضل</p>
            </CardContent>
          </Card>
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-4 text-center">
              <ShoppingCart className="h-6 w-6 mx-auto mb-2 text-blue-400" />
              <p className="text-2xl font-bold">0</p>
              <p className="text-gray-300 text-sm">بالسلة</p>
            </CardContent>
          </Card>
        </div>

        {/* Products */}
        {error ? (
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-12 text-center">
              <p className="text-red-400 text-lg mb-2">خطأ في تحميل المنتجات</p>
              <p className="text-gray-300">{error}</p>
            </CardContent>
          </Card>
        ) : filteredProducts.length === 0 ? (
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-12 text-center">
              <Search className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold text-white mb-2">لا توجد منتجات</h3>
              <p className="text-gray-300">جرب تغيير كلمات البحث أو الفلتر</p>
            </CardContent>
          </Card>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            {filteredProducts.map(product => 
              viewMode === 'grid' ? (
                <ProductCard key={product.id} product={product} />
              ) : (
                <ProductListItem key={product.id} product={product} />
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileProducts;
