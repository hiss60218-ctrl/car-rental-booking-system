
import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import type { Feature } from '../types';
import { Car, Tag, MapPin, Phone } from 'lucide-react';

const FeatureCard: React.FC<{ feature: Feature }> = ({ feature }) => {
    const Icon = feature.icon;
    return (
        <div className="p-6 text-center transition-shadow duration-300 bg-white rounded-lg shadow-md hover:shadow-2xl">
            <div className="inline-block p-4 mb-4 rounded-full bg-secondary/20 text-secondary">
                <Icon size={40} />
            </div>
            <h3 className="mb-2 text-xl font-bold text-primary">{feature.title}</h3>
            <p className="text-gray-600">{feature.description}</p>
        </div>
    );
};

const Home: React.FC = () => {
    const { t } = useAppContext();

    const features: Feature[] = [
        { icon: Car, title: t('home.feature_1_title'), description: t('home.feature_1_desc') },
        { icon: Tag, title: t('home.feature_2_title'), description: t('home.feature_2_desc') },
        { icon: MapPin, title: t('home.feature_3_title'), description: t('home.feature_3_desc') },
        { icon: Phone, title: t('home.feature_4_title'), description: t('home.feature_4_desc') },
    ];

    return (
        <div>
            {/* Hero Banner */}
            <section className="relative flex items-center justify-center h-[60vh] text-white bg-center bg-cover" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=2070&auto=format&fit=crop')" }}>
                <div className="absolute inset-0 bg-black opacity-50"></div>
                <div className="relative z-10 text-center">
                    <h1 className="text-4xl font-bold leading-tight md:text-6xl">{t('home.welcome_title')}</h1>
                    <p className="mt-4 text-lg md:text-xl">{t('home.banner_subtitle')}</p>
                    <Link to="/booking" className="inline-block px-8 py-3 mt-8 text-lg font-bold text-white transition-transform duration-300 rounded-md shadow-lg bg-secondary hover:scale-105">
                        {t('nav.book_now')}
                    </Link>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 bg-light">
                <div className="container px-4 mx-auto">
                    <h2 className="mb-12 text-3xl font-bold text-center text-primary">{t('home.features_title')}</h2>
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
                        {features.map((feature, index) => (
                            <FeatureCard key={index} feature={feature} />
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;