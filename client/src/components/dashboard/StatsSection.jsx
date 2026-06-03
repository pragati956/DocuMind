import React, { useState, useEffect, useRef } from "react";

import { getDashboardStats } from "../../services/dashboardService";
import { motion, useInView } from "framer-motion";
import { FiFileText, FiZap, FiTrendingUp, FiActivity } from "react-icons/fi";

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


/* ─── Stat data ─── */
const stats = [
  {
    id: "docs",
    icon: <FiFileText />,
    label: "Documents",
    sub: "Uploaded documents",
    accentBorder: "rgba(59,130,246,0.2)",
    accentText: "text-blue-400",
    accentBg: "bg-blue-500/10",
    gradFrom: "from-blue-500",
    gradTo: "to-indigo-500",
    glowColor: "rgba(59,130,246,0.22)",
  },
  {
    id: "summaries",
    icon: <FiZap />,
    label: "AI Summaries",
    sub: "AI summaries generated",
    accentBorder: "rgba(139,92,246,0.2)",
    accentText: "text-purple-400",
    accentBg: "bg-purple-500/10",
    gradFrom: "from-purple-500",
    gradTo: "to-pink-500",
    glowColor: "rgba(139,92,246,0.22)",
  },
  {
    id: "processing",
    icon: <FiActivity />,
    label: "Processing",
    sub: "Pending AI processing",
    accent: "#10b981",
    accentDim: "rgba(16,185,129,0.12)",
    accentBorder: "rgba(16,185,129,0.2)",
    accentText: "text-emerald-400",
    accentBg: "bg-emerald-500/10",
    gradFrom: "from-emerald-500",
    gradTo: "to-teal-400",
    glowColor: "rgba(16,185,129,0.22)",
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
      <motion.div
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.35 }}
        className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${stat.gradFrom} ${stat.gradTo}`}
      />

      <motion.div
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.4 }}
        className="absolute -top-8 -right-8 w-32 h-32 rounded-full blur-[50px] pointer-events-none"
        style={{ background: stat.glowColor }}
      />

      <div className="relative z-10 p-5">
        <div className="flex items-center gap-3 mb-4">
          <motion.div
            animate={{ scale: hovered ? 1.1 : 1, rotate: hovered ? 5 : 0 }}
            transition={{ duration: 0.25 }}
            className={`w-10 h-10 rounded-xl ${stat.accentBg} border flex items-center justify-center ${stat.accentText} text-lg`}
            style={{ borderColor: stat.accentBorder }}
          >
            {stat.icon}
          </motion.div>
          <span className="text-gray-400 text-xs font-medium leading-tight">{stat.label}</span>
        </div>

        <div className="mb-3">
          <motion.p
            className="text-white font-bold leading-none"
            animate={{ fontSize: hovered ? "2rem" : "1.875rem" }}
            transition={{ duration: 0.25 }}
          >
            {count.toLocaleString()}
          </motion.p>
        </div>

        <p className="text-gray-600 text-[11px]">{stat.sub}</p>
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
          <p className="text-gray-600 text-[11px]">Real-time dashboard statistics</p>
        </div>
      </div>
      {/* 
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
      </div> */}
    </motion.div>
  );
}

/* ─── Main Export ─── */
export default function StatsSection() {

  const [statsData, setStatsData] = useState({
    totalDocuments: 0,
    summarizedDocuments: 0,
    processingDocuments: 0,
  });

  useEffect(() => {

    const fetchStats = async () => {
      try {

        const data = await getDashboardStats();

        console.log(
          "Dashboard Stats:",
          data
        );

        setStatsData(data);

      } catch (error) {
        console.error(error);
      }
    };

    fetchStats();

  }, []);

  const dynamicStats = stats.map((config) => ({
    ...config,
    value:
      config.id === "docs"
        ? statsData.totalDocuments
        : config.id === "summaries"
          ? statsData.summarizedDocuments
          : statsData.processingDocuments,
  }));

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');`}</style>

      <SectionHeader />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {dynamicStats.map((stat, i) => (
          <StatCard key={stat.id} stat={stat} index={i} />
        ))}
      </div>
    </div>
  );
}