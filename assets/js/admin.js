import * as data from './data.js';

// --- STATE & INITIALIZATION ---
let language = localStorage.getItem('language') || 'ar';
let translations = {};
let currentPage = '';

async function init() {
    const isLoginPage = window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/');
    // Adjust data path based on current location (root vs admin subdir)
    const dataPathPrefix = isLoginPage ? './' : '../';

    await data.initializeData(dataPathPrefix);
    await loadTranslations(dataPathPrefix);
    applyLanguage(language);

    if (isAuthenticated()) {
        document.getElementById('login-section')?.classList.add('hidden');
        document.getElementById('admin-panel')?.classList.remove('hidden');
        document.getElementById('admin-panel')?.classList.add('flex');
        renderSidebar();
        routeAdminPage();
    } else {
        if (!isLoginPage) {
            window.location.href = './index.html'; // Redirect to login
            return;
        }
        document.getElementById('admin-panel')?.classList.add('hidden');
        document.getElementById('login-section')?.classList.remove('hidden');
        renderLoginForm();
    }
}

document.addEventListener('DOMContentLoaded', init);


// --- I18N ---
async function loadTranslations(prefix = './') {
    const [en, ar] = await Promise.all([
        fetch(`${prefix}i18n/en.json`).then(res => res.json()),
        fetch(`${prefix}i18n/ar.json`).then(res => res.json())
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
    document.body.className = lang === 'ar' ? 'font-cairo bg-light' : 'font-sans bg-light';
}

// --- AUTHENTICATION ---
function isAuthenticated() {
    return localStorage.getItem('isAdminAuthenticated') === 'true';
}

function login(user, pass) {
    if (user === 'admin' && pass === 'password') {
        localStorage.setItem('isAdminAuthenticated', 'true');
        window.location.reload();
        return true;
    }
    return false;
}

function logout() {
    localStorage.removeItem('isAdminAuthenticated');
    window.location.href = './index.html';
}

// --- ROUTING & RENDERING ---
function routeAdminPage() {
    const path = window.location.pathname;
    if (path.endsWith('/') || path.endsWith('index.html')) {
        currentPage = 'dashboard';
        renderDashboard();
    } else if (path.endsWith('cars.html')) {
        currentPage = 'cars';
        renderCarsPage();
    } else if (path.endsWith('customers.html')) {
        currentPage = 'customers';
        renderCustomersPage();
    } else if (path.endsWith('content.html')) {
        currentPage = 'content';
        renderContentPage();
    } else if (path.endsWith('settings.html')) {
        currentPage = 'settings';
        renderSettingsPage();
    }
}

// --- SHARED ADMIN COMPONENTS ---
function renderSidebar() {
    const sidebar = document.getElementById('admin-sidebar');
    if (!sidebar) return;

    const navLinks = [
        { name: t('admin.dashboard'), path: './index.html', page: 'dashboard' },
        { name: t('admin.cars_management'), path: './cars.html', page: 'cars' },
        { name: t('admin.customers_management'), path: './customers.html', page: 'customers' },
        { name: t('admin.content_management'), path: './content.html', page: 'content' },
        { name: t('admin.messages_management'), path: './settings.html', page: 'settings' },
    ];
    
    sidebar.innerHTML = `
        <div class="p-4 text-2xl font-bold text-center border-b border-gray-700">
            ${t('admin.dashboard')}
        </div>
        <nav class="flex-1 px-2 py-4 space-y-2">
            ${navLinks.map(link => `
                <a href="${link.path}" class="flex items-center px-4 py-2 rounded-md transition-colors ${currentPage === link.page ? 'bg-secondary text-white' : 'text-gray-200 hover:bg-primary hover:text-white'}">
                    <span>${link.name}</span>
                </a>
            `).join('')}
        </nav>
        <div class="p-4 border-t border-gray-700 space-y-2">
            <a href="../index.html" class="flex items-center justify-center w-full px-4 py-2 text-white rounded-md bg-secondary hover:bg-opacity-80">
                <span>${t('admin.back_to_site')}</span>
            </a>
            <button id="logout-btn" class="flex items-center justify-center w-full px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700">
                <span>${t('admin.logout')}</span>
            </button>
        </div>
    `;

    document.getElementById('logout-btn').addEventListener('click', logout);
}

// --- LOGIN PAGE ---
function renderLoginForm() {
    document.getElementById('login-title').textContent = t('admin.login_title');
    document.getElementById('login-company-name').textContent = t('company_name');
    document.getElementById('login-username-label').textContent = t('admin.username');
    document.getElementById('login-password-label').textContent = t('admin.password');
    document.getElementById('login-button').textContent = t('admin.login_button');

    const form = document.getElementById('login-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = form.elements.username.value;
        const password = form.elements.password.value;
        const errorDiv = document.getElementById('login-error');
        
        if (!login(username, password)) {
            errorDiv.textContent = t('admin.login_error');
            errorDiv.classList.remove('hidden');
        } else {
            errorDiv.classList.add('hidden');
        }
    });
}

// --- DASHBOARD PAGE ---
function renderDashboard() {
    document.getElementById('admin-welcome').textContent = t('admin.welcome');
    const statsGrid = document.getElementById('stats-grid');
    
    const lateCustomersCount = data.customers.filter(c => {
        const remaining = c.totalAmount - c.paidAmount;
        const isLate = new Date(c.returnDate) < new Date();
        return isLate && remaining > 0;
    }).length;
    const totalEarnings = data.customers.reduce((acc, curr) => acc + curr.paidAmount, 0);

    const stats = [
        { title: t('admin.total_cars'), value: data.cars.length, path: './cars.html' },
        { title: t('admin.total_customers'), value: data.customers.length, path: './customers.html' },
        { title: t('admin.late_customers'), value: lateCustomersCount, path: './customers.html' },
        { title: t('admin.total_earnings'), value: `${totalEarnings} ${t('fleet.aed')}`, path: './customers.html' }
    ];

    statsGrid.innerHTML = stats.map(stat => `
        <a href="${stat.path}" class="block p-6 transition-transform transform bg-white rounded-lg shadow-md hover:scale-105">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-sm font-medium text-gray-500">${stat.title}</p>
                    <p class="text-3xl font-bold text-primary">${stat.value}</p>
                </div>
            </div>
        </a>
    `).join('');
}


// --- CARS PAGE ---

function renderCarsPage() {
    document.getElementById('cars-title').textContent = t('admin.cars_management');
    const addBtn = document.getElementById('add-car-btn');
    addBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2"><path d="M5 12h14"/><path d="M12 5v14"/></svg> ${t('admin.add_car')}`;
    addBtn.addEventListener('click', () => openCarModal());

    const tableHead = document.getElementById('cars-table-head');
    tableHead.innerHTML = `
        <tr>
            <th scope="col" class="px-6 py-3">${t('admin.car')}</th>
            <th scope="col" class="px-6 py-3">${t('admin.category')}</th>
            <th scope="col" class="px-6 py-3">${t('fleet.daily_price')}</th>
            <th scope="col" class="px-6 py-3">${t('admin.actions')}</th>
        </tr>
    `;
    renderCarsTable();
}

function renderCarsTable() {
    const tableBody = document.getElementById('cars-table-body');
    tableBody.innerHTML = data.cars.map(car => `
        <tr class="bg-white border-b hover:bg-gray-50">
            <td class="px-6 py-4 font-medium text-gray-900">${car.name[language]}</td>
            <td class="px-6 py-4">${t(`fleet.filter_${car.category}`)}</td>
            <td class="px-6 py-4">${car.price.daily} ${t('fleet.aed')}</td>
            <td class="px-6 py-4">
                <div class="flex space-x-2">
                    <button class="edit-car-btn text-blue-600 hover:text-blue-800" data-id="${car.id}">Edit</button>
                    <button class="delete-car-btn text-red-600 hover:text-red-800" data-id="${car.id}">Delete</button>
                </div>
            </td>
        </tr>
    `).join('');

    document.querySelectorAll('.edit-car-btn').forEach(btn => btn.addEventListener('click', (e) => {
        const car = data.cars.find(c => c.id == e.target.dataset.id);
        openCarModal(car);
    }));
    document.querySelectorAll('.delete-car-btn').forEach(btn => btn.addEventListener('click', (e) => {
        if (confirm(t('admin.confirm_delete'))) {
            data.deleteCar(Number(e.target.dataset.id));
            renderCarsTable();
        }
    }));
}

function openCarModal(car = null) {
    const modal = document.getElementById('car-modal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.getElementById('close-car-modal').onclick = () => {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    };
    
    document.getElementById('car-modal-title').textContent = car ? t('admin.edit_car') : t('admin.add_car');
    
    const formFields = [
      { name: 'nameEn', label: t('admin.car_name_en'), required: true, value: car?.name.en || '' },
      { name: 'nameAr', label: t('admin.car_name_ar'), required: true, value: car?.name.ar || '' },
      { name: 'images', label: t('admin.images'), required: true, value: car?.images.join(', ') || '' },
      { name: 'fuelEn', label: t('admin.fuel_en'), required: true, value: car?.specs.fuel.en || '' },
      { name: 'fuelAr', label: t('admin.fuel_ar'), required: true, value: car?.specs.fuel.ar || '' },
      { name: 'capacityEn', label: t('admin.capacity_en'), required: true, value: car?.specs.capacity.en || '' },
      { name: 'capacityAr', label: t('admin.capacity_ar'), required: true, value: car?.specs.capacity.ar || '' },
      { name: 'transmissionEn', label: t('admin.transmission_en'), required: true, value: car?.specs.transmission.en || '' },
      { name: 'transmissionAr', label: t('admin.transmission_ar'), required: true, value: car?.specs.transmission.ar || '' },
      { name: 'priceDaily', label: t('admin.price_daily'), type: 'number', required: true, value: car?.price.daily || '' },
      { name: 'priceWeekly', label: t('admin.price_weekly'), type: 'number', required: true, value: car?.price.weekly || '' },
    ];
    
    const form = document.getElementById('car-form');
    form.innerHTML = `
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label for="category" class="block mb-1 text-sm font-medium text-gray-700">${t('admin.category')}</label>
              <select id="category" name="category" class="w-full px-3 py-2 border border-gray-300 rounded-md" required>
                <option value="economy" ${car?.category === 'economy' ? 'selected' : ''}>${t('fleet.filter_economy')}</option>
                <option value="suv" ${car?.category === 'suv' ? 'selected' : ''}>${t('fleet.filter_suv')}</option>
                <option value="luxury" ${car?.category === 'luxury' ? 'selected' : ''}>${t('fleet.filter_luxury')}</option>
              </select>
            </div>
            ${formFields.map(f => `
                <div>
                    <label for="${f.name}" class="block mb-1 text-sm font-medium text-gray-700">${f.label}</label>
                    <input type="${f.type || 'text'}" id="${f.name}" name="${f.name}" value="${f.value}" class="w-full px-3 py-2 border border-gray-300 rounded-md" required>
                </div>
            `).join('')}
        </div>
        <div class="flex justify-end pt-4 space-x-4">
            <button type="button" id="cancel-car-btn" class="px-4 py-2 font-semibold text-gray-700 bg-gray-200 rounded-md">${t('admin.cancel')}</button>
            <button type="submit" class="px-4 py-2 font-semibold text-white rounded-md bg-secondary">${t('admin.save')}</button>
        </div>
    `;

    document.getElementById('cancel-car-btn').onclick = () => modal.classList.add('hidden');

    form.onsubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const carData = {
            name: { en: formData.get('nameEn'), ar: formData.get('nameAr') },
            category: formData.get('category'),
            images: formData.get('images').split(',').map(url => url.trim()).filter(url => url),
            specs: {
                fuel: { en: formData.get('fuelEn'), ar: formData.get('fuelAr') },
                capacity: { en: formData.get('capacityEn'), ar: formData.get('capacityAr') },
                transmission: { en: formData.get('transmissionEn'), ar: formData.get('transmissionAr') },
            },
            price: {
                daily: Number(formData.get('priceDaily')),
                weekly: Number(formData.get('priceWeekly')),
            },
        };
        if (car) {
            data.updateCar({ ...carData, id: car.id });
        } else {
            data.addCar(carData);
        }
        renderCarsTable();
        modal.classList.add('hidden');
    };
}

// --- CUSTOMERS PAGE ---
function renderCustomersPage() {
    document.getElementById('customers-title').textContent = t('admin.customers_management');
    const addBtn = document.getElementById('add-customer-btn');
    addBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2"><path d="M5 12h14"/><path d="M12 5v14"/></svg> ${t('admin.add_customer')}`;
    addBtn.addEventListener('click', () => openCustomerModal());

    const tableHead = document.getElementById('customers-table-head');
    tableHead.innerHTML = `
        <tr>
            <th scope="col" class="px-6 py-3">${t('admin.customer_name')}</th>
            <th scope="col" class="px-6 py-3">${t('admin.phone')}</th>
            <th scope="col" class="px-6 py-3">${t('admin.car')}</th>
            <th scope="col" class="px-6 py-3">${t('admin.paid_amount')}</th>
            <th scope="col" class="px-6 py-3">${t('admin.remaining_amount')}</th>
            <th scope="col" class="px-6 py-3">${t('admin.actions')}</th>
        </tr>
    `;
    renderCustomersTable();
}

function renderCustomersTable() {
    const tableBody = document.getElementById('customers-table-body');
    if (data.customers.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="6" class="py-8 text-center text-gray-500">${t('admin.no_customers')}</td></tr>`;
        return;
    }
    tableBody.innerHTML = data.customers.map(customer => {
        const remaining = customer.totalAmount - customer.paidAmount;
        return `
        <tr class="bg-white border-b hover:bg-gray-50">
            <td class="px-6 py-4 font-medium text-gray-900">${customer.name}</td>
            <td class="px-6 py-4">${customer.phone}</td>
            <td class="px-6 py-4">${data.cars.find(c => c.id === customer.carId)?.name[language] || 'N/A'}</td>
            <td class="px-6 py-4 text-green-600">${customer.paidAmount}</td>
            <td class="px-6 py-4 font-bold ${remaining > 0 ? 'text-red-600' : 'text-gray-800'}">${remaining}</td>
            <td class="px-6 py-4">
                <div class="flex space-x-2">
                    <button class="edit-customer-btn text-blue-600 hover:text-blue-800" data-id="${customer.id}">Edit</button>
                    <button class="delete-customer-btn text-red-600 hover:text-red-800" data-id="${customer.id}">Delete</button>
                </div>
            </td>
        </tr>
    `}).join('');

    document.querySelectorAll('.edit-customer-btn').forEach(btn => btn.addEventListener('click', (e) => {
        const customer = data.customers.find(c => c.id == e.target.dataset.id);
        openCustomerModal(customer);
    }));
    document.querySelectorAll('.delete-customer-btn').forEach(btn => btn.addEventListener('click', (e) => {
        if (confirm(t('admin.confirm_delete_customer'))) {
            data.deleteCustomer(Number(e.target.dataset.id));
            renderCustomersTable();
        }
    }));
}

function openCustomerModal(customer = null) {
    const modal = document.getElementById('customer-modal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.getElementById('close-customer-modal').onclick = () => modal.classList.add('hidden');
    
    document.getElementById('customer-modal-title').textContent = customer ? t('admin.edit_customer') : t('admin.add_customer');
    
    const form = document.getElementById('customer-form');
    form.innerHTML = `
        <input type="hidden" name="id" value="${customer?.id || ''}">
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
                <label for="name" class="block text-sm font-medium text-gray-700">${t('admin.customer_name')}</label>
                <input type="text" name="name" value="${customer?.name || ''}" class="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md" required>
            </div>
            <div>
                <label for="phone" class="block text-sm font-medium text-gray-700">${t('admin.phone')}</label>
                <input type="tel" name="phone" value="${customer?.phone || ''}" class="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md" required>
            </div>
            <div>
                <label for="carId" class="block text-sm font-medium text-gray-700">${t('admin.car')}</label>
                <select name="carId" class="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md" required>
                    <option value="" disabled>-- ${t('booking.select_car')} --</option>
                    ${data.cars.map(car => `<option value="${car.id}" ${customer?.carId === car.id ? 'selected' : ''}>${car.name[language]}</option>`).join('')}
                </select>
            </div>
            <div>
                <label for="rentalDate" class="block text-sm font-medium text-gray-700">${t('admin.rental_date')}</label>
                <input type="date" name="rentalDate" value="${customer?.rentalDate || ''}" class="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md" required>
            </div>
            <div>
                <label for="returnDate" class="block text-sm font-medium text-gray-700">${t('admin.return_date')}</label>
                <input type="date" name="returnDate" value="${customer?.returnDate || ''}" class="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md" required>
            </div>
            <div>
                <label for="totalAmount" class="block text-sm font-medium text-gray-700">${t('admin.total_amount')}</label>
                <input type="number" name="totalAmount" value="${customer?.totalAmount || ''}" class="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md" required>
            </div>
            <div>
                <label for="paidAmount" class="block text-sm font-medium text-gray-700">${t('admin.paid_amount')}</label>
                <input type="number" name="paidAmount" value="${customer?.paidAmount || ''}" class="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md" required>
            </div>
        </div>
        <div class="flex justify-end pt-4 space-x-4">
            <button type="button" id="cancel-customer-btn" class="px-4 py-2 font-semibold text-gray-700 bg-gray-200 rounded-md">${t('admin.cancel')}</button>
            <button type="submit" class="px-4 py-2 font-semibold text-white rounded-md bg-secondary">${t('admin.save')}</button>
        </div>
    `;

    document.getElementById('cancel-customer-btn').onclick = () => modal.classList.add('hidden');

    form.onsubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const customerData = {
            name: formData.get('name'),
            phone: formData.get('phone'),
            carId: Number(formData.get('carId')),
            rentalDate: formData.get('rentalDate'),
            returnDate: formData.get('returnDate'),
            totalAmount: Number(formData.get('totalAmount')),
            paidAmount: Number(formData.get('paidAmount')),
        };
        if (customer) {
            data.updateCustomer({ ...customerData, id: customer.id });
        } else {
            data.addCustomer(customerData);
        }
        renderCustomersTable();
        modal.classList.add('hidden');
    };
}

// --- CONTENT PAGE ---
function renderContentPage() {
    document.getElementById('content-title').textContent = t('admin.content_management');
    const addBtn = document.getElementById('add-content-btn');
    addBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2"><path d="M5 12h14"/><path d="M12 5v14"/></svg> ${t('admin.add_content')}`;
    addBtn.addEventListener('click', () => openContentModal());

    const tableHead = document.getElementById('content-table-head');
    tableHead.innerHTML = `
        <tr>
            <th scope="col" class="px-6 py-3">${t('admin.car')}</th>
            <th scope="col" class="px-6 py-3">${t('admin.content_title_ar')}</th>
            <th scope="col" class="px-6 py-3">${t('admin.actions')}</th>
        </tr>
    `;
    renderContentTable();
}

function renderContentTable() {
    const tableBody = document.getElementById('content-table-body');
    if (data.carContent.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="3" class="py-8 text-center text-gray-500">${t('admin.no_content')}</td></tr>`;
        return;
    }
    tableBody.innerHTML = data.carContent.map(content => `
        <tr class="bg-white border-b hover:bg-gray-50">
            <td class="px-6 py-4 font-medium text-gray-900">${data.cars.find(c => c.id === content.carId)?.name[language] || 'N/A'}</td>
            <td class="px-6 py-4">${content.title[language]}</td>
            <td class="px-6 py-4">
                <div class="flex space-x-2">
                    <button class="edit-content-btn text-blue-600 hover:text-blue-800" data-id="${content.id}">Edit</button>
                    <button class="delete-content-btn text-red-600 hover:text-red-800" data-id="${content.id}">Delete</button>
                </div>
            </td>
        </tr>
    `).join('');

    document.querySelectorAll('.edit-content-btn').forEach(btn => btn.addEventListener('click', e => {
        const content = data.carContent.find(c => c.id == e.target.dataset.id);
        openContentModal(content);
    }));
    document.querySelectorAll('.delete-content-btn').forEach(btn => btn.addEventListener('click', e => {
        if (confirm(t('admin.confirm_delete_content'))) {
            data.deleteCarContent(Number(e.target.dataset.id));
            renderContentTable();
        }
    }));
}

function openContentModal(content = null) {
    const modal = document.getElementById('content-modal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.getElementById('close-content-modal').onclick = () => modal.classList.add('hidden');
    
    document.getElementById('content-modal-title').textContent = content ? t('admin.edit_content') : t('admin.add_content');
    
    const form = document.getElementById('content-form');
    form.innerHTML = `
        <input type="hidden" name="id" value="${content?.id || ''}">
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
                <label for="carId">${t('admin.car')}</label>
                <select name="carId" class="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md" required>
                    <option value="" disabled>-- ${t('booking.select_car')} --</option>
                    ${data.cars.map(car => `<option value="${car.id}" ${content?.carId === car.id ? 'selected' : ''}>${car.name[language]}</option>`).join('')}
                </select>
            </div>
            <div>
                <label for="image">${t('admin.image_url')}</label>
                <input type="text" name="image" value="${content?.image || ''}" class="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md" required>
            </div>
            <div>
                <label for="titleEn">${t('admin.content_title_en')}</label>
                <input type="text" name="titleEn" value="${content?.title.en || ''}" class="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md" required>
            </div>
            <div>
                <label for="titleAr">${t('admin.content_title_ar')}</label>
                <input type="text" name="titleAr" value="${content?.title.ar || ''}" class="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md" required>
            </div>
        </div>
        <div>
            <label for="contentEn">${t('admin.content_text_en')}</label>
            <textarea name="contentEn" rows="3" class="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md" required>${content?.content.en || ''}</textarea>
        </div>
        <div>
            <label for="contentAr">${t('admin.content_text_ar')}</label>
            <textarea name="contentAr" rows="3" class="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md" required>${content?.content.ar || ''}</textarea>
        </div>
        <div class="flex justify-end pt-4 space-x-4">
            <button type="button" id="cancel-content-btn" class="px-4 py-2 font-semibold text-gray-700 bg-gray-200 rounded-md">${t('admin.cancel')}</button>
            <button type="submit" class="px-4 py-2 font-semibold text-white rounded-md bg-secondary">${t('admin.save')}</button>
        </div>
    `;

    document.getElementById('cancel-content-btn').onclick = () => modal.classList.add('hidden');
    form.onsubmit = e => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const contentData = {
            carId: Number(formData.get('carId')),
            title: { en: formData.get('titleEn'), ar: formData.get('titleAr') },
            content: { en: formData.get('contentEn'), ar: formData.get('contentAr') },
            seoText: { en: '', ar: '' }, // SEO fields removed from form for simplicity
            image: formData.get('image'),
        };
        if (content) {
            data.updateCarContent({ ...contentData, id: content.id });
        } else {
            data.addCarContent(contentData);
        }
        renderContentTable();
        modal.classList.add('hidden');
    };
}


// --- SETTINGS PAGE ---
function renderSettingsPage() {
    document.getElementById('messages-title').textContent = t('admin.messages_management');
    document.getElementById('message-settings-title').textContent = t('admin.message_settings');
    document.getElementById('message-text-label').textContent = t('admin.message_text');
    document.getElementById('message-text-desc').textContent = t('admin.message_text_desc');
    document.getElementById('customers-to-notify-title').textContent = t('admin.customers_to_notify');

    const messageText = document.getElementById('messageText');
    messageText.value = localStorage.getItem('notificationMessage') || 'عزيزي العميل، نود تذكيركم بوجود مبلغ متبقٍ على إيجار سيارتكم. يرجى التواصل معنا لترتيب عملية السداد. شكراً لتعاونكم.';
    messageText.onchange = (e) => localStorage.setItem('notificationMessage', e.target.value);
    
    document.getElementById('notify-table-head').innerHTML = `
        <tr>
            <th class="px-6 py-3">${t('admin.customer_name')}</th>
            <th class="px-6 py-3">${t('admin.phone')}</th>
            <th class="px-6 py-3">${t('admin.remaining_amount')}</th>
            <th class="px-6 py-3">${t('admin.actions')}</th>
        </tr>
    `;

    const customersToNotify = data.customers.filter(c => (c.totalAmount - c.paidAmount) > 500);
    const tableBody = document.getElementById('notify-table-body');
    if (customersToNotify.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="4" class="py-8 text-center text-gray-500">${t('admin.no_customers')} ${t('admin.customers_to_notify')}</td></tr>`;
        return;
    }

    tableBody.innerHTML = customersToNotify.map(customer => `
        <tr class="border-b hover:bg-gray-50">
            <td class="px-6 py-4 font-medium text-gray-900">${customer.name}</td>
            <td class="px-6 py-4">${customer.phone}</td>
            <td class="px-6 py-4 font-bold text-red-600">${customer.totalAmount - customer.paidAmount} ${t('fleet.aed')}</td>
            <td class="px-6 py-4">
                <button data-name="${customer.name}" class="send-message-btn flex items-center px-3 py-1 text-xs font-medium text-white rounded-md bg-secondary hover:bg-opacity-80">
                    ${t('admin.send_message')}
                </button>
            </td>
        </tr>
    `).join('');
    
    document.querySelectorAll('.send-message-btn').forEach(btn => btn.onclick = (e) => {
        alert(`${t('admin.message_sent_success')} ${e.target.dataset.name}`);
    });
}