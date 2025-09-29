🎥 Vastora: A Scalable Video Streaming Platform
Overview
Vastora is a proof-of-concept video streaming and uploading platform, built as a robust prototype for a major client engagement. Developed as a full-stack project, it replicates core functionalities found in modern video hosting services, focusing on user-generated content, secure authentication, and scalable media handling. This application served as a foundational model to be refined by our company's main Software Development Engineer (SDE) team.

✨ Key Features
Secure User Authentication: Full registration, login, and session management using JWTs stored in HTTP-only cookies.

Video Management: APIs for uploading, updating, and deleting videos, including title, description, and thumbnail handling.

Scalable File Storage: Integration with Cloudinary for storing all video and image assets, offloading media bandwidth from the application server.

User Interactions: Functionality for liking/disliking videos, posting/deleting comments, and subscribing/unsubscribing from channels.

Personalization: Dedicated pages for user profiles, displaying uploaded videos, and maintaining a complete Watch History.

Responsive UI: Built with React and styled using Tailwind CSS for a clean, modern, and mobile-friendly user experience.

🛠️ Tech Stack
Frontend (Client-Side)
React: Component-based UI development.

Redux Toolkit: Centralized state management for user sessions and application data.

React Router DOM: Client-side routing.

Axios: HTTP client for API interaction.

Tailwind CSS: Utility-first CSS framework for rapid styling.

Backend & Database (Server-Side)
Node.js & Express.js: RESTful API and server environment.

MongoDB: NoSQL database for flexible data storage.

Mongoose: Object Data Modeling (ODM) for schema definition.

JSON Web Tokens (JWT): Secure, stateless authentication.

Multer: Middleware for handling multipart/form-data (file uploads).

Cloudinary: Cloud service for scalable video and image hosting.

🚀 Getting Started (Setup & Run)
Follow these steps to set up the project locally.

1. Prerequisites
Ensure you have the following installed:

Node.js (LTS version)

MongoDB (local instance or cloud cluster URL)

A free account with Cloudinary for media storage.

2. Environment Variables
Create a .env file in the root directory and populate it with your configuration keys:

# MongoDB Configuration
MONGODB_URL=
DB_NAME=VastoraDB

# JWT Secrets (Use strong, random strings)
ACCESS_TOKEN=
REFRESH_TOKEN=
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_EXPIRY=10d

# Cloudinary Configuration
CLOUD_NAME=
API_KEY=
API_SECRET=

3. Backend Setup
Navigate to the project root directory in your terminal and run:

# Install server dependencies
npm install

# Start the server (usually runs on port 8000)
npm run dev 

4. Frontend Setup
The frontend typically resides in a subdirectory (e.g., client or frontend).

# Navigate to the frontend directory
cd client # or whatever your frontend directory is named

# Install client dependencies
npm install

# Start the React application (usually runs on port 3000)
npm run dev 

💡 Project Structure
The project follows a modular MVC (Model-View-Controller) pattern on the backend for clean separation of concerns.

Vastora/
├── backend/
│   ├── src/
│   │   ├── controllers/      # Business logic (e.g., user.controller.js)
│   │   ├── models/           # Mongoose schemas (e.g., users.model.js)
│   │   ├── routes/           # API endpoints (e.g., user.routes.js)
│   │   ├── middlewares/      # Security & file handling (e.g., auth.middleware.js)
│   │   └── utils/            # Custom error handlers, Cloudinary logic
│   └── .env
└── client/
    ├── src/
    │   ├── pages/            # Main React components (Home.jsx, Watch.jsx)
    │   ├── components/       # Reusable UI components (Card.jsx, Navbar.jsx)
    │   ├── features/         # Redux slices (authSlice.js, sidebarSlice.js)
    │   └── util/             # Axios instance setup
    └── package.json
