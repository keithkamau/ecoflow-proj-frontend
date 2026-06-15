# Waste Management & Recycling Hub — Frontend

React + Tailwind CSS web application for waste management platform.

## Features

- User registration & KYC verification
- Browse & manage waste listings
- Offer negotiation
- Payment integration
- Pickup scheduling & tracking
- Environmental impact dashboard
- Real-time messaging
- Responsive mobile-first design

## Tech Stack

- **Framework:** React 18
- **Styling:** Tailwind CSS
- **HTTP Client:** Axios
- **State Management:** React Context API
- **Testing:** Jest & React Testing Library
- **Build:** Vite
- **Maps:** Google Maps API
- **Payments:** M-Pesa

## Prerequisites

- Node.js 16+
- npm or yarn
- Docker

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

App will open at `http://localhost:3000`

### Docker Setup

```bash
docker-compose up -d
```

## Project Structure

src/
├── components/      # Reusable components
├── pages/          # Page components
├── hooks/          # Custom React hooks
├── services/       # API client functions
├── context/        # React Context
├── utils/          # Helper functions
├── styles/         # CSS & Tailwind config
└── tests/          # Jest tests

## Responsive Design

- **Mobile:** 320px+ (primary focus)
- **Tablet:** 768px+
- **Desktop:** 1024px+

## Testing

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run specific test
npm test auth.test.jsx

# Watch mode
npm test -- --watch
```

**Current Coverage:** 30%+ (Target: 70%+)

## Building for Production

```bash
npm run build
```

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

## Deployment

### Production Build

```bash
npm run build
```

### Docker Deployment

```bash
# Build image
docker build -t yourusername/waste-frontend:v1.0.0 .

# Run container
docker run -p 80:80 yourusername/waste-frontend:v1.0.0

# Push to DockerHub
docker push yourusername/waste-frontend:v1.0.0
```

### Deploy to AWS/Vercel

**Vercel:**

```bash
npm i -g vercel
vercel deploy --prod
```

**AWS S3 + CloudFront:**

```bash
aws s3 sync build/ s3://your-bucket/
aws cloudfront create-invalidation --distribution-id <ID> --paths "/*"
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

## Support & Issues

Open issues: [GitHub Issues](https://github.com/yourusername/waste-management-frontend/issues)

## License

MIT License