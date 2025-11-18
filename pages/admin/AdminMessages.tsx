import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Send } from 'lucide-react';

const AdminMessages: React.FC = () => {
    const { t, customers, language, cars } = useAppContext();
    const [message, setMessage] = useState('عزيزي العميل، نود تذكيركم بوجود مبلغ متبقٍ على إيجار سيارتكم. يرجى التواصل معنا لترتيب عملية السداد. شكراً لتعاونكم.');

    const customersToNotify = customers.filter(c => (c.totalAmount - c.paidAmount) > 500);

    const getCarName = (carId: number) => {
        return cars.find(c => c.id === carId)?.name[language] || 'N/A';
    };
    
    const handleSend = (customerName: string) => {
        alert(`${t('admin.message_sent_success')} ${customerName}`);
    };

    return (
        <div>
            <h1 className="mb-8 text-3xl font-bold text-primary">{t('admin.messages_management')}</h1>

            <div className="p-6 mb-8 bg-white rounded-lg shadow">
                <h2 className="mb-2 text-xl font-bold text-primary">{t('admin.message_settings')}</h2>
                <label htmlFor="messageText" className="block mb-2 text-sm font-medium text-gray-700">{t('admin.message_text')}</label>
                <textarea
                    id="messageText"
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-secondary focus:border-secondary"
                ></textarea>
                <p className="mt-2 text-xs text-gray-500">{t('admin.message_text_desc')}</p>
            </div>

            <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b">
                    <h2 className="text-xl font-bold text-primary">{t('admin.customers_to_notify')}</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th className="px-6 py-3">{t('admin.customer_name')}</th>
                                <th className="px-6 py-3">{t('admin.phone')}</th>
                                <th className="px-6 py-3">{t('admin.car')}</th>
                                <th className="px-6 py-3">{t('admin.remaining_amount')}</th>
                                <th className="px-6 py-3">{t('admin.actions')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {customersToNotify.length > 0 ? customersToNotify.map(customer => (
                                <tr key={customer.id} className="border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">{customer.name}</td>
                                    <td className="px-6 py-4">{customer.phone}</td>
                                    <td className="px-6 py-4">{getCarName(customer.carId)}</td>
                                    <td className="px-6 py-4 font-bold text-red-600">
                                        {customer.totalAmount - customer.paidAmount} {t('fleet.aed')}
                                    </td>
                                    <td className="px-6 py-4">
                                        <button 
                                            onClick={() => handleSend(customer.name)}
                                            className="flex items-center px-3 py-1 text-xs font-medium text-white rounded-md bg-secondary hover:bg-opacity-80">
                                            <Send size={14} className="ml-1" />
                                            {t('admin.send_message')}
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={5} className="py-8 text-center text-gray-500">{t('admin.no_customers')} {t('admin.customers_to_notify')}</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminMessages;