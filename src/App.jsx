import { useState, lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ListingProvider } from "./context/ListingContexts";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import RoleGuard from "./components/auth/RoleGuard";
import Navbar from "./components/common/Navbar";
import Sidebar from "./components/common/Sidebar";
import Footer from "./components/common/Footer";
import LoadingSpinner from "./components/common/LoadingSpinner";

const RegisterPage = lazy(() => import("./pages/auth/RegisterPage"));
const LoginPage = lazy(() => import("./pages/auth/LoginPage"));
const KYCPage = lazy(() => import("./pages/auth/KYCPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));

const ListingsPage = lazy(() => import("./pages/listings/ListingsPage"));
const MyListingsPage = lazy(() => import("./pages/listings/MyListingsPage"));
const CreateListingPage = lazy(() => import("./pages/listings/CreateListingPage"));
const EditListingPage = lazy(() => import("./pages/listings/EditListingPage"));
const ListingDetailPage = lazy(() => import("./pages/listings/ListingDetailPage"));
const RecyclerInventoryPage = lazy(() => import("./pages/listings/RecyclerInventoryPage"));

const OfferPage = lazy(() => import("./pages/offers/OfferPage"));
const CreateOfferPage = lazy(() => import("./pages/offers/CreateOfferPage"));
const OfferDetailPage = lazy(() => import("./pages/offers/OfferDetailPage"));
const TransactionPage = lazy(() => import("./pages/offers/TransactionPage"));
const TransactionDetailPage = lazy(() => import("./pages/offers/TransactionDetailPage"));
const PaymentPage = lazy(() => import("./pages/offers/PaymentPage"));

const PickupPage = lazy(() => import("./pages/pickup/PickupPage"));
const TrackingPage = lazy(() => import("./pages/pickup/TrackingPage"));

const AnalyticsPage = lazy(() => import("./pages/analytics/AnalyticsPage"));
const EnvironmentalImpactPage = lazy(() => import("./pages/analytics/EnvironmentalImpactPage"));

const NearbyPage = lazy(() => import("./pages/nearby/NearbyPage"));

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <LoadingSpinner variant="eco" size="xl" />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ListingProvider>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path='/register' element={<RegisterPage />} />
              <Route path='/login' element={<LoginPage />} />
              <Route
                path='/kyc'
                element={<ProtectedRoute><KYCPage /></ProtectedRoute>}
              />
              <Route
                path='/profile'
                element={<ProtectedRoute><ProfilePage /></ProtectedRoute>}
              />
              <Route
                path='/settings'
                element={<ProtectedRoute><SettingsPage /></ProtectedRoute>}
              />
              <Route
                path='/dashboard'
                element={<ProtectedRoute><LayoutWrapper><DashboardPage /></LayoutWrapper></ProtectedRoute>}
              />
              <Route
                path='/listings'
                element={<ProtectedRoute><LayoutWrapper><ListingsPage /></LayoutWrapper></ProtectedRoute>}
              />
              <Route
                path='/listings/new'
                element={<ProtectedRoute><LayoutWrapper><CreateListingPage /></LayoutWrapper></ProtectedRoute>}
              />
              <Route
                path='/listings/mine'
                element={<ProtectedRoute><LayoutWrapper><MyListingsPage /></LayoutWrapper></ProtectedRoute>}
              />
              <Route
                path='/listings/:id'
                element={<ProtectedRoute><LayoutWrapper><ListingDetailPage /></LayoutWrapper></ProtectedRoute>}
              />
              <Route
                path='/listings/:id/edit'
                element={<ProtectedRoute><LayoutWrapper><EditListingPage /></LayoutWrapper></ProtectedRoute>}
              />
              <Route
                path='/inventory'
                element={<ProtectedRoute><LayoutWrapper><RecyclerInventoryPage /></LayoutWrapper></ProtectedRoute>}
              />
              <Route
                path='/offers'
                element={<ProtectedRoute><LayoutWrapper><OfferPage /></LayoutWrapper></ProtectedRoute>}
              />
              <Route
                path='/offers/new'
                element={<ProtectedRoute><LayoutWrapper><CreateOfferPage /></LayoutWrapper></ProtectedRoute>}
              />
              <Route
                path='/offers/:id'
                element={<ProtectedRoute><LayoutWrapper><OfferDetailPage /></LayoutWrapper></ProtectedRoute>}
              />
              <Route
                path='/transactions'
                element={<ProtectedRoute><LayoutWrapper><TransactionPage /></LayoutWrapper></ProtectedRoute>}
              />
              <Route
                path='/transactions/:id'
                element={<ProtectedRoute><LayoutWrapper><TransactionDetailPage /></LayoutWrapper></ProtectedRoute>}
              />
              <Route
                path='/payments'
                element={<ProtectedRoute><LayoutWrapper><PaymentPage /></LayoutWrapper></ProtectedRoute>}
              />
              <Route
                path='/pickups'
                element={<ProtectedRoute><LayoutWrapper><PickupPage /></LayoutWrapper></ProtectedRoute>}
              />
              <Route
                path='/pickups/:id/track'
                element={<ProtectedRoute><LayoutWrapper><TrackingPage /></LayoutWrapper></ProtectedRoute>}
              />
              <Route
                path='/analytics'
                element={<ProtectedRoute><LayoutWrapper><AnalyticsPage /></LayoutWrapper></ProtectedRoute>}
              />
              <Route
                path='/analytics/impact'
                element={<ProtectedRoute><LayoutWrapper><EnvironmentalImpactPage /></LayoutWrapper></ProtectedRoute>}
              />
              <Route
                path='/nearby'
                element={<ProtectedRoute><LayoutWrapper><NearbyPage /></LayoutWrapper></ProtectedRoute>}
              />
              <Route
                path='/admin'
                element={
                  <ProtectedRoute>
                    <RoleGuard roles={["admin"]}>
                      <LayoutWrapper><AdminDashboard /></LayoutWrapper>
                    </RoleGuard>
                  </ProtectedRoute>
                }
              />
              <Route
                path='/browse'
                element={<ProtectedRoute><LayoutWrapper><ListingsPage /></LayoutWrapper></ProtectedRoute>}
              />
              <Route path='/' element={<Navigate to='/login' />} />
              <Route path='*' element={<Navigate to='/login' />} />
            </Routes>
          </Suspense>
        </ListingProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

function AdminDashboard() {
  return <h1 className='text-2xl font-bold'>Admin Dashboard</h1>;
}

function LayoutWrapper({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className='min-h-screen flex'>
      <Sidebar open={sidebarOpen} />
      <div className='flex-1 flex flex-col'>
        <Navbar
          onMenuToggle={() => setSidebarOpen(v => !v)}
          sidebarOpen={sidebarOpen}
        />
        <main className='flex-1 p-6'>{children}</main>
        <Footer />
      </div>
    </div>
  );
}
