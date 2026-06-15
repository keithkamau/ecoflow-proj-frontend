# Waste Management & Recycling Hub — Frontend

React + Tailwind CSS frontend for the EcoFlow waste management platform.

## Tech Stack
- **Framework:** React 18 + Vite
- **Styling:** Tailwind CSS v4
- **HTTP Client:** Fetch (custom `api.js` wrapper)
- **State:** React Context + hooks
- **Testing:** Vitest + Testing Library
- **Payments:** M-Pesa Daraja (primary)
- **Build:** Vite + Rolldown

## Prerequisites

- Node.js 16+
- npm or yarn
- Docker (optional)

## Installation

### Local Setup

1. **Clone repository**

   ```bash
   git clone https://github.com/yourusername/waste-management-frontend.git
   cd waste-management-frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment**

   ```bash
   cp .env.example .env
   # Edit .env with your API base URL
   ```

4. **Start development server**

   ```bash
   npm start
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

Creates optimized build in `build/` folder.

## Contributing

1. Create feature branch: `git checkout -b feature/description`
2. Make changes with descriptive commits
3. Add tests for new functionality
4. Push: `git push origin feature/description`
5. Create Pull Request

## Releases

Releases follow semantic versioning: `v1.0.0`

- Tag release: `git tag -a v1.0.0 -m "Release version 1.0.0"`
- Push tags: `git push origin --tags`
- DockerHub image: `yourusername/waste-frontend:v1.0.0`

## Docker Deployment

### Build image

docker build -t keithkibe/ecoflow-frontend:v0.1.0 .

### Run locally

docker run -p 8080:80 keithkibe/ecoflow-frontend:v0.1.0

### Open http://localhost:8080

### Push to Docker Hub

```
docker push keithkibe/ecoflow-frontend:v0.1.0
```

## Environment Variables

See `.env.example`. Key variables:

- `REACT_APP_API_BASE_URL` — Backend API base URL
- `REACT_APP_GOOGLE_MAPS_KEY` — Maps API key
- `REACT_APP_MPESA_CONSUMER_KEY` — M-Pesa key

## Color Scheme (Tailwind)

- **Primary Green:** `#10B981` (Actions, success)
- **Secondary Orange:** `#F97316` (Warnings, highlights)
- **Neutral Gray:** `#6B7280` (Text, borders)
- **Background:** `#FFFFFF` / `#F9FAFB`

All colors use Tailwind utility classes.

## Troubleshooting

**Port 3000 already in use:**

```bash
npm start -- --port 3001
```

**API connection errors:**

- Check `REACT_APP_API_BASE_URL` in `.env`
- Ensure backend is running
- Check browser console for CORS errors

**Build fails:**

```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```
