import React, { useState, FormEvent } from 'react';
import { useAppContext } from '../../context/AppContext';
import type { Car } from '../../types';
import { Plus, Edit, Trash2, X } from 'lucide-react';

const CarFormModal: React.FC<{ car?: Car | null; onClose: () => void; }> = ({ car, onClose }) => {
    const { t, addCar, updateCar } = useAppContext();
    const [formData, setFormData] = useState({
        nameEn: car?.name.en || '',
        nameAr: car?.name.ar || '',
        category: car?.category || 'economy',
        images: car?.images.join(', ') || '',
        fuelEn: car?.specs.fuel.en || '',
        fuelAr: car?.specs.fuel.ar || '',
        capacityEn: car?.specs.capacity.en || '',
        capacityAr: car?.specs.capacity.ar || '',
        transmissionEn: car?.specs.transmission.en || '',
        transmissionAr: car?.specs.transmission.ar || '',
        priceDaily: car?.price.daily.toString() || '',
        priceWeekly: car?.price.weekly.toString() || '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const carData = {
            name: { en: formData.nameEn, ar: formData.nameAr },
            category: formData.category as Car['category'],
            images: formData.images.split(',').map(url => url.trim()).filter(url => url),
            specs: {
                fuel: { en: formData.fuelEn, ar: formData.fuelAr },
                capacity: { en: formData.capacityEn, ar: formData.capacityAr },
                transmission: { en: formData.transmissionEn, ar: formData.transmissionAr },
            },
            price: {
                daily: Number(formData.priceDaily),
                weekly: Number(formData.priceWeekly),
            },
        };

        if (car) {
            updateCar({ ...carData, id: car.id });
        } else {
            addCar(carData);
        }
        onClose();
    };
    
    const formFields = [
      { name: 'nameEn', label: t('admin.car_name_en'), required: true },
      { name: 'nameAr', label: t('admin.car_name_ar'), required: true },
      { name: 'category', label: t('admin.category'), type: 'select', options: ['economy', 'suv', 'luxury'], required: true },
      { name: 'images', label: t('admin.images'), required: true },
      { name: 'fuelEn', label: t('admin.fuel_en'), required: true },
      { name: 'fuelAr', label: t('admin.fuel_ar'), required: true },
      { name: 'capacityEn', label: t('admin.capacity_en'), required: true },
      { name: 'capacityAr', label: t('admin.capacity_ar'), required: true },
      { name: 'transmissionEn', label: t('admin.transmission_en'), required: true },
      { name: 'transmissionAr', label: t('admin.transmission_ar'), required: true },
      { name: 'priceDaily', label: t('admin.price_daily'), type: 'number', required: true },
      { name: 'priceWeekly', label: t('admin.price_weekly'), type: 'number', required: true },
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
            <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 mx-4 bg-white rounded-lg shadow-xl">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"><X size={24} /></button>
                <h2 className="mb-6 text-2xl font-bold text-primary">{car ? t('admin.edit_car') : t('admin.add_car')}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      {formFields.map(field => (
                        <div key={field.name}>
                          <label htmlFor={field.name} className="block mb-1 text-sm font-medium text-gray-700">{field.label}</label>
                          {field.type === 'select' ? (
                            <select id={field.name} name={field.name} value={formData[field.name as keyof typeof formData]} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-secondary focus:border-secondary" required={field.required}>
                              {field.options?.map(opt => <option key={opt} value={opt}>{t(`fleet.filter_${opt}`)}</option>)}
                            </select>
                          ) : (
                            <input type={field.type || 'text'} id={field.name} name={field.name} value={formData[field.name as keyof typeof formData]} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-secondary focus:border-secondary" required={field.required} />
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-end pt-4 space-x-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 font-semibold text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300">{t('admin.cancel')}</button>
                        <button type="submit" className="px-4 py-2 font-semibold text-white rounded-md bg-secondary hover:bg-opacity-80">{t('admin.save')}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


const AdminCars: React.FC = () => {
    const { t, language, cars, deleteCar } = useAppContext();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCar, setSelectedCar] = useState<Car | null>(null);

    const handleAdd = () => {
        setSelectedCar(null);
        setIsModalOpen(true);
    };

    const handleEdit = (car: Car) => {
        setSelectedCar(car);
        setIsModalOpen(true);
    };

    const handleDelete = (carId: number) => {
        if (window.confirm(t('admin.confirm_delete'))) {
            deleteCar(carId);
        }
    };

    return (
        <div>
            {isModalOpen && <CarFormModal car={selectedCar} onClose={() => setIsModalOpen(false)} />}
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-primary">{t('admin.cars_management')}</h1>
                <button onClick={handleAdd} className="flex items-center px-4 py-2 font-semibold text-white rounded-md bg-secondary hover:bg-opacity-80">
                    <Plus size={20} className="mr-2" />
                    {t('admin.add_car')}
                </button>
            </div>

            <div className="overflow-x-auto bg-white rounded-lg shadow">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">{t('admin.car')}</th>
                            <th scope="col" className="px-6 py-3">{t('admin.category')}</th>
                            <th scope="col" className="px-6 py-3">{t('fleet.daily_price')}</th>
                            <th scope="col" className="px-6 py-3">{t('admin.actions')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cars.map(car => (
                            <tr key={car.id} className="bg-white border-b hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-900">{car.name[language]}</td>
                                <td className="px-6 py-4">{t(`fleet.filter_${car.category}`)}</td>
                                <td className="px-6 py-4">{car.price.daily} {t('fleet.aed')}</td>
                                <td className="px-6 py-4">
                                    <div className="flex space-x-2">
                                        <button onClick={() => handleEdit(car)} className="text-blue-600 hover:text-blue-800"><Edit size={18} /></button>
                                        <button onClick={() => handleDelete(car.id)} className="text-red-600 hover:text-red-800"><Trash2 size={18} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminCars;