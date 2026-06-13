import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./hooks/useAuth";
import Navbar from "./components/common/Navbar";
import Sidebar from "./components/common/Sidebar";
import Footer from "./components/common/Footer";
import { PageLoader } from "./components/common/LoadingSpinner";
import OfferPage from "./pages/offers/OfferPage";
import OfferDetailPage from "./pages/offers/OfferDetailPage";
import TransactionPage from "./pages/offers/TransactionPage";
import TransactionDetailPage from "./pages/offers/TransactionDetailPage";
import PaymentPage from "./pages/offers/PaymentPage";
import { offerService } from "./services/offerService";

// ── Public routes — show footer, hide sidebar ──────────────────
const PUBLIC_PATHS = [
  "/",
  "/login",
  "/register",
  "/how-it-works",
  "/about",
  "/pricing",
  "/help",
  "/contact",
  "/privacy",
  "/terms",
];

// ── Inner layout (needs AuthContext) ──────────────────────────
function AppLayout() {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    if (!user) return;
    offerService.getAll().then((data) => {
      const pending = Array.isArray(data) ? data.filter((o) => o.status === "pending").length : 0;
      setNotificationCount(pending);
    }).catch(() => {});
  }, [user, location.pathname]);

  const isPublic = PUBLIC_PATHS.some(
    (p) => location.pathname === p || location.pathname.startsWith(p + "/"),
  );
  const showSidebar = !!user && !isPublic;
  const showFooter = !user || isPublic;

  if (loading) return <PageLoader message='Loading EcoFlow…' />;

  return (
    <div className='page-wrapper'>
      {/* Fixed top bar */}
      <Navbar
        onMenuToggle={() => setSidebarOpen((v) => !v)}
        sidebarOpen={sidebarOpen}
        notificationCount={notificationCount}
      />

      {/* Left sidebar — authenticated pages only */}
      {showSidebar && <Sidebar open={sidebarOpen} />}

      {/* Main content */}
      <main
        style={{
          marginLeft: showSidebar && sidebarOpen ? "240px" : "0",
          transition: "margin-left 300ms ease",
        }}
      >
        <Routes>
          {/* Public */}
          <Route path='/' element={<Placeholder title='Home' />} />
          <Route path='/login' element={<Placeholder title='Login' />} />
          <Route path='/register' element={<Placeholder title='Register' />} />

          {/* Member 1 — Auth & Profile */}
          <Route path='/profile' element={<Placeholder title='Profile' />} />
          <Route path='/settings' element={<Placeholder title='Settings' />} />

          {/* Member 2 — Listings */}
          <Route
            path='/listings'
            element={<Placeholder title='My Listings' />}
          />
          <Route
            path='/listings/new'
            element={<Placeholder title='New Listing' />}
          />
          <Route
            path='/browse'
            element={<Placeholder title='Browse Waste' />}
          />

          {/* Member 3 — Offers & Transactions */}
          <Route path='/offers' element={<OfferPage />} />
          <Route path='/offers/:id' element={<OfferDetailPage />} />
          <Route path='/transactions' element={<TransactionPage />} />
          <Route path='/transactions/:id' element={<TransactionDetailPage />} />
          <Route path='/payments' element={<PaymentPage />} />

          {/* Member 4 — Pickup & Analytics */}
          <Route
            path='/dashboard'
            element={<Placeholder title='Dashboard' />}
          />
          <Route path='/pickups' element={<Placeholder title='Pickups' />} />
          <Route
            path='/analytics'
            element={<Placeholder title='Analytics' />}
          />
          <Route
            path='/analytics/impact'
            element={<Placeholder title='My Impact' />}
          />
          <Route
            path='/inventory'
            element={<Placeholder title='Inventory' />}
          />

          {/* Admin */}
          <Route
            path='/admin'
            element={<Placeholder title='Admin Overview' />}
          />
          <Route path='/admin/users' element={<Placeholder title='Users' />} />
          <Route
            path='/admin/listings'
            element={<Placeholder title='All Listings' />}
          />

          {/* 404 */}
          <Route
            path='*'
            element={<Placeholder title='404 — Page not found' />}
          />
        </Routes>
      </main>

      {/* Footer — public pages only */}
      {showFooter && <Footer />}
    </div>
  );
}

// ── Temporary placeholder page ────────────────────────────────
function Placeholder({ title }) {
  return (
    <div className='page-content animate-fade-in'>
      <div
        className='card card-accent'
        style={{ maxWidth: 480, marginTop: 24 }}
      >
        <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: 8 }}>
          {title}
        </h1>
        <p style={{ color: "var(--color-neutral-500)", fontSize: "0.875rem" }}>
          This page is reserved. The assigned team member will implement it.
        </p>
      </div>
    </div>
  );
}

// ── Root: wrap with Router + AuthProvider ─────────────────────
export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppLayout />
      </AuthProvider>
    </Router>
  );
}
