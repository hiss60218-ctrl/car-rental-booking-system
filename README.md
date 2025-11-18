# Estibyan Car Rental - Static Website

This project is a fully static, serverless website for a car rental company, built with **HTML, CSS, and vanilla JavaScript**. It is designed to be deployed on any static web hosting service (like Hostinger, Netlify, Vercel, etc.) without any server-side requirements or build steps.

The website is bilingual (Arabic/English) and includes a complete client-side admin panel for content management.

---

## How It Works

- **Static HTML Pages:** Each page of the site is a separate `.html` file (e.g., `index.html`, `fleet.html`).
- **Vanilla JavaScript:** All dynamic functionality is handled by client-side JavaScript. There is no React, Node.js, or server backend.
- **Client-Side Data Management:** All website data (cars, customers, bookings, etc.) is initially loaded from `.json` files and then stored and managed in the browser's **Local Storage**. This means any changes made in the admin panel are saved directly in the user's browser.

**Important Note:** Because data is stored locally, changes made in one browser will **not** be visible in another browser or on another device. This setup is ideal for demos or single-administrator scenarios where a backend database is not required.

## Content Management

All content is managed through the built-in **Admin Panel**.

### Accessing the Admin Panel

To access the admin panel, open the `admin/index.html` file in your browser.

**URL:** `https://your-website-url.com/admin/`

**Default Credentials:**
- **Username:** `admin`
- **Password:** `password`

### What you can do in the Admin Panel:

1.  **Dashboard (`/admin/index.html`)**: View key statistics about your rental business.
2.  **Manage Cars (`/admin/cars.html`)**:
    - Add, edit, and delete cars from your fleet.
    - All details, including names, specs, prices, and images (via URLs), are editable.
3.  **Manage Customers (`/admin/customers.html`)**:
    - Keep a record of your customers.
    - Add new customers and manage their rental details, including total and paid amounts.
4.  **Manage Content (`/admin/content.html`)**:
    - Write articles or SEO-focused content related to specific cars.
5.  **Settings (`/admin/settings.html`)**:
    - Configure and send reminder messages to customers with outstanding balances.

### Initial Data (JSON Files)

The `.json` files (`cars.json`, `branches.json`, etc.) are used to provide the initial data for the website the **first time** it's loaded in a browser. After the first load, all data is read from and written to Local Storage. To reset the website to its initial state, you must clear your browser's Local Storage for the site.