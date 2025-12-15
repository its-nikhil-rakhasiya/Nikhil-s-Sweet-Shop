# ✦ Nikhil's Sweet Shop  
**Sweet Shop Management System – Incubyte Technical Assignment**

🌐 **Live Application:** https://nikhil-s-sweet-shop.vercel.app

---

## ✦ Project Overview

> **Incubyte Technical Assignment Submission**

I developed this project as part of the **Incubyte Sweet Shop Management System** technical assignment.

My goal was to build a **clean, full-stack application** that manages sweets, inventory, and purchases while following real-world business rules and clean coding practices.

---

✦ Application UI Overview

Below are real screenshots from the deployed application, demonstrating the complete user journey and system capabilities.

---

## 🏠 Home Page – Available Sweets

Features shown:

Sweet listing with cards

Search, city, category, and price filters

Stock availability

Order Now action

![Home Page – Available Sweets](./Readme-img/0.png)

---

## 🛒 Shopping Cart

Features shown:

Cart item list

Quantity control (+ / −)

Subtotal & total calculation

Remove item option

![Shopping Cart](./Readme-img/1.png)

---

## 💳 Checkout Page

Features shown:

Delivery information form

Order summary

Total amount calculation

Place Order action

![Checkout Page](./Readme-img/2.png)

---

## 📦 My Orders Page

Features shown:

Order history

Order status (Pending / Delivered)

Total amount

View receipt option

![My Orders](./Readme-img/3.png)

---

## 🧾 Order Receipt Details

Features shown:

Order ID

Customer details

Delivery address

Order status

Ordered items

Total amount

![Order Receipt](./Readme-img/4.png)

---

✦ What This UI Demonstrates (Incubyte Focus)

Complete end-to-end purchase flow

Backend-driven inventory & order management

Clear business rules enforcement

---

Real-world e-commerce workflow

Production-ready UI

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

### 📊 Admin Dashboard – Sweets Management

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

## ✦ Admin Capabilities Summary

- Secure admin authentication
- Complete CRUD operations on sweets
- Inventory management (restock & sold status)
- Order tracking and status updates
- Real-time data reflected in user interface

This admin panel ensures **correct inventory handling and business rule enforcement**, as required in the Incubyte assignment.

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

## ✦ Authentication Capabilities Summary

- Secure user login and registration
- Session-based user experience
- Only logged-in users can:
  - Place orders
  - View order history
  - Access checkout
- Authentication integrates with backend APIs and database

This authentication flow ensures a **real-world e-commerce experience** and supports secure order management, aligning with the Incubyte assignment requirements.

