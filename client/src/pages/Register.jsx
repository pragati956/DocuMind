
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { registerUser } from "../services/authService";


// import { registerUser } from "../services/authService";
// export default function Register() {
//     return (
//         <div className="min-h-screen bg-[#0B0F19]">
//             {/* Register page */}
//         </div>
//     );
// }
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiUser, FiMail, FiLock, FiEye, FiEyeOff,
  FiArrowRight, FiCpu, FiGithub, FiChrome, FiCheck,
} from "react-icons/fi";

/* ─── Password Strength ─── */
function getStrength(pwd) {
  if (!pwd) return { score: 0, label: "", color: "" };
  let score = 0;
  if (pwd.length >= 8) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  const map = [
    { label: "", color: "" },
    { label: "Weak", color: "bg-red-500" },
    { label: "Fair", color: "bg-amber-500" },
    { label: "Good", color: "bg-blue-500" },
    { label: "Strong", color: "bg-emerald-500" },
  ];
  return { score, ...map[score] };
}

/* ─── Orb ─── */
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
function Particle({ x, y, delay, purple }) {
  return (
    <motion.div
      className={`absolute w-1 h-1 rounded-full pointer-events-none ${purple ? "bg-purple-400/40" : "bg-blue-400/40"}`}
      style={{ left: `${x}%`, top: `${y}%` }}
      animate={{ y: [0, -35, 0], opacity: [0, 0.7, 0], scale: [0.5, 1.3, 0.5] }}
      transition={{ duration: 4 + Math.random() * 3, repeat: Infinity, delay, ease: "easeInOut" }}
    />
  );
}

/* ─── Input Field ─── */
function InputField({ icon, label, type, value, onChange, placeholder, rightEl, error }) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-widest mb-1.5">
        {label}
      </label>
      <div className="relative">
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
          className="w-full pl-11 pr-11 py-3 rounded-xl text-white text-sm placeholder-gray-600 outline-none transition-all duration-300"
          style={{
            background: focused ? "rgba(59,130,246,0.04)" : "rgba(255,255,255,0.03)",
            border: `1px solid ${error ? "rgba(239,68,68,0.5)" : focused ? "rgba(59,130,246,0.45)" : "rgba(31,41,55,1)"}`,
            boxShadow: error
              ? "0 0 0 3px rgba(239,68,68,0.07)"
              : focused
                ? "0 0 0 3px rgba(59,130,246,0.08), 0 0 18px rgba(59,130,246,0.1)"
                : "none",
          }}
        />
        {rightEl && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">{rightEl}</div>
        )}
        <motion.div
          animate={{ scaleX: focused ? 1 : 0, opacity: focused ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="absolute bottom-0 left-4 right-4 h-px rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 origin-left"
        />
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="text-red-400 text-[11px] mt-1.5 ml-1"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Password Strength Bar ─── */
function StrengthBar({ password }) {
  const { score, label, color } = getStrength(password);
  if (!password) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-2"
    >
      <div className="flex gap-1 mb-1">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex-1 h-1 rounded-full bg-white/5 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: i <= score ? "100%" : "0%" }}
              transition={{ duration: 0.35, delay: i * 0.05 }}
              className={`h-full rounded-full ${i <= score ? color : ""}`}
            />
          </div>
        ))}
      </div>
      <p className={`text-[10px] font-medium ${score === 1 ? "text-red-400" : score === 2 ? "text-amber-400" : score === 3 ? "text-blue-400" : "text-emerald-400"
        }`}>
        {label}
      </p>
    </motion.div>
  );
}

/* ─── Main Register Component ─── */
export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [errors, setErrors] = useState({});

  const particles = Array.from({ length: 16 }, (_, i) => ({
    x: Math.random() * 100, y: Math.random() * 100,
    delay: i * 0.3, purple: i % 3 === 0,
  }));

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Full name is required";
    if (!form.email.includes("@")) e.email = "Enter a valid email";
    if (form.password.length < 8) e.password = "Password must be at least 8 characters";
    if (form.confirm !== form.password) e.confirm = "Passwords don't match";
    if (!agreed) e.terms = "You must accept the terms";
    return e;
  };

  const handleSubmit = async () => {

    const e = validate();

    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }

    try {

      setLoading(true);

      const data = await registerUser({
        name: form.name,
        email: form.email,
        password: form.password,
      });

      console.log(data);

      setLoading(false);

      setDone(true);

      toast.success("Registration successful");

      setTimeout(() => {
        navigate("/login");
      }, 1000);

    } catch (error) {

      setLoading(false);

      console.log(error.response?.data);

      toast.error(error.response?.data?.message || "Registration failed");
    }
  };

  /* clear error on edit */
  useEffect(() => { setErrors((e) => ({ ...e, name: "" })); }, [form.name]);
  useEffect(() => { setErrors((e) => ({ ...e, email: "" })); }, [form.email]);
  useEffect(() => { setErrors((e) => ({ ...e, password: "" })); }, [form.password]);
  useEffect(() => { setErrors((e) => ({ ...e, confirm: "" })); }, [form.confirm]);

  const containerVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.07 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 14 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0B0F19] px-4 py-12"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      {/* ── Background ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <Orb
          style={{ top: "-15%", left: "5%", width: 520, height: 520, background: "radial-gradient(circle, rgba(59,130,246,0.16) 0%, transparent 70%)", filter: "blur(70px)" }}
          animate={{ scale: [1, 1.18, 1], opacity: [0.55, 1, 0.55] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <Orb
          style={{ bottom: "-10%", right: "5%", width: 460, height: 460, background: "radial-gradient(circle, rgba(139,92,246,0.18) 0%, transparent 70%)", filter: "blur(70px)" }}
          animate={{ scale: [1, 1.22, 1], opacity: [0.45, 0.9, 0.45] }}
          transition={{ duration: 12, repeat: Infinity, delay: 2 }}
        />
        <Orb
          style={{ top: "35%", right: "20%", width: 300, height: 300, background: "radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 70%)", filter: "blur(70px)" }}
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 8, repeat: Infinity, delay: 5 }}
        />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "linear-gradient(rgba(100,200,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(100,200,255,1) 1px,transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />
        {particles.map((p, i) => <Particle key={i} {...p} />)}
      </div>

      {/* ── Card ── */}
      <motion.div
        initial={{ opacity: 0, y: 36, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Top glow line */}
        <div className="absolute -top-px left-1/2 -translate-x-1/2 w-48 h-px bg-gradient-to-r from-transparent via-purple-400/60 to-transparent" />

        <div
          className="rounded-3xl border border-[#1F2937] p-8 relative overflow-hidden"
          style={{ background: "rgba(17,24,39,0.88)", backdropFilter: "blur(24px)" }}
        >
          {/* Card top blush */}
          <div className="absolute top-0 left-0 right-0 h-44 bg-gradient-to-b from-purple-500/[0.07] to-transparent pointer-events-none rounded-t-3xl" />

          <motion.div variants={containerVariants} initial="hidden" animate="show" className="relative z-10">

            {/* ── Logo ── */}
            <motion.div variants={itemVariants} className="flex items-center justify-center gap-2.5 mb-7">
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
            <motion.div variants={itemVariants} className="text-center mb-7">
              <h1 className="text-white text-2xl font-bold tracking-tight mb-1.5">Create your account</h1>
              <p className="text-gray-500 text-sm">Start your 14-day free trial. No credit card needed.</p>
            </motion.div>

            {/* ── OAuth ── */}
            <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3 mb-6">
              {[{ icon: <FiChrome />, label: "Google" }, { icon: <FiGithub />, label: "GitHub" }].map(({ icon, label }, i) => (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.03, borderColor: "rgba(255,255,255,0.14)", backgroundColor: "rgba(255,255,255,0.05)" }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center justify-center gap-2.5 py-3 rounded-xl border border-[#1F2937] bg-white/[0.03] text-gray-300 text-sm font-medium transition-colors duration-200"
                >
                  <span className="text-base">{icon}</span>{label}
                </motion.button>
              ))}
            </motion.div>

            {/* ── Divider ── */}
            <motion.div variants={itemVariants} className="flex items-center gap-3 mb-5">
              <div className="flex-1 h-px bg-[#1F2937]" />
              <span className="text-gray-600 text-[11px] font-medium whitespace-nowrap">or sign up with email</span>
              <div className="flex-1 h-px bg-[#1F2937]" />
            </motion.div>

            {/* ── Fields ── */}
            <motion.div variants={itemVariants} className="space-y-3.5">
              <InputField
                icon={<FiUser />} label="Full Name" type="text"
                value={form.name} onChange={set("name")}
                placeholder="Alex Johnson" error={errors.name}
              />
              <InputField
                icon={<FiMail />} label="Email" type="email"
                value={form.email} onChange={set("email")}
                placeholder="you@company.com" error={errors.email}
              />

              {/* Password */}
              <div>
                <InputField
                  icon={<FiLock />} label="Password" type={showPass ? "text" : "password"}
                  value={form.password} onChange={set("password")}
                  placeholder="Min. 8 characters" error={errors.password}
                  rightEl={
                    <button type="button" onClick={() => setShowPass(!showPass)} className="text-gray-600 hover:text-gray-300 transition-colors text-base">
                      {showPass ? <FiEyeOff /> : <FiEye />}
                    </button>
                  }
                />
                <StrengthBar password={form.password} />
              </div>

              {/* Confirm */}
              <div>
                <InputField
                  icon={<FiLock />} label="Confirm Password" type={showConfirm ? "text" : "password"}
                  value={form.confirm} onChange={set("confirm")}
                  placeholder="Re-enter password" error={errors.confirm}
                  rightEl={
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="text-gray-600 hover:text-gray-300 transition-colors text-base">
                      {showConfirm ? <FiEyeOff /> : <FiEye />}
                    </button>
                  }
                />
                {/* Match indicator */}
                <AnimatePresence>
                  {form.confirm && form.confirm === form.password && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-1.5 mt-1.5"
                    >
                      <div className="w-3.5 h-3.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                        <FiCheck className="text-emerald-400 text-[8px]" />
                      </div>
                      <span className="text-emerald-400 text-[10px] font-medium">Passwords match</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* ── Terms ── */}
            <motion.div variants={itemVariants} className="mt-5">
              <label className="flex items-start gap-3 cursor-pointer group">
                <div
                  onClick={() => { setAgreed(!agreed); setErrors((e) => ({ ...e, terms: "" })); }}
                  className={`w-5 h-5 rounded-md border shrink-0 mt-0.5 flex items-center justify-center transition-all duration-200 ${agreed
                      ? "bg-blue-500 border-blue-500"
                      : errors.terms
                        ? "border-red-500/50 bg-red-500/5"
                        : "border-[#374151] bg-white/[0.03] group-hover:border-blue-500/50"
                    }`}
                >
                  <AnimatePresence>
                    {agreed && (
                      <motion.svg
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ duration: 0.15, type: "spring" }}
                        viewBox="0 0 10 8" className="w-2.5 h-2.5" fill="none"
                      >
                        <path d="M1 4l2.5 2.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </motion.svg>
                    )}
                  </AnimatePresence>
                </div>
                <span className="text-gray-400 text-xs leading-relaxed select-none">
                  I agree to the{" "}
                  <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors underline underline-offset-2">Terms of Service</a>
                  {" "}and{" "}
                  <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors underline underline-offset-2">Privacy Policy</a>
                </span>
              </label>
              <AnimatePresence>
                {errors.terms && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-red-400 text-[11px] mt-1.5 ml-8"
                  >
                    {errors.terms}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            {/* ── Submit ── */}
            <motion.div variants={itemVariants} className="mt-6">
              <motion.button
                whileHover={!loading && !done ? { scale: 1.02, boxShadow: "0 0 30px rgba(59,130,246,0.4)" } : {}}
                whileTap={!loading && !done ? { scale: 0.98 } : {}}
                onClick={handleSubmit}
                disabled={loading}
                className={`w-full py-3.5 rounded-xl font-semibold text-sm text-white flex items-center justify-center gap-2 transition-all duration-300 relative overflow-hidden ${done
                    ? "bg-gradient-to-r from-emerald-500 to-teal-500 shadow-[0_0_25px_rgba(16,185,129,0.35)]"
                    : "bg-gradient-to-r from-blue-500 to-indigo-500 shadow-[0_0_20px_rgba(59,130,246,0.25)]"
                  }`}
              >
                {/* Shimmer */}
                {!loading && !done && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12"
                    animate={{ x: ["-100%", "200%"] }}
                    transition={{ duration: 2.8, repeat: Infinity, repeatDelay: 1.5 }}
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
                      Creating account…
                    </motion.div>
                  ) : done ? (
                    <motion.div key="done" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center gap-2">
                      <motion.svg viewBox="0 0 12 10" className="w-3.5 h-3.5" fill="none" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4 }}>
                        <path d="M1 5l3.5 3.5L11 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </motion.svg>
                      Account created!
                    </motion.div>
                  ) : (
                    <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                      Create Account
                      <motion.span animate={{ x: [0, 3, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                        <FiArrowRight />
                      </motion.span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </motion.div>

            {/* ── Login redirect ── */}
            <motion.span
              whileHover={{ scale: 1.05 }}
              className="inline-block"
            >
              <Link
                to="/login"
                className="text-blue-400 font-semibold transition-colors duration-200 hover:underline underline-offset-2 cursor-pointer"
              >
                Sign in
              </Link>
            </motion.span>
          </motion.div>
        </div>

        {/* ── Trusted strip ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75 }}
          className="flex items-center justify-center gap-2 mt-5"
        >
          <div className="flex -space-x-2">
            {["#3b82f6", "#8b5cf6", "#10b981", "#f59e0b"].map((c, i) => (
              <div key={i} className="w-6 h-6 rounded-full border-2 border-[#0B0F19]" style={{ background: c }} />
            ))}
          </div>
          <p className="text-gray-600 text-xs">
            Join <span className="text-gray-400 font-medium">12,000+</span> teams already using DocuMind
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
