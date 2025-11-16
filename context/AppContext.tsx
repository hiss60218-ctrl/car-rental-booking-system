import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import type { Car, Branch, Offer, SiteConfig, Booking } from '../types';

type Language = 'en' | 'ar';

interface AppContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
  cars: Car[];
  branches: Branch[];
  offers: Offer[];
  siteConfig: SiteConfig | null;
  bookings: Booking[];
  addCar: (car: Omit<Car, 'id'>) => void;
  updateCar: (updatedCar: Car) => void;
  deleteCar: (carId: number) => void;
  addBooking: (booking: Omit<Booking, 'id' | 'status' | 'createdAt' | 'carName'>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Helper to get data from localStorage or fallback to fetch
const loadData = async <T,>(key: string, fallbackPath: string): Promise<T> => {
    try {
        const localData = localStorage.getItem(key);
        if (localData) {
            return JSON.parse(localData);
        }
        const response = await fetch(fallbackPath);
        const data = await response.json();
        localStorage.setItem(key, JSON.stringify(data));
        return data;
    } catch (error) {
        console.error(`Failed to load data for ${key}:`, error);
        // Fallback to fetch in case localStorage fails
        const response = await fetch(fallbackPath);
        return response.json();
    }
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');
  const [translations, setTranslations] = useState<Record<string, any> | null>(null);
  const [cars, setCars] = useState<Car[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [siteConfig, setSiteConfig] = useState<SiteConfig | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [en, ar] = await Promise.all([
            loadData<any>('translations_en', './i18n/en.json'),
            loadData<any>('translations_ar', './i18n/ar.json')
        ]);
        setTranslations({ en, ar });

        const [carsData, branchesData, offersData, siteConfigData, bookingsData] = await Promise.all([
          loadData<Car[]>('cars', './cars.json'),
          loadData<Branch[]>('branches', './branches.json'),
          loadData<Offer[]>('offers', './offers.json'),
          loadData<SiteConfig>('siteConfig', './site.json'),
          loadData<Booking[]>('bookings', '[]') // Default to empty array if not present
        ]);
        
        setCars(carsData);
        setBranches(branchesData);
        setOffers(offersData);
        setSiteConfig(siteConfigData);
        setBookings(bookingsData);

      } catch (error) {
        console.error("Failed to load app data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const t = (key: string): string => {
    if (!translations) return key;
    const langTranslations = translations[language];
    if (!langTranslations) return key;
    const keys = key.split('.');
    let result: any = langTranslations;
    for (const k of keys) {
      result = result?.[k];
      if (result === undefined) return key;
    }
    return result || key;
  };
  
  // --- CRUD Operations ---

  const saveData = <T,>(key: string, data: T) => {
      localStorage.setItem(key, JSON.stringify(data));
  };

  const addCar = useCallback((car: Omit<Car, 'id'>) => {
      setCars(prevCars => {
          const newCar = { ...car, id: Date.now() };
          const updatedCars = [...prevCars, newCar];
          saveData('cars', updatedCars);
          return updatedCars;
      });
  }, []);

  const updateCar = useCallback((updatedCar: Car) => {
      setCars(prevCars => {
          const updatedCars = prevCars.map(car => car.id === updatedCar.id ? updatedCar : car);
          saveData('cars', updatedCars);
          return updatedCars;
      });
  }, []);

  const deleteCar = useCallback((carId: number) => {
      setCars(prevCars => {
          const updatedCars = prevCars.filter(car => car.id !== carId);
          saveData('cars', updatedCars);
          return updatedCars;
      });
  }, []);

  const addBooking = useCallback((booking: Omit<Booking, 'id' | 'status' | 'createdAt' | 'carName'>) => {
      setBookings(prevBookings => {
          const car = cars.find(c => c.id.toString() === booking.carId.toString());
          const newBooking: Booking = {
              ...booking,
              id: `booking-${Date.now()}`,
              status: 'new',
              createdAt: new Date().toISOString(),
              carName: car ? car.name : { en: 'Unknown', ar: 'غير معروف' }
          };
          const updatedBookings = [...prevBookings, newBooking];
          saveData('bookings', updatedBookings);
          return updatedBookings;
      });
  }, [cars]);


  const value: AppContextType = { 
    language, 
    setLanguage, 
    t,
    cars,
    branches,
    offers,
    siteConfig,
    bookings,
    addCar,
    updateCar,
    deleteCar,
    addBooking,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-light text-primary font-bold text-xl">
        Loading...
      </div>
    );
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};