import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { format } from 'date-fns';

const AdminBookings: React.FC = () => {
    const { t, language, bookings } = useAppContext();
    const newBookings = bookings.filter(b => b.status === 'new').sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return (
        <div>
            <h1 className="mb-8 text-3xl font-bold text-primary">{t('admin.bookings_management')}</h1>

             <div className="overflow-x-auto bg-white rounded-lg shadow">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">{t('admin.date')}</th>
                            <th scope="col" className="px-6 py-3">{t('admin.customer_name')}</th>
                            <th scope="col" className="px-6 py-3">{t('admin.phone')}</th>
                            <th scope="col" className="px-6 py-3">{t('admin.car')}</th>
                            <th scope="col" className="px-6 py-3">{t('admin.pickup')}</th>
                            <th scope="col" className="px-6 py-3">{t('admin.dropoff')}</th>
                            <th scope="col" className="px-6 py-3">{t('admin.status')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {newBookings.length > 0 ? newBookings.map(booking => (
                            <tr key={booking.id} className="bg-white border-b hover:bg-gray-50">
                                <td className="px-6 py-4">{format(new Date(booking.createdAt), 'yyyy-MM-dd')}</td>
                                <td className="px-6 py-4 font-medium text-gray-900">{booking.fullName}</td>
                                <td className="px-6 py-4">{booking.phoneNumber}</td>
                                <td className="px-6 py-4">{booking.carName[language]}</td>
                                <td className="px-6 py-4">{format(new Date(booking.pickupTime), 'Pp')}</td>
                                <td className="px-6 py-4">{format(new Date(booking.dropoffTime), 'Pp')}</td>
                                <td className="px-6 py-4">
                                    <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
                                        {t('admin.new')}
                                    </span>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={7} className="py-8 text-center text-gray-500">
                                    {t('admin.no_bookings')}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminBookings;