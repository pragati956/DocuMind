import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
 NotificationProvider
}
from "./context/NotificationContext";

import { AuthProvider } from "./context/AuthContext";
import Notifications from "./pages/dashboard/Notifications";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import OAuthCallback from "./pages/OAuthCallback";

import Dashboard from "./pages/dashboard/Dashboard";
import Upload from "./pages/dashboard/Upload";
import Documents from "./pages/dashboard/Documents";
import Chat from "./pages/dashboard/Chat";
import Settings from "./pages/dashboard/Settings";

import ProtectedRoute from "./routes/ProtectedRoute";

import DashboardLayout from "./layouts/DashboardLayout";
import SmartSearch from "./pages/dashboard/SmartSearch";
import AiSummariesPage from "./pages/dashboard/AiSummariesPage";
import Collections from "./pages/dashboard/Collections";
import Analytics from "./pages/dashboard/Analytics";

import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

function App() {
  return (
    <AuthProvider>
       <NotificationProvider>
      <BrowserRouter>

        <Routes>

          {/* PUBLIC ROUTES */}
          <Route path="/" element={<Home />} />

          <Route path="/login" element={<Login />} />

          <Route path="/register" element={<Register />} />

          <Route path="/forgot-password" element={<ForgotPassword />} />
          
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          <Route
            path="/oauth-callback"
            element={<OAuthCallback />}
          />
      

          {/* PROTECTED DASHBOARD ROUTES */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >

            {/* DASHBOARD HOME */}
            <Route index element={<Dashboard />} />

            {/* DOCUMENTS */}
            <Route path="documents" element={<Documents />} />

            {/* UPLOAD */}
            <Route path="upload" element={<Upload />} />

            {/* CHAT */}
            <Route path="chat" element={<Chat />} />

            {/* SETTINGS */}
            <Route path="settings" element={<Settings />} />
                <Route
  path="notifications"
  element={<Notifications />}
/>
            <Route path="search" element={<SmartSearch />} />

<Route path="summaries" element={<AiSummariesPage />} />

<Route path="collections" element={<Collections />} />

<Route path="analytics" element={<Analytics />} />

          </Route>

        </Routes>

      </BrowserRouter>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;