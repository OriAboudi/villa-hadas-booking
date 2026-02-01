export interface BookingData {
  id?: string;
  
  // פרטי אורח
  fullName: string;
  idNumber: string;
  phone: string;
  email: string;
  
  // פרטי שהייה
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  
  // תשלום
  totalPrice: number;
  deposit: number;
  balance: number;
  
  // סטטוס
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}

export interface Review {
  id: string;
  name: string;
  rating: number;
  text: string;
  date: string;
}