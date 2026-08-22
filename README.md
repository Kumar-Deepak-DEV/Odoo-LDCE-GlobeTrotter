# Odoo-LDCE-GlobeTrotter

# Voyago — Empowering Personalized Travel Planning

> A modern, collaborative travel-planning web application designed to turn chaotic trip ideas into beautifully structured, actionable itineraries with smart budgeting, interactive maps, and community discovery.

---

## 📖 Table of Contents

- [1. Project Title & Tagline](#1-project-title--tagline)
- [2. Overview](#2-overview)
- [3. Screenshots / UI Preview](#3-screenshots--ui-preview)
- [4. Tech Stack](#4-tech-stack)
- [5. Features](#5-features)
- [6. Project Structure](#6-project-structure)
- [7. Getting Started / Local Setup](#7-getting-started--local-setup)
- [8. API Overview (Backend)](#8-api-overview-backend)
- [9. Data Model](#9-data-model)
- [10. Available Scripts](#10-available-scripts)
- [11. Known Limitations / Non-Goals (Hackathon Scope)](#11-known-limitations--non-goals-hackathon-scope)
- [12. Team / Credits](#12-team--credits)
- [13. License](#13-license)

---

## 1. Project Title & Tagline

**Voyago — Empowering Personalized Travel Planning**  
*The all-in-one operating system for modern globetrotters to plan multi-city itineraries, track real-time budgets, visualize schedules dynamically, and explore community-tested adventures.*

---

## 2. Overview

Planning travel across multiple destinations often degenerates into a frustrating mess of scattered spreadsheets, browser tabs, lost bookmarks, and rough cost estimates. **Voyago** was built during the **Odoo-LDCE Hackathon** to eliminate this friction entirely. 

Voyago delivers a clean, unified workspace where travelers can assemble multi-city journeys stop-by-stop, schedule timed activities, calculate multi-currency budgets with automated visual category charts, organize trips across a dynamic calendar view, and share or clone itineraries directly through an interactive community hub.

---

## 3. Screenshots / UI Preview

> 📸 Screenshots coming soon — add UI images to `docs/screenshots/` and reference them here.

---

## 4. Tech Stack

### Architecture Overview

Voyago is built as a modern full-stack TypeScript web application with decoupled client and server architectures:

| Layer | Technologies & Libraries | Purpose / Details |
|---|---|---|
| **Frontend** | **React 19**, **Vite**, **TypeScript** | High-performance SPA with instant hot module reloading |
| **Styling & UI** | **Tailwind CSS v4**, **Lucide React** | Modern design system with custom tokens, animations & iconography |
| **Routing & State** | **React Router v7**, **TanStack React Query v5** | Declarative client routing, optimistic caching & API state |
| **Data Visualization** | **Recharts**, **React Big Calendar** | Dynamic budget breakdown charts & interactive multi-month calendar |
| **Backend Runtime** | **Node.js**, **Express**, **TypeScript** | Scalable modular REST API with robust middleware |
| **Database & ORM** | **PostgreSQL (Neon Serverless)**, **Prisma ORM** | Strongly-typed relational data model with automated migrations |
| **Auth & Security** | **JWT (JSON Web Tokens)**, **bcryptjs**, **Zod** | Stateless authentication & schema-level request validation |
| **Deployment Targets** | **Vercel** (Client), **Render / Railway** (Server), **Neon** (Database) | Production cloud deployment architecture |

---

## 5. Features

### 🔐 1. Authentication & Security
- **JWT-Based Authentication**: Secure login and registration with encrypted passwords (`bcryptjs`).
- **Role-Based Access Control**: Strict access separation between standard `USER` and platform `ADMIN`.
- **Protected Routing**: Automatic redirection for unauthenticated sessions with demo login presets.

### 📊 2. Explorer Dashboard
- **Quick Metrics**: Real-time overview of active trips, upcoming destinations, completed journeys, and total budget spent.
- **Next Adventure Card**: Countdown widget and quick shortcut to the nearest upcoming itinerary.
- **Curated Recommendations**: Trending seasonal destinations with estimated budgets and travel styles.

### ✈️ 3. Trip Creation & Setup
- **Wizard Flow**: Step-by-step modal for defining trip title, destination cover photo, start/end dates, and estimated budget.
- **Smart Validation**: Date range consistency checks and automatic status initialization (`UPCOMING`, `ONGOING`, `COMPLETED`).

### 🗺️ 4. Itinerary Builder (Multi-City & Activity Drag/Drop)
- **Multi-Stop Structuring**: Add and manage multiple city stops with individual dates and localized stop budgets.
- **Activity Planning**: Add day-by-day activities categorized into *Sightseeing, Food, Adventure, Culture, Shopping, Nightlife, Nature, and Wellness*.
- **Live Reordering & Sequencing**: Fast reindexing of activities and stops with dynamic day number assignment.

### 🧳 5. My Trips Hub
- **Status Filtering**: Filter itineraries across *All, Upcoming, Ongoing, and Completed* states.
- **Card Actions**: 1-click access to view summary, open builder, toggle public sharing, clone, or delete.
- **Local & Cloud Persistence**: Seamless hybrid sync between server backend and offline local storage.

### 👤 6. User Profile & Preferences
- **Profile Management**: Update avatar, bio, home city, country, and preferred display currency.
- **Travel Passport Stats**: Live counters for total countries visited, itineraries built, and community upvotes.
- **Security Settings**: Password update workflow with input validation.

### 🔍 7. City & Activity Discovery Search
- **Destination Database**: Search global destinations with filter tags (*Beaches, Mountains, Culture, Nightlife*).
- **Curated POIs**: Instant access to top-rated attractions, average entrance fees, and recommended time allocations.

### 💰 8. Itinerary View & Visual Budget Tracking
- **Expense Breakdown Charts**: Interactive donut and bar charts (via Recharts) displaying costs by category (*Transport, Lodging, Meals, Activities*).
- **Budget Health Indicator**: Visual progress bars showing remaining vs. utilized budget limits.
- **Printable Summary**: Clean format for printing or saving day-by-day itineraries as PDF.

### 🌐 9. Community & Social Hub
- **Feed & Discussions (`/community`)**: Community timeline for sharing travel updates, photos, and tips.
- **Public Itinerary Guides (`/community/guides`)**: Filter verified guides by continent and travel vibe with **1-click cloning** into your own builder.
- **Voyager Leaderboard (`/community/leaderboard`)**: Top curators showcase with Gold, Silver, Bronze podiums and XP rankings.
- **Travel Buddies (`/community/travel-buddies`)**: Co-traveler requests for splitting campervans, hikes, and roadtrips.
- **Travel Stories (`/community/stories`)**: Long-form visual journals and photo essays with author tip callouts.

### 📅 10. Dynamic Trip Calendar
- **Dynamic Month Engine**: Full month computation with previous/next month overflow days and accurate weekday alignment.
- **Multi-Day Trip Spans**: Color-coded span bars dynamically calculated across any year and month.
- **Interactive Day Popover**: Click any active cell for trip breakdown and direct itinerary links.

### 🛡️ 11. Admin Panel
- **Platform Analytics**: Total registered users, total trips created, active stops, and activity volume.
- **User & Trip Moderation**: Inspect user accounts, adjust roles, and remove spam content or flagged public trips.

### 📄 12. Static & Legal Pages
- **Privacy Policy (`/privacy`)**: Searchable data policy, sticky TOC, and plain-English summaries.
- **Terms of Service (`/terms`)**: Platform usage clauses, content licensing, and liability limitations.
- **Help & Support (`/support`)**: Searchable FAQ accordions, helpfulness feedback, and platform status.
- **Contact Us (`/contact`)**: Form submission with automated ticket ID generation and office coordinates.
- **About Voyago (`/about`)**: Company vision, milestone evolution timeline, core values, and team overview.

---

## 6. Project Structure

```
Odoo-LDCE-GlobeTrotter/
├── client/                     # Frontend Single Page Application (React + Vite)
│   ├── public/                 # Static assets, SVG icons, and destination images
│   │   ├── images/             # High-res curated destination photography
│   │   ├── voyago-icon.svg     # Standalone Voyago SVG icon mark
│   │   └── voyago-logo.svg     # Complete Voyago vector logo and wordmark
│   ├── src/
│   │   ├── api/                # Axios instance & module API handlers (auth, trip, admin, etc.)
│   │   ├── assets/             # React asset bundles
│   │   ├── components/         # Reusable UI component library
│   │   │   ├── layout/         # Navbar, Footer, ProtectedRoute, NotFoundPage
│   │   │   ├── shared/         # Shared modals, cards, and feedback components
│   │   │   └── ui/             # VoyagoLogo, VoyagoIcon, and design tokens
│   │   ├── context/            # Global React Contexts (AuthContext, TripContext)
│   │   ├── features/           # Feature-sliced application pages & modules
│   │   │   ├── admin/          # Admin dashboard & user moderation
│   │   │   ├── auth/           # Login and Signup forms with carousels
│   │   │   ├── calendar/       # Dynamic Trip Calendar engine & popovers
│   │   │   ├── community/      # Community feed, guides, leaderboard, buddies, stories
│   │   │   ├── dashboard/      # Explorer Dashboard & quick stats
│   │   │   ├── profile/        # User profile editor & passport statistics
│   │   │   ├── search/         # Destination search & activity discovery
│   │   │   ├── static/         # Privacy, Terms, Support, Contact, About pages
│   │   │   └── trip/           # MyTrips, CreateTrip, ItineraryBuilder, View & Share
│   │   ├── routes/             # AppRoutes registration and route guards
│   │   ├── types/              # TypeScript interface & type definitions
│   │   ├── utils/              # Helper utilities (budgetCalc, dateFormat, cn)
│   │   ├── App.tsx             # Root application component
│   │   ├── index.css           # Tailwind CSS theme tokens & typography imports
│   │   └── main.tsx            # Application entry point
│   ├── index.html              # HTML template with Google Fonts & favicon
│   ├── package.json            # Frontend dependencies & scripts
│   └── vite.config.ts          # Vite bundler configuration
│
├── server/                     # Backend REST API (Node.js + Express + Prisma)
│   ├── prisma/                 # Prisma ORM setup
│   │   ├── schema.prisma       # Relational database schema definition
│   │   └── seed.ts             # Database seeder with demo accounts & sample trips
│   ├── src/
│   │   ├── config/             # Environment configuration & Prisma client instance
│   │   ├── errors/             # Custom application error classes & global handler
│   │   ├── middleware/         # Auth guard, Zod validator, error handler
│   │   ├── modules/            # Modular domain controllers, services, routes & schemas
│   │   │   ├── activity/       # Activity CRUD & sequencing
│   │   │   ├── admin/          # Platform administration & analytics
│   │   │   ├── auth/           # User authentication & token issuance
│   │   │   ├── budget/         # Trip budget & expense calculation
│   │   │   ├── city/           # City catalog & POI suggestions
│   │   │   ├── community/      # Community posts, likes & comments
│   │   │   ├── dashboard/      # Aggregated user dashboard statistics
│   │   │   ├── stop/           # Trip stop & destination management
│   │   │   ├── trip/           # Itinerary CRUD, visibility & slug generation
│   │   │   └── user/           # User profile & credentials management
│   │   ├── routes/             # Top-level API router mapping (/api/*)
│   │   ├── utils/              # Token helpers, password hashing & slug utilities
│   │   ├── app.ts              # Express application configuration & CORS
│   │   └── server.ts           # Server bootstrap & port listener
│   ├── .env.example            # Backend environment template
│   ├── package.json            # Backend dependencies & scripts
│   └── tsconfig.json           # Backend TypeScript configuration
│
├── docs/                       # Project documentation & requirements
│   └── GlobeTrotter_PRD.md     # Comprehensive Product Requirements Document
│
└── README.md                   # Repository documentation & guide
```

---

## 7. Getting Started / Local Setup

Follow these steps to run both the frontend and backend locally on your machine.

### Prerequisites
- **Node.js**: `v18.0.0` or later
- **npm**: `v9.0.0` or later
- **PostgreSQL Database**: Local PostgreSQL instance or a free cloud database on [Neon.tech](https://neon.tech)

---

### Step 1: Clone the Repository
```bash
git clone https://github.com/Kumar-Deepak-DEV/Odoo-LDCE-GlobeTrotter.git
cd Odoo-LDCE-GlobeTrotter
```

---

### Step 2: Configure Environment Variables

#### Backend (`server/.env`)
Create `server/.env` based on `server/.env.example`:
```bash
cd server
cp .env.example .env
```
Fill in your configuration:
```env
DATABASE_URL=postgresql://<username>:<password>@<neon-host>/<database>?sslmode=require
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d
PORT=5000
CLIENT_URL=http://localhost:5173
ADMIN_SEED_EMAIL=admin@globetrotter.com
ADMIN_SEED_PASSWORD=Admin@2024
DEMO_SEED_EMAIL=demo@globetrotter.com
DEMO_SEED_PASSWORD=Demo@2024
```

#### Frontend (`client/.env`)
Create `client/.env` based on `client/.env.example`:
```bash
cd ../client
cp .env.example .env
```
Ensure the API base URL points to your local server:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

### Step 3: Install Dependencies

#### Install Server Dependencies
```bash
cd ../server
npm install
```

#### Install Client Dependencies
```bash
cd ../client
npm install
```

---

### Step 4: Setup Database & Seed Data

In the `server/` directory, generate the Prisma client, apply schema migrations to your database, and run the seeder:

```bash
cd ../server
npx prisma generate
npx prisma db push
npm run seed
```

---

### Step 5: Start Development Servers

Open two terminal windows:

#### Terminal 1 — Backend (Port 5000)
```bash
cd server
npm run dev
```
> Server running at: `http://localhost:5000` (Health check: `http://localhost:5000/api/health`)

#### Terminal 2 — Frontend (Port 5173)
```bash
cd client
npm run dev
```
> Client running at: `http://localhost:5173`

---

### Demo Login Credentials

*(Populated automatically via `npm run seed` — for development & evaluation purposes only)*

| Role | Email Address | Password | Permissions |
|---|---|---|---|
| 👑 **Administrator** | `admin@globetrotter.com` | `Admin@2024` | Full access + Admin Panel (`/admin`) |
| 🧳 **Standard Traveler** | `demo@globetrotter.com` | `Demo@2024` | Itinerary builder, community, profile |

---

## 8. API Overview (Backend)

All backend endpoints are prefixed with `/api`.

| Module | Method | Endpoint | Description | Auth Required |
|---|---|---|---|---|
| **Health** | `GET` | `/api/health` | Service health & timestamp check | No |
| **Auth** | `POST` | `/api/auth/register` | Register a new traveler account | No |
| **Auth** | `POST` | `/api/auth/login` | Authenticate user & receive JWT token | No |
| **Auth** | `GET` | `/api/auth/me` | Fetch authenticated user session | Yes |
| **User** | `GET` | `/api/users/profile` | Retrieve user profile & travel stats | Yes |
| **User** | `PUT` | `/api/users/profile` | Update profile bio, city, photo | Yes |
| **User** | `PUT` | `/api/users/password` | Update account password | Yes |
| **Trip** | `GET` | `/api/trips` | Get all trips created by current user | Yes |
| **Trip** | `POST` | `/api/trips` | Create a new trip itinerary | Yes |
| **Trip** | `GET` | `/api/trips/:id` | Fetch detailed trip with stops & activities | Yes |
| **Trip** | `PUT` | `/api/trips/:id` | Update trip metadata, dates, or cover | Yes |
| **Trip** | `DELETE` | `/api/trips/:id` | Delete an itinerary | Yes |
| **Trip** | `PATCH` | `/api/trips/:id/visibility` | Toggle public/private sharing state | Yes |
| **Trip** | `GET` | `/api/public/trips/:slug` | View public shared itinerary by slug | No |
| **Stop** | `GET` | `/api/trips/:tripId/stops` | Get all stops for a specific trip | Yes |
| **Stop** | `POST` | `/api/trips/:tripId/stops` | Add a city stop to a trip | Yes |
| **Stop** | `PUT` | `/api/stops/:id` | Update stop dates or localized budget | Yes |
| **Stop** | `DELETE` | `/api/stops/:id` | Remove a stop from itinerary | Yes |
| **Stop** | `PATCH` | `/api/trips/:tripId/stops/reorder` | Reorder sequence of stops | Yes |
| **Activity** | `GET` | `/api/stops/:stopId/activities`| Get all activities for a stop | Yes |
| **Activity** | `POST` | `/api/stops/:stopId/activities`| Add a scheduled activity | Yes |
| **Activity** | `PUT` | `/api/activities/:id` | Update activity name, cost, category | Yes |
| **Activity** | `DELETE` | `/api/activities/:id` | Remove an activity | Yes |
| **Activity** | `PATCH` | `/api/stops/:stopId/activities/reorder` | Reorder activities by sequence order | Yes |
| **City** | `GET` | `/api/cities/search` | Search destinations with POI tags | Yes |
| **City** | `GET` | `/api/cities/:id/activities` | Get recommended activities for a city | Yes |
| **Budget** | `GET` | `/api/budget/trip/:tripId` | Get aggregated category expense metrics | Yes |
| **Dashboard**| `GET` | `/api/dashboard/stats` | Retrieve user dashboard counters & next trip | Yes |
| **Community**| `GET` | `/api/community/trips` | Fetch public community itineraries | Yes |
| **Community**| `GET` | `/api/community/posts` | Get community feed stories & posts | Yes |
| **Community**| `POST` | `/api/community/posts` | Publish a travel story to community | Yes |
| **Community**| `POST` | `/api/community/posts/:id/like` | Like or unlike a community story | Yes |
| **Community**| `POST` | `/api/community/posts/:id/comment` | Post a comment on a community story | Yes |
| **Admin** | `GET` | `/api/admin/metrics` | Platform overview stats (users, trips) | Yes (Admin) |
| **Admin** | `GET` | `/api/admin/users` | List all registered users | Yes (Admin) |
| **Admin** | `DELETE` | `/api/admin/users/:id` | Ban or delete a user account | Yes (Admin) |
| **Admin** | `GET` | `/api/admin/trips` | List all platform itineraries | Yes (Admin) |
| **Admin** | `DELETE` | `/api/admin/trips/:id` | Moderate / delete a trip | Yes (Admin) |

---

## 9. Data Model

Voyago's relational data model is defined with Prisma and backed by PostgreSQL:

```
┌──────────────┐       1:N       ┌──────────────┐
│     User     │────────────────▶│     Trip     │
│ (Auth/Admin) │                 │ (Visibility) │
└──────────────┘                 └──────────────┘
                                         │ 1:N
                                         ▼
                                 ┌──────────────┐
                                 │     Stop     │
                                 │(City/Budget) │
                                 └──────────────┘
                                         │ 1:N
                                         ▼
                                 ┌──────────────┐
                                 │   Activity   │
                                 │(Category/Cost│
                                 └──────────────┘
```

- **User**: Represents platform travelers and admins (`id`, `firstName`, `lastName`, `email`, `passwordHash`, `role`, `photoUrl`, `bio`, `city`, `country`).
- **Trip**: Top-level travel itinerary container (`name`, `description`, `coverPhotoUrl`, `startDate`, `endDate`, `status`, `isPublic`, `shareSlug`).
- **Stop**: Represents each geographic destination within a multi-city journey (`cityName`, `country`, `lat`, `lng`, `startDate`, `endDate`, `budget`, `order`).
- **Activity**: Individual events scheduled under a stop (`name`, `category`, `dayNumber`, `cost`, `costLevel`, `durationMin`, `notes`, `order`).

> 📄 For the complete relational definitions, indexes, and cascade delete rules, refer to [`server/prisma/schema.prisma`](file:///server/prisma/schema.prisma).

---

## 10. Available Scripts

### Client (`client/package.json`)
- `npm run dev`: Starts the Vite development server on `http://localhost:5173` with fast hot-module reloading.
- `npm run build`: Typechecks the codebase (`tsc -b`) and generates optimized production assets into `client/dist`.
- `npm run lint`: Runs `oxlint` high-speed linter across all frontend TypeScript and React files.
- `npm run preview`: Locally previews the production build bundle.

### Server (`server/package.json`)
- `npm run dev`: Starts the Express backend using `tsx watch` for auto-reloading TypeScript execution.
- `npm run build`: Compiles server TypeScript into vanilla JavaScript in `server/dist`.
- `npm run start`: Runs the compiled server bundle in production mode (`node dist/server.js`).
- `npm run prisma:generate`: Generates the Prisma Client types from `schema.prisma`.
- `npm run prisma:push`: Synchronizes database schema directly to PostgreSQL without migration files.
- `npm run prisma:migrate`: Runs Prisma migration workflow.
- `npm run seed`: Executes `prisma/seed.ts` to populate initial demo users, destinations, and multi-day sample trips.

---

## 11. Known Limitations / Non-Goals (Hackathon Scope)

As defined in the project PRD for the hackathon MVP milestone:
1. **No Native Mobile App**: Voyago is engineered as a responsive progressive web application (PWA/SPA); native iOS and Android binaries are not in hackathon scope.
2. **No Real Payment Processing**: Budget features track estimated and actual costs; real-world booking transactions (Stripe/PayPal) are simulated.
3. **No Real-Time WebSocket Multi-Cursor Collaboration**: Collaborative trips are shared via public links and clones; live multi-user concurrent editing is slated for post-hackathon.
4. **No Third-Party OAuth / 2FA**: Authentication uses secure email/password JWT tokens; Google/Apple OAuth login is intentionally out of hackathon scope.

---

## 12. Team / Credits

Built with ❤️ for the **Odoo-LDCE Hackathon 2024 / 2025**.

- **[Deepak Kumar]** — *[Full Stack Development / Frontend & UI Design]*
- **[Team Member Name]** — *[Role / Backend & Database Architecture]*
- **[Team Member Name]** — *[Role / Product & API Integration]*

---

## 13. License

This project is licensed under the [MIT License](LICENSE) — feel free to use and expand upon it.