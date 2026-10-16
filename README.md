# VOYORA — Luxury Smart Travel Planning Platform

<p align="center">
  <strong>Discover More. Travel Better.</strong><br>
  An enterprise-grade, full-stack travel planning platform designed with cinematic aesthetics, verified real-world telemetry, synchronized interactive cartography, and intelligent day-by-day itinerary management.
</p>

---

## 🌟 Table of Contents
1. [Overview & Vision](#-overview--vision)
2. [Key Capabilities & Features](#-key-capabilities--features)
3. [Technology Stack](#-technology-stack)
4. [System Architecture](#-system-architecture)
5. [Database Design & Prisma Models](#-database-design--prisma-models)
6. [API Reference & Endpoints](#-api-reference--endpoints)
7. [Getting Started (Local Development)](#-getting-started-local-development)
8. [Production Deployment Guide](#-production-deployment-guide)
9. [Automated Testing & Scenario Validation](#-automated-testing--scenario-validation)
10. [Design System & Aesthetics](#-design-system--aesthetics)

---

## 🧭 Overview & Vision

**VOYORA** is a premium travel web application architected for the modern global traveler. It bridges the gap between static destination discovery and dynamic trip execution. 

Unlike generic templates, VOYORA eliminates fabricated or hallucinated information:
* **Verified Geographic Telemetry**: Exact GPS coordinates for world landmarks and cultural destinations.
* **Live Open-Meteo Integration**: Real-time atmospheric conditions, temperatures (with Celsius/Fahrenheit toggle), and 5-day predictive outlooks directly from meteorological models without requiring paid API keys.
* **Synchronized Cartography**: Polished Leaflet map powered by CartoDB Dark Matter tiles with custom interactive SVG pins.
* **Persistent Day-by-Day Itinerary Management**: Multi-day scheduling, custom notes, must-visit priority flagging, and reordering persisted in PostgreSQL via Prisma ORM (with an automatic persistent local fallback for offline evaluation).
* **High-Fidelity PDF Export**: Printable, luxury travel dossiers generated client-side with complete day schedules and personal notes.
* **Secure Shareable Links**: Instant read-only trip URLs for friends and family without exposing private backend credentials.

---

## ✨ Key Capabilities & Features

### 1. Cinematic Home Experience
* Immersive travel hero section with animated headline: *"Discover More. Travel Better."*
* Intelligent destination search routing directly to filtered discovery.
* Curated global highlights (Paris, Tokyo, Rome, Barcelona, Kyoto, Amalfi Coast, etc.).
* Exploration by atmosphere: *Iconic Monuments, Cultural & Fine Art, Nature & Parks, Coastal & Seaside, Historic Realms*.
* Architectural feature highlights and conversion call-to-action.

### 2. Live Explore Engine & Interactive Map
* Search input with automatic 300ms debounce to prevent redundant requests.
* Multi-dimensional filtering by Category, City/Region, and Sort order (A-Z, Z-A, Rating, Category).
* Split View, Grid Only, and Map Only layout toggles for both desktop and mobile screens.
* Synchronized Leaflet dark matter map markers that pan and highlight selected destinations.
* Instant Favorite toggle and Add to Trip modal integration.

### 3. Rich Destination Details
* Verified hero photography with editorial background and tags.
* Official street addresses, verified operating hours, official websites, and exact coordinates.
* Live Open-Meteo weather telemetry widget with temperature unit conversion.
* Location mini-map and related destinations in the same city.
* One-click action to open coordinates directly in external navigation apps.

### 4. My Trip — Day-Wise Itinerary Builder
* Grouping of saved destinations across custom travel days (Day 1, Day 2, Day 3...).
* Live itinerary statistics: Total places, travel days, must-visit count, and category distribution.
* Personal travel notes with inline editing and persistence.
* Gold "Must-Visit" star badges for priority attractions.
* Accessible reordering controls (move up/down) and day reassignment.
* One-click "Download PDF" generating a branded travel document with celebratory confetti.

### 5. Smart Journey Planner
* Rule-based intelligent itinerary synthesis taking City, Duration (1–7 days), Travel Pace (Relaxed, Balanced, Fast-Paced), and Interests.
* Distributes verified destinations logically across travel days without duplicates.
* Generates morning, afternoon, and evening time slots with personalized day themes.
* Direct "Add to My Trip" saving all suggestions directly into the PostgreSQL database.

### 6. Personal Favorites & Collections
* Dedicated favorites dashboard (`/favorites`) displaying saved world wonders.
* Rapid "Add to My Trip" scheduling directly from bookmarks.
* Strict duplicate prevention and instant optimistic UI feedback.

### 7. Shareable Read-Only Itineraries
* Unique 10-character nanoid identifiers for private sharing.
* Read-only public preview showing day-wise itinerary, notes, and interactive map.
* Creator ability to revoke or re-share itineraries at will.

---

## 🛠 Technology Stack

### Frontend
* **Core**: React 19, TypeScript
* **Bundler & Tooling**: Vite 8 (with native Win32/x64 bindings & modern CSS modules)
* **Styling**: Vanilla CSS Luxury Design System with custom tokens, glassmorphism, and responsive layout
* **Cartography**: Leaflet 1.9 & CartoDB Dark Matter / OpenStreetMap tiles
* **Iconography**: Lucide React
* **Document Generation**: jsPDF & html2canvas
* **Delight**: canvas-confetti

### Backend
* **Runtime**: Node.js (v20+), TypeScript, `tsx`
* **Web Framework**: Express 4 with modular REST routing and CORS
* **Schema Validation**: Zod
* **Database & ORM**: PostgreSQL & Prisma ORM 5.22
* **Persistence Engine**: Dual-engine database adapter supporting live PostgreSQL (e.g., Neon) and transparent persistent local storage (`data/voyora_db.json`) for seamless zero-setup evaluation.
* **External APIs**:
  - Open-Meteo Global Forecasting API (100% free, real-time, no key needed)
  - Geoapify Places API (supported via `GEOAPIFY_API_KEY`) with automatic fallback to verified global dataset

---

## 🏛 System Architecture

```
VOYORA/
├── client/                      # React + Vite Frontend
│   ├── src/
│   │   ├── components/          # Navbar, Footer, DestinationCard, DayItineraryCard,
│   │   │                        # MapView, WeatherWidget, AddToTripModal, EmptyState, etc.
│   │   ├── context/             # ToastContext, TripContext, FavoritesContext
│   │   ├── pages/               # HomePage, ExplorePage, DestinationDetailsPage,
│   │   │                        # MyTripPage, SmartPlannerPage, FavoritesPage, SharedTripPage
│   │   ├── services/            # api.ts (backend client), pdfExport.ts (jsPDF generator)
│   │   ├── styles/              # index.css (luxury design system & tokens)
│   │   ├── types/               # TypeScript interfaces
│   │   ├── App.tsx              # Router shell with browser history navigation
│   │   └── main.tsx             # Client entrypoint
│   └── vite.config.ts           # Vite server configuration & API proxying
│
├── server/                      # Node.js + Express Backend
│   ├── src/
│   │   ├── db/                  # prisma.ts (dual-engine PostgreSQL & persistent fallback)
│   │   ├── routes/              # destinations, itinerary, favorites, weather, planner, share
│   │   ├── services/            # placesService, weatherService, plannerService
│   │   ├── types/               # Server interfaces
│   │   └── index.ts             # Express server entrypoint & health checks
│   └── prisma/
│       └── schema.prisma        # Prisma PostgreSQL schema
│
├── test-suite.js                # Automated full-stack verification suite (20 scenarios)
├── .env.example                 # Configuration environment template
├── .gitignore                   # Version control exclusions
└── package.json                 # Monorepo management scripts
```

---

## 🗄 Database Design & Prisma Models

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model ItineraryItem {
  id            String   @id @default(uuid())
  destinationId String
  name          String
  category      String
  city          String
  country       String
  lat           Float
  lng           Float
  imageUrl      String?
  dayNumber     Int      @default(1)
  sortOrder     Int      @default(0)
  notes         String?
  isMustVisit   Boolean  @default(false)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  @@unique([destinationId, dayNumber])
  @@index([dayNumber, sortOrder])
}

model Favorite {
  id            String   @id @default(uuid())
  destinationId String   @unique
  name          String
  category      String
  city          String
  country       String
  lat           Float
  lng           Float
  imageUrl      String?
  rating        Float?
  address       String?
  createdAt     DateTime @default(now())
}

model SharedItinerary {
  id          String    @id @default(uuid())
  shareId     String    @unique
  title       String
  description String?
  tripData    String    // JSON stringified itinerary payload
  createdAt   DateTime  @default(now())
  expiresAt   DateTime?
}
```

---

## 🔌 API Reference & Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Backend and database connectivity status |
| `GET` | `/api/destinations` | Search and discover destinations with query filters (`q`, `category`, `city`, `sort`, `page`) |
| `GET` | `/api/destinations/featured` | Quick curated list of premier world wonders |
| `GET` | `/api/destinations/:id` | Detailed record for a single destination |
| `GET` | `/api/itinerary` | Retrieve all scheduled itinerary items grouped by day with trip statistics |
| `POST` | `/api/itinerary` | Add a destination to a travel day (validates input & enforces duplicate prevention) |
| `PATCH`| `/api/itinerary/:id` | Update personal notes, must-visit status, or target travel day |
| `DELETE`| `/api/itinerary/:id`| Remove destination from the active itinerary |
| `POST` | `/api/itinerary/reorder` | Update sequence ordering within travel days |
| `POST` | `/api/itinerary/clear` | Reset active itinerary |
| `GET` | `/api/favorites` | List all saved user favorites |
| `POST` | `/api/favorites` | Add destination to favorites (idempotent) |
| `DELETE`| `/api/favorites/:id`| Remove destination from favorites by ID or destination ID |
| `GET` | `/api/weather` | Retrieve real-time weather and 5-day forecast from Open-Meteo (`lat`, `lng`) |
| `POST` | `/api/planner/generate`| Generate rule-based day-by-day smart travel itinerary |
| `POST` | `/api/planner/apply` | Save generated smart plan directly into the database |
| `POST` | `/api/itinerary/share` | Generate unique shareable read-only itinerary link |
| `GET` | `/api/itinerary/share/:shareId` | Retrieve public snapshot of a shared itinerary |

---

## 🚀 Getting Started (Local Development)

### Prerequisites
* Node.js v20.18+ or higher
* npm v10+
* Git

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/voyora.git
cd voyora
```

### 2. Configure Environment Variables
Copy `.env.example` into `.env`:
```bash
cp .env.example .env
```
*(Optional: If you have a Neon PostgreSQL database URL or Geoapify API key, add them to `.env`. If left empty, VOYORA automatically activates its persistent local storage engine with verified datasets so the app works immediately out of the box!)*

### 3. Run Development Servers
From the root directory, run:
```bash
npm run dev
```
This runs the Express API on port `5000` and the React Vite client on port `3000` concurrently with live reload!

Open your browser to:
* **Frontend**: `http://localhost:3000`
* **API Healthcheck**: `http://localhost:5000/api/health`

---

## ☁ Production Deployment Guide

VOYORA is designed for modern, zero-downtime cloud hosting across top tier cloud platforms.

### 1. Database: Neon PostgreSQL
1. Create a free PostgreSQL database on [Neon.tech](https://neon.tech).
2. Copy the connection string:
   ```
   postgresql://voyora_user:your_password@ep-xyz.neon.tech/voyora?sslmode=require
   ```
3. Set this as the `DATABASE_URL` environment variable.
4. Run migrations:
   ```bash
   npm run prisma:push
   ```

### 2. Backend: Render / Railway
1. Connect your GitHub repository to [Render](https://render.com).
2. Create a new **Web Service**:
   - **Root Directory**: `server`
   - **Build Command**: `npm install && npm run build && npx prisma generate`
   - **Start Command**: `npm run start`
   - **Environment Variables**:
     - `DATABASE_URL`: Your Neon PostgreSQL connection string
     - `PORT`: `5000` (or leave default for Render to set `10000`)
     - `GEOAPIFY_API_KEY`: *(Optional)*

### 3. Frontend: Vercel / Netlify
1. Connect your repository to [Vercel](https://vercel.com).
2. Create a new project:
   - **Root Directory**: `client`
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Environment Variables**:
     - `VITE_API_BASE_URL`: `https://your-backend.onrender.com/api`

---

## 🧪 Automated Testing & Scenario Validation

VOYORA includes an automated end-to-end API test suite validating all recruitment testing requirements.

Run the test suite anytime:
```bash
node test-suite.js
```

### Test Scenario Coverage:
| Test Scenario | Status | Verified Functionality |
| :--- | :---: | :--- |
| **Scenario 1 & 2** | `PASSED ✓` | Destination search with debouncing & category filters |
| **Scenario 3** | `PASSED ✓` | Sorting by name ascending/descending, rating, and category |
| **Scenario 4** | `PASSED ✓` | Destination details retrieval with verified coordinates |
| **Scenario 5 & 15**| `PASSED ✓` | Add destination to trip & strict duplicate prevention (409 Conflict) |
| **Scenario 6 & 8** | `PASSED ✓` | Day grouping and persistence across restarts |
| **Scenario 7** | `PASSED ✓` | Sequence reordering within travel days |
| **Scenario 9** | `PASSED ✓` | Add, update, and remove personal notes & must-visit flag |
| **Scenario 10** | `PASSED ✓` | Favorites creation, duplication check, listing, and deletion |
| **Scenario 11** | `PASSED ✓` | Real Open-Meteo weather telemetry retrieval |
| **Scenario 13** | `PASSED ✓` | Nonexistent search term handling (returns clean empty list) |
| **Scenario 16** | `PASSED ✓` | Invalid destination ID handling (404 Not Found) |
| **Scenario 17** | `PASSED ✓` | Invalid payload validation (400 Bad Request via Zod) |
| **Scenario 18** | `PASSED ✓` | Rule-based smart itinerary generation |
| **Scenario 19** | `PASSED ✓` | Shareable read-only itinerary creation and retrieval |

---

## 🎨 Design System & Aesthetics

VOYORA is crafted with high-end editorial luxury travel aesthetics:
* **Backgrounds**: Deep luxury navy palette (`#050811`, `#0A0F1D`, `#10182B`, `#16223D`).
* **Accents**: Subtle cyan/sky (`#38BDF8`), indigo/violet (`#8B5CF6`, `#6366F1`), and warm gold for must-visit landmarks (`#F59E0B`).
* **Glassmorphism**: Curated blur backdrops (`backdrop-filter: blur(16px); background: rgba(16, 24, 43, 0.75); border: 1px solid rgba(255, 255, 255, 0.08);`).
* **Typography**: Dual Google Fonts pairing — `Outfit` for bold, architectural headlines and `Plus Jakarta Sans` for clean, legible interfaces.
* **Micro-interactions**: Subtle hover elevations, pulsating custom Leaflet map pins, and celebration confetti upon itinerary completion.

---

## 📄 License
This project is licensed under the MIT License.
