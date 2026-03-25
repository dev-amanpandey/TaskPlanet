# Mini Social Post App (TaskPlanet-inspired)

## Features
- **Auth**: signup + login (email/password) with JWT
- **Create post**: text and/or image (either one is enough)
- **Public feed**: all posts from all users (cursor pagination)
- **Like + comment**: updates reflect instantly (optimistic UI)
- **DB constraint**: only **2 MongoDB collections**: `users`, `posts`

## Tech
- Frontend: React + MUI
- Backend: Node.js + Express
- Database: MongoDB (Mongoose)

## Setup

### 1) Backend
From `server/`:

1. Copy env file:
   - Copy `server/.env.example` to `server/.env`
2. Update `MONGODB_URI` and `JWT_SECRET` in `server/.env`
3. Install + run:

```bash
npm install
npm run dev
```

Backend runs on `http://localhost:4000` (health check at `/health`).

### 2) Frontend
From `client/`:

1. (Optional) Copy env file:
   - Copy `client/.env.example` to `client/.env`
2. Install + run:

```bash
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`.

## API (quick reference)
- `POST /auth/signup` `{ email, username, password }`
- `POST /auth/login` `{ email, password }`
- `GET /posts?limit=10&cursorCreatedAt=...&cursorId=...`
- `POST /posts` (multipart) fields: `text` and/or `image`
- `POST /posts/:id/like`
- `POST /posts/:id/comment` `{ text }`

