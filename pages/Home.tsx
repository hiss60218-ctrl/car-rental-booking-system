
import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import type { Feature } from '../types';
import { Car, Tag, MapPin, Phone, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const TikTokIcon = (props: React.ComponentProps<'svg'>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91 0 .08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.01-1.58-.01-3.2-.01-4.8 0-.46-.05-.92-.12-1.37-.47-2.55-2.62-4.34-5.18-4.38H12.525zM12.525 8.02c.01 1.58.01 3.19.01 4.79 0 .45.05.9.12 1.34.46 2.5 2.59 4.3 5.09 4.5v4.03c-1.44-.05-2.89-.35-4.2-.97-.01-1.58-.01-3.2-.01-4.8 0-.46-.05-.92-.12-1.37-.47-2.55-2.62-4.34-5.18-4.38H12.525z" />
    </svg>
);

const iconMap: { [key: string]: React.ElementType } = {
    Car,
    Tag,
    MapPin,
    Phone,
};

const FeatureCard: React.FC<{ feature: Feature }> = ({ feature }) => {
    const Icon = iconMap[feature.icon];
    if (!Icon) return null;
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
    const { t, siteConfig } = useAppContext();

    const features: Feature[] = [
        { icon: 'Car', title: t('home.feature_1_title'), description: t('home.feature_1_desc') },
        { icon: 'Tag', title: t('home.feature_2_title'), description: t('home.feature_2_desc') },
        { icon: 'MapPin', title: t('home.feature_3_title'), description: t('home.feature_3_desc') },
        { icon: 'Phone', title: t('home.feature_4_title'), description: t('home.feature_4_desc') },
    ];

    return (
        <div>
            {/* Hero Banner */}
            <section className="relative flex items-center justify-center h-[60vh] text-white bg-center bg-cover" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2070&auto=format&fit=crop')" }}>
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
            
            {/* Follow Us Section */}
            <section className="py-16 bg-white">
                <div className="container px-4 mx-auto text-center">
                    <h2 className="mb-4 text-3xl font-bold text-primary">{t('footer.follow_us')}</h2>
                    <p className="max-w-2xl mx-auto mb-8 text-lg text-gray-600">{t('home.follow_us_subtitle')}</p>
                    {siteConfig && (
                        <div className="flex justify-center gap-6">
                            <a href={siteConfig.social.facebook} aria-label="Facebook" target="_blank" rel="noopener noreferrer" className="p-4 transition-transform duration-300 rounded-full bg-primary text-secondary hover:scale-110 hover:bg-secondary hover:text-primary">
                                <Facebook size={28} />
                            </a>
                            <a href={siteConfig.social.twitter} aria-label="Twitter" target="_blank" rel="noopener noreferrer" className="p-4 transition-transform duration-300 rounded-full bg-primary text-secondary hover:scale-110 hover:bg-secondary hover:text-primary">
                                <Twitter size={28} />
                            </a>
                            <a href={siteConfig.social.instagram} aria-label="Instagram" target="_blank" rel="noopener noreferrer" className="p-4 transition-transform duration-300 rounded-full bg-primary text-secondary hover:scale-110 hover:bg-secondary hover:text-primary">
                                <Instagram size={28} />
                            </a>
                            <a href={siteConfig.social.linkedin} aria-label="LinkedIn" target="_blank" rel="noopener noreferrer" className="p-4 transition-transform duration-300 rounded-full bg-primary text-secondary hover:scale-110 hover:bg-secondary hover:text-primary">
                                <Linkedin size={28} />
                            </a>
                            <a href={siteConfig.social.tiktok} aria-label="TikTok" target="_blank" rel="noopener noreferrer" className="p-4 transition-transform duration-300 rounded-full bg-primary text-secondary hover:scale-110 hover:bg-secondary hover:text-primary">
                                <TikTokIcon />
                            </a>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Home;
