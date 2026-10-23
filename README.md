# LoopSpace — Smart Campus Resource Sharing & Circular Economy Platform

<div align="center">

**Share More. Waste Less. Build Together.**

[![Next.js 14](https://img.shields.io/badge/Next.js-14.2-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase)](https://supabase.com/)
[![Google Sheets API](https://img.shields.io/badge/Google%20Sheets-API%20v4-34A853?logo=googlesheets)](https://developers.google.com/sheets/api)
[![License: MIT](https://img.shields.io/badge/License-MIT-forest.svg)](LICENSE)

*A full-stack, production-ready web application built for college students to lend, borrow, exchange, or donate campus resources—reducing unnecessary spending, cutting e-waste, and cultivating a collaborative campus circular economy.*

</div>

---

## 🌟 Key Features

### 1. 🔄 Multi-Stage Borrowing & Exchange Lifecycle
- **Complete Workflow:** `pending` ➔ `accepted` ➔ `ready_for_pickup` ➔ `borrowed` ➔ `return_requested` ➔ `returned` ➔ `completed`.
- **Integrity Constraints:** Database-level prevention against requesting your own items, overlap conflict detection, and due-date tracking.
- **In-App Notification Center:** Real-time updates for new requests, pickup readiness, and return milestones.

### 2. ⚡ Need–Offer Matching Engine (Zero AI-API Cost)
- Proprietary multi-attribute matching algorithm built directly in TypeScript.
- Evaluates:
  - **Category Alignment (+35%)**
  - **Keyword & Semantic Text Overlap (+30%)**
  - **Availability Window Compatibility (+15%)**
  - **Condition Fit (+10%)**
  - **Campus Pickup Zone Proximity (+10%)**
- Transparent scoring breakdown for every match with tiers: `Excellent Match` (≥75%), `Good Match` (50–74%), and `Possible Match` (25–49%).
- 1-Click direct request submission from any match result.

### 3. 🌱 Loop Impact Score & Gamification
- Verified point rewards:
  - **Item Loan:** +20 pts
  - **Permanent Donation:** +25 pts
  - **Resource Swap:** +20 pts
  - **Need Fulfillment:** +10 pts
- Unique database constraints prevent duplicate rewards for the same exchange.
- Unlocks achievement badges: *First Loop*, *Helpful Neighbor*, *Resource Saver*, and *Community Champion*.
- Transparent carbon and cost avoidance estimations based on published Life Cycle Assessment (LCA) benchmarks.

### 4. 📊 Google Sheets API Live Synchronization
- Server-side route handler (`/api/export-sheets`) utilizing Google Cloud Service Account JWT authorization.
- Exports structured tabular reports across four distinct tabs:
  1. `Resource Listings`
  2. `Sharing Requests`
  3. `Completed Exchanges`
  4. `Monthly Impact Summary`
- Includes error boundary fallbacks and instantaneous CSV download options if Google Cloud credentials are not yet linked.

### 5. 🛡️ Role-Based Admin Dashboard
- Privileged moderator overview with platform statistics, listing removal, content flag resolution, and audit logging.
- RLS guarantees users cannot self-promote to admin or alter their points.

---

## 🏗️ System Architecture

```
loopspace/
├── src/
│   ├── app/                      # Next.js 14 App Router
│   │   ├── api/export-sheets/    # Server-side Google Sheets sync route
│   │   ├── auth/                 # Login, Sign Up, Forgot Password
│   │   ├── dashboard/            # User Dashboard, Requests, Profile, Notifications
│   │   ├── explore/              # Filterable resource catalog (Grid & List)
│   │   ├── resources/            # Resource details & Create listing pages
│   │   ├── match/                # Need–Offer Matching Engine
│   │   ├── impact/               # Impact score, leaderboard & badges
│   │   ├── admin/                # Administrator panel & reports
│   │   ├── about/, faq/, etc.    # Public informational pages
│   │   ├── globals.css           # Custom theme variables
│   │   └── layout.tsx            # Root layout with Theme & Auth providers
│   ├── components/               # Modular UI components
│   │   ├── layout/               # Navbar & Footer
│   │   ├── resources/            # ResourceCard, FilterBar, RequestModal
│   │   ├── matching/             # MatchingEngineForm, MatchResultCard
│   │   ├── dashboard/            # OverviewCharts, RequestsWorkflowManager
│   │   └── admin/                # GoogleSheetsExporter
│   ├── context/                  # AuthContext & ThemeContext
│   ├── lib/                      # Core business logic & services
│   │   ├── data-service.ts       # Unified data repository with live Supabase & demo fallback
│   │   ├── matching-engine.ts    # Deterministic scoring algorithm
│   │   ├── impact-engine.ts      # Gamification rules & LCA benchmarks
│   │   ├── google-sheets.ts      # Google Sheets API client
│   │   ├── storage.ts            # Image upload & validation
│   │   └── supabase/             # Client & Server Supabase instantiators
│   └── types/                    # Domain TypeScript interfaces
├── supabase/
│   ├── schema.sql                # Complete PostgreSQL tables, RLS & triggers
│   └── seed.sql                  # Realistic demo data for viva & testing
├── scripts/
│   └── test-runner.mjs           # Automated test suite
└── VIVA_GUIDE.md                 # Complete defense & viva walkthrough
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher (v22 recommended)
- **npm**: v10.0.0 or higher
- **Git**

### 1. Installation

```bash
# Clone the repository
git clone https://github.com/your-username/loopspace.git
cd loopspace

# Install dependencies
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Fill in your configuration:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Optional College Domain Restriction (leave blank to allow all emails)
NEXT_PUBLIC_ALLOWED_EMAIL_DOMAIN=

# Google Sheets Backend Sync
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@gcp.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEETS_SPREADSHEET_ID=your_spreadsheet_id
```

> **Note:** LoopSpace features an automated **Interactive Demo Mode**. If you run the app without Supabase or Google credentials, it will load sample student personas (Alex Chen, Priya Patel, Marcus Johnson, Admin Elena Rodriguez) and allow you to test every feature immediately!

### 3. Setup Supabase Database

1. Create a project at [supabase.com](https://supabase.com).
2. Go to the **SQL Editor** tab in the Supabase Dashboard.
3. Paste and run the contents of [`supabase/schema.sql`](supabase/schema.sql).
4. Run [`supabase/seed.sql`](supabase/seed.sql) to populate initial sample resources.
5. Create a Storage Bucket named `resource-images` and mark it **Public**.

### 4. Setup Google Sheets API

1. In the **Google Cloud Console**, create a project and enable the **Google Sheets API**.
2. Create a **Service Account**, generate a JSON Key, and copy the `client_email` and `private_key`.
3. Create a Google Spreadsheet with 4 tabs:
   - `Resource Listings`
   - `Sharing Requests`
   - `Completed Exchanges`
   - `Monthly Impact Summary`
4. Share the spreadsheet with the service account email with **Editor** permissions.
5. Add the `GOOGLE_SHEETS_SPREADSHEET_ID` to `.env.local`.

### 5. Run the Application

```bash
# Start development server
npm run dev

# Open in your browser
http://localhost:3000
```

---

## 🧪 Automated Testing

Run the included workflow and logic verification suite:

```bash
npm test
```

Tests verify:
- Semantic keyword tokenization and stopword removal
- Availability date window containment algorithms
- Requester-is-not-owner security restriction
- Impact points duplicate reward prevention
- Score-to-badge threshold unlocks
- Google Sheets row formatting consistency

---

## 🚢 Production Build & Deployment

### Build Locally
```bash
npm run build
npm start
```

### Deploy to Vercel
1. Push your repository to GitHub.
2. In Vercel, click **Add New Project** and select the repository.
3. Add the environment variables from `.env.example` in the Vercel dashboard.
4. Click **Deploy**. Vercel will build and launch your production deployment.

---

## 🎓 Viva & Assessment Guide

For an in-depth breakdown of architecture, security policies, database normalization, and sample viva questions with answers, see [`VIVA_GUIDE.md`](VIVA_GUIDE.md).

---

## 📄 License
This project is open-source under the [MIT License](LICENSE).
