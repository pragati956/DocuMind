import { useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function OAuthCallback() {
  const { login } = useContext(AuthContext);
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    const userString = params.get("user");

    if (token && userString) {
      try {
        const user = JSON.parse(decodeURIComponent(userString));
        login(user, token);
        toast.success("Login successful");
        // Force a full reload so the app picks up the saved token and loads the dashboard immediately.
        window.location.replace("/dashboard");
      } catch (err) {
        console.error("OAuthCallback parse error", err);
        toast.error("Authentication failed");
        window.location.replace("/login");
      }
    } else {
      toast.error("Authentication failed");
      window.location.replace("/login");
    }
  }, [location, login]);

  return (
    <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-blue-500/20 border-t-blue-500 animate-spin" />
    </div>
  );
}