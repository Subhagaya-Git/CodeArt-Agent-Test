# ShopHub — Mid-Level E-Commerce App

A functional e-commerce web application with a React + Vite + Tailwind frontend and an Express + MongoDB + JWT backend.

## Tech Stack

- **Frontend:** React 18, React Router v6, Axios, Tailwind CSS, Vite
- **Backend:** Node.js, Express, Mongoose (MongoDB), JWT, bcryptjs, express-validator
- **Tests:** Jest + Supertest + mongodb-memory-server (no external DB needed for tests)

## Project Structure

```
ecommerce/
├── backend/        # Express API
│   ├── src/
│   │   ├── config/         # DB connection
│   │   ├── controllers/    # Route handlers
│   │   ├── middleware/     # auth, admin, validation, errors
│   │   ├── models/         # User, Product, Cart, Order (Mongoose)
│   │   ├── routes/         # RESTful routes
│   │   ├── validators/     # express-validator schemas
│   │   ├── utils/          # ApiError
│   │   ├── seed/           # Seed script
│   │   ├── app.js          # Express app
│   │   └── server.js       # Entry point
│   └── tests/              # Jest + Supertest tests
└── frontend/       # React SPA
    └── src/
        ├── api/            # Axios instances + API modules
        ├── components/     # Navbar, ProductCard, Pagination, etc.
        ├── context/        # AuthContext, CartContext
        ├── pages/          # All pages (incl. admin/)
        ├── App.jsx         # Routes
        └── main.jsx        # Entry
```

## Prerequisites

- Node.js >= 18
- MongoDB (running locally on `127.0.0.1:27017`, **or** use a MongoDB Atlas URI in `.env`)

## Setup & Run

### 1. Backend

```bash
cd ecommerce/backend
cp .env.example .env          # then edit MONGO_URI / JWT_SECRET if needed
npm install
npm run seed                  # creates admin + user and 12 products
npm run dev                   # starts API on http://localhost:5000
```

Seed accounts:
- Admin: `admin@shop.com` / `admin123`
- User:  `user@shop.com` / `user123`

### 2. Frontend

```bash
cd ecommerce/frontend
npm install
npm run dev                   # starts Vite on http://localhost:5173
```

Open http://localhost:5173. The frontend proxies `/api` to the backend (or calls it directly via `VITE_API_URL`).

## Running Tests (backend)

```bash
cd ecommerce/backend
npm test
```

Tests use `mongodb-memory-server` which **downloads a one-time mongod binary (~100MB) on the first run** — requires internet. After that, tests run fully offline against an in-memory DB. Tests cover auth, products (incl. pagination/filter/reviews/admin CRUD), cart, and orders/admin stats.

## Features

**Customer:**
- Register / login (JWT, bcrypt-hashed passwords)
- Product listing with pagination, category filter, search, price filter (API)
- Product detail (image, description, price, stock status, reviews)
- Shopping cart (add / update qty / remove, persisted per user)
- Checkout (shipping form + order summary, mock payment confirmation)
- Order history + order detail
- Product reviews & ratings

**Admin (role-gated):**
- Dashboard stats (total products, orders, users, revenue)
- Add / edit / delete products
- View all orders + update status (Pending, Paid, Shipped, Delivered, Cancelled)

## API Overview

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/register | – | Register |
| POST | /api/auth/login | – | Login |
| GET | /api/auth/me | user | Current user |
| GET | /api/products | – | List (page, limit, category, search, minPrice, maxPrice) |
| GET | /api/products/categories | – | Distinct categories |
| GET | /api/products/:id | – | Single product |
| POST | /api/products | admin | Create product |
| PUT | /api/products/:id | admin | Update product |
| DELETE | /api/products/:id | admin | Delete product |
| POST | /api/products/:id/reviews | user | Add review |
| GET | /api/cart | user | Get cart |
| POST | /api/cart/items | user | Add item |
| PUT | /api/cart/items | user | Update qty |
| DELETE | /api/cart/items/:productId | user | Remove item |
| DELETE | /api/cart | user | Clear cart |
| POST | /api/orders | user | Checkout |
| GET | /api/orders | user | My orders |
| GET | /api/orders/:id | user | Order detail |
| GET | /api/admin/stats | admin | Dashboard stats |
| GET | /api/admin/orders | admin | All orders |
| PUT | /api/admin/orders/:id/status | admin | Update status |

## Configuration

Backend env (`.env`): `PORT`, `MONGO_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `CLIENT_URL`, `NODE_ENV`.
Frontend env (`.env`): `VITE_API_URL`.

## Notes

- No real payment gateway — checkout is a mock "Paid" confirmation.
- Passwords are hashed with bcrypt; JWT stored in `localStorage` (acceptable for this scope; use httpOnly cookies for production).
- Input validation on both client (HTML + form checks) and server (express-validator + Mongoose schema).
- Responsive UI (mobile + desktop) via Tailwind.