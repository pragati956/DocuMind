import { useEffect, useState } from "react";
import { getSummaries } from "../../services/aiService";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  FiZap, FiStar, FiTag, FiEye, FiCopy, FiShare2,
  FiFileText, FiMoreHorizontal, FiArrowRight, FiFilter,
  FiSearch, FiBookmark, FiTrendingUp, FiCpu, FiClock,
  FiCheck, FiChevronDown, FiChevronUp, FiRefreshCw,
  FiDownload, FiTrash2, FiGrid, FiList,
} from "react-icons/fi";

/* ─── Data ─── */
// const summariesData = [
//   {
//     id: 1,
//     title: "Q4 Financial Report",
//     file: "Q4_Financial_Report.pdf",
//     fileType: "PDF",
//     category: "Finance",
//     generatedAt: "2 min ago",
//     readTime: "45 sec",
//     confidence: 97,
//     starred: true,
//     bookmarked: false,
//     tags: ["Revenue", "Q4", "Growth"],
//     gradient: "from-blue-500 to-indigo-600",
//     accent: "#3b82f6",
//     accentDim: "rgba(59,130,246,0.1)",
//     accentBorder: "rgba(59,130,246,0.22)",
//     accentText: "text-blue-300",
//     tagBg: "bg-blue-500/10 border-blue-500/20 text-blue-300",
//     summary: "Revenue increased 34% YoY to $4.2M in Q4. Operating margin improved significantly to 22%, driven by optimized customer acquisition costs. Three critical risk factors identified: rising enterprise CAC, APAC launch delays, and EU FX headwinds. Board recommends accelerating Series B discussions ahead of Q1 market window.",
//     keyInsights: [
//       "Revenue +34% YoY → $4.2M in Q4",
//       "Operating margin reached 22% (from 16%)",
//       "3 risk factors flagged for board review",
//       "Series B timeline moved to Q1 2025",
//     ],
//     sentiment: "Positive",
//     sentimentColor: "text-emerald-400",
//     pages: 34,
//     wordCount: "12,400 words",
//     status: "Complete",
//   },
//   {
//     id: 2,
//     title: "Product Roadmap 2025",
//     file: "Product_Roadmap_2025.docx",
//     fileType: "DOCX",
//     category: "Product",
//     generatedAt: "18 min ago",
//     readTime: "1 min",
//     confidence: 94,
//     starred: false,
//     bookmarked: true,
//     tags: ["Strategy", "Q1", "Launch"],
//     gradient: "from-purple-500 to-pink-600",
//     accent: "#8b5cf6",
//     accentDim: "rgba(139,92,246,0.1)",
//     accentBorder: "rgba(139,92,246,0.22)",
//     accentText: "text-purple-300",
//     tagBg: "bg-purple-500/10 border-purple-500/20 text-purple-300",
//     summary: "Three major product launches planned across 2025: AI-powered semantic search scheduled for Q1, native iOS/Android mobile applications for Q2, and a fully public REST API v3 with webhook support for Q3. Engineering headcount projected to grow 40% to support these initiatives. A comprehensive design system overhaul is planned to unify product surface across all touchpoints.",
//     keyInsights: [
//       "AI Search launch planned for Q1 2025",
//       "Mobile apps (iOS + Android) launching Q2",
//       "Public REST API v3 with webhooks in Q3",
//       "Engineering team to grow 40%",
//       "Full design system overhaul scheduled",
//     ],
//     sentiment: "Optimistic",
//     sentimentColor: "text-purple-400",
//     pages: 12,
//     wordCount: "4,200 words",
//     status: "Complete",
//   },
//   {
//     id: 3,
//     title: "Legal Contract — NDA",
//     file: "Legal_NDA_Contract.pdf",
//     fileType: "PDF",
//     category: "Legal",
//     generatedAt: "1h ago",
//     readTime: "30 sec",
//     confidence: 99,
//     starred: true,
//     bookmarked: false,
//     tags: ["NDA", "Contract", "2024"],
//     gradient: "from-emerald-500 to-teal-600",
//     accent: "#10b981",
//     accentDim: "rgba(16,185,129,0.1)",
//     accentBorder: "rgba(16,185,129,0.22)",
//     accentText: "text-emerald-300",
//     tagBg: "bg-emerald-500/10 border-emerald-500/20 text-emerald-300",
//     summary: "Standard mutual non-disclosure agreement with a 2-year term. No unusual or non-standard clauses detected during AI analysis. Delaware jurisdiction confirmed. IP ownership clause in §4.2 warrants closer review by counsel — language around derivative works is broader than typical. Both parties retain pre-existing intellectual property. Recommended for signing pending legal counsel review of §4.2.",
//     keyInsights: [
//       "2-year mutual NDA — standard terms",
//       "Delaware jurisdiction confirmed",
//       "§4.2 IP clause needs legal review",
//       "No non-standard clauses detected",
//     ],
//     sentiment: "Neutral",
//     sentimentColor: "text-gray-400",
//     pages: 8,
//     wordCount: "2,100 words",
//     status: "Complete",
//   },
//   {
//     id: 4,
//     title: "Team Meeting Notes — Q4 Sprint",
//     file: "Meeting_Notes_Q4.txt",
//     fileType: "TXT",
//     category: "Meetings",
//     generatedAt: "3h ago",
//     readTime: "20 sec",
//     confidence: 91,
//     starred: false,
//     bookmarked: false,
//     tags: ["Sprint", "Action Items", "Q4"],
//     gradient: "from-amber-500 to-orange-600",
//     accent: "#f59e0b",
//     accentDim: "rgba(245,158,11,0.1)",
//     accentBorder: "rgba(245,158,11,0.22)",
//     accentText: "text-amber-300",
//     tagBg: "bg-amber-500/10 border-amber-500/20 text-amber-300",
//     summary: "Sprint review covered 7 completed tickets with 3 carried over. Critical blockers identified in the auth service integration affecting the login flow. Design handoff for onboarding flow v2 is scheduled for this Friday. 4 action items assigned across the team with clear owners. Next sync scheduled for Thursday 10AM PST — attendance required for all senior engineers.",
//     keyInsights: [
//       "7 tickets closed, 3 carried to next sprint",
//       "Auth service blocker — login flow affected",
//       "Design handoff for onboarding v2 on Friday",
//       "4 action items with assigned owners",
//     ],
//     sentiment: "Neutral",
//     sentimentColor: "text-gray-400",
//     pages: 4,
//     wordCount: "850 words",
//     status: "Complete",
//   },
//   {
//     id: 5,
//     title: "Market Research 2025",
//     file: "Market_Research_2025.pdf",
//     fileType: "PDF",
//     category: "Research",
//     generatedAt: "Yesterday",
//     readTime: "2 min",
//     confidence: 88,
//     starred: false,
//     bookmarked: true,
//     tags: ["Market", "Analysis", "TAM"],
//     gradient: "from-cyan-500 to-blue-600",
//     accent: "#06b6d4",
//     accentDim: "rgba(6,182,212,0.1)",
//     accentBorder: "rgba(6,182,212,0.22)",
//     accentText: "text-cyan-300",
//     tagBg: "bg-cyan-500/10 border-cyan-500/20 text-cyan-300",
//     summary: "Total addressable market estimated at $12B with a serviceable market of $2.4B in the document intelligence vertical. Primary competitors hold 64% market share combined. Three untapped segments identified: mid-market legal firms (22% TAM), healthcare compliance (18% TAM), and government procurement (12% TAM). Customer acquisition cost benchmarks show 40% lower CAC in inbound-led GTM motions.",
//     keyInsights: [
//       "$12B TAM in document intelligence vertical",
//       "3 untapped segments with strong fit",
//       "Inbound GTM 40% lower CAC",
//       "Competitors hold 64% combined share",
//     ],
//     sentiment: "Positive",
//     sentimentColor: "text-emerald-400",
//     pages: 22,
//     wordCount: "8,600 words",
//     status: "Complete",
//   },
//   {
//     id: 6,
//     title: "Brand Guidelines v3",
//     file: "Brand_Guidelines_v3.pdf",
//     fileType: "PDF",
//     category: "Design",
//     generatedAt: "3d ago",
//     readTime: "1.5 min",
//     confidence: 82,
//     starred: false,
//     bookmarked: false,
//     tags: ["Brand", "Design", "Style"],
//     gradient: "from-rose-500 to-pink-600",
//     accent: "#f43f5e",
//     accentDim: "rgba(244,63,94,0.1)",
//     accentBorder: "rgba(244,63,94,0.22)",
//     accentText: "text-rose-300",
//     tagBg: "bg-rose-500/10 border-rose-500/20 text-rose-300",
//     summary: "Updated brand guidelines introduce a refreshed primary color palette moving to midnight blue (#1E2A4A) with cyan accent (#00D4FF). Typography now uses Inter for UI and Fraunces for editorial contexts. Motion design principles added for the first time, covering micro-interactions, page transitions, and loading states. Logo usage rules updated with 14 new application examples across digital and print.",
//     keyInsights: [
//       "New midnight blue primary color palette",
//       "Inter + Fraunces typography system",
//       "Motion design principles added",
//       "14 new logo usage examples",
//     ],
//     sentiment: "Positive",
//     sentimentColor: "text-emerald-400",
//     pages: 48,
//     wordCount: "6,800 words",
//     status: "Complete",
//   },
// ];

const categories = ["All", "Finance", "Product", "Legal", "Meetings", "Research", "Design"];

/* ─── Confidence Ring ─── */
function ConfidenceRing({ value, color, size = 44 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const r = size / 2 - 5;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;

  return (
    <div ref={ref} className="relative shrink-0" style={{ width: size, height: size }}>
      <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full -rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth="3.5" stroke="rgba(255,255,255,0.05)" />
        <motion.circle
          cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth="3.5"
          stroke={color} strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={inView ? { strokeDashoffset: offset } : {}}
          transition={{ duration: 1.4, ease: "easeOut", delay: 0.3 }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-white font-bold text-[11px] leading-none">{value}%</span>
      </div>
    </div>
  );
}

/* ─── Copy Button ─── */
function CopyButton({ text, className = "" }) {
  const [copied, setCopied] = useState(false);
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={(e) => { e.stopPropagation(); navigator.clipboard?.writeText(text).catch(() => {}); setCopied(true); setTimeout(() => setCopied(false), 1800); }}
      className={`w-7 h-7 rounded-lg bg-white/5 border border-white/[0.07] flex items-center justify-center transition-all hover:bg-white/10 ${className}`}
    >
      <AnimatePresence mode="wait">
        {copied
          ? <motion.div key="c" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}><FiCheck className="text-emerald-400 text-xs" /></motion.div>
          : <motion.div key="d" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}><FiCopy className="text-gray-500 text-xs" /></motion.div>}
      </AnimatePresence>
    </motion.button>
  );
}

/* ─── Summary Card ─── */
function SummaryCard({ summary: s, index, view }) {
  const [hovered, setHovered] = useState(false);
  const [starred, setStarred] = useState(s.starred);
  const [bookmarked, setBookmarked] = useState(s.bookmarked);
  const [expanded, setExpanded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  const menuItems = [
    { icon: <FiEye />, label: "View document" },
    { icon: <FiDownload />, label: "Export summary" },
    { icon: <FiShare2 />, label: "Share" },
    { icon: <FiRefreshCw />, label: "Regenerate" },
    { icon: <FiTrash2 />, label: "Delete", danger: true },
  ];

  if (view === "list") {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, x: -14 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.45, delay: index * 0.06 }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => { setHovered(false); setMenuOpen(false); }}
        className="relative flex items-center gap-4 px-5 py-4 rounded-2xl border bg-[#111827] cursor-pointer transition-all duration-300"
        style={{ borderColor: hovered ? s.accentBorder : "rgba(31,41,55,1)", boxShadow: hovered ? `0 0 28px ${s.accentDim}` : "none" }}
      >
        <motion.div animate={{ scale: hovered ? 1.08 : 1 }} transition={{ duration: 0.2 }}
          className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.gradient} flex items-center justify-center text-white text-sm shrink-0`}>
          <FiFileText />
        </motion.div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <p className={`text-sm font-semibold truncate transition-colors ${hovered ? "text-white" : "text-gray-100"}`}>{s.title}</p>
            {starred && <FiStar className="text-amber-400 text-xs shrink-0" style={{ fill: "#f59e0b" }} />}
            <span className={`hidden sm:inline px-2 py-0.5 rounded-full text-[9px] font-bold border ${s.tagBg}`}>{s.category}</span>
          </div>
          <p className="text-gray-500 text-xs truncate">{s.summary.slice(0, 90)}…</p>
        </div>
        <div className="hidden md:flex items-center gap-4 text-gray-600 text-xs shrink-0">
          <ConfidenceRing value={s.confidence} color={s.accent} size={36} />
          <div className="flex items-center gap-1"><FiClock className="text-[10px]" />{s.generatedAt}</div>
        </div>
        <div className={`flex items-center gap-1.5 transition-opacity duration-200 ${hovered ? "opacity-100" : "opacity-0"}`}>
          <CopyButton text={s.summary} />
          <motion.button whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.9 }}
            onClick={(e) => { e.stopPropagation(); setStarred(!starred); }}
            className="w-7 h-7 rounded-lg bg-white/5 border border-white/[0.07] flex items-center justify-center hover:bg-white/10 transition-all">
            <FiStar className={`text-xs ${starred ? "text-amber-400" : "text-gray-600"}`} style={{ fill: starred ? "#f59e0b" : "none" }} />
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.5, delay: index * 0.09, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setMenuOpen(false); }}
      className="relative rounded-2xl border bg-[#111827] overflow-hidden cursor-pointer transition-all duration-300"
      style={{ borderColor: hovered ? s.accentBorder : "rgba(31,41,55,1)", boxShadow: hovered ? `0 0 40px ${s.accentDim}, 0 4px 20px rgba(0,0,0,0.3)` : "0 2px 12px rgba(0,0,0,0.2)" }}
    >
      {/* Top gradient line */}
      <motion.div animate={{ scaleX: hovered ? 1 : 0, opacity: hovered ? 1 : 0 }} transition={{ duration: 0.3 }}
        className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${s.gradient} origin-left`} />
      {/* Corner glow */}
      <motion.div animate={{ opacity: hovered ? 1 : 0 }} transition={{ duration: 0.35 }}
        className="absolute -top-8 -right-8 w-32 h-32 rounded-full blur-[55px] pointer-events-none" style={{ background: s.accentDim }} />

      <div className="relative z-10 p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <motion.div animate={{ scale: hovered ? 1.08 : 1, rotate: hovered ? 5 : 0 }} transition={{ duration: 0.25 }}
              className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.gradient} flex items-center justify-center text-white text-sm shrink-0`}>
              <FiFileText />
            </motion.div>
            <div className="min-w-0">
              <p className={`text-sm font-semibold truncate transition-colors ${hovered ? "text-white" : "text-gray-100"}`}>{s.title}</p>
              <p className="text-gray-600 text-[10px] truncate mt-0.5">{s.file} · {s.pages}p · {s.wordCount}</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <ConfidenceRing value={s.confidence} color={s.accent} size={42} />
            <motion.button whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}
              onClick={(e) => { e.stopPropagation(); setStarred(!starred); }}
              className="w-7 h-7 rounded-lg bg-white/5 border border-white/[0.07] flex items-center justify-center hover:bg-white/10 transition-all">
              <FiStar className={`text-xs ${starred ? "text-amber-400" : "text-gray-600"}`} style={{ fill: starred ? "#f59e0b" : "none" }} />
            </motion.button>
            <motion.button whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}
              onClick={(e) => { e.stopPropagation(); setBookmarked(!bookmarked); }}
              className="w-7 h-7 rounded-lg bg-white/5 border border-white/[0.07] flex items-center justify-center hover:bg-white/10 transition-all">
              <FiBookmark className={`text-xs ${bookmarked ? s.accentText : "text-gray-600"}`} style={{ fill: bookmarked ? s.accent : "none" }} />
            </motion.button>
            <div className="relative">
              <motion.button whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}
                onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen); }}
                className="w-7 h-7 rounded-lg bg-white/5 border border-white/[0.07] flex items-center justify-center text-gray-600 hover:text-gray-200 hover:bg-white/10 transition-all">
                <FiMoreHorizontal className="text-xs" />
              </motion.button>
              <AnimatePresence>
                {menuOpen && (
                  <motion.div initial={{ opacity: 0, scale: 0.9, y: -4 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.15 }} className="absolute right-0 top-full mt-1.5 w-44 rounded-2xl border border-[#1F2937] overflow-hidden shadow-2xl z-30"
                    style={{ background: "rgba(17,24,39,0.98)", backdropFilter: "blur(20px)" }} onClick={(e) => e.stopPropagation()}>
                    {menuItems.map((item, i) => (
                      <motion.button key={i} whileHover={{ backgroundColor: item.danger ? "rgba(239,68,68,0.07)" : "rgba(255,255,255,0.04)" }}
                        onClick={() => setMenuOpen(false)}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-xs transition-colors ${item.danger ? "text-red-400" : "text-gray-300"} ${i > 0 ? "border-t border-white/[0.04]" : ""}`}>
                        <span className={`${item.danger ? "text-red-400" : "text-gray-500"} text-sm`}>{item.icon}</span>{item.label}
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* AI Badge row */}
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <motion.div animate={{ opacity: [0.7, 1, 0.7] }} transition={{ duration: 2.5, repeat: Infinity }}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border" style={{ borderColor: s.accentBorder, background: s.accentDim }}>
            <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }}>
              <FiZap className={`text-[10px] ${s.accentText}`} />
            </motion.div>
            <span className={`text-[10px] font-semibold ${s.accentText}`}>AI Summary</span>
          </motion.div>
          <span className="text-gray-700 text-[10px]">·</span>
          <span className={`text-[10px] font-medium ${s.sentimentColor}`}>{s.sentiment}</span>
          <span className="text-gray-700 text-[10px]">·</span>
          <div className="flex items-center gap-1 text-gray-600 text-[10px]"><FiClock className="text-[9px]" />{s.generatedAt}</div>
          <span className="text-gray-700 text-[10px]">·</span>
          <span className="text-gray-600 text-[10px]">{s.readTime} read</span>
        </div>

        {/* Summary text */}
        <div className="mb-3">
          <p className="text-gray-400 text-xs leading-relaxed">
            {expanded ? s.summary : s.summary.slice(0, 130) + (s.summary.length > 130 ? "…" : "")}
          </p>
          {s.summary.length > 130 && (
            <motion.button whileHover={{ x: 2 }} onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
              className={`flex items-center gap-1 mt-1.5 text-[11px] font-medium ${s.accentText}`}>
              {expanded ? <>Show less <FiChevronUp className="text-[10px]" /></> : <>Read more <FiChevronDown className="text-[10px]" /></>}
            </motion.button>
          )}
        </div>

        {/* Key insights (on expand) */}
        <AnimatePresence>
          {expanded && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }} className="mb-3 overflow-hidden">
              <p className="text-[10px] text-gray-600 font-semibold uppercase tracking-widest mb-2">Key Insights</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {s.keyInsights.map((point, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
                    className="flex items-start gap-2 px-2.5 py-1.5 rounded-lg border" style={{ background: s.accentDim, borderColor: s.accentBorder }}>
                    <div className="w-1 h-1 rounded-full mt-1.5 shrink-0" style={{ background: s.accent }} />
                    <span className={`text-[10px] font-medium ${s.accentText} leading-relaxed`}>{point}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tags */}
        <div className="flex items-center gap-1.5 flex-wrap mb-4">
          {s.tags.map((tag, i) => (
            <motion.span key={i} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.09 + 0.3 + i * 0.05 }}
              whileHover={{ scale: 1.08 }}
              className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border cursor-default ${s.tagBg}`}>
              <FiTag className="text-[8px]" />{tag}
            </motion.span>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-white/[0.05]">
          <div className="flex items-center gap-1.5">
            <CopyButton text={s.summary} />
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
              className="w-7 h-7 rounded-lg bg-white/5 border border-white/[0.07] flex items-center justify-center text-gray-500 hover:text-gray-200 hover:bg-white/10 transition-all">
              <FiShare2 className="text-xs" />
            </motion.button>
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
              className="w-7 h-7 rounded-lg bg-white/5 border border-white/[0.07] flex items-center justify-center text-gray-500 hover:text-gray-200 hover:bg-white/10 transition-all">
              <FiDownload className="text-xs" />
            </motion.button>
          </div>
          <motion.button whileHover={{ scale: 1.04, x: 2 }} whileTap={{ scale: 0.97 }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-semibold border transition-all ${s.accentText}`}
            style={{ background: s.accentDim, borderColor: s.accentBorder }}>
            <FiEye className="text-[10px]" /> View Full
            <motion.span animate={{ x: hovered ? [0, 3, 0] : 0 }} transition={{ duration: 1, repeat: hovered ? Infinity : 0 }}>
              <FiArrowRight className="text-[10px]" />
            </motion.span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Stats Bar ─── */
function StatsBar({ summaries }) {
  const total = summaries.length;
  const avgConfidence = Math.round(summaries.reduce((a, s) => a + s.confidence, 0) / total);
  const starred = summaries.filter((s) => s.starred).length;
  const stats = [
    { label: "Summaries", value: total, icon: <FiZap />, color: "text-blue-400" },
    { label: "Avg Confidence", value: `${avgConfidence}%`, icon: <FiTrendingUp />, color: "text-purple-400" },
    { label: "Starred", value: starred, icon: <FiStar />, color: "text-amber-400" },
    { label: "AI Processed", value: "100%", icon: <FiCpu />, color: "text-emerald-400" },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
      className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
      {stats.map((s, i) => (
        <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 + i * 0.06 }}
          whileHover={{ scale: 1.04, y: -2 }}
          className="flex items-center gap-3 px-4 py-3 rounded-2xl border border-[#1F2937] bg-[#111827] cursor-default">
          <span className={`text-base ${s.color}`}>{s.icon}</span>
          <div>
            <p className="text-white font-bold text-base leading-none">{s.value}</p>
            <p className="text-gray-600 text-[10px] mt-0.5">{s.label}</p>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

/* ─── Empty State ─── */
function EmptyState() {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-24 rounded-3xl border border-dashed border-[#1F2937] col-span-full">
      <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 text-2xl mb-5">
        <FiZap />
      </motion.div>
      <h3 className="text-white font-semibold text-base mb-2">No summaries found</h3>
      <p className="text-gray-500 text-sm text-center max-w-xs mb-6">Try a different category or upload a document to generate your first AI summary.</p>
      <motion.button whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(139,92,246,0.35)" }} whileTap={{ scale: 0.97 }}
        className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-sm font-semibold">
        <FiZap /> Generate Summary
      </motion.button>
    </motion.div>
  );
}

/* ─── Main Page ─── */
export default function AiSummariesPage() {
  const [summariesData, setSummariesData] =
  useState([]);

  const [activeCategory, setActiveCategory] = useState("All");
  useEffect(() => {

  const fetchSummaries = async () => {

    try {

      const token =
        localStorage.getItem("token");

      const data =
        await getSummaries(token);

      console.log(
        "SUMMARIES:",
        data
      );

      setSummariesData(
        data.documents
      );

    } catch (error) {

      console.error(
        "Fetch Summary Error:",
        error
      );

    }

  };

  fetchSummaries();

}, []);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [view, setView] = useState("grid");
  const [sortBy, setSortBy] = useState("newest");

  const filtered =
  summariesData.filter((s) => {

    const matchSearch =
      !searchQuery ||

      s.title
        .toLowerCase()
        .includes(
          searchQuery.toLowerCase()
        ) ||

      (s.summary || "")
        .toLowerCase()
        .includes(
          searchQuery.toLowerCase()
        );

    return matchSearch;
  });
    
  filtered.sort((a, b) => {
    if (sortBy === "confidence") return b.confidence - a.confidence;
    if (sortBy === "starred") return Number(b.starred) - Number(a.starred);
    return 0;
  });

  return (
    <div className="min-h-screen bg-[#0B0F19]" style={{ fontFamily: "'Poppins', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');`}</style>

      {/* Ambient */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div animate={{ scale: [1, 1.15, 1], opacity: [0.06, 0.12, 0.06] }} transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-0 left-1/3 w-[600px] h-[400px] bg-purple-500 blur-[140px] rounded-full" />
        <motion.div animate={{ scale: [1, 1.1, 1], opacity: [0.04, 0.09, 0.04] }} transition={{ duration: 13, repeat: Infinity, delay: 3 }}
          className="absolute bottom-0 right-1/4 w-[500px] h-[400px] bg-blue-600 blur-[140px] rounded-full" />
        <div className="absolute inset-0 opacity-[0.025]"
          style={{ backgroundImage: "linear-gradient(rgba(100,200,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(100,200,255,1) 1px,transparent 1px)", backgroundSize: "50px 50px" }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-10">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <FiZap className="text-lg" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-white font-bold text-xl tracking-tight">AI Summaries</h1>
                <motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.8, repeat: Infinity }}
                  className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-[10px] font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />Live
                </motion.span>
              </div>
              <p className="text-gray-500 text-sm">{summariesData.length} AI-generated summaries across your documents</p>
            </div>
          </div>
          <motion.button whileHover={{ scale: 1.04, boxShadow: "0 0 24px rgba(139,92,246,0.4)" }} whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-sm font-semibold relative overflow-hidden shrink-0">
            <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12"
              animate={{ x: ["-100%", "200%"] }} transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 2 }} />
            <FiZap className="relative z-10" />
            <span className="relative z-10">New Summary</span>
          </motion.button>
        </motion.div>

        {/* Stats */}
        {/* <StatsBar summaries={summariesData} /> */}

        {/* Toolbar */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          {/* Category tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5" style={{ scrollbarWidth: "none" }}>
            {categories.map((cat) => (
              <motion.button key={cat} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all shrink-0 ${
                  activeCategory === cat
                    ? "bg-purple-500/15 border border-purple-500/25 text-purple-300"
                    : "text-gray-500 hover:text-gray-300 border border-transparent hover:border-white/[0.07] hover:bg-white/[0.04]"
                }`}>
                {cat}
              </motion.button>
            ))}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Search */}
            <motion.div animate={{ borderColor: searchFocused ? "rgba(139,92,246,0.4)" : "rgba(31,41,55,1)", boxShadow: searchFocused ? "0 0 0 3px rgba(139,92,246,0.06)" : "none" }}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl border bg-white/[0.03]">
              <FiSearch className={`text-xs transition-colors ${searchFocused ? "text-purple-400" : "text-gray-600"}`} />
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)} onBlur={() => setSearchFocused(false)}
                placeholder="Search summaries…" className="bg-transparent text-white text-xs placeholder-gray-700 outline-none w-32" />
            </motion.div>

            {/* Sort */}
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-[#1F2937] bg-[#111827] text-gray-400 text-xs outline-none cursor-pointer">
              <option value="newest">Newest</option>
              <option value="confidence">Confidence</option>
              <option value="starred">Starred</option>
            </select>

            {/* View toggle */}
            <div className="flex items-center gap-0.5 p-1 rounded-xl border border-[#1F2937] bg-white/[0.02]">
              {[{ icon: <FiGrid />, val: "grid" }, { icon: <FiList />, val: "list" }].map(({ icon, val }) => (
                <motion.button key={val} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setView(val)}
                  className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs transition-all ${view === val ? "bg-purple-500/15 border border-purple-500/20 text-purple-400" : "text-gray-600 hover:text-gray-300"}`}>
                  {icon}
                </motion.button>
              ))}
            </div>

            <motion.button whileHover={{ scale: 1.05 }} className="w-7 h-7 rounded-xl border border-[#1F2937] bg-white/[0.03] flex items-center justify-center text-gray-500 hover:text-gray-300 transition-colors">
              <FiFilter className="text-xs" />
            </motion.button>
          </div>
        </motion.div>

        {/* Results count */}
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          className="text-gray-600 text-[11px] mb-4">
          {filtered.length} {filtered.length === 1 ? "summary" : "summaries"} {activeCategory !== "All" ? `in ${activeCategory}` : ""}
        </motion.p>

        {/* Grid or List */}
        <AnimatePresence mode="wait">
          {view === "grid" ? (
            <motion.div key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-5">
             {filtered.length > 0 ? (

  filtered.map((doc) => (

    <div
      key={doc._id}
      className="
      bg-[#111827]
      border
      border-[#1F2937]
      rounded-xl
      p-5
      "
    >

      <h2
        className="
        text-white
        text-lg
        font-semibold
        mb-3
        "
      >
        {doc.title}
      </h2>

      <p
        className="
        text-gray-400
        whitespace-pre-wrap
        text-sm
        "
      >
        {doc.summary}
      </p>

    </div>

  ))

) : (
  <EmptyState />
)}
            </motion.div>
          ) : (
            <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
             {filtered.length > 0 ? (

  filtered.map((doc) => (

    <div
      key={doc._id}
      className="
      bg-[#111827]
      border
      border-[#1F2937]
      rounded-xl
      p-5
      "
    >

      <h2 className="text-white font-semibold">
        {doc.title}
      </h2>

      <p className="text-gray-400 mt-2">
        {doc.summary}
      </p>

    </div>

  ))

) : (
  <EmptyState />
)}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}