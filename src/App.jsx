import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
<<<<<<< HEAD
import { ListingProvider } from "./context/ListingContexts";
import { useAuth } from "./hooks/useAuth";
=======
import ProtectedRoute from "./components/auth/ProtectedRoute";
import RoleGuard from "./components/auth/RoleGuard";
>>>>>>> origin/main
import Navbar from "./components/common/Navbar";
import Sidebar from "./components/common/Sidebar";
import Footer from "./components/common/Footer";

import RegisterPage from "./pages/auth/RegisterPage";
import LoginPage from "./pages/auth/LoginPage";
import KYCPage from "./pages/auth/KYCPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import DashboardPage from "./pages/DashboardPage";

import ListingsPage from "./pages/listings/ListingsPage";
import MyListingsPage from "./pages/listings/MyListingsPage";
import CreateListingPage from "./pages/listings/CreateListingPage";
import EditListingPage from "./pages/listings/EditListingPage";
import ListingDetailPage from "./pages/listings/ListingDetailPage";
import RecyclerInventoryPage from "./pages/listings/RecyclerInventoryPage";

import OfferPage from "./pages/offers/OfferPage";
import CreateOfferPage from "./pages/offers/CreateOfferPage";
import OfferDetailPage from "./pages/offers/OfferDetailPage";
import TransactionPage from "./pages/offers/TransactionPage";
import TransactionDetailPage from "./pages/offers/TransactionDetailPage";
import PaymentPage from "./pages/offers/PaymentPage";

import PickupPage from "./pages/pickup/PickupPage";
import TrackingPage from "./pages/pickup/TrackingPage";

import AnalyticsPage from "./pages/analytics/AnalyticsPage";
import EnvironmentalImpactPage from "./pages/analytics/EnvironmentalImpactPage";

import NearbyPage from "./pages/nearby/NearbyPage";

export default function App() {
  return (

    <div className='page-wrapper'>
      <Navbar
        onMenuToggle={() => setSidebarOpen((v) => !v)}
        sidebarOpen={sidebarOpen}
        notificationCount={notificationCount}
      />
      {showSidebar && <Sidebar open={sidebarOpen} />}
      <main
        className={
          showSidebar
            ? sidebarOpen
              ? "ml-0 lg:ml-60"
              : "ml-0 lg:ml-18"
            : "ml-0"
        }
        style={{ transition: "margin-left 300ms ease" }}
      >
        <Suspense fallback={<PageLoader message='Loading…' />}>
          <Routes>
            {/* Public */}
            <Route path='/' element={<ListingsPage />} />
            <Route path='/login' element={<Placeholder title='Login' />} />
            <Route path='/register' element={<Placeholder title='Register' />} />

    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path='/register' element={<RegisterPage />} />   
          <Route path='/login' element={<LoginPage />} />


          <Route
            path='/kyc'
            element={
              <ProtectedRoute>
                <KYCPage />
              </ProtectedRoute>
            }
          />
          <Route
            path='/profile'
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path='/settings'
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path='/dashboard'
            element={
              <ProtectedRoute>
                <LayoutWrapper>
                  <DashboardPage />
                </LayoutWrapper>
              </ProtectedRoute>
            }
          />

          <Route
            path='/listings'
            element={
              <ProtectedRoute>
                <LayoutWrapper>
                  <ListingsPage />
                </LayoutWrapper>
              </ProtectedRoute>
            }
          />
          <Route
            path='/listings/new'
            element={
              <ProtectedRoute>
                <LayoutWrapper>
                  <CreateListingPage />
                </LayoutWrapper>
              </ProtectedRoute>
            }
          />
          <Route
            path='/listings/mine'
            element={
              <ProtectedRoute>
                <LayoutWrapper>
                  <MyListingsPage />
                </LayoutWrapper>
              </ProtectedRoute>
            }
          />
          <Route
            path='/listings/:id'
            element={
              <ProtectedRoute>
                <LayoutWrapper>
                  <ListingDetailPage />
                </LayoutWrapper>
              </ProtectedRoute>
            }
          />
          <Route
            path='/listings/:id/edit'
            element={
              <ProtectedRoute>
                <LayoutWrapper>
                  <EditListingPage />
                </LayoutWrapper>
              </ProtectedRoute>
            }
          />
          <Route
            path='/inventory'
            element={
              <ProtectedRoute>
                <LayoutWrapper>
                  <RecyclerInventoryPage />
                </LayoutWrapper>
              </ProtectedRoute>
            }
          />

          <Route
            path='/offers'
            element={
              <ProtectedRoute>
                <LayoutWrapper>
                  <OfferPage />
                </LayoutWrapper>
              </ProtectedRoute>
            }
          />
          <Route
            path='/offers/new'
            element={
              <ProtectedRoute>
                <LayoutWrapper>
                  <CreateOfferPage />
                </LayoutWrapper>
              </ProtectedRoute>
            }
          />
          <Route
            path='/offers/:id'
            element={
              <ProtectedRoute>
                <LayoutWrapper>
                  <OfferDetailPage />
                </LayoutWrapper>
              </ProtectedRoute>
            }
          />
          <Route
            path='/transactions'
            element={
              <ProtectedRoute>
                <LayoutWrapper>
                  <TransactionPage />
                </LayoutWrapper>
              </ProtectedRoute>
            }
          />
          <Route
            path='/transactions/:id'
            element={
              <ProtectedRoute>
                <LayoutWrapper>
                  <TransactionDetailPage />
                </LayoutWrapper>
              </ProtectedRoute>
            }
          />
          <Route
            path='/payments/:id'
            element={
              <ProtectedRoute>
                <LayoutWrapper>
                  <PaymentPage />
                </LayoutWrapper>
              </ProtectedRoute>
            }
          />

          <Route
            path='/pickups'
            element={
              <ProtectedRoute>
                <LayoutWrapper>
                  <PickupPage />
                </LayoutWrapper>
              </ProtectedRoute>
            }
          />
          <Route
            path='/pickups/:id/track'
            element={
              <ProtectedRoute>
                <LayoutWrapper>
                  <TrackingPage />
                </LayoutWrapper>
              </ProtectedRoute>
            }
          />

          <Route
            path='/analytics'
            element={
              <ProtectedRoute>
                <LayoutWrapper>
                  <AnalyticsPage />
                </LayoutWrapper>
              </ProtectedRoute>
            }
          />
          <Route
            path='/analytics/impact'
            element={
              <ProtectedRoute>
                <LayoutWrapper>
                  <EnvironmentalImpactPage />
                </LayoutWrapper>
              </ProtectedRoute>
            }
          />

          <Route
            path='/nearby'
            element={
              <ProtectedRoute>
                <LayoutWrapper>
                  <NearbyPage />
                </LayoutWrapper>
              </ProtectedRoute>
            }
          />

          <Route
            path='/admin'
            element={
              <ProtectedRoute>
                <RoleGuard roles={["admin"]}>
                  <LayoutWrapper>
                    <AdminDashboard />
                  </LayoutWrapper>
                </RoleGuard>
              </ProtectedRoute>
            }
          />

          <Route path='/' element={<Navigate to='/login' replace />} />
          <Route path='*' element={<Navigate to='/login' replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

function LayoutWrapper({ children }) {
  return (
    <div className='min-h-screen flex'>
      <Sidebar />
      <div className='flex-1 flex flex-col'>
        <Navbar />
        <main className='flex-1 p-6'>{children}</main>
        <Footer />
      </div>
    </div>
  );
}

<<<<<<< HEAD
function App() {
  return (
    <AuthProvider>
      <ListingProvider>
        <Router>
          <AppLayout />
        </Router>
      </ListingProvider>
    </AuthProvider>
  );
=======
function AdminDashboard() {
  return <h1 className='text-2xl font-bold'>Admin Dashboard</h1>;
>>>>>>> origin/main
}
