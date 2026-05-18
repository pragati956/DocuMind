import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; // Imported AuthProvider
import Signup from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <AuthProvider> {/* Wrapped entire router in AuthProvider */}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          {/* Removed the duplicate /home route */}
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
export default App;