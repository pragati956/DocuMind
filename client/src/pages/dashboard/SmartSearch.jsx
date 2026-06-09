import React, { useState, useRef, useEffect } from "react";
import { toast } from "react-hot-toast";
import SearchSkeleton
from "../../components/dashboard/SearchSkeleton";
import {
  searchDocuments,
  toggleStarDocument, getSearchStats,getCategories,getDocumentsByType,getSuggestions,
} from "../../services/documentService";
import { useNavigate }
from "react-router-dom";
import DocumentPreviewModal
from "../../components/dashboard/DocumentPreviewModal";
import {
  summarizeDocument,
} from "../../services/aiService";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiSearch, FiZap, FiFileText, FiClock, FiX,
  FiArrowRight, FiFilter, FiStar, FiTag,
  FiTrendingUp, FiCommand, FiCpu, FiEye,
  FiChevronRight, FiFolder, FiBookmark,
} from "react-icons/fi";

/* ─── Mock Data ─── */


const suggestions = [
  { label: "Revenue & Finance", icon: <FiTrendingUp />, color: "from-blue-500 to-indigo-600", accent: "#3b82f6", dim: "rgba(59,130,246,0.1)", border: "rgba(59,130,246,0.22)", text: "text-blue-300", count: 24 },
  { label: "Legal Documents", icon: <FiBookmark />, color: "from-purple-500 to-pink-600", accent: "#8b5cf6", dim: "rgba(139,92,246,0.1)", border: "rgba(139,92,246,0.22)", text: "text-purple-300", count: 7 },
  { label: "Product Strategy", icon: <FiFolder />, color: "from-emerald-500 to-teal-600", accent: "#10b981", dim: "rgba(16,185,129,0.1)", border: "rgba(16,185,129,0.22)", text: "text-emerald-300", count: 18 },
  { label: "Meeting Notes", icon: <FiFileText />, color: "from-amber-500 to-orange-600", accent: "#f59e0b", dim: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.22)", text: "text-amber-300", count: 31 },
];



const filters = [
 "All",
 "PDF",
 "DOCX",
 "TXT",
 "IMAGE",
 "Starred",
 "Recent",
 "Summarized"
];
const aiTips = [
  `Try asking in natural language: "summarize Q4 results"`,
  `Use quotes for exact phrases: "net revenue retention"`,
  `Filter by type: "legal contracts signed in 2024"`,
  `Ask for comparisons: "compare Q3 and Q4 performance"`,
];

/* ─── Typewriter Placeholder ─── */
function usePlaceholder(items, interval = 3200) {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % items.length), interval);
    return () => clearInterval(t);
  }, [items, interval]);
  return items[idx];
}

/* ─── Highlight match ─── */
function Highlight({ text, query }) {
  if (!query.trim()) return <>{text}</>;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, i) =>
        regex.test(part)
          ? <mark key={i} className="bg-blue-500/25 text-blue-200 rounded px-0.5">{part}</mark>
          : <React.Fragment key={i}>{part}</React.Fragment>
      )}
    </>
  );
}

/* ─── Search Bar ─── */
function SearchBar({
 query,
 setQuery,
 onSearch,
 focused,
 setFocused,
 loading,
 suggestions
}){
  const ref = useRef(null);
  const placeholders = [
    "Ask anything about your documents…",
    "Search quarterly revenue trends…",
    "Find contracts signed in 2024…",
    "Summarize the product roadmap…",
  ];
  const placeholder = usePlaceholder(placeholders);

  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); ref.current?.focus(); setFocused(true); }
      if (e.key === "Escape") { ref.current?.blur(); setFocused(false); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [setFocused]);

  return (
    <motion.div
      animate={{
        boxShadow: focused
          ? "0 0 0 3px rgba(59,130,246,0.12), 0 0 50px rgba(59,130,246,0.15)"
          : "0 0 0 1px rgba(255,255,255,0.04), 0 8px 32px rgba(0,0,0,0.3)",
        borderColor: focused ? "rgba(59,130,246,0.45)" : "rgba(31,41,55,1)",
        backgroundColor: focused ? "rgba(59,130,246,0.03)" : "rgba(17,24,39,0.8)",
      }}
      transition={{ duration: 0.25 }}
      className=" relative flex items-center gap-4 px-5 py-4 rounded-2xl border backdrop-blur-xl"
    >
      <motion.div animate={{ color: focused ? "#60a5fa" : "#4b5563", scale: focused ? 1.1 : 1 }} transition={{ duration: 0.2 }}>
        <FiSearch className="text-xl shrink-0" />
      </motion.div>

      <input
        ref={ref}
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onKeyDown={(e) => e.key === "Enter" && query.trim() && onSearch(query)}
        placeholder={placeholder}
        className="flex-1 bg-transparent text-white text-base placeholder-gray-600 outline-none"
      />

{query &&
 suggestions.length > 0 && (

  <div
   className="
   absolute
   top-full
   left-0
   right-0
   bg-[#111827]
   border
   border-[#1F2937]
   rounded-xl
   mt-2
   z-50
   "
  >

   {suggestions
    .filter(item =>
      item
       .toLowerCase()
       .includes(
        query.toLowerCase()
       )
    )
    .slice(0,5)
    .map(item => (

     <button
      key={item}
      onClick={() =>
       onSearch(item)
      }
      className="
      block
      w-full
      text-left
      px-4
      py-2
      hover:bg-white/5
      "
     >
      {item}
     </button>

    ))}

  </div>

)}

      <div className="flex items-center gap-2 shrink-0">
        <AnimatePresence>
          {query && (
            <motion.button
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setQuery("")}
              className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
            >
              <FiX className="text-xs" />
            </motion.button>
          )}
        </AnimatePresence>

        {!focused && (
          <kbd className="hidden sm:flex items-center gap-0.5 px-2 py-1 rounded-lg bg-white/5 border border-white/[0.07] text-gray-600 text-[10px] font-mono">
            <FiCommand className="text-[9px]" />K
          </kbd>
        )}

        <motion.button
          whileHover={query ? { scale: 1.05, boxShadow: "0 0 20px rgba(59,130,246,0.4)" } : {}}
          whileTap={query ? { scale: 0.97 } : {}}
          onClick={() => query.trim() && onSearch(query)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
            query
              ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white"
              : "bg-white/5 text-gray-600 cursor-default"
          }`}
        >
          <FiZap className="text-sm" />
<span className="hidden sm:inline">

 {loading
   ? "Searching..."
   : "Search"}

</span>        </motion.button>
      </div>
    </motion.div>
  );
}

/* ─── Recent Searches ─── */
function RecentSearches({
 searches,
 onSearch,
 onRemove,
 onClear
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <div className="flex items-center justify-between mb-3">
        <p className="text-[10px] text-gray-600 font-semibold uppercase tracking-widest flex items-center gap-1.5">
          <FiClock className="text-[9px]" /> Recent Searches
        </p>
<button
 onClick={onClear}
 className="text-gray-700 hover:text-gray-400 text-[10px]"
>
 Clear all
</button>      </div>
      <div className="flex flex-wrap gap-2">
        {searches.map((s, i) => (
          <motion.div
            key={s.id}
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className="group flex items-center gap-2 px-3 py-2 rounded-xl border border-[#1F2937] bg-white/[0.03] hover:border-blue-500/25 hover:bg-blue-500/[0.05] transition-all duration-200 cursor-pointer"
            onClick={() => onSearch(s.query)}
          >
            <FiClock className="text-gray-600 text-[10px] shrink-0" />
            <span className="text-gray-300 text-xs">{s.query}</span>
            <span className="text-gray-700 text-[10px]">·</span>
            <span className="text-gray-600 text-[10px]">{s.results} results</span>
            <span
 className="
 text-gray-700
 text-[10px]
 "
>
{s.searchedAt
 ? new Date(
     s.searchedAt
   ).toLocaleDateString()
 : ""
}
</span>
            <button
              onClick={(e) => { e.stopPropagation(); onRemove(s.id); }}
              className="opacity-0 group-hover:opacity-100 text-gray-600 hover:text-gray-300 transition-all ml-1"
            >
              <FiX className="text-[9px]" />
            </button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

/* ─── Suggestion Cards ─── */
function SuggestionCards({
 onSearch,
 categories
}){
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <p className="text-[10px] text-gray-600 font-semibold uppercase tracking-widest mb-3 flex items-center gap-1.5">
        <FiTag className="text-[9px]" /> Browse by Category
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {categories.map((s, i) => (
          <motion.button
            key={i}
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.25 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ scale: 1.04, borderColor: s.border, boxShadow: `0 0 22px ${s.dim}` }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onSearch(s.label)}
            className="flex flex-col items-start gap-3 p-4 rounded-2xl border border-[#1F2937] bg-[#111827] text-left transition-all duration-200"
          >
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center text-white text-base`}>
              {s.icon}
            </div>
            <div>
              <p className="text-white text-xs font-semibold">{s.label}</p>
              <p className="text-gray-600 text-[10px] mt-0.5">{s.count} documents</p>
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}


/* ─── AI Tips ─── */
function AiTips() {
  const [tipIdx, setTipIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTipIdx((i) => (i + 1) % aiTips.length), 3500);
    return () => clearInterval(t);
  }, []);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4 }}
      className="flex items-center gap-3 px-4 py-3 rounded-2xl border border-purple-500/15 bg-purple-500/[0.06]"
    >
      <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }}>
        <FiCpu className="text-purple-400 text-sm shrink-0" />
      </motion.div>
      <AnimatePresence mode="wait">
        <motion.p
          key={tipIdx}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.3 }}
          className="text-gray-400 text-xs"
        >
          <span className="text-purple-300 font-medium">AI Tip: </span>{aiTips[tipIdx]}
        </motion.p>
      </AnimatePresence>
    </motion.div>
  );
}
function StatCard({
 title,
 value
}){

 return(

  <div
   className="
   bg-[#111827]
   border border-[#1F2937]
   rounded-xl
   p-4
   "
  >

   <p
    className="
    text-gray-500
    text-xs
    "
   >
    {title}
   </p>

   <h3
    className="
    text-white
    text-xl
    font-bold
    mt-1
    "
   >
    {value}
   </h3>

  </div>

 );

}
function TrendingSearches({
 trending,
 onSearch
}){

 if(
  trending.length===0
 )
  return null;

 return(

  <div
   className="
   bg-[#111827]
   border border-[#1F2937]
   rounded-xl
   p-4
   "
  >

   <h3
    className="
    text-white
    text-sm
    font-semibold
    mb-3
    "
   >
    Trending Searches
   </h3>

   <div
    className="
    flex flex-wrap gap-2
    "
   >

    {trending.map(
     ([query,count]) => (

      <button
       key={query}
       onClick={() =>
        onSearch(query)
       }
       className="
       px-3 py-1
       rounded-full
       bg-blue-500/10
       text-blue-300
       text-xs
       "
      >
       {query}
       {" "}
       ({count})
      </button>

     )
    )}

   </div>

  </div>

 );

}

/* ─── Result Card ─── */
function ResultCard({
  result,
  index,
  query,
  onStarToggle,
  onView,
  onSummarize,
}){
  const [hovered, setHovered] = useState(false);
  const [starred, setStarred] = useState(result.starred);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative rounded-2xl border bg-[#111827] overflow-hidden cursor-pointer transition-all duration-300"
      style={{
        borderColor: hovered ? result.border : "rgba(31,41,55,1)",
        boxShadow: hovered ? `0 0 32px ${result.dim}, 0 4px 20px rgba(0,0,0,0.25)` : "0 2px 8px rgba(0,0,0,0.2)",
      }}
    >
      {/* Top line */}
      <motion.div animate={{ scaleX: hovered ? 1 : 0, opacity: hovered ? 1 : 0 }} transition={{ duration: 0.3 }}
        className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${result.gradient} origin-left`} />
      {/* Corner glow */}
      <motion.div animate={{ opacity: hovered ? 1 : 0 }} transition={{ duration: 0.3 }}
        className="absolute -top-8 -right-8 w-28 h-28 rounded-full blur-[50px] pointer-events-none" style={{ background: result.dim }} />

      <div className="relative z-10 p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <motion.div animate={{ scale: hovered ? 1.08 : 1 }} transition={{ duration: 0.2 }}
              className={`w-10 h-10 rounded-xl bg-gradient-to-br ${result.gradient} flex items-center justify-center text-white text-sm shrink-0`}>
              <FiFileText />
            </motion.div>
            <div className="min-w-0">
              <p className={`text-sm font-semibold truncate transition-colors ${hovered ? "text-white" : "text-gray-100"}`}>
                {result.title}
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                {
 result.hasSummary && (
  <span
   className="
   px-2 py-0.5
   rounded-full
   text-[9px]
   bg-purple-500/15
   text-purple-300
  "
  >
   AI Summary
  </span>
 )
}
                <span className="text-gray-600 text-[10px] uppercase font-bold">{result.type}</span>
                <span className="text-gray-700 text-[10px]">·</span>
                <span className="text-gray-600 text-[10px]">{result.file}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {/* Relevance */}
            <div className="hidden sm:flex flex-col items-end">
              <span className={`text-xs font-bold ${result.accentText}`}>{result.relevance}%</span>
              <span className="text-gray-700 text-[9px]">match</span>
            </div>
            <motion.button whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}
onClick={async (e) => {

  e.stopPropagation();

  try {

    await onStarToggle(
      result.id
    );

    setStarred(
      !starred
    );

  } catch (error) {

    console.log(error);

  }

}}              className="w-7 h-7 rounded-lg bg-white/5 border border-white/[0.07] flex items-center justify-center transition-all hover:bg-white/10">
              <FiStar className={`text-xs ${starred ? "text-amber-400" : "text-gray-600"}`} style={{ fill: starred ? "#f59e0b" : "none" }} />
            </motion.button>
          </div>
        </div>

        {/* Excerpt with highlight */}
        <p className="text-gray-400 text-xs leading-relaxed mb-3 line-clamp-2">
          <Highlight text={result.excerpt} query={query} />
        </p>

        {/* Tags + meta */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            {result.tags.map((tag, i) => (
              <span key={i} className={`px-2 py-0.5 rounded-full text-[9px] font-semibold border ${result.accentText}`}
                style={{ background: result.dim, borderColor: result.border }}>
                {tag}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-3 text-gray-600 text-[10px] shrink-0">
            <span>{result.pages}p</span>
            <span>·</span>
            <span>{result.time}</span>
          </div>
        </div>

        {/* Hover footer */}
        <motion.div animate={{ opacity: hovered ? 1 : 0, height: hovered ? "auto" : 0 }}
          transition={{ duration: 0.2 }}
          className="overflow-hidden">
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/[0.05]">
            <div className="flex items-center gap-2">
              <motion.button whileHover={{ scale: 1.05 }}
              onClick={() =>
  onView(result.id)
}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold border ${result.accentText} transition-all`}
                style={{ background: result.dim, borderColor: result.border }}>
                <FiEye className="text-[10px]" /> View
              </motion.button>
       <motion.button
 whileHover={{ scale: 1.05 }}
 onClick={() =>
   onSummarize(result.id)
 }
 className="
 flex items-center gap-1.5
 px-3 py-1.5
 rounded-lg
 text-[11px]
 font-semibold
 border border-white/[0.07]
 bg-white/5
 text-gray-300
 hover:bg-white/10
 transition-all
 "
>
 <FiZap className="text-[10px]" />
 Summarize
</motion.button>
            </div>
            <motion.span animate={{ x: hovered ? [0, 3, 0] : 0 }} transition={{ duration: 1, repeat: Infinity }}
              className={`flex items-center gap-1 text-[11px] font-medium ${result.accentText}`}>
              Open <FiChevronRight className="text-[10px]" />
            </motion.span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ─── Results Header ─── */
function ResultsHeader({
 query,
 count,
 activeFilter,
 setActiveFilter,
 sortBy,
 setSortBy
}){ return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
      <div>
        <h3 className="text-white font-semibold text-sm">
          {count} results for <span className="text-blue-300">"{query}"</span>
        </h3>
        <p className="text-gray-600 text-[11px] mt-0.5">Semantic AI search · sorted by relevance</p>
      </div>
      <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5" style={{ scrollbarWidth: "none" }}>
        {filters.map((f) => (
          <motion.button key={f} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
            onClick={() => setActiveFilter(f)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all duration-200 shrink-0 ${
              activeFilter === f
                ? "bg-blue-500/15 border border-blue-500/25 text-blue-300"
                : "text-gray-500 hover:text-gray-300 border border-transparent hover:border-white/[0.07] hover:bg-white/[0.04]"
            }`}>
            {f}
          </motion.button>
        ))}
        <select
 value={sortBy}
 onChange={(e)=>
  setSortBy(e.target.value)
 }
 className="
 bg-[#111827]
 border border-[#1F2937]
 text-gray-300
 text-xs
 rounded-lg
 px-2 py-1
 "
>
 <option>Newest</option>
 <option>Oldest</option>
 <option>A-Z</option>
</select>
        <button className="w-7 h-7 rounded-lg border border-[#1F2937] bg-white/[0.03] flex items-center justify-center text-gray-600 hover:text-gray-300 transition-colors shrink-0">
          <FiFilter className="text-xs" />
        </button>
      </div>
    </div>
  );
}

/* ─── Empty State ─── */
function EmptyState({ query }) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-20 text-center">
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 text-2xl mb-5"
      >
        <FiSearch />
      </motion.div>
      <h3 className="text-white font-semibold text-base mb-2">No results for "{query}"</h3>
      <p className="text-gray-500 text-sm mb-6 max-w-xs">Try different keywords, check spelling, or search using natural language.</p>
      <div className="flex items-center gap-3">
        <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
          className="px-4 py-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm font-medium">
          Try AI Search
        </motion.button>
        <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
          className="px-4 py-2.5 rounded-xl border border-[#1F2937] bg-white/[0.03] text-gray-300 text-sm font-medium">
          Clear Search
        </motion.button>
      </div>
    </motion.div>
  );
}

/* ─── Main Page ─── */
export default function SmartSearch() {
  const navigate =
  useNavigate();
  const [query, setQuery] = useState("");
  
  const [searchedQuery, setSearchedQuery] = useState("");
  const [results, setResults] =
  useState([]);
  const [
 suggestions,
 setSuggestions
] = useState([]);
  const [stats,
 setStats]
 =
 useState(null);
 const [categories,setCategories] =
useState([]);
  const [loading,
setLoading]
=
useState(false);
  const [selectedDoc,
 setSelectedDoc] =
 useState(null);
  const [focused, setFocused] = useState(false);
const [recents, setRecents] =
useState([]);
const [trending, setTrending] =
useState([]);
  const [activeFilter, setActiveFilter] = useState("All");
  const [sortBy, setSortBy] =
useState("Newest");
  const [hasSearched, setHasSearched] = useState(false);
useEffect(() => {

 const saved =
  localStorage.getItem(
   "recentSearches"
  );

 if (saved) {

  setRecents(
   JSON.parse(saved)
  );

 }

}, []);
useEffect(() => {

 const searches =
  JSON.parse(
   localStorage.getItem(
    "recentSearches"
   ) || "[]"
  );

 const countMap = {};

 searches.forEach(item => {

  countMap[item.query] =
   (countMap[item.query] || 0)
   + 1;

 });

 const topSearches =
  Object.entries(countMap)
   .sort(
    (a,b) => b[1] - a[1]
   )
   .slice(0,5);

 setTrending(
  topSearches
 );

}, [recents]);
useEffect(() => {

 const loadSuggestions =
 async () => {

  try {

   const data =
    await getSuggestions();

   setSuggestions(
    data.suggestions
   );

  } catch (error) {

   console.log(error);

  }

 };

 loadSuggestions();

}, []);
 const loadStats = async () => {

  try {

   const data =
    await getSearchStats();

   setStats(data);

  } catch (error) {

   console.log(error);

  }

 };
useEffect(() => {



 loadStats();

}, []);
useEffect(()=>{

 const loadCategories =
 async()=>{

  try{

   const data =
    await getCategories();

   setCategories(

 data.categories.map(
  cat => ({

   ...cat,

   icon:
 cat.label === "PDF"
  ? <FiFileText />
  : cat.label === "DOCX"
  ? <FiBookmark />
  : <FiFolder />,

   color:
    "from-blue-500 to-indigo-600",

   dim:
    "rgba(59,130,246,0.1)",

   border:
    "rgba(59,130,246,0.22)",

  })
 )

);

  }
  catch(error){

   console.log(error);

  }

 };

 loadCategories();

},[]);
 const handleSearch =
async (q) => {

  if (!q.trim()) return;

  try {
    setLoading(true);

    const data =
      await searchDocuments(q);

    console.log(
      "SEARCH RESULTS:",
      data
    );

    setResults(
      data.documents || []
    );

    setQuery(q);

    setSearchedQuery(q);

    setHasSearched(true);
    setRecents(prev => {

 const filtered =
  prev.filter(
   item =>
    item.query.toLowerCase() !==
    q.toLowerCase()
  );

 const updated = [
  {
 id: Date.now(),
 query: q,
 results:
  data.documents.length,

 searchedAt:
  new Date()
},
  ...filtered,
 ].slice(0, 5);

 localStorage.setItem(
  "recentSearches",
  JSON.stringify(updated)
 );

 return updated;

});

    setFocused(false);

  } catch (error) {

    console.error(error);

  }
  finally {

 setLoading(false);

}

};
const handleStarToggle =
async (id) => {

  try {

    await toggleStarDocument(
      id
    );

    setResults(
      prev =>
        prev.map(doc =>
          doc._id === id
            ? {
                ...doc,
                starred:
                  !doc.starred,
              }
            : doc
        )
    );

  } catch (error) {

    console.log(error);

  }

};
const handleView =
(id) => {

 const doc =
  formattedResults.find(
   d => d.id === id
  );

 if (doc) {
  setSelectedDoc(doc);
 }

};
const handleSummarize =
async (id) => {

  try {

    const token =
      localStorage.getItem(
        "token"
      );

  await summarizeDocument(
 id,
 token
);

await handleSearch(
 searchedQuery
);

toast.success(
 "Summary generated"
);
await loadStats();

  } catch (error) {

    console.log(error);

  }

};
const formattedResults =
results.map(doc => ({

  id: doc._id,

  title: doc.title,

  name: doc.title,

  file: doc.title,

  fileUrl: doc.fileUrl,
  hasSummary:
 !!doc.summary,

 type:
 doc.fileType?.includes("pdf")
 ? "PDF"
 : doc.fileType?.includes("word")
 ? "DOCX"
 : doc.fileType?.includes("image")
 ? "IMAGE"
 : "TXT",

  excerpt:
    doc.summary ||
    "No summary available",

  tags:
    doc.tags || [],

  starred:
    doc.starred || false,

  time:
    new Date(
      doc.createdAt
    ).toLocaleDateString(),
    createdAt:
 doc.createdAt,

 relevance:
 doc.relevance || 0,

  pages: 0,

  gradient:
    "from-blue-500 to-indigo-600",

  dim:
    "rgba(59,130,246,0.08)",

  border:
    "rgba(59,130,246,0.2)",

  accentText:
    "text-blue-300",

}));
const filteredResults =
 formattedResults.filter(
  (r) => {

   if (
    activeFilter === "All"
   )
    return true;

   if (
    activeFilter === "Starred"
   )
    return r.starred;

   if (
    activeFilter === "Recent"
   ) {

    const sevenDaysAgo =
     new Date();

    sevenDaysAgo.setDate(
     sevenDaysAgo.getDate() - 7
    );

    return (
     new Date(
      r.createdAt
     ) > sevenDaysAgo
    );

   }

   if (
    activeFilter ===
    "Summarized"
   ) {

    return r.hasSummary;

   }

   return (
    r.type ===
    activeFilter
   );

  }
 );
let sortedResults =
 [...filteredResults];
 if(sortBy==="Newest"){

 sortedResults.sort(
  (a,b)=>
   new Date(b.createdAt)
   -
   new Date(a.createdAt)
 );

}
if(sortBy==="Oldest"){

 sortedResults.sort(
  (a,b)=>
   new Date(a.createdAt)
   -
   new Date(b.createdAt)
 );

}
if(sortBy==="A-Z"){

 sortedResults.sort(
  (a,b)=>
   a.title.localeCompare(
    b.title
   )
 );
}

  return (
    <div className="min-h-screen bg-[#0B0F19]" style={{ fontFamily: "'Poppins', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');`}</style>

      {/* Ambient blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div animate={{ scale: [1, 1.15, 1], opacity: [0.07, 0.14, 0.07] }} transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-0 left-1/3 w-[600px] h-[400px] bg-blue-500 blur-[140px] rounded-full" />
        <motion.div animate={{ scale: [1, 1.12, 1], opacity: [0.05, 0.1, 0.05] }} transition={{ duration: 13, repeat: Infinity, delay: 3 }}
          className="absolute bottom-0 right-1/4 w-[500px] h-[400px] bg-indigo-600 blur-[140px] rounded-full" />
        <div className="absolute inset-0 opacity-[0.025]"
          style={{ backgroundImage: "linear-gradient(rgba(100,200,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(100,200,255,1) 1px,transparent 1px)", backgroundSize: "50px 50px" }} />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 py-12">

        {/* Page header */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.4)]">
              <FiCpu className="text-white text-base" />
            </motion.div>
            <div>
              <h1 className="text-white font-bold text-lg tracking-tight">Smart Search</h1>
              <div className="flex items-center gap-1.5">
                <motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.8, repeat: Infinity }}
                  className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <p className="text-gray-600 text-[11px]">AI-powered semantic search</p>
              </div>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/[0.06] bg-white/[0.03]">
            <FiFileText className="text-gray-600 text-xs" />
<span className="text-gray-500 text-xs">
 {stats?.totalDocs || 0}
 documents indexed
</span>          </div>
        </motion.div>

        {/* Search Bar */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.05 }} className="mb-6">
<SearchBar
 query={query}
 setQuery={setQuery}
 onSearch={handleSearch}
 focused={focused}
 setFocused={setFocused}
 loading={loading}
 suggestions={suggestions}
/>      </motion.div>

        {/* AI Tips */}
       <div className="mb-8">
  <AiTips />
</div>

{
 stats && (

  <div
   className="
   grid
   grid-cols-2
   md:grid-cols-5
   gap-3
   mb-8
   "
  >

   <StatCard
    title="Documents"
    value={stats.totalDocs}
   />

   <StatCard
    title="PDF"
    value={stats.pdfs}
   />

   <StatCard
    title="DOCX"
    value={stats.docx}
   />

   <StatCard
    title="TXT"
    value={stats.txt}
   />

   <StatCard
    title="Summaries"
    value={stats.summaries}
   />

  </div>

 )
}
        {/* Content */}
        <AnimatePresence mode="wait">
          {!hasSearched ? (
            <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
              {recents.length > 0 && (
<RecentSearches
 searches={recents}
 onSearch={handleSearch}
 onRemove={(id) => {

  const updated =
   recents.filter(
    s => s.id !== id
   );

  setRecents(updated);

  localStorage.setItem(
   "recentSearches",
   JSON.stringify(updated)
  );

 }}
 onClear={() => {

  setRecents([]);

  localStorage.removeItem(
   "recentSearches"
  );

 }}
/>
 

)}
<TrendingSearches
 trending={trending}
 onSearch={handleSearch}
/> 
           <SuggestionCards
 onSearch={
 async(type)=>{

  try{

   const data =
    await getDocumentsByType(type);

   setResults(
    data.documents
   );

   setHasSearched(
    true
   );

   setSearchedQuery(
    type
   );

  }
  catch(error){

   console.log(error);

  }

 }
}
 categories={categories}
/>
            </motion.div>
          ) : (
            <motion.div key="results" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
<ResultsHeader
 query={searchedQuery}
 count={sortedResults.length}
 activeFilter={activeFilter}
 setActiveFilter={setActiveFilter}
 sortBy={sortBy}
 setSortBy={setSortBy}
/>              {
              loading ? (
 <SearchSkeleton />
) : sortedResults.length > 0 ? (
                <div className="space-y-4">
                  {sortedResults.map((r, i) => (
<ResultCard
  key={r.id}
  result={r}
  index={i}
  query={searchedQuery}
  onStarToggle={handleStarToggle}
  onView={handleView}
  onSummarize={
    handleSummarize
  }
/>))}
                </div>
              ) : (
                <EmptyState query={searchedQuery} />
              )}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => { setHasSearched(false); setQuery(""); setSearchedQuery(""); }}
                className="mt-6 w-full py-2.5 rounded-xl border border-[#1F2937] bg-white/[0.02] text-gray-600 hover:text-gray-300 text-xs font-medium flex items-center justify-center gap-1.5 hover:bg-white/[0.04] transition-all"
              >
                <FiArrowRight className="rotate-180 text-[11px]" /> Back to Search Home
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
            </div>
{selectedDoc && (
  <DocumentPreviewModal
    document={selectedDoc}
    onClose={() =>
      setSelectedDoc(null)
    }
  />
)}

    </div>
  );
}
