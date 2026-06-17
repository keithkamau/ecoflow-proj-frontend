import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import RoleGuard from "./components/auth/RoleGuard";
import Navbar from "./components/common/Navbar";
import Sidebar from "./components/common/Sidebar";
import Footer from "./components/common/Footer";
import RegisterPage from "./pages/auth/RegisterPage";
import LoginPage from "./pages/auth/LoginPage";
import KYCPage from "./pages/auth/KYCPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import ListingsPage from "./pages/ListingsPage";
import OffersPage from "./pages/OffersPage";
import TransactionsPage from "./pages/TransactionsPage";
import PickupsPage from "./pages/PickupsPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import BrowsePage from "./pages/BrowsePage";
import NearbyPage from "./pages/NearbyPage";
import InventoryPage from "./pages/InventoryPage";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path='/register' element={<RegisterPage />} />
          <Route path='/login' element={<LoginPage />} />

          {/* Protected routes */}
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
                  <ListingsPage />
                </LayoutWrapper>
              </ProtectedRoute>
            }
          />
          <Route
            path='/offers'
            element={
              <ProtectedRoute>
                <LayoutWrapper>
                  <OffersPage />
                </LayoutWrapper>
              </ProtectedRoute>
            }
          />
          <Route
            path='/transactions'
            element={
              <ProtectedRoute>
                <LayoutWrapper>
                  <TransactionsPage />
                </LayoutWrapper>
              </ProtectedRoute>
            }
          />
          <Route
            path='/pickups'
            element={
              <ProtectedRoute>
                <LayoutWrapper>
                  <PickupsPage />
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
                  <AnalyticsPage />
                </LayoutWrapper>
              </ProtectedRoute>
            }
          />
          <Route
            path='/browse'
            element={
              <ProtectedRoute>
                <LayoutWrapper>
                  <BrowsePage />
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
            path='/inventory'
            element={
              <ProtectedRoute>
                <LayoutWrapper>
                  <InventoryPage />
                </LayoutWrapper>
              </ProtectedRoute>
            }
          />

          {/* Admin routes */}
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

          {/* Default redirect to login */}
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

function DashboardPage() {
  return <h1 className='text-2xl font-bold'>Dashboard</h1>;
}

function AdminDashboard() {
  return <h1 className='text-2xl font-bold'>Admin Dashboard</h1>;
}
