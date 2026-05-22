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

          </Route>

        </Routes>

      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;