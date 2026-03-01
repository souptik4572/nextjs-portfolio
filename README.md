<div align="center">

# Souptik Sarkar — Developer Portfolio

A high-performance, data-driven personal portfolio built with **Next.js 15**, featuring a floating island navigation, dark/light mode, smooth Framer Motion animations, an interactive in-browser terminal, and a fully configurable content layer backed by Firebase Realtime Database (with a static JSON fallback).

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=nextdotjs)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3-38BDF8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

**[Live Demo →](https://souptik-sarkar-portfolio.netlify.app/)**

</div>

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running Locally](#running-locally)
- [Configuration](#configuration)
  - [Content — portfolioData.json](#content--portfoliodatajson)
  - [Section Order](#section-order)
  - [Theme Default](#theme-default)
- [Deployment](#deployment)
  - [Netlify (recommended)](#netlify-recommended)
  - [Vercel](#vercel)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

This portfolio is designed as a **data-driven application** — all personal content (bio, experience, skills, projects, etc.) lives in a single JSON document (`lib/portfolioData.json`) or, optionally, in a **Firebase Realtime Database** that is fetched at request time with ISR (5-minute revalidation). Swapping personal details requires no code changes.

A second route (`/dev`) exposes an **interactive browser terminal** where visitors can explore the portfolio by typing commands such as `intro`, `experience`, `skills`, and `projects`.

---

## Features

| Feature | Details |
|---|---|
| **Floating Island Navbar** | Glassmorphism pill that dynamically generates nav links from `section_order` |
| **Dark / Light Mode** | Class-based Tailwind dark mode; preference persisted in `localStorage` with flash-prevention inline script |
| **Animated Sections** | Framer Motion `fadeUp` variants with staggered entrance animations across all sections |
| **Type Animation** | Cycling role titles in the hero using `react-type-animation` |
| **Interactive Terminal** | `/dev` route with a fully functional in-browser terminal (`react-terminal`) — type `help` to see available commands |
| **macOS UI Elements** | Reusable `TrafficLights` and `WindowChrome` components for a polished card aesthetic |
| **Contact Form** | Server-side API route (`/api/contact`) that sends transactional email via **Resend** |
| **Dynamic Metadata** | `generateMetadata()` pulls `title`, `description`, and Open Graph tags from the data layer |
| **ISR Data Fetching** | Content served from Firebase Realtime Database with a 5-minute revalidation window; falls back to static JSON |
| **Skeleton Loading** | `PortfolioSkeleton` component shown via `app/loading.tsx` during data hydration |
| **Scroll To Top** | Floating scroll-to-top button with smooth animation |
| **Fully Responsive** | Mobile-first layout with hamburger menu and adaptive typography |
| **Netlify Ready** | `netlify.toml` with `@netlify/plugin-nextjs` for zero-config deployment |

---

## Tech Stack

**Runtime & Framework**

- [Next.js 15](https://nextjs.org/) (App Router, Server Components, ISR)
- [React 18](https://react.dev/)
- [TypeScript 5](https://www.typescriptlang.org/)

**Styling**

- [Tailwind CSS 3](https://tailwindcss.com/) — utility-first CSS with class-based dark mode
- [Framer Motion 11](https://www.framer.com/motion/) — animation library
- [FontShare](https://www.fontshare.com/) — Archivo (headings) + Clash Display (body)

**UI Components & Libraries**

- [Lucide React](https://lucide.dev/) — icon set
- [react-type-animation](https://react-type-animation.netlify.app/) — typing effect
- [react-terminal](https://github.com/bony2023/react-terminal) — in-browser terminal

**Backend / API**

- [Resend](https://resend.com/) — transactional email for the contact form
- [Firebase Realtime Database](https://firebase.google.com/docs/database) — optional live data source (REST API)

**Deployment**

- [Netlify](https://netlify.com/) with `@netlify/plugin-nextjs`

---

## Project Structure

```
nextjs-portfolio/
├── app/
│   ├── layout.tsx            # Root layout — fonts, ThemeProvider, PortfolioDataProvider
│   ├── page.tsx              # Home page — renders sections from section_order
│   ├── loading.tsx           # Suspense skeleton shown during data fetch
│   ├── globals.css           # Base styles & CSS variables
│   ├── api/
│   │   └── contact/
│   │       └── route.ts      # POST handler — sends email via Resend
│   └── dev/
│       └── page.tsx          # Interactive terminal page (/dev)
├── components/
│   ├── Navbar.tsx            # Floating island nav with dark-mode toggle
│   ├── Footer.tsx
│   ├── ContactForm.tsx       # Controlled form wired to /api/contact
│   ├── Modal.tsx             # Generic modal wrapper
│   ├── MacOSElements.tsx     # TrafficLights & WindowChrome UI primitives
│   ├── TerminalSection.tsx   # react-terminal integration with custom commands
│   ├── TerminalWrapper.tsx   # Dynamic import wrapper (SSR disabled)
│   ├── PortfolioSkeleton.tsx # Loading skeleton
│   ├── ScrollToTop.tsx
│   ├── InteractiveCodingList.tsx
│   └── sections/
│       ├── Intro.tsx         # Hero — name, type animation, coding profiles
│       ├── Experience.tsx
│       ├── Skills.tsx
│       ├── Projects.tsx
│       ├── Achievements.tsx
│       ├── NotableOffers.tsx
│       ├── Education.tsx
│       └── Contact.tsx
├── contexts/
│   ├── ThemeContext.tsx       # Theme state + localStorage persistence
│   └── PortfolioDataContext.tsx
├── lib/
│   ├── data.ts               # TypeScript types + static JSON import
│   ├── getPortfolioData.ts   # Firebase fetch with ISR + static fallback
│   └── portfolioData.json    # ← Single source of truth for all content
├── public/
│   └── images/
│       ├── coding-profiles/  # GitHub, LeetCode, HackerRank, etc.
│       └── companies/        # Employer & offer company logos
├── netlify.toml
├── next.config.mjs
├── tailwind.config.ts
└── tsconfig.json
```

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18.x
- **npm** ≥ 9.x (or `pnpm` / `yarn`)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/souptik4572/nextjs-portfolio.git
cd nextjs-portfolio

# 2. Install dependencies
npm install
```

### Environment Variables

Create a `.env.local` file in the project root. Both variables are optional but required for their respective features:

```env
# Resend API key — required for the contact form to send emails
RESEND_API_KEY=re_xxxxxxxx

# Firebase Realtime Database REST endpoint — enables live content updates via ISR
# If omitted, the app uses the static lib/portfolioData.json fallback
FIREBASE_DATABASE_URL=https://<your-project-id>-default-rtdb.firebaseio.com
```

> **Tip:** The application is fully functional without either variable — the contact form will fail gracefully and content will load from the static JSON.

### Running Locally

```bash
# Development server with hot-reload
npm run dev

# Production build
npm run build

# Serve the production build locally
npm start

# Lint
npm run lint
```

Open [http://localhost:3000](http://localhost:3000) in your browser.  
The interactive terminal is available at [http://localhost:3000/dev](http://localhost:3000/dev).

---

## Configuration

### Content — portfolioData.json

All personal content is centralised in [`lib/portfolioData.json`](lib/portfolioData.json). Edit this file (or mirror its schema in Firebase) to personalise the portfolio. The top-level keys are:

| Key | Description |
|---|---|
| `layout.section_order` | Ordered list of section keys rendered on the home page |
| `theme.defaultMode` | Default colour scheme (`"light"` \| `"dark"`) |
| `meta` | SEO metadata — `title`, `description`, `keywords`, Open Graph fields |
| `terminal` | Branding strings for the `/dev` terminal page |
| `personal` | Name, role, bio, email, LinkedIn, coding profiles, location, resume URL |
| `skills` | Categorised skill lists (languages, frameworks, databases, infra, etc.) |
| `experience` | Work history — company, role, period, highlights |
| `projects` | Side projects — title, tech stack, description, GitHub & live links |
| `achievements` | Awards, hackathons, and notable recognitions |
| `notable_offers` | Job offers received — company, role, date, visibility flag |
| `education` | Degrees — institution, degree, period, GPA |

### Section Order

The home page renders sections **dynamically** from `layout.section_order`. To reorder, add, or remove a section, update that array:

```json
"section_order": ["intro", "experience", "skills", "projects", "education", "contact"]
```

### Theme Default

Set the default colour scheme for first-time visitors:

```json
"theme": { "defaultMode": "dark" }
```

User preference is always saved to `localStorage` and takes precedence on subsequent visits.

---

## Deployment

### Netlify (recommended)

The repository ships with a pre-configured [`netlify.toml`](netlify.toml):

```toml
[build]
  command = "next build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

1. Push the repository to GitHub.
2. Connect it to a new Netlify site.
3. Add `RESEND_API_KEY` and (optionally) `FIREBASE_DATABASE_URL` as **Environment Variables** in the Netlify dashboard.
4. Deploy — Netlify handles the rest automatically.

### Vercel

```bash
npx vercel
```

Add the same environment variables in the Vercel project settings.

---

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push to the branch: `git push origin feat/your-feature`
5. Open a pull request.

---

## License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for details.
