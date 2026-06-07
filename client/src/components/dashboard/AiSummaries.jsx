import ReactMarkdown from "react-markdown";
import {
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import {
  getSummaries,
} from "../../services/aiService";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiZap, FiStar, FiTag, FiEye, FiCopy, FiShare2,
  FiChevronDown, FiChevronUp, FiClock, FiFileText,
  FiMoreHorizontal, FiArrowRight, FiCheck, FiFilter,
  FiSearch, FiBookmark, FiTrendingUp,
} from "react-icons/fi";

/* ─── Confidence Ring ─── */
function ConfidenceRing({ value, color }) {
  const r = 14, circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;
  return (
    <div className="relative w-9 h-9 shrink-0">
      <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
        <circle cx="18" cy="18" r={r} fill="none" strokeWidth="3" stroke="rgba(255,255,255,0.05)" />
        <motion.circle
          cx="18" cy="18" r={r} fill="none" strokeWidth="3"
          stroke={color} strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.4 }}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-white">
        {value}%
      </span>
    </div>
  );
}

/* ─── Copy Button ─── */
function CopyButton({ text, accent }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = (e) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(text).catch(() => { });
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.92 }}
      onClick={handleCopy}
      className="w-7 h-7 rounded-lg bg-white/5 border border-white/[0.07] flex items-center justify-center transition-all duration-200 hover:bg-white/10"
    >
      <AnimatePresence mode="wait">
        {copied
          ? <motion.span key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}><FiCheck className="text-emerald-400 text-xs" /></motion.span>
          : <motion.span key="copy" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}><FiCopy className="text-gray-500 text-xs" /></motion.span>
        }
      </AnimatePresence>
    </motion.button>
  );
}

/* ─── Summary Card ─── */
function SummaryCard({ summary, index }) {
  const [hovered, setHovered] = useState(false);
  const [starred, setStarred] = useState(summary.starred);
  const [expanded, setExpanded] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  const truncLength = 350;
  const insightText = summary.insight || "";
  const isLong = insightText.length > truncLength;
  
  return (
    <motion.div
      layout // <--- FIXED: This allows smooth height shrinking
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay: index * 0.09, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative rounded-2xl border bg-[#111827] overflow-hidden transition-all duration-300"
      style={{
        borderColor: hovered ? summary.accentBorder : "rgba(31,41,55,1)",
        boxShadow: hovered
          ? `0 0 36px ${summary.accentDim}, 0 4px 20px rgba(0,0,0,0.3)`
          : "0 2px 12px rgba(0,0,0,0.2)",
      }}
    >
      {/* Top accent line */}
      <motion.div
        animate={{ scaleX: hovered ? 1 : 0, opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${summary.color} origin-left`}
      />

      {/* Corner glow */}
      <motion.div
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.35 }}
        className="absolute -top-10 -right-10 w-36 h-36 rounded-full blur-[55px] pointer-events-none"
        style={{ background: summary.accentDim }}
      />

      <motion.div layout className="relative z-10 p-5">

        {/* Header */}
        <motion.div layout className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3 min-w-0">
            <motion.div
              animate={{ scale: hovered ? 1.08 : 1 }}
              transition={{ duration: 0.25 }}
              className={`w-9 h-9 rounded-xl bg-gradient-to-br ${summary.color} flex items-center justify-center text-white text-sm shrink-0`}
            >
              <FiFileText />
            </motion.div>

            <div className="min-w-0">
              <p className={`text-white text-sm font-semibold truncate transition-colors duration-200 ${hovered ? summary.accentText : ""}`}>
                {summary.title}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-gray-600 text-[10px] truncate">{summary.file}</span>
                <span className="text-gray-700 text-[10px]">·</span>
                <span className="text-gray-600 text-[10px]">{summary.readTime}</span>
              </div>
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-1.5 shrink-0">
            <ConfidenceRing value={summary.confidence} color={summary.accent} />

            <motion.button
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setStarred(!starred)}
              className="w-7 h-7 rounded-lg bg-white/5 border border-white/[0.07] flex items-center justify-center transition-all duration-200 hover:bg-white/10"
            >
              <motion.div animate={{ scale: starred ? [1, 1.4, 1] : 1 }} transition={{ duration: 0.3 }}>
                <FiStar className={`text-xs transition-colors ${starred ? "text-amber-400 fill-amber-400" : "text-gray-600"}`} style={{ fill: starred ? "#f59e0b" : "none" }} />
              </motion.div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setBookmarked(!bookmarked)}
              className="w-7 h-7 rounded-lg bg-white/5 border border-white/[0.07] flex items-center justify-center transition-all duration-200 hover:bg-white/10"
            >
              <FiBookmark className={`text-xs transition-colors ${bookmarked ? summary.accentText : "text-gray-600"}`} style={{ fill: bookmarked ? summary.accent : "none" }} />
            </motion.button>

            <button className="w-7 h-7 rounded-lg bg-white/5 border border-white/[0.07] flex items-center justify-center text-gray-600 hover:text-gray-300 transition-all hover:bg-white/10">
              <FiMoreHorizontal className="text-xs" />
            </button>
          </div>
        </motion.div>

        {/* AI Badge */}
        <motion.div layout className="flex items-center gap-2 mb-3">
          <motion.div
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border bg-white/[0.03]"
            style={{ borderColor: summary.accentBorder }}
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <FiZap className={`text-[10px] ${summary.accentText}`} />
            </motion.div>
            <span className={`text-[10px] font-semibold ${summary.accentText}`}>AI Summary</span>
          </motion.div>

          <span className="text-gray-700 text-[10px]">·</span>
          <div className="flex items-center gap-1 text-gray-600 text-[10px]">
            <FiClock className="text-[9px]" />
            {summary.time}
          </div>
          <span className="text-gray-700 text-[10px]">·</span>
          <div className="flex items-center gap-1 text-gray-600 text-[10px]">
            <FiTrendingUp className="text-[9px]" />
            {summary.keyPoints} insights
          </div>
        </motion.div>

        {/* Insight text */}
        <motion.div layout className="mb-3">
          <AnimatePresence initial={false}>
            <motion.div layout className="text-gray-400 text-xs leading-relaxed">
              <div className="prose prose-invert max-w-none text-sm">
                <ReactMarkdown>
                  {expanded || !isLong ? insightText : insightText.slice(0, truncLength) + "..."}
                </ReactMarkdown>
              </div>
            </motion.div>
          </AnimatePresence>

          {isLong && (
            <motion.button
              layout
              whileHover={{ x: 2 }}
              onClick={() => setExpanded(!expanded)}
              className={`flex items-center gap-1 mt-1.5 text-[11px] font-medium ${summary.accentText} transition-colors`}
            >
              {expanded ? <>Show less <FiChevronUp className="text-[10px]" /></> : <>Read more <FiChevronDown className="text-[10px]" /></>}
            </motion.button>
          )}
        </motion.div>

        {/* Key insights (expanded) */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-3 overflow-hidden"
            >
              <p className="text-[10px] text-gray-600 font-semibold uppercase tracking-widest mb-2">Key Insights</p>
              <div className="grid grid-cols-2 gap-1.5">
                {summary.keyInsights.map((point, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border"
                    style={{ background: summary.accentDim, borderColor: summary.accentBorder }}
                  >
                    <div className="w-1 h-1 rounded-full shrink-0" style={{ background: summary.accent }} />
                    <span className={`text-[10px] font-medium ${summary.accentText} truncate`}>{point}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tags */}
        <motion.div layout className="flex items-center gap-1.5 flex-wrap mb-4">
          {summary.tags.map((tag, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.09 + 0.3 + i * 0.05 }}
              whileHover={{ scale: 1.08 }}
              className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border cursor-default ${summary.tagBg}`}
            >
              <FiTag className="text-[8px]" />
              {tag}
            </motion.span>
          ))}
        </motion.div>

        {/* Footer actions */}
        <motion.div layout className="flex items-center justify-between pt-3 border-t border-white/[0.05]">
          <div className="flex items-center gap-1.5">
            <CopyButton text={summary.insight} accent={summary.accent} />
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.92 }}
              className="w-7 h-7 rounded-lg bg-white/5 border border-white/[0.07] flex items-center justify-center text-gray-500 hover:text-gray-200 transition-all duration-200 hover:bg-white/10"
            >
              <FiShare2 className="text-xs" />
            </motion.button>
          </div>

          <motion.button
            whileHover={{ scale: 1.04, x: 2 }}
            whileTap={{ scale: 0.97 }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-semibold border transition-all duration-200 ${summary.accentText}`}
            style={{ background: summary.accentDim, borderColor: summary.accentBorder }}
          >
            <FiEye className="text-[10px]" />
            View Full
            <motion.span
              animate={{ x: hovered ? [0, 3, 0] : 0 }}
              transition={{ duration: 1, repeat: hovered ? Infinity : 0 }}
            >
              <FiArrowRight className="text-[10px]" />
            </motion.span>
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Filter Bar ─── */
function FilterBar({ active, setActive }) {
  const filters = ["All", "Starred", "Finance", "Legal", "Product", "Meetings"];
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide" style={{ scrollbarWidth: "none" }}>
      {filters.map((f) => (
        <motion.button
          key={f}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setActive(f)}
          className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all duration-200 shrink-0 ${active === f
            ? "bg-blue-500/15 border border-blue-500/25 text-blue-300"
            : "text-gray-500 hover:text-gray-300 border border-transparent hover:border-white/[0.07] hover:bg-white/[0.04]"
            }`}
        >
          {f}
        </motion.button>
      ))}
    </div>
  );
}

/* ─── Main Export ─── */
export default function AiSummaries() {
  const navigate = useNavigate();
  const [summaries, setSummaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  
  const fetchSummaries = async () => {
    try {
      const token = localStorage.getItem("token");
      const data = await getSummaries(token);
      setSummaries(
        data.documents.map((doc) => ({
          _id: doc.id,
          title: doc.title,
          insight: doc.summary,
          file: doc.title,
          readTime: "30 sec read",
          confidence: 95,
          keyPoints: 4,
          createdAt: doc.createdAt || new Date().toISOString(),
          time: "Just now",
          starred: false,
          tags: doc.tags || ["AI"],
          keyInsights: ["AI Generated"],
          color: "from-purple-500 to-pink-600",
          accent: "#8b5cf6",
          accentDim: "rgba(139,92,246,0.1)",
          accentBorder: "rgba(139,92,246,0.2)",
          accentText: "text-purple-300",
          tagBg: "bg-purple-500/10 border-purple-500/20 text-purple-300",
        }))
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchSummaries();
  }, []);

  const filtered = summaries.filter((s) => {
    const matchSearch =
      searchQuery === "" ||
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.insight || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

    return matchSearch;
  });

  const latestSummaries = filtered
    .slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 2);

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap'); .scrollbar-hide::-webkit-scrollbar{display:none}`}</style>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-between mb-4 mt-8" // Added mt-8 for spacing
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 text-sm">
            <FiZap />
          </div>
          <div>
            <h2 className="text-white font-semibold text-sm">AI Summaries</h2>
            <p className="text-gray-600 text-[10px]">{summaries.length} documents analyzed</p>
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

          <motion.button
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/[0.07] bg-white/[0.03] text-gray-500 hover:text-gray-300 text-xs transition-all hover:bg-white/[0.06]"
          >
            <FiFilter className="text-[10px]" /> Filter
          </motion.button>

          <button
            onClick={() => navigate("/dashboard/summaries")}
            className="text-gray-500 hover:text-gray-300 text-xs transition-colors"
          >
            View all
          </button>
        </div>
      </motion.div>

      {/* Filter bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="mb-5"
      >
        <FilterBar active={activeFilter} setActive={setActiveFilter} />
      </motion.div>

      {/* Cards */}
      <AnimatePresence mode="popLayout">
        {latestSummaries.length > 0 ? (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {latestSummaries.map((summary, index) => (
              <SummaryCard
                key={summary._id}
                summary={summary}
                index={index}
              />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-16 rounded-2xl border border-[#1F2937] bg-[#111827]"
          >
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 text-xl mb-3">
              <FiZap />
            </div>
            <p className="text-white font-medium text-sm mb-1">No summaries found</p>
            <p className="text-gray-600 text-xs">Try a different filter or search term</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}