# Aero NITK Website

Official website for Aero NITK, the aeromodelling and aviation-focused student team of NITK Surathkal.

This repository contains the React + Vite frontend for the club website, including public pages, image-heavy showcases, Firebase-backed registration flows, contact submissions, visitor tracking, and Vercel deployment support.

## Live Site

- Production: `https://aeronitk.in`

## What This Project Includes

- Homepage with hero section, achievements carousel, timeline, and contact form
- About, Gallery, Team, Alumni, Sponsors, and 404 pages
- Central registrations hub with `Ongoing`, `Upcoming`, and `Past` tabs
- Event-specific registration forms with Firestore storage
- Success pages for completed registrations
- Firebase visitor analytics and form persistence
- EmailJS contact notifications
- SEO metadata, Open Graph tags, Twitter tags, sitemap, robots.txt, and JSON-LD
- PWA manifest and service worker registration

## Tech Stack

- React 19
- Vite
- React Router
- Firebase Firestore
- EmailJS
- GSAP / Motion
- React Helmet Async
- Vercel

## Routes

Routing is defined in `src/App.jsx`.

- `/` - homepage
- `/about` - about/team overview
- `/gallery` - gallery page
- `/team` - current team members
- `/alumni` - alumni landing page
- `/alumni/:batchId` - alumni batch page
- `/alumni/:year` - alumni batch details page
- `/registrations` - central registrations hub
- `/workshop_registration` - workshop registration page
- `/workshop_success` - workshop success page
- `/wright_flight_registration` - Wright Flight registration page
- `/wright_flight_success` - Wright Flight success page
- `/recruitment` - recruitment route exists, but the page source is currently commented out
- `/recruitment-success` - recruitment success page
- `/sponsors` - sponsors page
- `*` - custom 404 page

## Registration System

The site now uses a central registrations page at `/registrations`. Each event appears in one of three tabs:

- `Ongoing`
- `Upcoming`
- `Past`

Each registration event controls its own state directly inside its own file.

### Current Registration Files

- `src/components/workshop_registration.jsx`
- `src/components/wright_flight_registration.jsx`

### Status Variables

Each registration file exposes a status variable near the top:

```js
export const WORKSHOP_REGISTRATION_STATUS = 'closed';
export const WRIGHT_FLIGHT_REGISTRATION_STATUS = 'ongoing';
```

Supported values:

- `'upcoming'`
- `'ongoing'`
- `'closed'`

Meaning:

- `upcoming`:
  - shows the event in the `Upcoming` tab
  - form page shows an opening-soon state
- `ongoing`:
  - shows the event in the `Ongoing` tab
  - registrations hub shows a button that opens the form
  - form submissions are allowed
- `closed`:
  - shows the event in the `Past` tab
  - form page blocks submissions and shows a closed state

### Slot Limit Variables

Each registration file also exposes a slot-count variable:

```js
export const WORKSHOP_MAX_SLOTS = 111;
export const WRIGHT_FLIGHT_MAX_SLOTS = 100;
```

These values control:

- the slots-remaining banner
- the progress bar
- the closed-state message
- the Firestore capacity check before submit

### Registration Features

The registration forms support:

- Firestore submission storage
- duplicate checking by roll number, email, and phone number
- honeypot bot protection
- live slot counting
- success redirect after a valid submission

### Firestore Collections Used for Registrations

- `workshop_registrations`
- `wright_flight_registrations`

## Contact Form

The homepage contact form:

- validates input client-side
- stores messages in Firestore collection `contact_submissions`
- sends an EmailJS notification
- tracks a GA4 event on success

Main file:

- `src/AeronitkHomepage.jsx`

## Firebase Usage

Firebase helpers are defined in `src/firebase.js`.

The app currently reads from or writes to:

- `contact_submissions`
- `workshop_registrations`
- `wright_flight_registrations`
- `applicants`
- `metadata/siteStats`
- `daily_visits/{YYYY-MM-DD}`

Visitor tracking increments:

- `metadata/siteStats.total_visits`
- `daily_visits/YYYY-MM-DD.count`

This tracking is internal and not displayed on the public website.

## Project Structure

```text
website_aero/
|- public/                          # Static assets, brochure, manifest, robots, sitemap
|- src/
|  |- assets/                       # Misc app assets
|  |- components/                   # Pages and reusable UI pieces
|  |  |- RegistrationsPage.jsx
|  |  |- WorkshopSuccess.jsx
|  |  |- WrightFlightSuccess.jsx
|  |  |- workshop_registration.jsx
|  |  |- wright_flight_registration.jsx
|  |- images/                       # Team, gallery, alumni, and UI images
|  |- App.jsx                       # Route definitions and maintenance handling
|  |- AeronitkHomepage.jsx          # Homepage and contact flow
|  |- firebase.js                   # Firestore helpers and analytics helpers
|  |- main.jsx                      # App bootstrap
|- google-sheets-sync.gs            # Google Apps Script helper
|- vercel.json                      # SPA rewrite config for Vercel
|- vite.config.js                   # Vite build optimization config
|- package.json
```

## Getting Started

### Prerequisites

- Node.js 18+ recommended
- npm
- Firebase project with Firestore enabled
- EmailJS account for homepage contact notifications

### Install Dependencies

```bash
npm install
```

### Start Local Development

```bash
npm run dev
```

Default Vite local URL is usually:

```text
http://localhost:5173
```

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Run Lint

```bash
npm run lint
```

## Environment Variables

Create a `.env` file in the project root:

```env
VITE_MAINTENANCE_MODE=false

VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=

VITE_EMAILJS_SERVICE_ID=
VITE_EMAILJS_TEMPLATE_ID=
VITE_EMAILJS_PUBLIC_KEY=
```

Important note:

- registration states are no longer controlled from `.env`
- each registration file manages its own `STATUS` and `MAX_SLOTS` values directly

## Maintenance Mode

The app supports a temporary maintenance or stress-test screen controlled by:

```env
VITE_MAINTENANCE_MODE=true
```

When enabled:

- the normal site is blocked
- a countdown screen is shown
- the site restores automatically after the configured timer expires

Implementation is inside `src/App.jsx`.

## Deployment

This project is configured for Vercel.

`vercel.json` rewrites all routes to `index.html`, which is required because the app uses client-side routing with React Router.

Typical deployment flow:

1. Push the repository to GitHub.
2. Import the repo into Vercel.
3. Add the required environment variables in Vercel.
4. Deploy.

## SEO and Metadata

The project includes:

- page-level titles and descriptions
- canonical URLs
- Open Graph metadata
- Twitter card metadata
- `public/sitemap.xml`
- `public/robots.txt`
- JSON-LD organization schema

## Performance Notes

The app includes:

- lazy-loaded routes
- manual chunk splitting in `vite.config.js`
- production console/debugger stripping
- selected route prefetching
- production-only service worker registration

## Contributor Notes

- Do not commit `.env` files or private Firebase credentials.
- The file `aeronitk-698ac-firebase-adminsdk-fbsvc-f8335506d6.json` should remain private.
- The recruitment route exists, but the actual recruitment page source is currently commented out.
- To open or close a registration, edit the status variable inside that registration file.
- To change capacity, edit the slot variable inside that registration file.
- Ongoing registrations automatically show a button on `/registrations` that opens the live form.
- The service worker in `public/sw.js` is intentionally self-destructing to avoid stale cached builds.

## Available Scripts

From `package.json`:

- `npm run dev` - start the Vite dev server
- `npm run build` - create a production build
- `npm run preview` - preview the production build locally
- `npm run lint` - run ESLint

## Current Health

At the time of the latest local check:

- `npm run lint` passes
- `npm run build` passes

## License

No license file is currently included in this repository. Add one if this project is intended for public reuse.
