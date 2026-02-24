# 1Fi EMI Product Store

This project is a full-stack e-commerce application designed to facilitate the purchase of premium smartphones through mutual fund-backed EMI plans. The user interface is built to mirror the experience of major e-commerce platforms like Flipkart and Amazon, focusing on clarity and ease of use.

## Technical Infrastructure

The application is built using a modern decoupled architecture.

### Core Stack
- Frontend: React 19, Vite, TypeScript, and Tailwind CSS.
- Backend: Node.js with Express 5 and TypeScript.
- Database: PostgreSQL managed through Prisma ORM.

### UI Components
- Icons: Lucide React.
- Typography: Outfit and Inter via Google Fonts.
- Animations: Framer Motion for subtle transitions and selection feedback.

## Installation and Setup

### Prerequisites
Before starting, ensure you have the following installed:
- Node.js (version 18 or higher)
- A local PostgreSQL instance

### 1. Repository Setup
Clone the project and install dependencies for both the client and server.

```bash
# Navigate to the project root
cd emi-product-store

# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install
```

### 2. Database Configuration
Create a new PostgreSQL database for the project.

```sql
CREATE DATABASE emi_product_db;
```

### 3. Environment Configuration
Create a .env file in the server directory with your connection details.

```env
DATABASE_URL="postgresql://username:password@localhost:5432/emi_product_db?schema=public"
PORT=5002
```

In the client directory, ensure your .env file points to the correct backend port.

```env
VITE_API_URL=http://localhost:5002/api
```

### 4. Database Migration and Seeding
Initialize the database tables and populate them with initial product data and EMI plans.

```bash
cd server
npx prisma generate
npx prisma db push
npm run seed
```

### 5. Running the Application
You will need to run the backend and frontend simultaneously in separate terminals.

**Backend Terminal**
```bash
cd server && npm run dev
```

**Frontend Terminal**
```bash
cd client && npm run dev
```

## API Documentation

The server exposes several endpoints for managing and retrieving product data.

### Product List
`GET /api/products`
Retrieves all product variants along with their associated EMI plans.

### Product Specifics by Slug
`GET /api/products/slug/:slug`
Fetches a single product using its URL-friendly slug. This endpoint also returns all other variants of the same product family for the variant switcher.

### Product Specifics by ID
`GET /api/products/:id`
Retrieves product details using a numeric primary key.

### Product Families
`GET /api/products/name/:name`
Returns all variants associated with a specific product family name.

## Core Features

- Descriptive URL Structure: Uses brand and family names to create SEO-friendly paths like /apple-iphone-17-pro-apple/slug.
- Intelligent Variant Selection: Users can switch between colors and storage capacities. The application maintains visual state and updates the URL without a full page reload.
- EMI Plan Integration: Dynamic calculation of monthly installments based on tenure, interest rates, and available cashback.
- Performance Driven UI: Implements soft loading states and skeletons to ensure the interface feels responsive during data fetches.
- Responsive Design: Optimized for both mobile and desktop users, including a specialized sticky call-to-action bar for mobile devices.