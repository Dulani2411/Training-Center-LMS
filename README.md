# 🎓 Training Center LMS

A full-stack Learning Management System (LMS) for managing student enrollments, courses, and training applications.

**Stack:** React + TypeScript (Frontend) · Node.js + Express + TypeScript (Backend) · MySQL / MSSQL (Database)

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Project Structure](#project-structure)
3. [Database Setup (XAMPP / MySQL)](#database-setup-xampp--mysql)
4. [Backend Setup](#backend-setup)
5. [Frontend Setup](#frontend-setup)
6. [Running the Project](#running-the-project)
7. [Default Login Credentials](#default-login-credentials)
8. [Common Errors & Fixes](#common-errors--fixes)

---

## ✅ Prerequisites

Make sure these are installed before starting:

| Tool | Download |
|------|----------|
| [Node.js](https://nodejs.org/) (v18 or above) | https://nodejs.org/ |
| [XAMPP](https://www.apachefriends.org/) | https://www.apachefriends.org/ |
| [Git](https://git-scm.com/) | https://git-scm.com/ |

---

## 📁 Project Structure

```
traning-center-lms/
├── backend/                  # Node.js + Express API
│   ├── src/
│   │   ├── app.ts
│   │   ├── server.ts
│   │   ├── config/db.ts      # Database connection
│   │   ├── controllers/
│   │   ├── models/
│   │   └── routes/
│   ├── migrations/
│   │   └── FULL_DATABASE_SETUP_MYSQL.sql   ← Run this in phpMyAdmin
│   ├── .env.example          ← Copy this to .env
│   └── package.json
│
└── frontend/                 # React + Vite app
    ├── src/
    │   ├── App.tsx
    │   ├── pages/
    │   └── components/
    └── package.json
```

---

## 🗄️ Database Setup (XAMPP / MySQL)

### Step 1 — Start XAMPP

1. Open **XAMPP Control Panel**
2. Click **Start** next to **Apache**
3. Click **Start** next to **MySQL**

### Step 2 — Open phpMyAdmin

Open your browser and go to:
```
http://localhost/phpmyadmin
```

### Step 3 — Run the SQL setup file

1. Click the **SQL** tab at the top
2. Open the file `backend/migrations/FULL_DATABASE_SETUP_MYSQL.sql` in any text editor
3. Copy **all** the content
4. Paste it into the SQL tab in phpMyAdmin
5. Click **Go**

This will automatically create the database `training_center_lms` and all tables.

### Step 4 — Generate Admin Password Hash

The admin password needs a bcrypt hash. Run this command **after** installing backend dependencies (see next section):

```bash
cd backend
node -e "require('bcryptjs').hash('Admin@1234', 10, (e,h) => console.log(h))"
```

Copy the output hash and open `FULL_DATABASE_SETUP_MYSQL.sql`, then replace these two lines:

```sql
'$2b$10$REPLACE_WITH_REAL_BCRYPT_HASH_FOR_ADMIN'      ← replace with your hash
'$2b$10$REPLACE_WITH_REAL_BCRYPT_HASH_FOR_SUBADMIN'   ← replace with your hash
```

Then run the SQL file again (Step 3).

---

## ⚙️ Backend Setup

### Step 1 — Install dependencies

```bash
cd backend
npm install
```

### Step 2 — Create the `.env` file

```bash
# Windows (PowerShell)
Copy-Item .env.example .env
```

Or just copy the file manually and rename it to `.env`.

### Step 3 — Edit `.env` for MySQL (XAMPP)

Open `.env` and replace the contents with:

```env
# Server
PORT=5000

# MySQL Database (XAMPP)
DB_HOST=localhost
DB_PORT=3306
DB_NAME=training_center_lms
DB_USER=root
DB_PASSWORD=

# JWT
JWT_SECRET=your_long_random_secret_key_here
JWT_EXPIRES_IN=7d
```

> **Note:** XAMPP's default MySQL user is `root` with **no password**. If you set a password, add it to `DB_PASSWORD`.

### Step 4 — Update db.ts for MySQL

The current `src/config/db.ts` is configured for **MSSQL**. To use MySQL with XAMPP, replace its contents with:

```typescript
// src/config/db.ts
import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

let pool: mysql.Pool | null = null;

export const connectDB = async (): Promise<void> => {
  try {
    pool = mysql.createPool({
      host:     process.env.DB_HOST     || "localhost",
      port:     Number(process.env.DB_PORT) || 3306,
      database: process.env.DB_NAME     || "training_center_lms",
      user:     process.env.DB_USER     || "root",
      password: process.env.DB_PASSWORD || "",
      waitForConnections: true,
      connectionLimit: 10,
    });
    console.log("✅ Connected to MySQL (XAMPP)");
  } catch (err) {
    console.error("❌ Database connection failed:", err);
    process.exit(1);
  }
};

export const getPool = (): mysql.Pool => {
  if (!pool) throw new Error("DB not initialised. Call connectDB() first.");
  return pool;
};
```

Then install the MySQL driver:

```bash
cd backend
npm install mysql2
```

---

## 🖥️ Frontend Setup

### Step 1 — Install dependencies

```bash
cd frontend
npm install
```

### Step 2 — Check API URL

Open `frontend/src/api/courseApi.ts` (or any API file) and make sure the base URL points to the backend:

```typescript
const API_BASE = "http://localhost:5000/api";
```

---

## ▶️ Running the Project

Open **two terminals** and run both at the same time:

### Terminal 1 — Backend

```bash
cd backend
npm run dev
```

Expected output:
```
✅ Connected to MySQL (XAMPP)
✅ LMS Backend running on http://localhost:5000
```

### Terminal 2 — Frontend

```bash
cd frontend
npm run dev
```

Expected output:
```
  VITE ready in XXXms
  ➜  Local: http://localhost:5173/
```

Open your browser: **http://localhost:5173**

---

## 🔑 Default Login Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@trainingcenter.com | Admin@1234 |
| Sub Admin | subadmin@trainingcenter.com | Admin@1234 |
| Student 1 | student1@example.com | Password123! |
| Student 2 | student2@example.com | Password123! |
| Student 3 | student3@example.com | Password123! |

> ⚠️ Students must change their password on first login.

---

## 🔧 Common Errors & Fixes

### ❌ `Cannot find module 'mysql2'`
```bash
cd backend
npm install mysql2
```

---

### ❌ `Cannot find module 'bcryptjs'` or `bcrypt`
```bash
cd backend
npm install bcryptjs
npm install --save-dev @types/bcryptjs
```

---

### ❌ `npm install` fails with peer dependency errors
```bash
npm install --legacy-peer-deps
```

---

### ❌ Frontend shows blank page / Cannot GET /
Make sure the backend is running on port 5000 before opening the frontend.

---

### ❌ `CORS error` in browser console
The backend already has CORS enabled. If you still see this error, check that the backend is running and the API URL in the frontend is `http://localhost:5000/api`.

---

### ❌ Database connection failed
- Make sure XAMPP **MySQL is running** (green light in XAMPP Control Panel)
- Check `.env` values: `DB_HOST=localhost`, `DB_USER=root`, `DB_PASSWORD=` (empty for default XAMPP)
- Make sure the database `training_center_lms` was created (check phpMyAdmin)

---

### ❌ `ts-node` not found
```bash
cd backend
npm install --save-dev ts-node typescript
```

---

### ❌ Port already in use (EADDRINUSE)
Change the port in `.env`:
```env
PORT=5001
```
And update the frontend API URL accordingly.

---

## 📌 Quick Start Summary

```bash
# 1. Start XAMPP → start Apache + MySQL
# 2. Import SQL file in phpMyAdmin (SQL tab → paste → Go)

# 3. Backend
cd backend
npm install
# copy .env.example → .env and edit values
npm run dev

# 4. Frontend (new terminal)
cd frontend
npm install
npm run dev

# 5. Open browser → http://localhost:5173
```
