import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import {
  FiArrowRight,
  FiPlay,
  FiCpu,
  FiFileText,
  FiZap,
  FiShield,
  FiSearch,
} from "react-icons/fi";

/* ─── Floating Particle ─── */
function Particle({ x, y, size, delay, color }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{ left: `${x}%`, top: `${y}%`, width: size, height: size, background: color }}
      animate={{ y: [0, -30, 0], opacity: [0, 0.7, 0], scale: [0.5, 1.2, 0.5] }}
      transition={{ duration: 4 + Math.random() * 3, repeat: Infinity, delay, ease: "easeInOut" }}
    />
  );
}

/* ─── Grid Lines ─── */
function GridLines() {
  return (
    <div className="absolute inset-0 overflow-hidden opacity-[0.04] pointer-events-none">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(100,200,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(100,200,255,1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
    </div>
  );
}

/* ─── Typewriter ─── */
function Typewriter({ words }) {
  const [wordIndex, setWordIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = words[wordIndex];
    let timeout;
    if (!deleting && displayed.length < word.length) {
      timeout = setTimeout(() => setDisplayed(word.slice(0, displayed.length + 1)), 80);
    } else if (!deleting && displayed.length === word.length) {
      timeout = setTimeout(() => setDeleting(true), 1800);
    } else if (deleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 45);
    } else if (deleting && displayed.length === 0) {
      setDeleting(false);
      setWordIndex((i) => (i + 1) % words.length);
    }
    return () => clearTimeout(timeout);
  }, [displayed, deleting, wordIndex, words]);

  return (
    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-500">
      {displayed}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity }}
        className="text-cyan-400"
      >
        |
      </motion.span>
    </span>
  );
}

/* ─── Stat Card ─── */
function StatCard({ value, label, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6 }}
      whileHover={{ scale: 1.06, y: -4 }}
      className="flex flex-col items-center px-6 py-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl"
    >
      <span className="text-2xl font-bold text-white">{value}</span>
      <span className="text-xs text-gray-400 mt-1 text-center">{label}</span>
    </motion.div>
  );
}

/* ─── Hero Section ─── */
export default function HeroSection() {
 const [particles] = useState(
 Array.from(
  { length: 18 },
  (_, i) => ({
   x: Math.random()*100,
   y: Math.random()*100,
   size: Math.random()*4+2,
   delay:i*0.3,
   color:
    i%2===0
    ? "rgba(34,211,238,0.6)"
    : "rgba(99,102,241,0.6)"
  })
 )
);

  return (
   <section
 id="home"
 className="relative overflow-hidden bg-[#0B0F19] pt-40 pb-28"
>

      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/20 blur-[140px] rounded-full"
        />
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.22, 0.15] }}
          transition={{ duration: 10, repeat: Infinity, delay: 2 }}
          className="absolute bottom-0 right-1/4 w-[450px] h-[450px] bg-indigo-600/20 blur-[140px] rounded-full"
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 12, repeat: Infinity, delay: 4 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-blue-500/10 blur-[120px] rounded-full"
        />
        <GridLines />
        {particles.map((p, i) => <Particle key={i} {...p} />)}
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-20 items-center">

          {/* LEFT */}
          <div className="max-w-2xl">

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl mb-8"
            >
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }}>
                <FiCpu className="text-cyan-400" />
              </motion.div>
              <span className="text-sm text-cyan-300 font-medium">AI Powered Platform</span>
              <motion.span
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-2 h-2 rounded-full bg-green-400"
              />
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 70 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="text-5xl md:text-7xl xl:text-[5.5rem] font-bold tracking-tight leading-[0.95]"
            >
              <span className="text-white">AI-Powered</span>
              <span className="block mt-2">
                <Typewriter words={["DocuMind", "Workflows", "Intelligence", "Innovation"]} />
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-8 text-lg md:text-xl text-gray-400 leading-relaxed"
            >
              Upload, summarize, search and manage documents intelligently using AI-powered workflows.
            </motion.p>

            {/* Feature Pills */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-6 flex flex-wrap gap-3"
            >
              {[
                { icon: <FiZap />, label: "Instant Summaries" },
                { icon: <FiSearch />, label: "Smart Search" },
                { icon: <FiShield />, label: "Secure Vault" },
              ].map(({ icon, label }, i) => (
                <motion.span
                  key={i}
                  whileHover={{ scale: 1.08, y: -2 }}
                  className="flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium border border-cyan-500/20 bg-cyan-500/10 text-cyan-300"
                >
                  {icon} {label}
                </motion.span>
              ))}
            </motion.div>

            {/* Buttons */}
            <div className="mt-12 flex flex-col sm:flex-row gap-5">
             <motion.div
 whileHover={{
  scale:1.04
 }}
 whileTap={{
  scale:0.96
 }}
>
 <Link
  to="/register"
  className="
  group
  flex
  items-center
  justify-center
  gap-2
  px-8
  py-4
  rounded-2xl
  bg-gradient-to-r
  from-cyan-500
  to-indigo-500
  text-white
  font-semibold
 "
 >
  Get Started
  <FiArrowRight />
 </Link>
</motion.div>

            <motion.button
 onClick={()=>{
  document
   .getElementById("features")
   ?.scrollIntoView({
    behavior:"smooth"
   });
 }}
 aria-label="Watch Demo"
 initial={{ opacity:0,x:20 }}
 animate={{ opacity:1,x:0 }}
 transition={{ delay:0.7 }}
 whileHover={{ scale:1.03 }}
 whileTap={{ scale:0.96 }}
 className="flex items-center justify-center gap-3 px-8 py-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl text-white"
>
                <motion.span
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="text-cyan-400"
                >
                  <FiPlay />
                </motion.span>
                Watch Demo
                
              </motion.button>
            </div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="mt-12 grid grid-cols-3 gap-3"
            >
              <StatCard value="50K+" label="Documents Processed" delay={1.0} />
              <StatCard value="99.9%" label="Accuracy Rate" delay={1.1} />
              <StatCard value="2.5x" label="Faster Workflows" delay={1.2} />
            </motion.div>
          </div>

          {/* RIGHT VISUAL */}
          <div className="relative flex justify-center">

            {/* Floating Left Card */}
            <motion.div
              animate={{ y: [0, -18, 0], rotate: [0, 5, -5, 0] }}
              transition={{ duration: 7, repeat: Infinity }}
              className="hidden xl:block absolute left-0 top-16 w-44 h-56 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-2xl p-5"
            >
              <div className="space-y-4">
                <motion.div
                  animate={{ boxShadow: ["0 0 10px rgba(34,211,238,0.3)", "0 0 25px rgba(34,211,238,0.7)", "0 0 10px rgba(34,211,238,0.3)"] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-indigo-500 flex items-center justify-center"
                >
                  <FiFileText className="text-white text-2xl" />
                </motion.div>
                <motion.div animate={{ width: ["100%", "60%", "100%"] }} transition={{ duration: 3, repeat: Infinity }} className="h-3 rounded-full bg-white/20" />
                <div className="w-2/3 h-3 rounded-full bg-white/10" />
                <div className="w-1/2 h-3 rounded-full bg-white/10" />
                <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ duration: 2, repeat: Infinity, delay: 1 }} className="text-[10px] text-cyan-400 font-medium">
                  Analyzing…
                </motion.div>
              </div>
            </motion.div>

            {/* Dashboard */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity }}
              whileHover={{ scale: 1.02 }}
              className="relative w-full max-w-2xl rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-2xl p-6 shadow-[0_0_60px_rgba(15,23,42,0.65)]"
            >
              {/* Top Bar */}
              <div className="flex gap-2 mb-6 items-center">
                <motion.div whileHover={{ scale: 1.3 }} className="w-3 h-3 rounded-full bg-red-400" />
                <motion.div whileHover={{ scale: 1.3 }} className="w-3 h-3 rounded-full bg-yellow-400" />
                <motion.div whileHover={{ scale: 1.3 }} className="w-3 h-3 rounded-full bg-green-400" />
                <div className="flex-1 ml-2 h-3 rounded-full bg-white/10 flex items-center px-2 overflow-hidden">
                  <motion.div
                    animate={{ width: ["0%", "60%"] }}
                    transition={{ duration: 2, delay: 1 }}
                    className="h-1.5 rounded-full bg-gradient-to-r from-cyan-400 to-indigo-400"
                  />
                </div>
              </div>

              {/* Search */}
              <div className="h-14 rounded-2xl bg-[#111827] mb-5 flex items-center px-4 gap-3">
                <FiSearch className="text-gray-500" />
                <motion.div animate={{ width: ["0%", "70%"] }} transition={{ duration: 1.5, delay: 1.5 }} className="h-2 rounded-full bg-white/20" />
                <motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.5, repeat: Infinity }} className="text-gray-500 text-sm">|</motion.span>
              </div>

              {/* Grid */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: <FiFileText />, label: "Reports", count: "142" },
                  { icon: <FiZap />, label: "Summaries", count: "89" },
                  { icon: <FiSearch />, label: "Searches", count: "2.4k" },
                  { icon: <FiShield />, label: "Secured", count: "100%" },
                ].map(({ icon, label, count }, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.5 + i * 0.15 }}
                    whileHover={{ scale: 1.04, borderColor: "rgba(34,211,238,0.3)" }}
                    className="h-40 rounded-2xl bg-[#111827] border border-white/5 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all duration-300"
                  >
                    <div className="text-cyan-400 text-2xl">{icon}</div>
                    <div className="text-white font-bold text-lg">{count}</div>
                    <div className="text-gray-500 text-xs">{label}</div>
                  </motion.div>
                ))}
              </div>

              {/* Progress Bar */}
              <div className="mt-5 p-3 rounded-xl bg-[#111827] border border-white/5">
                <div className="flex justify-between text-xs text-gray-400 mb-2">
                  <span>Processing Queue</span>
                  <span>78%</span>
                </div>
                <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "78%" }}
                    transition={{ duration: 2, delay: 2, ease: "easeOut" }}
                    className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-indigo-500"
                  />
                </div>
              </div>
            </motion.div>

            {/* Floating Right Card */}
            <motion.div
              animate={{ y: [0, 20, 0], rotate: [0, -5, 5, 0] }}
              transition={{ duration: 8, repeat: Infinity }}
              className="hidden xl:block absolute right-0 bottom-16 w-52 h-64 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-2xl p-6"
            >
              <div className="space-y-4">
                <motion.div animate={{ width: ["100%", "80%", "100%"] }} transition={{ duration: 4, repeat: Infinity }} className="h-3 rounded-full bg-white/20" />
                <div className="w-4/5 h-3 rounded-full bg-white/10" />
                <div className="w-2/3 h-3 rounded-full bg-white/10" />
                <motion.div
                  animate={{
                    borderColor: ["rgba(34,211,238,0.2)", "rgba(34,211,238,0.6)", "rgba(34,211,238,0.2)"],
                    boxShadow: ["0 0 0px rgba(34,211,238,0)", "0 0 15px rgba(34,211,238,0.3)", "0 0 0px rgba(34,211,238,0)"],
                  }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                  className="mt-5 p-4 rounded-2xl bg-cyan-500/10 border"
                >
                  <p className="text-cyan-300 text-sm font-medium">✨ AI Summary Generated</p>
                  <motion.p animate={{ opacity: [0, 1] }} transition={{ duration: 0.5, delay: 2.5 }} className="text-gray-400 text-xs mt-1">
                    3 key insights found
                  </motion.p>
                </motion.div>
                <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ duration: 3, repeat: Infinity, delay: 1 }} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-400" />
                  <span className="text-green-400 text-xs">Processing complete</span>
                </motion.div>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
}