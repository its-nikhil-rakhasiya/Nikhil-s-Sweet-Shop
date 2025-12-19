# ✦ Nikhil's Sweet Shop  
**Sweet Shop Management System – Incubyte Technical Assignment**

🌐 **Live Application:** [https://nikhil-s-sweet-shop.vercel.app](https://nikhil-s-sweet-shop.vercel.app)

---

## ✦ Project Overview

> **Incubyte Technical Assignment Submission**

I developed this project as part of the **Incubyte Sweet Shop Management System** technical assignment. My goal was to build a **clean, full-stack application** that manages sweets, inventory, and purchases while following real-world business rules and clean coding practices.
    
---

## � Modern Architecture & Hosting

To demonstrate production-grade deployment skills, the project is hosted across three specialized cloud platforms:

1.  ☁️ **Database**: [Aiven Cloud MySQL](https://aiven.io/) (High-performance managed database)
2.  ⚙️ **Backend**: [Render](https://render.com/) (Express API with automated CI/CD)
3.  🎨 **Frontend**: [Vercel](https://vercel.com/) (Global Edge Network for fast React performance)

---

## ✦ Application UI Overview

Below are real screenshots from the application, demonstrating the complete user journey and system capabilities.

---

## 🏠 Home Page – Available Sweets

Features shown:
- Sweet listing with cards
- Search, city, category, and price filters
- Stock availability
- Order Now action

![Home Page – Available Sweets](./Readme-img/0.png)

---

## 🛒 Shopping Cart

Features shown:
- Cart item list
- Quantity control (+ / −)
- Subtotal & total calculation
- Remove item option

![Shopping Cart](./Readme-img/1.png)

---

## 💳 Checkout Page

Features shown:
- Delivery information form
- Order summary
- Total amount calculation
- Place Order action

![Checkout Page](./Readme-img/2.png)

---

## 📦 My Orders Page

Features shown:
- Order history
- Order status (Pending / Delivered)
- Total amount
- View receipt option

![My Orders](./Readme-img/3.png)

---

## 🧾 Order Receipt Details

Features shown:
- Order ID
- Customer details
- Delivery address
- Order status
- Ordered items
- Total amount

![Order Receipt](./Readme-img/4.png)

---

## ✦ Admin Panel Overview

> The Admin Panel provides full control over sweets, inventory, orders, users, and system rules.  
> All admin actions are protected and backend-driven.

---

### 🔐 Admin Login

**Purpose:**
- Secure access for administrators
- Prevent unauthorized management actions

![Admin Login](./Readme-img/admin1.png)

---

### � Admin Dashboard – Sweets Management

**Features shown:**
- Total sweets count
- Available vs unavailable sweets
- Filters by category, status, and city
- Add new sweet
- Edit, delete, and restock sweets

![Admin Dashboard – Sweets](./Readme-img/admin2.png)

---

### 📦 Orders Management

**Features shown:**
- View all orders
- Customer details
- Order date & total amount
- Update order status (Pending / Delivered)
- Expand order items

![Orders Management](./Readme-img/admin3.png)

---

### ➕ Add New Sweet

**Features shown:**
- Sweet name, category, weight
- Flavor (optional)
- City & shop address
- Price and type (Packaged / Bulk)
- Initial stock quantity
- Image URL support

![Add New Sweet](./Readme-img/AddSweet.png)

---

### ✏️ Edit Sweet Details

**Features shown:**
- Update sweet information
- Change price, stock, type, and location
- Mark sweet as sold
- Update image

![Edit Sweet](./Readme-img/EditSweet.png)

---

### 🔄 Restock Sweet

**Features shown:**
- Update stock quantity
- Immediate inventory reflection
- Backend-validated stock update

![Restock Sweet](./Readme-img/StockSweet.png)

---

## ✦ Technical Highlights (Incubyte Focus)

- **Clean Code Architecture**: Separation of concerns between API, Database, and UI logic.
- **Business Rule Enforcement**: Strict inventory validation (cannot order more than available stock).
- **Security**: Robust authentication for users and admins.
- **Production Readiness**: Environment-variable based configuration for seamless deployment transitions.

---

## ✦ User Authentication

> The application provides a secure and user-friendly authentication system that allows customers to create accounts and log in before placing orders.

---

### 🔐 User Login

**Features shown:**
- Email & password-based login
- Clean and simple login UI
- Redirect to home and cart after login
- Protected user actions (orders, checkout)

![User Login](./Readme-img/UserLogin.png)

---

### 📝 User Registration

**Features shown:**
- New user account creation
- Full name, email, and password input
- Password validation (minimum length)
- Seamless transition to login after registration

![User Registration](./Readme-img/UserRegister.png)

---

## ✦ Final Summary

This project demonstrates a **complete end-to-end purchase flow** and a **production-ready Admin system**. It follows the core requirements of the Incubyte assignment while pushing the boundaries with a modern, cloud-hosted architecture and a polished, business-ready interface.
