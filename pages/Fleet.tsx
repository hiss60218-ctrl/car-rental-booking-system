import React, { useState } from 'react';
import CarCard from '../components/CarCard';
import { useAppContext } from '../context/AppContext';
import type { Car } from '../types';

type Category = 'all' | 'economy' | 'suv' | 'luxury';

const Fleet: React.FC = () => {
    const { t, cars } = useAppContext();
    const [activeFilter, setActiveFilter] = useState<Category>('all');
    
    const filters: { label: string; value: Category }[] = [
        { label: t('fleet.filter_all'), value: 'all' },
        { label: t('fleet.filter_economy'), value: 'economy' },
        { label: t('fleet.filter_suv'), value: 'suv' },
        { label: t('fleet.filter_luxury'), value: 'luxury' },
    ];

    const filteredCars: Car[] = activeFilter === 'all'
        ? cars
        : cars.filter(car => car.category === activeFilter);

    return (
        <div className="py-16 bg-light">
            <div className="container px-4 mx-auto">
                <h1 className="mb-4 text-4xl font-bold text-center text-primary">{t('fleet.title')}</h1>
                <div className="flex flex-wrap justify-center gap-2 mb-12">
                    {filters.map(filter => (
                        <button
                            key={filter.value}
                            onClick={() => setActiveFilter(filter.value)}
                            className={`px-6 py-2 rounded-full font-semibold transition-colors ${
                                activeFilter === filter.value
                                ? 'bg-primary text-white'
                                : 'bg-white text-primary border border-primary hover:bg-primary/10'
                            }`}
                        >
                            {filter.label}
                        </button>
                    ))}
                </div>
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {filteredCars.map(car => (
                        <CarCard key={car.id} car={car} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Fleet;