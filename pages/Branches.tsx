import React from 'react';
import { useAppContext } from '../context/AppContext';
import { MapPin, Clock, Phone } from 'lucide-react';

const Branches: React.FC = () => {
    const { t, language, branches } = useAppContext();
    
    return (
        <div className="py-16 bg-light">
            <div className="container px-4 mx-auto">
                <h1 className="mb-4 text-4xl font-bold text-center text-primary">{t('branches.title')}</h1>
                <p className="mb-12 text-lg text-center text-gray-600">{t('branches.find_us')}</p>

                <div className="mb-12 overflow-hidden rounded-lg shadow-lg">
                    <img src="https://images.unsplash.com/photo-1517524206127-48bbd363f3d7?q=80&w=2070&auto=format&fit=crop" alt={t('branches.title')} className="object-cover w-full h-64" />
                </div>

                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {branches.map(branch => (
                        <div key={branch.id} className="p-6 bg-white rounded-lg shadow-md">
                            <h2 className="mb-3 text-2xl font-bold text-primary">{branch.name[language]}</h2>
                            <div className="space-y-3 text-gray-700">
                                <p className="flex items-start gap-3">
                                    <MapPin className="mt-1 text-secondary shrink-0" size={20} />
                                    <span>{branch.address[language]}</span>
                                </p>
                                <p className="flex items-center gap-3">
                                    <Clock className="text-secondary shrink-0" size={20} />
                                    <span>{t('branches.working_hours')}: {branch.hours[language]}</span>
                                </p>
                                <p className="flex items-center gap-3">
                                    <Phone className="text-secondary shrink-0" size={20} />
                                    <span>{t('branches.phone')}: {branch.phone}</span>
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Branches;