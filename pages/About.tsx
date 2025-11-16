
import React from 'react';
import { useAppContext } from '../context/AppContext';

const About: React.FC = () => {
    const { t } = useAppContext();

    return (
        <div className="py-16 bg-light">
            <div className="container px-4 mx-auto">
                <div className="max-w-4xl p-8 mx-auto bg-white rounded-lg shadow-lg">
                    <h1 className="mb-6 text-4xl font-bold text-center text-primary">{t('about.title')}</h1>
                    <div className="space-y-6 text-lg leading-relaxed text-gray-700">
                        <p>{t('about.intro')}</p>
                        
                        <div className="p-6 rounded-md bg-primary/5">
                            <h2 className="mb-2 text-2xl font-bold text-primary">{t('about.vision_title')}</h2>
                            <p>{t('about.vision_text')}</p>
                        </div>

                        <div className="p-6 rounded-md bg-secondary/5">
                            <h2 className="mb-2 text-2xl font-bold text-primary">{t('about.mission_title')}</h2>
                            <p>{t('about.mission_text')}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;