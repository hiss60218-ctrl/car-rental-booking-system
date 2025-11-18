import React, { useState, FormEvent } from 'react';
import { useAppContext } from '../../context/AppContext';
import type { CarContent } from '../../types';
import { Plus, Edit, Trash2, X } from 'lucide-react';

const ContentFormModal: React.FC<{ content?: CarContent | null; onClose: () => void; }> = ({ content, onClose }) => {
    const { t, addCarContent, updateCarContent, cars, language } = useAppContext();
    const [formData, setFormData] = useState({
        carId: content?.carId.toString() || '',
        titleEn: content?.title.en || '',
        titleAr: content?.title.ar || '',
        contentEn: content?.content.en || '',
        contentAr: content?.content.ar || '',
        seoTextEn: content?.seoText.en || '',
        seoTextAr: content?.seoText.ar || '',
        image: content?.image || '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const contentData = {
            carId: Number(formData.carId),
            title: { en: formData.titleEn, ar: formData.titleAr },
            content: { en: formData.contentEn, ar: formData.contentAr },
            seoText: { en: formData.seoTextEn, ar: formData.seoTextAr },
            image: formData.image,
        };

        if (content) {
            updateCarContent({ ...contentData, id: content.id });
        } else {
            addCarContent(contentData);
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
            <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 mx-4 bg-white rounded-lg shadow-xl">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"><X size={24} /></button>
                <h2 className="mb-6 text-2xl font-bold text-primary">{content ? t('admin.edit_content') : t('admin.add_content')}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                         <div>
                            <label htmlFor="carId">{t('admin.car')}</label>
                            <select id="carId" name="carId" value={formData.carId} onChange={handleChange} className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md" required>
                                <option value="" disabled>-- {t('booking.select_car')} --</option>
                                {cars.map(car => <option key={car.id} value={car.id}>{car.name[language]}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="image">{t('admin.image_url')}</label>
                            <input type="text" id="image" name="image" value={formData.image} onChange={handleChange} className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md" required />
                        </div>
                        <div>
                            <label htmlFor="titleEn">{t('admin.content_title_en')}</label>
                            <input type="text" id="titleEn" name="titleEn" value={formData.titleEn} onChange={handleChange} className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md" required />
                        </div>
                        <div>
                            <label htmlFor="titleAr">{t('admin.content_title_ar')}</label>
                            <input type="text" id="titleAr" name="titleAr" value={formData.titleAr} onChange={handleChange} className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md" required />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="contentEn">{t('admin.content_text_en')}</label>
                        <textarea id="contentEn" name="contentEn" value={formData.contentEn} onChange={handleChange} rows={3} className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md" required />
                    </div>
                     <div>
                        <label htmlFor="contentAr">{t('admin.content_text_ar')}</label>
                        <textarea id="contentAr" name="contentAr" value={formData.contentAr} onChange={handleChange} rows={3} className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md" required />
                    </div>
                    <div>
                        <label htmlFor="seoTextEn">{t('admin.seo_text_en')}</label>
                        <textarea id="seoTextEn" name="seoTextEn" value={formData.seoTextEn} onChange={handleChange} rows={2} className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md" />
                    </div>
                     <div>
                        <label htmlFor="seoTextAr">{t('admin.seo_text_ar')}</label>
                        <textarea id="seoTextAr" name="seoTextAr" value={formData.seoTextAr} onChange={handleChange} rows={2} className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md" />
                    </div>
                    <div className="flex justify-end pt-4 space-x-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 font-semibold text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300">{t('admin.cancel')}</button>
                        <button type="submit" className="px-4 py-2 font-semibold text-white rounded-md bg-secondary hover:bg-opacity-80">{t('admin.save')}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


const AdminContent: React.FC = () => {
    const { t, language, carContent, cars, deleteCarContent } = useAppContext();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedContent, setSelectedContent] = useState<CarContent | null>(null);

    const handleAdd = () => {
        setSelectedContent(null);
        setIsModalOpen(true);
    };

    const handleEdit = (content: CarContent) => {
        setSelectedContent(content);
        setIsModalOpen(true);
    };

    const handleDelete = (contentId: number) => {
        if (window.confirm(t('admin.confirm_delete_content'))) {
            deleteCarContent(contentId);
        }
    };
    
    const getCarName = (carId: number) => cars.find(c => c.id === carId)?.name[language] || 'N/A';

    return (
        <div>
            {isModalOpen && <ContentFormModal content={selectedContent} onClose={() => setIsModalOpen(false)} />}
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-primary">{t('admin.content_management')}</h1>
                <button onClick={handleAdd} className="flex items-center px-4 py-2 font-semibold text-white rounded-md bg-secondary hover:bg-opacity-80">
                    <Plus size={20} className="ml-2" />
                    {t('admin.add_content')}
                </button>
            </div>

            <div className="overflow-x-auto bg-white rounded-lg shadow">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">{t('admin.car')}</th>
                            <th scope="col" className="px-6 py-3">{t('admin.content_title_ar')}</th>
                            <th scope="col" className="px-6 py-3">{t('admin.actions')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {carContent.length > 0 ? carContent.map(content => (
                            <tr key={content.id} className="bg-white border-b hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-900">{getCarName(content.carId)}</td>
                                <td className="px-6 py-4">{content.title[language]}</td>
                                <td className="px-6 py-4">
                                    <div className="flex space-x-2">
                                        <button onClick={() => handleEdit(content)} className="text-blue-600 hover:text-blue-800"><Edit size={18} /></button>
                                        <button onClick={() => handleDelete(content.id)} className="text-red-600 hover:text-red-800"><Trash2 size={18} /></button>
                                    </div>
                                </td>
                            </tr>
                        )) : (
                            <tr><td colSpan={3} className="py-8 text-center text-gray-500">{t('admin.no_content')}</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminContent;