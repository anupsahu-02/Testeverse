# **Testeverse – Online Food Ordering & Selling Platform**

Testeverse is a full-stack food ordering platform where users can browse restaurants, place orders, and track them.
Sellers can register their restaurants, add menu items, and manage customer orders from their own dashboard.

Live Demo: **[https://testeverse.onrender.com/](https://testeverse.onrender.com/)**

---

## 🚀 **Features**

### 👤 **User Features**

* Browse restaurants and available food items
* Add items to cart and place orders
* Track orders in real-time
* View past orders and order history
* Responsive and smooth UI built using React + Vite

### 🛍️ **Seller / Restaurant Owner Features**

* Register as a seller
* Create and manage restaurant profile
* Add, edit, delete menu items
* Manage customer orders
* Update order progress

### 🔐 **Authentication & Security**

* Email/Password authentication using **JWT**
* **Google OAuth2 Login** (Sign in with Google)
* Role-based access (User / Seller) via **Spring Security**
* Secure password hashing

### ☁️ **Media & Storage**

* Upload and store images using **Cloudinary**

### 📌 **Deployment**

* Backend deployed on **Render**
* Database hosted on **MongoDB Atlas**

---

## 🛠 **Tech Stack**

### **Tech Stack Summary**

* **Frontend:** React.js, Vite, Tailwind CSS / Material UI, Axios
* **Backend:** Spring Boot, Spring Security, JWT, **Spring OAuth2 Client (Google Login)**
* **Database:** MongoDB Atlas
* **Media Storage:** Cloudinary
* **Build Tools:** Node.js, Maven
* **Deployment:** Render

### **Frontend**

* React.js
* Vite
* Tailwind CSS / Material UI / CSS
* Axios

### **Backend**

* Spring Boot
* Spring Security
* JWT Authentication
* **Google OAuth2 Login**
* Spring Data MongoDB

### **Database**

* MongoDB Atlas

### **Other Tools**

* Cloudinary
* Git & GitHub
* Render

---

## 📁 **Project Structure**

```
Testeverse/
│
├── backend/
│   ├── src/main/java/... (controllers, services, models)
│   ├── src/main/resources/application.yml
│   └── pom.xml
│
└── frontend/
    ├── src/components/
    ├── src/pages/
    ├── src/context/
    ├── src/utils/
    └── package.json
```

---

## ⚙️ **Setting Up Locally**

### 📦 Prerequisites

#### **Backend**

* **Java 8**
* **Maven 3.9.11+**
* **MongoDB Atlas or local MongoDB**
* Cloudinary account
* **Google Cloud Console OAuth2 credentials**

  * Google Client ID
  * Google Client Secret
  * Authorized Redirect URI

#### **Frontend**

* **Node.js 18+**
* **npm or yarn**

---

## **1. Clone the Repository**

```bash
git clone https://github.com/anupsahu-02/Testeverse.git
cd Testeverse
```

---

# 🔧 Backend Setup (Spring Boot)

### Navigate to backend folder:

```bash
cd backend
```

### Backend Configuration

Your updated `application.yml`:

```yaml
spring:
  data:
    mongodb:
      uri: ${MONGODB_URL}
      auto-index-creation: true

  security:
    oauth2:
      client:
        registration:
          google:
            client-id: ${GOOGLE_CLIENT_ID}
            client-secret: ${GOOGLE_CLIENT_SECRET}
            redirect-url: ${REDIRECT_URL}

  main:
    allow:
      circular-reference: true

cloudinary:
  cloud-name: ${CLOUDINARY_CLOUD_NAME}
  api-key: ${CLOUDINARY_API_KEY}
  api-secret: ${CLOUDINARY_API_SECRET}

app:
  frontend:
    url: ${APP_FRONTEND_URL}
```

### Create a `.env` file inside **backend**:

```
MONGODB_URL=mongodb_connection_string

CLOUDINARY_CLOUD_NAME=cloudinary_cloud_name
CLOUDINARY_API_KEY=cloudinary_api_key
CLOUDINARY_API_SECRET=cloudinary_api_secret

APP_FRONTEND_URL=http://localhost:5173

# OAuth2 Credentials
GOOGLE_CLIENT_ID=google_client_id
GOOGLE_CLIENT_SECRET=google_client_secret
REDIRECT_URL=http://localhost:8080/auth/google/callback

```

### Run backend:

```bash
mvn spring-boot:run
```

Backend runs on:
👉 [http://localhost:8080](http://localhost:8080)

---

# 💻 Frontend Setup (React + Vite)

### Navigate to frontend folder:

```bash
cd frontend
```

### Install dependencies:

```bash
npm install
```

### Setup `.env`:

```
VITE_API_URL=http://localhost:8080
```

### Start frontend:

```bash
npm run dev
```

Frontend runs on:
👉 [http://localhost:5173](http://localhost:5173)

---

## 📦 **Features in Detail**

* Full user flow: browse → add to cart → checkout → track order
* Seller dashboard for managing menus and orders
* Image uploads handled through Cloudinary
* Separate dashboards for Users and Sellers
* Login with Google (OAuth2)
* Real-time order status updates
* Secure authentication and protected APIs

---
