import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import RoleGuard from "./components/auth/RoleGuard";
import Navbar from "./components/common/Navbar";
import Sidebar from "./components/common/Sidebar";
import Footer from "./components/common/Footer";
import RegisterPage from "./pages/auth/RegisterPage";
import LoginPage from "./pages/auth/LoginPage";
import OTPPage from "./pages/auth/OTPPage";
import KYCPage from "./pages/auth/KYCPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path='/register' element={<RegisterPage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/otp' element={<OTPPage />} />

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

          {/* Protected routes with layout */}
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

          {/* Admin routes with role guard */}
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

          {/* Default redirect */}
          <Route path='/' element={<Navigate to='/dashboard' replace />} />
          <Route path='*' element={<Navigate to='/dashboard' replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

// Layout wrapper for routes that need Navbar + Sidebar + Footer
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

// Placeholder — other members will replace these
function DashboardPage() {
  return <h1 className='text-2xl font-bold'>Dashboard</h1>;
}

function AdminDashboard() {
  return <h1 className='text-2xl font-bold'>Admin Dashboard</h1>;
}
