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
* Modern, responsive UI built using React

### 🛍️ **Seller / Restaurant Owner Features**

* Register as a seller
* Create and manage restaurant profile
* Add, edit, delete food items
* Manage customer orders
* View order status and update progress

### 🔐 **Authentication & Security**

* Secure login and registration using **JWT**
* **Spring Security** for role-based access (User / Seller)
* Password hashing and secure session handling

### ☁️ **Media & Storage**

* **Cloudinary integration** for restaurant and food item images

### 📌 **Deployment**

* Backend deployed on **Render**
* Database hosted on **MongoDB Atlas**

---

## 🛠 **Tech Stack**

### **Frontend**

* React.js
* Tailwind / CSS / Material UI (as used in your project)
* Axios for API communication

### **Backend**

* Spring Boot
* Spring Security
* Spring Data MongoDB
* JWT Authentication

### **Database**

* MongoDB Atlas

### **Other Tools**

* Cloudinary (image uploads)
* Render (deployment)
* Git & GitHub

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

#### **For Backend (Spring Boot)**

* **Java 8** 
* **Maven 3.9.11+**
* **MongoDB Atlas or local MongoDB**
* Cloudinary account (for image uploads)

#### **For Frontend**

* **Node.js 18+**
* **npm or yarn**

---

### **1. Clone the Repository**

``` bash
  git clone https://github.com/anupsahu-02/Testeverse.git
  cd Testeverse
```

---

## 🔧 Backend Setup (Spring Boot)

### **Navigate to backend folder**

```bash
cd backend
```

### Backend Configuration

`application.yml` reads environment variables like this:

```yaml
  spring:
    data:
      mongodb:
        uri: ${MONGODB_URL}
        auto-index-creation: true
  
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

### Create a `.env` file in the backend folder:

```
  MONGODB_URL=your_mongodb_connection_string
  CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
  CLOUDINARY_API_KEY=your_api_key
  CLOUDINARY_API_SECRET=your_api_secret
  APP_FRONTEND_URL=http://localhost:5173
```

### **Run the backend**

```bash
mvn spring-boot:run
```

Backend runs on:
👉 **[http://localhost:8080](http://localhost:8080)**

---

## 💻 Frontend Setup (React)

### **Navigate to frontend folder**

```bash
cd frontend
```

### **Install dependencies**

```bash
npm install
```

### **Setup `.env`**

```
VITE_API_URL=http://localhost:8080
```

### **Start frontend**

```bash
npm run dev
```

Frontend runs on:
👉 **[http://localhost:5173](http://localhost:5173)**

---

## 📦 **Features in Detail**

* Full user flow: browse → add to cart → checkout → track order
* Seller dashboard for restaurant analytics
* Cloud image management
* Role-based pages (User / Seller)
* Real-time order updates
* Secure authentication and API protection

---
