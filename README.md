# 🛒 Voltix ElectroMart — Modern Fullstack E-Commerce Platform

> A production-ready, full-featured electronic e-commerce web application built end-to-end with **100% TypeScript**, **React 19**, **NestJS**, **Neon Serverless PostgreSQL**, **Prisma ORM**, and **Stripe Payments**.

---

## 🌐 Live Deployments & URLs

| Component | Platform | Live URL |
| :--- | :--- | :--- |
| **Frontend Website** | Vercel (Production) | [https://voltix-ecru.vercel.app](https://voltix-ecru.vercel.app) |
| **Backend REST API** | Render (Production) | [https://voltix-en8h.onrender.com/api](https://voltix-en8h.onrender.com/api) |
| **Swagger API Documentation** | Interactive UI | [https://voltix-en8h.onrender.com/docs](https://voltix-en8h.onrender.com/docs) |
| **Source Code** | GitHub | [https://github.com/Ramjanict/Voltix](https://github.com/Ramjanict/Voltix) |

---

## ⚡ Technology Stack

* **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, Redux Toolkit, Lucide React, React Router v6, React Toastify, Stripe SDK
* **Backend**: NestJS, TypeScript, Prisma ORM, Express platform, Class Validator & Transformer, Cookie Parser
* **Database & Cloud**: Neon Serverless PostgreSQL (AWS us-east-2), Cloudinary
* **Payments**: Stripe Checkout & Payment Processing

---

## 🚀 Key Features

* 💎 **100% Strict TypeScript**: Zero JavaScript on both backend (NestJS) and frontend (React 19 + Vite), fully typed interfaces for products, users, cart, and orders.
* ⚡ **Voltix Modern UI**: Sleek, modern header with category navigation, interactive product carousels, responsive catalog grid, and dark/light accents.
* 📦 **Expanded Catalog (36+ Real Products)**: Full multi-item selections across all 12 categories (`airpodes`, `watches`, `mobiles`, `earphones`, `camera`, `Mouse`, `televisions`, `speakers`, `printers`, `processor`, `refrigerator`, `trimmers`).
* 🛡️ **Enterprise NestJS Architecture**: Modular clean architecture (Auth, User, Product, Cart, Order) with dependency injection, DTO validation, and role-based guards.
* 🐘 **Neon Serverless PostgreSQL + Prisma**: Scalable relational schema with instant pooled connection, migrations, and automatic seeding.
* 🔐 **Secure JWT Authentication**: HTTP-Only, SameSite cookies with bcryptjs password hashing and role-based access control (`ADMIN` / `GENERAL`).
* 💳 **Stripe Checkout**: Real Stripe payment integration with checkout sessions, order persistence in PostgreSQL, and order fulfillment status tracking (`PROCESSING`, `SHIPPED`, `DELIVERED`).
* 👑 **Full Admin Suite**: Product management (upload, update, delete with Cloudinary / local preview), user role control, and order tracking.
* 📚 **Interactive Swagger / OpenAPI 3.0 Documentation**: Complete interactive API explorer with schemas, DTO models, Bearer JWT & Cookie auth testbench at `/docs` and `/api/docs`.

---

## 📂 Project Architecture & Directory Structure

```text
Fullstack-Ecommerce-MERN-APP/
├── backend/                              # NestJS REST API & PostgreSQL Database Layer
│   ├── prisma/
│   │   ├── schema.prisma                 # Prisma schema (User, Product, Cart, Order models)
│   │   └── seed.ts                       # Database seeder (36+ products & admin user)
│   ├── src/
│   │   ├── common/                       # Shared cross-cutting concerns
│   │   │   ├── decorators/               # Custom param decorators (@CurrentUser(), @Roles())
│   │   │   └── guards/                   # Guards (AuthGuard for JWT, RolesGuard for RBAC)
│   │   ├── modules/                      # Domain-driven NestJS feature modules
│   │   │   ├── auth/                     # Authentication (SignUp, Login, Logout, Profile)
│   │   │   │   ├── dto/auth.dto.ts       # Swagger & class-validator input schemas
│   │   │   │   ├── auth.controller.ts    # Auth endpoints
│   │   │   │   ├── auth.service.ts       # JWT generation, bcrypt verification
│   │   │   │   └── auth.module.ts
│   │   │   ├── user/                     # User Management (Role updates, admin listing)
│   │   │   │   ├── dto/user.dto.ts
│   │   │   │   ├── user.controller.ts
│   │   │   │   ├── user.service.ts
│   │   │   │   └── user.module.ts
│   │   │   ├── product/                  # Catalog, Filtering, Categories & Upload
│   │   │   │   ├── dto/product.dto.ts
│   │   │   │   ├── product.controller.ts
│   │   │   │   ├── product.service.ts
│   │   │   │   └── product.module.ts
│   │   │   ├── cart/                     # Shopping Cart (Add, Update Quantity, Remove)
│   │   │   │   ├── dto/cart.dto.ts
│   │   │   │   ├── cart.controller.ts
│   │   │   │   ├── cart.service.ts
│   │   │   │   └── cart.module.ts
│   │   │   └── order/                    # Stripe Checkout & Order Fulfillment Tracking
│   │   │       ├── dto/order.dto.ts
│   │   │       ├── order.controller.ts
│   │   │       ├── order.service.ts
│   │   │       └── order.module.ts
│   │   ├── prisma/                       # Global Prisma client provider module
│   │   │   ├── prisma.module.ts
│   │   │   └── prisma.service.ts
│   │   ├── app.module.ts                 # Root NestJS application module
│   │   └── main.ts                       # App entrypoint, CORS, pipes & Swagger UI setup
│   ├── .env.example                      # Backend environment variable template
│   ├── package.json                      # Backend dependencies & production scripts
│   └── tsconfig.json                     # TypeScript compiler configuration
│
└── frontend/                             # React 19 + Vite Single Page Application
    ├── public/
    │   └── products/                     # High-resolution commercial product photography
    ├── src/
    │   ├── assets/                       # Marketing banners, brand logos & UI gifs
    │   ├── BackendUrl/
    │   │   └── backendUrl.ts             # Strongly-typed API endpoint registry
    │   ├── Components/                   # Reusable UI component library
    │   │   ├── Header.tsx                # Nav bar, live search, cart badge & user menu
    │   │   ├── Footer.tsx                # Responsive platform footer
    │   │   ├── BannerProduct.tsx         # Auto-advancing promotional hero slider
    │   │   ├── CategoryList.tsx          # Horizontal category navigation bar
    │   │   ├── HorizontalCardProduct.tsx # Sliding product showcase carousel
    │   │   ├── VerticalCardProduct.tsx   # Responsive catalog product card grid
    │   │   ├── AdminEditProduct.tsx      # Modal for editing product details
    │   │   ├── UploadProducts.tsx        # Cloudinary product image uploader modal
    │   │   └── ChangeUserRole.tsx        # Admin user permission changer
    │   ├── Context/                      # React Context (global cart item counter)
    │   ├── Pages/                        # Top-level view routes
    │   │   ├── Home.tsx                  # Storefront landing page
    │   │   ├── ProductCategory.tsx       # Category browse & multi-facet filter page
    │   │   ├── ProductDetails.tsx        # Product image gallery, specs & add-to-cart
    │   │   ├── Cart.tsx                  # Real-time cart calculations & Stripe checkout
    │   │   ├── Order.tsx                 # Customer order history & fulfillment tracking
    │   │   ├── AdminPanel.tsx            # Admin dashboard sidebar navigation
    │   │   ├── AllProducts.tsx           # Admin product catalog manager
    │   │   ├── AllUsers.tsx              # Admin user roles & permissions manager
    │   │   ├── Login.tsx                 # User sign-in page
    │   │   ├── SignUp.tsx                # User registration with avatar upload
    │   │   ├── Success.tsx               # Stripe payment confirmation view
    │   │   └── Cancel.tsx                # Payment cancelled fallback view
    │   ├── routes/
    │   │   └── index.tsx                 # React Router v6 route configuration
    │   ├── store/                        # Redux Toolkit store & user slice
    │   ├── types/
    │   │   └── index.ts                  # Central TypeScript interfaces & data contracts
    │   ├── App.tsx                       # App layout wrapper with Header & Footer
    │   ├── main.tsx                      # React 19 DOM bootstrap
    │   └── index.css                     # Tailwind CSS & global scrollbar styling
    ├── .env.example                      # Frontend environment variable template
    ├── package.json                      # Frontend dependencies & Vite scripts
    └── vite.config.ts                    # Vite bundler configuration & local API proxy
```

---

## 📚 API Documentation (Swagger / OpenAPI)

Interactive Swagger UI documentation is available on the backend:
* **Production UI**: [https://voltix-en8h.onrender.com/docs](https://voltix-en8h.onrender.com/docs) (or [https://voltix-en8h.onrender.com/api/docs](https://voltix-en8h.onrender.com/api/docs))
* **Local Development UI**: `http://localhost:8080/docs` (or `http://localhost:8080/api/docs`)
* **Features**:
  * 🔐 **Authentication & Authorization**: Interactive "Authorize" modal supporting both `Bearer <token>` and HTTP-only session cookies.
  * 📦 **Endpoints Covered**:
    * **Authentication**: Sign up, Login, Logout, Current User Details.
    * **Users**: All users listing, user role & profile updates (Admin).
    * **Products**: Full catalog, category lists, single product details, search, filters, upload, update, delete (Admin).
    * **Cart**: Add to cart, view cart with product details, update item quantities, remove item, count cart.
    * **Orders**: Stripe Checkout session creation, user order history, admin order list, order status updates.

---

## 🔑 Admin Credentials
* **Email**: `admin@gmail.com`
* **Password**: `Admin@12345`
*(Legacy demo admin: `md@gmail.com` / `12345`)*

---

## 🛠️ Getting Started

### **1. Backend (NestJS + Neon PostgreSQL)**
Environment configuration is located in `backend/.env` (refer to `backend/.env.example`):
```bash
cd backend
npm install
# configure backend/.env
npm run prisma:push    # Push schema to Neon PostgreSQL
npm run prisma:seed    # Seed full 36+ product catalog & admin user
npm run start:dev      # Run NestJS dev server on http://localhost:8080/api
```

### **2. Frontend (React 19 + TypeScript + Vite)**
Environment configuration is located in `frontend/.env` (refer to `frontend/.env.example`):
```bash
cd frontend
npm install
# configure frontend/.env
npm run dev            # Run Vite dev server on http://localhost:3000
```

---

## 👨‍💻 Author
Created by **[Md Ramjan Ali](https://github.com/Ramjanict)**.
