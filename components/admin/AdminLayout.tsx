import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Car, CalendarCheck, Users, FileText, MessageSquare, ArrowLeft, LogOut } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { t, logout } = useAppContext();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/admin/login');
    };

    const navLinks = [
        { name: t('admin.dashboard'), path: '/admin', icon: LayoutDashboard },
        { name: t('admin.cars_management'), path: '/admin/cars', icon: Car },
        { name: t('admin.bookings_management'), path: '/admin/bookings', icon: CalendarCheck },
        { name: t('admin.customers_management'), path: '/admin/customers', icon: Users },
        { name: t('admin.content_management'), path: '/admin/content', icon: FileText },
        { name: t('admin.messages_management'), path: '/admin/messages', icon: MessageSquare },
    ];

    const activeClass = "bg-secondary text-white";
    const inactiveClass = "text-gray-200 hover:bg-primary hover:text-white";

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="flex flex-col w-64 bg-dark text-white">
                <div className="p-4 text-2xl font-bold text-center border-b border-gray-700">
                    {t('admin.dashboard')}
                </div>
                <nav className="flex-1 px-2 py-4 space-y-2">
                    {navLinks.map(link => (
                        <NavLink
                            key={link.path}
                            to={`/admin${link.path === '/admin' ? '' : link.path}`}
                            end={link.path === '/admin'}
                            className={({ isActive }) => `${isActive ? activeClass : inactiveClass} flex items-center px-4 py-2 rounded-md transition-colors`}
                        >
                            <link.icon className="w-5 h-5 ml-2" />
                            <span>{link.name}</span>
                        </NavLink>
                    ))}
                </nav>
                 <div className="p-4 border-t border-gray-700 space-y-2">
                    <Link to="/" className="flex items-center justify-center w-full px-4 py-2 text-white rounded-md bg-secondary hover:bg-opacity-80">
                        <ArrowLeft className="w-5 h-5 ml-2" />
                        {t('admin.back_to_site')}
                    </Link>
                    <button onClick={handleLogout} className="flex items-center justify-center w-full px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700">
                        <LogOut className="w-5 h-5 ml-2" />
                        {t('admin.logout')}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex flex-col flex-1 overflow-y-auto">
                <main className="p-4 md:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;