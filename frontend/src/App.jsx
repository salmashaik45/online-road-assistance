import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import UserDashboard from './pages/UserDashboard';
import RequestServicePage from './pages/RequestServicePage';
import MyRequestsPage from './pages/MyRequestsPage';
import VehiclesPage from './pages/VehiclesPage';
import ProfilePage from './pages/ProfilePage';
import ProvidersListPage from './pages/ProvidersListPage';
import ProviderDashboard from './pages/ProviderDashboard';
import ProviderProfilePage from './pages/ProviderProfilePage';
import ProviderHistoryPage from './pages/ProviderHistoryPage';
import ProviderEarningsPage from './pages/ProviderEarningsPage';
import ReviewPage from './pages/ReviewPage';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/providers" element={<ProvidersListPage />} />

      {/* User Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute role="user">
            <UserDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/request-service"
        element={
          <ProtectedRoute role="user">
            <RequestServicePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-requests"
        element={
          <ProtectedRoute role="user">
            <MyRequestsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/vehicles"
        element={
          <ProtectedRoute role="user">
            <VehiclesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/review/:requestId"
        element={
          <ProtectedRoute role="user">
            <ReviewPage />
          </ProtectedRoute>
        }
      />

      {/* Provider Routes */}
      <Route
        path="/provider-dashboard"
        element={
          <ProtectedRoute role="provider">
            <ProviderDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/provider-profile"
        element={
          <ProtectedRoute role="provider">
            <ProviderProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/provider-history"
        element={
          <ProtectedRoute role="provider">
            <ProviderHistoryPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/provider-earnings"
        element={
          <ProtectedRoute role="provider">
            <ProviderEarningsPage />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-center" />
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;