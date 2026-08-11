# Autochemix OS

Interactive JavaScript portfolio project for logistics and dispatch operations.

Autochemix OS connects three workflows in one product prototype:

- dispatcher dashboard for order creation, pricing, assignment and fleet overview;
- driver workspace for route status, chat and delivery evidence;
- customer portal for order tracking, timeline and feedback.

## Portfolio demo

The public build runs entirely in the browser. Demo data is stored in `localStorage`, so recruiters can test every role without an account, Firebase credentials or exposed API keys.

Try these customer tracking IDs:

- `MX-2048` - active delivery;
- `MX-1735` - completed delivery.

## Technology

- JavaScript
- React
- Vite
- responsive CSS
- lucide-react icons
- browser storage demo adapter
- GitHub Actions / GitHub Pages

## Product background

The original MVP was designed around React, Firebase Auth, Firestore realtime subscriptions and optional Gemini features. This repository packages the concept as a safe public demo while keeping the production path explicit.

Production milestones:

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
