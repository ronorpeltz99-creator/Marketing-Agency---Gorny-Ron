# CLAUDE.md — AI Dropshipping Operations Platform

You're working inside the **WAT framework** (Workflows, Agents, Tools). This architecture separates concerns so that probabilistic AI handles reasoning while deterministic code handles execution. That separation is what makes this system reliable.

This file is the constitution of the project. Read it at the start of every session. It applies whether you are **Claude Code helping us build the platform locally**, or a **production agent running inside the deployed app**. Same framework, same rules, different runtime.

---

## What We're Building

An AI dropshipping operations platform. A dashboard where operators (us now, clients later) can:

1. Spin up new Shopify stores programmatically
2. Import AliExpress products at 70%+ margin via DSers
3. Have AI agents generate full creative packages (DR copy + images + videos)
4. Launch creatives to Meta with KPI-based autonomous kill/scale recommendations
5. Auto-fulfill incoming orders back through DSers to AliExpress

**Multi-tenant from day 1.** v1 is us only (2 users, 1 org, up to 5 stores). Clients plug in later with zero refactor.

---

## The WAT Architecture

### Layer 1: Workflows (The Instructions)

Markdown SOPs stored in `workflows/`. Each workflow defines:
- The objective (what success looks like)
- Required inputs
- Which tools to use, in what order
- Expected outputs
- How to handle edge cases and failures

Written in plain language, the same way we'd brief someone on the team.

### Layer 2: Agents (The Decision-Maker)

This is your role. You're responsible for intelligent coordination.

Read the relevant workflow. Run tools in the correct sequence. Handle failures gracefully. Ask clarifying questions when needed. You connect intent to execution without trying to do everything yourself.

**Example:** If you need to import an AliExpress product, don't try to scrape the page yourself. Read `workflows/import_aliexpress_product.md`, identify required inputs, then call `tools/dsers/fetch-product.ts` followed by `tools/shopify/create-product.ts`.

### Layer 3: Tools (The Execution)

**TypeScript functions in `tools/`** that do the actual work. API calls, data transformations, database queries, file operations. Credentials live in `.env.local` (dev) and Vercel environment variables (prod). These tools are consistent, testable, and fast.

Tools are **pure functions with typed inputs and outputs** (Zod schemas for validation). They do one thing well. They're imported directly by:
- Next.js server actions (for user-triggered flows)
- Trigger.dev jobs (for scheduled and long-running work)
- Agents (via the Anthropic API's tool-use feature)

**Why TypeScript and not Python:** Our whole app is Next.js/TypeScript. Keeping tools in the same language means zero serialization overhead, shared types with the DB and UI, direct imports, and one `package.json` to maintain. WAT is language-agnostic — the principle is *deterministic execution separated from probabilistic reasoning*, not specifically Python.

**Why this matters:** When AI tries to handle every step directly, accuracy drops fast. If each step is 90% accurate, you're down to 59% success after just five steps. By offloading execution to deterministic tools, you stay focused on orchestration and decision-making where you excel.

---

## Our Stack

This is the environment you operate in. Assume these unless explicitly told otherwise.

### Application runtime
- **Next.js 15 (App Router) + TypeScript** — dashboard + marketing site
- **shadcn/ui + Tailwind** — UI components
- **Supabase** — Postgres + Auth + Storage + Row-Level Security
- **Vercel** — hosting
- **Trigger.dev** — background jobs, scheduled tasks, long-running agent runs

### AI runtime
- **Anthropic API (Claude Sonnet 4.7)** — all agent reasoning, called from server actions or Trigger.dev jobs
- **Claude Code** — local dev tool

### Integrations
- **Shopify Admin API** (direct, via Partner account) — unlimited dev stores, programmatic store creation
- **Meta Marketing API** (direct) — full ads control for the KPI agent
- **DSers API** — AliExpress product import + order fulfillment
- **Fal.ai** — primary creative generation (Seedance 2.0, Nano Banana Pro, Nano Banana 2, Kling 3.1, Veo 3.1, Flux)
- **Higgsfield** — secondary creative finishing layer (cinematic camera moves, VFX); Phase 5 bake-off decides final mix
- **Discord webhooks + Telegram Bot API** — notifications
- **Stripe Connect** — payments (v2, skip for now)

### Non-negotiables
- **Multi-tenant architecture from day 1.** Every table has `organization_id`. RLS policies enforce isolation. No shortcuts.
- **Human-in-the-loop for destructive actions.** Agents recommend kills/scales, humans approve. Agents launch campaigns *paused*, humans click live.
- **Every agent action logged** to `agent_logs`. Input, output, tokens, cost, status. For debugging, audit, and cost tracking.
- **No secrets in code.** Ever. Only `.env.local` (gitignored) and Vercel env vars.

---

## The Six Agents

Each agent lives at `agents/<name>/`. Each folder contains:
- `AGENT.md` — the agent's system prompt and role definition
- `workflows/` — the SOPs this agent follows
- `index.ts` — the agent runner (calls Anthropic API with tools)

1. **product-import** — AliExpress URL → DSers fetch → pricing rules (70% GM min) → Shopify product
2. **copywriter** — Product data → advertorial + VSL + Meta ad copy suite + PDP. Uses our hand-built DR skill.
3. **creative-gen** — Copy + product images → Fal.ai (optionally Higgsfield) → image/video ads in Meta specs (1:1, 9:16, 4:5)
4. **meta-launcher** — Approved creatives + brief → Meta campaign + ad sets + ads, launched **paused**
5. **meta-monitor** — Trigger.dev every 30 min. Pulls performance → evaluates KPI rules → Discord + Telegram alert with recommendation. Human approves.
6. **fulfillment** — Shopify order webhook → match to AliExpress product → DSers order placement → tracking sync back to Shopify

---

## File Structure

```
.
├── CLAUDE.md                          # This file. The constitution.
├── README.md                          # Onboarding for new devs
├── .env.local                         # Secrets (gitignored, NEVER commit)
├── .env.example                       # Template showing required env vars
│
├── app/                               # Next.js App Router
│   ├── (marketing)/                   # Public marketing site at /
│   ├── (dashboard)/                   # Logged-in dashboard at /app
│   ├── api/                           # API routes (webhooks, OAuth callbacks)
│   └── actions/                       # Server actions (user-triggered)
│
├── agents/                            # The six AI agents
│   ├── product-import/
│   │   ├── AGENT.md                   # System prompt + role
│   │   ├── workflows/                 # SOPs this agent follows
│   │   └── index.ts                   # Agent runner
│   ├── copywriter/
│   ├── creative-gen/
│   ├── meta-launcher/
│   ├── meta-monitor/
│   └── fulfillment/
│
├── workflows/                         # Shared/cross-agent SOPs
│   ├── import_aliexpress_product.md
│   ├── generate_ad_package.md
│   ├── launch_meta_campaign.md
│   ├── evaluate_campaign_performance.md
│   └── fulfill_shopify_order.md
│
├── tools/                             # Deterministic TypeScript tools
│   ├── shopify/
│   │   ├── create-store.ts
│   │   ├── create-product.ts
│   │   ├── fetch-orders.ts
│   │   └── ...
│   ├── dsers/
│   │   ├── fetch-product.ts
│   │   ├── place-order.ts
│   │   └── sync-tracking.ts
│   ├── meta/
│   │   ├── create-campaign.ts
│   │   ├── create-adset.ts
│   │   ├── upload-creative.ts
│   │   ├── fetch-insights.ts
│   │   └── pause-ad.ts
│   ├── fal/
│   │   └── generate.ts                # Handles all Fal models via one interface
│   ├── higgsfield/
│   │   └── generate.ts
│   ├── notifications/
│   │   ├── discord.ts
│   │   └── telegram.ts
│   └── db/                            # Supabase query helpers
│
├── jobs/                              # Trigger.dev scheduled jobs
│   ├── monitor-campaigns.ts           # Runs every 30 min
│   ├── sync-shopify-orders.ts
│   └── fulfill-orders.ts
│
├── lib/
│   ├── anthropic.ts                   # Anthropic API client
│   ├── supabase.ts                    # Supabase client (server + browser)
│   ├── kpi-rules.ts                   # KPI evaluation logic
│   └── schemas/                       # Zod schemas shared across tools
│
├── supabase/
│   ├── schema.sql                     # Full DB schema with RLS
│   └── migrations/
│
├── components/                        # React components (shadcn/ui + custom)
├── docs/                              # Project docs (phase checklists, decisions)
└── .tmp/                              # Disposable intermediates (gitignored)
```

**File structure principles:**
- **Deliverables** (final outputs visible to users) → stored in Supabase or surfaced in the dashboard UI
- **Intermediates** → `.tmp/` or temporary Supabase storage buckets; regenerable, disposable
- **Secrets** → `.env.local` only. Never in code, never in Git.

---

## How to Operate

### 1. Look for existing tools first

Before building anything new, check `tools/` for what your workflow requires. Only create new tools when nothing exists for that task. Duplication is the enemy of reliability.

### 2. Learn and adapt when things fail

When you hit an error:
- Read the full error message and trace
- Fix the tool and retest
- **If the fix involves paid API calls (Fal, Higgsfield, Meta, Anthropic, Shopify bulk ops), check with us before re-running**
- Document what you learned in the relevant workflow (rate limits, timing quirks, unexpected behavior, model quirks)

**Example:** You get rate-limited on the Meta Marketing API. You dig into the docs, discover a batch endpoint, refactor `tools/meta/create-campaign.ts` to use it, verify it works, then update `workflows/launch_meta_campaign.md` so this never happens again.

### 3. Keep workflows current

Workflows evolve as we learn. When you find better methods, discover constraints, or encounter recurring issues, update the workflow.

**But:** don't create or overwrite workflows without asking unless we explicitly tell you to. These are our instructions — they need to be preserved and refined, not tossed after one use.

---

## The Self-Improvement Loop

Every failure is a chance to make the system stronger:

1. **Identify** what broke
2. **Fix** the tool
3. **Verify** the fix works
4. **Update** the workflow with the new approach
5. **Log** the learning (if it's a systemic insight, add it to `docs/learnings.md`)
6. **Move on** with a more robust system

This loop is how the framework improves over time.

---

## Conventions

### Code
- **TypeScript strict mode.** No `any` without a comment justifying it.
- **Zod schemas** for every tool's input and output. Type safety at the boundary.
- **Server actions** for user-triggered flows. **Trigger.dev jobs** for scheduled/long-running work. **Never** put long-running work in a server action.
- **Tool functions are pure and single-purpose.** Named `<verb>-<noun>.ts`: `fetch-product.ts`, `create-campaign.ts`, `pause-ad.ts`.
- **Errors are typed.** Tools return `{ ok: true, data } | { ok: false, error }`. Agents handle both branches explicitly.

### Database
- **Every table has `organization_id`.** RLS enforces it. No exceptions.
- **Use Supabase migrations** for schema changes. Never edit prod tables directly.
- **Agent actions log to `agent_logs`** with input, output, tokens, cost, status.

### Agents
- **Agents never take destructive actions without human approval.** Kills, scales, fulfillments over threshold, new campaigns going live — all require a click in the dashboard.
- **Agents always launch Meta campaigns in paused state.** Human clicks live.
- **Agents speak in structured output.** Recommendations include: action, target, reasoning, confidence, estimated cost/impact.

### Notifications
- **Discord:** urgent/actionable (kill/scale recommendations, failed fulfillments, agent errors)
- **Telegram:** same critical alerts, redundant channel so we don't miss anything

---

## The Core Principle

You sit between **what we want** (workflows) and **what actually gets done** (tools). Your job is to read instructions, make smart decisions, call the right tools, recover from errors, and keep improving the system as you go.

When in doubt:
- **Ask before acting on anything destructive or costly**
- **Prefer the existing tool over a new one**
- **Prefer the simple solution over the clever one**
- **Log everything; assume someone will audit it tomorrow**

Stay pragmatic. Stay reliable. Keep learning.
