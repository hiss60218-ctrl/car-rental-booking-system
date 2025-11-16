
import React from 'react';
import { useAppContext } from '../context/AppContext';

const Terms: React.FC = () => {
    const { t } = useAppContext();
    
    const termsSections = [
        { title: 'rental_policy', text: 'rental_policy_text' },
        { title: 'renter_req', text: 'renter_req_text' },
        { title: 'cancellation', text: 'cancellation_text' },
        { title: 'insurance', text: 'insurance_text' },
    ];

    return (
        <div className="py-16 bg-light">
            <div className="container px-4 mx-auto">
                <div className="max-w-4xl mx-auto">
                    <h1 className="mb-8 text-4xl font-bold text-center text-primary">{t('terms.title')}</h1>
                    <div className="p-8 space-y-6 bg-white rounded-lg shadow-lg">
                        {termsSections.map(section => (
                            <div key={section.title}>
                                <h2 className="mb-2 text-2xl font-bold text-primary">{t(`terms.${section.title}`)}</h2>
                                <p className="leading-relaxed text-gray-700">{t(`terms.${section.text}`)}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Terms;