# GlobeTrotter — Product Requirements Document (PRD)

**Project:** GlobeTrotter — Empowering Personalized Travel Planning
**Event:** Odoo Hackathon
**Version:** 2.0 (Final)
**Team size:** 3
**Status:** Final — build from this document

---

## 1. Overview

### 1.1 Vision
GlobeTrotter is a personalized, intelligent, collaborative travel planning platform. Users create multi-city trips, add stops/activities, get automatic budget breakdowns, visualize their itinerary on a calendar, and share trips publicly with a community.

### 1.2 Mission (Hackathon Scope)
Build a **responsive web application** (desktop + mobile browser — **no native app required**, confirmed against the problem statement's "desktop or mobile platforms" wording) that lets a user:
- Add/manage travel stops and durations
- Explore real cities and activities via live search
- Auto-estimate trip budgets
- Visualize itinerary via calendar/timeline
- Share trip plans publicly

### 1.3 Non-Goals (for hackathon timeframe)
- No native iOS/Android app
- No real payment integration
- No real-time collaborative editing (multiple users editing the same trip live)
- No OAuth/2FA/enterprise auth hardening — JWT + bcrypt is sufficient; auth itself is still fully required (Screens 1–2 are core, not optional)

---

## 2. Tech Stack (Final Decision)

| Layer | Choice | Notes |
|---|---|---|
| Frontend | React (Vite) + TypeScript + Tailwind CSS | Team's strongest stack |
| Backend | Node.js + Express + TypeScript | Familiar from prior hackathon project |
| Database | PostgreSQL hosted on **Neon** | Relational — matches trip→stop→activity→budget structure |
| ORM | Prisma | Type-safe queries, easy migrations |
| Auth | JWT + bcrypt | Simple, no third-party auth dependency |
| Validation (Backend) | Zod | Used in `*.schema.ts` files for request validation |
| Charts | Recharts | Budget breakdown (pie/bar), admin analytics |
| Calendar | react-big-calendar | Screen 11 (Calendar View) |
| State/Data fetching | React Query (TanStack Query) | Caching, loading/error states |
| **External data — cities** | **GeoDB Cities API** (via RapidAPI) | Live real-world city search, proxied through backend, cached in own DB |
| **External data — images** | None (cut) | Static/placeholder images only — Pexels cut for this sprint to save time |
| Deployment | Frontend → Vercel/Netlify · Backend → Render/Railway · DB → Neon | All free-tier friendly |
| Version control | GitHub, **single branch (`main`) only** | Required by Odoo hackathon rules |

---

## 3. User Roles

| Role | Description |
|---|---|
| **Guest** | Not logged in. Can view public/shared itineraries only. |
| **User** | Registered traveler. Full access to create/manage own trips. |
| **Admin** | Same website, gated by `role` field + route/middleware guard. Access to analytics dashboard (Screen 12). Not a separate app or deployment. |

---

## 4. Screen-by-Screen Feature Spec

(Mapped directly from the Excalidraw wireframes — 12 screens total)

### Screen 1 — Login
- Fields: Email, Password
- Actions: Login button, link to Register, "Forgot Password"
- Validation: required fields, invalid credential error message
- On success → redirect to Dashboard (Screen 3)

### Screen 2 — Registration
- Fields: Photo (optional upload), First Name, Last Name, Email, City, Country, Additional Information (bio, optional)
- Action: "Register User" button → creates account, redirect to Login or auto-login
- Validation: required first/last name + email, valid email format, duplicate email check

### Screen 3 — Dashboard / Home
- Banner image (static or rotating destination image)
- Search bar with Group by / Filter / Sort by controls
- "Top Regional Selections" — horizontally scrollable city cards (5 shown), backed by real cached city data + real images
- "Previous Trips" section — trip cards (3 shown, "view all" link)
- "+ Plan a Trip" button → Screen 4

### Screen 4 — Create a New Trip
- Fields: Start Date, Select a Place (**plain text input** — user types any city name, works 100% offline), Trip End Date
- Section: "Suggestion for Places to Visit / Activities to perform" — grid of suggestion cards (6 shown), **static/hardcoded** curated list (Paris, Tokyo, New York, Bali, Rome, London). Cosmetic/optional — clicking one auto-fills "Select a Place" but never calls an external API. Keeps this screen fully off the critical path's dependency chain.
- Action: Save/Continue → proceeds to Itinerary Builder (Screen 5)

### Screen 5 — Build Itinerary Screen
- Multiple **Sections** (repeatable — one per city/stop or leg of trip)
- Each Section: description text, Date Range, Budget of this section (input)
- "+ Add another section" button to append new sections dynamically
- Writes to `Stop` + `Activity` tables (see §6)

### Screen 6 — My Trips (Trip Listing)
- Grouped into: **Ongoing**, **Upcoming**, **Completed**
- Trip cards with name, date range, place count, edit/view/delete
- Search/Group/Filter/Sort controls at top
- Click a trip → Itinerary View (Screen 9)

### Screen 7 — User Profile
- Editable user details (photo, name, email, city, country)
- "Preplanned Trips" (upcoming, with View buttons)
- "Previous Trips" (completed, with View buttons)

### Screen 8 — City/Activity Search Page (Stretch Goal — Hour 4+ only)
- Search bar + Group by / Filter / Sort by
- **Primary (if attempted):** query proxied through backend to GeoDB Cities API, response transformed to internal shape
- **Fallback (always active):** if GeoDB fails, times out, or rate-limits, backend serves results from `server/src/config/popularCities.json` (same file that backs `/api/cities/popular`) filtered by query — demo never breaks even if the external API is down
- Results list — city name + country + region
- "Add to Trip" → sends selected city (`name`, `country`, `externalId?`) to backend, saved directly as a `Stop` (see §6) — the trip becomes self-contained, no further API dependency once saved
- Activity search stays local — activities are pre-seeded, never pulled from an external API

### Screen 9 — Itinerary View with Budget
- Itinerary grouped by **Day** (Day 1, Day 2, ...)
- Each day: Physical Activity name + Expense, sequential blocks
- Aggregates into total budget (see budget logic, §6)
- Toggle option (calendar/list view — stretch goal)

### Screen 10 — Community Tab
- List of shared/community trip experiences
- Search/Group/Filter/Sort at top
- Clicking an entry → Shared/Public Itinerary View

### Screen 11 — Calendar View
- Month-based calendar with prev/next navigation
- Trips plotted on their date ranges directly on calendar cells
- Click a date/trip block → jump to that trip's Itinerary View

### Screen 12 — Admin Panel (Optional/Stretch — same website, gated route)
- Tabs: Manage Users, Popular Cities, Popular Activities, User Trends and Analytics
- Charts: pie (category split), line (trend over time), bar (top cities/activities)
- Admin-only route (`/admin`), guarded by `role.middleware.ts` on backend + role check on frontend route
- Build last, only after Screens 1–11 are working — this screen is explicitly optional in the problem statement

---

## 5. Core User Flow (Critical Path for Demo)

```
Register/Login
  → Dashboard
  → "Plan a Trip" → Create Trip (name, dates, place — plain text input, static suggestions)
  → Build Itinerary (add sections: city/stop manually, dates, budget)
      → Add activities per section
  → Itinerary View (day-wise, auto-computed budget)
  → Save Trip → appears in My Trips (Ongoing/Upcoming)
  → View on Calendar
  → Share Trip → Public read-only link
  → (Optional) Post to Community tab
  → (Stretch) City Search via GeoDB (Screen 8)
```
This end-to-end path must work flawlessly for the demo, even if peripheral screens (Admin, Community) are simplified or cut under time pressure. Note: GeoDB-backed search (Screen 8) is explicitly **not** part of this critical path — see §10.1.

---

## 6. Data Model (Prisma / PostgreSQL — Neon)

```prisma
enum Role {
  USER
  ADMIN
}

enum TripStatus {
  UPCOMING
  ONGOING
  COMPLETED
}

enum ActivityCategory {
  SIGHTSEEING
  FOOD
  ADVENTURE
  CULTURE
  SHOPPING
  NIGHTLIFE
  NATURE
  WELLNESS
}

enum CostLevel {
  LOW
  MEDIUM
  HIGH
  LUXURY
}

model User {
  id                String    @id @default(uuid())
  firstName         String
  lastName          String
  email             String    @unique
  passwordHash      String
  photoUrl          String?
  city              String?
  country           String?
  bio               String?
  role              Role      @default(USER)
  resetToken        String?   @unique
  resetTokenExpiry  DateTime?
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt

  trips             Trip[]
  communityPosts    CommunityPost[]

  @@index([email])
}

model Trip {
  id            String     @id @default(uuid())
  userId        String
  user          User       @relation(fields: [userId], references: [id], onDelete: Cascade)
  name          String
  coverPhotoUrl String?
  description   String?
  startDate     DateTime
  endDate       DateTime
  status        TripStatus @default(UPCOMING)
  isPublic      Boolean    @default(false)
  shareSlug     String?    @unique
  createdAt     DateTime   @default(now())
  updatedAt     DateTime   @updatedAt

  stops         Stop[]

  @@index([userId])
  @@index([status])
  @@index([isPublic])
  @@index([startDate])
}

model Stop {
  id             String   @id @default(uuid())
  tripId         String
  trip           Trip     @relation(fields: [tripId], references: [id], onDelete: Cascade)
  cityName       String   // display name
  country        String?
  cityExternalId String?  // optional: GeoDB id, for future lookups
  lat            Float?   // optional: for map features later
  lng            Float?
  startDate      DateTime
  endDate        DateTime
  budget         Decimal  @default(0)
  order          Int
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  activities     Activity[]

  @@index([tripId])
  @@index([cityName])
}

model Activity {
  id           String            @id @default(uuid())
  stopId       String
  stop         Stop              @relation(fields: [stopId], references: [id], onDelete: Cascade)
  name         String
  category     ActivityCategory?
  dayNumber    Int
  cost         Decimal           @default(0)
  costLevel    CostLevel?
  durationMin  Int?
  notes        String?
  order        Int
  createdAt    DateTime          @default(now())
  updatedAt    DateTime          @updatedAt

  @@index([stopId])
  @@index([category])
  @@index([costLevel])
}

model CommunityPost {
  id        String   @id @default(uuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  tripId    String?
  title     String
  content   String
  createdAt DateTime @default(now())

  @@index([userId])
  @@index([tripId])
}
```

> **Note:** the standalone `City` table is intentionally **removed**. City data is discovery-only (via GeoDB, when attempted) or static (`popularCities.json`) — never cached in its own table. Once a user adds a city as a Stop, that Stop holds everything needed (`cityName`, `country`, optional `lat`/`lng`/`cityExternalId`) to display the trip forever, with zero further dependency on any external API or lookup table. This keeps the schema simpler and avoids cache-invalidation logic nobody has time to build or test in a 5-hour sprint.

### 6.1 Budget logic (single source of truth)
- **Trip total budget = sum of all `Activity.cost`** across every stop in the trip.
- `Stop.budget` is an optional manual cap/override. If set, and the sum of that stop's activity costs exceeds it, the frontend shows a warning — but the derived sum from activities remains the authoritative estimate.
- Backend exposes `GET /api/trips/:id/budget` returning: `totalEstimated`, `byStop`, `byCategory`, `overBudgetStops`.

---

## 7. API Decision: Real City & Image Data — Reconciled Final Design

> **Status:** GeoDB city search is a **stretch goal only (Hour 4+)**, never on the critical path. Image integration (Pexels) is **cut entirely** for this sprint — no real images, static/placeholder only. This section is the final, reconciled version after two rounds of team review.

### 7.1 Design decisions (final)
1. **No `City` table.** City data lives only on `Stop` once a user commits to it (see §6). Search results themselves are never persisted — they're ephemeral, shown to the user, and only written to the DB when explicitly added as a Stop.
2. **Single source of truth for static/fallback city data:** one file, `server/src/config/popularCities.json` (~20 entries: `id`, `name`, `country`, `lat`, `lng`). Used by **both**:
   - `GET /api/cities/popular` (Dashboard "Top Regional Selections") — always static, never calls GeoDB.
   - `GET /api/cities/search` fallback — if GeoDB fails/times out/rate-limits, filter this same JSON by the query string instead.
3. **GeoDB is additive, never required.** Screen 4's suggestion cards are fully static (hardcoded 6 cities) and the "Select a Place" field is a plain text input — Create Trip works with zero network dependency beyond your own backend. GeoDB is only attempted on Screen 8 (Search), and only after Hour 4.
4. **Backend always proxies** — GeoDB API key never touches the frontend, regardless of whether search is attempted.

### 7.2 GeoDB proxy implementation (only if attempted, Hour 4+)
```ts
// city.service.ts
export async function searchCities(query: string) {
  try {
    const res = await axios.get("https://wft-geo-db.p.rapidapi.com/v1/geo/cities", {
      params: { namePrefix: query, limit: 10 },
      headers: {
        "X-RapidAPI-Key": process.env.GEODB_API_KEY,
        "X-RapidAPI-Host": process.env.GEODB_HOST,
      },
      timeout: 3000,
    });
    return res.data.data.map((c: any) => ({
      id: c.id, name: c.city, country: c.country, lat: c.latitude, lng: c.longitude,
    }));
  } catch {
    // Fallback: filter the same static JSON used by /api/cities/popular
    const popular = require("../../config/popularCities.json");
    return popular.filter((c: any) =>
      c.name.toLowerCase().includes(query.toLowerCase())
    );
  }
}
```

### 7.3 Why this design survives a bad demo
Even if GeoDB is fully down, rate-limited, or the venue wifi is unreliable: Screens 1–2, 4, 5, 6, 9 (the entire critical path) never call it. Screen 8, if built at all, silently degrades to the same static list Dashboard already uses — the judge never sees an error state.

---

## 8. API Endpoints (Express, REST)

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/forgot-password` — generates reset token, stores on User; for hackathon, log the reset link to console instead of sending real email
- `POST /api/auth/reset-password` — accepts token + new password, updates `passwordHash`, clears `resetToken`
- `GET /api/auth/me` (JWT protected)

### Users
- `GET /api/users/:id`
- `PUT /api/users/:id`

### Trips
- `POST /api/trips` — create trip
- `GET /api/trips` — list current user's trips (`?status=ongoing|upcoming|completed`)
- `GET /api/trips/:id` — trip detail with stops + activities
- `PUT /api/trips/:id`
- `DELETE /api/trips/:id`
- `POST /api/trips/:id/copy` — duplicates trip with all stops/activities, shifts dates
- `POST /api/trips/:id/publish` — sets `isPublic = true`, generates `shareSlug` if missing, returns public URL
- `GET /api/public/trips/:slug` — public read-only view (no auth)

### Stops
- `POST /api/trips/:tripId/stops`
- `PUT /api/stops/:id`
- `DELETE /api/stops/:id`
- `PUT /api/trips/:tripId/stops/reorder`

### Activities
- `POST /api/stops/:stopId/activities`
- `PUT /api/activities/:id`
- `DELETE /api/activities/:id`

### Search (see §7 for implementation detail)
- `GET /api/cities/search?q=` — **stretch goal, Hour 4+.** Proxies GeoDB when attempted; on any failure/timeout/rate-limit, falls back to filtering `popularCities.json`. Response never persisted.
- `GET /api/cities/popular?limit=6` — **always static.** Reads directly from `server/src/config/popularCities.json`. Powers Dashboard "Top Regional Selections" and doubles as the search fallback data source.
- `GET /api/activities/search?city=&category=&costLevel=&q=` — local only, queries pre-seeded `Activity` table, never calls an external API

### Budget
- `GET /api/trips/:id/budget` — breakdown by stop, by category, totals, over-budget flags

### Dashboard
- `GET /api/dashboard/stats` — total trips, upcoming count, total estimated budget, recently added trips

### Community
- `GET /api/community` — list public trips, paginated
- `POST /api/community` — create post linked to a trip

### Admin (role-guarded, `role: ADMIN` required)
- `GET /api/admin/users` — paginated user list
- `GET /api/admin/stats` — `totalUsers`, `newUsersLast7Days`, `totalTrips`, `tripsCreatedLast7Days`, `topCities` (top 5 by trip count), `topActivities` (top 5), `averageTripDuration`, `averageBudgetPerTrip`, `userGrowth` (30-day line chart data), `categoryDistribution` (pie chart data)

---

## 9. Non-Functional Requirements

- **Responsive design:** works across desktop and mobile browser widths — satisfies "desktop or mobile platforms" without a native app.
- **Performance:** search/filter results return in <1s for demo-scale seed data.
- **Data integrity:** foreign keys + cascading deletes enforced via Prisma (Trip → Stop → Activity).
- **Security:** bcrypt password hashing, JWT expiry, protected routes via middleware, Zod validation on every POST/PUT, external API keys never exposed to the frontend.
- **Database performance:** Prisma indexes (§6) on all frequently-queried fields.
- **Single GitHub branch:** required by Odoo hackathon rules — all commits go to `main`.
- **Deployment reliability:** deploy backend + frontend early (by hour 12) to catch environment issues before demo day.

---

## 10. Team Split (3-Person — 5-Hour Sprint)

**Time budget:** 11 AM start, 5 PM deadline (6 hours on the clock, 5 hours budgeted for build to leave a buffer for the unexpected). With this little time, the team works in strict parallel and focuses exclusively on the critical path — no feature creep, no non-critical screens by default.

| Member | Role | Primary Tasks |
|---|---|---|
| **Member A** | Frontend | All UI on the critical path: Login, Register, Dashboard (simplified), Create Trip, Itinerary Builder, Itinerary View, Budget display. Connects everything to backend APIs. |
| **Member B** | Backend Core | Auth endpoints, Trip CRUD, Stop CRUD, Activity CRUD, budget calculation service. |
| **Member C** | Backend Support + Integration | Prisma schema, seed data, validation schemas, middleware, deployment, endpoint testing, unblocking Frontend when APIs are missing. |

### 10.1 Critical Path (must work by demo)
```
1. Login/Register → 2. Create Trip (static suggestions, manual city input) → 3. Add stops + activities → 4. View itinerary with budget
```
This is the entire demo. **The GeoDB search proxy is explicitly NOT part of the critical path** — Create Trip's "Select a Place" is a plain text field, and its suggestion cards are a hardcoded list of 6 cities. Nothing on the critical path makes a network call beyond your own backend. Member C is **not** assigned GeoDB work in Hours 1–2 — their focus there is auth validation, middleware, and supporting Member B.

### 10.2 Stretch Goals (only if time permits, Hour 4+ only, in priority order)
| Feature | Est. Time | Owner | Priority |
|---|---|---|---|
| GeoDB search proxy (Screen 8) — with static-JSON fallback | +45 min | Member C (backend) + Member A (frontend) | High (nice to have) |
| Public share link (trip publish) | +20 min | Member B | Medium |
| Calendar view (Screen 11) | +30 min | Member A (using pre-fetched trip data) | Medium |
| Community tab (Screen 10) | +30 min | Member C + A | Low |
| Admin panel (Screen 12) | +30 min | Member C | Low |

**Explicitly cut for this sprint:** Pexels/real image integration (no real images at all this round — static/placeholder only). The full real-data architecture in §7 documents the reconciled final design if any of this is attempted.

> **A working demo with 4 screens beats a broken demo with 12.** If the critical path isn't 100% solid by Hour 4, skip all stretch goals.

### 10.3 Build Order / Milestones (5-Hour Sprint)

**Hour 0–1: Setup & Foundation (ALL)**
- Create GitHub repo, single branch `main`.
- Neon DB → copy `DATABASE_URL`.
- Set up `client/` (Vite + React + TS + Tailwind) and `server/` (Express + TS + Prisma).
- Push Prisma schema (simplified — see §10.4), run `db push`.
- Member C leads creating `server/src/config/popularCities.json` — 20 entries with `id`, `name`, `country`, `lat`, `lng`.
- Seed data script: pre-load activities, 1 demo user, 1 pre-built trip (so dashboard isn't empty).
- Define API contract (Postman collection or shared doc) so Frontend knows exactly what to expect before backend endpoints exist.
- **Deliverable:** empty but structured repo, DB seeded, everyone running locally.

**Hour 1–2: Authentication MVP (Parallel)**
| Member A (Frontend) | Member B (Backend Core) | Member C (Backend Support) |
|---|---|---|
| Build Login + Register pages | Implement `/register`, `/login`, JWT service | Write Zod schemas for auth |
| Set up React Router + Axios (JWT interceptor) | Implement `/me` protected endpoint | Implement auth middleware (verify JWT) |
| Store token in localStorage | Hash passwords with bcrypt | Role guard (if needed) |

**Deliverable:** user can register, log in, and stay logged in.

**Hour 2–3: Trip Creation + Itinerary Builder (Parallel)**
| Member A (Frontend) | Member B (Backend Core) | Member C (Backend Support) |
|---|---|---|
| Build "Create Trip" form (name, dates) — static suggestions (hardcoded list) | Implement `POST /trips` | Validate trip input schemas |
| Build "Itinerary Builder" page (stops, date ranges, budgets) — manual city name input, no external API | Implement `POST /trips/:tripId/stops` | Validate stop input schemas |
| Connect forms to APIs | Implement `POST /stops/:stopId/activities` | Helper functions for Prisma queries |

**Deliverable:** user can create a trip, add 2–3 stops, add 1–2 activities per stop.

**Hour 3–4: Itinerary View + Budget (Parallel)**
| Member A (Frontend) | Member B (Backend Core) | Member C (Backend Support) |
|---|---|---|
| Build "Itinerary View" page — day-wise grouping | Implement `GET /trips/:id` (with stops + activities) | Test all GET endpoints (Postman) |
| Add budget chart (Recharts pie/bar) | Implement `GET /trips/:id/budget` (total, by stop, by category) | Implement `GET /api/cities/popular` (reads static JSON) |
| Build "My Trips" list (simple cards) | Implement `GET /trips?status=` | — |

**Deliverable:** user can view their trip as a day-wise itinerary with auto-calculated budget breakdown.

**Hour 4–5: Polish, Deploy, Demo (ALL)**
| Task | Owner |
|---|---|
| Deploy Backend to Render/Railway | Member B + C |
| Deploy Frontend to Vercel/Netlify | Member A |
| Fix last-minute CORS, env vars, API URL issues | Member C |
| Record video walkthrough (3–5 min) | ALL (one person speaks) |
| Submit GitHub link + video on portal | ANY |

**Deliverable:** live demo URL + submitted video.

### 10.4 Simplified schema note for this sprint
Stick to the full schema in §6 — it's already lean. The only cuts are:
- Skip `resetToken`/`resetTokenExpiry` (no forgot-password flow in this sprint).
- Skip `CommunityPost` model entirely (community tab is a low-priority stretch).
- Keep `ActivityCategory`/`CostLevel` enums if trivial to add now (they cost nothing extra at schema level), but don't build UI filtering by them unless time remains.

The `City` table is **not** needed — skip it entirely and use `server/src/config/popularCities.json` as the single source of truth for static city data (see §7.1, §7.2).

### 10.5 Single-Branch Git Workflow (unchanged, still critical at this pace)
With 3 people compressing a normal day into 5 hours, conflicts happen faster too — same rules, tighter cadence:
1. **Sync every ~45–60 min**, not every 2 hours — pull, resolve, push, resume.
2. **Claim shared files before editing:** `schema.prisma`, `types/index.ts`, `AppRoutes.tsx`, `app.ts`.
3. **Pull before every push, no exceptions.**
4. **Commit every 15–20 min** — even smaller than usual, since there's no time to untangle a big conflict.
5. **If a conflict happens, call the other person immediately** — don't debug it alone under this time pressure.

---

## 11. Standard API Response Contract

Every backend controller returns one of these two shapes — no exceptions. This is the contract F builds mock data against from hour 0, so integration later is a one-line swap (point `axiosInstance` at the real backend), not a rebuild.

```ts
// Success
{
  "success": true,
  "data": { ... }
}

// Error
{
  "success": false,
  "error": {
    "message": "Descriptive error message",
    "code": "OPTIONAL_ERROR_CODE"
  }
}
```

---

## 12. Note on Build Order

Build order, hour-by-hour milestones, and the critical-path definition for this 5-hour sprint are now consolidated in **§10** (Team Split) since time budget and task ownership are the same decision under this deadline. Refer to §10.3 for the hour-by-hour schedule.

---

## 13. Seed Data Checklist (for demo)

**Popular Cities / Fallback List — single source of truth:**
`server/src/config/popularCities.json`, 20 entries:
```json
[
  { "id": "paris", "name": "Paris", "country": "France", "lat": 48.8566, "lng": 2.3522 },
  { "id": "tokyo", "name": "Tokyo", "country": "Japan", "lat": 35.6762, "lng": 139.6503 }
]
```
Used by **both** `GET /api/cities/popular` (Dashboard) and the `GET /api/cities/search` fallback (§7) — one file, no drift between the two.

**Activities (20–30 entries):** manually seeded in the DB, spread across all `ActivityCategory` values, mixed `costLevel`, realistic `cost` and `durationMin`.

**Demo Users (auto-created by seed script):**

| Email | Password | Role |
|---|---|---|
| demo@globetrotter.com | Demo@2024 | USER |
| admin@globetrotter.com | Admin@2024 | ADMIN |

**Pre-built Demo Trips (2–3):**
- "European Highlights" — Paris, Rome, Barcelona — 10 days
- "Asian Getaway" — Tokyo, Kyoto, Bangkok — 12 days
- "South American Explorer" — Rio, Buenos Aires, Lima — 14 days (optional)

Each demo trip's `Stop` entries must have `cityName` and `country` pre-filled directly (no external API call needed) so the itinerary view works immediately on first load.

---

## 14. Deliverables (per Odoo Hackathon rules)
- GitHub repo link, single branch (`main`)
- Video solution walkthrough
- Submitted via "Submit GitHub Repo Link" + "Submit Video Solution" on the hackathon portal before deadline

---

## 15. Production-Grade Architecture & Folder Structure

Committed to before writing code, to eliminate merge conflicts and inconsistent patterns.

### 15.1 Repository Layout (Monorepo, single branch)
```
globetrotter/
├── client/                 # React + Vite + TypeScript frontend
├── server/                 # Express + TypeScript backend
├── .gitignore
├── README.md
└── package.json            # optional root-level scripts (concurrently run client+server)
```

### 15.2 Backend — `server/`
```
server/
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── src/
│   ├── config/
│   │   ├── db.ts                     # Prisma client singleton
│   │   └── env.ts                    # validated env vars via zod
│   ├── middlewares/
│   │   ├── auth.middleware.ts        # verifies JWT, attaches req.user
│   │   ├── error.middleware.ts       # centralized error handler
│   │   ├── validate.middleware.ts    # zod validation
│   │   └── role.middleware.ts        # blocks non-admins from /admin routes
│   ├── modules/
│   │   ├── auth/          (auth.controller/service/routes/schema.ts)
│   │   ├── user/           (user.controller/service/routes/schema.ts)
│   │   ├── trip/           (trip.controller/service/routes/schema.ts — incl. copyTrip, publishTrip)
│   │   ├── stop/           (stop.controller/service/routes/schema.ts)
│   │   ├── activity/       (activity.controller/service/routes/schema.ts)
│   │   ├── city/           (city.controller/service/routes/schema.ts — incl. GeoDB + Pexels integration)
│   │   ├── budget/         (budget.controller/service/routes.ts)
│   │   ├── dashboard/      (dashboard.controller/service/routes.ts)
│   │   ├── community/      (community.controller/service/routes/schema.ts)
│   │   └── admin/          (admin.controller/service/routes.ts)
│   ├── utils/
│   │   ├── jwt.ts
│   │   ├── hash.ts
│   │   ├── apiResponse.ts
│   │   └── logger.ts
│   ├── types/
│   │   └── express.d.ts
│   ├── app.ts
│   └── server.ts
├── .env.example
├── package.json
└── tsconfig.json
```

**Module ownership rule:** each teammate owns their module folder(s) end-to-end (controller + service + routes + schema). No two people edit files inside the same module folder simultaneously.

**Layer responsibilities:**
| File | Responsibility |
|---|---|
| `*.routes.ts` | Maps HTTP method + path → controller function. No logic. |
| `*.controller.ts` | Reads `req`, calls service, sends `res`. No DB queries, no business logic. |
| `*.service.ts` | All business logic + Prisma queries + external API calls (GeoDB/Pexels). Framework-agnostic. |
| `*.schema.ts` | Zod schemas for request validation. |

### 15.3 Frontend — `client/`
```
client/
├── src/
│   ├── api/                  (axiosInstance.ts + one *.api.ts per module)
│   ├── components/
│   │   ├── ui/                # Button, Input, Modal, Card, Badge
│   │   ├── layout/             # Navbar, Sidebar, Footer, ProtectedRoute
│   │   └── shared/              # TripCard, ActivityCard, BudgetChart
│   ├── features/
│   │   ├── auth/          (LoginPage, RegisterPage, useAuth.ts)
│   │   ├── dashboard/      (DashboardPage.tsx)
│   │   ├── trip/            (CreateTripPage, ItineraryBuilderPage, MyTripsPage, ItineraryViewPage, hooks/)
│   │   ├── search/          (SearchPage.tsx)
│   │   ├── calendar/         (CalendarPage.tsx)
│   │   ├── community/         (CommunityPage.tsx)
│   │   ├── profile/            (ProfilePage.tsx)
│   │   └── admin/               (AdminDashboardPage.tsx)
│   ├── context/
│   │   └── AuthContext.tsx
│   ├── routes/
│   │   └── AppRoutes.tsx
│   ├── types/
│   │   └── index.ts
│   ├── utils/
│   │   ├── dateFormat.ts
│   │   └── budgetCalc.ts
│   ├── App.tsx
│   └── main.tsx
├── .env.example
├── tailwind.config.ts
└── package.json
```

**Feature ownership rule:** F owns all `features/xxx/` folders. Shared folders (`components/ui`, `types/index.ts`, `routes/AppRoutes.tsx`) built once, early, collaboratively — then frozen; announce before editing after that.

### 15.4 Environment Variables

**`server/.env.example`**
```
DATABASE_URL=postgresql://<user>:<password>@<neon-host>/<db>?sslmode=require
JWT_SECRET=replace_with_random_string
JWT_EXPIRES_IN=7d
PORT=5000
CLIENT_URL=http://localhost:5173
ADMIN_SEED_EMAIL=admin@globetrotter.com
ADMIN_SEED_PASSWORD=Admin@2024
# Optional – only needed for Screen 8 stretch goal (Hour 4+)
GEODB_API_KEY=your_rapidapi_key
GEODB_HOST=wft-geo-db.p.rapidapi.com
```

**`client/.env.example`**
```
VITE_API_BASE_URL=http://localhost:5000/api
```

Every teammate copies `.env.example` → `.env` locally and fills in their own values. `.env` is git-ignored, never committed.

### 15.5 Naming Conventions

| Item | Convention | Example |
|---|---|---|
| Backend files | `feature.layer.ts` | `trip.controller.ts`, `trip.service.ts` |
| Frontend components | PascalCase | `TripCard.tsx`, `ItineraryBuilderPage.tsx` |
| Frontend hooks | camelCase, `use` prefix | `useTrips.ts`, `useAuth.ts` |
| API route paths | kebab-case, plural nouns | `/api/trips`, `/api/community-posts` |
| DB tables (Prisma models) | PascalCase singular | `Trip`, `Stop`, `Activity` |
| Env variables | UPPER_SNAKE_CASE | `DATABASE_URL`, `GEODB_API_KEY` |

### 15.6 Code Quality Baseline
- TypeScript strict mode on both client and server.
- ESLint + Prettier, shared config committed to repo.
- No `any` types except where genuinely unavoidable.
- All async functions wrapped in try/catch, errors passed to `error.middleware.ts` via `next(err)`.
- Input validation on every POST/PUT via `validate.middleware.ts` + Zod.
- External API calls (GeoDB, Pexels) always wrapped in try/catch with a safe fallback — never let a third-party API failure break a core screen.

### 15.7 Local Setup Steps (Day 1, do together)
1. Create GitHub repo, single branch (`main`), all 3 members as collaborators.
2. Create Neon project → copy `DATABASE_URL`.
3. Sign up for RapidAPI (GeoDB Cities) and Pexels → get API keys.
4. Clone repo locally, create `client/` and `server/` per structure above.
5. `server/`: `npm init`, install `express typescript prisma @prisma/client bcrypt jsonwebtoken zod axios`, `npx prisma init`, paste schema from §6, `npx prisma db push`.
6. `server/`: create `prisma/seed.ts` — cities (with real Pexels images pre-fetched), activities, demo users, demo trips.
7. `client/`: `npm create vite@latest . -- --template react-ts`, install `tailwindcss react-router-dom axios @tanstack/react-query recharts react-big-calendar`, configure Tailwind.
8. Commit the empty-but-structured skeleton as commit #1 — every teammate pulls the same starting layout.
9. Each teammate copies `.env.example` → `.env`, fills in their own values.
10. Confirm everyone can run `npm run dev` on both `client` and `server` before splitting up.
