import { initializeData, cars, branches, offers, siteConfig, addBooking } from './data.js';

// --- STATE & INITIALIZATION ---
let language = localStorage.getItem('language') || 'ar';
let translations = {};

async function init() {
    await initializeData();
    await loadTranslations();
    applyLanguage(language);
    renderSharedComponents();
    routePage();
}

document.addEventListener('DOMContentLoaded', init);

// --- I18N ---
async function loadTranslations() {
    const [en, ar] = await Promise.all([
        fetch('./i18n/en.json').then(res => res.json()),
        fetch('./i18n/ar.json').then(res => res.json())
    ]);
    translations = { en, ar };
}

function t(key) {
    const lang = translations[language] || {};
    return key.split('.').reduce((obj, k) => obj && obj[k], lang) || key;
}

function applyLanguage(lang) {
    language = lang;
    localStorage.setItem('language', lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.body.className = lang === 'ar' ? 'font-cairo bg-light text-dark' : 'font-sans bg-light text-dark';
    document.title = `Estibyan Car Rental | ${t(`nav.${getCurrentPageName()}`)}`;
}

function toggleLanguage() {
    const newLang = language === 'en' ? 'ar' : 'en';
    applyLanguage(newLang);
    renderSharedComponents(); // Re-render for new text
    routePage(); // Re-render page-specific content
}

// --- ROUTING & RENDERING ---

function getCurrentPageName() {
    const path = window.location.pathname.split('/').pop();
    switch (path) {
        case 'index.html':
        case '':
            return 'home';
        case 'fleet.html': return 'fleet';
        case 'branches.html': return 'branches';
        case 'offers.html': return 'offers';
        case 'booking.html': return 'book_now';
        case 'why-us.html': return 'why_us';
        case 'terms.html': return 'terms';
        case 'contact.html': return 'contact';
        case 'about.html': return 'about';
        case 'blog.html': return 'blog';
        default: return 'home';
    }
}

function routePage() {
    const path = window.location.pathname;
    if (path.endsWith('/') || path.endsWith('index.html')) renderHomePage();
    if (path.endsWith('fleet.html')) renderFleetPage();
    if (path.endsWith('branches.html')) renderBranchesPage();
    if (path.endsWith('offers.html')) renderOffersPage();
    if (path.endsWith('booking.html')) renderBookingPage();
    if (path.endsWith('why-us.html')) renderWhyUsPage();
    if (path.endsWith('terms.html')) renderTermsPage();
    if (path.endsWith('contact.html')) renderContactPage();
    if (path.endsWith('about.html')) renderAboutPage();
    if (path.endsWith('blog.html')) renderBlogPage();
}

function renderSharedComponents() {
    renderHeader();
    renderFooter();
}

// --- COMPONENT TEMPLATES ---
function renderHeader() {
    const navLinks = [
        { name: t('nav.home'), path: './index.html' },
        { name: t('nav.fleet'), path: './fleet.html' },
        { name: t('nav.branches'), path: './branches.html' },
        { name: t('nav.offers'), path: './offers.html' },
        { name: t('nav.why_us'), path: './why-us.html' },
        { name: t('nav.contact'), path: './contact.html' },
    ];
    const header = document.getElementById('header-placeholder');
    if (!header) return;

    header.innerHTML = `
        <div class="container px-4 py-4 mx-auto">
            <div class="flex items-center justify-between">
                <a href="./index.html" class="flex items-center gap-2 text-2xl font-bold text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-secondary"><path d="M14 16.5V18a2 2 0 0 1-2 2h-6a2 2 0 0 1-2-2v-12a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.5"/><path d="m22 12-4-4-4 4"/><path d="M18 12v-2a2 2 0 0 0-2-2h-2"/></svg>
                    <span>${t('company_name')}</span>
                </a>
                <nav class="hidden lg:flex items-center gap-6">
                    ${navLinks.map(link => `<a href="${link.path}" class="text-white hover:text-secondary transition-colors font-medium">${link.name}</a>`).join('')}
                </nav>
                <div class="hidden lg:flex items-center gap-4">
                    <button id="lang-switcher" class="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white transition-colors rounded-md bg-primary hover:bg-opacity-80">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
                        ${language === 'en' ? 'العربية' : 'English'}
                    </button>
                    <a href="./booking.html" class="px-4 py-2 font-bold text-white transition-transform duration-300 rounded-md shadow-lg bg-secondary hover:scale-105">${t('nav.book_now')}</a>
                </div>
                <div class="flex items-center lg:hidden">
                    <button id="mobile-menu-btn" class="text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
                    </button>
                </div>
            </div>
        </div>
        <div id="mobile-menu" class="hidden absolute top-full left-0 w-full bg-primary lg:hidden">
             <nav class="flex flex-col items-center px-4 pt-2 pb-4 space-y-2">
                ${navLinks.map(link => `<a href="${link.path}" class="text-white hover:text-secondary block py-2 text-lg">${link.name}</a>`).join('')}
                <div class="flex items-center gap-4 pt-4">
                    <button id="lang-switcher-mobile" class="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white transition-colors rounded-md bg-primary hover:bg-opacity-80">
                         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
                        ${language === 'en' ? 'العربية' : 'English'}
                    </button>
                    <a href="./booking.html" class="px-4 py-2 font-bold text-white transition-transform duration-300 rounded-md shadow-lg bg-secondary hover:scale-105">${t('nav.book_now')}</a>
                </div>
            </nav>
        </div>
    `;

    document.getElementById('lang-switcher')?.addEventListener('click', toggleLanguage);
    document.getElementById('lang-switcher-mobile')?.addEventListener('click', toggleLanguage);
    document.getElementById('mobile-menu-btn')?.addEventListener('click', () => {
        document.getElementById('mobile-menu')?.classList.toggle('hidden');
    });
}

function renderFooter() {
    if (!siteConfig) return;
    const footer = document.getElementById('footer-placeholder');
    if (!footer) return;

    footer.innerHTML = `
        <div class="container px-4 py-12 mx-auto">
            <div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
                <div>
                    <a href="./index.html" class="flex items-center gap-2 text-2xl font-bold text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-secondary"><path d="M14 16.5V18a2 2 0 0 1-2 2h-6a2 2 0 0 1-2-2v-12a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.5"/><path d="m22 12-4-4-4 4"/><path d="M18 12v-2a2 2 0 0 0-2-2h-2"/></svg>
                        <span>${t('company_name')}</span>
                    </a>
                    <p class="mt-4 text-gray-400">${t('home.banner_subtitle')}</p>
                </div>
                <div>
                    <h3 class="text-lg font-bold text-white">${t('footer.quick_links')}</h3>
                    <ul class="mt-4 space-y-2">
                        <li><a href="./about.html" class="hover:text-secondary">${t('nav.about')}</a></li>
                        <li><a href="./fleet.html" class="hover:text-secondary">${t('nav.fleet')}</a></li>
                        <li><a href="./terms.html" class="hover:text-secondary">${t('nav.terms')}</a></li>
                        <li><a href="./contact.html" class="hover:text-secondary">${t('nav.contact')}</a></li>
                    </ul>
                </div>
                <div>
                    <h3 class="text-lg font-bold text-white">${t('nav.contact')}</h3>
                    <ul class="mt-4 space-y-2 text-gray-400">
                        <li>${siteConfig.contact.address[language]}</li>
                        <li>${siteConfig.contact.email}</li>
                        <li>${siteConfig.contact.phone}</li>
                    </ul>
                </div>
                <div>
                    <h3 class="text-lg font-bold text-white">${t('footer.follow_us')}</h3>
                    <div class="flex mt-4 space-x-4 rtl:space-x-reverse">
                        <a href="${siteConfig.social.facebook}" target="_blank" rel="noopener noreferrer" class="text-gray-400 hover:text-secondary"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg></a>
                        <a href="${siteConfig.social.twitter}" target="_blank" rel="noopener noreferrer" class="text-gray-400 hover:text-secondary"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 1.4 3.3 4.4 3.3 4.4s-1.4 1.4-3.3 1.4H6.7c-1.4-1.4-1.4-2.8-1.4-2.8s.7-.7 2.1-1.4-.7-2.1-.7-2.1L8 6l3.3-3.3L12 4l1.4 1.4L17 4l2.1.7.7 2.1Z"/></svg></a>
                        <a href="${siteConfig.social.instagram}" target="_blank" rel="noopener noreferrer" class="text-gray-400 hover:text-secondary"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg></a>
                    </div>
                </div>
            </div>
        </div>
        <div class="py-4 bg-black bg-opacity-20">
            <div class="container px-4 mx-auto text-sm text-center text-gray-400">
                &copy; ${new Date().getFullYear()} ${t('company_name')}. ${t('footer.rights_reserved')}
            </div>
        </div>
    `;
}

// --- PAGE-SPECIFIC RENDERERS ---

function renderHomePage() {
    document.getElementById('home-welcome-title').textContent = t('home.welcome_title');
    document.getElementById('home-banner-subtitle').textContent = t('home.banner_subtitle');
    document.getElementById('home-book-now-btn').textContent = t('nav.book_now');
    document.getElementById('home-features-title').textContent = t('home.features_title');
    document.getElementById('home-follow-us-title').textContent = t('footer.follow_us');
    document.getElementById('home-follow-us-subtitle').textContent = t('home.follow_us_subtitle');

    const features = [
        { icon: '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 16.5V18a2 2 0 0 1-2 2h-6a2 2 0 0 1-2-2v-12a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.5"/><path d="m22 12-4-4-4 4"/><path d="M18 12v-2a2 2 0 0 0-2-2h-2"/></svg>', title: t('home.feature_1_title'), description: t('home.feature_1_desc') },
        { icon: '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2H2v10l9.29 9.29a1 1 0 0 0 1.41 0L22 13.41a1 1 0 0 0 0-1.41z"/><path d="M7 7h.01"/></svg>', title: t('home.feature_2_title'), description: t('home.feature_2_desc') },
        { icon: '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>', title: t('home.feature_3_title'), description: t('home.feature_3_desc') },
        { icon: '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>', title: t('home.feature_4_title'), description: t('home.feature_4_desc') },
    ];
    document.getElementById('features-grid').innerHTML = features.map(f => `
        <div class="p-6 text-center transition-shadow duration-300 bg-white rounded-lg shadow-md hover:shadow-2xl">
            <div class="inline-block p-4 mb-4 rounded-full bg-secondary/20 text-secondary">${f.icon}</div>
            <h3 class="mb-2 text-xl font-bold text-primary">${f.title}</h3>
            <p class="text-gray-600">${f.description}</p>
        </div>
    `).join('');
    
    if (siteConfig) {
        document.getElementById('social-links-container').innerHTML = `
            <a href="${siteConfig.social.facebook}" aria-label="Facebook" target="_blank" rel="noopener noreferrer" class="p-4 transition-transform duration-300 rounded-full bg-primary text-secondary hover:scale-110 hover:bg-secondary hover:text-primary"><svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg></a>
            <a href="${siteConfig.social.twitter}" aria-label="Twitter" target="_blank" rel="noopener noreferrer" class="p-4 transition-transform duration-300 rounded-full bg-primary text-secondary hover:scale-110 hover:bg-secondary hover:text-primary"><svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 1.4 3.3 4.4 3.3 4.4s-1.4 1.4-3.3 1.4H6.7c-1.4-1.4-1.4-2.8-1.4-2.8s.7-.7 2.1-1.4-.7-2.1-.7-2.1L8 6l3.3-3.3L12 4l1.4 1.4L17 4l2.1.7.7 2.1Z"/></svg></a>
            <a href="${siteConfig.social.instagram}" aria-label="Instagram" target="_blank" rel="noopener noreferrer" class="p-4 transition-transform duration-300 rounded-full bg-primary text-secondary hover:scale-110 hover:bg-secondary hover:text-primary"><svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg></a>
        `;
    }
}

function renderFleetPage() {
    document.getElementById('fleet-title').textContent = t('fleet.title');

    const filters = [
        { label: t('fleet.filter_all'), value: 'all' },
        { label: t('fleet.filter_economy'), value: 'economy' },
        { label: t('fleet.filter_suv'), value: 'suv' },
        { label: t('fleet.filter_luxury'), value: 'luxury' },
    ];
    const filtersContainer = document.getElementById('fleet-filters');
    filtersContainer.innerHTML = filters.map(f => `
        <button data-filter="${f.value}" class="px-6 py-2 rounded-full font-semibold transition-colors fleet-filter ${f.value === 'all' ? 'bg-primary text-white' : 'bg-white text-primary border border-primary hover:bg-primary/10'}">
            ${f.label}
        </button>
    `).join('');

    const carsGrid = document.getElementById('cars-grid');
    const renderCars = (filter) => {
        const filteredCars = filter === 'all' ? cars : cars.filter(c => c.category === filter);
        carsGrid.innerHTML = filteredCars.map(car => `
            <div class="overflow-hidden transition-transform duration-300 transform bg-white border rounded-lg shadow-lg hover:scale-105 hover:shadow-xl">
                <img src="${car.images[0]}" alt="${car.name[language]}" class="object-cover w-full h-56" />
                <div class="p-6">
                    <h3 class="text-2xl font-bold text-primary">${car.name[language]}</h3>
                    <div class="grid grid-cols-2 gap-4 mt-4 text-gray-600">
                        <div class="flex items-center gap-2"><span>${t('fleet.fuel')}: ${car.specs.fuel[language]}</span></div>
                        <div class="flex items-center gap-2"><span>${t('fleet.capacity')}: ${car.specs.capacity[language]}</span></div>
                        <div class="flex items-center gap-2"><span>${t('fleet.transmission')}: ${car.specs.transmission[language]}</span></div>
                    </div>
                    <div class="pt-4 mt-4 border-t">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-lg font-bold text-primary">${car.price.daily} ${t('fleet.aed')} <span class="text-sm font-normal text-gray-500">/ ${t('fleet.daily_price')}</span></p>
                                <p class="text-md text-gray-700">${car.price.weekly} ${t('fleet.aed')} <span class="text-sm font-normal text-gray-500">/ ${t('fleet.weekly_price')}</span></p>
                            </div>
                            <a href="./booking.html?carId=${car.id}" class="px-6 py-2 font-bold text-white transition-transform duration-300 rounded-md shadow-lg bg-secondary hover:scale-105">${t('nav.book_now')}</a>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    };

    filtersContainer.addEventListener('click', (e) => {
        const button = e.target.closest('.fleet-filter');
        if (button) {
            document.querySelectorAll('.fleet-filter').forEach(btn => {
                btn.classList.remove('bg-primary', 'text-white');
                btn.classList.add('bg-white', 'text-primary', 'border', 'border-primary', 'hover:bg-primary/10');
            });
            button.classList.add('bg-primary', 'text-white');
            button.classList.remove('bg-white', 'text-primary', 'border', 'border-primary', 'hover:bg-primary/10');
            renderCars(button.dataset.filter);
        }
    });

    renderCars('all');
}

function renderBranchesPage() {
    document.getElementById('branches-title').textContent = t('branches.title');
    document.getElementById('branches-subtitle').textContent = t('branches.find_us');
    document.getElementById('branches-map-alt').alt = t('branches.title');

    document.getElementById('branches-grid').innerHTML = branches.map(branch => `
        <div class="p-6 bg-white rounded-lg shadow-md">
            <h2 class="mb-3 text-2xl font-bold text-primary">${branch.name[language]}</h2>
            <div class="space-y-3 text-gray-700">
                <p class="flex items-start gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mt-1 text-secondary shrink-0"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                    <span>${branch.address[language]}</span>
                </p>
                <p class="flex items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-secondary shrink-0"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                    <span>${t('branches.working_hours')}: ${branch.hours[language]}</span>
                </p>
                <p class="flex items-center gap-3">
                     <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-secondary shrink-0"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                    <span>${t('branches.phone')}: ${branch.phone}</span>
                </p>
            </div>
        </div>
    `).join('');
}

function renderOffersPage() {
    document.getElementById('offers-title').textContent = t('offers.title');
    document.getElementById('offers-subtitle').textContent = t('offers.subtitle');

    document.getElementById('offers-grid').innerHTML = offers.map(offer => `
        <div class="overflow-hidden bg-white rounded-lg shadow-lg">
            <img src="${offer.image}" alt="${offer.title[language]}" class="object-cover w-full h-56" />
            <div class="p-6">
                <h2 class="mb-3 text-2xl font-bold text-primary">${offer.title[language]}</h2>
                <p class="mb-6 text-gray-700">${offer.description[language]}</p>
                <a href="./fleet.html" class="font-bold text-secondary hover:underline">${t('nav.book_now')} &rarr;</a>
            </div>
        </div>
    `).join('');
}

function renderBookingPage() {
    // Populate text content
    document.getElementById('booking-title').textContent = t('booking.title');
    document.getElementById('booking-subtitle').textContent = t('booking.subtitle');
    document.getElementById('select-car-label').textContent = t('booking.select_car');
    document.getElementById('car-details-title').textContent = t('booking.car_details_title');
    document.getElementById('full-name-label').textContent = t('booking.full_name');
    document.getElementById('phone-number-label').textContent = t('booking.phone_number');
    document.getElementById('email-label').textContent = t('booking.email_optional');
    document.getElementById('id-label').textContent = t('booking.id_optional');
    document.getElementById('pickup-location-label').textContent = t('booking.pickup_location');
    document.getElementById('pickup-time-label').textContent = t('booking.pickup_time');
    document.getElementById('dropoff-location-label').textContent = t('booking.dropoff_location');
    document.getElementById('dropoff-time-label').textContent = t('booking.dropoff_time');
    document.getElementById('current-location-label').textContent = t('booking.current_location');
    document.getElementById('notes-label').textContent = t('booking.notes_optional');
    document.getElementById('submit-request-btn').textContent = t('booking.submit_request');
    document.getElementById('booking-success-title').textContent = t('booking.booking_success');
    document.getElementById('booking-success-msg').textContent = t('booking.booking_success_msg');


    const carSelect = document.getElementById('selectCar');
    carSelect.innerHTML = `<option value="" disabled>-- ${t('booking.select_car')} --</option>` + 
        cars.map(car => `<option value="${car.id}">${car.name[language]}</option>`).join('');

    const branchOptions = branches.map(branch => `<option value="${branch.name.en}">${branch.name[language]}</option>`).join('');
    document.getElementById('pickupLocation').innerHTML = branchOptions;
    document.getElementById('dropoffLocation').innerHTML = branchOptions;

    const urlParams = new URLSearchParams(window.location.search);
    const preSelectedCarId = urlParams.get('carId');
    if (preSelectedCarId) {
        carSelect.value = preSelectedCarId;
        updateCarViewer(preSelectedCarId);
    }

    carSelect.addEventListener('change', (e) => updateCarViewer(e.target.value));

    document.getElementById('booking-form').addEventListener('submit', handleBookingSubmit);
    document.getElementById('close-modal-btn').addEventListener('click', () => {
        document.getElementById('success-modal').classList.add('hidden');
    });
}

let currentImageIndex = 0;
let selectedCar = null;

function updateCarViewer(carId) {
    selectedCar = cars.find(c => c.id.toString() === carId) || null;
    const carViewer = document.getElementById('car-viewer');

    if (selectedCar) {
        currentImageIndex = 0;
        carViewer.classList.remove('hidden');
        renderCarImage();
    } else {
        carViewer.classList.add('hidden');
    }
}

function renderCarImage() {
    if (!selectedCar) return;
    document.getElementById('car-image').src = selectedCar.images[currentImageIndex];
    document.getElementById('car-image').alt = selectedCar.name[language];
    
    const controls = document.getElementById('car-image-controls');
    if (selectedCar.images.length > 1) {
        controls.innerHTML = `
            <button type="button" id="prev-image-btn" class="absolute top-1/2 left-2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-1 hover:bg-opacity-75 transition-opacity">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            <button type="button" id="next-image-btn" class="absolute top-1/2 right-2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-1 hover:bg-opacity-75 transition-opacity">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </button>
        `;
        document.getElementById('prev-image-btn').addEventListener('click', prevImage);
        document.getElementById('next-image-btn').addEventListener('click', nextImage);
    } else {
        controls.innerHTML = '';
    }
}

function nextImage() {
    if (selectedCar) {
        currentImageIndex = (currentImageIndex + 1) % selectedCar.images.length;
        renderCarImage();
    }
}

function prevImage() {
    if (selectedCar) {
        currentImageIndex = (currentImageIndex - 1 + selectedCar.images.length) % selectedCar.images.length;
        renderCarImage();
    }
}

function handleBookingSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    addBooking({
        carId: Number(data.carId),
        fullName: data.fullName,
        phoneNumber: data.phoneNumber,
        email: data.email,
        idNumber: data.idNumber,
        pickupLocation: data.pickupLocation,
        pickupTime: data.pickupTime,
        dropoffLocation: data.dropoffLocation,
        dropoffTime: data.dropoffTime,
        currentLocation: data.currentLocation,
        notes: data.notes,
    });
    
    document.getElementById('success-modal').classList.remove('hidden');
    form.reset();
    updateCarViewer(null);
    document.getElementById('selectCar').value = '';
}


function renderWhyUsPage() {
    document.getElementById('whyus-title').textContent = t('why_us.title');
    document.getElementById('whyus-subtitle').textContent = t('why_us.subtitle');

    const strengths = [
        { icon: '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mb-4 text-secondary"><path d="M14 16.5V18a2 2 0 0 1-2 2h-6a2 2 0 0 1-2-2v-12a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.5"/><path d="m22 12-4-4-4 4"/><path d="M18 12v-2a2 2 0 0 0-2-2h-2"/></svg>', title: t('why_us.strength_1') },
        { icon: '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mb-4 text-secondary"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>', title: t('why_us.strength_2') },
        { icon: '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mb-4 text-secondary"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>', title: t('why_us.strength_3') },
        { icon: '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mb-4 text-secondary"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>', title: t('why_us.strength_4') },
        { icon: '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mb-4 text-secondary"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>', title: t('why_us.strength_5') },
    ];

    document.getElementById('strengths-grid').innerHTML = strengths.map(s => `
        <div class="flex flex-col items-center p-6 text-center bg-white rounded-lg shadow-md">
            ${s.icon}
            <h3 class="text-xl font-bold text-primary">${s.title}</h3>
        </div>
    `).join('');
}

function renderTermsPage() {
    document.getElementById('terms-title').textContent = t('terms.title');
    const sections = [
        { title: 'rental_policy', text: 'rental_policy_text' },
        { title: 'renter_req', text: 'renter_req_text' },
        { title: 'cancellation', text: 'cancellation_text' },
        { title: 'insurance', text: 'insurance_text' },
    ];
    document.getElementById('terms-content').innerHTML = sections.map(s => `
        <div>
            <h2 class="mb-2 text-2xl font-bold text-primary">${t(`terms.${s.title}`)}</h2>
            <p class="leading-relaxed text-gray-700">${t(`terms.${s.text}`)}</p>
        </div>
    `).join('');
}

function renderContactPage() {
    document.getElementById('contact-title').textContent = t('contact.title');
    document.getElementById('contact-get-in-touch').textContent = t('contact.get_in_touch');
    document.getElementById('contact-form-name-label').textContent = t('contact.form_name');
    document.getElementById('contact-form-email-label').textContent = t('contact.form_email');
    document.getElementById('contact-form-message-label').textContent = t('contact.form_message');
    document.getElementById('contact-send-message-btn').textContent = t('contact.send_message');
    document.getElementById('contact-our-info').textContent = t('contact.our_info');
    
    if (siteConfig) {
        document.getElementById('contact-info-details').innerHTML = `
            <div class="flex items-start gap-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mt-1 text-secondary"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                <div>
                    <h3 class="font-bold">${t('contact.address_label')}</h3>
                    <p>${siteConfig.contact.address[language]}</p>
                </div>
            </div>
            <div class="flex items-start gap-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mt-1 text-secondary"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                <div>
                    <h3 class="font-bold">${t('contact.email_label')}</h3>
                    <p>${siteConfig.contact.email}</p>
                </div>
            </div>
            <div class="flex items-start gap-4">
                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mt-1 text-secondary"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                <div>
                    <h3 class="font-bold">${t('contact.phone_label')}</h3>
                    <p>${siteConfig.contact.phone}</p>
                </div>
            </div>
        `;
        document.getElementById('contact-social-section').innerHTML = `
            <h3 class="mb-4 font-bold text-white">${t('footer.follow_us')}</h3>
            <div class="flex space-x-4 rtl:space-x-reverse">
                <a href="${siteConfig.social.facebook}" aria-label="Facebook" target="_blank" rel="noopener noreferrer" class="text-gray-300 hover:text-secondary"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg></a>
                <a href="${siteConfig.social.twitter}" aria-label="Twitter" target="_blank" rel="noopener noreferrer" class="text-gray-300 hover:text-secondary"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 1.4 3.3 4.4 3.3 4.4s-1.4 1.4-3.3 1.4H6.7c-1.4-1.4-1.4-2.8-1.4-2.8s.7-.7 2.1-1.4-.7-2.1-.7-2.1L8 6l3.3-3.3L12 4l1.4 1.4L17 4l2.1.7.7 2.1Z"/></svg></a>
                <a href="${siteConfig.social.instagram}" aria-label="Instagram" target="_blank" rel="noopener noreferrer" class="text-gray-300 hover:text-secondary"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg></a>
            </div>
        `;
    }
}

function renderAboutPage() {
    document.getElementById('about-title').textContent = t('about.title');
    document.getElementById('about-intro').textContent = t('about.intro');
    document.getElementById('about-vision-title').textContent = t('about.vision_title');
    document.getElementById('about-vision-text').textContent = t('about.vision_text');
    document.getElementById('about-mission-title').textContent = t('about.mission_title');
    document.getElementById('about-mission-text').textContent = t('about.mission_text');
}

function renderBlogPage() {
    document.getElementById('blog-title').textContent = t('blog.title');
    document.getElementById('blog-subtitle').textContent = t('blog.subtitle');
    const posts = [
        { image: "https://images.unsplash.com/photo-1568605117036-5fe5e7185743?q=80&w=2070&auto=format&fit=crop", titleKey: "blog.post1_title", contentKey: "blog.post1_content" },
        { image: "https://images.unsplash.com/photo-1554224712-589d8f28311a?q=80&w=2070&auto=format&fit=crop", titleKey: "blog.post2_title", contentKey: "blog.post2_content" },
    ];
    document.getElementById('blog-posts-grid').innerHTML = posts.map(post => `
        <div class="overflow-hidden bg-white rounded-lg shadow-lg">
            <img src="${post.image}" alt="${t(post.titleKey)}" class="object-cover w-full h-64" />
            <div class="p-6">
                <h2 class="mb-3 text-2xl font-bold text-primary">${t(post.titleKey)}</h2>
                <p class="mb-4 text-gray-700">${t(post.contentKey)}</p>
                <a href="#" class="font-bold text-secondary hover:underline">${t('blog.read_more')} &rarr;</a>
            </div>
        </div>
    `).join('');
}