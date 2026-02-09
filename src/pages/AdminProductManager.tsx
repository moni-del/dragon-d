import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/card';
import { Button } from '@/ui/button';
import { Badge } from '@/ui/badge';
import { Input } from '@/ui/input';
import { Label } from '@/ui/label';
import { Textarea } from '@/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/select';
import { Alert, AlertDescription } from '@/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/tabs';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Search, 
  Package, 
  DollarSign, 
  Star,
  ArrowLeft,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  Upload,
  Image as ImageIcon
} from 'lucide-react';
import { 
  Product, 
  Category, 
  getProducts, 
  addProduct, 
  updateProduct, 
  deleteProduct,
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory
} from '@/firebase/database';
import { useNavigate } from 'react-router-dom';

const AdminProductManager = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('products');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string>('');
  const [uploadedCategoryImage, setUploadedCategoryImage] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const categoryFileInputRef = useRef<HTMLInputElement>(null);

  // Form states
  const [productForm, setProductForm] = useState({
    name: '',
    nameAr: '',
    description: '',
    descriptionAr: '',
    category: '',
    categoryAr: '',
    price: 0,
    originalPrice: 0,
    discount: 0,
    rating: 0,
    reviews: 0,
    image: '',
    inStock: true,
    rarity: 'common',
    gradient: ''
  });

  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: '',
    image: '',
    icon: '',
    order: 0
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const productsResult = await getProducts();
      const categoriesResult = await getCategories();
      
      if (productsResult.success) {
        setProducts(productsResult.products);
      }
      
      if (categoriesResult.success) {
        setCategories(categoriesResult.categories);
      }
    } catch (err) {
      setError('فشل تحميل البيانات');
    }
    setLoading(false);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file type
      if (!file.type.startsWith('image/')) {
        setError('يرجى اختيار ملف صورة صالح');
        return;
      }

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('حجم الصورة يجب أن يكون أقل من 5 ميجابايت');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setUploadedImage(result);
        if (editingProduct) {
          setEditingProduct({...editingProduct, image: result});
        } else {
          setProductForm({...productForm, image: result});
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCategoryImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file type
      if (!file.type.startsWith('image/')) {
        setError('يرجى اختيار ملف صورة صالح');
        return;
      }

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('حجم الصورة يجب أن يكون أقل من 5 ميجابايت');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setUploadedCategoryImage(result);
        if (editingCategory) {
          setEditingCategory({...editingCategory, image: result});
        } else {
          setCategoryForm({...categoryForm, image: result});
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddProduct = async () => {
    // Validation checks
    if (!productForm.name.trim()) {
      setError('نسيت إدخال اسم المنتج!');
      return;
    }

    if (!productForm.category) {
      setError('يرجى اختيار قسم للمنتج');
      return;
    }

    if (productForm.price <= 0) {
      setError('يرجى إدخال سعر صحيح للمنتج');
      return;
    }

    if (!productForm.image) {
      setError('يرجى إضافة صورة للمنتج');
      return;
    }

    // Prepare product data with optional originalPrice
    const productData = {
      ...productForm,
      name: productForm.name.trim(),
      originalPrice: productForm.originalPrice && productForm.originalPrice > 0 
        ? productForm.originalPrice 
        : null // Use null instead of undefined for Firebase
    };

    setLoading(true);
    const result = await addProduct(productData);
    
    if (result.success) {
      setSuccess('تم إضافة المنتج بنجاح');
      setProductForm({
        name: '',
        nameAr: '',
        description: '',
        descriptionAr: '',
        category: '',
        categoryAr: '',
        price: 0,
        originalPrice: 0,
        discount: 0,
        rating: 0,
        reviews: 0,
        image: '',
        inStock: true,
        rarity: 'common',
        gradient: ''
      });
      setUploadedImage('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setTimeout(() => {
        setError('');
        setSuccess('');
      }, 3000);
    } else {
      setError(result.error || 'فشل إضافة المنتج');
    }
    
    setLoading(false);
  };

  const handleUpdateProduct = async () => {
    if (!editingProduct || !editingProduct.id) return;

    // Validation checks
    if (!editingProduct.name.trim()) {
      setError('نسيت إدخال اسم المنتج!');
      return;
    }

    if (!editingProduct.category) {
      setError('يرجى اختيار قسم للمنتج');
      return;
    }

    if (editingProduct.price <= 0) {
      setError('يرجى إدخال سعر صحيح للمنتج');
      return;
    }

    // Prepare product data with optional originalPrice
    const productData = {
      ...editingProduct,
      name: editingProduct.name.trim(),
      originalPrice: editingProduct.originalPrice && editingProduct.originalPrice > 0 
        ? editingProduct.originalPrice 
        : null // Use null instead of undefined for Firebase
    };

    setLoading(true);
    const result = await updateProduct(editingProduct.id, productData);
    
    if (result.success) {
      setSuccess('تم تحديث المنتج بنجاح');
      setEditingProduct(null);
      setUploadedImage('');
      loadData();
    } else {
      setError(result.error || 'فشل تحديث المنتج');
    }
    
    setLoading(false);
    setTimeout(() => {
      setError('');
      setSuccess('');
    }, 3000);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا المنتج؟')) return;

    setLoading(true);
    const result = await deleteProduct(productId);
    
    if (result.success) {
      setSuccess('تم حذف المنتج بنجاح');
      loadData();
    } else {
      setError(result.error || 'فشل حذف المنتج');
    }
    
    setLoading(false);
  };

  const handleAddCategory = async () => {
    if (!categoryForm.name) {
      setError('يرجى إدخال اسم القسم');
      return;
    }

    setLoading(true);
    const result = await addCategory(categoryForm);
    
    if (result.success) {
      setSuccess('تم إضافة القسم بنجاح');
      setCategoryForm({
        name: '',
        description: '',
        image: '',
        icon: '',
        order: 0
      });
      setUploadedCategoryImage('');
      if (categoryFileInputRef.current) {
        categoryFileInputRef.current.value = '';
      }
      loadData();
    } else {
      setError(result.error || 'فشل إضافة القسم');
    }
    
    setLoading(false);
  };

  const handleUpdateCategory = async () => {
    if (!editingCategory || !editingCategory.id) return;

    setLoading(true);
    const result = await updateCategory(editingCategory.id, editingCategory);
    
    if (result.success) {
      setSuccess('تم تحديث القسم بنجاح');
      setEditingCategory(null);
      setUploadedCategoryImage('');
      loadData();
    } else {
      setError(result.error || 'فشل تحديث القسم');
    }
    
    setLoading(false);
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا القسم؟')) return;

    setLoading(true);
    const result = await deleteCategory(categoryId);
    
    if (result.success) {
      setSuccess('تم حذف القسم بنجاح');
      loadData();
    } else {
      setError(result.error || 'فشل حذف القسم');
    }
    
    setLoading(false);
  };

  const startEditProduct = (product: Product) => {
    setEditingProduct({ ...product });
    setUploadedImage(product.image || '');
  };

  const startEditCategory = (category: Category) => {
    setEditingCategory({ ...category });
    setUploadedCategoryImage(category.image || '');
  };

  const cancelEdit = () => {
    setEditingProduct(null);
    setEditingCategory(null);
    setUploadedImage('');
    setUploadedCategoryImage('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (categoryFileInputRef.current) {
      categoryFileInputRef.current.value = '';
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentImage = editingProduct ? editingProduct.image : uploadedImage || productForm.image;
  const currentCategoryImage = editingCategory ? editingCategory.image : uploadedCategoryImage || categoryForm.image;

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
              <h1 className="text-3xl font-bold">إدارة المنتجات</h1>
              <p className="text-gray-300">إضافة وتعديل وحذف المنتجات والأقسام</p>
            </div>
          </div>
          
          <Badge className="bg-purple-600 text-white px-4 py-2">
            MONAF المطور
          </Badge>
        </div>

        {/* Alerts */}
        {error && (
          <Alert className="bg-red-500/20 border-red-500/50 text-red-200 mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {success && (
          <Alert className="bg-green-500/20 border-green-500/50 text-green-200 mb-4">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-white/10 border-white/20">
            <TabsTrigger value="products" className="data-[state=active]:bg-purple-600">
              <Package className="h-4 w-4 ml-2" />
              المنتجات
            </TabsTrigger>
            <TabsTrigger value="categories" className="data-[state=active]:bg-purple-600">
              <Plus className="h-4 w-4 ml-2" />
              الأقسام
            </TabsTrigger>
          </TabsList>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Add/Edit Product Form */}
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    {editingProduct ? <Edit className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                    {editingProduct ? 'تعديل منتج' : 'إضافة منتج جديد'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">اسم المنتج *</Label>
                    <Input
                      id="name"
                      value={editingProduct ? editingProduct.name : productForm.name}
                      onChange={(e) => editingProduct 
                        ? setEditingProduct({...editingProduct, name: e.target.value})
                        : setProductForm({...productForm, name: e.target.value})
                      }
                      className="bg-white/5 border-white/20 text-white"
                      placeholder="اسم المنتج"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nameAr">الاسم بالعربي</Label>
                    <Input
                      id="nameAr"
                      value={editingProduct ? (editingProduct as any).nameAr : productForm.nameAr}
                      onChange={(e) => editingProduct 
                        ? setEditingProduct({...editingProduct, nameAr: e.target.value})
                        : setProductForm({...productForm, nameAr: e.target.value})
                      }
                      className="bg-white/5 border-white/20 text-white"
                      placeholder="الاسم بالعربي"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">القسم *</Label>
                    <Select 
                      value={editingProduct ? editingProduct.category : productForm.category}
                      onValueChange={(value) => editingProduct 
                        ? setEditingProduct({...editingProduct, category: value})
                        : setProductForm({...productForm, category: value})
                      }
                    >
                      <SelectTrigger className="bg-white/5 border-white/20 text-white">
                        <SelectValue placeholder="اختر القسم" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category.id} value={category.name}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price">السعر * (دولار أمريكي)</Label>
                      <Input
                        id="price"
                        type="number"
                        value={editingProduct ? editingProduct.price : productForm.price}
                        onChange={(e) => editingProduct 
                          ? setEditingProduct({...editingProduct, price: Number(e.target.value)})
                          : setProductForm({...productForm, price: Number(e.target.value)})
                        }
                        className="bg-white/5 border-white/20 text-white"
                        placeholder="0"
                        min="0"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="originalPrice">السعر الأصلي (اختياري - دولار أمريكي)</Label>
                      <Input
                        id="originalPrice"
                        type="number"
                        value={editingProduct ? (editingProduct.originalPrice > 0 ? editingProduct.originalPrice : '') : (productForm.originalPrice > 0 ? productForm.originalPrice : '')}
                        onChange={(e) => editingProduct 
                          ? setEditingProduct({...editingProduct, originalPrice: Number(e.target.value)})
                          : setProductForm({...productForm, originalPrice: Number(e.target.value)})
                        }
                        className="bg-white/5 border-white/20 text-white"
                        placeholder="اتركه فارغاً إذا لم يكن هناك سعر أصلي"
                        min="0"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="discount">الخصم (%)</Label>
                    <Input
                      id="discount"
                      type="number"
                      value={editingProduct ? editingProduct.discount : productForm.discount}
                      onChange={(e) => editingProduct 
                        ? setEditingProduct({...editingProduct, discount: Number(e.target.value)})
                        : setProductForm({...productForm, discount: Number(e.target.value)})
                      }
                      className="bg-white/5 border-white/20 text-white"
                      placeholder="0"
                      min="0"
                      max="100"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">الوصف</Label>
                    <Textarea
                      id="description"
                      value={editingProduct ? editingProduct.description : productForm.description}
                      onChange={(e) => editingProduct 
                        ? setEditingProduct({...editingProduct, description: e.target.value})
                        : setProductForm({...productForm, description: e.target.value})
                      }
                      className="bg-white/5 border-white/20 text-white min-h-[100px]"
                      placeholder="وصف المنتج..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="descriptionAr">الوصف بالعربي</Label>
                    <Textarea
                      id="descriptionAr"
                      value={editingProduct ? (editingProduct as any).descriptionAr : productForm.descriptionAr}
                      onChange={(e) => editingProduct 
                        ? setEditingProduct({...editingProduct, descriptionAr: e.target.value})
                        : setProductForm({...productForm, descriptionAr: e.target.value})
                      }
                      className="bg-white/5 border-white/20 text-white min-h-[100px]"
                      placeholder="الوصف بالعربي..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="image">صورة المنتج *</Label>
                    <div className="space-y-3">
                      <div className="relative">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="image-upload"
                        />
                        <Button
                          type="button"
                          onClick={() => document.getElementById('image-upload')?.click()}
                          className="w-full bg-white/10 hover:bg-white/20 border border-white/20"
                        >
                          <Upload className="h-4 w-4 ml-2" />
                          اختر صورة من الجهاز
                        </Button>
                      </div>
                      
                      {currentImage && (
                        <div className="relative">
                          <img 
                            src={currentImage} 
                            alt="Product preview" 
                            className="w-full h-48 object-cover rounded-lg border border-white/20"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setUploadedImage('');
                              if (editingProduct) {
                                setEditingProduct({...editingProduct, image: ''});
                              } else {
                                setProductForm({...productForm, image: ''});
                              }
                            }}
                            className="absolute top-2 right-2 p-1 bg-red-600 hover:bg-red-700 rounded-full"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="rating">التقييم</Label>
                      <Input
                        id="rating"
                        type="number"
                        step="0.1"
                        min="0"
                        max="5"
                        value={editingProduct ? editingProduct.rating : productForm.rating}
                        onChange={(e) => editingProduct 
                          ? setEditingProduct({...editingProduct, rating: Number(e.target.value)})
                          : setProductForm({...productForm, rating: Number(e.target.value)})
                      }
                        className="bg-white/5 border-white/20 text-white"
                        placeholder="0"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reviews">عدد المراجعات</Label>
                      <Input
                        id="reviews"
                        type="number"
                        min="0"
                        value={editingProduct ? editingProduct.reviews : productForm.reviews}
                        onChange={(e) => editingProduct 
                          ? setEditingProduct({...editingProduct, reviews: Number(e.target.value)})
                          : setProductForm({...productForm, reviews: Number(e.target.value)})
                      }
                        className="bg-white/5 border-white/20 text-white"
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="inStock"
                      checked={editingProduct ? editingProduct.inStock : productForm.inStock}
                      onChange={(e) => editingProduct 
                        ? setEditingProduct({...editingProduct, inStock: e.target.checked})
                        : setProductForm({...productForm, inStock: e.target.checked})
                      }
                      className="rounded"
                    />
                    <Label htmlFor="inStock">متوفر في المخزون</Label>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rarity">الندرة</Label>
                    <Select 
                      value={editingProduct ? (editingProduct as any).rarity || 'common' : productForm.rarity}
                      onValueChange={(value) => editingProduct 
                        ? setEditingProduct({...editingProduct, rarity: value})
                        : setProductForm({...productForm, rarity: value})
                      }
                    >
                      <SelectTrigger className="bg-white/5 border-white/20 text-white">
                        <SelectValue placeholder="اختر الندرة" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="common">عادي</SelectItem>
                        <SelectItem value="epic">متوسط</SelectItem>
                        <SelectItem value="rare">نادر</SelectItem>
                        <SelectItem value="legendary">أسطوري</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gradient">التدرج اللوني (اختياري)</Label>
                    <Input
                      id="gradient"
                      value={editingProduct ? (editingProduct as any).gradient : productForm.gradient}
                      onChange={(e) => editingProduct 
                        ? setEditingProduct({...editingProduct, gradient: e.target.value})
                        : setProductForm({...productForm, gradient: e.target.value})
                      }
                      className="bg-white/5 border-white/20 text-white"
                      placeholder="مثال: from-blue-400 via-purple-500 to-pink-600"
                    />
                  </div>

                  <div className="flex gap-2">
                    {editingProduct ? (
                      <>
                        <Button 
                          onClick={handleUpdateProduct}
                          disabled={loading}
                          className="flex-1 bg-green-600 hover:bg-green-700"
                        >
                          <Save className="h-4 w-4 ml-2" />
                          تحديث
                        </Button>
                        <Button 
                          variant="outline"
                          onClick={cancelEdit}
                          className="border-white/20 text-white hover:bg-white/10"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <Button 
                        onClick={handleAddProduct}
                        disabled={loading}
                        className="w-full bg-purple-600 hover:bg-purple-700"
                      >
                        <Plus className="h-4 w-4 ml-2" />
                        إضافة منتج
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Products List */}
              <div className="lg:col-span-2">
                <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>المنتجات ({filteredProducts.length})</span>
                      <div className="relative">
                        <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="بحث..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pr-10 bg-white/5 border-white/20 text-white w-64"
                        />
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
                        <p className="mt-2 text-gray-300">جاري التحميل...</p>
                      </div>
                    ) : (
                      <div className="space-y-4 max-h-96 overflow-y-auto">
                        {filteredProducts.map(product => (
                          <div key={product.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex gap-4">
                                {product.image ? (
                                  <img 
                                    src={product.image} 
                                    alt={product.name}
                                    className="w-16 h-16 object-cover rounded-lg"
                                  />
                                ) : (
                                  <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                                    <ImageIcon className="h-6 w-6 text-white" />
                                  </div>
                                )}
                                <div>
                                  <h3 className="font-semibold text-white">{product.name}</h3>
                                  <p className="text-gray-300 text-sm line-clamp-2">{product.description}</p>
                                  <div className="flex items-center gap-2 mt-2">
                                    <Badge variant="outline" className="border-white/20 text-white">
                                      {product.category}
                                    </Badge>
                                    <span className="text-green-400 font-bold">{product.price} دولار</span>
                                    {product.discount > 0 && (
                                      <Badge className="bg-red-600 text-white">-{product.discount}%</Badge>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => startEditProduct(product)}
                                  className="border-white/20 text-white hover:bg-white/10"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => product.id && handleDeleteProduct(product.id)}
                                  className="border-red-500/50 text-red-400 hover:bg-red-500/20"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Categories Tab */}
          <TabsContent value="categories" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Add/Edit Category Form */}
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    {editingCategory ? <Edit className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                    {editingCategory ? 'تعديل قسم' : 'إضافة قسم جديد'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="categoryName">اسم القسم</Label>
                    <Input
                      id="categoryName"
                      value={editingCategory ? editingCategory.name : categoryForm.name}
                      onChange={(e) => editingCategory 
                        ? setEditingCategory({...editingCategory, name: e.target.value})
                        : setCategoryForm({...categoryForm, name: e.target.value})
                      }
                      className="bg-white/5 border-white/20 text-white"
                      placeholder="اسم القسم"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="categoryIcon">الأيقونة (اختياري)</Label>
                    <Input
                      id="categoryIcon"
                      value={editingCategory ? (editingCategory as any).icon : categoryForm.icon}
                      onChange={(e) => editingCategory 
                        ? setEditingCategory({...editingCategory, icon: e.target.value})
                        : setCategoryForm({...categoryForm, icon: e.target.value})
                      }
                      className="bg-white/5 border-white/20 text-white"
                      placeholder="مثال: 🚗 أو 🎮"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="categoryOrder">الترتيب</Label>
                    <Input
                      id="categoryOrder"
                      type="number"
                      value={editingCategory ? (editingCategory as any).order || 0 : categoryForm.order}
                      onChange={(e) => editingCategory 
                        ? setEditingCategory({...editingCategory, order: Number(e.target.value)})
                        : setCategoryForm({...categoryForm, order: Number(e.target.value)})}
                      className="bg-white/5 border-white/20 text-white"
                      placeholder="0"
                      min="0"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="categoryDescription">الوصف (اختياري)</Label>
                    <Textarea
                      id="categoryDescription"
                      value={editingCategory ? editingCategory.description : categoryForm.description}
                      onChange={(e) => editingCategory 
                        ? setEditingCategory({...editingCategory, description: e.target.value})
                        : setCategoryForm({...categoryForm, description: e.target.value})}
                      className="bg-white/5 border-white/20 text-white min-h-[80px]"
                      placeholder="وصف القسم..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="categoryImage">صورة القسم (اختياري)</Label>
                    <div className="space-y-3">
                      <div className="relative">
                        <input
                          ref={categoryFileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleCategoryImageUpload}
                          className="hidden"
                          id="category-image-upload"
                        />
                        <Button
                          type="button"
                          onClick={() => document.getElementById('category-image-upload')?.click()}
                          className="w-full bg-white/10 hover:bg-white/20 border border-white/20"
                        >
                          <Upload className="h-4 w-4 ml-2" />
                          اختر صورة من الجهاز
                        </Button>
                      </div>
                      
                      {currentCategoryImage && (
                        <div className="relative">
                          <img 
                            src={currentCategoryImage} 
                            alt="Category preview" 
                            className="w-full h-32 object-cover rounded-lg border border-white/20"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setUploadedCategoryImage('');
                              if (editingCategory) {
                                setEditingCategory({...editingCategory, image: ''});
                              } else {
                                setCategoryForm({...categoryForm, image: ''});
                              }
                            }}
                            className="absolute top-2 right-2 p-1 bg-red-600 hover:bg-red-700 rounded-full"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {editingCategory ? (
                      <>
                        <Button 
                          onClick={handleUpdateCategory}
                          disabled={loading}
                          className="flex-1 bg-green-600 hover:bg-green-700"
                        >
                          <Save className="h-4 w-4 ml-2" />
                          تحديث
                        </Button>
                        <Button 
                          variant="outline"
                          onClick={() => setEditingCategory(null)}
                          className="border-white/20 text-white hover:bg-white/10"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <Button 
                        onClick={handleAddCategory}
                        disabled={loading}
                        className="w-full bg-purple-600 hover:bg-purple-700"
                      >
                        <Plus className="h-4 w-4 ml-2" />
                        إضافة قسم
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Categories List */}
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle>الأقسام ({categories.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {categories.map(category => (
                      <div key={category.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                        <div className="flex justify-between items-start">
                          <div className="flex gap-4">
                            {category.image ? (
                              <img 
                                src={category.image} 
                                alt={category.name}
                                className="w-16 h-16 object-cover rounded-lg"
                              />
                            ) : (
                              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                                <ImageIcon className="h-6 w-6 text-white" />
                              </div>
                            )}
                            <div>
                              <h3 className="font-semibold text-white">{category.name}</h3>
                              <p className="text-gray-300 text-sm line-clamp-2">{category.description}</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => startEditCategory(category)}
                              className="border-white/20 text-white hover:bg-white/10"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => category.id && handleDeleteCategory(category.id)}
                              className="border-red-500/50 text-red-400 hover:bg-red-500/20"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminProductManager;
