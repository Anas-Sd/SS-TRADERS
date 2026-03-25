# 📦 SSTraders - Inventory Management System

**Smart Inventory. Simplified Management.**

*Categorize. Organize. Scale. It's that simple.*

[![Live](https://img.shields.io/badge/🔗_Live_Demo-SSTraders-FF6B6B?style=for-the-badge)](https://sstraders1.vercel.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-F59E0B?style=for-the-badge)](LICENSE)
[![GitHub Stars](https://img.shields.io/github/stars/Anas-Sd/SSTraders?style=for-the-badge&color=gold)](https://github.com/Anas-Sd/SS-TRADERS)
[![GitHub Forks](https://img.shields.io/github/forks/Anas-Sd/SSTraders?style=for-the-badge&color=8B5CF6)](https://github.com/Anas-Sd/SS-TRADERS)

![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?style=flat-square&logo=supabase&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=flat-square&logo=firebase&logoColor=black)
![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=flat-square&logo=cloudinary&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000?style=flat-square&logo=vercel&logoColor=white)

---

## 🧬 What is SSTraders?

> Managing inventory shouldn't be complicated. **SSTraders** makes it effortless.

A **full-stack inventory management system** designed to manage and display categorized items with a nested structure — organized, searchable, and admin-controlled.

```javascript
const ssTraders = {
    purpose: "Inventory Management System",
    categories: "A–Z structured listing",
    structure: "Category → Item → Sub-Item (Parts)",
    stack: ["React", "Supabase", "Firebase", "Cloudinary"],
    access: {
        public: "Read-only browsing",
        admin: "Full CRUD operations"
    },
    status: "🟢 Live"
};

async function manageInventory(action, data) {
    if (auth.isAdmin()) {
        await inventory[action](data); // ✨ Admin magic
    }
    return inventory.getAll(); // 📦 Everyone can browse
}
```

---

## ✨ Features

| | Feature | Description |
|:---:|:---|:---|
| 🔐 | **Admin Authentication** | Firebase-powered login for secure admin access |
| 📋 | **Public Inventory Listing** | Browse categorized items without signing in |
| 🔤 | **A–Z Categorization** | Organized alphabetical category structure |
| 🔗 | **Nested Item Structure** | Category → Item → Sub-Items (e.g., Car → Engine, Parts) |
| ✏️ | **Full CRUD Operations** | Add, update, and delete inventory (admin only) |
| 🖼️ | **Image Upload & Storage** | Cloudinary integration for media management |

---

## 🛠️ Tech Stack

### 🌐 Frontend
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

### ⚙️ Backend & Database
![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)

### 🚀 Deployment
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white)

---

## 🎯 Key Highlights

| | Highlight |
|:---:|:---|
| ✅ | **Role-based access control** — Public read, Admin write |
| 🗂️ | **Scalable nested inventory** — Categories → Items → Sub-Items |
| 🖼️ | **Cloudinary media storage** — Efficient image handling |
| 🔥 | **Firebase authentication** — Secure admin login |
| ⚡ | **Supabase backend** — Real-time database with instant APIs |
| 🚀 | **Production-ready** — Deployed with modern CI/CD pipeline |

---

## 🗄️ Database Schema (Supabase)


### Table: `categories`

| Column | Type | Description |
|:---|:---|:---|
| `id` | `uuid` | Primary key |
| `name` | `text` | Category name |
| `created_at` | `timestamp` | Creation timestamp |

### Table: `items`

| Column | Type | Description |
|:---|:---|:---|
| `id` | `uuid` | Primary key |
| `category_id` | `uuid` | Foreign key → categories |
| `name` | `text` | Item name |
| `description` | `text` | Item description |
| `created_at` | `timestamp` | Creation timestamp |

### Table: `sub_items` (parts)

| Column | Type | Description |
|:---|:---|:---|
| `id` | `uuid` | Primary key |
| `item_id` | `uuid` | Foreign key → items |
| `name` | `text` | Sub-item / part name |
| `image_url` | `text` | Cloudinary image URL |
| `created_at` | `timestamp` | Creation timestamp |


---

## 📡 API / Data Flow


### 📥 Fetch Operations (Public)

| Endpoint | Description |
|:---|:---|
| `GET /categories` | Retrieve all categories (A–Z listing) |
| `GET /items?category_id=<id>` | Retrieve items by category |
| `GET /sub_items?item_id=<id>` | Retrieve parts/components of an item |

### 🔒 Admin Operations (Authenticated)

| Action | Description |
|:---|:---|
| `POST /categories` | Add a new category |
| `POST /items` | Add a new item |
| `POST /sub_items` | Add a new sub-item |
| `PUT /:resource/:id` | Update an existing entry |
| `DELETE /:resource/:id` | Delete an entry |

---

## 🚀 Getting Started

### Prerequisites

- Node.js `>=16`
- Supabase project
- Firebase project
- Cloudinary account

### Installation

```bash
# Clone the repository
git clone https://github.com/Anas-Sd/SSTraders.git

# Navigate to the project
cd SSTraders

# Install frontend dependencies
cd frontend
npm install

# Start development server
npm run dev
```

---

## 📁 Project Structure


```
SSTraders/
├── 📂 frontend/
│   ├── 📂 src/
│   │   ├── 📂 components/
│   │   ├── 📂 pages/
│   │   ├── 📂 services/
│   │   ├── 📂 hooks/
│   │   ├── 📂 utils/
│   │   ├── 📄 App.jsx
│   │   └── 📄 main.jsx
│   └── 📄 package.json
│
├── 📂 backend/
├── 📂 public/
└── 📄 README.md
```

---

## 🔐 Access Control

| Role | Permissions |
|:---|:---|
| 👤 **Public User** | View categories, browse items & sub-items |
| 🛡️ **Admin User** | Login via Firebase, full CRUD on all inventory data |

---

## 🌐 Deployment

| Service | Purpose |
|:---|:---|
| ![Vercel](https://img.shields.io/badge/Vercel-000?style=flat-square&logo=vercel&logoColor=white) | Frontend hosting |
| ![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?style=flat-square&logo=supabase&logoColor=white) | Backend & Database |
| ![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=flat-square&logo=cloudinary&logoColor=white) | Media storage |
| ![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=flat-square&logo=firebase&logoColor=black) | Authentication |

---


## 📬 Let's Connect!

<a href="mailto:sdanasbtech@gmail.com">
  <img src="https://img.shields.io/badge/Email-sdanasbtech@gmail.com-EA4335?style=for-the-badge&logo=gmail&logoColor=white"/>
</a>

📍 **India** | 🕐 **IST (UTC+5:30)** | ✅ **Open for Opportunities**

---

## ⚖️ License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for details.

---

<div align="center">

### 💬 "Organized inventory is the backbone of every great business."

**⭐ If you found this useful, give it a star!**

**From [SYED ANAS](https://github.com/Anas-Sd) with ❤️**

</div>
