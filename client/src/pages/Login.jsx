
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

// import { loginUser } from "../services/authService";
// export default function Login() {
//     return (
//         <div className="min-h-screen bg-[#0B0F19]">
//             {/* Login page */}
//         </div>
//     );
// }
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight,
  FiCpu, FiGithub, FiChrome,
} from "react-icons/fi";

/* ─── Floating Orb ─── */
function Orb({ style, animate, transition }) {
  return (
    <motion.div
      animate={animate}
      transition={transition}
      className="absolute rounded-full pointer-events-none"
      style={style}
    />
  );
}

/* ─── Particle ─── */
function Particle({ x, y, delay }) {
  return (
    <motion.div
      className="absolute w-1 h-1 rounded-full bg-blue-400/40 pointer-events-none"
      style={{ left: `${x}%`, top: `${y}%` }}
      animate={{ y: [0, -40, 0], opacity: [0, 0.6, 0], scale: [0.5, 1.2, 0.5] }}
      transition={{ duration: 4 + Math.random() * 3, repeat: Infinity, delay, ease: "easeInOut" }}
    />
  );
}

/* ─── Input Field ─── */
function InputField({ icon, label, type, value, onChange, placeholder, rightEl }) {
  const [focused, setFocused] = useState(false);

  return (
    <div>
      <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
        {label}
      </label>
      <div className="relative">
        {/* left icon */}
        <div className={`absolute left-4 top-1/2 -translate-y-1/2 text-sm transition-colors duration-300 ${focused ? "text-blue-400" : "text-gray-600"}`}>
          {icon}
        </div>

        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="w-full pl-11 pr-12 py-3.5 rounded-xl bg-white/[0.04] border text-white text-sm placeholder-gray-600 outline-none transition-all duration-300"
          style={{
            borderColor: focused ? "rgba(59,130,246,0.5)" : "rgba(31,41,55,1)",
            boxShadow: focused ? "0 0 0 3px rgba(59,130,246,0.08), 0 0 20px rgba(59,130,246,0.12)" : "none",
            background: focused ? "rgba(59,130,246,0.04)" : "rgba(255,255,255,0.03)",
          }}
        />

        {/* right element */}
        {rightEl && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            {rightEl}
          </div>
        )}

        {/* focus glow bar */}
        <motion.div
          animate={{ scaleX: focused ? 1 : 0, opacity: focused ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="absolute bottom-0 left-4 right-4 h-px rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 origin-left"
        />
      </div>
    </div>
  );
}

/* ─── Main Login Component ─── */
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const particles = Array.from({ length: 14 }, (_, i) => ({
    x: Math.random() * 100, y: Math.random() * 100, delay: i * 0.35,
  }));

  const handleSubmit = () => {
    if (loading || done) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setDone(true); }, 2200);
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0B0F19] px-4 py-12"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');`}</style>

      {/* ── Background ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <Orb
          style={{ top: "-10%", left: "10%", width: 480, height: 480, background: "radial-gradient(circle, rgba(59,130,246,0.18) 0%, transparent 70%)", filter: "blur(60px)" }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 9, repeat: Infinity }}
        />
        <Orb
          style={{ bottom: "-5%", right: "5%", width: 420, height: 420, background: "radial-gradient(circle, rgba(139,92,246,0.18) 0%, transparent 70%)", filter: "blur(60px)" }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.9, 0.5] }}
          transition={{ duration: 11, repeat: Infinity, delay: 2 }}
        />
        <Orb
          style={{ top: "40%", right: "25%", width: 280, height: 280, background: "radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 70%)", filter: "blur(60px)" }}
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 7, repeat: Infinity, delay: 4 }}
        />

        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: "linear-gradient(rgba(100,200,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(100,200,255,1) 1px,transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />

        {/* Particles */}
        {particles.map((p, i) => <Particle key={i} {...p} />)}
      </div>

      {/* ── Card ── */}
      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Top glow */}
        <div className="absolute -top-px left-1/2 -translate-x-1/2 w-48 h-px bg-gradient-to-r from-transparent via-blue-400/60 to-transparent" />

        <div
          className="rounded-3xl border border-[#1F2937] p-8 relative overflow-hidden"
          style={{ background: "rgba(17,24,39,0.85)", backdropFilter: "blur(24px)" }}
        >
          {/* Card inner glow */}
          <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-blue-500/[0.06] to-transparent pointer-events-none rounded-t-3xl" />

          {/* ── Logo ── */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="flex items-center justify-center gap-2.5 mb-8"
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-[0_0_24px_rgba(59,130,246,0.5)]"
            >
              <FiCpu className="text-white text-lg" />
            </motion.div>
            <span className="text-white text-2xl font-semibold tracking-tight">DocuMind</span>
          </motion.div>

          {/* ── Heading ── */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22 }}
            className="text-center mb-8"
          >
            <h1 className="text-white text-2xl font-bold tracking-tight mb-1.5">Welcome back</h1>
            <p className="text-gray-500 text-sm">Sign in to your DocuMind workspace</p>
          </motion.div>

          {/* ── OAuth Buttons ── */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28 }}
            className="grid grid-cols-2 gap-3 mb-6"
          >
            {[
              { icon: <FiChrome />, label: "Google" },
              { icon: <FiGithub />, label: "GitHub" },
            ].map(({ icon, label }, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.03, borderColor: "rgba(255,255,255,0.15)", backgroundColor: "rgba(255,255,255,0.06)" }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center gap-2.5 py-3 rounded-xl border border-[#1F2937] bg-white/[0.03] text-gray-300 text-sm font-medium transition-colors duration-200"
              >
                <span className="text-base">{icon}</span>
                {label}
              </motion.button>
            ))}
          </motion.div>

          {/* ── Divider ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.33 }}
            className="flex items-center gap-3 mb-6"
          >
            <div className="flex-1 h-px bg-[#1F2937]" />
            <span className="text-gray-600 text-xs font-medium">or continue with email</span>
            <div className="flex-1 h-px bg-[#1F2937]" />
          </motion.div>

          {/* ── Form ── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.38 }}
            className="space-y-4"
          >
            <InputField
              icon={<FiMail />}
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
            />
            <InputField
              icon={<FiLock />}
              label="Password"
              type={showPass ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••"
              rightEl={
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="text-gray-600 hover:text-gray-300 transition-colors duration-200 text-base"
                >
                  {showPass ? <FiEyeOff /> : <FiEye />}
                </button>
              }
            />
          </motion.div>

          {/* ── Remember + Forgot ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.44 }}
            className="flex items-center justify-between mt-4 mb-6"
          >
            <label className="flex items-center gap-2.5 cursor-pointer group">
              <div
                onClick={() => setRemember(!remember)}
                className={`w-4.5 h-4.5 w-5 h-5 rounded-md border flex items-center justify-center transition-all duration-200 ${remember ? "bg-blue-500 border-blue-500" : "border-[#374151] bg-white/[0.03] group-hover:border-blue-500/50"}`}
              >
                <AnimatePresence>
                  {remember && (
                    <motion.svg
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      viewBox="0 0 10 8" className="w-2.5 h-2.5" fill="none"
                    >
                      <path d="M1 4l2.5 2.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </motion.svg>
                  )}
                </AnimatePresence>
              </div>
              <span className="text-gray-400 text-xs font-medium select-none">Remember me</span>
            </label>
            <motion.a
              href="#"
              whileHover={{ color: "#93c5fd" }}
              className="text-blue-400 text-xs font-medium transition-colors duration-200 hover:underline underline-offset-2"
            >
              Forgot password?
            </motion.a>
          </motion.div>

          {/* ── Submit Button ── */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <motion.button
              whileHover={!loading && !done ? { scale: 1.02, boxShadow: "0 0 30px rgba(59,130,246,0.45)" } : {}}
              whileTap={!loading && !done ? { scale: 0.98 } : {}}
              onClick={handleSubmit}
              disabled={loading}
              className={`w-full py-3.5 rounded-xl font-semibold text-sm text-white flex items-center justify-center gap-2 transition-all duration-300 relative overflow-hidden ${
                done
                  ? "bg-gradient-to-r from-emerald-500 to-teal-500 shadow-[0_0_25px_rgba(16,185,129,0.35)]"
                  : "bg-gradient-to-r from-blue-500 to-indigo-500 shadow-[0_0_20px_rgba(59,130,246,0.3)]"
              }`}
            >
              {/* Shimmer */}
              {!loading && !done && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12"
                  animate={{ x: ["-100%", "200%"] }}
                  transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1.5 }}
                />
              )}

              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white"
                    />
                    Signing in…
                  </motion.div>
                ) : done ? (
                  <motion.div key="done" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center gap-2">
                    <motion.svg viewBox="0 0 12 10" className="w-3.5 h-3.5" fill="none" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4 }}>
                      <path d="M1 5l3.5 3.5L11 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </motion.svg>
                    Signed in!
                  </motion.div>
                ) : (
                  <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                    Sign In
                    <motion.span animate={{ x: [0, 3, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                      <FiArrowRight />
                    </motion.span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </motion.div>

          {/* ── Register link ── */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.58 }}
            className="text-center text-gray-500 text-xs mt-6"
          >
            Don't have an account?{" "}
            <motion.a
              href="#"
              whileHover={{ color: "#93c5fd" }}
              className="text-blue-400 font-semibold transition-colors duration-200 hover:underline underline-offset-2"
            >
              Create one free
            </motion.a>
          </motion.p>

          {/* ── Footer note ── */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.64 }}
            className="text-center text-gray-700 text-[10px] mt-5"
          >
            By signing in, you agree to our{" "}
            <a href="#" className="text-gray-500 hover:text-gray-300 transition-colors underline underline-offset-2">Terms</a>
            {" & "}
            <a href="#" className="text-gray-500 hover:text-gray-300 transition-colors underline underline-offset-2">Privacy Policy</a>
          </motion.p>
        </div>

        {/* ── Trusted by strip ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex items-center justify-center gap-2 mt-6"
        >
          <div className="flex -space-x-2">
            {["#3b82f6", "#8b5cf6", "#10b981", "#f59e0b"].map((c, i) => (
              <div key={i} className="w-6 h-6 rounded-full border-2 border-[#0B0F19]" style={{ background: c }} />
            ))}
          </div>
          <p className="text-gray-600 text-xs">
            Trusted by <span className="text-gray-400 font-medium">12,000+</span> teams worldwide
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
