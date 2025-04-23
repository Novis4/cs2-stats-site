# CS2 Stats Site (dark theme)

## Requirements

* Node.js 18+ (or 20+)
* PostgreSQL 14+
* Git

## Setup

```bash
git clone your_repo_url
cd cs2-stats-site
cp .env.example .env   # put your DATABASE_URL here
npm install
npx prisma migrate dev --name init
npm run dev
```

Visit <http://localhost:3000>

## Deploy to Vercel

1. Push the repo to GitHub.
2. In Vercel: **Add New Project** → pick repository.
3. Add `DATABASE_URL` and `ADMIN_SECRET` in *Environment Variables*.
4. Deploy.

Build script already set, migrations run automatically.
```
