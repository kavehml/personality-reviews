# Deploy to Railway (GitHub + PostgreSQL)

Step-by-step guide to deploy Personality Reviews online using GitHub and Railway.

## Prerequisites

- GitHub account (with your code pushed)
- Railway account ([railway.app](https://railway.app))

---

## 1. Push your code to GitHub

```bash
cd personality-reviews
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

---

## 2. Create a Railway project

1. Go to [railway.app](https://railway.app) and sign in
2. Click **New Project**
3. Choose **Deploy from GitHub repo**
4. Select your repository and connect it
5. Railway will create a service from your repo

---

## 3. Add PostgreSQL

1. In your Railway project, click **+ New**
2. Select **Database** → **PostgreSQL**
3. Railway creates a Postgres instance and automatically adds `DATABASE_URL` to your app’s environment variables
4. Click on your app service → **Variables** to confirm `DATABASE_URL` is present (it’s shared from the Postgres service)

---

## 4. Set required environment variables

In your **app service** (not the database) → **Variables** → **Add Variable**:

| Variable | Value | How to get it |
|----------|-------|---------------|
| `NEXTAUTH_SECRET` | Random 32+ char string | Run: `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Your app URL | e.g. `https://personality-reviews-production.up.railway.app` |

**Getting your app URL:**

1. In the app service → **Settings** → **Networking**
2. Click **Generate Domain** to create a public URL
3. Copy that URL and set it as `NEXTAUTH_URL` (with `https://`)

---

## 5. Deploy

1. Railway will deploy automatically when you push to GitHub
2. The build runs: `prisma generate && prisma migrate deploy && next build`
3. Migrations apply to PostgreSQL
4. The app starts with `npm start`

---

## 6. Seed the database (once, after first deploy)

After the first successful deploy, run the seed script so you have restaurants and sample reviews:

**Option A: Railway CLI**

```bash
npm i -g @railway/cli
railway login
railway link   # Select your project and app service
railway run npx prisma db seed
```

**Option B: Railway Dashboard**

1. Go to your app service
2. **Settings** → **Deploy** → **Custom start command**
3. Temporarily use: `npx prisma db seed && npm start`
4. Redeploy once, then change back to `npm start`

**Option C: From your machine**

```bash
# Set DATABASE_URL to your Railway Postgres URL (from Railway Variables)
export DATABASE_URL="postgresql://..."
npx prisma db seed
```

---

## 7. Test accounts (after seeding)

| Email | Password | Cohort |
|-------|----------|--------|
| explorer@test.com | password123 | Explorer |
| planner@test.com | password123 | Planner |
| foodie@test.com | password123 | Foodie |
| value@test.com | password123 | Value-Seeker |
| minimal@test.com | password123 | Minimalist |

---

## Troubleshooting

**Build fails with "relation does not exist"**  
- Ensure PostgreSQL is added and `DATABASE_URL` is set before the first deploy  
- Migrations run during build; the database must be reachable

**"Invalid NEXTAUTH_URL" or auth redirect issues**  
- Set `NEXTAUTH_URL` to your exact app URL (e.g. `https://xxx.up.railway.app`)  
- No trailing slash

**No restaurants showing**  
- Run the seed script (Step 6)

**Local development**  
- Use PostgreSQL locally, or switch `prisma/schema.prisma` back to `provider = "sqlite"` for local-only dev
