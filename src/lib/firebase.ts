import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, query, orderBy, Timestamp } from 'firebase/firestore';
import type { BookingData } from '../types';

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

export { db };