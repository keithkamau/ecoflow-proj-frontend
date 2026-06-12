import { useState } from "react";
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
import "./styles/globals.css";

const PUBLIC_ROUTES = [
  "/",
  "/login",
  "/register",
  "/how-it-works",
  "/about",
  "/pricing",
  "/mission",
  "/blog",
  "/help",
  "/contact",
  "/privacy",
  "/terms",
  "/cookies",
];

// ─── Inner layout (consumes AuthContext) ──────────────────────
const AppLayout = () => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const isPublicRoute = PUBLIC_ROUTES.some(
    (r) => location.pathname === r || location.pathname.startsWith(r + "/"),
  );

  const showSidebar = !!user && !isPublicRoute;
  const showFooter = !user || isPublicRoute;

  if (loading) return <PageLoader message='Loading EcoFlow…' />;

  return (
    <div className='page-wrapper'>
      {/* ── Fixed top navbar ─────────────────────── */}
      <Navbar
        onMenuToggle={() => setSidebarOpen((v) => !v)}
        sidebarOpen={sidebarOpen}
      />

      {/* ── Sidebar (authenticated pages only) ───── */}
      {showSidebar && <Sidebar open={sidebarOpen} />}

      {/* ── Main content area ─────────────────────── */}
      <main
        className={`
          min-h-[calc(100vh-64px)]
          transition-all duration-300
          ${showSidebar && sidebarOpen ? "md:ml-60" : ""}
        `}
      >
        {/* Page-level Routes go here — each team member adds their own */}
        <Routes>
          {/* ── Public pages ── */}
          <Route path='/' element={<PlaceholderPage title='Home' />} />
          <Route path='/login' element={<PlaceholderPage title='Login' />} />
          <Route
            path='/register'
            element={<PlaceholderPage title='Register' />}
          />

          {/* ── Member 1: Auth & Profile ── */}
          <Route
            path='/profile'
            element={<PlaceholderPage title='Profile' />}
          />
          <Route
            path='/settings'
            element={<PlaceholderPage title='Settings' />}
          />

          {/* ── Member 2: Listings ── */}
          <Route
            path='/listings'
            element={<PlaceholderPage title='My Listings' />}
          />
          <Route
            path='/listings/new'
            element={<PlaceholderPage title='New Listing' />}
          />
          <Route
            path='/browse'
            element={<PlaceholderPage title='Browse Waste' />}
          />

          {/* ── Member 3: Offers & Transactions ── */}
          <Route path='/offers' element={<PlaceholderPage title='Offers' />} />
          <Route
            path='/transactions'
            element={<PlaceholderPage title='Transactions' />}
          />

          {/* ── Member 4: Pickup & Analytics ── */}
          <Route
            path='/pickups'
            element={<PlaceholderPage title='Pickups' />}
          />
          <Route
            path='/analytics'
            element={<PlaceholderPage title='Analytics' />}
          />
          <Route
            path='/analytics/impact'
            element={<PlaceholderPage title='My Impact' />}
          />
          <Route
            path='/dashboard'
            element={<PlaceholderPage title='Dashboard' />}
          />

          {/* ── Admin ── */}
          <Route
            path='/admin'
            element={<PlaceholderPage title='Admin Overview' />}
          />
          <Route
            path='/admin/users'
            element={<PlaceholderPage title='Manage Users' />}
          />

          {/* 404 */}
          <Route
            path='*'
            element={<PlaceholderPage title='404 — Page not found' />}
          />
        </Routes>
      </main>

      {/* ── Footer (public/auth pages only) ──────── */}
      {showFooter && <Footer />}
    </div>
  );
};

// ─── Temporary placeholder — replaced by each member's page ───
const PlaceholderPage = ({ title }) => (
  <div className='page-content animate-fade-in'>
    <div className='card-accent mt-6 max-w-lg'>
      <h1 className='text-h3 mb-2'>{title}</h1>
      <p className='text-body text-neutral-500'>
        This page is reserved. The assigned team member will implement it.
      </p>
    </div>
  </div>
);

const App = () => (
  <Router>
    <AuthProvider>
      <AppLayout />
    </AuthProvider>
  </Router>
);

export default App;
