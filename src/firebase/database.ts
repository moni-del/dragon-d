import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword, signInAnonymously } from 'firebase/auth';
import { getFirestore, collection, doc, setDoc, getDoc, getDocs, updateDoc, deleteDoc, query, orderBy, where } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAzDwv2rkGKmphqQhA6JKZ8UarrRYCa05o",
  authDomain: "dtdt-f871e.firebaseapp.com",
  projectId: "dtdt-f871e",
  storageBucket: "dtdt-f871e.firebasestorage.app",
  messagingSenderId: "948374726005",
  appId: "1:948374726005:android:b2674d3d7944ae7b69df3c"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Initialize anonymous auth for public access
export const initializeAnonymousAuth = async () => {
  try {
    if (!auth.currentUser) {
      const result = await signInAnonymously(auth);
      console.log('Anonymous auth initialized for secure access');
      console.log('User UID:', result.user.uid);
      console.log('Is anonymous:', result.user.isAnonymous);
      return result.user;
    } else {
      console.log('User already authenticated:', auth.currentUser.uid);
      return auth.currentUser;
    }
  } catch (error) {
    console.error('Error initializing anonymous auth:', error);
    throw error;
  }
};

// Types
export interface Product {
  id?: string;
  name: string;
  nameAr?: string;
  description: string;
  descriptionAr?: string;
  category: string;
  categoryAr?: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating?: number;
  reviews?: number;
  image: string;
  inStock?: boolean;
  rarity?: string;
  gradient?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Category {
  id?: string;
  name: string;
  description?: string;
  image?: string;
  icon?: string;
  order?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// Admin authentication
export const signInAdmin = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const logoutAdmin = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Mobile user authentication
export const signInMobileUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error: any) {
    let errorMessage = 'فشل تسجيل الدخول';
    
    switch (error.code) {
      case 'auth/user-not-found':
        errorMessage = 'المستخدم غير موجود';
        break;
      case 'auth/wrong-password':
        errorMessage = 'كلمة المرور غير صحيحة';
        break;
      case 'auth/invalid-email':
        errorMessage = 'البريد الإلكتروني غير صالح';
        break;
      case 'auth/user-disabled':
        errorMessage = 'حساب المستخدم معطل';
        break;
      case 'auth/too-many-requests':
        errorMessage = 'محاولات كثيرة، يرجى المحاولة لاحقاً';
        break;
      default:
        errorMessage = error.message || 'فشل تسجيل الدخول';
    }
    
    return { success: false, error: errorMessage };
  }
};

export const signUpMobileUser = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error: any) {
    let errorMessage = 'فشل إنشاء الحساب';
    
    switch (error.code) {
      case 'auth/email-already-in-use':
        errorMessage = 'البريد الإلكتروني مستخدم بالفعل';
        break;
      case 'auth/weak-password':
        errorMessage = 'كلمة المرور ضعيفة جداً';
        break;
      case 'auth/invalid-email':
        errorMessage = 'البريد الإلكتروني غير صالح';
        break;
      default:
        errorMessage = error.message || 'فشل إنشاء الحساب';
    }
    
    return { success: false, error: errorMessage };
  }
};

export const logoutMobileUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Products Management
export const addProduct = async (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    const productRef = doc(collection(db, 'products'));
    const newProduct: Product = {
      ...product,
      id: productRef.id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    await setDoc(productRef, newProduct);
    return { success: true, product: newProduct };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const updateProduct = async (productId: string, product: Partial<Product>) => {
  try {
    const productRef = doc(db, 'products', productId);
    await updateDoc(productRef, {
      ...product,
      updatedAt: new Date()
    });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const deleteProduct = async (productId: string) => {
  try {
    await deleteDoc(doc(db, 'products', productId));
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const getProducts = async () => {
  try {
    const productsQuery = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(productsQuery);
    const products: Product[] = [];
    querySnapshot.forEach((doc) => {
      products.push({ id: doc.id, ...doc.data() } as Product);
    });
    return { success: true, products };
  } catch (error: any) {
    return { success: false, error: error.message, products: [] };
  }
};

export const getProduct = async (productId: string) => {
  try {
    const productDoc = await getDoc(doc(db, 'products', productId));
    if (productDoc.exists()) {
      return { success: true, product: { id: productDoc.id, ...productDoc.data() } as Product };
    } else {
      return { success: false, error: 'المنتج غير موجود', product: null };
    }
  } catch (error: any) {
    return { success: false, error: error.message, product: null };
  }
};

export const getProductsByCategory = async (category: string) => {
  try {
    const productsQuery = query(
      collection(db, 'products'), 
      where('category', '==', category),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(productsQuery);
    const products: Product[] = [];
    querySnapshot.forEach((doc) => {
      products.push({ id: doc.id, ...doc.data() } as Product);
    });
    return { success: true, products };
  } catch (error: any) {
    return { success: false, error: error.message, products: [] };
  }
};

// Categories Management
export const addCategory = async (category: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    const categoryRef = doc(collection(db, 'categories'));
    const newCategory: Category = {
      ...category,
      id: categoryRef.id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    await setDoc(categoryRef, newCategory);
    return { success: true, category: newCategory };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const updateCategory = async (categoryId: string, category: Partial<Category>) => {
  try {
    const categoryRef = doc(db, 'categories', categoryId);
    await updateDoc(categoryRef, {
      ...category,
      updatedAt: new Date()
    });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const deleteCategory = async (categoryId: string) => {
  try {
    await deleteDoc(doc(db, 'categories', categoryId));
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const getCategories = async () => {
  try {
    const categoriesQuery = query(collection(db, 'categories'), orderBy('order', 'asc'));
    const querySnapshot = await getDocs(categoriesQuery);
    const categories: Category[] = [];
    querySnapshot.forEach((doc) => {
      categories.push({ id: doc.id, ...doc.data() } as Category);
    });
    return { success: true, categories };
  } catch (error: any) {
    return { success: false, error: error.message, categories: [] };
  }
};

// Search and Filter
export const searchProducts = async (searchTerm: string) => {
  try {
    const productsQuery = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(productsQuery);
    const products: Product[] = [];
    querySnapshot.forEach((doc) => {
      const product = { id: doc.id, ...doc.data() } as Product;
      if (product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase())) {
        products.push(product);
      }
    });
    return { success: true, products };
  } catch (error: any) {
    return { success: false, error: error.message, products: [] };
  }
};
