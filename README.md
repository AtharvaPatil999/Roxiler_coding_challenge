# Roxiler — Fullstack Intern Coding Challenge

This repository contains a simple but complete fullstack app for the Roxiler coding challenge, a React frontend and an Express backend with PostgreSQL.
The app lets users register/login, submit ratings (1–5) for stores, and gives role-based dashboards for Admin, Normal User, and Store Owner.

---

## Tech stack

* Frontend: React (create-react-app), React Router, Axios
* Backend: Node.js, Express
* Database: PostgreSQL
* Auth: bcrypt for password hashing, JWT for authentication

---

## What’s included / Features

* Signup and Login (backend-validated)
* JWT-based authentication and role handling (`admin`, `user`, `owner`)
* User dashboard: list of stores, submit/modify rating
* Admin dashboard: add stores, view stores list
* Owner dashboard: view ratings for their store and average rating
* Basic form validation on backend (password strength, required fields)
* Simple sorting/search can be added easily on frontend

---

## Project structure (high level)

```
roxiler-fullstack-challenge/
├─ frontend/        # React app
│  ├─ public/
│  └─ src/
│     ├─ pages/     # Login, Signup, User/Admin/Owner dashboards
│     ├─ components/# StoreList, RatingForm, Navbar
│     └─ styles/    # App.css, forms.css
└─ backend/         # Express + PostgreSQL
   ├─ controllers/
   ├─ routes/
   ├─ db.js
   ├─ server.js
   └─ .env.example
```

---

## Prerequisites (install first)

1. **Node.js** (v16+ recommended) and npm
2. **PostgreSQL** (local or hosted). Make sure `psql` or pgAdmin is available.
3. (Optional) Postman for API testing

---

## Quick start — run locally (step by step)

### 1. Clone repository

```bash
git clone <your-repo-url>
cd roxiler-fullstack-challenge
```

### 2. Backend — setup and run

#### a. Create PostgreSQL database

Open your psql shell or pgAdmin and run:

```sql
CREATE DATABASE roxilerdb;
```

#### b. Create tables

Run these SQL statements (via psql, pgAdmin or a migration script):

```sql
-- Users
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(60) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  address VARCHAR(400),
  password VARCHAR(255) NOT NULL,
  role VARCHAR(10) DEFAULT 'user'
);

-- Stores
CREATE TABLE IF NOT EXISTS stores (
  id SERIAL PRIMARY KEY,
  name VARCHAR(60) NOT NULL,
  email VARCHAR(100),
  address VARCHAR(400)
);

-- Ratings
CREATE TABLE IF NOT EXISTS ratings (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  store_id INT REFERENCES stores(id),
  rating INT CHECK (rating >= 1 AND rating <= 5)
);
```

#### c. Create `.env` for backend

In `backend/` create a file named `.env` (do not commit this file). Use the following variables:

```
PORT=5000
DB_USER=postgres
DB_PASS=your_db_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=roxilerdb
JWT_SECRET=your_jwt_secret_here
```

If you use a hosted PostgreSQL, change the DB_HOST/DB_PORT accordingly.

#### d. Install and run backend

```bash
cd backend
npm install
npm run dev    # runs nodemon server.js
```

Expected: `Server running on port 5000` and no DB connection errors.

---

### 3. Frontend — setup and run

Open a new terminal window:

```bash
cd frontend
npm install
npm start
```

This opens the React app at `http://localhost:3000`.

---

## Important URLs to test (frontend)

* `http://localhost:3000/` → Login page
* `http://localhost:3000/signup` → Signup page
* `http://localhost:3000/user` → User dashboard (after login)
* `http://localhost:3000/admin` → Admin dashboard (after login as admin)
* `http://localhost:3000/owner` → Owner dashboard (after login as owner)

> Note: If you try to access `/admin` or `/owner` directly without valid login/role, the app should redirect or show limited functionality depending on how you protect routes.

---

## API endpoints (backend)

Base URL (local): `http://localhost:5000/api`

### Auth

* `POST /auth/register` — register a user

  * Body: `{ name, email, address, password, role }` (role optional; default `user`)
  * Example: `{ "name": "Atharva", "email": "atharva@gmail.com", "address": "pune", "password": "Abc@12345", "role": "admin" }`

* `POST /auth/login` — login

  * Body: `{ email, password }`
  * Response: `{ token, role, name }`

### Stores

* `GET /stores` — get all stores
* `POST /stores` — add a store (admin)

  * Body: `{ name, email, address }`

### Ratings

* `POST /ratings` — create or update rating

  * Body: `{ user_id, store_id, rating }`

* `GET /ratings/:store_id` — get all ratings for a store

> Protected endpoints should receive `Authorization: Bearer <token>` header. Make sure the frontend sends the token from `localStorage` after login.

---

## Creating initial admin/owner users

Option 1 — Use register API with role set to `admin` or `owner`:

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"name":"Admin One","email":"admin@example.com","address":"HQ","password":"Admin@123","role":"admin"}'
```

Option 2 — Insert directly in the database (you must bcrypt-hash the password first if inserting raw). Using the API is simpler.

---

## Typical flow (what a recruiter should test)

1. Open `http://localhost:3000/` (Login page). If you don't have an account, go to `/signup`.
2. Sign up a new normal user or create admin/owner via `POST /api/auth/register` with role.
3. Login with the created user. After login you will be redirected to the right dashboard based on role.
4. As Admin: add stores via the Admin dashboard form (`POST /api/stores`).
5. As User: visit `/user`, view stores and submit ratings. Ratings persist to DB (`POST /api/ratings`).
6. As Owner: visit `/owner` to view ratings for your store (`GET /api/ratings/:store_id`).

---

## Deployment notes (short)

* **Frontend**: Build with `npm run build` and deploy to Netlify (connect GitHub repo and set publish folder to `frontend/build`).
* **Backend**: Deploy to a node host (Render, Railway) and set environment variables in the host dashboard. If using a hosted Postgres, update DB connection settings.

Make sure the deployed frontend points to the deployed backend URL (set an `REACT_APP_API_URL` or update Axios base URL accordingly).

---

## Troubleshooting / common issues

* **`CORS` errors**: Ensure backend has `app.use(cors())` and backend is running on expected port.
* **`Database connection` errors**: Check `.env` values, Postgres service running, and credentials. Use `psql` to test.
* **`Invalid credentials` / login fails**: Ensure you registered the user with a password that meets backend rules (8–16 chars, at least one uppercase and one special character).
* **Routes show blank or compile issues**: Run `npm start` in `frontend` again and check console errors. Usually missing exports or missing imports cause this.

---

## Security / final notes

* Do **not** commit `.env` with secrets. Add `.env.example` with placeholder values to the repo.
* Keep `JWT_SECRET` safe; change it before production.
* This project uses simple role checks — for production, harden auth checks and validation.

---


