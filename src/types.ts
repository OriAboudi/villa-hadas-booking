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

export interface Deal {
  id?: string;
  title: string;
  description: string;
  originalPrice: number;
  salePrice: number;
  discount: string;
  badge: string;
  gradient: string;
  iconName: string;
  features: string[];
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface Invitation {
  id?: string;
  guestName: string;
  eventType: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  numberOfGuests: number;
  phoneNumber: string;
  email: string;
  specialRequests: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  color: string;
  createdAt: string;
  updatedAt: string;
}

export interface ImageAsset {
  id?: string;
  fileName: string;
  storageUrl: string;
  category: 'hero' | 'gallery' | 'features' | 'other';
  displayOrder: number;
  altText: string;
  uploadedAt: string;
  isActive: boolean;
}

export interface PageSettings {
  id?: string;
  // Hero Section
  heroTitle: string;
  heroSubtitle: string;
  heroButtonText: string;
  // Contact Info
  contactEmail: string;
  contactPhone: string;
  // About Section
  aboutTitle: string;
  aboutDescription: string;
  // Features
  featuresTitle: string;
  // General
  siteTitle: string;
  siteLogo: string;
  // Pricing
  pricePerNight: number;
  updatedAt: string;
}