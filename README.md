# 💼 Job Portal — Backend API

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

**Production-deployed RESTful API for a full-stack Job Portal application.**  
Built with Node.js, Express, and MongoDB — featuring JWT authentication, RBAC, resume uploads, and CI/CD.

[🚀 Live API](https://jobportal-backend-navy.vercel.app) · [🖥️ Frontend Repo](https://github.com/codewithabhi2003/jobportal-frontend) · [🌐 Live App](https://jobportal-frontend-ten.vercel.app)

</div>

---

## 📌 Overview

This is the backend service for a MERN-stack Job Portal that connects **Job Seekers** and **Recruiters**. It handles all business logic, data persistence, authentication, file management, and serves the React frontend as a unified deployment on Vercel.

---

## ✨ Features

- 🔐 **JWT Authentication** — secure login/signup with `httpOnly` cookie-based token storage
- 👥 **Role-Based Access Control (RBAC)** — separate permission layers for `Recruiter` and `Job Seeker`
- 📄 **Resume Upload** — cloud-based resume storage via Cloudinary with Multer validation
- 🔍 **Dynamic Job Filtering** — filter jobs by title, location, salary, job type, and more
- 📋 **Application Lifecycle** — full management from submission to status updates
- 🏗️ **MVC Architecture** — clean separation of concerns across controllers, models, routes, and utils
- 🔄 **CI/CD Pipeline** — automated build validation via GitHub Actions with Vercel deployment
- 🛡️ **Password Security** — bcryptjs hashing for all stored credentials

---

## 🗂️ Project Structure

```
jobportal-backend/
├── .github/
│   └── workflows/          # GitHub Actions CI/CD pipeline
├── controllers/            # Route handler logic (auth, jobs, applications, users)
├── middlewares/            # JWT auth guard, role-based access, file upload (Multer)
├── models/                 # Mongoose schemas (User, Job, Application)
├── routes/                 # Express route definitions
├── utils/                  # Helper functions (cloudinary config, data URI, etc.)
├── Frontend/               # React frontend (served from same deployment)
├── index.js                # App entry point — Express server setup
├── vercel.json             # Vercel deployment config
└── package.json
```

---

## 🔗 API Endpoints

### 🔑 Auth Routes — `/api/v1/user`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `POST` | `/register` | Public | Register as Job Seeker or Recruiter |
| `POST` | `/login` | Public | Login and receive JWT cookie |
| `GET` | `/logout` | Protected | Clear session and invalidate token |
| `GET` | `/profile` | Protected | Get logged-in user profile |
| `PUT` | `/profile/update` | Protected | Update profile + resume upload |

### 💼 Job Routes — `/api/v1/job`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `POST` | `/post` | Recruiter | Post a new job listing |
| `GET` | `/get` | Public | Get all jobs with dynamic filters |
| `GET` | `/getadminjobs` | Recruiter | Get all jobs posted by logged-in recruiter |
| `GET` | `/get/:id` | Public | Get single job by ID |
| `PUT` | `/update/:id` | Recruiter | Update job details |
| `DELETE` | `/delete/:id` | Recruiter | Delete a job listing |

### 📋 Application Routes — `/api/v1/application`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `POST` | `/apply/:id` | Job Seeker | Apply to a job |
| `GET` | `/get` | Job Seeker | Get all applications submitted by user |
| `GET` | `/applicants/:id` | Recruiter | View all applicants for a job |
| `PUT` | `/status/:id/update` | Recruiter | Update application status (accepted/rejected) |

### 🏢 Company Routes — `/api/v1/company`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `POST` | `/register` | Recruiter | Register a company |
| `GET` | `/get` | Recruiter | Get all companies by recruiter |
| `GET` | `/get/:id` | Protected | Get single company details |
| `PUT` | `/update/:id` | Recruiter | Update company info + logo upload |

---

## ⚙️ Tech Stack

| Category | Technology |
|----------|-----------|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB + Mongoose ODM |
| Authentication | JWT + bcryptjs |
| File Uploads | Multer + Cloudinary |
| Security | RBAC, cookie-parser, CORS |
| Deployment | Vercel |
| CI/CD | GitHub Actions |
| Testing | Postman |

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- MongoDB Atlas account (or local MongoDB)
- Cloudinary account

### 1. Clone the repository

```bash
git clone https://github.com/codewithabhi2003/jobportal-backend.git
cd jobportal-backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the root directory:

```env
PORT=8000
MONGO_URI=your_mongodb_connection_string
SECRET_KEY=your_jwt_secret_key

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

FRONTEND_URL=http://localhost:5173
```

### 4. Run the development server

```bash
npm run dev
```

The API will be available at `http://localhost:8000`

---

## 🧪 API Testing

All 15+ endpoints have been tested and documented using **Postman**.

To test locally:
1. Import the collection into Postman
2. Set `baseURL` variable to `http://localhost:8000/api/v1`
3. Register a user → Login → Copy the JWT cookie → Test protected routes

---

## 🔒 Authentication Flow

```
Client → POST /user/login
       ← JWT token set in httpOnly cookie

Client → GET /job/get (protected)
       → Middleware extracts & verifies JWT from cookie
       → Attaches user to req.user
       → Controller executes with verified identity
```

---

## ☁️ Deployment

This API is deployed on **Vercel** as a unified full-stack deployment — the Express backend serves the React frontend build from the `Frontend/` directory.

The `vercel.json` config routes all `/api/*` requests to Express and all other routes to the React SPA.

CI/CD is handled via **GitHub Actions** — every push to `main` triggers a build validation workflow before deployment.

---

## 🔗 Related Repositories

| Repo | Description |
|------|-------------|
| [jobportal-frontend](https://github.com/codewithabhi2003/jobportal-frontend) | React.js frontend with code-splitting and dynamic routing |
| [JOB-PORTAL](https://github.com/codewithabhi2003/JOB-PORTAL) | Full monorepo version of the project |

---

## 👨‍💻 Author

**Abhishek Vishwakarma**

[![Portfolio](https://img.shields.io/badge/Portfolio-000000?style=flat&logo=vercel&logoColor=white)](https://portfolio-tau-lilac-98.vercel.app)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=flat&logo=linkedin&logoColor=white)](https://linkedin.com/in/abhishek-vishwakarma)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=flat&logo=github&logoColor=white)](https://github.com/codewithabhi2003)

---

<div align="center">
  <sub>⭐ If this project helped you, consider giving it a star!</sub>
</div>
