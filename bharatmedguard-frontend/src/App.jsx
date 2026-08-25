import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';

// Layouts
import DashboardLayout from './layouts/DashboardLayout';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ClaimsPipelinePage from './pages/ClaimsPipelinePage';
import IdentityPipelinePage from './pages/IdentityPipelinePage';
import DocumentsPipelinePage from './pages/DocumentsPipelinePage';
import ClinicalPipelinePage from './pages/ClinicalPipelinePage';
import IsolationForestPage from './pages/IsolationForestPage';
import InvestigationCenterPage from './pages/InvestigationCenterPage';
import SecurityCenterPage from './pages/SecurityCenterPage';
import SecurityAlertsPage from './pages/SecurityAlertsPage';
import AuditLogsPage from './pages/AuditLogsPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';

export function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Pages */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />

            {/* Authenticated SOC Dashboard Routes */}
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              
              {/* Four Dedicated Anomaly Pipelines */}
              <Route path="/pipelines/claims" element={<ClaimsPipelinePage />} />
              <Route path="/pipelines/identity" element={<IdentityPipelinePage />} />
              <Route path="/pipelines/documents" element={<DocumentsPipelinePage />} />
              <Route path="/pipelines/clinical" element={<ClinicalPipelinePage />} />

              {/* AI Anomaly Detection Engine */}
              <Route path="/ai/isolation-forest" element={<IsolationForestPage />} />

              {/* Cyber Defence & Security */}
              <Route path="/security/network" element={<SecurityCenterPage />} />
              <Route path="/security/alerts" element={<SecurityAlertsPage />} />
              <Route path="/audit-logs" element={<AuditLogsPage />} />

              {/* Management */}
              <Route path="/investigations" element={<InvestigationCenterPage />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
