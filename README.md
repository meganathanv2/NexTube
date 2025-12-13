# NexTube 🎥

NexTube is a **full‑stack MERN application** inspired by YouTube, built to demonstrate real‑world backend architecture, authentication, video management, and a modern responsive frontend.

---

## 🚀 Features

### 🔐 Authentication & Security

* JWT‑based authentication (Access Token + Refresh Token)
* Secure protected routes using middleware
* Password hashing and validation

### 👤 Users & Channels

* User registration & login
* Create and manage channels
* Channel‑wise video listing

### 🎬 Video Management

* Video upload using **Multer** (Cloudinary‑ready)
* View count tracking
* Like / Dislike toggle system
* Video details & watch page

### 🔎 Discovery

* Search videos by title
* Trending videos based on views

### 🎨 Frontend

* React with reusable components
* Responsive UI (mobile & desktop)
* Clean navigation and video layout

---

## 🛠️ Tech Stack

### Frontend

* React
* JavaScript / TypeScript
* Tailwind CSS
* Axios

### Backend

* Node.js
* Express.js
* MongoDB + Mongoose
* JWT Authentication
* Multer (File Upload)

---

## 📂 Project Structure

```
NexTube/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.jsx
│   └── package.json
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── utils/
│   └── server.js
│
└── README.md
```

---

## ⚙️ Environment Variables

### Backend (`.env`)

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Frontend (`.env`)

```
VITE_API_BASE_URL=https://your-backend-url/api
```

---

## ▶️ Running Locally

### 1️⃣ Clone Repository

```
git clone https://github.com/your-username/NexTube.git
cd NexTube
```

### 2️⃣ Backend Setup

```
cd backend
npm install
npm run dev
```

### 3️⃣ Frontend Setup

```
cd frontend
npm install
npm run dev
```

