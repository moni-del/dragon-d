import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword } from 'firebase/auth';

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
