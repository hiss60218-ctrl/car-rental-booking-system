import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { Car, CalendarCheck, Users, UserX, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ElementType, path: string }> = ({ title, value, icon: Icon, path }) => (
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
    const { t, cars, bookings, customers } = useAppContext();
    const newBookingsCount = bookings.filter(b => b.status === 'new').length;
    
    const lateCustomersCount = customers.filter(c => {
        const remaining = c.totalAmount - c.paidAmount;
        const isLate = new Date(c.returnDate) < new Date();
        return isLate && remaining > 0;
    }).length;

    const totalEarnings = customers.reduce((acc, curr) => acc + curr.paidAmount, 0);

    return (
        <div>
            <h1 className="mb-8 text-3xl font-bold text-primary">{t('admin.welcome')}</h1>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                <StatCard title={t('admin.total_cars')} value={cars.length} icon={Car} path="/admin/cars" />
                <StatCard title={t('admin.new_bookings')} value={newBookingsCount} icon={CalendarCheck} path="/admin/bookings" />
                <StatCard title={t('admin.total_customers')} value={customers.length} icon={Users} path="/admin/customers" />
                <StatCard title={t('admin.late_customers')} value={lateCustomersCount} icon={UserX} path="/admin/customers" />
                <StatCard title={t('admin.total_earnings')} value={`${totalEarnings} ${t('fleet.aed')}`} icon={DollarSign} path="/admin/customers" />
            </div>
        </div>
    );
};

export default AdminDashboard;