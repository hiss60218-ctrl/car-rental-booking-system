import React from 'react';
import { useAppContext } from '../context/AppContext';
import { MapPin, Mail, Phone, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

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

const Contact: React.FC = () => {
    const { t, language, siteConfig } = useAppContext();

    if (!siteConfig) return null;

    return (
        <div className="py-16 bg-light">
            <div className="container px-4 mx-auto">
                <h1 className="mb-12 text-4xl font-bold text-center text-primary">{t('contact.title')}</h1>
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
                    {/* Contact Form */}
                    <div className="p-8 bg-white rounded-lg shadow-lg">
                        <h2 className="mb-6 text-2xl font-bold text-primary">{t('contact.get_in_touch')}</h2>
                        <form className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block mb-2 font-semibold text-gray-700">{t('contact.form_name')}</label>
                                <input type="text" id="name" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-secondary focus:border-secondary" required />
                            </div>
                            <div>
                                <label htmlFor="email" className="block mb-2 font-semibold text-gray-700">{t('contact.form_email')}</label>
                                <input type="email" id="email" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-secondary focus:border-secondary" required />
                            </div>
                            <div>
                                <label htmlFor="message" className="block mb-2 font-semibold text-gray-700">{t('contact.form_message')}</label>
                                <textarea id="message" rows={5} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-secondary focus:border-secondary" required></textarea>
                            </div>
                            <button type="submit" className="w-full px-8 py-3 text-lg font-bold text-white transition-transform duration-300 rounded-md shadow-lg bg-secondary hover:scale-105">
                                {t('contact.send_message')}
                            </button>
                        </form>
                    </div>

                    {/* Contact Info */}
                    <div className="p-8 bg-primary text-light rounded-lg shadow-lg">
                        <h2 className="mb-6 text-2xl font-bold text-white">{t('contact.our_info')}</h2>
                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <MapPin className="mt-1 text-secondary" size={24} />
                                <div>
                                    <h3 className="font-bold">{t('contact.address_label')}</h3>
                                    <p>{siteConfig.contact.address[language]}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <Mail className="mt-1 text-secondary" size={24} />
                                <div>
                                    <h3 className="font-bold">{t('contact.email_label')}</h3>
                                    <p>{siteConfig.contact.email}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <Phone className="mt-1 text-secondary" size={24} />
                                <div>
                                    <h3 className="font-bold">{t('contact.phone_label')}</h3>
                                    <p>{siteConfig.contact.phone}</p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 mt-6 border-t border-gray-600">
                             <h3 className="mb-4 font-bold text-white">{t('footer.follow_us')}</h3>
                             <div className="flex space-x-4 rtl:space-x-reverse">
                                <a href={siteConfig.social.facebook} aria-label="Facebook" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-secondary"><Facebook size={24} /></a>
                                <a href={siteConfig.social.twitter} aria-label="Twitter" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-secondary"><Twitter size={24} /></a>
                                <a href={siteConfig.social.instagram} aria-label="Instagram" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-secondary"><Instagram size={24} /></a>
                                <a href={siteConfig.social.linkedin} aria-label="LinkedIn" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-secondary"><Linkedin size={24} /></a>
                                <a href={siteConfig.social.tiktok} aria-label="TikTok" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-secondary"><TikTokIcon /></a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;