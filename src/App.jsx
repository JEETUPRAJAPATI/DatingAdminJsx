import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Layout } from './components/layout/Layout';
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { ForgotPassword } from './pages/auth/ForgotPassword';
import { Dashboard } from './pages/Dashboard';
import { Users } from './pages/Users';
import { Admins } from './pages/Admins';
import { Chats } from './pages/Chats';
import { Subscriptions } from './pages/Subscriptions';
import { Payments } from './pages/Payments';
import { Questions } from './pages/Questions';
import { Notifications } from './pages/Notifications';
import { Reports } from './pages/Reports';
import { BannedUsers } from './pages/BannedUsers';
import { Interests } from './pages/Interests';
import { IntroScreens } from './pages/IntroScreens';
import { Settings } from './pages/Settings';
// import { Verification } from './pages/Verification';
import { ActivityLogs } from './pages/ActivityLogs';
import { EmailTemplates } from './pages/EmailTemplates';
import { Support } from './pages/Support';
import { Profile } from './pages/Profile';
import { useAuthStore } from './store/useAuthStore';
import { ResetPassword } from './pages/auth/ResetPassword';
import { LandingPage } from './pages/LandingPage';
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#333',
            color: '#fff',
          },
          success: {
            style: {
              background: '#059669',
            },
          },
          error: {
            style: {
              background: '#DC2626',
            },
          },
        }}
      />
      <Routes>
        {/* Auth Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/" element={<ResetPassword />} />


        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="admins" element={<Admins />} />
          <Route path="chats" element={<Chats />} />
          <Route path="subscriptions" element={<Subscriptions />} />
          <Route path="payments" element={<Payments />} />
          <Route path="questions" element={<Questions />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="reported" element={<Reports />} />
          <Route path="banned" element={<BannedUsers />} />
          <Route path="interests" element={<Interests />} />
          <Route path="intro-screens" element={<IntroScreens />} />
          <Route path="settings" element={<Settings />} />
          {/* <Route path="verifications" element={<Verification />} /> */}
          <Route path="logs" element={<ActivityLogs />} />
          <Route path="email-templates" element={<EmailTemplates />} />
          <Route path="support" element={<Support />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}


export default App;