# Inkfluence

A full-stack MERN publishing platform for curious writers and their readers. Inkfluence pairs a calm, editorial reading experience with a complete writing dashboard and **Muse**, a free-AI reading assistant that recommends real stories from the library.

Built with **MongoDB, Express, React, Node.js, Vite, and Tailwind CSS**.

---

## Highlights

- **Accounts & sessions** — register, sign in, sign out, profile editing, httpOnly JWT cookie, bcrypt password hashing.
- **Stories** — create, edit, save as draft, publish, unpublish, and delete. Markdown editor with a live preview and generative SVG cover art.
- **Discovery** — full-text search, category and tag filters, sorting, pagination, trending topics, and featured stories.
- **Reading experience** — rendered Markdown, table of contents, reading progress, related stories, likes, bookmarks, and comments.
- **Social layer** — writer profiles, follow/unfollow, follower counts, and reading lists.
- **Writing dashboard** — lifetime stats, top stories, draft management, profile editing, and delete confirmation.
- **Muse (AI)** — understands a mood or topic, then ranks and returns real published Inkfluence stories. Works with free AI keys or with zero keys at all.
- **Production-ready basics** — Zod validation, Helmet, CORS allow-list, rate limiting, compression, graceful shutdown, and optional static serving of the built client.

The interface uses lime `#B9FF66`, ink `#191A23`, warm off-white surfaces, rounded cards, playful doodles, and Space Grotesk typography. All layouts are responsive from small phones up.

---

## Tech stack

| Layer | Tools |
| --- | --- |
| Frontend | React 18, Vite 6, React Router 6, Tailwind CSS 3, Axios, Lucide, Sonner |
| Backend | Node.js, Express 4, Mongoose 8, JWT, bcryptjs, Zod |
| Database | MongoDB (local, Atlas, or zero-config in-memory for development) |
| AI | Gemini free tier → Groq free tier → Pollinations (keyless) → local matching |
| Tooling | npm workspaces via root scripts, concurrently, nodemon |

---

## Quick start

### Requirements

- Node.js **18+** (20 or newer recommended)
- npm 9+
- MongoDB is **optional** for local development

### 1. Install

```bash
npm run install:all
```

This installs the root, server, and client dependencies.

### 2. Configure

```bash
cp server/.env.example server/.env
```

Open `server/.env` and set a real `JWT_SECRET`. Everything else can stay empty for a zero-config development run:

```env
JWT_SECRET=replace-with-a-long-random-string
```

If `MONGODB_URI` is empty, the server first tries a local MongoDB at `127.0.0.1:27017`, then automatically starts an **in-memory MongoDB** so the app runs with no database setup. Data in that mode resets whenever the server restarts.

### 3. Run

```bash
npm run dev
```

- App: <http://localhost:5173>
- API: <http://localhost:5000>
- Health check: <http://localhost:5000/api/health>

On the first run, the in-memory MongoDB binary is downloaded once (roughly 80 MB). Demo content is seeded automatically.

### Demo account

```text
Email:    demo@inkfluence.app
Password: demo1234
```

The demo writer has published stories, drafts, comments, follows, and bookmarks. You can also register a fresh account.

---

## Environment variables

All variables live in `server/.env` (see `server/.env.example`). Never commit the real file.

| Variable | Default | Purpose |
| --- | --- | --- |
| `NODE_ENV` | `development` | Set to `production` when deploying. |
| `PORT` | `5000` | API port. |
| `CLIENT_URL` | `http://localhost:5173` | Allowed CORS origin(s), comma-separated. |
| `MONGODB_URI` | empty | MongoDB connection string. Empty enables the local/in-memory fallback. |
| `JWT_SECRET` | dev placeholder | **Required in production.** Use a long random string. |
| `JWT_EXPIRES_IN` | `7d` | Session lifetime. |
| `GEMINI_API_KEY` | empty | Free Google AI Studio key. |
| `GEMINI_MODEL` | `gemini-3.1-flash-lite` | Gemini model name. |
| `GROQ_API_KEY` | empty | Free Groq key. |
| `GROQ_MODEL` | `qwen/qwen3.8-27b` | Groq model name. |
| `POLLINATIONS_ENABLED` | `true` | Keyless free AI endpoint. |
| `POLLINATIONS_MODEL` | `openai` | Pollinations model alias. |
| `AUTO_SEED` | `true` | Seed demo content only when the database is completely empty. |

For a completely free setup, **no AI key is required**. Muse still works using the local concept-matching engine.

---

## How Muse works

Muse never invents story links. It asks an AI provider for search intent (keywords, tags, categories), then scores and returns actual published stories from MongoDB.

Provider order:

1. **Gemini free tier** — if `GEMINI_API_KEY` is set.
2. **Groq free tier** — if `GROQ_API_KEY` is set.
3. **Pollinations** — keyless, enabled by default. Anonymous usage is rate-limited.
4. **Local matcher** — keyword, tag, category, and concept scoring. Always available.

Each provider has a short timeout and a cooldown after failure, so one overloaded service does not make every chat message slow. If every provider is unavailable, the reply falls back to the local matcher and the UI labels it “matched from the library.”

Free key sources:

- Google AI Studio: <https://aistudio.google.com/app/apikey>
- Groq Console: <https://console.groq.com/keys>

If a model name is retired, check the provider’s model list and update `GEMINI_MODEL` / `GROQ_MODEL`. The chain and local fallback will keep the feature working while you do.

---

## Project structure

```text
Project_1/
├── client/
│   ├── src/
│   │   ├── components/       # layout, home sections, blog UI, chat, shared UI
│   │   ├── context/          # auth provider
│   │   ├── lib/              # api client, markdown helpers, utilities
│   │   ├── pages/            # Home, Explore, BlogDetail, Write, Dashboard, ...
│   │   ├── App.jsx           # lazy-loaded routes
│   │   └── index.css         # Tailwind layers and design system
│   ├── tailwind.config.js
│   └── vite.config.js        # dev proxy /api → localhost:5000
├── server/
│   ├── src/
│   │   ├── config/           # env and database connection
│   │   ├── controllers/      # auth, blogs, comments, users, AI, newsletter
│   │   ├── middleware/       # auth, validation, errors
│   │   ├── models/           # User, Blog, Comment, Newsletter
│   │   ├── routes/           # REST endpoints
│   │   ├── seed/             # demo writers, stories, comments, follows
│   │   ├── services/         # AI provider chain and ranking
│   │   ├── validators/       # Zod schemas
│   │   ├── app.js
│   │   └── main.js
│   └── .env.example
├── package.json              # root scripts
└── README.md
```

### Data model

- `User` — name, username, email, password hash, bio, avatar, socials, bookmarks, following/followers.
- `Blog` — title, unique slug, excerpt, Markdown content, category, tags, cover theme/image, status, author, read time, views, likes, comment count, publish date.
- `Comment` — blog, author, content, timestamps.
- `Newsletter` — unique email, source, subscription time.

---

## API overview

Base URL: `http://localhost:5000/api`

### Auth

| Method | Endpoint | Notes |
| --- | --- | --- |
| `POST` | `/auth/register` | `{ name, username, email, password }` |
| `POST` | `/auth/login` | Sets the httpOnly `inkfluence_token` cookie. |
| `POST` | `/auth/logout` | Clears the cookie. |
| `GET` | `/auth/session` | Current user or `null` for guests. |
| `GET` | `/auth/me` | Protected profile. |
| `PATCH` | `/auth/me` | Update name, bio, avatar, socials. |

### Stories

| Method | Endpoint | Notes |
| --- | --- | --- |
| `GET` | `/blogs` | `search`, `category`, `tag`, `sort`, `page`, `limit`, `featured`. |
| `GET` | `/blogs/tags` | Trending tags and category counts. |
| `GET` | `/blogs/stats` | Platform-wide counts. |
| `GET` | `/blogs/mine` | Current author's stories. Protected. |
| `GET` | `/blogs/dashboard` | Author stats and story list. Protected. |
| `GET` | `/blogs/bookmarks` | Reading list. Protected. |
| `POST` | `/blogs` | Create a draft or published story. Protected. |
| `GET` | `/blogs/:slug` | Public story detail with related stories. |
| `PATCH` | `/blogs/:id` | Edit or change status. Author only. |
| `DELETE` | `/blogs/:id` | Delete a story. Author only. |
| `POST` | `/blogs/:id/like` | Toggle like. Protected. |
| `POST` | `/blogs/:id/bookmark` | Toggle bookmark. Protected. |

### Comments, writers, AI, newsletter

| Method | Endpoint | Notes |
| --- | --- | --- |
| `GET` | `/comments/blog/:blogId` | List comments. |
| `POST` | `/comments/blog/:blogId` | Add a comment. Protected. |
| `DELETE` | `/comments/:id` | Comment author or story author. |
| `GET` | `/users` | Featured writers. |
| `GET` | `/users/:username` | Public profile and stories. |
| `POST` | `/users/:id/follow` | Toggle follow. Protected. |
| `DELETE` | `/users/:id/follow` | Unfollow. Protected. |
| `GET` | `/ai/status` | Configured provider chain. |
| `POST` | `/ai/recommend` | `{ message }` → reply, intent, and real stories. |
| `POST` | `/newsletter` | `{ email }`. |
| `GET` | `/health` | Service and preferred AI provider. |

Errors use a consistent shape:

```json
{
  "success": false,
  "message": "A human-readable explanation",
  "details": [{ "field": "email", "message": "Enter a valid email" }]
}
```

---

## Scripts

Run these from the repository root.

| Command | What it does |
| --- | --- |
| `npm run install:all` | Install root, server, and client dependencies. |
| `npm run dev` | Run API and Vite together. |
| `npm run dev:server` | API only (nodemon). |
| `npm run dev:client` | Vite only. |
| `npm run build` | Build the production client into `client/dist`. |
| `npm start` | Start the API in production mode. |
| `npm run seed` | Reset and reseed demo content. **Deletes existing data.** |

To seed manually:

```bash
npm run seed
```

The seed script wipes users, stories, comments, and newsletter entries before recreating demo data. Auto-seed is safer: it only runs when the database has no users **and** no stories.

---

## Production build

```bash
npm run install:all
npm run build

NODE_ENV=production \
JWT_SECRET="a-long-random-secret" \
MONGODB_URI="mongodb+srv://user:pass@cluster.mongodb.net/inkfluence" \
CLIENT_URL="https://your-domain.example" \
npm start
```

When `NODE_ENV=production` and `client/dist` exists, Express serves the built React app and falls back to `index.html` for client-side routes. The API stays under `/api`.

Notes:

- Use MongoDB Atlas or another persistent MongoDB. The in-memory database is development-only.
- Production cookies are `secure` and `SameSite=None`, so serve the app over **HTTPS**.
- Add `GEMINI_API_KEY` and/or `GROQ_API_KEY` as server-side secrets. Do not put keys in `VITE_*` variables or commit them.
- Set `CLIENT_URL` to the exact deployed origin if the frontend and API are on different domains. Multiple origins can be comma-separated.

---

## Deploy to Vercel

Inkfluence deploys as **two Vercel projects from the same repository**: a static client and an Express API. The client proxies `/api/*` to the API project, so the browser only ever talks to one origin and the auth cookie stays first-party (important for Safari).

### 1. Create a MongoDB Atlas database

1. Create a free **M0** cluster at <https://cloud.mongodb.com>.
2. Add a database user, then allow network access from `0.0.0.0/0` (Vercel Functions use dynamic IPs).
3. Copy the connection string and add the database name, e.g.
   `mongodb+srv://user:pass@cluster.mongodb.net/inkfluence`.

Vercel's filesystem is ephemeral, so Atlas (or another hosted MongoDB) is required. The in-memory database only works locally.

### 2. Deploy the API project

1. In Vercel, choose **Add New → Project** and import this repository.
2. Set **Root Directory** to `server`.
3. Vercel detects Express automatically. Leave the build and output settings empty/default.
4. Add these **Environment Variables** (Production and Preview):

| Variable | Value |
| --- | --- |
| `MONGODB_URI` | Your Atlas connection string |
| `JWT_SECRET` | Output of `openssl rand -hex 32` |
| `CLIENT_URL` | Your frontend URL, e.g. `https://inkfluence.vercel.app` |
| `AUTO_SEED` | `false` |
| `MONGOMS_DISABLE_POSTINSTALL` | `1` (skips the dev-only in-memory MongoDB download) |
| `GEMINI_API_KEY` | Optional — free key |
| `GROQ_API_KEY` | Optional — free key |

`NODE_ENV=production` is set by Vercel. Do **not** run `npm run seed` against this database; it wipes existing data.

5. Deploy, then copy the production domain (for example `https://inkfluence-api.vercel.app`).
6. Confirm `https://YOUR-API-DOMAIN/api/health` returns `success: true`.

### 3. Point the client at the API

If your API domain is not `inkfluence-api.vercel.app`, update both `destination` values in [`client/vercel.json`](client/vercel.json) and commit the change.

This rewrite is what keeps `/api` same-origin. The client code already uses a relative `/api` base URL, so no `VITE_API_URL` is needed.

### 4. Deploy the client project

1. **Add New → Project** and import the same repository again.
2. Set **Root Directory** to `client`.
3. Framework preset: **Vite**; build `npm run build`; output `dist`.
4. No environment variables are required.
5. Deploy, then copy the production domain.
6. In the API project, make sure `CLIENT_URL` matches that exact domain (including `https://`), and redeploy the API if you changed it.

### 5. Verify

- `https://YOUR-CLIENT-DOMAIN/api/health` → healthy
- Register a new account, refresh the page, and confirm you stay signed in
- Publish a story and add a comment
- Open Muse and send a message

### Vercel notes

- Each project deploys from the same repo; use **Root Directory** to keep them separate.
- The Express app runs as a single Vercel Function. The first request after idle may take a second or two while it connects to Atlas.
- Cold starts create a new function instance, so Muse's in-memory provider cooldowns reset occasionally; the fallback chain still works.
- If you use Vercel **preview deployments**, add the preview origin to `CLIENT_URL` (comma-separated) or test against the production domain.
- Vercel's external rewrite respects upstream caching by default on new projects; `client/vercel.json` disables that for `/api` so authenticated responses are never cached.
- Free-tier limits are plenty for a portfolio deployment. Check the function duration in **Project → Logs** if a Muse request ever times out.

---

## Design notes

- **Type** — Space Grotesk for display text, Inter for body copy, a mono face for metadata.
- **Color** — lime `#B9FF66` as the accent, ink `#191A23` for type and dark panels, `#F3F3F3` / cream surfaces.
- **Illustration** — covers are generated as deterministic SVG compositions with six themes (`lime`, `ink`, `paper`, `orbit`, `bloom`, `grid`). No stock photos required.
- **Motion** — subtle lift, rotation, and fade-up transitions. Reduced-motion preferences are respected in global CSS.
- **Accessibility** — semantic landmarks, labelled forms, visible focus rings, keyboard-friendly dialogs, `aria-live` chat log, and skip link.

---

## Troubleshooting

**Port already in use**

```bash
# Free ports 5000 / 5173, or change PORT in server/.env
lsof -i :5000
```

**First run seems slow**

The in-memory MongoDB binary downloads once. Later starts reuse the cache.

**“No space left on device” after many restarts**

Killed dev servers can leave temporary MongoDB data folders. They are safe to remove when no server is running:

```bash
rm -rf /tmp/mongo-mem-*
```

**Muse is slow or replies locally**

A provider may be overloaded or rate-limited. Check `GET /api/ai/status`, the server logs, and the `source` field in the response. The chain automatically cools down failing providers and falls back to Groq, Pollinations, then local matching. Verify the configured model still exists if a provider is consistently unavailable.

**Cookies do not persist**

In development, use the Vite origin (`http://localhost:5173`) so the `/api` proxy keeps requests same-origin. In production, use HTTPS and set `CLIENT_URL` correctly.

**Login works but data resets**

You are on the in-memory database. Set `MONGODB_URI` to a local MongoDB or Atlas cluster to persist data.

---

## License

This project was built as a full-stack portfolio application. Use it, learn from it, and make it yours.
