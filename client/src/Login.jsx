import { useState, useContext } from 'react'; // Added useContext import
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiChrome, FiGithub } from 'react-icons/fi';
import { AuthContext } from './context/AuthContext'; // Imported AuthContext

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { setUser } = useContext(AuthContext); // Destructured setUser from context

    console.log("✅ Login component rendered");

    const handleGoogleLogin = () => {
      console.log("🔵 Google button clicked!");
      window.location.href = "http://localhost:5000/api/auth/google";
    };

    const handleGithubLogin = () => {
      console.log("🟣 GitHub button clicked!");
      window.location.href = "http://localhost:5000/api/auth/github";
    };

    const handleSubmit = async () => {
    try {
      setLoading(true);

      const data = await loginUser({
        email,
        password,
      });

      // BIG FIX: We must pass data.user (the full object from DB), not just {email: email}
      login(data.user, data.token);

      setLoading(false);
      setDone(true);
      toast.success("Login successful");

      setTimeout(() => {
        navigate("/dashboard"); 
      }, 1000);

    } catch (error) {
      setLoading(false);
      console.log(error);
      toast.error("Invalid credentials");
    }
  };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required /><br/><br/>
                <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required /><br/><br/>
                <button type="submit">Login</button>
            </form>
            
            {/* ── OAuth Buttons ── */}
            <div style={{ marginTop: '20px' }}>
              <button type="button" onClick={handleGoogleLogin}>
                Google
              </button>
              <button type="button" onClick={handleGithubLogin}>
                GitHub
              </button>
            </div>
            
            <p>Don't have an account?</p>
            <Link to="/register">Sign Up</Link>
        </div>
    );
}

export default Login;