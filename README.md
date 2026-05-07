# 🌐 Full-Stack Social Media Platform

A modern and feature-rich social media platform inspired by Instagram, built using the MERN stack.
This application provides real-time communication, media sharing, stories, subscriptions, dark/light themes, and a complete social networking experience.

---

# 🚀 Live Demo

### Frontend (Vercel)

https://social-media-lime-omega.vercel.app

### Backend API (Render)

https://social-media-3rlw.onrender.com

---
# ✨ Features

## 🔐 Authentication & Onboarding

* User Signup & Login
* JWT-based Authentication
* Reset Password System
* Secure Protected Routes
* Full User Onboarding Flow

> ⚠️ Note: Due to deployment limitations on Render email services, OTP verification currently uses a constant OTP during production deployment.
⚠️ For demo/testing purposes, the OTP is currently set to 999999.

---

## 👤 User Profile System

* Create and Edit Profile
* Upload Profile & Cover Images
* Follow / Unfollow Users
* User Suggestions
* Blue Tick Verification Badge

---

## 📸 Posts & Stories

* Create, Edit, and Delete Posts
* Upload Images
* Like and Comment on Posts
* Story Upload Feature
* Responsive Media Rendering

---

## 💬 Real-Time Chat System

* One-to-One Real-Time Chat
* Group Chat Functionality
* Live Messaging with Socket.IO
* Online / Offline User Status
* Instant Notifications

---

## 💳 Subscription System

* Stripe Payment Integration
* Paid Blue Tick Subscription
* Secure Checkout Workflow
* Subscription-Based Verification

---

## 🎨 UI & User Experience

* Fully Responsive Design
* Light & Dark Theme Support
* Modern Social Media UI
* Smooth User Experience Across Devices

---

# 🛠️ Tech Stack

## Frontend

* React.js
* Redux / Context API
* Tailwind CSS
* Axios
* Socket.IO Client

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* Socket.IO
* Cloudinary
* Stripe API

---

# ☁️ Deployment

| Service       | Platform      |
| ------------- | ------------- |
| Frontend      | Vercel        |
| Backend       | Render        |
| Database      | MongoDB Atlas |
| Media Storage | Cloudinary    |

---



# ⚙️ Environment Variables

Create a `.env` file inside the backend directory.

```env id="f5hl5q"
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

CLIENT_URL=http://localhost:3000

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

STRIPE_SECRET_KEY=your_stripe_secret_key
```

---

# 📦 Installation & Setup

## 1️⃣ Clone Repository

```bash id="1vx6xk"
git clone https://github.com/Ak-Aryan005/social-media.git
cd social-media
```

---

## 2️⃣ Install Dependencies

### Backend

```bash id="5f0eqd"
cd backend
npm install
```

### Frontend

```bash id="gspn4f"
cd frontend
npm install
```

---

## 3️⃣ Run the Project

### Start Backend

```bash id="g7y0jo"
cd backend
npm run dev
```

### Start Frontend

```bash id="k9nnp2"
cd frontend
npm start
```

---

# 📂 Project Structure

```bash id="e5jykm"
project-root/
│
├── frontend/
│   ├── components/
│   ├── pages/
│   ├── redux/
│   ├── hooks/
│   └── utils/
│
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── sockets/
│   ├── config/
│   └── server.js
│
├── screenshots/
├── README.md
└── package.json
```

---

# 🔥 Major Features Implemented

* Complete Authentication System
* Instagram-Like Social Features
* Stories Functionality
* Real-Time Chat & Group Chat
* Stripe Subscription System
* Blue Tick Verification
* Dark / Light Theme
* Responsive Design
* Cloudinary Media Uploads
* Production Deployment

---

# 🧪 Future Improvements

* Voice & Video Calling
* Reels / Short Videos
* Push Notifications
* AI Content Moderation
* Saved Posts
* Explore Page Improvements

---

# 🤝 Contributing

Contributions are welcome.

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push the branch
5. Open a Pull Request

---



---

# 👨‍💻 Developer

Built with ❤️ by Aryan

If you like this project, feel free to ⭐ the repository.
