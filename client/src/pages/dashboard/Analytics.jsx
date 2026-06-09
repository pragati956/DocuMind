import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { motion, useInView } from "framer-motion";
import {
  FiTrendingUp, FiFileText, FiZap, FiCloud,
  FiActivity, FiArrowUp, FiArrowDown,
  FiClock, FiDownload, FiFilter, FiShare2,
} from "react-icons/fi";
import {
  ResponsiveContainer, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Area, AreaChart,
  PieChart, Pie, Cell,
} from "recharts";


/* ─── Custom Tooltip ─── */
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="px-3 py-2.5 rounded-xl border border-white/10 shadow-2xl"
      style={{ background: "rgba(17,24,39,0.97)", backdropFilter: "blur(16px)" }}>
      <p className="text-gray-400 text-[10px] font-semibold mb-1.5">{label}</p>
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
          <span className="text-white text-xs font-semibold">{entry.value}</span>
          <span className="text-gray-500 text-[10px] capitalize">{entry.name}</span>
        </div>
      ))}
    </div>
  );
};

/* ─── Stat Card ─── */
function StatCard({ stat, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.5, delay: index * 0.09, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`relative rounded-2xl border ${stat.border} bg-[#111827] overflow-hidden cursor-default transition-all duration-300`}
      style={{ boxShadow: hovered ? `0 0 40px ${stat.glow}, 0 4px 20px rgba(0,0,0,0.3)` : "0 2px 12px rgba(0,0,0,0.2)" }}
    >
      <motion.div animate={{ opacity: hovered ? 1 : 0 }} transition={{ duration: 0.3 }}
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{ background: `radial-gradient(ellipse at top left, ${stat.glow} 0%, transparent 65%)` }} />
      <motion.div animate={{ scaleX: hovered ? 1 : 0, opacity: hovered ? 1 : 0 }} transition={{ duration: 0.3 }}
        className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${stat.gradient} origin-left`} />
      <div className="relative z-10 p-5">
        <div className="flex items-start justify-between mb-4">
          <motion.div animate={{ scale: hovered ? 1.1 : 1, rotate: hovered ? 6 : 0 }} transition={{ duration: 0.25 }}
            className={`w-10 h-10 rounded-xl ${stat.bg} border ${stat.border} flex items-center justify-center ${stat.color} text-lg`}>
            {stat.icon}
          </motion.div>
          <span className={`flex items-center gap-1 text-xs font-bold ${stat.trend === "up" ? "text-emerald-400" : "text-red-400"}`}>
            {stat.trend === "up" ? <FiArrowUp className="text-[10px]" /> : <FiArrowDown className="text-[10px]" />}
            {stat.change}
          </span>
        </div>
        <p className="text-white text-2xl font-bold mb-0.5">{stat.value}</p>
        <div className="flex items-center gap-1.5">
          <motion.span animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 2, repeat: Infinity }}
            className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
          <p className="text-gray-500 text-xs">{stat.sub}</p>
        </div>
        <p className="text-gray-600 text-[10px] mt-0.5">{stat.label}</p>
      </div>
    </motion.div>
  );
}

/* ─── Chart Card Shell ─── */
function ChartCard({ title, subtitle, children, delay = 0, action }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-2xl border border-[#1F2937] bg-[#111827] overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#1F2937]">
        <div>
          <h3 className="text-white font-semibold text-sm">{title}</h3>
          {subtitle && <p className="text-gray-600 text-[11px] mt-0.5">{subtitle}</p>}
        </div>
        {action && <div className="flex items-center gap-2">{action}</div>}
      </div>
      <div className="p-5">{children}</div>
    </motion.div>
  );
}


/* ─── Pie Legend ─── */
const PieLegend = ({ data }) => (
  <div className="space-y-2 mt-3">
    {data.map((item, i) => (
      <div key={i} className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: item.color }} />
          <span className="text-gray-400 text-xs">{item.name}</span>
        </div>
        <span className="text-white text-xs font-semibold">{item.value}</span>
      </div>
    ))}
  </div>
);

/* ─── Top Docs Table ─── */
function TopDocsTable({ docs }) {
  if (!docs.length) return <p className="text-gray-600 text-xs">No documents yet.</p>;
  const max = Math.max(...docs.map((d) => d.views));
  return (
    <div className="space-y-3">
      {docs.map((doc, i) => (
        <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.07 }}
          className="group flex items-center gap-3 hover:bg-white/[0.02] rounded-xl px-2 py-1.5 transition-colors cursor-pointer">
          <span className="text-gray-700 text-[11px] font-mono w-4 shrink-0">{i + 1}</span>
          <div className="flex-1 min-w-0">
            <p className="text-gray-300 text-xs font-medium truncate group-hover:text-white transition-colors">{doc.name}</p>
            <div className="mt-1 h-1.5 rounded-full bg-white/[0.05] overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: `${(doc.views / max) * 100}%` }}
                transition={{ duration: 1, delay: 0.3 + i * 0.1, ease: "easeOut" }}
                className="h-full rounded-full" style={{ background: doc.color }} />
            </div>
          </div>
          <div className="text-right shrink-0">
            <p className="text-white text-xs font-semibold">{doc.views}</p>
            <p className="text-gray-600 text-[10px]">KB</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════════ */
export default function AnalyticsPage() {
  const [range, setRange]         = useState("7d");
  const [chartView, setChartView] = useState("uploads");

  const [analyticsData, setAnalyticsData] = useState({
    totalDocs:        0,
    aiSummaries:      0,
    storageGB:        "0.0000",
    storageBreakdown: [{ name: "Empty", value: 1, color: "#4b5563" }],
    topDocs:          [],
  });

  /* Fetch real data */
  useEffect(() => {
    const fetchRealData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res   = await axios.get("http://localhost:5000/api/documents/all", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.data.success) return;

        const docs        = res.data.documents;
        const totalDocs   = docs.length;
        const aiSummaries = docs.filter((d) => d.summary).length;
        const totalBytes  = docs.reduce((acc, d) => acc + (d.fileSize || 0), 0);
        const storageGB   = (totalBytes / (1024 * 1024 * 1024)).toFixed(4);

        let pdf = 0, docx = 0, txt = 0, img = 0;
        docs.forEach((d) => {
          const ext = (d.fileType || d.title || "").toLowerCase();
          if      (ext.includes("pdf"))                           pdf++;
          else if (ext.includes("word") || ext.includes("docx")) docx++;
          else if (ext.includes("text") || ext.includes("txt"))  txt++;
          else                                                    img++;
        });

        const storageBreakdown = [
          { name: "PDFs",   value: pdf,  color: "#3b82f6" },
          { name: "DOCX",   value: docx, color: "#8b5cf6" },
          { name: "Images", value: img,  color: "#10b981" },
          { name: "TXT",    value: txt,  color: "#f59e0b" },
        ].filter((item) => item.value > 0);

        const topDocs = [...docs]
          .sort((a, b) => (b.fileSize || 0) - (a.fileSize || 0))
          .slice(0, 5)
          .map((d) => ({
            name:  d.title,
            views: Math.max(1, Math.round((d.fileSize || 0) / 1024)),
            color: "#3b82f6",
          }));

        // --- CHANGED: Retrieve real-time search data from local storage ---
        const recentSearchesRaw = localStorage.getItem("recentSearches");
        const recentSearches = recentSearchesRaw ? JSON.parse(recentSearchesRaw) : [];

        // CALCULATE REAL DOCUMENT ACTIVITY TIMELINE (Grouped by Day of Week)
        const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const calculatedActivity = daysOfWeek.map((day, idx) => {
          const dayDocs = docs.filter(d => new Date(d.createdAt).getDay() === idx);
          // --- CHANGED: Filter searches by day of the week ---
          const daySearches = recentSearches.filter(s => new Date(s.id).getDay() === idx);
          return {
            day,
            uploads: dayDocs.length,
            summaries: dayDocs.filter(d => d.summary).length,
            searches: daySearches.length // --- CHANGED: Injected real search count ---
          };
        });

        // CALCULATE REAL AI METRICS
        const calculatedAiUsage = [
          { label: "Document Summarization", value: aiSummaries, color: "#8b5cf6" },
          // --- CHANGED: Use actual search query count instead of calculated dummy math ---
          { label: "Smart Search Queries",   value: recentSearches.length, color: "#3b82f6" },
          { label: "OCR Text Extraction",    value: pdf, color: "#10b981" },
          { label: "Workflow Automation",    value: Math.max(0, aiSummaries - 1), color: "#f59e0b" },
          { label: "File Classification",    value: totalDocs, color: "#06b6d4" },
        ];

        setAnalyticsData({
          totalDocs,
          aiSummaries,
          storageGB,
          storageBreakdown: storageBreakdown.length > 0
            ? storageBreakdown
            : [{ name: "Empty", value: 1, color: "#4b5563" }],
          topDocs,
          activityTimeline: calculatedActivity,
          aiUsageStats: calculatedAiUsage
        });
      } catch (err) {
        console.error("Failed to fetch analytics:", err);
      }
    };
    fetchRealData();
  }, []);


  /* Share link */
  const handleShareLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Dashboard link copied to clipboard!");
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const dynamicStatCards = [
    {
      label: "Documents Processed", value: analyticsData.totalDocs,
      change: "Real-time", trend: "up", icon: <FiFileText />,
      color: "text-blue-400",   bg: "bg-blue-500/10",   border: "border-blue-500/20",
      glow: "rgba(59,130,246,0.2)",  gradient: "from-blue-500 to-indigo-500", sub: "Total uploaded",
    },
    {
      label: "AI Summaries", value: analyticsData.aiSummaries,
      change: "Real-time", trend: "up", icon: <FiZap />,
      color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20",
      glow: "rgba(139,92,246,0.2)",  gradient: "from-purple-500 to-pink-500",  sub: "Total generated",
    },
    {
      label: "Storage Used", value: `${analyticsData.storageGB} GB`,
      change: "Real-time", trend: "up", icon: <FiCloud />,
      color: "text-cyan-400",   bg: "bg-cyan-500/10",   border: "border-cyan-500/20",
      glow: "rgba(6,182,212,0.2)",   gradient: "from-cyan-500 to-teal-500",   sub: "of 50 GB",
    },
  ];

  const chartLines = {
    uploads: [
      { key: "uploads",   color: "#3b82f6", label: "Uploads"   },
      { key: "summaries", color: "#8b5cf6", label: "Summaries" },
    ],
    searches: [
      { key: "searches", color: "#06b6d4", label: "Searches" },
    ],
  };

  return (
    <div className="min-h-screen bg-[#0B0F19]" style={{ fontFamily: "'Poppins', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');`}</style>

      {/* Ambient blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div animate={{ scale: [1, 1.15, 1], opacity: [0.06, 0.11, 0.06] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-0 left-1/4 w-[700px] h-[400px] bg-blue-600 blur-[140px] rounded-full" />
        <motion.div animate={{ scale: [1, 1.1, 1], opacity: [0.04, 0.08, 0.04] }}
          transition={{ duration: 13, repeat: Infinity, delay: 3 }}
          className="absolute bottom-0 right-1/4 w-[500px] h-[400px] bg-purple-600 blur-[140px] rounded-full" />
        <div className="absolute inset-0 opacity-[0.025]"
          style={{ backgroundImage: "linear-gradient(rgba(100,200,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(100,200,255,1) 1px,transparent 1px)", backgroundSize: "50px 50px" }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-10">

        {/* Page Header */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <FiActivity className="text-lg" />
            </div>
            <div>
              <h1 className="text-white font-bold text-xl tracking-tight">Analytics</h1>
              <div className="flex items-center gap-1.5">
                <motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.8, repeat: Infinity }}
                  className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <p className="text-gray-500 text-sm">Real-time workspace insights</p>
              </div>
            </div>
          </div>
          {/* REPLACE YOUR CURRENT HEADER BUTTON CLUSTER WITH THIS */}
          <div className="flex items-center gap-2 shrink-0">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} onClick={handleShareLink}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#1F2937] bg-white/[0.03] text-gray-400 text-xs hover:text-white hover:bg-white/[0.06] transition-all">
              <FiShare2 className="text-xs" /> Share
            </motion.button>
          </div>    
        </motion.div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
          {dynamicStatCards.map((stat, i) => <StatCard key={i} stat={stat} index={i} />)}
        </div>

        {/* Row 1: Activity + Storage */}
        <div className="grid xl:grid-cols-3 gap-5 mb-5">
          <div className="xl:col-span-2">
            <ChartCard
              title="Document Activity"
              subtitle={`${range} overview — uploads, summaries & searches`}
              delay={0.15}
              action={
                <div className="flex items-center gap-1 p-1 rounded-xl border border-[#1F2937] bg-white/[0.02]">
                  {["uploads", "searches"].map((v) => (
                    <motion.button key={v} whileHover={{ scale: 1.05 }} onClick={() => setChartView(v)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-medium capitalize transition-all ${chartView === v ? "bg-blue-500/15 border border-blue-500/20 text-blue-300" : "text-gray-600 hover:text-gray-300"}`}>
                      {v}
                    </motion.button>
                  ))}
                </div>
              }
            >
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={analyticsData.activityTimeline || []} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
                  <defs>
                    {chartLines[chartView].map((line) => (
                      <linearGradient key={line.key} id={`grad-${line.key}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%"   stopColor={line.color} stopOpacity={0.25} />
                        <stop offset="100%" stopColor={line.color} stopOpacity={0}    />
                      </linearGradient>
                    ))}
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="day" tick={{ fill: "#4b5563", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis              tick={{ fill: "#4b5563", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} cursor={{ stroke: "rgba(255,255,255,0.06)", strokeWidth: 1 }} />
                  {chartLines[chartView].map((line) => (
                    <Area key={line.key} type="monotone" dataKey={line.key} name={line.label}
                      stroke={line.color} strokeWidth={2} fill={`url(#grad-${line.key})`}
                      dot={{ fill: line.color, r: 3, strokeWidth: 0 }}
                      activeDot={{ r: 5, fill: line.color, stroke: "rgba(0,0,0,0.3)", strokeWidth: 2 }} />
                  ))}
                </AreaChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          <ChartCard title="Storage Breakdown" subtitle="By file type" delay={0.2}>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={analyticsData.storageBreakdown} cx="50%" cy="50%"
                  innerRadius={46} outerRadius={68} paddingAngle={3} dataKey="value" strokeWidth={0}>
                  {analyticsData.storageBreakdown.map((entry, i) => (
                    <Cell key={i} fill={entry.color} opacity={0.9} />
                  ))}
                </Pie>
                <Tooltip content={({ active, payload }) =>
                  active && payload?.length ? (
                    <div className="px-2.5 py-2 rounded-xl border border-white/10 bg-[#111827] text-xs text-white">
                      {payload[0].name}: <strong>{payload[0].value} {payload[0].name === "Empty" ? "" : "files"}</strong>
                    </div>
                  ) : null} />
              </PieChart>
            </ResponsiveContainer>
            <PieLegend data={analyticsData.storageBreakdown} />
          </ChartCard>
        </div>


        {/* Bottom Row */}
        <div className="grid xl:grid-cols-2 gap-5">
          <ChartCard title="Top Documents" subtitle="Largest documents in workspace (KB)" delay={0.35}>
            <TopDocsTable docs={analyticsData.topDocs} />
          </ChartCard>

          <ChartCard title="AI Usage Breakdown" subtitle="Requests by feature" delay={0.4}>
            <div className="space-y-3">
              {(analyticsData.aiUsageStats || []).map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.07 }}
                  className="flex items-center gap-3 group">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs"
                    style={{ background: `${item.color}18`, border: `1px solid ${item.color}30`, color: item.color }}>
                    {[<FiZap />, <FiActivity />, <FiFileText />, <FiTrendingUp />, <FiFilter />][i]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-gray-400 text-xs group-hover:text-white transition-colors truncate">{item.label}</span>
                      <span className="text-white text-xs font-semibold ml-2 shrink-0">{item.value}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/[0.05] overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(item.value / 68) * 100}%` }}
                        transition={{ duration: 1, delay: 0.6 + i * 0.07, ease: "easeOut" }}
                        className="h-full rounded-full"
                        style={{ background: item.color }}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="mt-5 pt-4 border-t border-[#1F2937] flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-600 text-[11px]">
                <FiClock className="text-[10px]" /> Updated just now
              </div>
              <div className="flex items-center gap-1 text-emerald-400 text-xs font-semibold">
                <FiArrowUp className="text-[10px]" /> 22% vs last {range}
              </div>
            </div>
          </ChartCard>
        </div>

      </div>
    </div>
  );
}