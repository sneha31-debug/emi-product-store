# 1Fi EMI Product Store

A full-stack e-commerce web app for buying premium smartphones via mutual fund-backed EMI plans.
Designed with a Flipkart/Amazon-style UI.

## 🚀 Tech Stack

| Layer    | Technology |
|----------|-----------|
| Frontend | React 19, Vite, TypeScript, Tailwind CSS v4, Framer Motion |
| Backend  | Node.js, Express 5, TypeScript, Prisma ORM v7 |
| Database | PostgreSQL (via `@prisma/adapter-pg` driver) |
| Icons    | Lucide React |
| Fonts    | Outfit, Inter (Google Fonts) |

---

## 🛠️ Setup & Run Instructions

### Prerequisites
- Node.js v18+
- PostgreSQL running locally (or a hosted connection string)

### 1. Clone & Install

```bash
git clone <repo-url>
cd emi-product-store

# Backend
cd server && npm install

# Frontend
cd ../client && npm install
```

### 2. Database Setup

Create a PostgreSQL database:
```sql
CREATE DATABASE emi_product_db;
```

### 3. Backend Environment

Create `server/.env`:
```env
DATABASE_URL="postgresql://YOUR_USERNAME:YOUR_PASSWORD@localhost:5432/emi_product_db?schema=public"
PORT=5001
```

### 4. Migrate & Seed Database

```bash
cd server
npx prisma generate      # generate Prisma client
npx prisma db push       # create tables from schema
npm run seed             # populate with 4 products + 12 variants + EMI plans
```

### 5. Run Development Servers

Terminal 1 — Backend:
```bash
cd server && npm run dev
# → Server running on http://localhost:5001
```

Terminal 2 — Frontend:
```bash
cd client && npm run dev
# → App running on http://localhost:5173
```

---

## 📡 API Endpoints

### `GET /api/products`
Returns all product variants with their EMI plans.

```bash
curl http://localhost:5001/api/products
```

<details>
<summary>Example Response</summary>

```json
[
  {
    "id": 1,
    "name": "Apple iPhone 17 Pro",
    "slug": "iphone-17-pro-256gb-natural-titanium",
    "brand": "Apple",
    "variant": "256 GB",
    "color": "Natural Titanium",
    "mrp": 134900,
    "price": 129900,
    "imageUrl": "https://...",
    "description": "iPhone 17 Pro. Forged in titanium...",
    "highlights": ["6.3-inch Super Retina XDR...", "A19 Pro chip..."],
    "emiPlans": [
      { "id": 1, "tenure": 3,  "monthlyAmount": 43300, "interestRate": 0,    "cashback": 2000 },
      { "id": 2, "tenure": 6,  "monthlyAmount": 21650, "interestRate": 0,    "cashback": 1500 },
      { "id": 3, "tenure": 12, "monthlyAmount": 11990, "interestRate": 10.5, "cashback": 500  }
    ]
  }
]
```
</details>

---

### `GET /api/products/slug/:slug`
Returns a single product by its URL slug, plus all sibling variants.

```bash
curl http://localhost:5001/api/products/slug/iphone-17-pro-256gb-natural-titanium
```

<details>
<summary>Example Response</summary>

```json
{
  "id": 1,
  "name": "Apple iPhone 17 Pro",
  "slug": "iphone-17-pro-256gb-natural-titanium",
  "brand": "Apple",
  "variant": "256 GB",
  "color": "Natural Titanium",
  "mrp": 134900,
  "price": 129900,
  "emiPlans": [...],
  "variants": [
    { "id": 1, "slug": "iphone-17-pro-256gb-natural-titanium", "variant": "256 GB", "color": "Natural Titanium", "price": 129900, "imageUrl": "..." },
    { "id": 2, "slug": "iphone-17-pro-256gb-blue-titanium", "variant": "256 GB", "color": "Blue Titanium", "price": 129900, "imageUrl": "..." },
    { "id": 3, "slug": "iphone-17-pro-512gb-natural-titanium", "variant": "512 GB", "color": "Natural Titanium", "price": 149900, "imageUrl": "..." },
    { "id": 4, "slug": "iphone-17-pro-512gb-black-titanium", "variant": "512 GB", "color": "Black Titanium", "price": 149900, "imageUrl": "..." }
  ]
}
```
</details>

---

### `GET /api/products/:id`
Returns a single product by numeric ID (including variants).

```bash
curl http://localhost:5001/api/products/1
```

---

### `GET /api/products/name/:name`
Returns all variants of a product by product name (URL-encoded).

```bash
curl "http://localhost:5001/api/products/name/Apple%20iPhone%2017%20Pro"
```

---

## 🗄️ Database Schema

```prisma
model Product {
  id          Int       @id @default(autoincrement())
  name        String
  slug        String    @unique
  brand       String
  variant     String    // e.g., "256 GB"
  color       String    // e.g., "Natural Titanium"
  mrp         Float
  price       Float
  imageUrl    String
  description String    @default("")
  highlights  String[]  // array of highlight bullet strings
  emiPlans    EMIPlan[]
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

model EMIPlan {
  id            Int      @id @default(autoincrement())
  monthlyAmount Float
  tenure        Int      // months
  interestRate  Float    // 0 = no-cost EMI
  cashback      Float    @default(0)
  productId     Int
  product       Product  @relation(fields: [productId], references: [id])
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}
```

---

## 📦 Seed Data

4 product families, 12 total variants:

| Product | Variants | Storage Options |
|---------|----------|----------------|
| Apple iPhone 17 Pro | 4 | 256 GB, 512 GB |
| Samsung Galaxy S24 Ultra | 3 | 256 GB, 512 GB |
| Google Pixel 9 Pro | 3 | 128 GB, 256 GB |
| OnePlus 12 | 2 | 256 GB, 512 GB |

Each variant has **5 EMI plans** (3m, 6m, 9m with 0% interest; 12m at 10.5%; 24m at 12.5%).

---

## 🌐 Frontend Routes

| URL | Page |
|-----|------|
| `/` | Product catalog (grouped by name, brand filter) |
| `/products/:slug` | Product detail (EMI selection, variant switcher) |

---

## ✨ Features

- 📱 **Unique product URLs** via slug (e.g., `/products/iphone-17-pro-256gb-natural-titanium`)
- 🎛️ **Variant selector** — toggle storage and color, page navigates to new slug
- 💳 **EMI plan table** — tenure, monthly amount, interest rate, cashback
- 📊 **Total payable** calculated in plan selection modal
- 🔍 **Brand filter chips** (All / Apple / Samsung / Google / OnePlus)
- 📝 **Product highlights** listed with checkmarks
- 📱 **Responsive** — sticky mobile CTA bar, tablet/desktop layout
- 💀 **Loading skeletons** (not a plain spinner)
- 🎨 **Flipkart-style UI** — blue header, category strip, card grid, trust badges