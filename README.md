# 🚀 Real-Time Task Management Backend

Production-grade backend API with realtime infrastructure, Redis queues, Dockerized deployment, Swagger documentation, HTTPS reverse proxying, and automated CI/CD.

![Node.js](https://img.shields.io/badge/Node.js-20-green)
![Express](https://img.shields.io/badge/Express.js-Backend-black)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-blue)
![Redis](https://img.shields.io/badge/Redis-Queue-red)
![Docker](https://img.shields.io/badge/Docker-Containerization-blue)
![NGINX](https://img.shields.io/badge/NGINX-Reverse%20Proxy-green)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-CI%2FCD-black)
![Swagger](https://img.shields.io/badge/Swagger-OpenAPI-green)

---

# 🌐 Live Production API

### API Base URL

```bash
https://api.iamshaurya.me
```

### Swagger Documentation

```bash
https://api.iamshaurya.me/api-docs
```

---

# 📖 Overview

This project is a production-grade backend system for realtime task management built with Node.js, Express, Prisma, PostgreSQL, Redis, and BullMQ.

The system focuses not only on CRUD functionality, but also on backend infrastructure engineering concepts such as:

* Dockerized deployments
* Queue-based background workers
* Reverse proxy architecture
* HTTPS + SSL setup
* Automated CI/CD deployment
* Redis-based rate limiting
* JWT authentication
* OAuth authentication
* Swagger/OpenAPI documentation
* Cloud VM deployment

The backend is deployed on an Azure Virtual Machine using Docker Compose and automated through GitHub Actions CI/CD.

---

# ✨ Features

## 🔐 Authentication & Security

* JWT Access & Refresh Tokens
* Google OAuth Authentication
* GitHub OAuth Authentication
* Role-Based Access Control (RBAC)
* Redis Token Blacklisting
* Helmet Security Middleware
* CORS Protection
* Request Logging & Request IDs
* Redis-Based Rate Limiting

---

## 📋 Task Management

* Create Tasks
* Update Tasks
* Delete Tasks
* Assign Tasks
* Admin Role Management
* Protected Routes

---

## ⚡ Realtime & Background Processing

* Redis Queue Infrastructure
* BullMQ Worker Architecture
* Async Audit Logging
* Background Workers

---

## ☁️ DevOps & Infrastructure

* Dockerized Backend Services
* Docker Compose Orchestration
* NGINX Reverse Proxy
* HTTPS SSL Configuration
* Custom Domain Setup
* Azure VM Deployment
* Automated GitHub Actions CI/CD

---

## 📚 API Documentation

* Swagger/OpenAPI Documentation
* Interactive API Testing
* Bearer Authentication Support
* Request/Response Schemas

---

# 🏗️ System Architecture

```text
                ┌────────────────────┐
                │      Client        │
                └─────────┬──────────┘
                          │
                          ▼
                ┌────────────────────┐
                │       NGINX        │
                │ Reverse Proxy + SSL│
                └─────────┬──────────┘
                          │
                          ▼
                ┌────────────────────┐
                │    Express API     │
                │   Node.js Server   │
                └──────┬─────┬───────┘
                       │     │
         ┌─────────────┘     └─────────────┐
         ▼                                 ▼
┌──────────────────┐            ┌──────────────────┐
│    PostgreSQL    │            │      Redis       │
│    Prisma ORM    │            │ Queue + Caching  │
└──────────────────┘            └────────┬─────────┘
                                         │
                                         ▼
                               ┌──────────────────┐
                               │  BullMQ Workers  │
                               │ Background Jobs  │
                               └──────────────────┘
```

---

# 🛠️ Tech Stack

| Category       | Technologies               |
| -------------- | -------------------------- |
| Backend        | Node.js, Express.js        |
| Database       | PostgreSQL                 |
| ORM            | Prisma                     |
| Queue System   | Redis, BullMQ              |
| Authentication | JWT, Passport.js           |
| OAuth          | Google OAuth, GitHub OAuth |
| Documentation  | Swagger/OpenAPI            |
| Reverse Proxy  | NGINX                      |
| Deployment     | Docker, Docker Compose     |
| CI/CD          | GitHub Actions             |
| Cloud Hosting  | Microsoft Azure VM         |

---

# 🔑 Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5000
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/realtime_tasks
NODE_ENV=development

JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

CORS_ORIGIN=http://localhost:5000
REDIS_URL=redis://redis:6379

POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=realtime_tasks

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```

---

# 🐳 Running Locally With Docker

## 1️⃣ Clone Repository

```bash
git clone https://github.com/Shaurya130/Real-time-task-management.git
cd Real-time-task-management
```

---

## 2️⃣ Start Containers

```bash
docker-compose up -d --build
```

---

## 3️⃣ Verify Running Containers

```bash
docker ps
```

---

## 4️⃣ Access API

```bash
http://localhost:5000
```

---

## 5️⃣ Access Swagger Docs

```bash
http://localhost:5000/api-docs
```

---

# 📚 Swagger API Documentation

Swagger/OpenAPI documentation is fully integrated for:

* Route documentation
* Request schemas
* Response schemas
* JWT Authentication
* Interactive API testing

### Production Swagger URL

```bash
https://api.iamshaurya.me/api-docs
```

---

# 🔄 CI/CD Pipeline

This project uses GitHub Actions for automated production deployment.

### Deployment Flow

```text
Developer Pushes Code
          ↓
GitHub Actions Workflow Starts
          ↓
SSH Into Azure VM
          ↓
Pull Latest Repository
          ↓
Docker Compose Rebuild
          ↓
Production Deployment Updated
```

### CI/CD Features

* Automated Production Deployment
* Secure SSH Authentication
* Docker-Based Deployment
* GitHub Secrets Management
* Zero Manual Deployment Required

---

# 🔒 Production Infrastructure

### Infrastructure Highlights

* Azure Virtual Machine Hosting
* NGINX Reverse Proxy
* HTTPS SSL Encryption
* Dockerized Services
* Persistent PostgreSQL Volumes
* Redis Queue Infrastructure
* Background Workers
* GitHub Actions Deployment Automation

---

# 📸 Screenshots

## Swagger Documentation

![Swagger UI](./assets/Swagger.png)

---

## GitHub Actions CI/CD

![GitHub Actions](./assets/GitHUB%20Actions.png)

---

# 📂 Project Structure

```text
src/
├── auth/
├── config/
├── controllers/
├── docs/
├── middlewares/
├── routes/
├── sockets/
├── utils/
├── validations/
├── workers/
└── server.js
```

---

# 🚀 Future Improvements

* WebSocket Realtime Updates
* Email Notifications
* Frontend Dashboard
* Task Analytics
* Kubernetes Deployment
* Monitoring & Observability
* Unit & Integration Testing

---

# 👨‍💻 Author

### Shaurya Awasthi

* Backend Developer
* Node.js | Express | Prisma | PostgreSQL | Redis
* Interested in Backend Infrastructure & Cloud Engineering

### Portfolio

```bash
https://iamshaurya.me
```

### GitHub

```bash
https://github.com/Shaurya130
```

---

# ⭐ Support

If you found this project useful, consider giving it a star on GitHub.
