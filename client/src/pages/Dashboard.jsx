import React, { useState, useContext } from "react"; // Added useContext import hook
import { AuthContext } from "../context/AuthContext"; // Imported global AuthContext
import { useNavigate } from "react-router-dom"; // Imported programmatic route navigation hook
import toast from "react-hot-toast"; // Imported active alert engine
import { motion, AnimatePresence } from "framer-motion";
import {
  FiHome, FiFileText, FiSearch, FiSettings, FiUpload,
  FiBell, FiChevronLeft, FiCpu, FiZap, FiShield, FiCloud,
  FiMoreHorizontal, FiTrendingUp, FiUsers, FiActivity,
  FiArrowUp, FiGrid, FiStar, FiFolder, FiDownload, FiEye, 
  FiMessageSquare, FiMenu, FiX, FiPlus, FiChevronRight, FiLogOut
} from "react-icons/fi";

/* ─── FAKE DATA ─── */
const recentDocs = [
  { name: "Q4 Financial Report.pdf", type: "PDF", size: "2.4 MB", time: "2m ago", status: "Summarized", color: "from-blue-500 to-indigo-600", icon: <FiFileText /> },
  { name: "Product Roadmap 2025.docx", type: "DOCX", size: "1.1 MB", time: "18m ago", status: "Processing", color: "from-purple-500 to-pink-500", icon: <FiGrid /> },
  { name: "Legal Contract — NDA.pdf", type: "PDF", size: "890 KB", time: "1h ago", status: "Summarized", color: "from-emerald-500 to-teal-500", icon: <FiShield /> },
  { name: "Team Meeting Notes.txt", type: "TXT", size: "45 KB", time: "3h ago", status: "Summarized", color: "from-amber-500 to-orange-500", icon: <FiMessageSquare /> },
];

const summaries = [
  { title: "Q4 Financial Report", insight: "Revenue up 34% YoY. Operating margin improved to 22%. Key risk: rising CAC in enterprise segment.", tags: ["Finance", "Q4"], starred: true },
  { title: "Product Roadmap 2025", insight: "Three major launches planned: AI search (Q1), mobile app (Q2), API v3 (Q3). Engineering headcount to grow 40%.", tags: ["Product", "Strategy"], starred: false },
  { title: "Legal Contract — NDA", insight: "Standard mutual NDA. 2-year term. No unusual clauses. Jurisdiction: Delaware. Recommend legal review of §4.2.", tags: ["Legal"], starred: true },
];

const stats = [
  { label: "Documents Processed", value: "1,284", change: "+12%", icon: <FiFileText />, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
  { label: "AI Summaries", value: "847", change: "+28%", icon: <FiZap />, color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
  { label: "Storage Used", value: "24.6 GB", change: "+5%", icon: <FiCloud />, color: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/20" },
  { label: "Active Users", value: "38", change: "+3", icon: <FiUsers />, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
];

const activity = [
  { user: "You", action: "uploaded", target: "Q4 Financial Report.pdf", time: "2m ago", icon: <FiUpload />, color: "text-blue-400" },
  { user: "Sarah K.", action: "shared", target: "NDA Contract.pdf", time: "14m ago", icon: <FiUsers />, color: "text-purple-400" },
  { user: "AI", action: "summarized", target: "Product Roadmap 2025", time: "32m ago", icon: <FiZap />, color: "text-cyan-400" },
  { user: "You", action: "searched", target: '"quarterly revenue"', time: "1h ago", icon: <FiSearch />, color: "text-emerald-400" },
  { user: "Mark T.", action: "downloaded", target: "Team Meeting Notes.txt", time: "2h ago", icon: <FiDownload />, color: "text-amber-400" },
];

const navItems = [
  { icon: <FiHome />, label: "Dashboard", active: true },
  { icon: <FiFileText />, label: "Documents", badge: "1.2k" },
  { icon: <FiSearch />, label: "Smart Search" },
  { icon: <FiZap />, label: "AI Summaries", badge: "3" },
  { icon: <FiFolder />, label: "Collections" },
  { icon: <FiActivity />, label: "Analytics" },
  { icon: <FiSettings />, label: "Settings" },
];

/* ─── UPLOAD MODAL ─── */
function UploadModal({ onClose }) {
  const [dragging, setDragging] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ type: "spring", stiffness: 280, damping: 24 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-3xl border border-white/10 bg-[#111827] p-8 shadow-2xl"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white font-semibold text-lg">Upload Document</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            <FiX />
          </button>
        </div>

        <motion.div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={() => setDragging(false)}
          animate={{ borderColor: dragging ? "rgba(59,130,246,0.6)" : "rgba(255,255,255,0.08)", background: dragging ? "rgba(59,130,246,0.05)" : "rgba(255,255,255,0.02)" }}
          transition={{ duration: 0.2 }}
          className="rounded-2xl border-2 border-dashed p-10 flex flex-col items-center gap-3 cursor-pointer mb-6"
        >
          <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 text-2xl">
            <FiUpload />
          </div>
          <p className="text-white font-medium text-sm">Drop files here or click to browse</p>
          <p className="text-gray-500 text-xs">PDF, DOCX, TXT, PNG up to 50 MB</p>
        </motion.div>

        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 rounded-xl border border-white/10 bg-white/5 text-gray-300 text-sm hover:bg-white/10 transition-all">
            Cancel
          </button>
          <motion.button
            whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(59,130,246,0.4)" }}
            whileTap={{ scale: 0.98 }}
            onClick={onClose}
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm font-semibold"
          >
            Upload & Analyze
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── SIDEBAR ─── */
function Sidebar({ collapsed, setCollapsed, onLogout }) { // Passed down the unified logout tracking callback
  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 240 }}
      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
      className="relative shrink-0 h-screen bg-[#0B0F19] border-r border-[#1F2937] flex flex-col overflow-hidden z-20"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-[#1F2937]">
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="w-9 h-9 shrink-0 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.4)]"
        >
          <FiCpu className="text-white text-base" />
        </motion.div>
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.2 }}
              className="text-white font-semibold text-lg tracking-tight whitespace-nowrap"
            >
              DocuMind
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-hidden">
        {navItems.map((item, i) => (
          <motion.button
            key={i}
            whileHover={{ x: collapsed ? 0 : 3 }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative
              ${item.active
                ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                : "text-gray-500 hover:text-white hover:bg-white/5"
              }`}
          >
            <span className="text-lg shrink-0">{item.icon}</span>
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="whitespace-nowrap flex-1 text-left"
                >
                  {item.label}
                </motion.span>
              )}
            </AnimatePresence>
            {!collapsed && item.badge && (
              <span className="px-1.5 py-0.5 rounded-full bg-blue-500/15 text-blue-400 text-[10px] font-semibold">
                {item.badge}
              </span>
            )}
          </motion.button>
        ))}

        {/* Dynamic Action Trigger Button item for Logout workflows directly in the side navigation panel */}
        <motion.button
          whileHover={{ x: collapsed ? 0 : 3 }}
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200 group relative"
        >
          <span className="text-lg shrink-0"><FiLogOut /></span>
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="whitespace-nowrap flex-1 text-left"
              >
                Logout
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </nav>

      {/* Storage bar */}
      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mx-3 mb-4 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06]"
          >
            <div className="flex justify-between text-xs mb-2">
              <span className="text-gray-400 font-medium">Storage</span>
              <span className="text-gray-500">24.6 / 50 GB</span>
            </div>
            <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "49%" }}
                transition={{ duration: 1.2, ease: "easeOut", delay: 0.5 }}
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Collapse toggle */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3.5 top-6 w-7 h-7 rounded-full bg-[#1F2937] border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors z-30"
      >
        <motion.div animate={{ rotate: collapsed ? 180 : 0 }} transition={{ duration: 0.3 }}>
          <FiChevronLeft className="text-xs" />
        </motion.div>
      </motion.button>
    </motion.aside>
  );
}

/* ─── TOP NAVBAR ─── */
function Topbar({ onUpload, sidebarCollapsed, setSidebarCollapsed, user, onLogout }) {
  // Parsing algorithm to dynamically compute uppercase name abbreviations for active profiles
  const getInitials = (name) => {
    if (!name) return "U";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  return (
    <header className="h-16 border-b border-[#1F2937] bg-[#0B0F19]/80 backdrop-blur-xl flex items-center justify-between px-6 shrink-0 sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="md:hidden text-gray-400 hover:text-white transition-colors"
        >
          <FiMenu />
        </button>
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 text-sm" />
          <input
            type="text"
            placeholder="Search documents, summaries…"
            className="pl-9 pr-4 py-2 w-72 rounded-xl bg-white/[0.04] border border-white/[0.07] text-gray-300 text-sm placeholder-gray-600 focus:outline-none focus:border-blue-500/40 focus:bg-white/[0.06] transition-all duration-300"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-600 font-mono">⌘K</kbd>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <motion.button
          whileHover={{ scale: 1.04, boxShadow: "0 0 20px rgba(59,130,246,0.35)" }}
          whileTap={{ scale: 0.97 }}
          onClick={onUpload}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm font-semibold"
        >
          <FiPlus className="text-sm" />
          Upload Doc
        </motion.button>

        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.08 }}
            className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
          >
            <FiBell />
          </motion.button>
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center text-[9px] text-white font-bold">3</span>
        </div>

        {/* Dynamic Context Header Status indicators mapping verified users accounts */}
        <div className="flex items-center gap-2.5 pl-3 border-l border-white/10">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-xs font-bold shadow-md">
            {getInitials(user?.name)} {/* Loaded calculated initials fallback token */}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-white text-xs font-medium leading-none max-w-[110px] truncate">{user?.name || "Active Workspace"}</p>
            <p className="text-gray-500 text-[10px] mt-1 max-w-[110px] truncate">{user?.email}</p>
          </div>
          {/* Header specific direct inline button wrapper for running state modifications */}
          <button 
            onClick={onLogout} 
            className="text-gray-500 hover:text-red-400 transition-colors ml-1 p-1 hover:bg-white/5 rounded-lg"
            title="Sign Out"
          >
            <FiLogOut className="text-sm" />
          </button>
        </div>
      </div>
    </header>
  );
}

/* ─── WELCOME BANNER ─── */
function WelcomeBanner({ onUpload, user }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative rounded-3xl border border-white/[0.07] bg-gradient-to-br from-blue-600/20 via-indigo-600/10 to-purple-600/10 p-7 overflow-hidden mb-6"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-48 h-48 bg-purple-500/10 blur-[80px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(100,200,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(100,200,255,1) 1px,transparent 1px)", backgroundSize: "40px 40px" }} />

      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div className="text-left">
          <div className="flex items-center gap-2 mb-2">
            <motion.span animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 2, repeat: Infinity }} className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-emerald-300 text-xs font-semibold uppercase tracking-widest">AI Ready</span>
          </div>
          {/* Linked layout greetings directly with contextual parsed object indices */}
          <h1 className="text-white text-2xl font-bold tracking-tight mb-1">Good morning, {user?.name?.split(" ")[0] || "User"} 👋</h1>
          <p className="text-gray-400 text-sm">You have 3 documents pending AI analysis. Upload more to get started.</p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(59,130,246,0.45)" }}
            whileTap={{ scale: 0.97 }}
            onClick={onUpload}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold text-sm"
          >
            <FiUpload />
            Upload Document
            <motion.span animate={{ x: [0, 3, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
              <FiChevronRight className="text-xs" />
            </motion.span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── STATS SECTION ─── */
function StatsSection() {
  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
      {stats.map((s, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 + i * 0.08 }}
          whileHover={{ y: -3, scale: 1.02 }}
          className="rounded-2xl border border-[#1F2937] bg-[#111827] p-5 cursor-pointer transition-all duration-300 hover:border-white/10"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`w-10 h-10 rounded-xl ${s.bg} border ${s.border} flex items-center justify-center ${s.color} text-lg`}>
              {s.icon}
            </div>
            <span className="flex items-center gap-1 text-emerald-400 text-xs font-semibold">
              <FiArrowUp className="text-[10px]" /> {s.change}
            </span>
          </div>
          <p className="text-white text-2xl font-bold mb-0.5 text-left">{s.value}</p>
          <p className="text-gray-500 text-xs text-left">{s.label}</p>
        </motion.div>
      ))}
    </div>
  );
}

/* ─── RECENT DOCUMENTS ─── */
function RecentDocuments({ onUpload }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="rounded-2xl border border-[#1F2937] bg-[#111827] overflow-hidden mb-6"
    >
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#1F2937]">
        <h2 className="text-white font-semibold text-sm">Recent Documents</h2>
        <div className="flex items-center gap-2">
          <motion.button whileHover={{ scale: 1.05 }} onClick={onUpload} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium hover:bg-blue-500/15 transition-all">
            <FiPlus className="text-xs" /> Upload
          </motion.button>
          <button className="text-gray-500 hover:text-white text-xs transition-colors">View all</button>
        </div>
      </div>

      <div className="divide-y divide-[#1F2937]">
        {recentDocs.map((doc, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + i * 0.07 }}
            whileHover={{ backgroundColor: "rgba(255,255,255,0.02)" }}
            className="flex items-center gap-4 px-6 py-4 cursor-pointer group transition-colors duration-200"
          >
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${doc.color} flex items-center justify-center text-white text-sm shrink-0`}>
              {doc.icon}
            </div>
            <div className="flex-1 min-w-0 text-left">
              <p className="text-white text-sm font-medium truncate group-hover:text-blue-300 transition-colors">{doc.name}</p>
              <p className="text-gray-500 text-xs mt-0.5">{doc.type} · {doc.size} · {doc.time}</p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold ${
                doc.status === "Summarized"
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
              }`}>
                {doc.status}
              </span>
              <button className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-white transition-all">
                <FiMoreHorizontal />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

/* ─── AI SUMMARY CARDS ─── */
function AiSummaries() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="rounded-2xl border border-[#1F2937] bg-[#111827] overflow-hidden mb-6"
    >
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#1F2937]">
        <div className="flex items-center gap-2">
          <h2 className="text-white font-semibold text-sm">AI Summaries</h2>
          <span className="px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-[10px] font-semibold">3 new</span>
        </div>
        <button className="text-gray-500 hover:text-white text-xs transition-colors">View all</button>
      </div>

      <div className="p-4 space-y-3">
        {summaries.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + i * 0.09 }}
            whileHover={{ scale: 1.01, borderColor: "rgba(139,92,246,0.25)" }}
            className="p-4 rounded-xl border border-[#1F2937] bg-white/[0.02] cursor-pointer transition-all duration-200 group"
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <p className="text-white text-sm font-semibold group-hover:text-purple-300 transition-colors text-left">{s.title}</p>
              <div className="flex items-center gap-2 shrink-0">
                {s.starred && <FiStar className="text-amber-400 text-xs" />}
                <div className="w-6 h-6 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                  <FiZap className="text-purple-400 text-[10px]" />
                </div>
              </div>
            </div>
            <p className="text-gray-400 text-xs leading-relaxed mb-3 text-left">{s.insight}</p>
            <div className="flex items-center gap-2">
              {s.tags.map((tag, j) => (
                <span key={j} className="px-2 py-0.5 rounded-full bg-white/5 border border-white/[0.07] text-gray-400 text-[10px]">{tag}</span>
              ))}
              <button className="ml-auto opacity-0 group-hover:opacity-100 flex items-center gap-1 text-purple-400 text-[10px] font-medium transition-all">
                <FiEye className="text-[10px]" /> View full
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

/* ─── ACTIVITY FEED ─── */
function ActivityFeed() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.45 }}
      className="rounded-2xl border border-[#1F2937] bg-[#111827] overflow-hidden"
    >
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#1F2937]">
        <h2 className="text-white font-semibold text-sm">Recent Activity</h2>
        <button className="text-gray-500 hover:text-white text-xs transition-colors">Clear all</button>
      </div>
      <div className="divide-y divide-[#1F2937]">
        {activity.map((a, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55 + i * 0.07 }}
            className="flex items-center gap-4 px-6 py-3.5 hover:bg-white/[0.02] transition-colors cursor-pointer"
          >
            <div className={`w-8 h-8 rounded-xl bg-white/5 border border-white/[0.06] flex items-center justify-center ${a.color} text-sm shrink-0`}>
              {a.icon}
            </div>
            <div className="flex-1 min-w-0 text-left">
              <p className="text-gray-300 text-xs">
                <span className="text-white font-medium">{a.user}</span>{" "}
                {a.action}{" "}
                <span className="text-gray-300">{a.target}</span>
              </p>
            </div>
            <span className="text-gray-600 text-[10px] shrink-0">{a.time}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

/* ─── QUICK ACTIONS ─── */
function QuickActions({ onUpload }) {
  const actions = [
    { icon: <FiUpload />, label: "Upload", color: "from-blue-500 to-indigo-500", glow: "rgba(59,130,246,0.3)", onClick: onUpload },
    { icon: <FiSearch />, label: "Search", color: "from-purple-500 to-pink-500", glow: "rgba(139,92,246,0.3)" },
    { icon: <FiZap />, label: "Summarize", color: "from-cyan-500 to-blue-500", glow: "rgba(6,182,212,0.3)" },
    { icon: <FiTrendingUp />, label: "Analytics", color: "from-emerald-500 to-teal-500", glow: "rgba(16,185,129,0.3)" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.25 }}
      className="grid grid-cols-4 gap-3 mb-6"
    >
      {actions.map((a, i) => (
        <motion.button
          key={i}
          whileHover={{ scale: 1.05, boxShadow: `0 0 25px ${a.glow}` }}
          whileTap={{ scale: 0.97 }}
          onClick={a.onClick}
          className="flex flex-col items-center gap-2 py-4 rounded-2xl border border-[#1F2937] bg-[#111827] hover:border-white/10 transition-all duration-300"
        >
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${a.color} flex items-center justify-center text-white text-base`}>
            {a.icon}
          </div>
          <span className="text-gray-400 text-xs font-medium">{a.label}</span>
        </motion.button>
      ))}
    </motion.div>
  );
}

/* ─── MAIN DASHBOARD ─── */
export default function Dashboard() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const { user, logout } = useContext(AuthContext); // Initialized local Context references
  const navigate = useNavigate();

  // Executed continuous sign-out logic sequence safely routing back onto the landing page index
  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <div className="flex h-screen bg-[#0B0F19] overflow-hidden" style={{ fontFamily: "'Poppins', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap'); * { scrollbar-width: thin; scrollbar-color: #1F2937 transparent; } ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: #1F2937; border-radius: 99px; }`}</style>

      {/* Sidebar Layout */}
      <div className="hidden md:block">
        <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} onLogout={handleLogout} />
      </div>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar
          onUpload={() => setUploadOpen(true)}
          sidebarCollapsed={sidebarCollapsed}
          setSidebarCollapsed={setSidebarCollapsed}
          user={user}
          onLogout={handleLogout}
        />

        {/* Scrollable body */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-screen-xl mx-auto px-6 py-7">
            <WelcomeBanner onUpload={() => setUploadOpen(true)} user={user} />
            <StatsSection />
            <QuickActions onUpload={() => setUploadOpen(true)} />

            {/* Two-column layout for bottom sections */}
            <div className="grid xl:grid-cols-[1fr_380px] gap-6">
              <div>
                <RecentDocuments onUpload={() => setUploadOpen(true)} />
                <AiSummaries />
              </div>
              <div>
                <ActivityFeed />
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Upload Modal */}
      <AnimatePresence>
        {uploadOpen && <UploadModal onClose={() => setUploadOpen(false)} />}
      </AnimatePresence>
    </div>
  );
}