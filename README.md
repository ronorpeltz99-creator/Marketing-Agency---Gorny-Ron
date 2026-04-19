# AI Dropshipping Operations Platform

An AI-powered dashboard to run dropshipping operations end-to-end: create Shopify stores, import AliExpress products, generate ad creatives with AI, launch to Meta, monitor with KPI-based kill/scale agents, and auto-fulfill orders.

**Built by Ron + Yuval** — v1 is internal-use only (we run our own stores through it). Clients plug in later.

---

## What This Project Actually Is

This is a **Next.js web application**. In plain English: it's a website with a dashboard. You log in, you see a control panel, you click buttons, AI agents do work in the background, data shows up.

It's not a template. It's not on Shopify. It's a **custom app we build from scratch**, hosted on the internet, with its own database and its own AI brain.

> [!IMPORTANT]
> **Read `CLAUDE.md` before doing anything else** — that's the constitution of the project and explains the architecture (WAT framework: Workflows, Agents, Tools).

---

## The Stack in One Sentence Each

| Technology | What It Does |
|---|---|
| **Next.js 15** | The framework that runs the website (both the pages you see and the backend that does work) |
| **TypeScript** | The programming language we write in (like JavaScript but with safety rails) |
| **Supabase** | Our database + user login system, all in one |
| **Vercel** | Where the website lives on the internet (we push code, Vercel puts it online) |
| **Trigger.dev** | A scheduler; runs our AI agents every 30 minutes even when we're asleep |
| **Anthropic API (Claude)** | The AI brain that powers our six agents |
| **Shopify, Meta, DSers, Fal.ai, Higgsfield** | The services our agents talk to |

---

## First-Time Setup (Getting This Running On Your Computer)

If this is your first time, follow these steps in order. **Don't skip.** Each step builds on the last.

### 1. Install the basics

You need three programs on your computer:

- **Node.js** (version 20 or newer) — downloadable from [nodejs.org](https://nodejs.org). This is what runs our code.
- **Git** — downloadable from [git-scm.com](https://git-scm.com). This is how we track changes and share code between us.
- **VS Code** — downloadable from [code.visualstudio.com](https://code.visualstudio.com). This is the editor where we write/read code.

After installing, open a terminal (on Mac: press `Cmd + Space`, type "Terminal") and verify each is installed:

```bash
node --version    # should show v20.x.x or higher
git --version     # should show any version
```

### 2. Clone the project onto your computer

In your terminal, navigate to where you want the project folder to live (Desktop is fine), then download it:

```bash
cd ~/Desktop
git clone https://github.com/YOUR-USERNAME/dropship-platform.git
cd dropship-platform
```

You now have the project folder on your computer. Open it in VS Code:

```bash
code .
```

### 3. Install the project's dependencies

Every project uses a bunch of tools and libraries (like grabbing ingredients from the grocery store). To install them all at once, run this inside your project folder:

```bash
npm install
```

This creates a `node_modules/` folder full of stuff. That folder is huge (ignore it — it's gitignored). It takes 1–3 minutes the first time.

### 4. Set up your secrets file

The project needs API keys to talk to Shopify, Meta, Supabase, etc. These are **secrets** — never share them, never commit them to Git.

1. Copy the template:

   ```bash
   cp .env.example .env.local
   ```

2. Open `.env.local` in VS Code.
3. Fill in every key by following `docs/platform-accounts.md` — it walks you through creating each account and where to find each key.

> [!NOTE]
> If a key is missing, parts of the app will break. That's normal during setup. You fill them in as you go.

### 5. Set up the database

We use Supabase for our database. To set it up:

1. Create a Supabase account at [supabase.com](https://supabase.com) (free tier is fine for dev).
2. Create a new project. Copy the **project URL** and **anon key** into `.env.local`.
3. In the Supabase dashboard, go to **SQL Editor**, paste the contents of `supabase/schema.sql`, and click **Run**. This creates all our tables with the right security rules.

Done. Your database is ready.

### 6. Run the app

Back in your terminal, inside the project folder:

```bash
npm run dev
```

You should see something like `Ready on http://localhost:3000`. Open that URL in Chrome. You should see the app running.

> [!TIP]
> If it crashes: read the error in the terminal. Usually it's a missing key in `.env.local` or a missing database table.

---

## The Daily Workflow

Once setup is done, this is what working on the project looks like day-to-day.

### Starting a work session

1. Open VS Code, open the project folder.
2. Open a terminal inside VS Code (`Terminal → New Terminal`).
3. Pull the latest changes (in case your partner pushed something):

   ```bash
   git pull
   ```

4. Start the dev server:

   ```bash
   npm run dev
   ```

5. Open Chrome to `http://localhost:3000`.
6. Open Claude Code (either as VS Code extension or in a separate terminal).

Now you're ready to work.

### Making changes

You don't write code yourself — you tell Claude Code what to change. Claude edits files, your browser refreshes, you test, you iterate.

**Example session:**

> *"Claude, on the dashboard, add a button that says 'Import Product'. When clicked, open a modal with a text input for an AliExpress URL."*

Claude shows you the files it's about to edit, you approve, Claude edits, browser refreshes, button appears. You test. You adjust.

### Saving your work

When you've made meaningful progress (a feature works, a bug is fixed), save it to Git:

```bash
git add .
git commit -m "Added product import modal"
git push
```

Now your partner can pull your changes. If you both edit the same file at the same time, Git will warn you — don't panic, ask Claude Code to help resolve the conflict.

---

## Project Structure (Where Things Live)

```
.
├── CLAUDE.md                # READ THIS FIRST — project constitution
├── README.md                # You are here
├── .env.local               # Your secrets (never commit)
├── .env.example             # Template for secrets
│
├── app/                     # The website pages
│   ├── (marketing)/         # Public site (landing page)
│   ├── (dashboard)/         # Logged-in dashboard
│   ├── api/                 # Backend routes (webhooks)
│   └── actions/             # Server actions (button click handlers)
│
├── agents/                  # The six AI workers
│   ├── product-import/
│   ├── copywriter/
│   ├── creative-gen/
│   ├── meta-launcher/
│   ├── meta-monitor/
│   └── fulfillment/
│
├── workflows/               # SOPs agents follow (plain-English instructions)
├── tools/                   # Small TypeScript functions agents use
├── jobs/                    # Scheduled background tasks (Trigger.dev)
├── lib/                     # Shared code (database client, API clients)
├── components/              # UI building blocks (buttons, forms, cards)
├── supabase/                # Database schema + migrations
└── docs/                    # Everything else (checklists, decisions, learnings)
```

> Full explanation of every folder lives in `CLAUDE.md`.

---

## Common Commands

Run these inside the project folder, in your terminal.

| What you want | Command |
|---|---|
| Start the dev server | `npm run dev` |
| Stop the dev server | `Ctrl + C` in the terminal |
| Install a new package | `npm install <package-name>` |
| Check for code errors | `npm run lint` |
| Build for production | `npm run build` |
| Pull partner's changes | `git pull` |
| Save your changes | `git add . && git commit -m "message" && git push` |
| See what's changed | `git status` |

---

## If Something Breaks

In order of what to try:

1. **Read the error message.** 80% of the time it tells you exactly what's wrong (missing key, wrong file path, typo).
2. **Restart the dev server.** `Ctrl + C`, then `npm run dev` again.
3. **Reinstall dependencies.** Delete `node_modules/` and `package-lock.json`, then `npm install` again.
4. **Ask Claude Code.** Paste the full error, explain what you were doing, let Claude diagnose.
5. **Ask your partner.** Two heads, one screen share.
6. **Check `docs/learnings.md`.** We log recurring issues and fixes there.

---

## What You're NOT Allowed to Do

> [!CAUTION]
> These rules are non-negotiable. Breaking them can expose secrets, corrupt data, or cause real financial damage.

- **Never commit `.env.local` to Git.** It has our secrets. Git is configured to ignore it, but double-check before pushing.
- **Never edit the production database directly.** Always use a migration file in `supabase/migrations/`.
- **Never let agents take destructive actions without human approval.** Kills, scales, going-live — all require a click.
- **Never skip `CLAUDE.md`.** Especially not when starting a new Claude Code session. It's the project's memory.

---

## Useful Links

| Resource | URL |
|---|---|
| Next.js docs | [nextjs.org/docs](https://nextjs.org/docs) |
| Supabase docs | [supabase.com/docs](https://supabase.com/docs) |
| Anthropic API docs | [docs.anthropic.com](https://docs.anthropic.com) |
| Shopify API docs | [shopify.dev](https://shopify.dev) |
| Meta Marketing API docs | [developers.facebook.com/docs/marketing-apis](https://developers.facebook.com/docs/marketing-apis) |
| Fal.ai docs | [fal.ai/docs](https://fal.ai/docs) |
| Trigger.dev docs | [trigger.dev/docs](https://trigger.dev/docs) |
| DSers API docs | [dsers.com](https://dsers.com) |

---

## Contact

- **Ron** — [your contact]
- **Yuval** — [partner contact]

---

> **When in doubt:** read `CLAUDE.md`, check `docs/`, then ask.
