import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiUpload, FiSearch, FiZap, FiTrendingUp,
  FiArrowRight, FiCommand, FiPlus, FiChevronRight,
} from "react-icons/fi";

/* ─── Actions Data ─── */
const actions = [
  {
    id: "upload",
    icon: <FiUpload />,
    label: "Upload",
    desc: "Add documents",
    kbd: "⌘U",
    gradient: "from-blue-500 to-indigo-600",
    glow: "rgba(59,130,246,0.35)",
    glowDim: "rgba(59,130,246,0.12)",
    border: "rgba(59,130,246,0.25)",
    textColor: "text-blue-300",
    badgeBg: "bg-blue-500/10 border-blue-500/20",
    sparkColor: "#3b82f6",
    tag: "Popular",
  },
  {
    id: "search",
    icon: <FiSearch />,
    label: "Search",
    desc: "Find anything",
    kbd: "⌘K",
    gradient: "from-purple-500 to-pink-600",
    glow: "rgba(139,92,246,0.35)",
    glowDim: "rgba(139,92,246,0.12)",
    border: "rgba(139,92,246,0.25)",
    textColor: "text-purple-300",
    badgeBg: "bg-purple-500/10 border-purple-500/20",
    sparkColor: "#8b5cf6",
    tag: "AI-Powered",
  },
  {
    id: "summarize",
    icon: <FiZap />,
    label: "Summarize",
    desc: "Generate AI summary",
    kbd: "⌘S",
    gradient: "from-cyan-500 to-blue-600",
    glow: "rgba(6,182,212,0.35)",
    glowDim: "rgba(6,182,212,0.12)",
    border: "rgba(6,182,212,0.25)",
    textColor: "text-cyan-300",
    badgeBg: "bg-cyan-500/10 border-cyan-500/20",
    sparkColor: "#06b6d4",
    tag: "New",
  },
  {
    id: "analytics",
    icon: <FiTrendingUp />,
    label: "Analytics",
    desc: "View insights",
    kbd: "⌘A",
    gradient: "from-emerald-500 to-teal-600",
    glow: "rgba(16,185,129,0.35)",
    glowDim: "rgba(16,185,129,0.12)",
    border: "rgba(16,185,129,0.25)",
    textColor: "text-emerald-300",
    badgeBg: "bg-emerald-500/10 border-emerald-500/20",
    sparkColor: "#10b981",
    tag: null,
  },
];

/* ─── Upload Modal ─── */
function UploadModal({ onClose }) {
  const [dragging, setDragging] = useState(false);
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
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 26 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-3xl border border-white/10 bg-[#111827] p-8 shadow-2xl"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white font-semibold text-lg">Upload Document</h2>
          <motion.button whileHover={{ scale: 1.1, rotate: 90 }} onClick={onClose} className="text-gray-500 hover:text-white transition-colors text-xl">×</motion.button>
        </div>
        <motion.div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={() => setDragging(false)}
          animate={{ borderColor: dragging ? "rgba(59,130,246,0.7)" : "rgba(255,255,255,0.09)" }}
          className="rounded-2xl border-2 border-dashed p-10 flex flex-col items-center gap-3 cursor-pointer mb-6"
        >
          <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 text-2xl"><FiUpload /></div>
          <p className="text-white font-medium text-sm">Drop files or click to browse</p>
          <p className="text-gray-500 text-xs">PDF, DOCX, TXT up to 50 MB</p>
        </motion.div>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 rounded-xl border border-white/10 bg-white/5 text-gray-300 text-sm hover:bg-white/10 transition-all">Cancel</button>
          <motion.button whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(59,130,246,0.4)" }} whileTap={{ scale: 0.98 }} onClick={onClose} className="flex-1 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm font-semibold">Upload & Analyze</motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Action Card ─── */
function ActionCard({ action, index, onClick }) {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);

  return (
    <motion.button
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      whileTap={{ scale: 0.97 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onClick={onClick}
      className="relative w-full flex flex-col items-center gap-3 py-5 px-4 rounded-2xl border bg-[#111827] overflow-hidden transition-all duration-300 group text-center"
      style={{
        borderColor: hovered ? action.border : "rgba(31,41,55,1)",
        boxShadow: hovered
          ? `0 0 32px ${action.glow}, 0 4px 20px rgba(0,0,0,0.3)`
          : "0 2px 12px rgba(0,0,0,0.2)",
      }}
    >
      {/* Radial bg glow */}
      <motion.div
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at 50% 0%, ${action.glowDim} 0%, transparent 65%)` }}
      />

      {/* Top gradient line */}
      <motion.div
        animate={{ opacity: hovered ? 1 : 0, scaleX: hovered ? 1 : 0 }}
        transition={{ duration: 0.35 }}
        className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${action.gradient} origin-center`}
      />

      {/* Tag badge */}
      {action.tag && (
        <motion.span
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.08 + 0.3 }}
          className={`absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full text-[9px] font-bold border ${action.badgeBg} ${action.textColor}`}
        >
          {action.tag}
        </motion.span>
      )}

      {/* Icon */}
      <motion.div
        animate={{
          scale: hovered ? 1.12 : 1,
          rotate: hovered ? 6 : 0,
          boxShadow: hovered ? `0 0 22px ${action.glow}` : "none",
        }}
        transition={{ duration: 0.28, ease: "easeOut" }}
        className={`relative w-12 h-12 rounded-2xl bg-gradient-to-br ${action.gradient} flex items-center justify-center text-white text-xl`}
      >
        {action.icon}

        {/* Shimmer on hover */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ x: "-100%", opacity: 0 }}
              animate={{ x: "200%", opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -skew-x-12 rounded-2xl overflow-hidden"
            />
          )}
        </AnimatePresence>
      </motion.div>

      {/* Label + desc */}
      <div className="relative z-10">
        <p className={`text-sm font-semibold transition-colors duration-200 ${hovered ? "text-white" : "text-gray-300"}`}>
          {action.label}
        </p>
        <motion.p
          animate={{ opacity: hovered ? 1 : 0.5 }}
          className="text-gray-500 text-[11px] mt-0.5 leading-tight"
        >
          {action.desc}
        </motion.p>
      </div>

      {/* Keyboard shortcut */}
      <motion.div
        animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 4 }}
        transition={{ duration: 0.2 }}
        className="relative z-10"
      >
        <kbd className={`flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/5 border border-white/[0.08] text-[10px] font-mono ${action.textColor}`}>
          {action.kbd}
        </kbd>
      </motion.div>

      {/* Arrow reveal */}
      <motion.div
        animate={{ opacity: hovered ? 1 : 0, x: hovered ? 0 : -6 }}
        transition={{ duration: 0.2 }}
        className={`absolute bottom-3 right-3 ${action.textColor}`}
      >
        <FiArrowRight className="text-xs" />
      </motion.div>

      {/* Press ripple */}
      <AnimatePresence>
        {pressed && (
          <motion.div
            initial={{ scale: 0, opacity: 0.4 }}
            animate={{ scale: 3, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 m-auto w-10 h-10 rounded-full pointer-events-none"
            style={{ background: action.sparkColor }}
          />
        )}
      </AnimatePresence>
    </motion.button>
  );
}

/* ─── Main Export ─── */
export default function QuickActions() {
  const [uploadOpen, setUploadOpen] = useState(false);

  const handleAction = (id) => {
    if (id === "upload") setUploadOpen(true);
  };

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');`}</style>

      <div style={{ fontFamily: "'Poppins', sans-serif" }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center justify-between mb-4"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 text-xs">
              <FiCommand />
            </div>
            <h2 className="text-white font-semibold text-sm">Quick Actions</h2>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-1 text-gray-600 hover:text-gray-300 text-xs transition-colors"
          >
            <FiPlus className="text-[10px]" /> Customize
          </motion.button>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {actions.map((action, i) => (
            <ActionCard
              key={action.id}
              action={action}
              index={i}
              onClick={() => handleAction(action.id)}
            />
          ))}
        </div>

        {/* Hint strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-3 flex items-center gap-1.5 text-gray-700 text-[10px]"
        >
          <FiCommand className="text-[9px]" />
          <span>Use keyboard shortcuts to trigger actions instantly</span>
        </motion.div>
      </div>

      <AnimatePresence>
        {uploadOpen && <UploadModal onClose={() => setUploadOpen(false)} />}
      </AnimatePresence>
    </>
  );
}