import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  Timestamp,
  where,
  doc,
  updateDoc,
  deleteDoc,
  setDoc
} from 'firebase/firestore';
import {
  getStorage
} from 'firebase/storage';
import type { BookingData, Deal, Invitation, ImageAsset, PageSettings } from '../types';

// ⭐ הדבק כאן את הקונפיג מ-Firebase Console
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// אתחול Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// שמירת הזמנה חדשה
export const saveBooking = async (bookingData: Omit<BookingData, 'id'>) => {
  try {
    const docRef = await addDoc(collection(db, 'bookings'), {
      ...bookingData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    
    console.log('✅ Booking saved with ID:', docRef.id);
    return { id: docRef.id, ...bookingData };
  } catch (error) {
    console.error('❌ Error saving booking:', error);
    throw error;
  }
};

// עדכון הזמנה
export const updateBooking = async (id: string, updates: Partial<BookingData>) => {
  try {
    const docRef = doc(db, 'bookings', id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    });
    console.log('✅ Booking updated:', id);
  } catch (error) {
    console.error('❌ Error updating booking:', error);
    throw error;
  }
};

// קבלת כל ההזמנות
export const getAllBookings = async (): Promise<BookingData[]> => {
  try {
    const q = query(
      collection(db, 'bookings'),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const bookings: BookingData[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      bookings.push({
        id: doc.id,
        fullName: data.fullName,
        idNumber: data.idNumber,
        phone: data.phone,
        email: data.email,
        checkIn: data.checkIn,
        checkOut: data.checkOut,
        adults: data.adults,
        children: data.children,
        totalPrice: data.totalPrice,
        deposit: data.deposit,
        balance: data.balance,
        status: data.status,
        createdAt: data.createdAt?.toDate().toISOString() || new Date().toISOString(),
      });
    });
    
    console.log('✅ Loaded', bookings.length, 'bookings');
    return bookings;
  } catch (error) {
    console.error('❌ Error loading bookings:', error);
    throw error;
  }
};

// ============ DEALS OPERATIONS ============

// קבלת כל המבצעים הפעילים
export const getActiveDeals = async (): Promise<Deal[]> => {
  try {
    const q = query(
      collection(db, 'deals'),
      where('isActive', '==', true),
      orderBy('displayOrder', 'asc')
    );
    const querySnapshot = await getDocs(q);
    const deals: Deal[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      deals.push({
        id: doc.id,
        title: data.title,
        description: data.description,
        originalPrice: data.originalPrice,
        salePrice: data.salePrice,
        discount: data.discount,
        badge: data.badge,
        gradient: data.gradient,
        iconName: data.iconName,
        features: data.features,
        isActive: data.isActive,
        displayOrder: data.displayOrder,
        createdAt: data.createdAt?.toDate().toISOString() || new Date().toISOString(),
        updatedAt: data.updatedAt?.toDate().toISOString() || new Date().toISOString(),
      });
    });

    console.log('✅ Loaded', deals.length, 'active deals');
    return deals;
  } catch (error) {
    console.error('❌ Error loading active deals:', error);
    throw error;
  }
};

// קבלת כל המבצעים (כולל לא פעילים)
export const getAllDeals = async (): Promise<Deal[]> => {
  try {
    const q = query(collection(db, 'deals'), orderBy('displayOrder', 'asc'));
    const querySnapshot = await getDocs(q);
    const deals: Deal[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      deals.push({
        id: doc.id,
        title: data.title,
        description: data.description,
        originalPrice: data.originalPrice,
        salePrice: data.salePrice,
        discount: data.discount,
        badge: data.badge,
        gradient: data.gradient,
        iconName: data.iconName,
        features: data.features,
        isActive: data.isActive,
        displayOrder: data.displayOrder,
        createdAt: data.createdAt?.toDate().toISOString() || new Date().toISOString(),
        updatedAt: data.updatedAt?.toDate().toISOString() || new Date().toISOString(),
      });
    });

    console.log('✅ Loaded', deals.length, 'deals');
    return deals;
  } catch (error) {
    console.error('❌ Error loading deals:', error);
    throw error;
  }
};

// שמירת מבצע חדש
export const saveDeal = async (deal: Omit<Deal, 'id'>) => {
  try {
    const docRef = await addDoc(collection(db, 'deals'), {
      ...deal,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    console.log('✅ Deal saved:', docRef.id);
    return { id: docRef.id, ...deal };
  } catch (error) {
    console.error('❌ Error saving deal:', error);
    throw error;
  }
};

// עדכון מבצע
export const updateDeal = async (id: string, deal: Partial<Deal>) => {
  try {
    const docRef = doc(db, 'deals', id);
    await updateDoc(docRef, { ...deal, updatedAt: Timestamp.now() });
    console.log('✅ Deal updated:', id);
  } catch (error) {
    console.error('❌ Error updating deal:', error);
    throw error;
  }
};

// מחיקת מבצע
export const deleteDeal = async (id: string) => {
  try {
    await deleteDoc(doc(db, 'deals', id));
    console.log('✅ Deal deleted:', id);
  } catch (error) {
    console.error('❌ Error deleting deal:', error);
    throw error;
  }
};

// ============ INVITATIONS OPERATIONS ============

// קבלת כל ההזמנות/אירועים
export const getAllInvitations = async (): Promise<Invitation[]> => {
  try {
    const q = query(collection(db, 'invitations'), orderBy('eventDate', 'asc'));
    const querySnapshot = await getDocs(q);
    const invitations: Invitation[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      invitations.push({
        id: doc.id,
        guestName: data.guestName,
        eventType: data.eventType,
        eventDate: data.eventDate,
        startTime: data.startTime,
        endTime: data.endTime,
        numberOfGuests: data.numberOfGuests,
        phoneNumber: data.phoneNumber,
        email: data.email,
        specialRequests: data.specialRequests,
        status: data.status,
        color: data.color,
        createdAt: data.createdAt?.toDate().toISOString() || new Date().toISOString(),
        updatedAt: data.updatedAt?.toDate().toISOString() || new Date().toISOString(),
      });
    });

    console.log('✅ Loaded', invitations.length, 'invitations');
    return invitations;
  } catch (error) {
    console.error('❌ Error loading invitations:', error);
    throw error;
  }
};

// שמירת הזמנה חדשה
export const saveInvitation = async (invitation: Omit<Invitation, 'id'>) => {
  try {
    const docRef = await addDoc(collection(db, 'invitations'), {
      ...invitation,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    console.log('✅ Invitation saved:', docRef.id);
    return { id: docRef.id, ...invitation };
  } catch (error) {
    console.error('❌ Error saving invitation:', error);
    throw error;
  }
};

// עדכון הזמנה
export const updateInvitation = async (id: string, invitation: Partial<Invitation>) => {
  try {
    const docRef = doc(db, 'invitations', id);
    await updateDoc(docRef, { ...invitation, updatedAt: Timestamp.now() });
    console.log('✅ Invitation updated:', id);
  } catch (error) {
    console.error('❌ Error updating invitation:', error);
    throw error;
  }
};

// מחיקת הזמנה
export const deleteInvitation = async (id: string) => {
  try {
    await deleteDoc(doc(db, 'invitations', id));
    console.log('✅ Invitation deleted:', id);
  } catch (error) {
    console.error('❌ Error deleting invitation:', error);
    throw error;
  }
};

// ============ IMAGE OPERATIONS ============

// העלאת תמונה כ-Base64 (bypass CORS issues)
export const uploadImage = async (
  file: File,
  onProgress: (progress: number) => void
): Promise<string> => {
  try {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = (event.loaded / event.total) * 100;
          onProgress(progress);
        }
      };

      reader.onload = () => {
        const base64String = reader.result as string;
        console.log('✅ Image converted to Base64');
        resolve(base64String);
      };

      reader.onerror = () => {
        console.error('❌ Error reading file');
        reject(new Error('Failed to read file'));
      };

      reader.readAsDataURL(file);
    });
  } catch (error) {
    console.error('❌ Error in uploadImage:', error);
    throw error;
  }
};

// קבלת תמונות לפי קטגוריה - SIMPLIFIED (no composite index needed)
export const getImagesByCategory = async (category: string): Promise<ImageAsset[]> => {
  try {
    // Simplified query - only filter by category, avoid composite index requirement
    const q = query(
      collection(db, 'images'),
      where('category', '==', category)
    );
    const querySnapshot = await getDocs(q);
    const images: ImageAsset[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      // Filter by isActive in code instead of Firebase query
      if (data.isActive !== false) {
        images.push({
          id: doc.id,
          fileName: data.fileName,
          storageUrl: data.storageUrl,
          category: data.category,
          displayOrder: data.displayOrder,
          altText: data.altText,
          uploadedAt: data.uploadedAt?.toDate().toISOString() || new Date().toISOString(),
          isActive: data.isActive,
        });
      }
    });

    // Sort by displayOrder in code
    images.sort((a, b) => a.displayOrder - b.displayOrder);

    console.log('✅ Loaded', images.length, `images for category: ${category}`);
    return images;
  } catch (error) {
    console.error('❌ Error loading images:', error);
    // Return empty array instead of throwing to prevent app crash
    return [];
  }
};

// קבלת כל התמונות (כולל לא פעילות)
export const getAllImages = async (): Promise<ImageAsset[]> => {
  try {
    const q = query(collection(db, 'images'), orderBy('displayOrder', 'asc'));
    const querySnapshot = await getDocs(q);
    const images: ImageAsset[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      images.push({
        id: doc.id,
        fileName: data.fileName,
        storageUrl: data.storageUrl,
        category: data.category,
        displayOrder: data.displayOrder,
        altText: data.altText,
        uploadedAt: data.uploadedAt?.toDate().toISOString() || new Date().toISOString(),
        isActive: data.isActive,
      });
    });

    console.log('✅ Loaded', images.length, 'images');
    return images;
  } catch (error) {
    console.error('❌ Error loading images:', error);
    throw error;
  }
};

// שמירת מטא-דטה של תמונה
export const saveImageMetadata = async (image: Omit<ImageAsset, 'id'>): Promise<ImageAsset> => {
  try {
    const docRef = await addDoc(collection(db, 'images'), {
      ...image,
      uploadedAt: Timestamp.now(),
    });
    console.log('✅ Image metadata saved:', docRef.id);
    return { id: docRef.id, ...image };
  } catch (error) {
    console.error('❌ Error saving image metadata:', error);
    throw error;
  }
};

// עדכון תמונה
export const updateImage = async (id: string, image: Partial<ImageAsset>) => {
  try {
    const docRef = doc(db, 'images', id);
    await updateDoc(docRef, image);
    console.log('✅ Image updated:', id);
  } catch (error) {
    console.error('❌ Error updating image:', error);
    throw error;
  }
};

// מחיקת תמונה
export const deleteImage = async (id: string) => {
  try {
    // מחיקה מ-Firestore (Base64 stored inline)
    await deleteDoc(doc(db, 'images', id));
    console.log('✅ Image deleted:', id);
  } catch (error) {
    console.error('❌ Error deleting image:', error);
    throw error;
  }
};

// ============ PAGE SETTINGS OPERATIONS ============

// קבלת הגדרות העמוד
export const getPageSettings = async (): Promise<PageSettings> => {
  try {
    const docSnap = await getDocs(collection(db, 'settings'));

    let settings: PageSettings | null = null;
    docSnap.forEach((doc) => {
      if (doc.id === 'pageSettings') {
        const data = doc.data();
        settings = {
          id: doc.id,
          heroTitle: data.heroTitle || 'Villa Hadas',
          heroSubtitle: data.heroSubtitle || 'עלייה נדירה למנוחה מושלמת',
          heroButtonText: data.heroButtonText || 'הזמן עכשיו',
          contactEmail: data.contactEmail || 'contact@villahadas.com',
          contactPhone: data.contactPhone || '+972-2-123-4567',
          aboutTitle: data.aboutTitle || 'אודות וילה הדס',
          aboutDescription: data.aboutDescription || 'ביוטה אירוח יוקרתית בלב הטבע',
          featuresTitle: data.featuresTitle || 'המשכנעות שלנו',
          siteTitle: data.siteTitle || 'Villa Hadas',
          siteLogo: data.siteLogo || '',
          pricePerNight: data.pricePerNight || 1500,
          updatedAt: data.updatedAt?.toDate().toISOString() || new Date().toISOString(),
        };
      }
    });

    if (!settings) {
      // Create default settings if they don't exist
      settings = {
        heroTitle: 'Villa Hadas',
        heroSubtitle: 'עלייה נדירה למנוחה מושלמת',
        heroButtonText: 'הזמן עכשיו',
        contactEmail: 'contact@villahadas.com',
        contactPhone: '+972-2-123-4567',
        aboutTitle: 'אודות וילה הדס',
        aboutDescription: 'ביוטה אירוח יוקרתית בלב הטבע',
        featuresTitle: 'המשכנעות שלנו',
        siteTitle: 'Villa Hadas',
        siteLogo: '',
        pricePerNight: 1500,
        updatedAt: new Date().toISOString(),
      };
    }

    console.log('✅ Loaded page settings');
    return settings;
  } catch (error) {
    console.error('❌ Error loading page settings:', error);
    throw error;
  }
};

// שמירת הגדרות העמוד
export const savePageSettings = async (settings: Omit<PageSettings, 'id'>) => {
  try {
    const docRef = doc(db, 'settings', 'pageSettings');
    await setDoc(
      docRef,
      {
        ...settings,
        updatedAt: Timestamp.now(),
      },
      { merge: true }
    );
    console.log('✅ Page settings saved');
  } catch (error) {
    console.error('❌ Error saving page settings:', error);
    throw error;
  }
};

export { db, storage };