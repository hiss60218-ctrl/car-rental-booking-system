import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Link } from 'react-router-dom';

const Offers: React.FC = () => {
    const { t, language, offers } = useAppContext();

    return (
        <div className="py-16 bg-light">
            <div className="container px-4 mx-auto">
                <h1 className="mb-4 text-4xl font-bold text-center text-primary">{t('offers.title')}</h1>
                <p className="mb-12 text-lg text-center text-gray-600">{t('offers.subtitle')}</p>
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {offers.map(offer => (
                        <div key={offer.id} className="overflow-hidden bg-white rounded-lg shadow-lg">
                            <img src={offer.image} alt={offer.title[language]} className="object-cover w-full h-56" />
                            <div className="p-6">
                                <h2 className="mb-3 text-2xl font-bold text-primary">{offer.title[language]}</h2>
                                <p className="mb-6 text-gray-700">{offer.description[language]}</p>
                                <Link to="/fleet" className="font-bold text-secondary hover:underline">
                                    {t('nav.book_now')} &rarr;
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Offers;