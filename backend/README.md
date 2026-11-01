# TrackAI backend

The backend is a Node.js/Express API with MongoDB through Mongoose. Account registration/login and group creation/listing are implemented. Location endpoints, invitations, notifications, and sockets are not available yet.

## API server, accounts, and groups

Requirements: Node.js 20 or newer and a MongoDB instance available to the backend. These instructions use MongoDB Atlas.

1. From this directory, install dependencies:

   ```sh
   npm install
   ```

2. In MongoDB Atlas:
   - Create a database user under **Database Access**. Give it the `readWrite` role for the `trackai` database; this is separate from your Atlas website login.
   - Under **Network Access**, add your current IP address.
   - Go to **Database > Connect > Drivers**, select Node.js, and copy the connection string.

3. In PowerShell, copy the template and open your private local environment file:

   ```powershell
   Copy-Item .env.example .env
   notepad .env
   ```

   Replace the empty `MONGODB_URI=` with the Atlas connection string, using `trackai` as the database name. Replace the username and password placeholders with the database user's credentials. If the password contains URI-special characters, URL-encode them. Keep `.env` private: it is ignored by Git; never put credentials in `.env.example` or share them in chat.

   Generate a private signing secret for account sessions (this command does not print it):

   ```powershell
   node -e "const fs=require('node:fs');const crypto=require('node:crypto');const file='.env';let text=fs.readFileSync(file,'utf8');if(!/^\\s*JWT_SECRET\\s*=\\s*\\S{32,}\\s*$/m.test(text)){const secret=crypto.randomBytes(48).toString('base64url');if(/^\\s*JWT_SECRET\\s*=/m.test(text))text=text.replace(/^\\s*JWT_SECRET\\s*=.*$/m,'JWT_SECRET='+secret);else text+=(text.endsWith('\n')?'':'\n')+'JWT_SECRET='+secret+'\n';fs.writeFileSync(file,text,{mode:0o600});console.log('Generated private JWT_SECRET in .env')}else{console.log('JWT_SECRET already configured')}"
   ```

   The backend requires a `JWT_SECRET` of at least 32 characters. Passwords are hashed before they are stored. Sessions expire after seven days.

   If Node.js reports `ECONNREFUSED` while resolving the Atlas SRV record, but Windows can resolve it, set `MONGODB_DNS_SERVERS` to a working DNS server address in `.env` (for example, your network's DNS server). Separate multiple addresses with commas. This overrides Node.js DNS resolution for the backend process.

4. Start the API:

   ```sh
   npm run dev
   ```

   The server listens on port `5000` by default. Set `PORT` in `.env` to use another port.

5. Check `http://localhost:5000/api/health`. A `200` response with `database.status: "connected"` means the API and database are ready. A `503` response reports that the API is running but MongoDB is disconnected; the server logs the failure and retries the connection. If it stays disconnected, verify the URI, database username/password, Atlas IP allowlist, and network access.

The API provides `POST /api/auth/register`, `POST /api/auth/login`, and authenticated `GET`/`POST /api/groups` endpoints. The Vite development server proxies `/api` to port 5000. New accounts start without groups; groups they create are saved in MongoDB and visible only to their members. Invitations, join requests, and live location sharing are not connected yet.

Run the backend checks with:

```sh
npm test
```

The health endpoint does not expose credentials or private location data. The server adds standard security headers, limits JSON request bodies, and returns JSON for unknown routes. Live location tracking and SOS are not implemented; do not rely on this demo for safety-critical use.

## Planned areas

- `src/models/` — MongoDB data models
- `src/routes/` — HTTP API routes
- `src/sockets/` — Socket.IO events for live group updates
- `src/middleware/` — authentication, validation, and authorization
