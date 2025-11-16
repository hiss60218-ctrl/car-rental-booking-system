
import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const NotFound: React.FC = () => {
    const { language } = useAppContext();
    return (
        <div className="flex flex-col items-center justify-center h-screen text-center bg-light">
            <h1 className="text-6xl font-bold text-primary">404</h1>
            <h2 className="mt-4 text-2xl font-semibold text-dark">
                {language === 'ar' ? 'الصفحة غير موجودة' : 'Page Not Found'}
            </h2>
            <p className="mt-2 text-gray-600">
                {language === 'ar' ? 'عذراً، الصفحة التي تبحث عنها غير موجودة.' : 'Sorry, the page you are looking for does not exist.'}
            </p>
            <Link to="/" className="px-6 py-3 mt-8 font-bold text-white transition-transform duration-300 rounded-md shadow-lg bg-secondary hover:scale-105">
                {language === 'ar' ? 'العودة إلى الرئيسية' : 'Go Back Home'}
            </Link>
        </div>
    );
};

export default NotFound;