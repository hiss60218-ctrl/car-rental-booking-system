# Estibyan Car Rental - Content Management

This website has been upgraded to be fully dynamic and is managed through a built-in **Admin Dashboard**.

---

## How to Edit Website Content

All content, including the car fleet, branches, and offers, is now managed through the admin panel.

### Accessing the Admin Dashboard

To access the dashboard, simply add `/#/admin` to the end of the website URL.

**Example:** `https://your-website-url.com/#/admin`

### What you can do in the Dashboard:

1.  **Manage Cars (`/admin/cars`)**:
    - Add a new car with all its details (name, specs, price).
    - Upload multiple images for each car.
    - Edit the details of any existing car.
    - Delete a car from the fleet.
    - All changes are reflected on the live site instantly.

2.  **Manage Bookings (`/admin/bookings`)**:
    - View all new booking requests submitted by customers through the website.
    - See customer details and their requested car and dates.

### Initial Data (JSON Files)

The `.json` files (`cars.json`, `branches.json`, etc.) are now used **only** to provide the initial data for the website the very first time it loads on a new browser. After that, all data is managed from the Admin Dashboard and stored locally in the browser's storage. If you clear your browser's cache, the site will be re-seeded from these JSON files.