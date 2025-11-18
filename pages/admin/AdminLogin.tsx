import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { Car, LogIn } from 'lucide-react';

const AdminLogin: React.FC = () => {
    const { t, login, language } = useAppContext();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        const success = login(username, password);
        if (success) {
            navigate('/admin');
        } else {
            setError(t('admin.login_error'));
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-light">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-xl">
                <div className="flex flex-col items-center">
                    <Car className="w-12 h-12 text-secondary" />
                    <h1 className="mt-4 text-2xl font-bold text-center text-primary">{t('admin.login_title')}</h1>
                    <p className={`text-center text-gray-600 ${language === 'ar' ? 'font-cairo' : 'font-sans'}`}>{t('company_name')}</p>
                </div>
                
                {error && <div className="p-3 text-sm text-center text-red-800 bg-red-100 rounded-md">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">{t('admin.username')}</label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-secondary focus:border-secondary"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">{t('admin.password')}</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-secondary focus:border-secondary"
                            required
                        />
                    </div>
                    <div>
                        <button type="submit" className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md shadow-sm bg-secondary hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary">
                            <LogIn className="w-5 h-5 mr-2" />
                            {t('admin.login_button')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;