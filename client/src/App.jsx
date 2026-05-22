import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";

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

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>

        <Routes>

          {/* PUBLIC ROUTES */}
          <Route path="/" element={<Home />} />

          <Route path="/login" element={<Login />} />

          <Route path="/register" element={<Register />} />

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
            <Route path="search" element={<SmartSearch />} />

<Route path="summaries" element={<AiSummariesPage />} />

<Route path="collections" element={<Collections />} />

<Route path="analytics" element={<Analytics />} />

          </Route>

        </Routes>

      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;