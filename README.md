# Personality Reviews

A "Google Reviews"-style app where users see and prioritize reviews written by people with **similar personality types**. Built with Next.js, TypeScript, Prisma, and NextAuth.

## Features

- **Landing page** — Simple explanation and Sign up / Log in CTAs
- **Auth** — Email + password, JWT sessions, protected routes
- **Personality quiz** — 10-question onboarding, assigns one of 5 cohorts (Explorer, Planner, Foodie, Value-Seeker, Minimalist)
- **Restaurants** — Browse, view details, write reviews with ratings, titles, content, and tags
- **Cohort-matched filtering** — Filter reviews by: My cohort, All, or Other cohort (dropdown)
- **Match score** — Badge showing relevance (cohort + rating + interest overlap)

## Tech Stack

- **Next.js 16** (App Router) + **TypeScript**
- **Prisma** + **PostgreSQL** (production on Railway)
- **NextAuth v4** (Credentials provider)
- **Tailwind CSS**
- **Zod** for validation
- **bcrypt** for password hashing

## Local Run Instructions

> **Note:** The app uses PostgreSQL. For local dev, you need a Postgres instance. Use a local install, Docker, or a free cloud DB (e.g. [Neon](https://neon.tech)).

### 1. Install dependencies

```bash
cd personality-reviews
npm install
```

### 2. Set up the database

Create `.env` from `.env.example` and set `DATABASE_URL` to your Postgres connection string.

```bash
npm run db:migrate
npm run db:seed
```

### 3. Run the dev server (requires PostgreSQL)

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 4. Test accounts (after seeding)

| Email | Password | Cohort |
|-------|----------|--------|
| explorer@test.com | password123 | Explorer |
| planner@test.com | password123 | Planner |
| foodie@test.com | password123 | Foodie |
| value@test.com | password123 | Value-Seeker |
| minimal@test.com | password123 | Minimalist |

Or sign up a new account and complete the personality quiz.

## Deployment (Railway + GitHub)

The app is configured for **Railway** with PostgreSQL. See **[DEPLOY-RAILWAY.md](./DEPLOY-RAILWAY.md)** for step-by-step deployment instructions.

**Quick summary:**
1. Push code to GitHub
2. Create Railway project → Deploy from GitHub
3. Add PostgreSQL database (Railway injects `DATABASE_URL`)
4. Set `NEXTAUTH_SECRET` and `NEXTAUTH_URL` in Railway Variables
5. Deploy (migrations run automatically during build)
6. Run `railway run npx prisma db seed` once after first deploy

## Project Structure

```
personality-reviews/
├── prisma/
│   ├── schema.prisma    # DB schema
│   └── seed.ts          # 10 restaurants, 5 users, 20 reviews
├── src/
│   ├── app/
│   │   ├── (app)/       # Protected app routes (restaurants, profile)
│   │   ├── api/         # Route handlers (auth, quiz, restaurants, profile)
│   │   ├── login/
│   │   ├── signup/
│   │   ├── onboarding/
│   │   └── page.tsx     # Landing
│   ├── components/
│   ├── lib/             # auth, prisma, validations, cohorts, match-score
│   ├── middleware.ts    # Auth protection
│   └── types/
└── package.json
```

## What's Next (5 logical next features)

1. **Follow reviewers** — Let users follow reviewers in their cohort for a personalized feed
2. **Personalized feed** — Home page showing reviews from followed users and high-match restaurants
3. **More categories** — Travel destinations, activities, products (extend Restaurant → Place with type)
4. **Improved personality model** — Use a validated instrument (e.g. Big Five) or ML-based cohort assignment
5. **Abuse moderation** — Report reviews, admin dashboard, automated content filters
