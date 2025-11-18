import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Facebook, Twitter, Instagram, Linkedin, Car } from 'lucide-react';

const TikTokIcon = (props: React.ComponentProps<'svg'>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91 0 .08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.01-1.58-.01-3.2-.01-4.8 0-.46-.05-.92-.12-1.37-.47-2.55-2.62-4.34-5.18-4.38H12.525zM12.525 8.02c.01 1.58.01 3.19.01 4.79 0 .45.05.9.12 1.34.46 2.5 2.59 4.3 5.09 4.5v4.03c-1.44-.05-2.89-.35-4.2-.97-.01-1.58-.01-3.2-.01-4.8 0-.46-.05-.92-.12-1.37-.47-2.55-2.62-4.34-5.18-4.38H12.525z" />
    </svg>
);

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
                            <a href={siteConfig.social.tiktok} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-secondary"><TikTokIcon /></a>
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