# 🎥 Vastora: Scalable Video Streaming Platform

Vastora is a proof-of-concept full-stack video streaming and uploading platform inspired by modern video hosting services. It focuses on **user-generated content, secure authentication, and scalable media handling**, serving as a foundation for learning and portfolio purposes.

Live Demo: [https://vastora.vercel.app](https://vastora.vercel.app)

---

## ✨ Key Features

- **Secure User Authentication:** Registration, login, and session management using JWTs stored in HTTP-only cookies.
- **Video Management:** APIs for uploading, updating, and deleting videos with title, description, and thumbnail support.
- **Scalable File Storage:** Cloudinary integration for media hosting to offload bandwidth from the server.
- **User Interactions:** Like/dislike videos, post/delete comments, subscribe/unsubscribe from channels.
- **Personalization:** User profile pages showing uploaded videos and complete watch history.
- **Responsive UI:** Built with React and styled using Tailwind CSS for a clean, mobile-friendly interface.

---

## 🛠️ Tech Stack

**Frontend (Client-Side)**
- React (Component-based UI)
- Redux Toolkit (State management)
- React Router DOM (Client-side routing)
- Axios (HTTP client)
- Tailwind CSS (Utility-first styling)

**Backend & Database (Server-Side)**
- Node.js & Express.js (RESTful API & server)
- MongoDB (NoSQL database)
- Mongoose (ODM for schema management)
- JSON Web Tokens (JWT) for authentication
- Multer (File uploads handling)
- Cloudinary (Cloud video & image hosting)

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (LTS version)
- MongoDB (local or cloud instance)
- Cloudinary account (free tier for media storage)

### 2. Environment Variables
Create a `.env` file in the root directory with your configuration:

```env
# MongoDB
MONGODB_URL=
DB_NAME=VastoraDB

# JWT
ACCESS_TOKEN=
REFRESH_TOKEN=
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_EXPIRY=10d

# Cloudinary
CLOUD_NAME=
API_KEY=
API_SECRET=
```

### 3. Backend Setup
```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Run server (default port 8000)
npm run dev
```

### 4. Frontend Setup
```bash
# Navigate to frontend
cd client

# Install dependencies
npm install

# Run React app (default port 3000)
npm run dev
```

---

## 💡 Project Structure

```
Vastora/
├── backend/
│   ├── src/
│   │   ├── controllers/      # Business logic
│   │   ├── models/           # Mongoose schemas
│   │   ├── routes/           # API endpoints
│   │   ├── middlewares/      # Security & file handling
│   │   └── utils/            # Error handlers, Cloudinary logic
│   └── .env
└── client/
    ├── src/
    │   ├── pages/            # Main React components
    │   ├── components/       # Reusable UI components
    │   ├── features/         # Redux slices
    │   └── util/             # Axios instance setup
    └── package.json
```

---

## 🔧 Future Improvements
- Enhance authentication security & authorization flows
- Advanced video recommendations and search functionality
- Optimized aggregation queries for faster video retrieval
- Improved UI/UX for seamless interaction

---

## 📄 License
This project is open for learning and portfolio purposes. Feel free to fork and experiment!