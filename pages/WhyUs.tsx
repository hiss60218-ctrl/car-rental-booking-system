
import React from 'react';
import { useAppContext } from '../context/AppContext';
import type { Strength } from '../types';
import { Car, ShieldCheck, Wrench, Clock, CheckCircle } from 'lucide-react';

const iconMap: { [key: string]: React.ElementType } = {
    Car,
    ShieldCheck,
    Wrench,
    Clock,
    CheckCircle,
};

const StrengthItem: React.FC<{ item: Strength }> = ({ item }) => {
    const Icon = iconMap[item.icon];
    if (!Icon) return null;
    return (
        <div className="flex flex-col items-center p-6 text-center bg-white rounded-lg shadow-md">
            <Icon size={48} className="mb-4 text-secondary" />
            <h3 className="text-xl font-bold text-primary">{item.title}</h3>
        </div>
    );
};

const WhyUs: React.FC = () => {
    const { t } = useAppContext();

    const strengths: Strength[] = [
        { icon: 'Car', title: t('why_us.strength_1') },
        { icon: 'ShieldCheck', title: t('why_us.strength_2') },
        { icon: 'Wrench', title: t('why_us.strength_3') },
        { icon: 'Clock', title: t('why_us.strength_4') },
        { icon: 'CheckCircle', title: t('why_us.strength_5') },
    ];

    return (
        <div className="py-16 bg-light">
            <div className="container px-4 mx-auto">
                <h1 className="mb-4 text-4xl font-bold text-center text-primary">{t('why_us.title')}</h1>
                <p className="mb-12 text-lg text-center text-gray-600">{t('why_us.subtitle')}</p>
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                    {strengths.map((item, index) => (
                        <StrengthItem key={index} item={item} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default WhyUs;
