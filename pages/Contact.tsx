import React from 'react';
import { useAppContext } from '../context/AppContext';
import { MapPin, Mail, Phone } from 'lucide-react';

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
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;