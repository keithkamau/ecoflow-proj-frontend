# Waste Management & Recycling Hub — Frontend

React + Tailwind CSS frontend for the EcoFlow waste management platform.

## Features (Member 3 — Offers & Transactions)
- Offer listing, creation, accept/reject/counter
- Transaction history with visual timeline
- Real-time M-Pesa payment via Daraja API
- Chat messaging per offer
- Notification badge (pending offers + unread messages)
- Transaction state machine tracking
- Fully responsive, mobile-first

## Tech Stack
- **Framework:** React 18 + Vite
- **Styling:** Tailwind CSS v4
- **HTTP Client:** Fetch (custom `api.js` wrapper)
- **State:** React Context + hooks
- **Testing:** Vitest + Testing Library
- **Payments:** M-Pesa Daraja (primary)
- **Build:** Vite + Rolldown

## Getting Started

```bash
git clone https://github.com/keithkamau/ecoflow-proj-client
cd ecoflow-proj-client
npm install
cp .env.example .env
npm run dev
```

App at http://localhost:5173

### Docker
```bash
docker compose up -d
```

## Testing
```bash
npm test              # Run all
npm test -- --coverage # With coverage
```

## Routes (Offers & Transactions)
| Path | Page |
|------|------|
| /offers | Offer list + inline chat |
| /offers/new | Create offer |
| /offers/:id | Offer detail + chat |
| /transactions | Transaction history |
| /transactions/:id | Transaction detail + timeline |
| /payments | M-Pesa payment form |

## Color Scheme
- **Primary Green:** `#10B981` (actions, success)
- **Secondary Orange:** `#F97316` (warnings, notifications)
- **Neutral:** Tailwind gray scale

## Environment
```
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

## Branch
`feature/offers-transaction`
