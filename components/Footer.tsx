import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Facebook, Twitter, Instagram, Linkedin, Car } from 'lucide-react';

const Footer: React.FC = () => {
    const { t, language, siteConfig } = useAppContext();

    if (!siteConfig) return null;

    return (
        <footer className="bg-dark text-light">
            <div className="container px-4 py-12 mx-auto">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
                    <div>
                        <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-white">
                            <Car className="text-secondary" size={32} />
                            <span>{t('company_name')}</span>
                        </Link>
                        <p className="mt-4 text-gray-400">{t('home.banner_subtitle')}</p>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white">{t('footer.quick_links')}</h3>
                        <ul className="mt-4 space-y-2">
                            <li><Link to="/about" className="hover:text-secondary">{t('nav.about')}</Link></li>
                            <li><Link to="/fleet" className="hover:text-secondary">{t('nav.fleet')}</Link></li>
                            <li><Link to="/terms" className="hover:text-secondary">{t('nav.terms')}</Link></li>
                            <li><Link to="/contact" className="hover:text-secondary">{t('nav.contact')}</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white">{t('nav.contact')}</h3>
                        <ul className="mt-4 space-y-2 text-gray-400">
                            <li>{siteConfig.contact.address[language]}</li>
                            <li>{siteConfig.contact.email}</li>
                            <li>{siteConfig.contact.phone}</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white">{t('footer.follow_us')}</h3>
                        <div className="flex mt-4 space-x-4 rtl:space-x-reverse">
                            <a href={siteConfig.social.facebook} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-secondary"><Facebook /></a>
                            <a href={siteConfig.social.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-secondary"><Twitter /></a>
                            <a href={siteConfig.social.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-secondary"><Instagram /></a>
                            <a href={siteConfig.social.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-secondary"><Linkedin /></a>
                        </div>
                    </div>
                </div>
            </div>
            <div className="py-4 bg-black bg-opacity-20">
                <div className="container px-4 mx-auto text-sm text-center text-gray-400">
                    &copy; {new Date().getFullYear()} {t('company_name')}. {t('footer.rights_reserved')}
                </div>
            </div>
        </footer>
    );
};

export default Footer;