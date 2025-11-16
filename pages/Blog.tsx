
import React from 'react';
import { useAppContext } from '../context/AppContext';

interface BlogPost {
    id: number;
    image: string;
    titleKey: string;
    contentKey: string;
}

const blogPosts: BlogPost[] = [
    {
        id: 1,
        image: "https://images.unsplash.com/photo-1568605117036-5fe5e7185743?q=80&w=2070&auto=format&fit=crop",
        titleKey: "blog.post1_title",
        contentKey: "blog.post1_content",
    },
    {
        id: 2,
        image: "https://images.unsplash.com/photo-1554224712-589d8f28311a?q=80&w=2070&auto=format&fit=crop",
        titleKey: "blog.post2_title",
        contentKey: "blog.post2_content",
    }
];

const Blog: React.FC = () => {
    const { t } = useAppContext();

    return (
        <div className="py-16 bg-light">
            <div className="container px-4 mx-auto">
                <h1 className="mb-4 text-4xl font-bold text-center text-primary">{t('blog.title')}</h1>
                <p className="mb-12 text-lg text-center text-gray-600">{t('blog.subtitle')}</p>
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                    {blogPosts.map(post => (
                        <div key={post.id} className="overflow-hidden bg-white rounded-lg shadow-lg">
                            <img src={post.image} alt={t(post.titleKey)} className="object-cover w-full h-64" />
                            <div className="p-6">
                                <h2 className="mb-3 text-2xl font-bold text-primary">{t(post.titleKey)}</h2>
                                <p className="mb-4 text-gray-700">{t(post.contentKey)}</p>
                                <a href="#" className="font-bold text-secondary hover:underline">{t('blog.read_more')} &rarr;</a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Blog;