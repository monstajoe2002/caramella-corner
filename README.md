# Project Details and Features

Caramella Corner is a web application built using TanStack and React frameworks. It serves as an e-commerce admin panel and storefront platform.

## Project Overview

A full-stack e-commerce platform featuring both an admin dashboard and a customer-facing storefront:

- **Admin Dashboard:** Complete management system for products, categories, and orders.
- **Storefront:** Modern shopping experience with product browsing, search, and filtering.
- Product management with image upload and variant options.
- Category and subcategory management.
- Order management with customer and payment details.
- Uses ImageKit for efficient image uploading and storage.
- Implements form validation using `@tanstack/react-form`.
- Data fetching and caching with `@tanstack/react-query`.
- Backend integration with Drizzle ORM for type-safe database operations.
- Routing with TanStack Router for a smooth SPA experience.
- UI components styled with Tailwind CSS and Shadcn UI.

## Current Status

- Both Admin and Storefront functionalities are implemented and available.
- Image removal and deletion functionalities are broken.

## Features

### Admin Panel

- Full CRUD operations for products, including uploading and deleting images.
- Manage product variants such as SKU, color, and size.
- Category and subcategory selection with dynamic loading.
- Order viewing with customer and payment details.
- Real-time inventory management.

### Storefront

- Browse products by categories and subcategories.
- Product search and filtering capabilities.
- Detailed product pages with images, descriptions, and variants.
- Responsive design optimized for mobile and desktop.
- Shopping cart functionality.

### Technologies

- **React & TypeScript:** Core framework and language.
- **TanStack Query & Router:** Efficient data fetching and routing.
- **Drizzle ORM:** Type-safe database access.
- **Neon**: A serverless Postgres database
- **ImageKit:** Cloud-based image upload and management.
- **Tailwind CSS & Shadcn UI:** Styling and reusable UI components.
- **Form Validation:** Using `@tanstack/react-form` with Zod schemas.

## Running the Application

Follow the usual steps:

1. **Install dependencies:**

```bash
pnpm install
```

2. **Start the development server:**

```bash
pnpm dev
```

3. **Access the app:**

Open your browser and go to [http://localhost:5173](http://localhost:5173) (default Vite port).

4. **Build for production:** (Optional)

```bash
pnpm build
```

---

*Make sure you have `pnpm` installed globally before running these commands.*

Feel free to explore both the admin panel to manage products, categories, and orders, as well as the storefront to experience the shopping interface.
