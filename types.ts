import React from 'react';

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
    icon: React.ElementType;
    title: string;
    description: string;
}

export interface Strength {
    icon: React.ElementType;
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
    // FIX: Add linkedin property to social links to match usage in Footer component.
    linkedin: string;
  };
}

export interface Booking {
  id: string;
  carId: string;
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
