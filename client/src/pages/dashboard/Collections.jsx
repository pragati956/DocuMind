import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiFolder, FiPlus, FiMoreHorizontal, FiFileText,
  FiStar, FiUsers, FiLock, FiGlobe, FiEdit3,
  FiTrash2, FiShare2, FiGrid, FiList, FiSearch,
  FiClock, FiZap, FiCheck, FiX, FiChevronRight,
  FiArrowRight, FiCopy,
} from "react-icons/fi";

/* ─── Collection Data ─── */
const collectionsData = [
  {
    id: 1,
    name: "Finance & Reports",
    desc: "Quarterly reports, investor decks, revenue analysis",
    count: 24,
    starred: true,
    shared: true,
    privacy: "team",
    lastUpdated: "2m ago",
    color: "from-blue-500 to-indigo-600",
    accent: "#3b82f6",
    accentDim: "rgba(59,130,246,0.1)",
    accentBorder: "rgba(59,130,246,0.22)",
    accentText: "text-blue-300",
    accentBadge: "bg-blue-500/15 border-blue-500/25 text-blue-300",
    previews: ["Q4 Report.pdf", "Series B Deck.pdf", "Revenue 2025.docx"],
    members: 5,
    tag: "Finance",
    summary: "AI-indexed",
  },
  {
    id: 2,
    name: "Legal Documents",
    desc: "Contracts, NDAs, compliance docs, agreements",
    count: 7,
    starred: true,
    shared: false,
    privacy: "private",
    lastUpdated: "1h ago",
    color: "from-purple-500 to-pink-600",
    accent: "#8b5cf6",
    accentDim: "rgba(139,92,246,0.1)",
    accentBorder: "rgba(139,92,246,0.22)",
    accentText: "text-purple-300",
    accentBadge: "bg-purple-500/15 border-purple-500/25 text-purple-300",
    previews: ["NDA Contract.pdf", "Employment.pdf", "Privacy Policy.docx"],
    members: 2,
    tag: "Legal",
    summary: "Reviewed",
  },
  {
    id: 3,
    name: "Product Roadmaps",
    desc: "Feature specs, roadmaps, OKRs, sprint plans",
    count: 18,
    starred: false,
    shared: true,
    privacy: "team",
    lastUpdated: "3h ago",
    color: "from-emerald-500 to-teal-600",
    accent: "#10b981",
    accentDim: "rgba(16,185,129,0.1)",
    accentBorder: "rgba(16,185,129,0.22)",
    accentText: "text-emerald-300",
    accentBadge: "bg-emerald-500/15 border-emerald-500/25 text-emerald-300",
    previews: ["Roadmap 2025.docx", "Sprint 42.txt", "OKRs Q1.pdf"],
    members: 8,
    tag: "Product",
    summary: "In progress",
  },
  {
    id: 4,
    name: "Meeting Notes",
    desc: "Board meetings, 1:1s, team syncs, retrospectives",
    count: 31,
    starred: false,
    shared: true,
    privacy: "public",
    lastUpdated: "Yesterday",
    color: "from-amber-500 to-orange-600",
    accent: "#f59e0b",
    accentDim: "rgba(245,158,11,0.1)",
    accentBorder: "rgba(245,158,11,0.22)",
    accentText: "text-amber-300",
    accentBadge: "bg-amber-500/15 border-amber-500/25 text-amber-300",
    previews: ["Board Q4.txt", "Team Sync.txt", "Retro Dec.txt"],
    members: 12,
    tag: "Meetings",
    summary: "Summarized",
  },
  {
    id: 5,
    name: "Brand Assets",
    desc: "Brand guidelines, logos, design system docs",
    count: 9,
    starred: false,
    shared: false,
    privacy: "private",
    lastUpdated: "3d ago",
    color: "from-rose-500 to-pink-600",
    accent: "#f43f5e",
    accentDim: "rgba(244,63,94,0.1)",
    accentBorder: "rgba(244,63,94,0.22)",
    accentText: "text-rose-300",
    accentBadge: "bg-rose-500/15 border-rose-500/25 text-rose-300",
    previews: ["Brand Guide v3.pdf", "Logos.png", "Design Sys.docx"],
    members: 3,
    tag: "Design",
    summary: "Updated",
  },
  {
    id: 6,
    name: "Research & Insights",
    desc: "Market research, user interviews, competitive analysis",
    count: 14,
    starred: false,
    shared: true,
    privacy: "team",
    lastUpdated: "1w ago",
    color: "from-cyan-500 to-blue-600",
    accent: "#06b6d4",
    accentDim: "rgba(6,182,212,0.1)",
    accentBorder: "rgba(6,182,212,0.22)",
    accentText: "text-cyan-300",
    accentBadge: "bg-cyan-500/15 border-cyan-500/25 text-cyan-300",
    previews: ["Market Report.pdf", "User Research.docx", "Competitors.txt"],
    members: 4,
    tag: "Research",
    summary: "AI-indexed",
  },
];

/* ─── Privacy Icon ─── */
function PrivacyIcon({ type }) {
  if (type === "private") return <FiLock className="text-[10px]" />;
  if (type === "public") return <FiGlobe className="text-[10px]" />;
  return <FiUsers className="text-[10px]" />;
}

/* ─── Context Menu ─── */
function ContextMenu({ onClose, accentText, accentDim, accentBorder }) {
  const items = [
    { icon: <FiEdit3 />, label: "Rename" },
    { icon: <FiShare2 />, label: "Share" },
    { icon: <FiCopy />, label: "Duplicate" },
    { icon: <FiStar />, label: "Star" },
    { icon: <FiTrash2 />, label: "Delete", danger: true },
  ];
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: -6 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.15 }}
      className="absolute right-0 top-full mt-1.5 w-44 rounded-2xl border border-[#1F2937] overflow-hidden shadow-2xl z-30"
      style={{ background: "rgba(17,24,39,0.98)", backdropFilter: "blur(20px)" }}
      onClick={(e) => e.stopPropagation()}
    >
      {items.map((item, i) => (
        <motion.button
          key={i}
          whileHover={{ backgroundColor: item.danger ? "rgba(239,68,68,0.07)" : "rgba(255,255,255,0.04)" }}
          onClick={onClose}
          className={`w-full flex items-center gap-3 px-4 py-2.5 text-xs transition-colors ${item.danger ? "text-red-400" : "text-gray-300"} ${i > 0 ? "border-t border-white/[0.04]" : ""}`}
        >
          <span className={item.danger ? "text-red-400" : "text-gray-500 text-sm"}>{item.icon}</span>
          {item.label}
        </motion.button>
      ))}
    </motion.div>
  );
}

/* ─── Create Collection Modal ─── */
function CreateModal({ onClose, onCreate }) {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [privacy, setPrivacy] = useState("team");
  const [selectedColor, setSelectedColor] = useState(0);
  const [nameFocused, setNameFocused] = useState(false);
  const [descFocused, setDescFocused] = useState(false);

  const colorOptions = [
    { label: "Blue", gradient: "from-blue-500 to-indigo-600" },
    { label: "Purple", gradient: "from-purple-500 to-pink-600" },
    { label: "Emerald", gradient: "from-emerald-500 to-teal-600" },
    { label: "Amber", gradient: "from-amber-500 to-orange-600" },
    { label: "Rose", gradient: "from-rose-500 to-pink-600" },
    { label: "Cyan", gradient: "from-cyan-500 to-blue-600" },
  ];

  const privacyOptions = [
    { value: "private", icon: <FiLock />, label: "Private", desc: "Only you" },
    { value: "team", icon: <FiUsers />, label: "Team", desc: "Your workspace" },
    { value: "public", icon: <FiGlobe />, label: "Public", desc: "Anyone with link" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(12px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 24 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ type: "spring", stiffness: 280, damping: 24 }}
        className="w-full max-w-md rounded-3xl overflow-hidden"
        style={{ background: "rgba(17,24,39,0.96)", backdropFilter: "blur(24px)", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 0 60px rgba(0,0,0,0.6)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top glow */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent" />

        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${colorOptions[selectedColor].gradient} flex items-center justify-center`}>
                <FiFolder className="text-white text-base" />
              </div>
              <div>
                <h2 className="text-white font-semibold text-base">New Collection</h2>
                <p className="text-gray-500 text-[11px]">Organize your documents</p>
              </div>
            </div>
            <motion.button whileHover={{ scale: 1.1, rotate: 90 }} onClick={onClose}
              className="w-8 h-8 rounded-xl bg-white/5 border border-white/[0.08] flex items-center justify-center text-gray-500 hover:text-white transition-colors">
              <FiX className="text-sm" />
            </motion.button>
          </div>

          <div className="space-y-4">
            {/* Name input */}
            <div>
              <label className="block text-[10px] text-gray-600 font-semibold uppercase tracking-widest mb-1.5">Collection Name</label>
              <motion.div animate={{ borderColor: nameFocused ? "rgba(59,130,246,0.45)" : "rgba(31,41,55,1)", boxShadow: nameFocused ? "0 0 0 3px rgba(59,130,246,0.08)" : "none" }}
                className="flex items-center gap-2 px-4 py-3 rounded-xl border bg-white/[0.03]">
                <FiFolder className={`text-sm shrink-0 transition-colors ${nameFocused ? "text-blue-400" : "text-gray-600"}`} />
                <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                  onFocus={() => setNameFocused(true)} onBlur={() => setNameFocused(false)}
                  placeholder="e.g. Finance Reports" className="flex-1 bg-transparent text-white text-sm placeholder-gray-600 outline-none" />
              </motion.div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-[10px] text-gray-600 font-semibold uppercase tracking-widest mb-1.5">Description <span className="text-gray-700 normal-case">(optional)</span></label>
              <motion.div animate={{ borderColor: descFocused ? "rgba(59,130,246,0.45)" : "rgba(31,41,55,1)", boxShadow: descFocused ? "0 0 0 3px rgba(59,130,246,0.08)" : "none" }}
                className="px-4 py-3 rounded-xl border bg-white/[0.03]">
                <textarea value={desc} onChange={(e) => setDesc(e.target.value)}
                  onFocus={() => setDescFocused(true)} onBlur={() => setDescFocused(false)}
                  placeholder="What's in this collection?" rows={2}
                  className="w-full bg-transparent text-white text-sm placeholder-gray-600 outline-none resize-none" />
              </motion.div>
            </div>

            {/* Color picker */}
            <div>
              <label className="block text-[10px] text-gray-600 font-semibold uppercase tracking-widest mb-2">Color</label>
              <div className="flex items-center gap-2">
                {colorOptions.map((c, i) => (
                  <motion.button key={i} whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }} onClick={() => setSelectedColor(i)}
                    className={`w-7 h-7 rounded-xl bg-gradient-to-br ${c.gradient} relative transition-all`}>
                    {selectedColor === i && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute inset-0 flex items-center justify-center">
                        <FiCheck className="text-white text-xs" />
                      </motion.div>
                    )}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Privacy */}
            <div>
              <label className="block text-[10px] text-gray-600 font-semibold uppercase tracking-widest mb-2">Privacy</label>
              <div className="grid grid-cols-3 gap-2">
                {privacyOptions.map((p) => (
                  <motion.button key={p.value} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => setPrivacy(p.value)}
                    className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border text-xs transition-all duration-200 ${
                      privacy === p.value ? "bg-blue-500/10 border-blue-500/30 text-blue-300" : "border-[#1F2937] bg-white/[0.02] text-gray-500 hover:border-white/10 hover:text-gray-300"
                    }`}>
                    {p.icon}
                    <span className="font-medium">{p.label}</span>
                    <span className="text-[9px] text-gray-600">{p.desc}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-6">
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-white/10 bg-white/[0.04] text-gray-300 text-sm font-medium hover:bg-white/[0.07] transition-all">
              Cancel
            </motion.button>
            <motion.button whileHover={name ? { scale: 1.02, boxShadow: "0 0 25px rgba(59,130,246,0.4)" } : {}} whileTap={name ? { scale: 0.97 } : {}}
              onClick={() => { if (name) { onCreate({ name, desc, privacy, color: colorOptions[selectedColor].gradient }); onClose(); } }}
              className={`flex-1 py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all ${name ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white" : "bg-white/10 text-gray-600 cursor-not-allowed"}`}>
              <FiPlus /> Create Collection
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Collection Card (Grid) ─── */
function CollectionCard({ col, index, view }) {
  const [hovered, setHovered] = useState(false);
  const [starred, setStarred] = useState(col.starred);
  const [menuOpen, setMenuOpen] = useState(false);

  if (view === "list") {
    return (
      <motion.div
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: index * 0.06 }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => { setHovered(false); setMenuOpen(false); }}
        className="relative flex items-center gap-4 px-5 py-4 rounded-2xl border bg-[#111827] cursor-pointer transition-all duration-300 group"
        style={{
          borderColor: hovered ? col.accentBorder : "rgba(31,41,55,1)",
          boxShadow: hovered ? `0 0 24px ${col.accentDim}` : "none",
        }}
      >
        <motion.div animate={{ scale: hovered ? 1.08 : 1, rotate: hovered ? 5 : 0 }} transition={{ duration: 0.25 }}
          className={`w-10 h-10 rounded-xl bg-gradient-to-br ${col.color} flex items-center justify-center text-white text-base shrink-0`}>
          <FiFolder />
        </motion.div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className={`text-sm font-semibold truncate transition-colors ${hovered ? "text-white" : "text-gray-100"}`}>{col.name}</p>
            {starred && <FiStar className="text-amber-400 text-xs shrink-0" style={{ fill: "#f59e0b" }} />}
            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${col.accentBadge}`}>{col.tag}</span>
          </div>
          <p className="text-gray-500 text-xs truncate mt-0.5">{col.desc}</p>
        </div>

        <div className="hidden sm:flex items-center gap-4 text-gray-600 text-xs shrink-0">
          <div className="flex items-center gap-1"><FiFileText className="text-[10px]" />{col.count}</div>
          <div className="flex items-center gap-1"><FiUsers className="text-[10px]" />{col.members}</div>
          <div className="flex items-center gap-1"><FiClock className="text-[10px]" />{col.lastUpdated}</div>
          <div className="flex items-center gap-1"><PrivacyIcon type={col.privacy} />{col.privacy}</div>
        </div>

        <div className={`flex items-center gap-1.5 transition-opacity duration-200 ${hovered ? "opacity-100" : "opacity-0"}`}>
          <motion.button whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.9 }}
            onClick={(e) => { e.stopPropagation(); setStarred(!starred); }}
            className="w-7 h-7 rounded-lg bg-white/5 border border-white/[0.07] flex items-center justify-center hover:bg-white/10 transition-all">
            <FiStar className={`text-xs ${starred ? "text-amber-400" : "text-gray-600"}`} style={{ fill: starred ? "#f59e0b" : "none" }} />
          </motion.button>
          <div className="relative">
            <motion.button whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.9 }}
              onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen); }}
              className="w-7 h-7 rounded-lg bg-white/5 border border-white/[0.07] flex items-center justify-center text-gray-600 hover:text-gray-200 hover:bg-white/10 transition-all">
              <FiMoreHorizontal className="text-xs" />
            </motion.button>
            <AnimatePresence>
              {menuOpen && <ContextMenu onClose={() => setMenuOpen(false)} accentText={col.accentText} accentDim={col.accentDim} accentBorder={col.accentBorder} />}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setMenuOpen(false); }}
      className="relative rounded-2xl border bg-[#111827] overflow-hidden cursor-pointer transition-all duration-300"
      style={{
        borderColor: hovered ? col.accentBorder : "rgba(31,41,55,1)",
        boxShadow: hovered ? `0 0 36px ${col.accentDim}, 0 4px 20px rgba(0,0,0,0.3)` : "0 2px 12px rgba(0,0,0,0.2)",
      }}
    >
      {/* Top gradient bar */}
      <motion.div animate={{ scaleX: hovered ? 1 : 0, opacity: hovered ? 1 : 0 }} transition={{ duration: 0.3 }}
        className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${col.color} origin-left`} />

      {/* Corner glow */}
      <motion.div animate={{ opacity: hovered ? 1 : 0 }} transition={{ duration: 0.35 }}
        className="absolute -top-8 -right-8 w-32 h-32 rounded-full blur-[50px] pointer-events-none"
        style={{ background: col.accentDim }} />

      {/* Folder header */}
      <div className={`relative h-20 bg-gradient-to-br ${col.color} opacity-15`} />
      <div className="absolute top-4 left-4 flex items-center gap-2">
        <motion.div animate={{ scale: hovered ? 1.1 : 1, rotate: hovered ? 8 : 0 }} transition={{ duration: 0.25 }}
          className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${col.color} flex items-center justify-center text-white text-xl shadow-lg`}>
          <FiFolder />
        </motion.div>
      </div>

      {/* Actions top-right */}
      <div className="absolute top-3 right-3 flex items-center gap-1.5">
        <motion.button whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}
          onClick={(e) => { e.stopPropagation(); setStarred(!starred); }}
          className="w-7 h-7 rounded-xl bg-black/30 backdrop-blur-sm flex items-center justify-center transition-all">
          <FiStar className={`text-xs ${starred ? "text-amber-400" : "text-white/50"}`} style={{ fill: starred ? "#f59e0b" : "none" }} />
        </motion.button>
        <div className="relative">
          <motion.button whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}
            onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen); }}
            className="w-7 h-7 rounded-xl bg-black/30 backdrop-blur-sm flex items-center justify-center text-white/50 hover:text-white transition-colors">
            <FiMoreHorizontal className="text-xs" />
          </motion.button>
          <AnimatePresence>
            {menuOpen && <ContextMenu onClose={() => setMenuOpen(false)} accentText={col.accentText} accentDim={col.accentDim} accentBorder={col.accentBorder} />}
          </AnimatePresence>
        </div>
      </div>

      {/* Body */}
      <div className="relative z-10 p-4 pt-3">
        <div className="flex items-start justify-between gap-2 mb-1">
          <p className={`font-semibold text-sm transition-colors ${hovered ? "text-white" : "text-gray-100"}`}>{col.name}</p>
          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border shrink-0 ${col.accentBadge}`}>{col.tag}</span>
        </div>
        <p className="text-gray-500 text-[11px] leading-relaxed mb-4 line-clamp-2">{col.desc}</p>

        {/* File previews */}
        <div className="space-y-1.5 mb-4">
          {col.previews.slice(0, 2).map((file, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.08 + 0.3 + i * 0.06 }}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-white/[0.05] bg-white/[0.02]">
              <FiFileText className={`text-[10px] shrink-0 ${col.accentText}`} />
              <span className="text-gray-400 text-[10px] truncate">{file}</span>
            </motion.div>
          ))}
          {col.count > 2 && (
            <div className="px-2.5 py-1 text-gray-600 text-[10px]">+{col.count - 2} more documents</div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-white/[0.05]">
          <div className="flex items-center gap-3 text-gray-600 text-[10px]">
            <div className="flex items-center gap-1"><FiFileText className="text-[9px]" />{col.count}</div>
            <div className="flex items-center gap-1"><FiUsers className="text-[9px]" />{col.members}</div>
            <div className="flex items-center gap-1"><PrivacyIcon type={col.privacy} />{col.privacy}</div>
          </div>
          <motion.div animate={{ opacity: hovered ? 1 : 0.4 }}
            className={`flex items-center gap-1 text-[10px] font-medium ${col.accentText}`}>
            <FiClock className="text-[9px]" />{col.lastUpdated}
          </motion.div>
        </div>

        {/* Hover: AI summary badge + open */}
        <motion.div animate={{ opacity: hovered ? 1 : 0, height: hovered ? "auto" : 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/[0.05]">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border"
              style={{ background: col.accentDim, borderColor: col.accentBorder }}>
              <FiZap className={`text-[10px] ${col.accentText}`} />
              <span className={`text-[10px] font-medium ${col.accentText}`}>{col.summary}</span>
            </div>
            <motion.span animate={{ x: hovered ? [0, 3, 0] : 0 }} transition={{ duration: 1, repeat: hovered ? Infinity : 0 }}
              className={`flex items-center gap-1 text-[11px] font-semibold ${col.accentText}`}>
              Open <FiChevronRight className="text-[10px]" />
            </motion.span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ─── Empty State ─── */
function EmptyCollectionState({ onCreate }) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-24 rounded-3xl border border-dashed border-[#1F2937] col-span-full">
      <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 text-2xl mb-5">
        <FiFolder />
      </motion.div>
      <h3 className="text-white font-semibold text-base mb-2">No collections yet</h3>
      <p className="text-gray-500 text-sm mb-6 text-center max-w-xs">Create your first collection to group and organize your documents.</p>
      <motion.button whileHover={{ scale: 1.05, boxShadow: "0 0 22px rgba(59,130,246,0.35)" }} whileTap={{ scale: 0.97 }}
        onClick={onCreate}
        className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm font-semibold">
        <FiPlus /> Create Collection
      </motion.button>
    </motion.div>
  );
}

/* ─── Main Page ─── */
export default function Collections() {
  const [collections, setCollections] = useState(collectionsData);
  const [view, setView] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");

  const filterOptions = ["All", "Starred", "Private", "Shared", "Recent"];

  const filtered = collections.filter((c) => {
    const matchSearch = !searchQuery || c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.tag.toLowerCase().includes(searchQuery.toLowerCase());
    const matchFilter = activeFilter === "All" ? true
      : activeFilter === "Starred" ? c.starred
      : activeFilter === "Private" ? c.privacy === "private"
      : activeFilter === "Shared" ? c.shared
      : true;
    return matchSearch && matchFilter;
  });

  const handleCreate = ({ name, desc, privacy, color }) => {
    const colors = { "from-blue-500 to-indigo-600": { accent: "#3b82f6", dim: "rgba(59,130,246,0.1)", border: "rgba(59,130,246,0.22)", text: "text-blue-300", badge: "bg-blue-500/15 border-blue-500/25 text-blue-300", tag: "Custom" } };
    setCollections((prev) => [{
      id: Date.now(), name, desc, count: 0, starred: false, shared: privacy !== "private", privacy, lastUpdated: "Just now",
      color, accent: "#3b82f6", accentDim: "rgba(59,130,246,0.1)", accentBorder: "rgba(59,130,246,0.22)",
      accentText: "text-blue-300", accentBadge: "bg-blue-500/15 border-blue-500/25 text-blue-300",
      previews: [], members: 1, tag: "Custom", summary: "Empty",
    }, ...prev]);
  };

  return (
    <div className="min-h-screen bg-[#0B0F19]" style={{ fontFamily: "'Poppins', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');`}</style>

      {/* Ambient */}
     {/* Ambient Background */}
<div className="fixed inset-0 pointer-events-none overflow-hidden">

  {/* Soft top glow */}
  <div
    className="absolute top-0 left-1/3 w-[500px] h-[300px] rounded-full blur-[120px]"
    style={{
      background: "rgba(59,130,246,0.08)",
    }}
  />

  {/* Soft bottom glow */}
  <div
    className="absolute bottom-0 right-1/4 w-[450px] h-[300px] rounded-full blur-[120px]"
    style={{
      background: "rgba(139,92,246,0.06)",
    }}
  />

  {/* Very subtle grid */}
  <div
    className="absolute inset-0"
    style={{
      backgroundImage:
        "linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)",
      backgroundSize: "60px 60px",
    }}
  />
</div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-10">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <FiFolder className="text-base" />
              </div>
              <h1 className="text-white font-bold text-xl tracking-tight">Collections</h1>
              <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/[0.08] text-gray-400 text-[11px]">{collections.length}</span>
            </div>
            <p className="text-gray-500 text-sm ml-12">Organize your documents into smart collections</p>
          </div>
          <motion.button whileHover={{ scale: 1.04, boxShadow: "0 0 24px rgba(59,130,246,0.4)" }} whileTap={{ scale: 0.97 }}
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm font-semibold relative overflow-hidden shrink-0">
            <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12"
              animate={{ x: ["-100%", "200%"] }} transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 2 }} />
            <FiPlus className="relative z-10" />
            <span className="relative z-10">New Collection</span>
          </motion.button>
        </motion.div>

        {/* Toolbar */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-2 overflow-x-auto pb-0.5" style={{ scrollbarWidth: "none" }}>
            {filterOptions.map((f) => (
              <motion.button key={f} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} onClick={() => setActiveFilter(f)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all shrink-0 ${
                  activeFilter === f ? "bg-blue-500/15 border border-blue-500/25 text-blue-300" : "text-gray-500 hover:text-gray-300 border border-transparent hover:border-white/[0.07] hover:bg-white/[0.04]"
                }`}>
                {f}
              </motion.button>
            ))}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <motion.div animate={{ borderColor: searchFocused ? "rgba(59,130,246,0.4)" : "rgba(31,41,55,1)", boxShadow: searchFocused ? "0 0 0 3px rgba(59,130,246,0.06)" : "none" }}
              className="flex items-center gap-2 px-3 py-2 rounded-xl border bg-white/[0.03]">
              <FiSearch className={`text-xs transition-colors ${searchFocused ? "text-blue-400" : "text-gray-600"}`} />
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)} onBlur={() => setSearchFocused(false)}
                placeholder="Search collections…" className="bg-transparent text-white text-xs placeholder-gray-700 outline-none w-32" />
            </motion.div>

            <div className="flex items-center gap-0.5 p-1 rounded-xl border border-[#1F2937] bg-white/[0.02]">
              {[{ icon: <FiGrid />, val: "grid" }, { icon: <FiList />, val: "list" }].map(({ icon, val }) => (
                <motion.button key={val} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setView(val)}
                  className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs transition-all ${view === val ? "bg-blue-500/15 border border-blue-500/20 text-blue-400" : "text-gray-600 hover:text-gray-300"}`}>
                  {icon}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Grid / List */}
        <AnimatePresence mode="wait">
          {view === "grid" ? (
            <motion.div key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {filtered.length > 0
                ? filtered.map((col, i) => <CollectionCard key={col.id} col={col} index={i} view="grid" />)
                : <EmptyCollectionState onCreate={() => setShowModal(true)} />}
            </motion.div>
          ) : (
            <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
              {filtered.length > 0
                ? filtered.map((col, i) => <CollectionCard key={col.id} col={col} index={i} view="list" />)
                : <EmptyCollectionState onCreate={() => setShowModal(true)} />}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom stats strip */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
          className="mt-8 flex items-center justify-between px-5 py-3 rounded-2xl border border-[#1F2937] bg-white/[0.02]">
          <div className="flex items-center gap-6 text-gray-600 text-xs">
            <span>{collections.length} collections</span>
            <span>·</span>
            <span>{collections.reduce((a, c) => a + c.count, 0)} total documents</span>
            <span className="hidden sm:inline">·</span>
            <span className="hidden sm:inline">{collections.filter(c => c.starred).length} starred</span>
          </div>
          <motion.button whileHover={{ scale: 1.04 }} className="flex items-center gap-1.5 text-blue-400 text-xs font-medium">
            View all <FiArrowRight className="text-[10px]" />
          </motion.button>
        </motion.div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && <CreateModal onClose={() => setShowModal(false)} onCreate={handleCreate} />}
      </AnimatePresence>
    </div>
  );
}