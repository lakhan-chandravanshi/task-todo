# TaskFlow - Employee Task Management System

TaskFlow is a polished MERN stack employee task management system with role-based access for admins and employees. Admins can manage employees and tasks, while employees can view and update their assigned tasks.

## Features
- Admin authentication and dashboard
- Employee management
- Task creation and assignment
- Task status tracking (Todo, In Progress, Completed)
- Employee task updates
- JWT-based protected routes
- Dockerized frontend, backend, and MongoDB

## Tech Stack
- React + Vite
- Tailwind CSS
- Zustand
- Node.js + Express
- MongoDB + Mongoose
- JWT + bcrypt

## Project Structure
- Backend: Express API, MongoDB models, auth and task routes
- Frontend: React app with auth pages and role-based dashboards

## Installation
1. Clone the repository.
2. Install backend dependencies:
   ```bash
   cd Backend && npm install
   ```
3. Install frontend dependencies:
   ```bash
   cd ../frontend && npm install
   ```
4. Copy environment variables:
   ```bash
   cp Backend/.env.example Backend/.env
   ```
5. Start MongoDB locally or use Docker Compose.
6. Start backend:
   ```bash
   cd Backend && npm run dev
   ```
7. Start frontend:
   ```bash
   cd frontend && npm run dev
   ```

## Environment Variables
- PORT
- MONGO_URI
- JWT_SECRET
- CLIENT_URL

## Docker Setup
```bash
docker compose up --build
```

## API Overview
- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/me
- GET /api/employees
- POST /api/employees
- PUT /api/employees/:id
- DELETE /api/employees/:id
- GET /api/tasks
- POST /api/tasks
- PUT /api/tasks/:id
- DELETE /api/tasks/:id
- PUT /api/tasks/:id/assign
- PUT /api/tasks/:id/status

## Test Credentials
- Admin: admin@example.com / admin123
- Employee: employee@example.com / employee123

## Live Application
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Postman Collection
A ready-to-import collection is included in the repository as [Backend/TaskFlow.postman_collection.json](Backend/TaskFlow.postman_collection.json).
