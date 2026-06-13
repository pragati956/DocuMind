import React, { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useEffect } from "react";
import {
  FiFileText,
  FiSearch,
  FiShield,
  FiCloud,
  FiCpu,
  FiLayers,
  FiArrowRight,
  FiZap,
} from "react-icons/fi";

/* ─── Feature Data (same 6, enriched) ─── */


/* ─── Mini Visuals ─── */
function SummaryVisual() {
  return (
    <div className="w-full space-y-2 mt-6">
      {[100, 75, 90, 55, 80].map((w, i) => (
        <motion.div
          key={i}
          initial={{ width: 0 }}
          whileInView={{ width: `${w}%` }}
          transition={{ duration: 0.8, delay: 0.3 + i * 0.1, ease: "easeOut" }}
          viewport={{ once: true }}
          className="h-2 rounded-full bg-gradient-to-r from-cyan-500/40 to-blue-500/20"
        />
      ))}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        viewport={{ once: true }}
        className="mt-3 px-3 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-medium flex items-center gap-2"
      >
        <FiZap /> Summary ready — 3 key insights extracted
      </motion.div>
    </div>
  );
}



function SearchVisual() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      viewport={{ once: true }}
      className="mt-6 space-y-2"
    >
      <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-[#111827] border border-white/5 text-xs">
        <FiSearch className="text-blue-400 shrink-0" />
        <span className="text-blue-300">quarterly report 2025</span>
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.6, repeat: Infinity }}
          className="text-blue-400"
        >|</motion.span>
      </div>
      {["Q4 Financial Summary.pdf", "Annual Report — Final.docx"].map((name, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 + i * 0.15 }}
          viewport={{ once: true }}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-500/5 border border-blue-500/10 text-[11px] text-gray-300"
        >
          <FiFileText className="text-blue-400 shrink-0" /> {name}
        </motion.div>
      ))}
    </motion.div>
  );
}

function ShareVisual() {
  return (
    <div className="mt-6 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex -space-x-2">
          {["#34d399", "#60a5fa", "#f472b6", "#a78bfa"].map((c, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ delay: 0.2 + i * 0.1, type: "spring", stiffness: 300 }}
              viewport={{ once: true }}
              className="w-8 h-8 rounded-full border-2 border-[#0B0F19]"
              style={{ background: c }}
            />
          ))}
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          viewport={{ once: true }}
          className="text-[11px] text-emerald-300 flex items-center gap-1.5"
        >
          <motion.span
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"
          />
          4 collaborators active
        </motion.div>
      </div>
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: "100%" }}
        transition={{ duration: 1, delay: 0.5 }}
        viewport={{ once: true }}
        className="h-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 opacity-40"
      />
    </div>
  );
}

function CloudVisual() {
  return (
    <div className="mt-6 space-y-2">
      {[
        { label: "Documents", pct: 45, color: "from-amber-400 to-orange-500" },
        { label: "Images", pct: 30, color: "from-amber-300 to-yellow-500" },
        { label: "Archives", pct: 25, color: "from-orange-400 to-red-400" },
      ].map(({ label, pct, color }, i) => (
        <div key={i} className="flex items-center gap-3">
          <span className="text-[11px] text-gray-500 w-20 shrink-0">{label}</span>
          <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${pct}%` }}
              transition={{ duration: 0.9, delay: 0.3 + i * 0.15, ease: "easeOut" }}
              viewport={{ once: true }}
              className={`h-full rounded-full bg-gradient-to-r ${color}`}
            />
          </div>
          <span className="text-[11px] text-gray-500">{pct}%</span>
        </div>
      ))}
    </div>
  );
}

function WorkflowVisual() {
  const steps = ["Ingest", "Classify", "Route", "Notify"];
  return (
    <div className="mt-6 flex items-center gap-1 flex-wrap">
      {steps.map((s, i) => (
        <React.Fragment key={i}>
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 + i * 0.12, type: "spring" }}
            viewport={{ once: true }}
            className="px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-[11px] text-rose-300 font-medium"
          >
            {s}
          </motion.div>
          {i < steps.length - 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.3 + i * 0.12 }}
              viewport={{ once: true }}
            >
              <FiArrowRight className="text-gray-600 text-xs" />
            </motion.div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

/* ─── Feature Card ─── */
function FeatureCard({ feature, index }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
  role="article"
  aria-label={feature.title}
  initial={{ opacity: 0, y: 40 }}
  whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: index * 0.1, ease: "easeOut" }}
      viewport={{ once: true }}
      whileHover={{ y: -10 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`group relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl p-6 md:p-8 overflow-hidden transition-all duration-500 cursor-pointer ${feature.border} ${feature.shadow}`}
      style={{
        boxShadow: hovered ? `0 0 55px ${feature.glow}` : undefined,
      }}
    >
      {/* Radial glow */}
      <motion.div
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.4 }}
        className="absolute inset-0 rounded-3xl pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at top left, ${feature.glow} 0%, transparent 65%)`,
        }}
      />

      {/* Subtle inner shimmer */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-white/[0.03] to-transparent rounded-3xl pointer-events-none" />

      {/* Top row: Icon + Stat */}
      <div className="relative z-10 flex items-start justify-between">
        <motion.div
          animate={{ scale: hovered ? 1.1 : 1, rotate: hovered ? 5 : 0 }}
          transition={{ duration: 0.3 }}
          className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.accent} flex items-center justify-center text-white text-2xl shadow-[0_0_30px_rgba(34,211,238,0.2)]`}
        >
          {feature.icon}
        </motion.div>

        <motion.div
          animate={{ opacity: hovered ? 1 : 0.45, y: hovered ? 0 : 5 }}
          transition={{ duration: 0.3 }}
          className="text-right">
          <div className={`text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${feature.accent}`}>
            {feature.stat}
          </div>
          <div className="text-[11px] text-gray-500">{feature.statLabel}</div>
        </motion.div>
      </div>
      {/* Content */}
      <div className="relative z-10 mt-8">
        <h3 className="text-xl md:text-2xl font-semibold text-white">{feature.title}</h3>
        <p className="mt-4 text-gray-400 leading-relaxed">{feature.description}</p>
      </div>

      {/* Mini Visual */}
      <div className="relative z-10">{feature.visual}</div>

      {/* Learn more */}
      <motion.div
        animate={{ opacity: hovered ? 1 : 0, x: hovered ? 0 : -8 }}
        transition={{ duration: 0.3 }}
        className={`relative z-10 mt-6 flex items-center gap-1.5 text-xs font-semibold ${feature.badgeColor}`}
      >
        Learn more
        <motion.span
          animate={{ x: hovered ? [0, 4, 0] : 0 }}
          transition={{ duration: 0.8, repeat: hovered ? Infinity : 0 }}
        >
          <FiArrowRight />
        </motion.span>
      </motion.div>

      {/* Corner accent */}
      <motion.div
        animate={{ opacity: hovered ? 1 : 0, scale: hovered ? 1 : 0.7 }}
        transition={{ duration: 0.4 }}
        className={`absolute bottom-0 right-0 w-28 h-28 rounded-tl-[3rem] bg-gradient-to-br ${feature.accent} opacity-[0.07] pointer-events-none`}
      />
    </motion.div>
  );
}

/* ─── Main Export ─── */
export default function FeaturesSection() {
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-60px" });
  const [loading,setLoading] =
 useState(true);
  const [stats,setStats] =
 useState({
  totalDocuments:0,
  totalSummaries:0,
  totalUsers:0
 });
 const features = [
  {
    title: "AI Document Summary",
    description:
      "Generate intelligent summaries instantly using advanced AI workflows.",
    icon: <FiCpu />,
    glow: "rgba(34,211,238,0.22)",
    accent: "from-cyan-500 to-blue-500",
    border: "hover:border-cyan-500/40",
    shadow: "hover:shadow-[0_0_50px_rgba(34,211,238,0.18)]",
    badgeColor: "text-cyan-300",
   stat: stats.totalSummaries,
    statLabel: "faster reading",
    visual: <SummaryVisual />,
  },

  {
    title: "Smart Search",
    description:
      "Find documents semantically using AI-powered contextual search.",
    icon: <FiSearch />,
    glow: "rgba(59,130,246,0.2)",
    accent: "from-blue-500 to-indigo-500",
    border: "hover:border-blue-500/40",
    shadow: "hover:shadow-[0_0_50px_rgba(59,130,246,0.18)]",
    badgeColor: "text-blue-300",
    stat: "<50ms",
    statLabel: "query time",
    visual: <SearchVisual />,
  },
  {
    title: "Secure File Sharing",
    description:
      "Share files securely with encrypted access and permissions.",
    icon: <FiShield />,
    glow: "rgba(16,185,129,0.2)",
    accent: "from-emerald-500 to-teal-500",
    border: "hover:border-emerald-500/40",
    shadow: "hover:shadow-[0_0_50px_rgba(16,185,129,0.18)]",
    badgeColor: "text-emerald-300",
    stat: "E2E",
    statLabel: "encrypted",
    visual: <ShareVisual />,
  },
  {
    title: "Cloud Storage",
    description:
      "Store and manage all your documents securely in the cloud.",
    icon: <FiCloud />,
    glow: "rgba(251,191,36,0.18)",
    accent: "from-amber-400 to-orange-500",
    border: "hover:border-amber-500/40",
    shadow: "hover:shadow-[0_0_50px_rgba(251,191,36,0.15)]",
    badgeColor: "text-amber-300",
   stat: stats.totalDocuments,
    statLabel: "storage",
    visual: <CloudVisual />,
  },
  {
    title: "Workflow Automation",
    description:
      "Automate repetitive document workflows with AI intelligence.",
    icon: <FiLayers />,
    glow: "rgba(239,68,68,0.18)",
    accent: "from-rose-500 to-red-500",
    border: "hover:border-rose-500/40",
    shadow: "hover:shadow-[0_0_50px_rgba(239,68,68,0.15)]",
    badgeColor: "text-rose-300",
    stat: stats.totalUsers,
    statLabel: "integrations",
    visual: <WorkflowVisual />,
  },
];
 useEffect(()=>{

 const loadStats =
 async()=>{

  try{

   const res =
    await fetch(
`${import.meta.env.VITE_API_URL}/dashboard/features-stats`
    );

  if(!res.ok){

 throw new Error(
  "Failed to fetch stats"
 );

}

const data =
 await res.json();

   if(data.success){

    setStats(data);

   }

  }catch(error){

   console.error(error);

  }

 };

 loadStats();

 const interval =
  setInterval(
   loadStats,
   30000
  );

 return ()=>{

  clearInterval(interval);

 };

},[]);
  return (
    <section
className="relative overflow-hidden bg-[#0B0F19] py-20 md:py-28"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >

      {/* Ambient Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.08, 0.15, 0.08] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[500px] bg-cyan-500 blur-[160px] rounded-full"
        />
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.06, 0.1, 0.06] }}
          transition={{ duration: 13, repeat: Infinity, delay: 3 }}
          className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-indigo-600 blur-[160px] rounded-full"
        />
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.04, 0.08, 0.04] }}
          transition={{ duration: 9, repeat: Infinity, delay: 5 }}
          className="absolute top-1/2 left-0 w-[350px] h-[350px] bg-purple-600 blur-[160px] rounded-full"
        />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(100,200,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(100,200,255,1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

<div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div ref={headerRef} className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl mb-8"
          >
            <motion.span
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.8, repeat: Infinity }}
              className="w-2 h-2 rounded-full bg-cyan-400"
            />
            <span className="text-cyan-300 text-sm font-medium">Powerful AI Features</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold tracking-tight leading-tight text-white"
          >
            Everything You Need For
            <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500">
              Smart Document Management
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={headerInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.3 }}
            className="mt-6 text-lg text-gray-400 leading-relaxed"
          >
            Powerful AI-driven tools designed to simplify document processing,
            search, collaboration and automation.
          </motion.p>
        </div>

        {/* Features Grid */}
<div className="mt-16 md:mt-20 grid md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
            {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>

      </div>
    </section>
  );
}