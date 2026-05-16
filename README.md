# Hostel Management System

## Problem

Manual hostel management is inefficient and error-prone.

## Solution

A full-stack web app with a React frontend and REST APIs for hostel admins and students.

## Features

- Admin login (JWT) and CRUD for students, rooms, admins, notices, complaints
- Student register/login, profile, room view, notices, complaints
- Room allocation and fee tracking
- Postman collection for API testing

## Technologies Used

- Node.js, Express.js, MongoDB, Mongoose
- React, Vite, React Router
- Postman, GitHub

## Setup

**1. Backend** (project root)

```bash
npm install
npm run seed:admin    
npm start
```

**2. Frontend** (`client` folder)

```bash
cd client
npm install
npm run dev
```

Open **[http://localhost:5173](http://localhost:5173)** — Admin login for manage pages; student register/login for the student portal.

In MongoDB Compass, use the database name from `.env` (e.g. `hostel_management`).

## API Base

`http://localhost:5000/api` — see `postman/POSTMAN_GUIDE.md` for all endpoints.