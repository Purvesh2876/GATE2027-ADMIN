# GATE2027-ADMIN

The GATE 2027 panel: where exhibitors sign up, log in and (soon) book stalls,
and where GCCI staff and the agency manage everything. One Next.js app, one
login page; what a person sees depends on their role. It talks only to
`GATE2027-BACKEND` (Node.js + Express + MongoDB). It holds no data itself.

Next.js 16, React 19, plain JavaScript, plain CSS. Same stack and folder layout
as `GATE2027-FRONTEND` (the public website).

## Run it

```
npm install
cp .env.local.example .env.local     # then adjust
npm run dev                          # http://localhost:3001
```

The backend must be running (`GATE2027-BACKEND`, port 5000). Until real SMS
and email are connected, the codes sent to people are **printed in the
backend's terminal**.

Other commands: `npm run build`, `npm start`, `npm run lint`.

## Folders

```
app/
  actions/      calls to the backend, written like the Appleton projects (axios,
                one async function per call). apiClient.js is the shared axios
                setup; then one file per backend area (auth.js now; stalls.js,
                bookings.js later), each mirroring its backend routes file 1:1.
  components/   Header, Footer, form pieces, AuthProvider (who is logged in),
                SessionWatcher (idle warning), PanelShell (menu by role)
  lib/          fixed settings (gate-config.js)
  utils/        apiUrl.js (where the API lives), panelAuth.js (the "not logged in"
                event), safeNext.js, useCooldown.js
  (panel)/      pages that need a login: dashboard, account/password
  login/ signup/ forgot-password/ reset-password/ accept-invite/
  page.js       the public front door: hero, how booking works, stalls, FAQ
proxy.js        the security policy (CSP) with a fresh nonce on every request
next.config.mjs the other security headers
```

`(panel)` is only a folder group; it does not appear in the address.

## Things to know

- **Login cookie.** The API sets a `__Host-gate_session` cookie (not readable by
  scripts). It is only sent if the panel and the API share a parent domain in
  production, for example `events.gccigate.com` and `api.gccigate.com`. A panel
  on Vercel with the API elsewhere cannot log in.
- **Security policy.** Pages are built per request so each gets its own nonce
  (see `proxy.js`). Do not use inline `style={{…}}` props or `next/image` (it
  adds an inline style): the policy blocks them. Use CSS classes and plain
  `<img>`.
- **`app/tokens.css`** is a copy of the website's. Keep the two in step.
- **Staff pages** will live under their own folder and answer "not found" to
  anyone without the role, the same as the API does.
- **Not built yet:** the stall list, company profile, requests and bookings
  (build steps 3 to 5). The menu shows them as "Soon".
