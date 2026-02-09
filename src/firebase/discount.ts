import { getFirestore, collection, doc, setDoc, getDoc, getDocs, updateDoc, deleteDoc, query, orderBy, where } from 'firebase/firestore';

export interface DiscountCode {
  id?: string;
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderValue: number;
  maxUses: number;
  usedCount: number;
  isActive: boolean;
  expiresAt: string;
  applicableProducts: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Discount Codes Management
export const addDiscountCode = async (discountCode: Omit<DiscountCode, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    const discountCodeRef = doc(collection(getFirestore(), 'discountCodes'));
    const newDiscountCode: DiscountCode = {
      ...discountCode,
      id: discountCodeRef.id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    await setDoc(discountCodeRef, newDiscountCode);
    return { success: true, code: newDiscountCode };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const updateDiscountCode = async (codeId: string, discountCode: Partial<DiscountCode>) => {
  try {
    const discountCodeRef = doc(getFirestore(), 'discountCodes', codeId);
    console.log('Updating discount code:', codeId);
    console.log('Update data:', discountCode);
    
    await updateDoc(discountCodeRef, {
      ...discountCode,
      updatedAt: new Date()
    });
    
    console.log('Discount code updated successfully');
    return { success: true };
  } catch (error: any) {
    console.error('Error updating discount code:', error);
    return { success: false, error: error.message };
  }
};

export const deleteDiscountCode = async (codeId: string) => {
  try {
    await deleteDoc(doc(getFirestore(), 'discountCodes', codeId));
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const getDiscountCodes = async () => {
  try {
    const codesQuery = query(collection(getFirestore(), 'discountCodes'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(codesQuery);
    const codes: DiscountCode[] = [];
    querySnapshot.forEach((doc) => {
      codes.push({ id: doc.id, ...doc.data() } as DiscountCode);
    });
    return { success: true, codes };
  } catch (error: any) {
    return { success: false, error: error.message, codes: [] };
  }
};

export const getDiscountCode = async (codeId: string) => {
  try {
    const codeDoc = await getDoc(doc(getFirestore(), 'discountCodes', codeId));
    if (codeDoc.exists()) {
      return { success: true, code: { id: codeDoc.id, ...codeDoc.data() } as DiscountCode };
    } else {
      return { success: false, error: 'كود الخصم غير موجود', code: null };
    }
  } catch (error: any) {
    return { success: false, error: error.message, code: null };
  }
};

export const validateDiscountCode = async (code: string) => {
  try {
    console.log('Looking for discount code:', code.toUpperCase());
    
    // First try to find by document ID (exact match)
    const codeDoc = await getDoc(doc(getFirestore(), 'discountCodes', code.toUpperCase()));
    
    if (codeDoc.exists()) {
      const discountData = codeDoc.data() as DiscountCode;
      console.log('Found discount data by ID:', discountData);
      
      // Check if code is active
      if (!discountData.isActive) {
        console.log('Discount code is not active');
        return { success: false, error: 'كود الخصم غير نشط', valid: false };
      }
      
      // Check if expired
      if (discountData.expiresAt && new Date(discountData.expiresAt) < new Date()) {
        console.log('Discount code is expired');
        return { success: false, error: 'كود الخصم منتهي', valid: false };
      }
      
      // Check if max uses reached
      if (discountData.maxUses > 0 && discountData.usedCount >= discountData.maxUses) {
        console.log('Discount code max uses reached');
        return { success: false, error: 'كود الخصم مستهلك', valid: false };
      }
      
      console.log('Discount code is valid');
      return { success: true, valid: true, code: discountData };
    }
    
    // If not found by ID, search by 'code' field
    console.log('Not found by ID, searching by code field...');
    const codesQuery = query(collection(getFirestore(), 'discountCodes'), where('code', '==', code.toUpperCase()));
    const querySnapshot = await getDocs(codesQuery);
    
    if (querySnapshot.empty) {
      console.log('Discount code not found in Firebase by code field either');
      
      // List all available codes for debugging
      const allCodesQuery = query(collection(getFirestore(), 'discountCodes'));
      const allSnapshot = await getDocs(allCodesQuery);
      console.log('Available codes in database:');
      allSnapshot.forEach(doc => {
        console.log(`- Document ID: ${doc.id}, Code: ${doc.data().code}`);
      });
      
      return { success: false, error: 'كود الخصم غير موجود', valid: false };
    }
    
    const discountData = querySnapshot.docs[0].data() as DiscountCode;
    console.log('Found discount data by code field:', discountData);
    
    // Check if code is active
    if (!discountData.isActive) {
      console.log('Discount code is not active');
      return { success: false, error: 'كود الخصم غير نشط', valid: false };
    }
    
    // Check if expired
    if (discountData.expiresAt && new Date(discountData.expiresAt) < new Date()) {
      console.log('Discount code is expired');
      return { success: false, error: 'كود الخصم منتهي', valid: false };
    }
    
    // Check if max uses reached
    if (discountData.maxUses > 0 && discountData.usedCount >= discountData.maxUses) {
      console.log('Discount code max uses reached');
      return { success: false, error: 'كود الخصم مستهلك', valid: false };
    }
    
    console.log('Discount code is valid');
    return { success: true, valid: true, code: discountData };
  } catch (error: any) {
    console.error('Error validating discount code:', error);
    return { success: false, error: error.message, valid: false };
  }
};

export const useDiscountCode = async (code: string) => {
  const result = await validateDiscountCode(code);
  if (result.success && result.valid && result.code) {
    try {
      console.log('Using discount code, updating count...');
      console.log('Current count:', result.code.usedCount);
      console.log('Document ID:', result.code.id);
      
      // Increment used count
      await updateDiscountCode(result.code.id!, {
        usedCount: result.code.usedCount + 1
      });
      
      console.log('Discount code used successfully');
      return result;
    } catch (error: any) {
      console.error('Error updating discount code usage:', error);
      return { success: false, error: `فشل تحديث استخدام الكود: ${error.message}`, valid: false };
    }
  }
  return result;
};
