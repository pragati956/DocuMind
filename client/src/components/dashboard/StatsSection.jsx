import React, { useState, useEffect, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  FiFileText, FiZap, FiCloud, FiUsers,
  FiArrowUp, FiArrowDown, FiTrendingUp,
  FiMoreHorizontal, FiActivity,
} from "react-icons/fi";

/* ─── Count-up hook ─── */
function useCountUp(target, duration = 1600, start = false) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return value;
}

/* ─── Sparkline ─── */
function Sparkline({ data, color, height = 36 }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 80, h = height;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * h * 0.85 - h * 0.05;
    return `${x},${y}`;
  }).join(" ");
  const fillPoints = `0,${h} ${points} ${w},${h}`;

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none" className="overflow-visible">
      <defs>
        <linearGradient id={`fill-${color}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.polygon
        points={fillPoints}
        fill={`url(#fill-${color})`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      />
      <motion.polyline
        points={points}
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
      />
      {/* Last dot */}
      <motion.circle
        cx={w}
        cy={parseFloat(points.split(" ").pop().split(",")[1])}
        r="3"
        fill={color}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1.2, type: "spring" }}
      />
    </svg>
  );
}

/* ─── Mini Bar Chart ─── */
function MiniBarChart({ data, color }) {
  const max = Math.max(...data);
  return (
    <div className="flex items-end gap-0.5 h-9">
      {data.map((v, i) => (
        <motion.div
          key={i}
          initial={{ height: 0 }}
          animate={{ height: `${(v / max) * 100}%` }}
          transition={{ duration: 0.6, delay: i * 0.06, ease: "easeOut" }}
          className="flex-1 rounded-sm opacity-70"
          style={{ background: color, minHeight: 3 }}
        />
      ))}
    </div>
  );
}

/* ─── Stat data ─── */
const stats = [
  {
    id: "docs",
    icon: <FiFileText />,
    label: "Documents Processed",
    value: 1284,
    display: "1,284",
    change: "+12%",
    changeLabel: "vs last month",
    trend: "up",
    sub: "48 processed today",
    sparkData: [420, 580, 510, 700, 680, 820, 910, 1050, 1100, 1284],
    barData: [4, 7, 5, 9, 8, 11, 10, 13, 12, 15],
    accent: "#3b82f6",
    accentDim: "rgba(59,130,246,0.12)",
    accentBorder: "rgba(59,130,246,0.2)",
    accentText: "text-blue-400",
    accentBg: "bg-blue-500/10",
    accentBadge: "bg-blue-500/15 border-blue-500/25 text-blue-300",
    gradFrom: "from-blue-500",
    gradTo: "to-indigo-500",
    glowColor: "rgba(59,130,246,0.22)",
  },
  {
    id: "summaries",
    icon: <FiZap />,
    label: "AI Summaries",
    value: 847,
    display: "847",
    change: "+28%",
    changeLabel: "vs last month",
    trend: "up",
    sub: "3 new summaries ready",
    sparkData: [210, 280, 320, 400, 380, 510, 590, 670, 760, 847],
    barData: [3, 5, 7, 6, 9, 8, 11, 10, 13, 12],
    accent: "#8b5cf6",
    accentDim: "rgba(139,92,246,0.12)",
    accentBorder: "rgba(139,92,246,0.2)",
    accentText: "text-purple-400",
    accentBg: "bg-purple-500/10",
    accentBadge: "bg-purple-500/15 border-purple-500/25 text-purple-300",
    gradFrom: "from-purple-500",
    gradTo: "to-pink-500",
    glowColor: "rgba(139,92,246,0.22)",
  },
  {
    id: "storage",
    icon: <FiCloud />,
    label: "Storage Used",
    value: 246,
    display: "24.6 GB",
    change: "+5%",
    changeLabel: "vs last month",
    trend: "up",
    sub: "25.4 GB remaining",
    sparkData: [80, 100, 110, 130, 150, 170, 190, 210, 230, 246],
    barData: [4, 5, 5, 6, 7, 7, 8, 9, 9, 10],
    accent: "#06b6d4",
    accentDim: "rgba(6,182,212,0.12)",
    accentBorder: "rgba(6,182,212,0.2)",
    accentText: "text-cyan-400",
    accentBg: "bg-cyan-500/10",
    accentBadge: "bg-cyan-500/15 border-cyan-500/25 text-cyan-300",
    gradFrom: "from-cyan-500",
    gradTo: "to-teal-500",
    glowColor: "rgba(6,182,212,0.2)",
    isStorage: true,
    storageMax: 50,
    storageCurrent: 24.6,
  },
  {
    id: "users",
    icon: <FiUsers />,
    label: "Active Users",
    value: 38,
    display: "38",
    change: "+3",
    changeLabel: "joined this week",
    trend: "up",
    sub: "12 online right now",
    sparkData: [18, 22, 20, 25, 28, 27, 31, 34, 36, 38],
    barData: [4, 6, 5, 7, 8, 7, 9, 10, 10, 11],
    accent: "#10b981",
    accentDim: "rgba(16,185,129,0.12)",
    accentBorder: "rgba(16,185,129,0.2)",
    accentText: "text-emerald-400",
    accentBg: "bg-emerald-500/10",
    accentBadge: "bg-emerald-500/15 border-emerald-500/25 text-emerald-300",
    gradFrom: "from-emerald-500",
    gradTo: "to-teal-400",
    glowColor: "rgba(16,185,129,0.2)",
    hasAvatars: true,
  },
];

/* ─── Stat Card ─── */
function StatCard({ stat, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [hovered, setHovered] = useState(false);
  const count = useCountUp(stat.value, 1400, inView);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28, scale: 0.97 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.55, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative rounded-2xl border bg-[#111827] overflow-hidden cursor-pointer transition-all duration-300"
      style={{
        borderColor: hovered ? stat.accentBorder : "rgba(31,41,55,1)",
        boxShadow: hovered ? `0 0 40px ${stat.glowColor}, 0 4px 24px rgba(0,0,0,0.3)` : "0 4px 16px rgba(0,0,0,0.2)",
      }}
    >
      {/* Top gradient strip */}
      <motion.div
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.35 }}
        className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${stat.gradFrom} ${stat.gradTo}`}
      />

      {/* Ambient corner glow */}
      <motion.div
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.4 }}
        className="absolute -top-8 -right-8 w-32 h-32 rounded-full blur-[50px] pointer-events-none"
        style={{ background: stat.glowColor }}
      />

      <div className="relative z-10 p-5">

        {/* Header row */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ scale: hovered ? 1.1 : 1, rotate: hovered ? 5 : 0 }}
              transition={{ duration: 0.25 }}
              className={`w-10 h-10 rounded-xl ${stat.accentBg} border flex items-center justify-center ${stat.accentText} text-lg`}
              style={{ borderColor: stat.accentBorder }}
            >
              {stat.icon}
            </motion.div>
            <span className="text-gray-400 text-xs font-medium leading-tight max-w-[100px]">{stat.label}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <motion.span
              animate={{ opacity: hovered ? 1 : 0.6, scale: hovered ? 1.05 : 1 }}
              className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${stat.accentBadge}`}
            >
              {stat.trend === "up" ? <FiArrowUp className="text-[9px]" /> : <FiArrowDown className="text-[9px]" />}
              {stat.change}
            </motion.span>
            <button className="text-gray-700 hover:text-gray-400 transition-colors">
              <FiMoreHorizontal className="text-sm" />
            </button>
          </div>
        </div>

        {/* Value */}
        <div className="mb-1">
          <motion.p
            className="text-white font-bold leading-none"
            animate={{ fontSize: hovered ? "2rem" : "1.875rem" }}
            transition={{ duration: 0.25 }}
          >
            {stat.isStorage
              ? `${(count / 10).toFixed(1)} GB`
              : stat.id === "users"
              ? count
              : count.toLocaleString()}
          </motion.p>
        </div>

        {/* Sub label */}
        <div className="flex items-center gap-1.5 mb-5">
          <motion.span
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"
          />
          <p className="text-gray-600 text-[11px]">{stat.sub}</p>
        </div>

        {/* Storage progress bar */}
        {stat.isStorage && (
          <div className="mb-4">
            <div className="flex justify-between text-[10px] mb-1.5">
              <span className="text-gray-600">{stat.storageCurrent} GB used</span>
              <span className="text-gray-600">{stat.storageMax} GB total</span>
            </div>
            <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={inView ? { width: `${(stat.storageCurrent / stat.storageMax) * 100}%` } : {}}
                transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
                className={`h-full rounded-full bg-gradient-to-r ${stat.gradFrom} ${stat.gradTo}`}
              />
            </div>
          </div>
        )}

        {/* Avatars for users */}
        {stat.hasAvatars && (
          <div className="flex items-center gap-2 mb-4">
            <div className="flex -space-x-1.5">
              {["#3b82f6", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444"].map((c, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, x: -8 }}
                  animate={inView ? { scale: 1, x: 0 } : {}}
                  transition={{ delay: 0.5 + i * 0.07, type: "spring", stiffness: 300 }}
                  className="w-5 h-5 rounded-full border-2 border-[#111827]"
                  style={{ background: c }}
                />
              ))}
              <motion.div
                initial={{ scale: 0 }}
                animate={inView ? { scale: 1 } : {}}
                transition={{ delay: 0.9 }}
                className="w-5 h-5 rounded-full border-2 border-[#111827] bg-white/10 flex items-center justify-center text-[8px] text-gray-400 font-bold"
              >
                +33
              </motion.div>
            </div>
            <span className="text-gray-600 text-[10px]">38 total members</span>
          </div>
        )}

        {/* Chart area */}
        <div className="flex items-end justify-between gap-4">
          <div className="flex-1">
            {hovered
              ? <MiniBarChart data={stat.barData} color={stat.accent} />
              : <Sparkline data={stat.sparkData} color={stat.accent} height={36} />
            }
          </div>

          <motion.div
            animate={{ opacity: hovered ? 1 : 0.5 }}
            className="flex items-center gap-1 text-[10px] text-gray-600 shrink-0"
          >
            <FiActivity className="text-[9px]" />
            <span>10d</span>
          </motion.div>
        </div>

        {/* Change label */}
        <p className="text-gray-700 text-[10px] mt-2">{stat.changeLabel}</p>
      </div>
    </motion.div>
  );
}

/* ─── Section Header ─── */
function SectionHeader() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 12 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className="flex items-center justify-between mb-5"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 text-sm">
          <FiTrendingUp />
        </div>
        <div>
          <h2 className="text-white font-semibold text-sm">Overview</h2>
          <p className="text-gray-600 text-[11px]">Last 30 days performance</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {["7d", "30d", "90d"].map((range, i) => (
          <motion.button
            key={i}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.96 }}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all duration-200 ${
              range === "30d"
                ? "bg-blue-500/15 border border-blue-500/25 text-blue-300"
                : "text-gray-600 hover:text-gray-300 hover:bg-white/5"
            }`}
          >
            {range}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}

/* ─── Main Export ─── */
export default function StatsSection() {
  return (
    <div style={{ fontFamily: "'Poppins', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');`}</style>
      <SectionHeader />
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <StatCard key={stat.id} stat={stat} index={i} />
        ))}
      </div>
    </div>
  );
}