import React, { useState, FormEvent, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import type { Car } from '../types';

const SuccessModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { t } = useAppContext();
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
            <div className="relative max-w-sm p-8 mx-4 text-center bg-white rounded-lg shadow-xl">
                 <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-800">
                    <X size={24} />
                </button>
                <h2 className="mb-4 text-2xl font-bold text-primary">{t('booking.booking_success')}</h2>
                <p className="text-gray-700">{t('booking.booking_success_msg')}</p>
            </div>
        </div>
    );
};

const Booking: React.FC = () => {
    const { t, language, branches, cars, addBooking } = useAppContext();
    const location = useLocation();
    const [isSubmitted, setIsSubmitted] = useState(false);
    
    const preSelectedCarId = location.state?.selectedCar;
    const [selectedCarId, setSelectedCarId] = useState(preSelectedCarId?.toString() || '');
    const [selectedCar, setSelectedCar] = useState<Car | null>(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        if (selectedCarId) {
            const car = cars.find(c => c.id.toString() === selectedCarId) || null;
            setSelectedCar(car);
            setCurrentImageIndex(0);
        } else {
            setSelectedCar(null);
        }
    }, [selectedCarId, cars]);

    const handleCarChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCarId(e.target.value);
    };
    
    const nextImage = () => {
        if (selectedCar) {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % selectedCar.images.length);
        }
    };

    const prevImage = () => {
        if (selectedCar) {
            setCurrentImageIndex((prevIndex) => (prevIndex - 1 + selectedCar.images.length) % selectedCar.images.length);
        }
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        addBooking({
            carId: data.carId as string,
            fullName: data.fullName as string,
            phoneNumber: data.phoneNumber as string,
            email: data.email as string,
            idNumber: data.idNumber as string,
            pickupLocation: data.pickupLocation as string,
            pickupTime: data.pickupTime as string,
            dropoffLocation: data.dropoffLocation as string,
            dropoffTime: data.dropoffTime as string,
            currentLocation: data.currentLocation as string,
            notes: data.notes as string,
        });

        setIsSubmitted(true);
        e.currentTarget.reset();
        setSelectedCarId('');
    };
    
    return (
        <div className="py-16 bg-light">
            {isSubmitted && <SuccessModal onClose={() => setIsSubmitted(false)} />}
            <div className="container px-4 mx-auto">
                <div className="max-w-4xl mx-auto">
                    <h1 className="mb-4 text-4xl font-bold text-center text-primary">{t('booking.title')}</h1>
                    <p className="mb-8 text-lg text-center text-gray-600">{t('booking.subtitle')}</p>
                    <form onSubmit={handleSubmit} className="p-8 space-y-6 bg-white rounded-lg shadow-lg">
                        
                        {/* Car Selection and Viewer */}
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                            <div>
                                <label htmlFor="selectCar" className="block mb-2 font-semibold text-gray-700">{t('booking.select_car')}</label>
                                <select 
                                    id="selectCar"
                                    name="carId"
                                    value={selectedCarId} 
                                    onChange={handleCarChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-secondary focus:border-secondary" 
                                    required
                                >
                                    <option value="" disabled>-- {t('booking.select_car')} --</option>
                                    {cars.map(car => <option key={car.id} value={car.id}>{car.name[language]}</option>)}
                                </select>
                            </div>
                            {selectedCar && (
                                <div className="relative">
                                    <h3 className="mb-2 font-semibold text-gray-700">{t('booking.car_details_title')}</h3>
                                    <div className="relative overflow-hidden rounded-lg shadow-md aspect-video">
                                        <img src={selectedCar.images[currentImageIndex]} alt={selectedCar.name[language]} className="object-cover w-full h-full" />
                                        {selectedCar.images.length > 1 && (
                                            <>
                                                <button type="button" onClick={prevImage} className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-1 hover:bg-opacity-75 transition-opacity">
                                                    <ChevronLeft size={24} />
                                                </button>
                                                <button type="button" onClick={nextImage} className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-1 hover:bg-opacity-75 transition-opacity">
                                                    <ChevronRight size={24} />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        <hr/>

                        {/* Customer Details */}
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div>
                                <label htmlFor="fullName" className="block mb-2 font-semibold text-gray-700">{t('booking.full_name')}</label>
                                <input type="text" id="fullName" name="fullName" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-secondary focus:border-secondary" required />
                            </div>
                            <div>
                                <label htmlFor="phoneNumber" className="block mb-2 font-semibold text-gray-700">{t('booking.phone_number')}</label>
                                <input type="tel" id="phoneNumber" name="phoneNumber" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-secondary focus:border-secondary" required />
                            </div>
                             <div>
                                <label htmlFor="email" className="block mb-2 font-semibold text-gray-700">{t('booking.email_optional')}</label>
                                <input type="email" id="email" name="email" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-secondary focus:border-secondary" />
                            </div>
                             <div>
                                <label htmlFor="idNumber" className="block mb-2 font-semibold text-gray-700">{t('booking.id_optional')}</label>
                                <input type="text" id="idNumber" name="idNumber" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-secondary focus:border-secondary" />
                            </div>
                        </div>

                        <hr/>

                        {/* Rental Details */}
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div>
                                <label htmlFor="pickupLocation" className="block mb-2 font-semibold text-gray-700">{t('booking.pickup_location')}</label>
                                <select id="pickupLocation" name="pickupLocation" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-secondary focus:border-secondary" required>
                                    {branches.map(branch => <option key={branch.id} value={branch.name.en}>{branch.name[language]}</option>)}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="pickupTime" className="block mb-2 font-semibold text-gray-700">{t('booking.pickup_time')}</label>
                                <input type="datetime-local" id="pickupTime" name="pickupTime" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-secondary focus:border-secondary" required />
                            </div>
                            <div>
                                <label htmlFor="dropoffLocation" className="block mb-2 font-semibold text-gray-700">{t('booking.dropoff_location')}</label>
                                <select id="dropoffLocation" name="dropoffLocation" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-secondary focus:border-secondary" required>
                                    {branches.map(branch => <option key={branch.id} value={branch.name.en}>{branch.name[language]}</option>)}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="dropoffTime" className="block mb-2 font-semibold text-gray-700">{t('booking.dropoff_time')}</label>
                                <input type="datetime-local" id="dropoffTime" name="dropoffTime" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-secondary focus:border-secondary" required />
                            </div>
                        </div>
                        <div>
                             <label htmlFor="currentLocation" className="block mb-2 font-semibold text-gray-700">{t('booking.current_location')}</label>
                             <textarea id="currentLocation" name="currentLocation" rows={2} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-secondary focus:border-secondary" required></textarea>
                        </div>
                        <div>
                             <label htmlFor="notes" className="block mb-2 font-semibold text-gray-700">{t('booking.notes_optional')}</label>
                             <textarea id="notes" name="notes" rows={3} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-secondary focus:border-secondary"></textarea>
                        </div>

                        <button type="submit" className="w-full px-8 py-3 text-lg font-bold text-white transition-transform duration-300 rounded-md shadow-lg bg-secondary hover:scale-105">
                            {t('booking.submit_request')}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Booking;