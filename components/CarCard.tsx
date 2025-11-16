
import React from 'react';
import { Link } from 'react-router-dom';
import type { Car } from '../types';
import { useAppContext } from '../context/AppContext';
import { Zap, Users, Cog } from 'lucide-react';

interface CarCardProps {
  car: Car;
}

const CarCard: React.FC<CarCardProps> = ({ car }) => {
  const { language, t } = useAppContext();
  const carName = car.name[language];

  return (
    <div className="overflow-hidden transition-transform duration-300 transform bg-white border rounded-lg shadow-lg hover:scale-105 hover:shadow-xl">
      <img src={car.images[0]} alt={`${t('home.welcome_title')} - ${carName}`} className="object-cover w-full h-56" />
      <div className="p-6">
        <h3 className="text-2xl font-bold text-primary">{carName}</h3>
        <div className="grid grid-cols-2 gap-4 mt-4 text-gray-600">
          <div className="flex items-center gap-2">
            <Zap size={18} className="text-secondary" />
            <span>{t('fleet.fuel')}: {car.specs.fuel[language]}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users size={18} className="text-secondary" />
            <span>{t('fleet.capacity')}: {car.specs.capacity[language]}</span>
          </div>
          <div className="flex items-center gap-2">
            <Cog size={18} className="text-secondary" />
            <span>{t('fleet.transmission')}: {car.specs.transmission[language]}</span>
          </div>
        </div>
        <div className="pt-4 mt-4 border-t">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-bold text-primary">
                {car.price.daily} {t('fleet.aed')} <span className="text-sm font-normal text-gray-500">/ {t('fleet.daily_price')}</span>
              </p>
              <p className="text-md text-gray-700">
                {car.price.weekly} {t('fleet.aed')} <span className="text-sm font-normal text-gray-500">/ {t('fleet.weekly_price')}</span>
              </p>
            </div>
            <Link
              to="/booking"
              state={{ selectedCar: car.id }}
              className="px-6 py-2 font-bold text-white transition-transform duration-300 rounded-md shadow-lg bg-secondary hover:scale-105"
            >
              {t('nav.book_now')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarCard;