# Autochemix OS

Interactive React portfolio project for logistics and dispatch operations.

Autochemix OS connects three workflows in one product prototype:

- dispatcher dashboard for order creation, pricing, assignment and fleet overview;
- driver workspace for route status, chat and delivery evidence;
- customer portal for order tracking, timeline and feedback.

## Recruiter demo

**[Open the live demo](https://gek2or.github.io/Autochemix-/)** · [View the source code](https://github.com/Gek2or/Autochemix-)

The public build runs entirely in the browser. Demo data is stored in `localStorage`, so you can test every role without an account, Firebase credentials or exposed API keys.

A useful five-minute walkthrough:

1. Open the **Dispatcher** view and inspect the live operations dashboard.
2. Create an order or use the seeded jobs, then assign a driver.
3. Switch to the **Driver** view and move the delivery through its status steps.
4. Add delivery evidence when the driver arrives.
5. Open the **Customer** view and track `MX-2048` or `MX-1735`.

Try these customer tracking IDs:

- `MX-2048` — active delivery;
- `MX-1735` — completed delivery.

The point of the demo is the shared workflow: one status change should make sense to the dispatcher, driver, and customer.

## How the demo is structured

The app keeps one job collection in browser storage and renders role-specific views over the same state:

```text
Dispatcher actions
      ↓
shared demo job state
      ↓
Driver status + evidence
      ↓
Customer timeline
```

This makes the important product behavior easy to inspect: assignment, status changes, chat, evidence, and customer visibility are parts of one workflow rather than separate mock screens.

## Technology

- JavaScript
- React
- Vite
- responsive CSS
- lucide-react icons
- browser storage demo adapter
- GitHub Actions / GitHub Pages

## Product background

The project is based on real logistics workflows at Autochemix Oy / Muuttobotti. It explores how order handling, delivery evidence, customer updates, and pricing can become clearer without forcing every user into the same interface.

The original MVP was designed around React, Firebase Auth, Firestore realtime subscriptions and optional Gemini features. This repository packages the concept as a safe public demo while keeping the production path explicit.

## Known limitations

This is a portfolio demo, not a production dispatch system. It does not yet provide real authentication, server-side persistence, GPS/ETA data, uploaded delivery files, or automated test coverage. Those boundaries are deliberate: the public build stays safe to try while the production path remains visible.

## Production milestones

1. Firebase project configuration, security rules and real role-based authentication.
2. Server-side AI endpoint for order extraction and customer support.
3. Real maps, GPS and ETA updates.
4. Stored photos and signatures plus generated invoice PDFs.
5. Automated tests, monitoring and deployment hardening.

## Run locally

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
npm run preview
```

## Author

Designed and built by **Stanislav Kosytskyy** as a practical portfolio case study based on real logistics workflows at Autochemix Oy / Muuttobotti.
