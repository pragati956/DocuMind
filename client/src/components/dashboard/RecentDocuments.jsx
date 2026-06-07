
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  summarizeDocument,
} from "../../services/aiService";
import axios from "axios"; // Added axios to fetch real DB data
import { motion, AnimatePresence } from "framer-motion";
import {
  FiFileText, FiUpload, FiMoreHorizontal, FiDownload,
  FiShare2, FiTrash2, FiEye, FiSearch, FiFilter,
  FiGrid, FiList, FiPlus, FiZap, FiCheck, FiX,
  FiClock, FiFolder, FiStar, FiChevronRight,
} from "react-icons/fi";

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
function ContextMenu({
  doc,
  onClose,
  accentText,
  accentDim,
  accentBorder,
  onDelete,
  onSummarize,
}) {
  const items = [
    { icon: <FiEye />, label: "View document" },
    { icon: <FiZap />, label: "Summarize now" },
    { icon: <FiShare2 />, label: "Share" },
    { icon: <FiDownload />, label: "Download" },
    { icon: <FiTrash2 />, label: "Delete", danger: true },
  ];

  const handleAction = async (item) => {

    try {
      if(
 item.label ===
 "View document"
){
 window.open(
  doc.fileUrl,
  "_blank"
 );
}
if(
 item.label ===
 "Download"
){

 const link =
  document.createElement("a");

 link.href =
  doc.fileUrl;

 link.download =
  doc.name;

 link.click();
}
if(
 item.label ===
 "Share"
){

 await navigator
  .clipboard
  .writeText(
    doc.fileUrl
  );

 toast.success(
  "Link copied"
 );
}

      if (item.label === "Summarize now") {

        await onSummarize(doc.id);

      }

      if (item.danger) {

        await onDelete(doc.id);

      }

    } catch (err) {

      console.error(err);

    }

    onClose();
  };

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
          onClick={() => handleAction(item)}
          className={`w-full flex items-center gap-3 px-4 py-2.5 text-xs transition-colors duration-150 ${item.danger ? "text-red-400" : "text-gray-300"
            } ${i !== 0 ? "border-t border-white/[0.04]" : ""}`}
        >
          <span className={item.danger ? "text-red-400" : "text-gray-500"}>{item.icon}</span>
          {item.label}
        </motion.button>
      ))}
    </motion.div>
  );
}

/* ─── Document Row (List View) ─── */
function DocRow({
  doc,
  index,
  onSummarize,
  onDelete,
  onToggleStar
}) {
  const [hovered, setHovered] = useState(false);

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
      <motion.div
        animate={{ opacity: hovered ? 1 : 0, scaleY: hovered ? 1 : 0.3 }}
        transition={{ duration: 0.2 }}
        className="absolute left-0 top-2 bottom-2 w-0.5 rounded-full"
        style={{ background: doc.accent }}
      />

      <motion.div animate={{ scale: hovered ? 1.06 : 1 }} transition={{ duration: 0.2 }}>
        <FileIcon ext={doc.ext} gradient={doc.gradient} />
      </motion.div>

      <div className="flex-1 min-w-0 text-left">
        <div className="flex items-center gap-2">
          <p className={`text-sm font-medium truncate transition-colors duration-200 ${hovered ? "text-white" : "text-gray-200"}`}>
            {doc.name}
          </p>
          {doc.starred && <FiStar className="text-amber-400 text-xs shrink-0" style={{ fill: "#f59e0b" }} />}
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-gray-600 text-[11px] uppercase font-semibold">{doc.ext}</span>
          <span className="text-gray-700 text-[10px]">·</span>
          <span className="text-gray-600 text-[11px]">{doc.size}</span>
          <span className="text-gray-700 text-[10px]">·</span>
          <span className="text-gray-600 text-[11px]">{doc.owner}</span>
        </div>
      </div>

      <span className={`hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${doc.accentText} shrink-0`}
        style={{ background: doc.accentDim, borderColor: doc.accentBorder }}>
        {doc.tag}
      </span>

      <div className="hidden md:flex items-center gap-1 text-gray-600 text-[11px] shrink-0">
        <FiClock className="text-[10px]" /> {doc.time}
      </div>

      <StatusBadge status={doc.status} bg={doc.statusBg} />

      <div className={`flex items-center gap-1.5 transition-opacity duration-200 ${hovered ? "opacity-100" : "opacity-0"}`}>
        <motion.button whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.9 }}
          onClick={(e) => { e.stopPropagation(); onToggleStar(doc.id); }}
          className="w-7 h-7 rounded-lg bg-white/5 border border-white/[0.07] flex items-center justify-center hover:bg-white/10 transition-all">
          <FiStar className={`text-xs ${doc.starred ? "text-amber-400" : "text-gray-600"}`} style={{ fill: doc.starred ? "#f59e0b" : "none" }} />
        </motion.button>
      <motion.button
 whileHover={{ scale: 1.12 }}
 whileTap={{ scale: 0.9 }}
 onClick={(e)=>{
   e.stopPropagation();
   window.open(
     doc.fileUrl,
     "_blank"
   );
 }}
 className="..."
>
 <FiEye className="text-xs" />
</motion.button>
        <div className="relative">
          <motion.button whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.9 }}
            onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen); }}
            className="w-7 h-7 rounded-lg bg-white/5 border border-white/[0.07] flex items-center justify-center text-gray-600 hover:text-gray-200 hover:bg-white/10 transition-all">
            <FiMoreHorizontal className="text-xs" />
          </motion.button>
          <AnimatePresence>
            {menuOpen && <ContextMenu doc={doc} onDelete={onDelete} onToggleStar={onToggleStar} onSummarize={onSummarize} onClose={() => setMenuOpen(false)} accentText={doc.accentText} accentDim={doc.accentDim} accentBorder={doc.accentBorder} />}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Document Card (Grid View) ─── */
function DocCard({ doc, index, onSummarize, onDelete, onToggleStar }) {
  const [hovered, setHovered] = useState(false);

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
      <motion.div animate={{ opacity: hovered ? 1 : 0, scaleX: hovered ? 1 : 0 }} transition={{ duration: 0.3 }}
        className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${doc.gradient} origin-left`} />

      <motion.div animate={{ opacity: hovered ? 1 : 0 }} transition={{ duration: 0.3 }}
        className="absolute -top-8 -right-8 w-28 h-28 rounded-full blur-[45px] pointer-events-none"
        style={{ background: doc.accentDim }} />

      <div className={`relative h-24 bg-gradient-to-br ${doc.gradient} opacity-10`} />
      <div className="absolute top-4 left-4">
        <motion.div animate={{ scale: hovered ? 1.08 : 1 }} transition={{ duration: 0.25 }}>
          <FileIcon ext={doc.ext} gradient={doc.gradient} size="md" />
        </motion.div>
      </div>

      <div className="absolute top-3 right-3 flex items-center gap-1.5">
        <motion.button whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}
          onClick={(e) => { e.stopPropagation(); onToggleStar(doc.id); }}
          className="w-6 h-6 rounded-lg bg-black/30 backdrop-blur-sm flex items-center justify-center">
          <FiStar className={`text-xs ${doc.starred ? "text-amber-400" : "text-white/50"}`} style={{ fill: doc.starred ? "#f59e0b" : "none" }} />
        </motion.button>
        <div className="relative">
          <motion.button whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}
            onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen); }}
            className="w-6 h-6 rounded-lg bg-black/30 backdrop-blur-sm flex items-center justify-center text-white/60 hover:text-white transition-colors">
            <FiMoreHorizontal className="text-xs" />
          </motion.button>
          <AnimatePresence>
            {menuOpen && <ContextMenu doc={doc} onDelete={onDelete} onToggleStar={onToggleStar} onSummarize={onSummarize} onClose={() => setMenuOpen(false)} accentText={doc.accentText} accentDim={doc.accentDim} accentBorder={doc.accentBorder} />}
          </AnimatePresence>
        </div>
      </div>

      <div className="p-4 pt-3 text-left">
        <p className={`text-sm font-semibold truncate mb-1 transition-colors ${hovered ? "text-white" : "text-gray-200"}`}>
          {doc.name}
        </p>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-gray-600 text-[11px] uppercase font-semibold">{doc.ext}</span>
          <span className="text-gray-700 text-[10px]">·</span>
          <span className="text-gray-600 text-[11px]">{doc.size}</span>
        </div>
        <div className="flex items-center justify-between">
          <StatusBadge status={doc.status} bg={doc.statusBg} />
          <div className="flex items-center gap-1 text-gray-600 text-[10px]">
            <FiClock className="text-[9px]" /> {doc.time}
          </div>
        </div>

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
export default function RecentDocuments({ onUpload }) {
  const [view, setView] = useState("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");

  // REAL DATABASE STATE
  const [docs, setDocs] = useState([]);
  const filters = [
    "All",
    ...new Set(
      docs.map(
        doc => doc.ext.toUpperCase()
      )
    ),
    "Starred"
  ];
  const fetchDocuments = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/documents/all", {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        // Transform backend schema to frontend card format
        const formattedDocs = res.data.documents.map(d => {
          const ext = d.title.split('.').pop().toLowerCase();
          let accent="#3b82f6";

if(ext==="pdf")
 accent="#ef4444";

if(ext==="docx")
 accent="#3b82f6";

if(ext==="pptx")
 accent="#f59e0b";

if(ext==="xlsx")
 accent="#10b981";
        let accentData;

if(ext==="pdf"){
 accentData={
  grad:"from-red-500 to-rose-600",
  text:"text-red-300"
 };
}
else if(ext==="docx"){
 accentData={
  grad:"from-blue-500 to-indigo-600",
  text:"text-blue-300"
 };
}
else if(ext==="pptx"){
 accentData={
  grad:"from-orange-500 to-amber-600",
  text:"text-orange-300"
 };
}
else if(ext==="xlsx"){
 accentData={
  grad:"from-emerald-500 to-green-600",
  text:"text-emerald-300"
 };
}
else{
 accentData={
  grad:"from-purple-500 to-pink-600",
  text:"text-purple-300"
 };
}
          return {
            id: d._id,
            name: d.title,
            fileUrl:d.fileUrl,
            createdAt: d.createdAt,
            ext: ext,
            size: (d.fileSize / 1024 / 1024).toFixed(2) + " MB",
            time: new Date(d.createdAt).toLocaleDateString(),
            status: d.summary ? "Summarized" : "Queued",
            starred: d.starred,
            owner:
 d.uploadedBy?.name
 || "Unknown",
            gradient: accentData.grad,
            accent,
            accentDim: "rgba(59,130,246,0.1)",
            accentBorder: "rgba(59,130,246,0.22)",
            accentText: accentData.text,
            statusBg: d.summary ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-300" : "bg-amber-500/10 border-amber-500/25 text-amber-300",
           tag:
 d.tags?.[0]
 || "Document",
          }
        });
        setDocs(formattedDocs);
      }
    } catch (err) {
      console.error("Fetch docs error:", err);
    }
  };

  // DYNAMIC FETCH FROM MONGODB
  useEffect(() => {


    fetchDocuments();

    // Auto-refresh interval so new uploads appear without refreshing the whole page
    const interval = setInterval(fetchDocuments, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleDelete = async (docId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/documents/${docId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDocs(docs.filter(d => d.id !== docId));
    } catch (err) {
      console.error("Failed to delete", err);
    }
  };
  const handleToggleStar =
    async (docId) => {

      try {

        const token =
          localStorage.getItem("token");

        await axios.patch(
          `http://localhost:5000/api/documents/${docId}/star`,
          {},
          {
            headers: {
              Authorization:
                `Bearer ${token}`
            }
          }
        );

        fetchDocuments();

      } catch (error) {

        console.error(error);

      }

    };
  const handleSummarize = async (docId) => {

    try {

      const token =
        localStorage.getItem("token");

      const response =
        await summarizeDocument(
          docId,
          token
        );

      console.log(
        "Summary generated:",
        response
      );
      toast.success(
        "AI Summary Generated Successfully"
      );
      await fetchDocuments();

    } catch (error) {

      console.error(error);

      toast.error(
        "Failed to generate summary"
      );

    }

  };

  const filtered = docs.filter((d) => {
    const matchFilter = activeFilter === "All" ? true
      : activeFilter === "Starred" ? d.starred
        : d.ext.toLowerCase() === activeFilter.toLowerCase();
    const matchSearch = !searchQuery || d.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchFilter && matchSearch;
  });

  // show only 2 latest documents by creation date
  const latest = filtered
    .slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 2);

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');`}</style>
      <div style={{ fontFamily: "'Poppins', sans-serif" }}>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 text-sm">
              <FiFolder />
            </div>
            <div className="text-left">
              <h2 className="text-white font-semibold text-sm">Recent Documents</h2>
              <p className="text-gray-600 text-[10px]">{docs.length} documents · {docs.filter(d => d.status === "Summarized").length} summarized</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
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

            <div className="flex items-center gap-0.5 p-1 rounded-xl border border-[#1F2937] bg-white/[0.02]">
              {[{ icon: <FiList />, val: "list" }, { icon: <FiGrid />, val: "grid" }].map(({ icon, val }) => (
                <motion.button key={val} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setView(val)}
                  className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs transition-all duration-200 ${view === val ? "bg-blue-500/15 border border-blue-500/20 text-blue-400" : "text-gray-600 hover:text-gray-300"}`}>
                  {icon}
                </motion.button>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.04, boxShadow: "0 0 20px rgba(59,130,246,0.35)" }}
              whileTap={{ scale: 0.97 }}
              onClick={onUpload}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xs font-semibold relative overflow-hidden"
            >
              <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12"
                animate={{ x: ["-100%", "200%"] }} transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }} />
              <FiPlus className="relative z-10 text-xs" />
              <span className="relative z-10 hidden sm:inline">Upload</span>
            </motion.button>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
          className="flex items-center gap-2 mb-4 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
          {filters.map((f) => (
            <motion.button key={f} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} onClick={() => setActiveFilter(f)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all duration-200 shrink-0 ${activeFilter === f
                  ? "bg-blue-500/15 border border-blue-500/25 text-blue-300"
                  : "text-gray-500 hover:text-gray-300 border border-transparent hover:border-white/[0.07] hover:bg-white/[0.04]"
                }`}>
              {f}
            </motion.button>
          ))}
        </motion.div>

        <div className="rounded-2xl border border-[#1F2937] bg-[#111827] overflow-hidden">
          {view === "list" && (
            <>
              <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_120px_90px] gap-4 px-5 py-2.5 border-b border-[#1F2937] text-gray-700 text-[10px] font-semibold uppercase tracking-widest text-left">
                <span>Document</span>
                <span>Type</span>
                <span>Owner</span>
                <span>Modified</span>
                <span>Status</span>
                <span className="text-right">Actions</span>
              </div>

              <AnimatePresence>
                {filtered.length > 0
                  ? latest.map((doc, i) => (
                    <React.Fragment key={doc.id}>
                      <DocRow doc={doc} index={i} onDelete={handleDelete} onSummarize={handleSummarize} onToggleStar={handleToggleStar} />
                      {i < latest.length - 1 && <div className="mx-5 h-px bg-[#1F2937]" />}
                    </React.Fragment>
                  ))
                  : <EmptyState onUpload={onUpload} />
                }
              </AnimatePresence>
            </>
          )}

          {view === "grid" && (
            <div className="p-4">
              <AnimatePresence>
                {filtered.length > 0
                  ? <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filtered.map((doc, i) => <DocCard key={doc.id} doc={doc} index={i} onDelete={handleDelete} onSummarize={handleSummarize} onToggleStar={handleToggleStar} />)}
                  </div>
                  : <EmptyState onUpload={onUpload} />
                }
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

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