<h2 align="center">Store Rating App (React.Js + Node.Js) </h2>

<p align="center">A web application enabling users to submit ratings for stores registered on the platform.</p>

## 📌 About The Project

This project was developed as part of a coding challenge and mirrors functionality I implemented during my internship, where I contributed to a real-world store rating system.

---

## 🧑‍💻 User Roles & Features

### 🧍‍♂️ Normal User
- Can rate a store (1–5 stars)
- Can search stores by name and address

### 🧑‍💼 Store Owner
- Can view a list of users with rated their store
- Can **search** and **sort** users by name and address
- ❌ **Cannot rate** any store

### 🛠️ System Administrator
- **Dashboard** view of total users, stores, and ratings
- Can **view** users with filters (name, email, address, role), plus search and sort
- Can **add users**
- Can **add a store** and **assign a store owner** (only users with the *Store Owner* role can be assigned)
- ❌ **Cannot rate** any store

---

## ✅ Validation Rules

- **Name fields**: Minimum 20 characters, maximum 60
- **Address**: Maximum 400 characters
- **Password**:
  - Minimum 8 and maximum 16 characters
  - Must include:
    - At least 1 uppercase letter
    - At least 1 lowercase letter
    - At least 1 digit
    - At least 1 special character

---

## 🚀 Tech Stack

### Frontend:
- React.js (Vite)
- React Router v6
- Bootstrap 5
- React Hook Form + Yup
- Axios
- React Toastify
- Lucide Icons
-React Typeahed

### Backend:
- Node.js (Express.js)
- PostgreSQL
- Sequelize ORM
- JWT Authentication
- bcrypt.js
- CORS
- Dotenv

---

## ⚙️ Additional Features

- Sequelize ORM with  associations
- Implemented **migrations**
- Proper **role-based access control**
- RESTful API with validation using **Joi**
- Secure password storage with **bcrypt**
- Custom error handling

---

## 📝 Note

All features implemented in this project were based on work I previously completed during my internship experience. This includes:
- Complete backend setup with Sequelize
- Role-based access control
- Migrations & associations
- Secure user management & validations
- ErrorBoundary and Access controle

---
