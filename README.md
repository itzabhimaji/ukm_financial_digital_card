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
Or use MongoDB Atlas (free cloud) at https://cloud.mongodb.com

### Step 3 — Install dependencies
```bash
cd ukm-financial-hub
npm install
```

### Step 4 — Configure environment
Edit `.env` file:
```
MONGO_URI=mongodb://127.0.0.1:27017/ukm_financial
PORT=3000
```
For MongoDB Atlas, replace MONGO_URI with your Atlas connection string.

### Step 5 — Add your photo
Put your father's photo inside `public/images/` as `uttam.jpg`  
Then in `views/index.ejs`, replace the emoji span with:
```html
<img src="/images/uttam.jpg" alt="Uttam Kumar Maji" />
```

### Step 6 — Update social media links
In `views/index.ejs`, find these lines and replace with your actual URLs:
```
href="https://youtube.com/@YOUR_CHANNEL"
href="https://facebook.com/YOUR_PAGE"
href="https://linkedin.com/in/YOUR_PROFILE"
href="https://instagram.com/YOUR_HANDLE"
```

### Step 7 — Run the project
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

| Method | URL | Description |
|--------|-----|-------------|
| GET    | `/api/reviews` | Fetch all approved reviews |
| POST   | `/api/reviews` | Submit a new review |
| PATCH  | `/api/reviews/:id/approve` | Approve a review |
| DELETE | `/api/reviews/:id` | Delete a review |

---

## Approving Reviews

By default, submitted reviews have `approved: false`.  
To approve a review, use this command in your terminal:

```bash
curl -X PATCH http://localhost:3000/api/reviews/REVIEW_ID/approve
```

Or use MongoDB Compass (GUI) to manually set `approved: true`.

---

## Deploying Online

### Option A — Render (Free)
1. Push code to GitHub
2. Go to https://render.com → New Web Service
3. Connect your GitHub repo
4. Set environment variable MONGO_URI (use MongoDB Atlas)
5. Build command: `npm install`  Start command: `npm start`

### Option B — Railway (Free tier)
1. Go to https://railway.app
2. Deploy from GitHub
3. Add MONGO_URI environment variable

### Option C — VPS (DigitalOcean / Hostinger)
Full control, ~₹500/month

---

## Technologies Used

- **Node.js** — JavaScript runtime
- **Express.js** — Web framework
- **MongoDB** — Database (stores reviews)
- **Mongoose** — MongoDB object modelling
- **EJS** — HTML templating engine
- **Bootstrap 5** — Responsive grid & utilities
- **Vanilla JS** — Frontend interactions
