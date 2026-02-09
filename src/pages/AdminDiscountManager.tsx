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
  Image as ImageIcon,
  Percent,
  Users,
  Clock,
  Copy,
  TrendingUp,
  Tag
} from 'lucide-react';
import { 
  DiscountCode, 
  getDiscountCodes, 
  addDiscountCode, 
  updateDiscountCode, 
  deleteDiscountCode
} from '@/firebase/discount';
import { useNavigate } from 'react-router-dom';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '@/firebase/database';

const AdminDiscountManager = () => {
  const navigate = useNavigate();
  const [discountCodes, setDiscountCodes] = useState<DiscountCode[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingCode, setEditingCode] = useState<DiscountCode | null>(null);
  const [copiedCode, setCopiedCode] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form states
  const [discountForm, setDiscountForm] = useState({
    code: '',
    description: '',
    discountType: 'percentage' as 'percentage' | 'fixed',
    discountValue: 0,
    minOrderValue: 0,
    maxUses: 0,
    usedCount: 0,
    isActive: true,
    expiresAt: '',
    applicableProducts: [] as string[]
  });

  // Set up real-time listener for discount codes
  useEffect(() => {
    loadDiscountCodes();
    
    // Set up real-time listener
    const unsubscribe = onSnapshot(collection(db, 'discountCodes'), (snapshot) => {
      console.log('Real-time update received in AdminDiscountManager');
      console.log('Snapshot docs count:', snapshot.docs.length);
      const updatedCodes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as DiscountCode));
      console.log('Updated codes with usage:', updatedCodes.map(c => ({ code: c.code, usedCount: c.usedCount })));
      setDiscountCodes(updatedCodes);
    });

    return () => unsubscribe();
  }, []);

  const loadDiscountCodes = async () => {
    setLoading(true);
    try {
      const result = await getDiscountCodes();
      if (result.success) {
        setDiscountCodes(result.codes);
      } else {
        setError(result.error || 'فشل تحميل الأكواد');
      }
    } catch (err) {
      setError('فشل تحميل الأكواد');
    }
    setLoading(false);
  };

  const generateRandomCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  const handleAddDiscountCode = async () => {
    if (!discountForm.code || !discountForm.discountValue || discountForm.discountValue <= 0) {
      setError('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    setLoading(true);
    const result = await addDiscountCode(discountForm);
    
    if (result.success) {
      setSuccess('تم إضافة كود الخصم بنجاح');
      setDiscountForm({
        code: '',
        description: '',
        discountType: 'percentage',
        discountValue: 0,
        minOrderValue: 0,
        maxUses: 0,
        usedCount: 0,
        isActive: true,
        expiresAt: '',
        applicableProducts: []
      });
      loadDiscountCodes();
    } else {
      setError(result.error || 'فشل إضافة كود الخصم');
    }
    
    setLoading(false);
  };

  const handleUpdateDiscountCode = async () => {
    if (!editingCode || !editingCode.id) return;

    setLoading(true);
    const result = await updateDiscountCode(editingCode.id, editingCode);
    
    if (result.success) {
      setSuccess('تم تحديث كود الخصم بنجاح');
      setEditingCode(null);
      loadDiscountCodes();
    } else {
      setError(result.error || 'فشل تحديث كود الخصم');
    }
    
    setLoading(false);
  };

  const handleDeleteDiscountCode = async (codeId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الكود؟')) return;

    setLoading(true);
    const result = await deleteDiscountCode(codeId);
    
    if (result.success) {
      setSuccess('تم حذف كود الخصم بنجاح');
      loadDiscountCodes();
    } else {
      setError(result.error || 'فشل حذف كود الخصم');
    }
    
    setLoading(false);
  };

  const startEditCode = (code: DiscountCode) => {
    setEditingCode({ ...code });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedCode(text);
      setTimeout(() => setCopiedCode(''), 2000);
    });
  };

  const filteredCodes = discountCodes.filter(code =>
    code.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    code.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getDiscountDisplay = (code: DiscountCode) => {
    if (code.discountType === 'percentage') {
      return `${code.discountValue}%`;
    } else {
      return `${code.discountValue} USD`;
    }
  };

  const getStatusBadge = (code: DiscountCode) => {
    if (!code.isActive) {
      return <Badge className="bg-gray-600 text-white">غير نشط</Badge>;
    }
    if (code.maxUses > 0 && code.usedCount >= code.maxUses) {
      return <Badge className="bg-red-600 text-white">مستهلك</Badge>;
    }
    if (code.expiresAt && new Date(code.expiresAt) < new Date()) {
      return <Badge className="bg-orange-600 text-white">منتهي</Badge>;
    }
    return <Badge className="bg-green-600 text-white">نشط</Badge>;
  };

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
              <h1 className="text-3xl font-bold">إدارة أكواد الخصم</h1>
              <p className="text-gray-300">إنشاء وتعديل أكواد الخصم للمنتجات</p>
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Add/Edit Discount Form */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                {editingCode ? <Edit className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                {editingCode ? 'تعديل كود الخصم' : 'إنشاء كود خصم جديد'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code">كود الخصم *</Label>
                <div className="flex gap-2">
                  <Input
                    id="code"
                    value={editingCode ? editingCode.code : discountForm.code}
                    onChange={(e) => editingCode 
                      ? setEditingCode({...editingCode, code: e.target.value.toUpperCase()})
                      : setDiscountForm({...discountForm, code: e.target.value.toUpperCase()})
                    }
                    className="bg-white/5 border-white/20 text-white uppercase"
                    placeholder="DISCOUNT20"
                    maxLength={10}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      const randomCode = generateRandomCode();
                      if (editingCode) {
                        setEditingCode({...editingCode, code: randomCode});
                      } else {
                        setDiscountForm({...discountForm, code: randomCode});
                      }
                    }}
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    <Percent className="h-4 w-4" />
                    عشوائي
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">الوصف</Label>
                <Textarea
                  id="description"
                  value={editingCode ? editingCode.description : discountForm.description}
                  onChange={(e) => editingCode 
                    ? setEditingCode({...editingCode, description: e.target.value})
                    : setDiscountForm({...discountForm, description: e.target.value})}
                  className="bg-white/5 border-white/20 text-white min-h-[80px]"
                  placeholder="وصف كود الخصم..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="discountType">نوع الخصم</Label>
                  <Select 
                    value={editingCode ? editingCode.discountType : discountForm.discountType}
                    onValueChange={(value: 'percentage' | 'fixed') => editingCode 
                      ? setEditingCode({...editingCode, discountType: value})
                      : setDiscountForm({...discountForm, discountType: value})}
                  >
                    <SelectTrigger className="bg-white/5 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">نسبة مئوية (%)</SelectItem>
                      <SelectItem value="fixed">قيمة ثابتة (دولار أمريكي)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="discountValue">قيمة الخصم *</Label>
                  <Input
                    id="discountValue"
                    type="number"
                    value={editingCode ? editingCode.discountValue : discountForm.discountValue}
                    onChange={(e) => editingCode 
                      ? setEditingCode({...editingCode, discountValue: Number(e.target.value)})
                      : setDiscountForm({...discountForm, discountValue: Number(e.target.value)})}
                    className="bg-white/5 border-white/20 text-white"
                    placeholder="10"
                    min="0"
                    max={editingCode?.discountType === 'percentage' ? 100 : undefined}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="minOrderValue">الحد الأدنى للطلب (دولار أمريكي)</Label>
                  <Input
                    id="minOrderValue"
                    type="number"
                    value={editingCode ? editingCode.minOrderValue : discountForm.minOrderValue}
                    onChange={(e) => editingCode 
                      ? setEditingCode({...editingCode, minOrderValue: Number(e.target.value)})
                      : setDiscountForm({...discountForm, minOrderValue: Number(e.target.value)})}
                    className="bg-white/5 border-white/20 text-white"
                    placeholder="0"
                    min="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxUses">عدد الاستخدامات</Label>
                  <Input
                    id="maxUses"
                    type="number"
                    value={editingCode ? editingCode.maxUses : discountForm.maxUses}
                    onChange={(e) => editingCode 
                      ? setEditingCode({...editingCode, maxUses: Number(e.target.value)})
                      : setDiscountForm({...discountForm, maxUses: Number(e.target.value)})}
                    className="bg-white/5 border-white/20 text-white"
                    placeholder="0 (غير محدود)"
                    min="0"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="expiresAt">تاريخ الانتهاء</Label>
                <Input
                  id="expiresAt"
                  type="datetime-local"
                  value={editingCode ? editingCode.expiresAt : discountForm.expiresAt}
                  onChange={(e) => editingCode 
                    ? setEditingCode({...editingCode, expiresAt: e.target.value})
                    : setDiscountForm({...discountForm, expiresAt: e.target.value})}
                  className="bg-white/5 border-white/20 text-white"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={editingCode ? editingCode.isActive : discountForm.isActive}
                  onChange={(e) => editingCode 
                    ? setEditingCode({...editingCode, isActive: e.target.checked})
                    : setDiscountForm({...discountForm, isActive: e.target.checked})}
                  className="rounded"
                />
                <Label htmlFor="isActive">كود نشط</Label>
              </div>

              <div className="flex gap-2">
                {editingCode ? (
                  <>
                    <Button 
                      onClick={handleUpdateDiscountCode}
                      disabled={loading}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      <Save className="h-4 w-4 ml-2" />
                      تحديث
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => setEditingCode(null)}
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <Button 
                    onClick={handleAddDiscountCode}
                    disabled={loading}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                  >
                    <Plus className="h-4 w-4 ml-2" />
                    إنشاء كود الخصم
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Discount Codes List */}
          <div className="lg:col-span-2">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>أكواد الخصم ({filteredCodes.length})</span>
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
                    {filteredCodes.map(code => (
                      <div key={code.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-bold text-lg text-white">{code.code}</h3>
                              {getStatusBadge(code)}
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => copyToClipboard(code.code)}
                                className="border-white/20 text-white hover:bg-white/10"
                              >
                                <Copy className="h-4 w-4" />
                              {copiedCode === code.code ? 'تم النسخ!' : 'نسخ'}
                              </Button>
                            </div>
                            <p className="text-gray-300 text-sm mb-2">{code.description}</p>
                            <div className="flex flex-wrap gap-2 mb-2">
                              <Badge variant="outline" className="border-white/20 text-white">
                                {code.discountType === 'percentage' ? 'نسبة مئوية' : 'قيمة ثابتة'}
                              </Badge>
                              <Badge variant="outline" className="border-white/20 text-white">
                                {getDiscountDisplay(code)}
                              </Badge>
                              {code.minOrderValue > 0 && (
                                <Badge variant="outline" className="border-white/20 text-white">
                                  الحد الأدنى: {code.minOrderValue} USD
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-300">
                              <div className="flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                <span>الاستخدام: {code.usedCount}</span>
                              </div>
                              {code.maxUses > 0 && (
                                <span>/ {code.maxUses}</span>
                              )}
                              {code.usedCount > 0 && (
                                <div className="flex items-center gap-1 text-green-400">
                                  <CheckCircle className="h-4 w-4" />
                                  <span>تم الاستخدام ({code.usedCount} مرة)</span>
                                </div>
                              )}
                              {code.maxUses > 0 && code.usedCount >= code.maxUses && (
                                <div className="flex items-center gap-1 text-red-400">
                                  <AlertCircle className="h-4 w-4" />
                                  <span>مستهلك بالكامل</span>
                                </div>
                              )}
                              {code.expiresAt && (
                                <div className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  <span>ينتهي: {new Date(code.expiresAt).toLocaleDateString('ar-SA')}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => startEditCode(code)}
                              className="border-white/20 text-white hover:bg-white-10"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => code.id && handleDeleteDiscountCode(code.id)}
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

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-300">إجمالي الأكواد</p>
                  <p className="text-2xl font-bold text-white">{discountCodes.length}</p>
                </div>
                <Tag className="h-8 w-8 text-blue-400" />
              </div>
            </div>
          </Card>
          
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-300">الأكواد النشطة</p>
                  <p className="text-2xl font-bold text-white">{discountCodes.filter(code => code.isActive).length}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-400" />
              </div>
            </div>
          </Card>
          
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-300">الأكواد المستخدمة</p>
                  <p className="text-2xl font-bold text-white">{discountCodes.filter(code => code.usedCount > 0).length}</p>
                </div>
                <Users className="h-8 w-8 text-yellow-400" />
              </div>
            </div>
          </Card>
          
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-300">إجمالي الاستخدامات</p>
                  <p className="text-2xl font-bold text-white">{discountCodes.reduce((sum, code) => sum + code.usedCount, 0)}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-400" />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDiscountManager;
