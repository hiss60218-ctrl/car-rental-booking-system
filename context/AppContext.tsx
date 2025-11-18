import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import type { Car, Branch, Offer, SiteConfig, Booking, Customer, CarContent } from '../types';

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
  customers: Customer[];
  carContent: CarContent[];
  isAuthenticated: boolean;
  
  login: (user: string, pass: string) => boolean;
  logout: () => void;

  addCar: (car: Omit<Car, 'id'>) => void;
  updateCar: (updatedCar: Car) => void;
  deleteCar: (carId: number) => void;
  
  addBooking: (booking: Omit<Booking, 'id' | 'status' | 'createdAt' | 'carName'>) => void;

  addCustomer: (customer: Omit<Customer, 'id'>) => void;
  updateCustomer: (updatedCustomer: Customer) => void;
  deleteCustomer: (customerId: number) => void;
  
  addCarContent: (content: Omit<CarContent, 'id'>) => void;
  updateCarContent: (updatedContent: CarContent) => void;
  deleteCarContent: (contentId: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Helper to get data from localStorage or fallback to fetch/parse
const loadData = async <T,>(key: string, fallback: string): Promise<T> => {
    const localData = localStorage.getItem(key);
    if (localData) {
        try {
            return JSON.parse(localData);
        } catch (error) {
            console.warn(`Could not parse localStorage data for "${key}". Re-fetching.`, error);
        }
    }

    try {
      const response = await fetch(fallback);
      if (!response.ok) {
          // If fetch fails (e.g., 404), parse fallback as a string
          if (fallback.trim().startsWith('[') || fallback.trim().startsWith('{')) {
              const data = JSON.parse(fallback);
              localStorage.setItem(key, JSON.stringify(data));
              return data;
          }
          throw new Error(`Failed to fetch data for "${key}" from ${fallback}`);
      }
      const data = await response.json();
      localStorage.setItem(key, JSON.stringify(data));
      return data;
    } catch (fetchError) {
        // If fetch fails, try parsing fallback as a JSON string
        try {
            const data = JSON.parse(fallback);
            localStorage.setItem(key, JSON.stringify(data));
            return data;
        } catch (parseError) {
            console.error(`Failed to fetch from ${fallback} and failed to parse fallback string for key "${key}".`, fetchError, parseError);
            throw parseError; // Rethrow the parsing error
        }
    }
};


export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('ar');
  const [translations, setTranslations] = useState<Record<string, any> | null>(null);
  const [cars, setCars] = useState<Car[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [siteConfig, setSiteConfig] = useState<SiteConfig | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [carContent, setCarContent] = useState<CarContent[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => !!localStorage.getItem('isAdminAuthenticated'));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [en, ar] = await Promise.all([
            fetch('./i18n/en.json').then(res => res.json()),
            fetch('./i18n/ar.json').then(res => res.json())
        ]);
        setTranslations({ en, ar });

        const [carsData, branchesData, offersData, siteConfigData, bookingsData, customersData, carContentData] = await Promise.all([
          loadData<Car[]>('cars', './cars.json'),
          loadData<Branch[]>('branches', './branches.json'),
          loadData<Offer[]>('offers', './offers.json'),
          loadData<SiteConfig>('siteConfig', './site.json'),
          loadData<Booking[]>('bookings', '[]'),
          loadData<Customer[]>('customers', '[]'),
          loadData<CarContent[]>('carContent', '[]'),
        ]);
        
        setCars(carsData);
        setBranches(branchesData);
        setOffers(offersData);
        setSiteConfig(siteConfigData);
        setBookings(bookingsData);
        setCustomers(customersData);
        setCarContent(carContentData);

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
  
  const saveData = <T,>(key: string, data: T) => {
      localStorage.setItem(key, JSON.stringify(data));
  };

  // --- Auth ---
  const login = (user: string, pass: string): boolean => {
      if (user === 'admin' && pass === 'password') {
          localStorage.setItem('isAdminAuthenticated', 'true');
          setIsAuthenticated(true);
          return true;
      }
      return false;
  };
  const logout = () => {
      localStorage.removeItem('isAdminAuthenticated');
      setIsAuthenticated(false);
  };
  
  // --- Cars ---
  const addCar = useCallback((car: Omit<Car, 'id'>) => {
      setCars(prev => { const updated = [...prev, { ...car, id: Date.now() }]; saveData('cars', updated); return updated; });
  }, []);
  const updateCar = useCallback((updatedCar: Car) => {
      setCars(prev => { const updated = prev.map(c => c.id === updatedCar.id ? updatedCar : c); saveData('cars', updated); return updated; });
  }, []);
  const deleteCar = useCallback((carId: number) => {
      setCars(prev => { const updated = prev.filter(c => c.id !== carId); saveData('cars', updated); return updated; });
  }, []);

  // --- Bookings ---
  const addBooking = useCallback((booking: Omit<Booking, 'id' | 'status' | 'createdAt' | 'carName'>) => {
      setBookings(prev => {
          const car = cars.find(c => c.id === booking.carId);
          const newBooking: Booking = { ...booking, id: `booking-${Date.now()}`, status: 'new', createdAt: new Date().toISOString(), carName: car ? car.name : { en: 'Unknown', ar: 'غير معروف' } };
          const updated = [...prev, newBooking];
          saveData('bookings', updated);
          return updated;
      });
  }, [cars]);
  
  // --- Customers ---
  const addCustomer = useCallback((customer: Omit<Customer, 'id'>) => {
      setCustomers(prev => { const updated = [...prev, { ...customer, id: Date.now() }]; saveData('customers', updated); return updated; });
  }, []);
  const updateCustomer = useCallback((updatedCustomer: Customer) => {
      setCustomers(prev => { const updated = prev.map(c => c.id === updatedCustomer.id ? updatedCustomer : c); saveData('customers', updated); return updated; });
  }, []);
  const deleteCustomer = useCallback((customerId: number) => {
      setCustomers(prev => { const updated = prev.filter(c => c.id !== customerId); saveData('customers', updated); return updated; });
  }, []);

  // --- Car Content ---
  const addCarContent = useCallback((content: Omit<CarContent, 'id'>) => {
      setCarContent(prev => { const updated = [...prev, { ...content, id: Date.now() }]; saveData('carContent', updated); return updated; });
  }, []);
  const updateCarContent = useCallback((updatedContent: CarContent) => {
      setCarContent(prev => { const updated = prev.map(c => c.id === updatedContent.id ? updatedContent : c); saveData('carContent', updated); return updated; });
  }, []);
  const deleteCarContent = useCallback((contentId: number) => {
      setCarContent(prev => { const updated = prev.filter(c => c.id !== contentId); saveData('carContent', updated); return updated; });
  }, []);

  const value: AppContextType = { 
    language, setLanguage, t,
    cars, branches, offers, siteConfig, bookings, customers, carContent,
    isAuthenticated, login, logout,
    addCar, updateCar, deleteCar,
    addBooking,
    addCustomer, updateCustomer, deleteCustomer,
    addCarContent, updateCarContent, deleteCarContent,
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen text-xl font-bold bg-light text-primary">Loading...</div>;
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
