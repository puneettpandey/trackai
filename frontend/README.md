# TrackAI frontend

React + Vite frontend using JavaScript, Tailwind CSS, React Router, and Leaflet.

## Run locally

Start the backend first (see [`../backend/README.md`](../backend/README.md)), then from this directory:

```sh
npm install
npm run dev
```

The development server proxies `/api` requests to `http://localhost:5000`. Create an account or sign in using the backend; group creation and group lists are stored in MongoDB. Invitations, join requests, privacy preferences, location sharing, and SOS are still demo-only and do not send location data.

## Structure

- `src/components/` — shared UI and map components
- `src/context/` — app-wide authentication state
- `src/data/` — mock data
- `src/pages/` — landing, authentication, dashboard, group management, group map, nearby, and safety screens
- `src/services/` — API, auth, and socket integration placeholders
