import { Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { DashboardLayout } from './components/dashboard/DashboardLayout';
import { DashboardHome } from './pages/dashboard/DashboardHome';
import { InboxPage } from './pages/dashboard/InboxPage';
import { IntegrationsPage } from './pages/dashboard/settings/IntegrationsPage';
import { FacebookCallbackPage } from './pages/dashboard/settings/FacebookCallbackPage';
import {
    AboutPage,
    BlogPage,
    CareersPage,
    ContactPage,
    LegalPage,
    PrivacyPage,
    TermsPage,
    SecurityPage,
} from './pages/static';

function App() {
    return (
        <Routes>
            {/* Main Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Dashboard Routes */}
            <Route path="/dashboard" element={<DashboardLayout />}>
                <Route index element={<DashboardHome />} />
                <Route path="chat" element={<InboxPage />} />
                <Route path="settings" element={<IntegrationsPage />} />
                <Route path="settings/integrations/facebook/callback" element={<FacebookCallbackPage />} />
                {/* Fallback for other dashboard routes for now */}
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Route>

            {/* Static Pages */}
            <Route path="/about" element={<AboutPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/careers" element={<CareersPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/legal" element={<LegalPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/security" element={<SecurityPage />} />

            {/* 404 */}
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
}

export default App;
