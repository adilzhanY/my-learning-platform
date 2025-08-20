<div align="center">

# Converso

Real‑time AI Teaching Companions – a learning platform prototype built as a course project to explore modern full‑stack patterns, realtime voice AI, and production observability.

![Tech](https://img.shields.io/badge/Next.js-15-black?logo=next.js) ![React](https://img.shields.io/badge/React-19-149eca?logo=react) ![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript) ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-38b2ac?logo=tailwindcss) ![Supabase](https://img.shields.io/badge/Supabase-Edge%20Postgres-3ecf8e?logo=supabase) ![Clerk](https://img.shields.io/badge/Auth-Clerk-512bf4) ![Vapi](https://img.shields.io/badge/VoiceAI-Vapi-orange) ![Sentry](https://img.shields.io/badge/Monitoring-Sentry-black?logo=sentry)

</div>

## 🚀 Elevator Pitch
Converso lets a learner spin up personalized AI “companions” (voice tutors) for topics across maths, science, coding, economics and more. Each session is a real‑time, bi‑directional voice conversation: the assistant speaks, listens, adapts its teaching style (formal vs casual), and produces a live transcript. Users can:

- Create custom companions with subject, topic, tone, voice, and duration.
- Start / end realtime voice tutoring sessions via Vapi’s Web SDK.
- See recent sessions and popular companions (social proof style feed).
- Save companions locally (client persistence) for quick access.
- Enjoy authenticated, multi‑tenant data isolation via Clerk + Supabase RLS (future hardening).

This repository showcases pragmatic engineering choices, clean UI composition with shadcn‑style components, and integration across multiple modern SaaS APIs—ideal for recruiters evaluating breadth + depth.

## 🎯 Project Goals (Course Context)
This is a learning / portfolio project focused on:
1. Mastering Next.js App Router server + client component boundaries.
2. Working with real‑time streaming voice AI (Vapi) and prompt/assistant configuration.
3. Secure auth delegation (Clerk) into a Postgres backend (Supabase) using per‑request service clients.
4. Type‑safe form handling & validation (React Hook Form + Zod) with server actions.
5. Production readiness foundations: structured error reporting (Sentry) & environment isolation.

## 🧩 Architecture Overview
High‑level flow:

1. Auth: `clerkMiddleware` protects routes; `auth()` used inside server actions to attach the current user (author / user_id fields).
2. Data: Supabase (Postgres) stores `companions` plus `session_history`. Server Actions in `lib/actions` wrap CRUD with minimal branching logic for filters (subject/topic search, pagination).
3. Voice Session: Client component `CompanionComponent` orchestrates a Vapi Web SDK call lifecycle (connect, speech start/end, transcript messages) while updating local React state and persisting session history on completion.
4. Assistant Configuration: `configureAssistant` builds a dynamic GPT‑4 powered teaching agent with template‑driven system instructions & ElevenLabs voice parameters.
5. UI Layer: Reusable design‑system primitives in `components/ui` (button, input, select, form) plus feature components (cards, lists, form wizard) styled via Tailwind + utility `cn` merger.
6. Local Persistence: `SavedCompanionsProvider` supplies lightweight bookmarking via `localStorage` (no over‑engineering with backend state yet).
7. Observability: Sentry auto‑initialized for both edge and node runtimes via `instrumentation.ts` and dual configs.

## 🗂 Key Directories
- `app/` – App Router pages (`page.tsx`, dynamic companion routes, auth, profile, subscription placeholders, error boundaries).
- `components/` – Presentational + interactive React components (forms, cards, navbar, provider context).
- `lib/actions/` – Server Actions (Supabase CRUD + permission logic).
- `lib/` – Utility modules (`utils.ts`, Supabase client factory, Vapi SDK instance, assistant configuration helper).
- `constants/` – Domain enumerations (subjects, voices, seed session examples, color mapping, soundwave animation data).
- `types/` – Shared ambient type declarations (companion shapes, Vapi message types, etc.).

## 🧪 Interesting Implementation Highlights
- Server Actions pattern instead of bespoke API routes keeps request/response overhead low & leverages React’s built‑in progressive enhancement.
- Live transcript accumulation uses event stream messages filtered for `transcriptType === 'final'` ensuring stable text (no flicker from interim states).
- Adaptive voice / style injection via variable templating (`subject`, `topic`, `style`) inside the assistant configuration.
- Clean separation of cross‑cutting concerns: auth (Clerk) only touches the boundary where access tokens are needed (Supabase `accessToken()` hook & `auth()` in actions).
- Local bookmarking uses a defensive JSON parse + type guard to avoid runtime hazards from corrupted storage.

## 🔐 Authentication & Authorization
Clerk handles:
- Session + user management (Sign‑in / Sign‑up route grouping under `app/sign-in`).
- Per‑request `auth()` used to stamp `author` / `user_id` fields.

Future Enhancements (Roadmap):
- Row Level Security policies in Supabase (tightening per‑user data visibility).
- Feature / plan gates already scaffolded via `has({ plan | feature })` pattern in `newCompanionPermissions`.

## 🗄 Data Model (Conceptual)
Companion
- id (uuid)
- name
- subject (enum from constants)
- topic (text)
- voice (male/female)
- style (formal/casual)
- duration (estimated minutes)
- author (Clerk userId)

Session History
- id
- companion_id (fk -> companions)
- user_id (Clerk userId)
- created_at (timestamp)

## 🗣 Realtime Voice Stack
Vapi Web SDK + ElevenLabs voice + Deepgram transcription + OpenAI GPT‑4 reasoning. The assistant spec is created on the fly with tunable style parameters (stability, similarityBoost, speed, style). Events consumed:
- `call-start` / `call-end`
- `speech-start` / `speech-end`
- `message` (filtered transcripts)
- `error` (robust unwrapping for nested Response objects for better console diagnostics)

## 📊 Observability
Sentry is initialized for both edge & node runtimes; error capture uses `captureRequestError` hook to standardize crash logging early.

## 🧱 Tech Stack Summary
- Next.js 15 (App Router, Server Actions, turbopack dev).
- React 19 (new concurrent behaviors ready).
- TypeScript 5 (type safety + ambient decls for domain models).
- Tailwind CSS 4 + utility merge helpers.
- Clerk for auth.
- Supabase for Postgres + (planned) RLS.
- Vapi AI for real‑time voice interaction.
- Zod + React Hook Form for deterministic validation.
- Sentry for tracing & error reporting.

## ▶️ Getting Started
Prereqs: Node 18+ (align with Next.js 15), npm.

1. Clone & install
```bash
git clone https://github.com/<your-username>/my-learning-platform.git
cd my-learning-platform
npm install
```
2. Create `.env.local` with required keys:
```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
CLERK_SECRET_KEY=...
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
NEXT_PUBLIC_VAPI_WEB_TOKEN=...
```
3. (Optional) Configure Sentry DSN for your own project (or leave existing dev DSN while learning).
4. Run dev server
```bash
npm run dev
```
5. Sign up / in, create a companion, start a session.

