# TrackAI

TrackAI has a React + Vite frontend and a Node.js/Express backend connected to MongoDB.

- [`frontend/`](./frontend/) contains the React app.
- [`backend/`](./backend/) contains the API, account authentication, and MongoDB group storage.

To run the complete local app, configure the backend first by following [`backend/README.md`](./backend/README.md). Start the backend with `npm run dev` from `backend/`, then start the frontend with `npm run dev` from `frontend/`. Open the Vite URL (usually `http://localhost:5173`).

Account creation/login and group creation/listing are connected to the backend. Invitations, join requests, live location sharing, and SOS are not yet connected.
