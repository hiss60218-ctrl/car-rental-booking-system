import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { Car, CalendarCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const StatCard: React.FC<{ title: string; value: number; icon: React.ElementType, path: string }> = ({ title, value, icon: Icon, path }) => (
    <Link to={path} className="block p-6 transition-transform transform bg-white rounded-lg shadow-md hover:scale-105">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <p className="text-3xl font-bold text-primary">{value}</p>
            </div>
            <div className="p-3 rounded-full bg-secondary/20 text-secondary">
                <Icon size={32} />
            </div>
        </div>
    </Link>
);


const AdminDashboard: React.FC = () => {
    const { t, cars, bookings } = useAppContext();
    const newBookingsCount = bookings.filter(b => b.status === 'new').length;

    return (
        <div>
            <h1 className="mb-8 text-3xl font-bold text-primary">{t('admin.welcome')}</h1>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                <StatCard title={t('admin.total_cars')} value={cars.length} icon={Car} path="/admin/cars" />
                <StatCard title={t('admin.new_bookings')} value={newBookingsCount} icon={CalendarCheck} path="/admin/bookings" />
            </div>
        </div>
    );
};

export default AdminDashboard;