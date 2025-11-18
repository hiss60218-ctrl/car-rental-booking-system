// --- DATA MANAGEMENT ---

// Helper to get data from localStorage or fallback to fetch/parse
async function loadData(key, fallbackUrl) {
    const localData = localStorage.getItem(key);
    if (localData) {
        try {
            return JSON.parse(localData);
        } catch (error) {
            console.warn(`Could not parse localStorage data for "${key}". Re-fetching.`, error);
            localStorage.removeItem(key); // Clear corrupted data
        }
    }

    try {
      const response = await fetch(fallbackUrl);
      if (!response.ok) {
          throw new Error(`Failed to fetch ${fallbackUrl}`);
      }
      const data = await response.json();
      localStorage.setItem(key, JSON.stringify(data));
      return data;
    } catch (error) {
        console.error(`Failed to fetch data for key "${key}".`, error);
        return fallbackUrl.endsWith('[]') ? [] : {};
    }
}

function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

// --- DATA INITIALIZATION & EXPORTS ---

export let cars = [];
export let branches = [];
export let offers = [];
export let siteConfig = null;
export let bookings = [];
export let customers = [];
export let carContent = [];

export async function initializeData() {
    [cars, branches, offers, siteConfig, bookings, customers, carContent] = await Promise.all([
        loadData('cars', './cars.json'),
        loadData('branches', './branches.json'),
        loadData('offers', './offers.json'),
        loadData('siteConfig', './site.json'),
        loadData('bookings', '[]'),
        loadData('customers', '[]'),
        loadData('carContent', '[]'),
    ]);
}

// --- DATA MODIFICATION FUNCTIONS ---

// Cars
export function addCar(car) {
    cars.push({ ...car, id: Date.now() });
    saveData('cars', cars);
}
export function updateCar(updatedCar) {
    cars = cars.map(c => c.id === updatedCar.id ? updatedCar : c);
    saveData('cars', cars);
}
export function deleteCar(carId) {
    cars = cars.filter(c => c.id !== carId);
    saveData('cars', cars);
}

// Customers
export function addCustomer(customer) {
    customers.push({ ...customer, id: Date.now() });
    saveData('customers', customers);
}
export function updateCustomer(updatedCustomer) {
    customers = customers.map(c => c.id === updatedCustomer.id ? updatedCustomer : c);
    saveData('customers', customers);
}
export function deleteCustomer(customerId) {
    customers = customers.filter(c => c.id !== customerId);
    saveData('customers', customers);
}

// Car Content
export function addCarContent(content) {
    carContent.push({ ...content, id: Date.now() });
    saveData('carContent', carContent);
}
export function updateCarContent(updatedContent) {
    carContent = carContent.map(c => c.id === updatedContent.id ? updatedContent : c);
    saveData('carContent', carContent);
}
export function deleteCarContent(contentId) {
    carContent = carContent.filter(c => c.id !== contentId);
    saveData('carContent', carContent);
}

// Bookings
export function addBooking(booking) {
    const car = cars.find(c => c.id === booking.carId);
    const newBooking = {
        ...booking,
        id: `booking-${Date.now()}`,
        status: 'new',
        createdAt: new Date().toISOString(),
        carName: car ? car.name : { en: 'Unknown', ar: 'غير معروف' }
    };
    bookings.push(newBooking);
    saveData('bookings', bookings);
}