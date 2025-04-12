# Secure Developer Portal 🔐

A full-stack secure internal dashboard with role-based access control, OAuth2 login, and audit logging — built using:

- React + Vite (Frontend)
- Express + Node.js (Backend API)
- **MySQL (Dockerized Database)**
- Docker + Docker Compose
- Deployed with CI/CD on Vercel (frontend) and Render/Fly.io (backend)

---

## 📦 Features

- OAuth login with Google or Microsoft
- RBAC: viewer, developer, admin roles
- Role-based API and UI access
- Full audit logging of user actions
- Config editor with history
- Clean UI and responsive layout
- CI/CD with GitHub Actions

---

## 🧠 Architecture

- `client/` – React frontend
- `server/` – Express backend
- `db-init/` – MySQL schema + seed data
- `docker-compose.yml` – Container orchestration

---

## 🚀 Getting Started

```bash
# 1. Start MySQL DB
docker-compose up -d          

# 2. Start backend
cd server
npm install
node server.js

# 3. Start frontend
cd ../client
npm install
npm run dev

```


## 🧪 Seed Users

```markdown
| Email            | Name        | Role      |
|------------------|-------------|-----------|
| admin@demo.com   | Admin User  | admin     |
| dev@demo.com     | Dev User    | developer |
| viewer@demo.com  | Viewer User | viewer    |
