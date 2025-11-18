
export interface Car {
  id: number;
  name: { en: string; ar: string };
  category: 'economy' | 'suv' | 'luxury';
  images: string[];
  specs: {
    fuel: { en: string; ar: string };
    capacity: { en: string; ar: string };
    transmission: { en: string; ar: string };
  };
  price: {
    daily: number;
    weekly: number;
  };
}

export interface Branch {
  id: number;
  name: { en: string; ar: string };
  address: { en: string; ar: string };
  hours: { en: string; ar: string };
  phone: string;
  coords: { lat: number; lng: number };
}

export interface Offer {
  id: number;
  title: { en: string; ar: string };
  description: { en: string; ar: string };
  image: string;
}

export interface Feature {
    icon: string;
    title: string;
    description: string;
}

export interface Strength {
    icon: string;
    title: string;
}

export interface SiteConfig {
  contact: {
    address: { en: string; ar: string };
    email: string;
    phone: string;
  };
  social: {
    facebook: string;
    twitter: string;
    instagram: string;
    linkedin: string;
    tiktok: string;
  };
}

export interface Booking {
  id: string;
  carId: number;
  carName: { en: string, ar: string };
  fullName: string;
  phoneNumber: string;
  email?: string;
  idNumber?: string;
  pickupLocation: string;
  pickupTime: string;
  dropoffLocation: string;
  dropoffTime: string;
  currentLocation: string;
  notes?: string;
  status: 'new' | 'confirmed' | 'completed';
  createdAt: string;
}

export interface Customer {
    id: number;
    name: string;
    phone: string;
    carId: number;
    rentalDate: string;
    returnDate: string;
    totalAmount: number;
    paidAmount: number;
}

export interface CarContent {
    id: number;
    carId: number;
    title: { en: string; ar: string };
    content: { en: string; ar: string };
    seoText: { en: string; ar: string };
    image: string;
}
