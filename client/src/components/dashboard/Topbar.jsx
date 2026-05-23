import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  FiSearch, FiUpload, FiBell, FiMenu, FiX,
  FiPlus, FiFileText, FiZap, FiSettings, FiLogOut,
  FiUser, FiChevronDown, FiCheck, FiClock, FiStar,
  FiCommand, FiMoon, FiSun,
} from "react-icons/fi";

/* ─── Mock Data ─── */
const notifications = [
  { id: 1, icon: <FiZap />, color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20", title: "AI summary ready", desc: "Q4 Financial Report summarized", time: "2m ago", unread: true },
  { id: 2, icon: <FiFileText />, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20", title: "Document uploaded", desc: "Product Roadmap 2025.docx", time: "18m ago", unread: true },
  { id: 3, icon: <FiStar />, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20", title: "Team shared a file", desc: "Legal NDA — shared by Sarah K.", time: "1h ago", unread: true },
  { id: 4, icon: <FiCheck />, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", title: "Export complete", desc: "Meeting Notes exported as PDF", time: "3h ago", unread: false },
];

const searchSuggestions = [
  { icon: <FiFileText />, label: "Q4 Financial Report.pdf", type: "Document" },
  { icon: <FiZap />, label: "Product Roadmap Summary", type: "AI Summary" },
  { icon: <FiFileText />, label: "Legal Contract — NDA.pdf", type: "Document" },
  { icon: <FiClock />, label: "Team Meeting Notes.txt", type: "Recent" },
];

/* ─── Search Bar ─── */
function SearchBar() {
  const [focused, setFocused] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef(null);

  const filtered = query.length > 0
    ? searchSuggestions.filter((s) => s.label.toLowerCase().includes(query.toLowerCase()))
    : searchSuggestions;

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        ref.current?.focus();
        setFocused(true);
      }
      if (e.key === "Escape") {
        ref.current?.blur();
        setFocused(false);
        setQuery("");
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div className="relative flex-1 max-w-md">
      {/* Input */}
      <motion.div
        animate={{
          borderColor: focused ? "rgba(59,130,246,0.5)" : "rgba(31,41,55,1)",
          boxShadow: focused ? "0 0 0 3px rgba(59,130,246,0.08), 0 0 20px rgba(59,130,246,0.1)" : "none",
          backgroundColor: focused ? "rgba(59,130,246,0.04)" : "rgba(255,255,255,0.03)",
        }}
        transition={{ duration: 0.25 }}
        className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl border"
      >
        <motion.div
          animate={{ color: focused ? "#60a5fa" : "#4b5563" }}
          transition={{ duration: 0.2 }}
        >
          <FiSearch className="text-sm shrink-0" />
        </motion.div>

        <input
          ref={ref}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => { setFocused(false); setQuery(""); }, 150)}
          placeholder="Search documents, summaries…"
          className="flex-1 bg-transparent text-white text-sm placeholder-gray-600 outline-none min-w-0"
        />

        <AnimatePresence>
          {!focused ? (
            <motion.div
              key="kbd"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-1 shrink-0"
            >
              <kbd className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-white/5 border border-white/[0.07] text-gray-600 text-[10px] font-mono">
                <FiCommand className="text-[9px]" />K
              </kbd>
            </motion.div>
          ) : (
            query && (
              <motion.button
                key="clear"
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
                onClick={() => setQuery("")}
                className="text-gray-600 hover:text-white transition-colors shrink-0"
              >
                <FiX className="text-xs" />
              </motion.button>
            )
          )}
        </AnimatePresence>
      </motion.div>

      {/* Dropdown */}
      <AnimatePresence>
        {focused && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="absolute top-full left-0 right-0 mt-2 rounded-2xl border border-[#1F2937] overflow-hidden shadow-2xl z-50"
            style={{ background: "rgba(17,24,39,0.97)", backdropFilter: "blur(20px)" }}
          >
            <div className="px-3 pt-3 pb-1">
              <p className="text-[10px] text-gray-600 font-semibold uppercase tracking-widest px-1 mb-2">
                {query ? "Results" : "Recent"}
              </p>
              {filtered.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  whileHover={{ backgroundColor: "rgba(59,130,246,0.07)" }}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-colors duration-150"
                >
                  <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/[0.07] flex items-center justify-center text-blue-400 text-sm shrink-0">
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-xs font-medium truncate">{item.label}</p>
                    <p className="text-gray-600 text-[10px]">{item.type}</p>
                  </div>
                  <FiChevronDown className="text-gray-700 text-xs rotate-[-90deg] shrink-0" />
                </motion.div>
              ))}
            </div>

            <div className="px-4 py-3 border-t border-[#1F2937] flex items-center justify-between">
              <span className="text-gray-700 text-[10px]">Press Enter to search all</span>
              <div className="flex items-center gap-2">
                {[["↑↓", "navigate"], ["↵", "open"], ["esc", "close"]].map(([key, label]) => (
                  <div key={key} className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/[0.07] text-gray-600 text-[9px] font-mono">{key}</kbd>
                    <span className="text-gray-700 text-[9px]">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Upload Button ─── */
function UploadButton({ onClick }) {
  return (
    <motion.button
      whileHover={{ scale: 1.04, boxShadow: "0 0 22px rgba(59,130,246,0.4)" }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="relative flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm font-semibold overflow-hidden shrink-0"
    >
      {/* shimmer */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12"
        animate={{ x: ["-100%", "200%"] }}
        transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 2 }}
      />
      <FiPlus className="text-sm relative z-10" />
      <span className="hidden sm:inline relative z-10">Upload</span>
    </motion.button>
  );
}

/* ─── Notification Bell ─── */
function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications_local, setNotifications] = useState(notifications);
  const unreadCount = notifications_local.filter((n) => n.unread).length;
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const markAllRead = () => setNotifications((n) => n.map((item) => ({ ...item, unread: false })));

  return (
    <div className="relative" ref={ref}>
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        onClick={() => setOpen(!open)}
        className="relative w-9 h-9 rounded-xl bg-white/[0.04] border border-[#1F2937] flex items-center justify-center text-gray-400 hover:text-white hover:border-white/10 hover:bg-white/[0.07] transition-all duration-200"
      >
        <motion.div
          animate={unreadCount > 0 ? { rotate: [0, -12, 12, -8, 8, 0] } : {}}
          transition={{ duration: 0.5, delay: 1, repeat: Infinity, repeatDelay: 5 }}
        >
          <FiBell className="text-base" />
        </motion.div>

        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.span
              key="badge"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center text-[9px] text-white font-bold border-2 border-[#0B0F19]"
            >
              {unreadCount}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.96 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-0 top-full mt-2 w-80 rounded-2xl border border-[#1F2937] shadow-2xl z-50 overflow-hidden"
            style={{ background: "rgba(17,24,39,0.97)", backdropFilter: "blur(20px)" }}
          >
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-[#1F2937]">
              <div className="flex items-center gap-2">
                <h3 className="text-white text-sm font-semibold">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full bg-blue-500/15 border border-blue-500/20 text-blue-300 text-[10px] font-bold">{unreadCount}</span>
                )}
              </div>
              <button onClick={markAllRead} className="text-blue-400 hover:text-blue-300 text-[11px] font-medium transition-colors">
                Mark all read
              </button>
            </div>

            <div className="max-h-72 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
              {notifications_local.map((n, i) => (
                <motion.div
                  key={n.id}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ backgroundColor: "rgba(255,255,255,0.02)" }}
                  className={`flex items-start gap-3 px-4 py-3.5 cursor-pointer transition-colors duration-150 relative ${n.unread ? "bg-blue-500/[0.03]" : ""}`}
                >
                  {n.unread && <div className="absolute left-2 top-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-blue-400" />}
                  <div className={`w-8 h-8 rounded-xl ${n.bg} border ${n.border} flex items-center justify-center ${n.color} text-sm shrink-0 mt-0.5`}>
                    {n.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-xs font-semibold mb-0.5">{n.title}</p>
                    <p className="text-gray-500 text-[11px] truncate">{n.desc}</p>
                  </div>
                  <span className="text-gray-700 text-[10px] shrink-0 mt-0.5">{n.time}</span>
                </motion.div>
              ))}
            </div>

            <div className="px-4 py-3 border-t border-[#1F2937]">
              <button className="w-full text-center text-blue-400 hover:text-blue-300 text-xs font-medium transition-colors">
                View all notifications
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Profile Dropdown ─── */
function ProfileMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);
  const navigate = useNavigate();

const handleLogout = () => {
  localStorage.removeItem("token");
  navigate("/login");
};

  const menuItems = [
    { icon: <FiUser />, label: "Profile", sub: "View your profile" },
    { icon: <FiSettings />, label: "Settings", sub: "Preferences & billing" },
    { icon: <FiZap />, label: "Upgrade to Team", sub: "Unlock collaboration", highlight: true },
  ];

  return (
    <div className="relative" ref={ref}>
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2.5 pl-1 pr-3 py-1 rounded-xl border border-transparent hover:border-white/[0.07] hover:bg-white/[0.04] transition-all duration-200"
      >
        <div className="relative">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-xs font-bold">
            AJ
          </div>
          <motion.span
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#0B0F19]"
          />
        </div>
        <div className="hidden md:block text-left">
          <p className="text-white text-xs font-semibold leading-none">Alex Johnson</p>
          <p className="text-gray-600 text-[10px] mt-0.5">Pro Plan</p>
        </div>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          className="hidden md:block"
        >
          <FiChevronDown className="text-gray-600 text-xs" />
        </motion.div>
      </motion.button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.96 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-0 top-full mt-2 w-64 rounded-2xl border border-[#1F2937] shadow-2xl z-50 overflow-hidden"
            style={{ background: "rgba(17,24,39,0.97)", backdropFilter: "blur(20px)" }}
          >
            {/* Header */}
            <div className="px-4 py-4 border-b border-[#1F2937]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-sm font-bold">
                  AJ
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">Alex Johnson</p>
                  <p className="text-gray-500 text-[11px]">alex@company.com</p>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-500/[0.08] border border-emerald-500/20">
                <motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.8, repeat: Infinity }} className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                <span className="text-emerald-300 text-[11px] font-medium">Pro Plan — Active</span>
              </div>
            </div>

            {/* Items */}
            <div className="p-2">
              {menuItems.map((item, i) => (
                <motion.button
                  key={i}
                  whileHover={{ backgroundColor: item.highlight ? "rgba(59,130,246,0.08)" : "rgba(255,255,255,0.04)" }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors duration-150 ${item.highlight ? "border border-blue-500/20 bg-blue-500/[0.05]" : ""}`}
                >
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm ${item.highlight ? "bg-blue-500/15 text-blue-400" : "bg-white/5 text-gray-400"}`}>
                    {item.icon}
                  </div>
                  <div>
                    <p className={`text-xs font-medium ${item.highlight ? "text-blue-300" : "text-white"}`}>{item.label}</p>
                    <p className="text-gray-600 text-[10px]">{item.sub}</p>
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Footer */}
            <div className="px-2 pb-2 border-t border-[#1F2937] pt-2">
              <motion.button onClick={handleLogout}
                whileHover={{ backgroundColor: "rgba(239,68,68,0.06)" }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors duration-150 group"
              >
                <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-gray-500 group-hover:bg-red-500/10 group-hover:text-red-400 transition-all text-sm">
                  <FiLogOut />
                </div>
                <span className="text-gray-500 group-hover:text-red-400 text-xs font-medium transition-colors">Sign out</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Upload Modal ─── */
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
        className="w-full max-w-md rounded-3xl border border-[#1F2937] bg-[#111827] p-8 shadow-2xl"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white font-semibold text-lg">Upload Document</h2>
          <motion.button whileHover={{ scale: 1.1, rotate: 90 }} onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            <FiX />
          </motion.button>
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
          <button onClick={onClose} className="flex-1 py-3 rounded-xl border border-[#1F2937] bg-white/5 text-gray-300 text-sm hover:bg-white/10 transition-all">Cancel</button>
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

/* ─── Main Topbar ─── */
export default function Topbar({ onMobileSidebarToggle }) {
  const [uploadOpen, setUploadOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');`}</style>

      <motion.header
        initial={{ y: -64, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="h-16 border-b border-[#1F2937] flex items-center justify-between px-4 md:px-6 shrink-0 sticky top-0 z-30"
        style={{
          background: "rgba(11,15,25,0.85)",
          backdropFilter: "blur(20px)",
          fontFamily: "'Poppins', sans-serif",
        }}
      >
        {/* Top glow line */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent pointer-events-none" />

        {/* ── Left ── */}
        <div className="flex items-center gap-3">
          {/* Mobile sidebar toggle */}
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
            onClick={onMobileSidebarToggle}
            className="md:hidden w-9 h-9 rounded-xl bg-white/[0.04] border border-[#1F2937] flex items-center justify-center text-gray-400 hover:text-white hover:border-white/10 transition-all duration-200"
          >
            <FiMenu className="text-base" />
          </motion.button>

          {/* Breadcrumb / Page title */}
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-gray-600 text-sm">DocuMind</span>
            <span className="text-gray-700 text-sm">/</span>
            <span className="text-white text-sm font-medium">Dashboard</span>
          </div>

          {/* Mobile search toggle */}
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            className="md:hidden w-9 h-9 rounded-xl bg-white/[0.04] border border-[#1F2937] flex items-center justify-center text-gray-400 hover:text-white hover:border-white/10 transition-all duration-200"
          >
            <FiSearch className="text-base" />
          </motion.button>
        </div>

        {/* ── Center: Search (desktop) ── */}
        <div className="hidden md:flex flex-1 justify-center px-8 max-w-xl mx-auto">
          <SearchBar />
        </div>

        {/* ── Right ── */}
        <div className="flex items-center gap-2">
          <UploadButton onClick={() => setUploadOpen(true)} />
          <NotificationBell />
          <div className="w-px h-6 bg-[#1F2937] mx-1" />
          <ProfileMenu />
        </div>
      </motion.header>

      {/* Mobile Search Expand */}
      <AnimatePresence>
        {mobileSearchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden border-b border-[#1F2937] overflow-hidden"
            style={{ background: "rgba(11,15,25,0.95)", backdropFilter: "blur(20px)" }}
          >
            <div className="px-4 py-3">
              <SearchBar />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload Modal */}
      <AnimatePresence>
        {uploadOpen && <UploadModal onClose={() => setUploadOpen(false)} />}
      </AnimatePresence>
    </>
  );
}