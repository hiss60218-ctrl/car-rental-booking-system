import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Menu, X, Globe, Car } from 'lucide-react';

const LanguageSwitcher: React.FC = () => {
    const { language, setLanguage } = useAppContext();

    const toggleLanguage = () => {
        setLanguage(language === 'en' ? 'ar' : 'en');
    };

    return (
        <button
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white transition-colors rounded-md bg-primary hover:bg-opacity-80"
        >
            <Globe size={16} />
            {language === 'en' ? 'العربية' : 'English'}
        </button>
    );
};

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t, language } = useAppContext();

  const navLinks = [
    { name: t('nav.home'), path: '/' },
    { name: t('nav.fleet'), path: '/fleet' },
    { name: t('nav.branches'), path: '/branches' },
    { name: t('nav.offers'), path: '/offers' },
    { name: t('nav.why_us'), path: '/why-us' },
    { name: t('nav.contact'), path: '/contact' },
  ];

  const activeLinkClass = "text-secondary";
  const inactiveLinkClass = "text-white hover:text-secondary transition-colors";

  return (
    <header className="sticky top-0 z-50 shadow-md bg-primary">
      <div className="container px-4 py-4 mx-auto">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-white">
            <Car className="text-secondary" size={32} />
            <span className={language === 'ar' ? 'font-cairo' : 'font-sans'}>{t('company_name')}</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                end
                className={({ isActive }) => `${isActive ? activeLinkClass : inactiveLinkClass} font-medium`}
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-4">
            <LanguageSwitcher />
            <Link to="/booking" className="px-4 py-2 font-bold text-white transition-transform duration-300 rounded-md shadow-lg bg-secondary hover:scale-105">
              {t('nav.book_now')}
            </Link>
          </div>
          
          <div className="flex items-center lg:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white">
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-primary lg:hidden">
          <nav className="flex flex-col items-center px-4 pt-2 pb-4 space-y-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                end
                className={({ isActive }) => `${isActive ? activeLinkClass : inactiveLinkClass} block py-2 text-lg`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </NavLink>
            ))}
            <div className="flex items-center gap-4 pt-4">
              <LanguageSwitcher />
              <Link to="/booking" className="px-4 py-2 font-bold text-white transition-transform duration-300 rounded-md shadow-lg bg-secondary hover:scale-105" onClick={() => setIsMenuOpen(false)}>
                {t('nav.book_now')}
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;