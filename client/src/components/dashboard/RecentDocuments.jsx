import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiFileText, FiUpload, FiMoreHorizontal, FiDownload,
  FiShare2, FiTrash2, FiEye, FiSearch, FiFilter,
  FiGrid, FiList, FiPlus, FiZap, FiCheck, FiX,
  FiClock, FiFolder, FiStar, FiChevronRight,
} from "react-icons/fi";

/* ─── Data ─── */
const documents = [
  {
    id: 1,
    name: "Q4 Financial Report",
    ext: "pdf",
    size: "2.4 MB",
    time: "2m ago",
    status: "Summarized",
    pages: 34,
    starred: true,
    owner: "You",
    gradient: "from-blue-500 to-indigo-600",
    accent: "#3b82f6",
    accentDim: "rgba(59,130,246,0.1)",
    accentBorder: "rgba(59,130,246,0.22)",
    accentText: "text-blue-300",
    statusBg: "bg-emerald-500/10 border-emerald-500/25 text-emerald-300",
    tag: "Finance",
  },
  {
    id: 2,
    name: "Product Roadmap 2025",
    ext: "docx",
    size: "1.1 MB",
    time: "18m ago",
    status: "Processing",
    pages: 12,
    starred: false,
    owner: "Sarah K.",
    gradient: "from-purple-500 to-pink-600",
    accent: "#8b5cf6",
    accentDim: "rgba(139,92,246,0.1)",
    accentBorder: "rgba(139,92,246,0.22)",
    accentText: "text-purple-300",
    statusBg: "bg-amber-500/10 border-amber-500/25 text-amber-300",
    tag: "Product",
  },
  {
    id: 3,
    name: "Legal Contract — NDA",
    ext: "pdf",
    size: "890 KB",
    time: "1h ago",
    status: "Summarized",
    pages: 8,
    starred: true,
    owner: "Mark T.",
    gradient: "from-emerald-500 to-teal-600",
    accent: "#10b981",
    accentDim: "rgba(16,185,129,0.1)",
    accentBorder: "rgba(16,185,129,0.22)",
    accentText: "text-emerald-300",
    statusBg: "bg-emerald-500/10 border-emerald-500/25 text-emerald-300",
    tag: "Legal",
  },
  {
    id: 4,
    name: "Team Meeting Notes",
    ext: "txt",
    size: "45 KB",
    time: "3h ago",
    status: "Summarized",
    pages: 3,
    starred: false,
    owner: "You",
    gradient: "from-amber-500 to-orange-600",
    accent: "#f59e0b",
    accentDim: "rgba(245,158,11,0.1)",
    accentBorder: "rgba(245,158,11,0.22)",
    accentText: "text-amber-300",
    statusBg: "bg-emerald-500/10 border-emerald-500/25 text-emerald-300",
    tag: "Meetings",
  },
  {
    id: 5,
    name: "Brand Guidelines v3",
    ext: "pdf",
    size: "5.8 MB",
    time: "6h ago",
    status: "Queued",
    pages: 48,
    starred: false,
    owner: "You",
    gradient: "from-rose-500 to-pink-600",
    accent: "#f43f5e",
    accentDim: "rgba(244,63,94,0.1)",
    accentBorder: "rgba(244,63,94,0.22)",
    accentText: "text-rose-300",
    statusBg: "bg-gray-500/10 border-gray-500/25 text-gray-400",
    tag: "Design",
  },
  {
    id: 6,
    name: "Market Research 2025",
    ext: "docx",
    size: "3.2 MB",
    time: "Yesterday",
    status: "Summarized",
    pages: 22,
    starred: false,
    owner: "Jamie L.",
    gradient: "from-cyan-500 to-blue-600",
    accent: "#06b6d4",
    accentDim: "rgba(6,182,212,0.1)",
    accentBorder: "rgba(6,182,212,0.22)",
    accentText: "text-cyan-300",
    statusBg: "bg-emerald-500/10 border-emerald-500/25 text-emerald-300",
    tag: "Research",
  },
];

/* ─── File Icon ─── */
function FileIcon({ ext, gradient, size = "md" }) {
  const sz = size === "sm" ? "w-8 h-8 text-xs" : "w-10 h-10 text-sm";
  return (
    <div className={`${sz} rounded-xl bg-gradient-to-br ${gradient} flex flex-col items-center justify-center gap-0.5 shrink-0`}>
      <FiFileText className="text-white" />
      <span className="text-white/70 text-[7px] font-bold uppercase leading-none">{ext}</span>
    </div>
  );
}

/* ─── Status Badge ─── */
function StatusBadge({ status, bg }) {
  const icon = status === "Summarized"
    ? <FiZap className="text-[9px]" />
    : status === "Processing"
    ? <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}><FiClock className="text-[9px]" /></motion.div>
    : <FiClock className="text-[9px]" />;

  return (
    <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border shrink-0 ${bg}`}>
      {icon} {status}
    </span>
  );
}

/* ─── Context Menu ─── */
function ContextMenu({ doc, onClose, accentText, accentDim, accentBorder }) {
  const items = [
    { icon: <FiEye />, label: "View document" },
    { icon: <FiZap />, label: "Summarize now" },
    { icon: <FiShare2 />, label: "Share" },
    { icon: <FiDownload />, label: "Download" },
    { icon: <FiTrash2 />, label: "Delete", danger: true },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: -6 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.92, y: -6 }}
      transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
      className="absolute right-0 top-full mt-1.5 w-48 rounded-2xl border border-[#1F2937] overflow-hidden shadow-2xl z-30"
      style={{ background: "rgba(17,24,39,0.98)", backdropFilter: "blur(16px)" }}
      onClick={(e) => e.stopPropagation()}
    >
      {items.map((item, i) => (
        <motion.button
          key={i}
          whileHover={{ backgroundColor: item.danger ? "rgba(239,68,68,0.07)" : "rgba(255,255,255,0.04)" }}
          onClick={onClose}
          className={`w-full flex items-center gap-3 px-4 py-2.5 text-xs transition-colors duration-150 ${
            item.danger ? "text-red-400" : "text-gray-300"
          } ${i !== 0 ? "border-t border-white/[0.04]" : ""}`}
        >
          <span className={item.danger ? "text-red-400" : "text-gray-500"}>{item.icon}</span>
          {item.label}
        </motion.button>
      ))}
    </motion.div>
  );
}

/* ─── Upload Modal ─── */
function UploadModal({ onClose }) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleUpload = () => {
    setUploading(true);
    let p = 0;
    const iv = setInterval(() => {
      p += Math.random() * 18;
      if (p >= 100) { p = 100; clearInterval(iv); setTimeout(onClose, 600); }
      setProgress(Math.min(p, 100));
    }, 180);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(10px)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 24 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 26 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-3xl border border-white/10 bg-[#111827] p-8 shadow-2xl"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white font-semibold text-lg">Upload Document</h2>
          <motion.button whileHover={{ scale: 1.1, rotate: 90 }} onClick={onClose} className="text-gray-500 hover:text-white transition-colors"><FiX /></motion.button>
        </div>

        {uploading ? (
          <div className="py-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400"><FiFileText /></div>
              <div className="flex-1">
                <p className="text-white text-sm font-medium">Uploading document…</p>
                <p className="text-gray-500 text-xs">{Math.round(progress)}% complete</p>
              </div>
            </div>
            <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
              <motion.div
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }}
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"
              />
            </div>
          </div>
        ) : (
          <>
            <motion.div
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={() => setDragging(false)}
              animate={{ borderColor: dragging ? "rgba(59,130,246,0.7)" : "rgba(255,255,255,0.09)", background: dragging ? "rgba(59,130,246,0.05)" : "rgba(255,255,255,0.02)" }}
              transition={{ duration: 0.2 }}
              className="rounded-2xl border-2 border-dashed p-10 flex flex-col items-center gap-3 cursor-pointer mb-6"
            >
              <motion.div animate={{ y: dragging ? -6 : 0 }} className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 text-2xl"><FiUpload /></motion.div>
              <p className="text-white font-medium text-sm">Drop files here or click to browse</p>
              <p className="text-gray-500 text-xs">PDF, DOCX, TXT, PNG — up to 50 MB</p>
            </motion.div>
            <div className="flex gap-3">
              <button onClick={onClose} className="flex-1 py-3 rounded-xl border border-white/10 bg-white/5 text-gray-300 text-sm hover:bg-white/10 transition-all">Cancel</button>
              <motion.button whileHover={{ scale: 1.02, boxShadow: "0 0 22px rgba(59,130,246,0.4)" }} whileTap={{ scale: 0.98 }} onClick={handleUpload} className="flex-1 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm font-semibold">Upload & Analyze</motion.button>
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}

/* ─── Document Row (List View) ─── */
function DocRow({ doc, index, onDelete }) {
  const [hovered, setHovered] = useState(false);
  const [starred, setStarred] = useState(doc.starred);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 12, height: 0 }}
      transition={{ duration: 0.45, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setMenuOpen(false); }}
      className="relative flex items-center gap-4 px-5 py-3.5 transition-all duration-200 group cursor-pointer"
      style={{ backgroundColor: hovered ? "rgba(255,255,255,0.02)" : "transparent" }}
    >
      {/* Left accent bar */}
      <motion.div
        animate={{ opacity: hovered ? 1 : 0, scaleY: hovered ? 1 : 0.3 }}
        transition={{ duration: 0.2 }}
        className="absolute left-0 top-2 bottom-2 w-0.5 rounded-full"
        style={{ background: doc.accent }}
      />

      {/* File icon */}
      <motion.div animate={{ scale: hovered ? 1.06 : 1 }} transition={{ duration: 0.2 }}>
        <FileIcon ext={doc.ext} gradient={doc.gradient} />
      </motion.div>

      {/* Name + meta */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className={`text-sm font-medium truncate transition-colors duration-200 ${hovered ? "text-white" : "text-gray-200"}`}>
            {doc.name}
          </p>
          {starred && <FiStar className="text-amber-400 text-xs shrink-0" style={{ fill: "#f59e0b" }} />}
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-gray-600 text-[11px] uppercase font-semibold">{doc.ext}</span>
          <span className="text-gray-700 text-[10px]">·</span>
          <span className="text-gray-600 text-[11px]">{doc.size}</span>
          <span className="text-gray-700 text-[10px]">·</span>
          <span className="text-gray-600 text-[11px]">{doc.pages}p</span>
          <span className="text-gray-700 text-[10px]">·</span>
          <span className="text-gray-600 text-[11px]">{doc.owner}</span>
        </div>
      </div>

      {/* Tag chip */}
      <span className={`hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${doc.accentText} shrink-0`}
        style={{ background: doc.accentDim, borderColor: doc.accentBorder }}>
        {doc.tag}
      </span>

      {/* Time */}
      <div className="hidden md:flex items-center gap-1 text-gray-600 text-[11px] shrink-0">
        <FiClock className="text-[10px]" /> {doc.time}
      </div>

      {/* Status */}
      <StatusBadge status={doc.status} bg={doc.statusBg} />

      {/* Actions */}
      <div className={`flex items-center gap-1.5 transition-opacity duration-200 ${hovered ? "opacity-100" : "opacity-0"}`}>
        <motion.button whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.9 }}
          onClick={() => setStarred(!starred)}
          className="w-7 h-7 rounded-lg bg-white/5 border border-white/[0.07] flex items-center justify-center hover:bg-white/10 transition-all">
          <FiStar className={`text-xs ${starred ? "text-amber-400" : "text-gray-600"}`} style={{ fill: starred ? "#f59e0b" : "none" }} />
        </motion.button>
        <motion.button whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.9 }}
          className="w-7 h-7 rounded-lg bg-white/5 border border-white/[0.07] flex items-center justify-center text-gray-600 hover:text-gray-200 hover:bg-white/10 transition-all">
          <FiEye className="text-xs" />
        </motion.button>
        <div className="relative">
          <motion.button whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.9 }}
            onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen); }}
            className="w-7 h-7 rounded-lg bg-white/5 border border-white/[0.07] flex items-center justify-center text-gray-600 hover:text-gray-200 hover:bg-white/10 transition-all">
            <FiMoreHorizontal className="text-xs" />
          </motion.button>
          <AnimatePresence>
            {menuOpen && <ContextMenu doc={doc} onClose={() => setMenuOpen(false)} accentText={doc.accentText} accentDim={doc.accentDim} accentBorder={doc.accentBorder} />}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Document Card (Grid View) ─── */
function DocCard({ doc, index }) {
  const [hovered, setHovered] = useState(false);
  const [starred, setStarred] = useState(doc.starred);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.94 }}
      transition={{ duration: 0.45, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setMenuOpen(false); }}
      className="relative rounded-2xl border bg-[#111827] overflow-hidden cursor-pointer transition-all duration-300"
      style={{
        borderColor: hovered ? doc.accentBorder : "rgba(31,41,55,1)",
        boxShadow: hovered ? `0 0 32px ${doc.accentDim}, 0 4px 20px rgba(0,0,0,0.3)` : "0 2px 12px rgba(0,0,0,0.2)",
      }}
    >
      {/* Top gradient bar */}
      <motion.div animate={{ opacity: hovered ? 1 : 0, scaleX: hovered ? 1 : 0 }} transition={{ duration: 0.3 }}
        className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${doc.gradient} origin-left`} />

      {/* Corner glow */}
      <motion.div animate={{ opacity: hovered ? 1 : 0 }} transition={{ duration: 0.3 }}
        className="absolute -top-8 -right-8 w-28 h-28 rounded-full blur-[45px] pointer-events-none"
        style={{ background: doc.accentDim }} />

      {/* File preview area */}
      <div className={`relative h-24 bg-gradient-to-br ${doc.gradient} opacity-10`} />
      <div className="absolute top-4 left-4">
        <motion.div animate={{ scale: hovered ? 1.08 : 1 }} transition={{ duration: 0.25 }}>
          <FileIcon ext={doc.ext} gradient={doc.gradient} size="md" />
        </motion.div>
      </div>

      {/* Star + menu */}
      <div className="absolute top-3 right-3 flex items-center gap-1.5">
        <motion.button whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}
          onClick={(e) => { e.stopPropagation(); setStarred(!starred); }}
          className="w-6 h-6 rounded-lg bg-black/30 backdrop-blur-sm flex items-center justify-center">
          <FiStar className={`text-xs ${starred ? "text-amber-400" : "text-white/50"}`} style={{ fill: starred ? "#f59e0b" : "none" }} />
        </motion.button>
        <div className="relative">
          <motion.button whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}
            onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen); }}
            className="w-6 h-6 rounded-lg bg-black/30 backdrop-blur-sm flex items-center justify-center text-white/60 hover:text-white transition-colors">
            <FiMoreHorizontal className="text-xs" />
          </motion.button>
          <AnimatePresence>
            {menuOpen && <ContextMenu doc={doc} onClose={() => setMenuOpen(false)} accentText={doc.accentText} accentDim={doc.accentDim} accentBorder={doc.accentBorder} />}
          </AnimatePresence>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 pt-3">
        <p className={`text-sm font-semibold truncate mb-1 transition-colors ${hovered ? "text-white" : "text-gray-200"}`}>
          {doc.name}
        </p>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-gray-600 text-[11px] uppercase font-semibold">{doc.ext}</span>
          <span className="text-gray-700 text-[10px]">·</span>
          <span className="text-gray-600 text-[11px]">{doc.size}</span>
          <span className="text-gray-700 text-[10px]">·</span>
          <span className="text-gray-600 text-[11px]">{doc.pages}p</span>
        </div>
        <div className="flex items-center justify-between">
          <StatusBadge status={doc.status} bg={doc.statusBg} />
          <div className="flex items-center gap-1 text-gray-600 text-[10px]">
            <FiClock className="text-[9px]" /> {doc.time}
          </div>
        </div>

        {/* View on hover */}
        <motion.div
          animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 6 }}
          transition={{ duration: 0.2 }}
          className="mt-3 pt-3 border-t border-white/[0.05] flex items-center justify-between"
        >
          <span className={`text-[10px] font-medium ${doc.accentText}`}>{doc.owner}</span>
          <motion.span
            animate={{ x: hovered ? [0, 3, 0] : 0 }}
            transition={{ duration: 1, repeat: hovered ? Infinity : 0 }}
            className={`flex items-center gap-1 text-[10px] font-semibold ${doc.accentText}`}
          >
            View <FiChevronRight className="text-[10px]" />
          </motion.span>
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ─── Main Export ─── */
export default function RecentDocuments() {
  const [view, setView] = useState("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");
  const [docs, setDocs] = useState(documents);

  const filters = ["All", "PDF", "DOCX", "TXT", "Starred"];

  const filtered = docs.filter((d) => {
    const matchFilter = activeFilter === "All" ? true
      : activeFilter === "Starred" ? d.starred
      : d.ext.toLowerCase() === activeFilter.toLowerCase();
    const matchSearch = !searchQuery || d.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');`}</style>

      <div style={{ fontFamily: "'Poppins', sans-serif" }}>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 text-sm">
              <FiFolder />
            </div>
            <div>
              <h2 className="text-white font-semibold text-sm">Recent Documents</h2>
              <p className="text-gray-600 text-[10px]">{docs.length} documents · {docs.filter(d => d.status === "Summarized").length} summarized</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Search */}
            <motion.div
              animate={{ borderColor: searchFocused ? "rgba(59,130,246,0.4)" : "rgba(31,41,55,1)", boxShadow: searchFocused ? "0 0 0 3px rgba(59,130,246,0.06)" : "none" }}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl border bg-white/[0.03]"
            >
              <FiSearch className={`text-[11px] transition-colors ${searchFocused ? "text-blue-400" : "text-gray-600"}`} />
              <input
                type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)} onBlur={() => setSearchFocused(false)}
                placeholder="Search documents…"
                className="bg-transparent text-white placeholder-gray-700 outline-none text-[11px] w-32"
              />
            </motion.div>

            {/* View toggle */}
            <div className="flex items-center gap-0.5 p-1 rounded-xl border border-[#1F2937] bg-white/[0.02]">
              {[{ icon: <FiList />, val: "list" }, { icon: <FiGrid />, val: "grid" }].map(({ icon, val }) => (
                <motion.button key={val} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setView(val)}
                  className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs transition-all duration-200 ${view === val ? "bg-blue-500/15 border border-blue-500/20 text-blue-400" : "text-gray-600 hover:text-gray-300"}`}>
                  {icon}
                </motion.button>
              ))}
            </div>

            {/* Upload button */}
            <motion.button
              whileHover={{ scale: 1.04, boxShadow: "0 0 20px rgba(59,130,246,0.35)" }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setUploadOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xs font-semibold relative overflow-hidden"
            >
              <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12"
                animate={{ x: ["-100%", "200%"] }} transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }} />
              <FiPlus className="relative z-10 text-xs" />
              <span className="relative z-10 hidden sm:inline">Upload</span>
            </motion.button>

            <button className="text-gray-600 hover:text-gray-300 text-xs transition-colors whitespace-nowrap">View all</button>
          </div>
        </motion.div>

        {/* Filter chips */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
          className="flex items-center gap-2 mb-4 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
          {filters.map((f) => (
            <motion.button key={f} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} onClick={() => setActiveFilter(f)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all duration-200 shrink-0 ${
                activeFilter === f
                  ? "bg-blue-500/15 border border-blue-500/25 text-blue-300"
                  : "text-gray-500 hover:text-gray-300 border border-transparent hover:border-white/[0.07] hover:bg-white/[0.04]"
              }`}>
              {f}
            </motion.button>
          ))}
          <div className="flex items-center gap-1 text-gray-700 text-[10px] ml-auto shrink-0">
            <FiFilter className="text-[9px]" />
            <span>{filtered.length} result{filtered.length !== 1 ? "s" : ""}</span>
          </div>
        </motion.div>

        {/* Document List/Grid */}
        <div className="rounded-2xl border border-[#1F2937] bg-[#111827] overflow-hidden">
          {view === "list" && (
            <>
              {/* Table header */}
              <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_120px_90px] gap-4 px-5 py-2.5 border-b border-[#1F2937] text-gray-700 text-[10px] font-semibold uppercase tracking-widest">
                <span>Document</span>
                <span>Type</span>
                <span>Owner</span>
                <span>Modified</span>
                <span>Status</span>
                <span className="text-right">Actions</span>
              </div>

              <AnimatePresence>
                {filtered.length > 0
                  ? filtered.map((doc, i) => (
                      <React.Fragment key={doc.id}>
                        <DocRow doc={doc} index={i} onDelete={() => setDocs(d => d.filter(x => x.id !== doc.id))} />
                        {i < filtered.length - 1 && <div className="mx-5 h-px bg-[#1F2937]" />}
                      </React.Fragment>
                    ))
                  : <EmptyState onUpload={() => setUploadOpen(true)} />
                }
              </AnimatePresence>
            </>
          )}

          {view === "grid" && (
            <div className="p-4">
              <AnimatePresence>
                {filtered.length > 0
                  ? <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filtered.map((doc, i) => <DocCard key={doc.id} doc={doc} index={i} />)}
                    </div>
                  : <EmptyState onUpload={() => setUploadOpen(true)} />
                }
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {uploadOpen && <UploadModal onClose={() => setUploadOpen(false)} />}
      </AnimatePresence>
    </>
  );
}

/* ─── Empty State ─── */
function EmptyState({ onUpload }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 text-2xl mb-4">
        <FiFolder />
      </div>
      <p className="text-white font-semibold text-sm mb-1">No documents found</p>
      <p className="text-gray-600 text-xs mb-5 text-center">Try adjusting your filters or upload a new document</p>
      <motion.button whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(59,130,246,0.35)" }} whileTap={{ scale: 0.97 }}
        onClick={onUpload}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm font-semibold">
        <FiUpload /> Upload Document
      </motion.button>
    </motion.div>
  );
}