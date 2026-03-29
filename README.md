# 🍳 Recipe App

A full-stack recipe management app built with React and Cloudflare Workers.

## 🌐 Live Demo
**https://recipe-app-b42.pages.dev/**

## ✨ Features
- Browse and search your saved recipes
- Search millions of recipes via Spoonacular API and import them with one click
- Add your own recipes manually with ingredients and step-by-step instructions
- Shopping list — add ingredients from any recipe and check them off while shopping
- Fully responsive design for mobile, tablet and desktop

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React, TypeScript, Tailwind CSS, Framer Motion, React Router |
| Backend | Cloudflare Workers, Hono |
| Database | Cloudflare D1 (SQLite) |
| External API | Spoonacular Food API |
| Deployment | Cloudflare Pages + Workers |

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Cloudflare account
- Spoonacular API key (free at [spoonacular.com/food-api](https://spoonacular.com/food-api))

### Installation

1. **Clone the repo**
   ```bash
   git clone https://github.com/ihorpushkar/recipe-app.git
   cd recipe-app
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install worker dependencies**
   ```bash
   cd worker && npm install
   ```

4. **Add Spoonacular API key to `worker/wrangler.toml`**
   ```toml
   [vars]
   SPOONACULAR_API_KEY = "your-api-key-here"
   ```

5. **Initialize local D1 database**
   ```bash
   npx wrangler d1 execute recipes_db --local --file=schema.sql
   ```

6. **Run the app**

   Frontend (in root folder):
   ```bash
   npm run dev
   ```

   Worker (in worker folder):
   ```bash
   npx wrangler dev
   ```

7. Open **http://localhost:5173**

## 📦 Deployment

### Deploy Worker
```bash
cd worker
npx wrangler deploy
```

### Deploy Frontend
```bash
npm run build
npx wrangler pages deploy dist --project-name=recipe-app
```

## 📁 Project Structure

```
recipe-app/
├── src/                  # React frontend
│   ├── api/              # API call functions
│   ├── components/       # Reusable UI components
│   ├── hooks/            # Custom React hooks
│   ├── pages/            # Page components
│   └── types/            # TypeScript interfaces
└── worker/               # Cloudflare Worker backend
    ├── src/
    │   ├── routes/       # API routes
    │   └── db/           # Database schema
    ├── schema.sql        # D1 database schema
    └── wrangler.toml     # Cloudflare configuration
```
