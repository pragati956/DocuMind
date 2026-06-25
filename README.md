# 🚀 DocuMind

<div align="center">

### **AI-Powered Document Management System**

Upload, organize, search, summarize, and manage documents intelligently using AI-powered workflows.

**Built with the MERN Stack • Gemini AI • Cloudinary • JWT Authentication**

---

![React](https://img.shields.io/badge/React-19-blue?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-green?logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?logo=mongodb)
![Vercel](https://img.shields.io/badge/Frontend-Vercel-black?logo=vercel)
![Render](https://img.shields.io/badge/Backend-Render-blueviolet?logo=render)
![License](https://img.shields.io/badge/License-MIT-blue)

🌐 **Live Demo:** https://documind-pink-delta.vercel.app

---

</div>

# 📖 Overview

DocuMind is a modern AI-powered document management platform that enables users to securely upload, organize, search, summarize, and manage documents through an intuitive and responsive interface.

The application combines cloud storage, intelligent search, authentication, AI summarization, and productivity tools into a single seamless experience.

Whether you're a student, researcher, or professional, DocuMind helps reduce manual effort by leveraging AI to quickly extract meaningful insights from documents.

---

# ✨ Features

## 🔐 Authentication

* Email & Password Authentication
* JWT-based Authorization
* Google OAuth Login
* GitHub OAuth Login
* Forgot Password via Email
* Secure Password Reset

---

## 📁 Document Management

* Upload Documents
* PDF Support
* DOCX Support
* TXT Support
* Cloudinary Storage
* View Documents
* Download Documents
* Delete Documents
* Star Important Documents
* Recent Documents Section

---

## 🤖 AI Features

* AI Document Summarization
* Smart AI Summary Cards
* AI Summary History
* Collection Summaries
* Intelligent Text Extraction
* Gemini AI Integration

---

## 🔍 Smart Search

* Search Documents
* Instant Search Suggestions
* Filter by File Type
* AI Summary Filter
* Responsive Search Interface

---

## 📂 Collections

* Create Collections
* Organize Documents
* Collection Dashboard
* Collection Summary
* Delete Collections

---

## 📊 Dashboard

* Analytics
* Activity Feed
* Recent Uploads
* Statistics Cards
* Quick Actions
* Responsive Sidebar
* Premium Dashboard UI

---

## 🔔 Productivity

* Notifications
* Bug Report System
* Email Support
* Settings Page
* Dark Theme UI

---

# 🛠 Tech Stack

## Frontend

* React 19
* Vite
* React Router DOM
* Tailwind CSS
* Framer Motion
* Axios
* React Hot Toast
* Lucide React
* Recharts

---

## Backend

* Node.js
* Express.js
* MongoDB Atlas
* Mongoose
* JWT
* Passport.js
* Nodemailer
* Multer
* Cloudinary
* Mammoth
* PDF Parse

---

## AI

* Google Gemini 2.5 Flash

---

## Deployment

Frontend → Vercel

Backend → Render

Database → MongoDB Atlas

Storage → Cloudinary

---

# 🏗 Project Architecture

```text
Client (React + Vite)
        │
        ▼
Express REST API
        │
        ├──────── JWT Authentication
        │
        ├──────── Passport OAuth
        │
        ├──────── Cloudinary Storage
        │
        ├──────── MongoDB Atlas
        │
        ├──────── Gemini AI
        │
        └──────── Nodemailer
```

---

# 📸 Screenshots

> Replace these placeholders with actual project screenshots.

## Landing Page

<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/c67c25b3-42e4-4af3-b942-18c8b1aadf6d" />


---

## Dashboard

<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/5cc13d54-bf80-4c2c-8520-1468eff4f0f8" />


---

## Documents

<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/a51766b1-4266-4ed4-b440-c8a10f566847" />


---

## AI Summary

<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/9d3fa306-7952-40d3-b895-da6d85134565" />


---

## Collections

<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/3aa9729a-44a8-4741-b068-b85836883cf2" />


---

# 🚀 Installation

## Clone Repository

```bash
git clone https://github.com/pragati956/DocuMind.git

cd DocuMind
```

---

## Backend

```bash
cd server

npm install

npm run dev
```

---

## Frontend

```bash
cd client

npm install

npm run dev
```

---

# ⚙ Environment Variables

## Backend (.env)

```env
PORT=

MONGO_URI=

JWT_SECRET=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

CLIENT_URL=
BACKEND_URL=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

EMAIL_USER=
EMAIL_PASS=

GEMINI_API_KEY=
```

---

## Frontend (.env)

```env
VITE_API_URL=
```

---

# 📂 Project Structure

```text
DocuMind

client/
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── context/
│   ├── layouts/
│   ├── routes/
│   └── assets/
│
server/
│
├── config/
├── controllers/
├── middleware/
├── models/
├── routes/
├── services/
├── utils/
└── uploads/
```

---

# 🔒 Security

* JWT Authentication
* Password Hashing
* Protected Routes
* OAuth Authentication
* Secure Environment Variables
* Cloud Storage
* Authentication Middleware

---

# 🌟 Future Improvements

* OCR Support
* AI Chat with Documents
* Semantic Search
* Drag & Drop Uploads
* Team Collaboration
* Folder Hierarchy
* Real-time Notifications
* Document Versioning
* AI Tags
* AI Insights

---

# 🤝 Contributors

### Pragati Singh
---
### Sandipan Ray
---

# 📄 License

This project is licensed under the MIT License.

---

# ⭐ Support

If you found this project useful, consider giving it a ⭐ on GitHub.

---

<div align="center">

## Made with ❤️ using React, Node.js, MongoDB and Gemini AI

**DocuMind © 2026**

</div>
