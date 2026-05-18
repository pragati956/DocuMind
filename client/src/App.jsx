import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; // Imported AuthProvider
import Signup from './Signup';
import Login from './Login';
import Home from './pages/Home';

function App() {
  return (
    <AuthProvider> {/* Wrapped entire router in AuthProvider */}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          {/* Removed the duplicate /home route */}
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
export default App;