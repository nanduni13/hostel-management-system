# Postman API Guide — Hostel Management System

**Base URL:** `http://localhost:5000`

## 1. Start the server

```bash
# In project root — needs .env with MONGO_URI and JWT_SECRET
npm run dev

# Create first admin (once)
npm run seed:admin
# Default: username admin / password admin123
```

**.env example:**

```env
MONGO_URI=mongodb://127.0.0.1:27017/hostel_db
JWT_SECRET=your_secret_key_here
PORT=5000
```

## 2. Import collection

1. Open Postman → **Import**
2. Choose `postman/Hostel-Management-System.postman_collection.json`
3. Collection variables: `baseUrl`, `adminToken`, `studentToken`, `roomId`, etc.

## 3. Auth header (protected routes)

| Role    | Header |
|---------|--------|
| Admin   | `Authorization: Bearer <adminToken>` |
| Student | `Authorization: Bearer <studentToken>` |

Get tokens from **Admin Login** or **Student Login/Register** (collection auto-saves them).

---

## Recommended order to add data

1. **Admin Login** → saves `adminToken`
2. **Create Room** → saves `roomId`
3. **Create Notice** (admin)
4. **Student Register** (use `roomId`) OR **Create Student** (admin)
5. **Student Login** → saves `studentToken`
6. **Create Complaint** (student)
7. **Get All Complaints** + **Update Complaint** (admin)

---

## All endpoints (copy for Postman)

### Public (no token)

| Method | URL | Body (JSON) |
|--------|-----|-------------|
| POST | `/api/auth/login` | `{"username":"admin","password":"admin123"}` |
| GET | `/api/auth/rooms` | — |
| POST | `/api/auth/student/register` | see below |
| POST | `/api/auth/student/login` | `{"username":"kamal01","password":"student123"}` |

**Student register body:**

```json
{
  "name": "Kamal Perera",
  "username": "kamal01",
  "email": "kamal@uov.ac.lk",
  "password": "student123",
  "age": 21,
  "department": "Computer Science",
  "roomId": "PASTE_ROOM_ID_HERE"
}
```

`roomId` is optional. Password min 6 characters.

---

### Admin only (`Bearer adminToken`)

| Method | URL | Body |
|--------|-----|------|
| GET | `/api/auth/me` | — |
| POST | `/api/rooms` | `{"roomNumber":"A-101","capacity":4}` |
| GET | `/api/rooms` | — |
| PUT | `/api/rooms/:id` | `{"roomNumber":"A-101","capacity":6}` |
| DELETE | `/api/rooms/:id` | — |
| POST | `/api/students` | `{"name":"Nimal","username":"nimal02","age":22,"department":"IT","feesPaid":true,"roomId":"..."}` |
| GET | `/api/students` | — |
| GET | `/api/students/:id` | — |
| PUT | `/api/students/:id` | same fields as create |
| DELETE | `/api/students/:id` | — |
| POST | `/api/notices` | `{"title":"Notice title","message":"Details here"}` |
| GET | `/api/notices` | — |
| PUT | `/api/notices/:id` | `{"title":"...","message":"..."}` |
| DELETE | `/api/notices/:id` | — |
| GET | `/api/complaints` | — |
| PUT | `/api/complaints/:id` | `{"status":"in_progress","adminReply":"We are checking"}` |
| DELETE | `/api/complaints/:id` | — |
| POST | `/api/admins` | `{"username":"staff01","password":"staff12345"}` |
| GET | `/api/admins` | — |

**Complaint status values:** `pending` | `in_progress` | `resolved`

---

### Student only (`Bearer studentToken`)

| Method | URL | Body |
|--------|-----|------|
| GET | `/api/student/profile` | — |
| GET | `/api/student/room` | — |
| GET | `/api/student/notices` | — |
| GET | `/api/student/complaints` | — |
| POST | `/api/student/complaints` | `{"subject":"Leaking tap","message":"Details..."}` |

---

## cURL examples

**Admin login:**

```bash
curl -X POST http://localhost:5000/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"username\":\"admin\",\"password\":\"admin123\"}"
```

**Create room (replace TOKEN):**

```bash
curl -X POST http://localhost:5000/api/rooms ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer TOKEN" ^
  -d "{\"roomNumber\":\"A-101\",\"capacity\":4}"
```

**Create notice:**

```bash
curl -X POST http://localhost:5000/api/notices ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer TOKEN" ^
  -d "{\"title\":\"Welcome\",\"message\":\"Hostel opens Monday.\"}"
```

---

## Common errors

| Status | Meaning |
|--------|---------|
| 401 | Missing/invalid token — login again |
| 403 | Wrong role (student token on admin route) |
| 400 | Validation error (read `error` in JSON body) |
