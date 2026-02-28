# EduQuery 🎓

> **Document-Grounded AI Question Answering System**  
> Accurate. Secure. Explainable. Free.

---

## 📌 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
  - [Admin Seeding](#admin-seeding)
- [Environment Variables](#environment-variables)
- [API Overview](#api-overview)
- [Role-Based Access Control](#role-based-access-control)
- [Deployment](#deployment)
- [Design Philosophy](#design-philosophy)
- [Future Enhancements](#future-enhancements)
- [Author](#author)

---

## Overview

**EduQuery** is a full-stack, enterprise-grade AI question-answering system that answers **strictly from uploaded documents** — no internet searches, no hallucinations, no external data leaks.

Unlike generic AI chatbots, EduQuery grounds every response in your uploaded knowledge base (PDFs, DOCX, TXT files), ensuring answers are accurate, traceable, and trustworthy.

### 🎯 Ideal For

| Use Case | Description |
|---|---|
| 🏫 Academic Projects | College and university AI demonstrations |
| 🏢 Enterprise Knowledge Systems | Internal document Q&A for organizations |
| 🔒 Secure AI Deployments | No external data exposure |
| 🤖 AI Research | Document-grounded reasoning experiments |

---

## Key Features

### 📄 Document-Grounded AI
- Responses generated **only from uploaded resources** — never from the internet
- Eliminates hallucination and ensures factual accuracy
- Full traceability: every answer maps to a source document

### 🔐 Role-Based Access Control (RBAC)
- **Admin** and **User** roles with separate login portals
- Admin manages knowledge base; Users interact with the AI
- JWT-based secure authentication

### ☁️ Free AI Inference via Cloudflare
- Powered by **Cloudflare AI (LLaMA 3 Instruct)** — completely free tier
- No billing from OpenAI, Groq, or HuggingFace
- Unlimited local and cloud-safe inference

### 🖥️ Clean Enterprise UI
- Minimal, distraction-free layout
- Chat-style conversational interface
- Conversation history management per user
- Professional color palette optimized for long sessions

### 🛡️ Security & Reliability
- Rate limiting on chat endpoints to prevent abuse
- Admin accounts created via seed script only (no UI registration)
- Environment-based configuration for all secrets

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React.js, Tailwind CSS |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB (via Mongoose ODM) |
| **Authentication** | JSON Web Tokens (JWT) |
| **AI Inference** | Cloudflare AI — LLaMA 3 Instruct |
| **Deployment** | Render (Static Site + Web Service) |

---

## Architecture

```
┌────────────────────────────────────────────────────────────┐
│                        Frontend (React.js)                  │
│  Landing → Login (Admin/User) → Chat UI / Admin Dashboard  │
└──────────────────────────┬─────────────────────────────────┘
                           │ REST API (HTTP)
┌──────────────────────────▼─────────────────────────────────┐
│                    Backend (Node.js + Express)               │
│   Auth Routes | Chat Routes | Admin Routes | Resource Routes │
│   JWT Middleware | Rate Limiter | Role Guards                │
└──────────────────────────┬─────────────────────────────────┘
           ┌───────────────┼──────────────────┐
           ▼               ▼                  ▼
     ┌──────────┐   ┌────────────┐   ┌──────────────────┐
     │ MongoDB  │   │ Cloudflare │   │  Uploaded Docs   │
     │ (Users,  │   │  AI API    │   │  (PDF, DOCX, TXT)│
     │  Chats,  │   │ LLaMA 3    │   │                  │
     │ Resources│   │ Instruct   │   │                  │
     └──────────┘   └────────────┘   └──────────────────┘
```

**Data Flow:**
1. User submits a question via the chat UI
2. Backend fetches relevant document context from MongoDB
3. A strict prompt (document context only) is sent to Cloudflare AI
4. AI responds using only the provided context
5. Response is saved to conversation history and returned to user

---

## Project Structure

```
EduQuery/
│
├── backend/
│   ├── config/
│   │   └── db.js                  # MongoDB connection setup
│   ├── controllers/
│   │   ├── authController.js      # Login, register, JWT issuance
│   │   ├── chatController.js      # Chat logic, AI call, response save
│   │   ├── adminController.js     # Admin dashboard data & user management
│   │   └── resourceController.js  # Document upload, list, delete
│   ├── middleware/
│   │   ├── auth.js                # JWT verification middleware
│   │   ├── admin.js               # Admin role guard
│   │   └── rateLimit.js           # Chat endpoint rate limiter
│   ├── models/
│   │   ├── User.js                # User schema (name, email, role, password)
│   │   ├── Resource.js            # Document/resource schema
│   │   ├── Chat.js                # Individual chat message schema
│   │   └── Conversation.js        # Conversation thread schema
│   ├── routes/
│   │   ├── authRoutes.js          # /api/auth/*
│   │   ├── chatRoutes.js          # /api/chat/*
│   │   ├── adminRoutes.js         # /api/admin/*
│   │   └── resourceRoutes.js      # /api/resources/*
│   ├── services/
│   │   └── cloudflareAI.js        # Cloudflare AI API wrapper
│   ├── seedAdmin.js               # One-time admin account seeder
│   ├── server.js                  # Express app entry point
│   └── .env                       # Backend environment variables
│
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       │   ├── Navbar.jsx         # Top navigation bar
│       │   └── admin/             # Admin-specific components
│       ├── pages/
│       │   ├── Landing.jsx        # Public landing page
│       │   ├── LoginAdmin.jsx     # Admin login page
│       │   ├── LoginUser.jsx      # User login page
│       │   ├── Register.jsx       # User registration page
│       │   ├── Profile.jsx        # User profile page
│       │   ├── UserChat.jsx       # Main chat interface
│       │   └── Admin/
│       │       └── AdminDashboard.jsx  # Admin control panel
│       ├── services/
│       │   ├── chatApi.js         # Axios calls for chat endpoints
│       │   └── resourceApi.js     # Axios calls for resource endpoints
│       ├── App.js                 # Root component with routing
│       └── index.js               # React entry point
│   └── .env                       # Frontend environment variables
│
└── README.md
```

---

## Prerequisites

Make sure the following are installed on your system before proceeding:

- **Node.js** v18+ and **npm**
- **MongoDB** (local instance or MongoDB Atlas)
- A **Cloudflare account** with AI access enabled
- **Git**

---

## Getting Started

### Clone the Repository

```bash
git clone https://github.com/your-username/eduquery.git
cd EduQuery
```

---

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CF_ACCOUNT_ID=your_cloudflare_account_id
CF_AI_TOKEN=your_cloudflare_ai_token
```

Start the backend server:

```bash
node server.js
```

✅ Backend will be running at: `http://localhost:5000`

---

### Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend/` directory:

```env
REACT_APP_API_URL=http://localhost:5000
```

Start the frontend:

```bash
npm start
```

✅ Frontend will be running at: `http://localhost:3000`

---

### Admin Seeding

Admin accounts are **not** created through the UI for security reasons. Use the seed script to create the initial admin account:

```bash
cd backend
node seedAdmin.js
```

> ⚠️ **Important:** Run this only once. Update `seedAdmin.js` with your desired admin credentials before running.

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Example |
|---|---|---|
| `PORT` | Port for the Express server | `5000` |
| `MONGO_URI` | MongoDB connection string | `mongodb+srv://...` |
| `JWT_SECRET` | Secret key for JWT signing | `mysupersecretkey` |
| `CF_ACCOUNT_ID` | Cloudflare account ID | `abc123def456` |
| `CF_AI_TOKEN` | Cloudflare AI API token | `Bearer xyz...` |

### Frontend (`frontend/.env`)

| Variable | Description | Example |
|---|---|---|
| `REACT_APP_API_URL` | Base URL for backend API | `http://localhost:5000` |

> 🔒 **Never commit `.env` files to version control.** Add them to `.gitignore`.

---

## API Overview

### Auth Routes — `/api/auth`

| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/register` | Register a new user | Public |
| `POST` | `/login/user` | User login | Public |
| `POST` | `/login/admin` | Admin login | Public |

### Chat Routes — `/api/chat`

| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/ask` | Ask a question (AI responds from docs) | User |
| `GET` | `/history` | Get conversation history | User |
| `DELETE` | `/history/:id` | Delete a specific conversation | User |

### Resource Routes — `/api/resources`

| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/upload` | Upload a new document | Admin |
| `GET` | `/` | List all uploaded documents | Admin |
| `DELETE` | `/:id` | Delete a document | Admin |

### Admin Routes — `/api/admin`

| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/users` | List all registered users | Admin |
| `GET` | `/stats` | Usage statistics | Admin |

---

## Role-Based Access Control

EduQuery uses a two-role system enforced by JWT middleware:

### 👤 User
- Register and log in via the User portal
- Ask questions through the conversational chat interface
- View, manage, and delete personal conversation history
- Access profile settings

### 🛠️ Admin
- Log in via the Admin portal (no self-registration)
- Upload, view, and delete knowledge documents (PDF, DOCX, TXT)
- Monitor user activity and system usage
- Access the full Admin Dashboard

> Role is embedded in the JWT payload. The `admin.js` middleware checks the role on every protected admin route.

---

## Deployment

EduQuery is deployed on **[Render](https://render.com)** — free tier supported.

### Frontend (Static Site)

1. Connect your GitHub repository to Render
2. Set **Build Command:** `npm run build`
3. Set **Publish Directory:** `build`
4. Add a `_redirects` file in `public/` for SPA routing:
   ```
   /* /index.html 200
   ```
5. Set `REACT_APP_API_URL` to your deployed backend URL in Render's environment settings

### Backend (Web Service)

1. Connect your GitHub repository to Render
2. Set **Start Command:** `node server.js`
3. Add all backend environment variables in Render's environment settings
4. Use **MongoDB Atlas** for the database (free M0 cluster available)

---

## Design Philosophy

EduQuery is built around four core principles:

- **Accuracy First** — No hallucinations. The AI is strictly constrained to answer only from uploaded documents.
- **Transparency** — Every answer is traceable to a document in the knowledge base.
- **Security** — JWT authentication, role guards, rate limiting, and seed-only admin creation prevent unauthorized access.
- **Simplicity** — Clean, minimal UI with clear visual hierarchy makes the system easy to use for long sessions.

---

## Future Enhancements

- [ ] **Source Highlighting** — Highlight the exact document passage used for each answer
- [ ] **Confidence Scoring** — Show AI confidence level per response
- [ ] **Multi-Document Citations** — Reference multiple source documents in one answer
- [ ] **Analytics Dashboard** — Visualize query trends and document usage
- [ ] **Document Chunking & Vector Search** — Improve retrieval accuracy with embeddings
- [ ] **Multi-language Support** — Support documents and queries in multiple languages
- [ ] **Export Conversations** — Download chat history as PDF or CSV

---

## Author

**Balaji**  
B.Tech — Artificial Intelligence & Machine Learning

---

## License

This project is intended for academic and demonstration purposes.

---

> *EduQuery demonstrates full-stack engineering, secure AI deployment, document-grounded reasoning, and production-ready system design.*
