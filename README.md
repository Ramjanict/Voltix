# 🛒 Voltix ElectroMart — Modern Fullstack E-Commerce Platform

> A production-ready, full-featured electronic e-commerce web application built end-to-end with **100% TypeScript**, **React 19**, **NestJS**, **Neon Serverless PostgreSQL**, **Prisma ORM**, and **Stripe Payments**.

---

## 🌐 Live Deployments & URLs

| Component | Platform | Live URL |
| :--- | :--- | :--- |
| **Frontend Website** | Vercel (Production) | [https://voltix-ecru.vercel.app](https://voltix-ecru.vercel.app) |
| **Frontend Alternate** | Vercel (Staging) | [https://fullstack-ecommerce-mern-app-usvm.vercel.app](https://fullstack-ecommerce-mern-app-usvm.vercel.app) |
| **Backend REST API** | Render (Production) | [https://voltix.onrender.com/api](https://voltix.onrender.com/api) |
| **Swagger API Documentation** | Interactive UI | [https://voltix.onrender.com/docs](https://voltix.onrender.com/docs) |
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

## 📚 API Documentation (Swagger / OpenAPI)

Interactive Swagger UI documentation is available on the backend:
* **Production UI**: [https://voltix.onrender.com/docs](https://voltix.onrender.com/docs) (or `https://voltix.onrender.com/api/docs`)
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
