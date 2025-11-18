import React, { useState, FormEvent } from 'react';
import { useAppContext } from '../../context/AppContext';
import type { Customer } from '../../types';
import { Plus, Edit, Trash2, X } from 'lucide-react';

const CustomerFormModal: React.FC<{ customer?: Customer | null; onClose: () => void; }> = ({ customer, onClose }) => {
    const { t, addCustomer, updateCustomer, cars, language } = useAppContext();
    const [formData, setFormData] = useState({
        name: customer?.name || '',
        phone: customer?.phone || '',
        carId: customer?.carId.toString() || '',
        rentalDate: customer?.rentalDate || '',
        returnDate: customer?.returnDate || '',
        totalAmount: customer?.totalAmount.toString() || '',
        paidAmount: customer?.paidAmount.toString() || '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const customerData = {
            name: formData.name,
            phone: formData.phone,
            carId: Number(formData.carId),
            rentalDate: formData.rentalDate,
            returnDate: formData.returnDate,
            totalAmount: Number(formData.totalAmount),
            paidAmount: Number(formData.paidAmount),
        };

        if (customer) {
            updateCustomer({ ...customerData, id: customer.id });
        } else {
            addCustomer(customerData);
        }
        onClose();
    };
    
    const remainingAmount = Number(formData.totalAmount) - Number(formData.paidAmount);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
            <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto p-8 mx-4 bg-white rounded-lg shadow-xl">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"><X size={24} /></button>
                <h2 className="mb-6 text-2xl font-bold text-primary">{customer ? t('admin.edit_customer') : t('admin.add_customer')}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">{t('admin.customer_name')}</label>
                            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md" required />
                        </div>
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">{t('admin.phone')}</label>
                            <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md" required />
                        </div>
                        <div>
                            <label htmlFor="carId" className="block text-sm font-medium text-gray-700">{t('admin.car')}</label>
                            <select id="carId" name="carId" value={formData.carId} onChange={handleChange} className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md" required>
                                <option value="" disabled>-- {t('booking.select_car')} --</option>
                                {cars.map(car => <option key={car.id} value={car.id}>{car.name[language]}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="rentalDate" className="block text-sm font-medium text-gray-700">{t('admin.rental_date')}</label>
                            <input type="date" id="rentalDate" name="rentalDate" value={formData.rentalDate} onChange={handleChange} className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md" required />
                        </div>
                        <div>
                             <label htmlFor="returnDate" className="block text-sm font-medium text-gray-700">{t('admin.return_date')}</label>
                            <input type="date" id="returnDate" name="returnDate" value={formData.returnDate} onChange={handleChange} className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md" required />
                        </div>
                         <div>
                            <label htmlFor="totalAmount" className="block text-sm font-medium text-gray-700">{t('admin.total_amount')}</label>
                            <input type="number" id="totalAmount" name="totalAmount" value={formData.totalAmount} onChange={handleChange} className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md" required />
                        </div>
                        <div>
                            <label htmlFor="paidAmount" className="block text-sm font-medium text-gray-700">{t('admin.paid_amount')}</label>
                            <input type="number" id="paidAmount" name="paidAmount" value={formData.paidAmount} onChange={handleChange} className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">{t('admin.remaining_amount')}</label>
                            <p className="w-full px-3 py-2 mt-1 font-bold bg-gray-100 rounded-md">{remainingAmount} {t('fleet.aed')}</p>
                        </div>
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


const AdminCustomers: React.FC = () => {
    const { t, language, customers, cars, deleteCustomer } = useAppContext();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

    const handleAdd = () => {
        setSelectedCustomer(null);
        setIsModalOpen(true);
    };

    const handleEdit = (customer: Customer) => {
        setSelectedCustomer(customer);
        setIsModalOpen(true);
    };

    const handleDelete = (customerId: number) => {
        if (window.confirm(t('admin.confirm_delete_customer'))) {
            deleteCustomer(customerId);
        }
    };

    const getCarName = (carId: number) => {
        return cars.find(c => c.id === carId)?.name[language] || 'N/A';
    };

    return (
        <div>
            {isModalOpen && <CustomerFormModal customer={selectedCustomer} onClose={() => setIsModalOpen(false)} />}
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-primary">{t('admin.customers_management')}</h1>
                <button onClick={handleAdd} className="flex items-center px-4 py-2 font-semibold text-white rounded-md bg-secondary hover:bg-opacity-80">
                    <Plus size={20} className="ml-2" />
                    {t('admin.add_customer')}
                </button>
            </div>

            <div className="overflow-x-auto bg-white rounded-lg shadow">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">{t('admin.customer_name')}</th>
                            <th scope="col" className="px-6 py-3">{t('admin.phone')}</th>
                            <th scope="col" className="px-6 py-3">{t('admin.car')}</th>
                            <th scope="col" className="px-6 py-3">{t('admin.rental_date')}</th>
                            <th scope="col" className="px-6 py-3">{t('admin.paid_amount')}</th>
                            <th scope="col" className="px-6 py-3">{t('admin.remaining_amount')}</th>
                            <th scope="col" className="px-6 py-3">{t('admin.actions')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {customers.length > 0 ? customers.map(customer => {
                             const remaining = customer.totalAmount - customer.paidAmount;
                             return (
                                <tr key={customer.id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">{customer.name}</td>
                                    <td className="px-6 py-4">{customer.phone}</td>
                                    <td className="px-6 py-4">{getCarName(customer.carId)}</td>
                                    <td className="px-6 py-4">{customer.rentalDate}</td>
                                    <td className="px-6 py-4 text-green-600">{customer.paidAmount}</td>
                                    <td className={`px-6 py-4 font-bold ${remaining > 0 ? 'text-red-600' : 'text-gray-800'}`}>{remaining}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex space-x-2">
                                            <button onClick={() => handleEdit(customer)} className="text-blue-600 hover:text-blue-800"><Edit size={18} /></button>
                                            <button onClick={() => handleDelete(customer.id)} className="text-red-600 hover:text-red-800"><Trash2 size={18} /></button>
                                        </div>
                                    </td>
                                </tr>
                             );
                        }) : (
                             <tr><td colSpan={7} className="py-8 text-center text-gray-500">{t('admin.no_customers')}</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminCustomers;