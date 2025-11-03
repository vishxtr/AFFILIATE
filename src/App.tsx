import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { lazy, Suspense } from 'react';

// Lazy load pages for code splitting
const HomePage = lazy(() => import('@/pages/HomePage'));
const AboutPage = lazy(() => import('@/pages/AboutPage'));
const ContactPage = lazy(() => import('@/pages/ContactPage'));
const PrivacyPolicyPage = lazy(() => import('@/pages/PrivacyPolicyPage'));
const TermsOfServicePage = lazy(() => import('@/pages/TermsOfServicePage'));
const AdminLogin = lazy(() => import('@/pages/AdminLogin'));
const AdminDashboard = lazy(() => import('@/pages/AdminDashboard'));
const AdminDashboardOverview = lazy(() => import('@/pages/AdminDashboardOverview'));
const AdminSettingsPage = lazy(() => import('@/pages/AdminSettingsPage'));
const AdminQueriesPage = lazy(() => import('@/pages/AdminQueriesPage'));
const AdminProductsPage = lazy(() => import('@/pages/AdminProductsPage'));
const AdminAnalyticsPage = lazy(() => import('@/pages/AdminAnalyticsPage'));
const AdminSystemPage = lazy(() => import('@/pages/AdminSystemPage'));
const AdminActivityLogsPage = lazy(() => import('@/pages/AdminActivityLogsPage'));
const AdminPasswordChangePage = lazy(() => import('@/pages/AdminPasswordChangePage'));

// Loading component
function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
        <p className="text-slate-600 font-medium">Loading...</p>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/terms-of-service" element={<TermsOfServicePage />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboardOverview />} />
            <Route path="/admin/settings" element={<AdminSettingsPage />} />
            <Route path="/admin/queries" element={<AdminQueriesPage />} />
            <Route path="/admin/products" element={<AdminProductsPage />} />
            <Route path="/admin/analytics" element={<AdminAnalyticsPage />} />
            <Route path="/admin/system" element={<AdminSystemPage />} />
            <Route path="/admin/logs" element={<AdminActivityLogsPage />} />
            <Route path="/admin/change-password" element={<AdminPasswordChangePage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
