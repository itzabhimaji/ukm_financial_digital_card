# UKM Financial Hub — Digital Card

A full-stack digital business card built with **Node.js + Express + MongoDB + EJS**.

---

## Project Structure

```
ukm-financial-hub/
├── server.js              ← Main Express server (entry point)
├── package.json           ← Dependencies & scripts
├── .env                   ← Environment variables (NEVER commit this)
├── .gitignore
│
├── models/
│   └── Review.js          ← MongoDB schema for reviews
│
├── routes/
│   └── reviews.js         ← API endpoints for reviews (GET/POST/DELETE)
│
├── views/
│   └── index.ejs          ← HTML template (the digital card UI)
│
└── public/
    ├── css/
    │   └── style.css      ← All styling (gold & navy theme)
    ├── js/
    │   └── main.js        ← Frontend logic (modal, share, API calls)
    └── images/
        └── (put photo here as uttam.jpg)
```

---

## Step-by-Step Setup

### Step 1 — Install Node.js

Download from https://nodejs.org (choose LTS version)

### Step 2 — Install MongoDB

Download from https://www.mongodb.com/try/download/community  
Or use MongoDB Atlas at https://cloud.mongodb.com

### Step 3 — Install dependencies

```bash
cd ukm-financial-hub
npm install
```

### Step 4 — Configure environment

Edit `.env` file:

```
MONGO_URI=ukm_financial mongo_url
PORT=3000
```

For MongoDB Atlas, replace MONGO_URI with your Atlas connection string.

### Step 5 — Run the project

```bash
npm start
```

Open http://localhost:3000 in your browser.

For development (auto-restart on changes):

```bash
npm run dev
```

---

## API Endpoints

| Method | URL                        | Description                |
| ------ | -------------------------- | -------------------------- |
| GET    | `/api/reviews`             | Fetch all approved reviews |
| POST   | `/api/reviews`             | Submit a new review        |
| PATCH  | `/api/reviews/:id/approve` | Approve a review           |
| DELETE | `/api/reviews/:id`         | Delete a review            |

---

## Approving Reviews

By default, submitted reviews have `approved: false`.  
To approve a review, use this command in your terminal:

```bash
curl -X PATCH http://localhost:3000/api/reviews/REVIEW_ID/approve
```

Or use MongoDB Compass (GUI) to manually set `approved: true`.

---

## Technologies Used

- **Node.js** — JavaScript runtime
- **Express.js** — Web framework
- **MongoDB** — Database (stores reviews)
- **Mongoose** — MongoDB object modelling
- **EJS** — HTML templating engine
- **Bootstrap 5** — Responsive grid & utilities
- **Vanilla JS** — Frontend interactions
