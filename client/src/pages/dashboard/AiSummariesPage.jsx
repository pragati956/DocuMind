import ReactMarkdown from "react-markdown";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getSummaries } from "../../services/aiService";
import { deleteDocument, toggleStarDocument } from "../../services/documentService";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  FiZap, FiStar, FiTag, FiEye, FiCopy, FiShare2,
  FiFileText, FiMoreHorizontal, FiArrowRight, FiFilter,
  FiSearch, FiBookmark, FiTrendingUp, FiCpu, FiClock,
  FiCheck, FiChevronDown, FiChevronUp, FiRefreshCw,
  FiDownload, FiTrash2, FiGrid, FiList,
} from "react-icons/fi";

const categories = ["All", "Document", "Finance", "Product", "Legal", "Meetings", "Research", "Design"];

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
      onClick={(e) => { 
        e.stopPropagation(); 
        navigator.clipboard?.writeText(text).catch(() => { }); 
        setCopied(true); 
        setTimeout(() => setCopied(false), 1800); 
      }}
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
function SummaryCard({ summary: s, index, view, onDelete, onToggleStar }) {
  const [hovered, setHovered] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

 const menuItems = [
  { icon:<FiTrash2 />, label:"Delete", danger:true }
];

  const handleMenuAction = (item, e) => {
    e.stopPropagation();
    setMenuOpen(false);
    if (item.label === "Delete") {
      onDelete(s._id);
    }
    // Add logic for other actions if needed
  };

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
            {s.starred && <FiStar className="text-amber-400 text-xs shrink-0" style={{ fill: "#f59e0b" }} />}
            <span className={`hidden sm:inline px-2 py-0.5 rounded-full text-[9px] font-bold border ${s.tagBg}`}>{s.category}</span>
          </div>
          <p className="text-gray-500 text-xs truncate">{s.summary.slice(0, 90)}…</p>
        </div>
        <div className="hidden md:flex items-center gap-4 text-gray-600 text-xs shrink-0">
          <div className="flex items-center gap-1"><FiClock className="text-[10px]" />{s.generatedAt}</div>
        </div>
        <div className={`flex items-center gap-1.5 transition-opacity duration-200 ${hovered ? "opacity-100" : "opacity-0"}`}>
          <CopyButton text={s.summary} />
          <motion.button whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.9 }}
            onClick={(e) => { e.stopPropagation(); onToggleStar(s._id); }}
            className="w-7 h-7 rounded-lg bg-white/5 border border-white/[0.07] flex items-center justify-center hover:bg-white/10 transition-all">
            <FiStar className={`text-xs ${s.starred ? "text-amber-400" : "text-gray-600"}`} style={{ fill: s.starred ? "#f59e0b" : "none" }} />
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
      <motion.div animate={{ scaleX: hovered ? 1 : 0, opacity: hovered ? 1 : 0 }} transition={{ duration: 0.3 }}
        className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${s.gradient} origin-left`} />
      <motion.div animate={{ opacity: hovered ? 1 : 0 }} transition={{ duration: 0.35 }}
        className="absolute -top-8 -right-8 w-32 h-32 rounded-full blur-[55px] pointer-events-none" style={{ background: s.accentDim }} />

      <div className="relative z-10 p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <motion.div animate={{ scale: hovered ? 1.08 : 1, rotate: hovered ? 5 : 0 }} transition={{ duration: 0.25 }}
              className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.gradient} flex items-center justify-center text-white text-sm shrink-0`}>
              <FiFileText />
            </motion.div>
            <div className="min-w-0">
              <p className={`text-sm font-semibold truncate transition-colors ${hovered ? "text-white" : "text-gray-100"}`}>{s.title}</p>
              <p className="text-gray-600 text-[10px] truncate mt-0.5">{s.fileType} · {s.pages}p · {s.wordCount}</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <motion.button whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}
              onClick={(e) => { e.stopPropagation(); onToggleStar(s._id); }}
              className="w-7 h-7 rounded-lg bg-white/5 border border-white/[0.07] flex items-center justify-center hover:bg-white/10 transition-all">
              <FiStar className={`text-xs ${s.starred ? "text-amber-400" : "text-gray-600"}`} style={{ fill: s.starred ? "#f59e0b" : "none" }} />
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
                        onClick={(e) => handleMenuAction(item, e)}
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
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border bg-white/[0.03]"
            style={{ borderColor: s.accentBorder }}>
            <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }}>
              <FiZap className={`text-[10px] ${s.accentText}`} />
            </motion.div>
            <span className={`text-[10px] font-semibold ${s.accentText}`}>AI Summary</span>
          </motion.div>

          <span className="text-gray-700 text-[10px]">·</span>
          <div className="flex items-center gap-1 text-gray-600 text-[10px]">
            <FiClock className="text-[9px]" />
            {s.generatedAt}
          </div>
          <span className="text-gray-700 text-[10px]">·</span>
          <div className="flex items-center gap-1 text-gray-600 text-[10px]">
            <FiTrendingUp className="text-[9px]" />
            {s.keyInsights.length} insights
          </div>
        </div>

        {/* Insight text */}
        <div className="mb-3">
          <AnimatePresence initial={false}>
            <motion.div className="text-gray-400 text-xs leading-relaxed" animate={{ height: expanded ? "auto" : undefined }}>
              <div className="prose prose-invert max-w-none text-sm">
                <ReactMarkdown>
                  {expanded ? s.summary : s.summary.slice(0, 130) + (s.summary.length > 130 ? "…" : "")}
                </ReactMarkdown>
              </div>
            </motion.div>
          </AnimatePresence>
          {s.summary.length > 130 && (
            <motion.button whileHover={{ x: 2 }} onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
              className={`flex items-center gap-1 mt-1.5 text-[11px] font-medium ${s.accentText} transition-colors`}>
              {expanded ? <>Show less <FiChevronUp className="text-[10px]" /></> : <>Read more <FiChevronDown className="text-[10px]" /></>}
            </motion.button>
          )}
        </div>

        {/* Key insights (expanded) */}
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
              onClick={(e) => { e.stopPropagation(); }}
              className="w-7 h-7 rounded-lg bg-white/5 border border-white/[0.07] flex items-center justify-center text-gray-500 hover:text-gray-200 hover:bg-white/10 transition-all">
              <FiShare2 className="text-xs" />
            </motion.button>
          </div>
          <motion.button whileHover={{ scale: 1.04, x: 2 }} whileTap={{ scale: 0.97 }}
onClick={(e) => {
  e.stopPropagation();

  if (s.fileUrl) {
    window.open(
      s.fileUrl,
      "_blank"
    );
  }
}}            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-semibold border transition-all ${s.accentText}`}
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

/* ─── Empty State ─── */
function EmptyState() {
  const navigate = useNavigate();
  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-24 rounded-3xl border border-dashed border-[#1F2937] col-span-full">
      <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 text-2xl mb-5">
        <FiZap />
      </motion.div>
      <h3 className="text-white font-semibold text-base mb-2">No summaries found</h3>
      <p className="text-gray-500 text-sm text-center max-w-xs mb-6">Try a different category or upload a document to generate your first AI summary.</p>
      <motion.button 
        onClick={() => navigate("/dashboard/upload")}
        whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(139,92,246,0.35)" }} 
        whileTap={{ scale: 0.97 }}
        className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-sm font-semibold"
      >
        <FiZap /> Generate Summary
      </motion.button>
    </motion.div>
  );
}

/* ─── Main Page ─── */
export default function AiSummariesPage() {
  const navigate = useNavigate();
  const [summariesData, setSummariesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [view, setView] = useState("grid");
  const [sortBy, setSortBy] = useState("newest");

  const fetchSummaries = async () => {
    try {
      const token = localStorage.getItem("token");
      const data = await getSummaries(token);

      const formatted = data.documents.map((doc) => {
        const ext = doc.title.split(".").pop().toLowerCase();
        let accent = "#8b5cf6";
        let grad = "from-purple-500 to-pink-600";
        let text = "text-purple-300";

        if (ext === "pdf") {
          accent = "#ef4444";
          grad = "from-red-500 to-rose-600";
          text = "text-red-300";
        } else if (ext === "docx" || ext === "doc") {
          accent = "#3b82f6";
          grad = "from-blue-500 to-indigo-600";
          text = "text-blue-300";
        } else if (ext === "txt") {
          accent = "#10b981";
          grad = "from-emerald-500 to-teal-600";
          text = "text-emerald-300";
        } else if (ext === "png" || ext === "jpg" || ext === "jpeg") {
          accent = "#f59e0b";
          grad = "from-amber-500 to-orange-600";
          text = "text-amber-300";
        }

        const rawText = doc.summary || "No summary available.";
        // Simple regex to extract sentences for key insights
        const sentences = rawText.split(/(?<=\.)\s+/).filter(s => s.trim().length > 10).slice(0, 4);
        const keyInsights = sentences.length > 0 ? sentences : ["Summary generated successfully."];

        return {
          _id: doc._id,
          title: doc.title,
          summary: doc.summary,
          file: doc.title,
          fileType: ext.toUpperCase(),
          fileUrl: doc.fileUrl,
          category: doc.tags?.[0] || "Document",
          generatedAt: new Date(doc.createdAt).toLocaleDateString(),
        
          
          starred: doc.starred || false,
          tags: doc.tags && doc.tags.length > 0 ? doc.tags : ["AI Summary"],
          gradient: grad,
          accent: accent,
          accentDim: `rgba(255,255,255,0.05)`, 
          accentBorder: `rgba(255,255,255,0.1)`,
          accentText: text,
          tagBg: `bg-white/5 border-white/10 ${text}`,
          keyInsights: keyInsights,
          
pages: "-",
          wordCount: `${rawText.split(" ").length} words`,
          
        };
      });

      setSummariesData(formatted);
    } catch (error) {
      console.error("Fetch Summary Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummaries();
    const intervalId = setInterval(fetchSummaries, 30000); // Polling for new summaries
    return () => clearInterval(intervalId);
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteDocument(id);
      toast.success("Document deleted");
      fetchSummaries();
    } catch (err) {
      toast.error("Failed to delete document");
    }
  };

  const handleToggleStar = async (id) => {
    try {
      await toggleStarDocument(id);
      fetchSummaries();
    } catch (err) {
      toast.error("Failed to update star");
    }
  };

  const filtered = summariesData.filter((s) => {
    const matchSearch =
      !searchQuery ||
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.summary || "").toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchCategory = activeCategory === "All" || s.category === activeCategory;
    return matchSearch && matchCategory;
  });

  filtered.sort((a, b) => {
    if (sortBy === "starred") return Number(b.starred) - Number(a.starred);
    return 0; // "newest" is handled by the backend sort order
  });

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap'); .scrollbar-hide::-webkit-scrollbar{display:none}`}</style>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-between mb-4"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 text-sm">
            <FiZap />
          </div>
          <div>
            <h2 className="text-white font-semibold text-sm">AI Summaries</h2>
            <p className="text-gray-600 text-[10px]">{summariesData.length} documents analyzed</p>
          </div>
          <motion.span
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ duration: 1.8, repeat: Infinity }}
            className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-[10px] font-semibold ml-1"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
            Live
          </motion.span>
        </div>

        <div className="flex items-center gap-2">
          {/* Inline search */}
          <motion.div
            animate={{
              borderColor: searchFocused ? "rgba(139,92,246,0.4)" : "rgba(31,41,55,1)",
              boxShadow: searchFocused ? "0 0 0 3px rgba(139,92,246,0.06)" : "none",
            }}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl border bg-white/[0.03] text-xs"
          >
            <FiSearch className={`text-[11px] transition-colors ${searchFocused ? "text-purple-400" : "text-gray-600"}`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              placeholder="Search summaries…"
              className="bg-transparent text-white placeholder-gray-700 outline-none text-[11px] w-36"
            />
          </motion.div>

          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-[#1F2937] bg-[#111827] text-gray-400 text-xs outline-none cursor-pointer">
            <option value="newest">Newest</option>
            <option value="starred">Starred</option>
          </select>

          <div className="flex items-center gap-0.5 p-1 rounded-xl border border-[#1F2937] bg-white/[0.02]">
            {[{ icon: <FiGrid />, val: "grid" }, { icon: <FiList />, val: "list" }].map(({ icon, val }) => (
              <motion.button key={val} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setView(val)}
                className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs transition-all ${view === val ? "bg-purple-500/15 border border-purple-500/20 text-purple-400" : "text-gray-600 hover:text-gray-300"}`}>
                {icon}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Filter bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="mb-5 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide"
      >
        {categories.map((cat) => (
          <motion.button
            key={cat}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all duration-200 shrink-0 ${
              activeCategory === cat
                ? "bg-purple-500/15 border border-purple-500/25 text-purple-300"
                : "text-gray-500 hover:text-gray-300 border border-transparent hover:border-white/[0.07] hover:bg-white/[0.04]"
            }`}
          >
            {cat}
          </motion.button>
        ))}
      </motion.div>

      {/* Cards */}
      <AnimatePresence mode="popLayout">
        {loading && summariesData.length === 0 ? (
           <div className="flex justify-center items-center py-20 text-gray-500 text-sm">Loading summaries...</div>
        ) : filtered.length > 0 ? (
          <motion.div
            key={view}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={view === "grid" ? "grid grid-cols-1 md:grid-cols-2 gap-4" : "flex flex-col gap-3"}
          >
            {filtered.map((summary, index) => (
              <SummaryCard
                key={summary._id}
                summary={summary}
                index={index}
                view={view}
                onDelete={handleDelete}
                onToggleStar={handleToggleStar}
              />
            ))}
          </motion.div>
        ) : (
          <EmptyState />
        )}
      </AnimatePresence>
    </div>
  );
}