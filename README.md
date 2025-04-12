# Secure Developer Portal 🔐

A full-stack secure internal dashboard with role-based access control, OAuth2 login, and audit logging — built using:

- React + Vite (Frontend)
- Express + Node.js (Backend API)
- PostgreSQL (Database)
- Docker + Docker Compose
- Deployed with CI/CD on Vercel (frontend) and Render/Fly.io (backend)

## 📦 Features

- OAuth login with Google or Microsoft
- RBAC: viewer, developer, admin roles
- Role-based API and UI access
- Full audit logging of user actions
- Config editor with history
- Clean UI and responsive layout
- CI/CD with GitHub Actions

## 🧠 Architecture

client/ ← React frontend server/ ← Express backend db-init/ ← Postgres schema + seed data docker-compose.yml

## 🚀 Getting Started

```bash
docker-compose up -d          # Start Postgres
cd server
npm install && node server.js # Start backend
cd ../client
npm install && npm run dev    # Start frontend

🧪 Seed Users
admin@demo.com – Admin

dev@demo.com – Developer

viewer@demo.com – Viewer