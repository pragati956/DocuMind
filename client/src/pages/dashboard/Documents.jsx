import { useState, useEffect } from "react";
import {
  fetchDocuments,
  deleteDocument,
} from "../../services/documentService";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  HiOutlineSearch,
  HiOutlineUpload,
  HiOutlineDocumentText,
  HiOutlineDotsVertical,
  HiOutlineSparkles,
  HiOutlineFolder,
  HiOutlineClock,
  HiOutlineTrash,
  HiOutlineDownload,
  HiOutlineShare,
  HiOutlinePencil,
  HiOutlineChevronDown,
  HiOutlineFilter,
  HiOutlineViewGrid,
  HiOutlineViewList,
  HiOutlineX,
  HiOutlineCheck,
  HiOutlineChip,
  HiOutlineLightningBolt,
} from "react-icons/hi";
import { HiOutlineDocumentDuplicate, HiMiniSparkles } from "react-icons/hi2";
import { BsFilePdf, BsFileWord, BsFileText, BsStars } from "react-icons/bs";



const FILTERS = ["All", "PDF", "DOCX", "TXT", "AI Summarized"];

// ── helpers ───────────────────────────────────────────────────────────────────
const fileIcon = (type) => {
  if (type === "PDF") return <BsFilePdf className="text-[#ff6b6b]" />;
  if (type === "DOCX") return <BsFileWord className="text-[#4fc3f7]" />;
  return <BsFileText className="text-[#a5d6a7]" />;
};

const badgeStyle = {
  PDF: "bg-[#ff6b6b]/10 text-[#ff6b6b] border-[#ff6b6b]/20",
  DOCX: "bg-[#4fc3f7]/10 text-[#4fc3f7] border-[#4fc3f7]/20",
  TXT: "bg-[#a5d6a7]/10 text-[#a5d6a7] border-[#a5d6a7]/20",
};

const summaryBadge = {
  done: {
    label: "AI Summarized",
    cls: "bg-violet-500/10 text-violet-300 border-violet-500/20",
    icon: <BsStars className="text-xs" />,
  },
  processing: {
    label: "Processing…",
    cls: "bg-amber-500/10 text-amber-300 border-amber-500/20",
    icon: <HiOutlineLightningBolt className="text-xs animate-pulse" />,
  },
  none: {
    label: "Not Summarized",
    cls: "bg-white/5 text-white/30 border-white/10",
    icon: <HiOutlineChip className="text-xs" />,
  },
};


// ── ActionsMenu ────────────────────────────────────────────────────────────────
function ActionsMenu({
  onClose,
  onDelete,
  documentId,
}) {
  const actions = [
    { icon: <HiMiniSparkles />, label: "Summarize with AI", accent: true },
    { icon: <HiOutlineDownload />, label: "Download" },
    { icon: <HiOutlineShare />, label: "Share" },
    { icon: <HiOutlinePencil />, label: "Rename" },
    { icon: <HiOutlineTrash />, label: "Delete", danger: true },
  ];
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: -6 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.92, y: -6 }}
      transition={{ duration: 0.15 }}
      className="absolute top-8 right-0 z-50 w-52 rounded-xl border border-white/10 bg-[#141414]/95 shadow-2xl backdrop-blur-xl overflow-hidden"
    >
      {actions.map((a, i) => (
        <button
          key={i}
         onClick={() => {

  if (a.label === "Delete") {
    onDelete(documentId);
  }

  onClose();
}}
          className={`flex w-full items-center gap-2.5 px-4 py-2.5 text-sm transition-colors
            ${a.danger ? "text-red-400 hover:bg-red-500/10" : a.accent ? "text-violet-300 hover:bg-violet-500/10" : "text-white/70 hover:bg-white/5 hover:text-white"}`}
        >
          <span className="text-base">{a.icon}</span>
          {a.label}
        </button>
      ))}
    </motion.div>
  );
}

// ── DocCard ────────────────────────────────────────────────────────────────────
function DocCard({
  doc,
  view,
  onDelete,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const sb = summaryBadge[doc.summary];
  if (view === "list") {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -12 }}
        whileHover={{ backgroundColor: "rgba(255,255,255,0.035)" }}
        className="relative flex items-center gap-4 rounded-xl border border-white/[0.06] bg-white/[0.02] px-5 py-4 transition-colors"
      >
        <span className="text-3xl">{fileIcon(doc.type)}</span>
        <div className="flex-1 min-w-0">
          <p className="truncate text-sm font-medium text-white/90">{doc.name}</p>
          <p className="mt-0.5 text-xs text-white/35 flex items-center gap-2">
            <HiOutlineClock className="inline" /> {doc.date}
            {doc.pages && <> · {doc.pages} pages</>}
          </p>
        </div>
        <span className={`hidden sm:flex items-center gap-1 rounded-md border px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase ${badgeStyle[doc.type]}`}>
          {doc.type}
        </span>
        <span className={`hidden md:flex items-center gap-1 rounded-md border px-2 py-0.5 text-[10px] font-medium ${sb.cls}`}>
          {sb.icon} {sb.label}
        </span>
        <span className="text-xs text-white/30">{doc.size}</span>
        <div className="relative">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="rounded-lg p-1.5 text-white/30 hover:bg-white/8 hover:text-white/70 transition-colors"
          >
            <HiOutlineDotsVertical />
          </button>
         <AnimatePresence>
  {menuOpen && (
    <ActionsMenu
      onClose={() => setMenuOpen(false)}
      onDelete={onDelete}
      documentId={doc.id}
    />
  )}
</AnimatePresence>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 16 }}
      whileHover={{ y: -3, boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}
      className="group relative flex flex-col rounded-2xl border border-white/[0.07] bg-white/[0.03] backdrop-blur-sm overflow-hidden cursor-pointer"
      style={{ background: "linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)" }}
    >
      {/* shimmer on hover */}
      <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 60%)" }} />

      {/* header strip */}
      <div className="flex items-start justify-between p-5 pb-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.05] text-2xl">
          {fileIcon(doc.type)}
        </div>
        <div className="relative flex items-center gap-2">
          <span className={`flex items-center gap-1 rounded-md border px-2 py-0.5 text-[10px] font-bold tracking-widest uppercase ${badgeStyle[doc.type]}`}>
            {doc.type}
          </span>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="rounded-lg p-1.5 text-white/25 hover:bg-white/8 hover:text-white/70 transition-colors"
          >
            <HiOutlineDotsVertical />
          </button>
          <AnimatePresence>
  {menuOpen && (
    <ActionsMenu
      onClose={() => setMenuOpen(false)}
      onDelete={onDelete}
      documentId={doc.id}
    />
  )}
</AnimatePresence>
        </div>
      </div>

      {/* body */}
      <div className="flex-1 px-5 pb-4">
        <h3 className="text-sm font-semibold text-white/90 leading-snug line-clamp-2">{doc.name}</h3>
        <div className="mt-1 flex flex-wrap gap-1.5">
          {doc.tags.map((t) => (
            <span key={t} className="rounded-full border border-white/[0.08] bg-white/[0.04] px-2 py-0.5 text-[10px] text-white/40">
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* footer */}
      <div className="border-t border-white/[0.06] px-5 py-3 flex items-center justify-between">
        <span className={`flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-[10px] font-medium ${sb.cls}`}>
          {sb.icon} {sb.label}
        </span>
        <div className="text-right">
          <p className="text-[10px] text-white/30">{doc.size}</p>
          <p className="text-[10px] text-white/25 flex items-center gap-0.5 justify-end">
            <HiOutlineClock className="text-[9px]" /> {doc.date}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// ── EmptyState ─────────────────────────────────────────────────────────────────
function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="col-span-full flex flex-col items-center justify-center py-28 text-center"
    >
      <div className="relative mb-6">
        <div className="h-20 w-20 rounded-2xl border border-white/10 bg-white/[0.03] flex items-center justify-center text-4xl text-white/20">
          <HiOutlineFolder />
        </div>
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          className="absolute -top-2 -right-2 rounded-lg bg-violet-600/20 border border-violet-500/30 p-1.5 text-violet-400 text-sm"
        >
          <BsStars />
        </motion.div>
      </div>
      <h3 className="text-base font-semibold text-white/60">No documents found</h3>
      <p className="mt-1.5 text-sm text-white/25 max-w-xs">
        Try adjusting your filters or upload a new document to get started.
      </p>
      <button className="mt-6 flex items-center gap-2 rounded-xl bg-white/[0.06] border border-white/10 px-5 py-2.5 text-sm text-white/70 hover:bg-white/10 transition-colors">
        <HiOutlineUpload /> Upload a document
      </button>
    </motion.div>
  );
}

// ── UploadModal ────────────────────────────────────────────────────────────────
function UploadModal({ onClose }) {
  const [dragging, setDragging] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl border border-white/10 bg-[#111]/90 backdrop-blur-xl p-6 shadow-2xl"
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-white">Upload Document</h2>
          <button onClick={onClose} className="text-white/40 hover:text-white/70 transition-colors">
            <HiOutlineX />
          </button>
        </div>

        <motion.div
          animate={dragging ? { scale: 1.02, borderColor: "rgba(139,92,246,0.6)" } : {}}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={() => setDragging(false)}
          className="relative flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-white/15 bg-white/[0.02] py-14 transition-colors hover:border-white/25 hover:bg-white/[0.04] cursor-pointer"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] text-white/30 text-2xl">
            <HiOutlineUpload />
          </div>
          <p className="text-sm text-white/60">Drag & drop or <span className="text-violet-400">browse files</span></p>
          <p className="text-xs text-white/25">PDF, DOCX, TXT up to 50 MB</p>
        </motion.div>

        <div className="mt-4 flex items-center gap-3">
          <div className="flex-1 rounded-lg bg-white/[0.04] border border-white/[0.08] px-3 py-2 text-xs text-white/30">
            No file selected
          </div>
          <button className="flex items-center gap-2 rounded-lg bg-violet-600 hover:bg-violet-500 px-4 py-2 text-xs font-semibold text-white transition-colors">
            <HiOutlineUpload /> Upload
          </button>
        </div>

        <div className="mt-4 rounded-xl border border-violet-500/20 bg-violet-500/5 p-3 flex items-start gap-2.5">
          <BsStars className="text-violet-400 mt-0.5 shrink-0" />
          <p className="text-xs text-violet-300/80 leading-relaxed">
            DocuMind AI will automatically summarize your document after upload.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function DocumentsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [view, setView] = useState("grid");
  // const [uploadOpen, setUploadOpen] = useState(false);
  // Real documents from backend
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const handleDelete = async (id) => {
  try {

    await deleteDocument(id);

    await loadDocuments();

  } catch (error) {

    console.error("Delete failed:", error);

  }
};
  const loadDocuments = async () => {
    try {
      setLoading(true);
      const data = await fetchDocuments(page);
      console.log("API RESPONSE:", data);
      setDocuments(data.documents || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error("Error fetching documents:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadDocuments();
  }, [page]);
  const docs = documents.map((doc) => ({
    id: doc._id,
    name: doc.title,

    type: doc.fileType?.includes("pdf")
      ? "PDF"
      : doc.fileType?.includes("word")
        ? "DOCX"
        : "TXT",

    size: `${(doc.fileSize / 1024 / 1024).toFixed(2)} MB`,

    date: new Date(doc.createdAt).toLocaleDateString(),

    summary: doc.summary ? "done" : "none",

    tags: doc.tags || [],

    pages: null,

    fileUrl: doc.fileUrl,
  }));

  const filtered = docs.filter((d) => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === "All" ? true
        : filter === "AI Summarized" ? d.summary === "done"
          : d.type === filter;
    return matchSearch && matchFilter;
  });

  const stats = [
    { label: "Total Files", value: docs.length, icon: <HiOutlineDocumentText /> },
    { label: "AI Summarized", value: docs.filter((d) => d.summary === "done").length, icon: <BsStars />, accent: true },
    { label: "Processing", value: docs.filter((d) => d.summary === "processing").length, icon: <HiOutlineLightningBolt /> },
  ];
  if (loading) {
  return (
    <div className="flex items-center justify-center min-h-screen text-white">
      Loading documents...
    </div>
  );
}

  return (
    <div
      className="min-h-screen text-white overflow-x-hidden"
      style={{
        background: "#0a0a0a",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* Google Font import */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; } 
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 99px; }
      `}</style>

      {/* Background mesh */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div style={{ position: "absolute", top: "-20%", left: "60%", width: 600, height: 600, background: "radial-gradient(circle, rgba(109,40,217,0.08) 0%, transparent 70%)", borderRadius: "50%" }} />
        <div style={{ position: "absolute", bottom: "10%", left: "-10%", width: 500, height: 500, background: "radial-gradient(circle, rgba(59,130,246,0.05) 0%, transparent 70%)", borderRadius: "50%" }} />
        {/* Subtle grid */}
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style={{ opacity: 0.025 }}>
          <defs><pattern id="g" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" /></pattern></defs>
          <rect width="100%" height="100%" fill="url(#g)" />
        </svg>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-8">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8"
        >
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <div className="h-6 w-6 rounded-lg bg-violet-600 flex items-center justify-center text-xs">
                <HiOutlineDocumentDuplicate />
              </div>
              <span className="text-xs font-medium text-white/40 tracking-widest uppercase">DocuMind</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Documents</h1>
            <p className="mt-0.5 text-sm text-white/35">Manage, search, and summarize your files with AI.</p>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
           onClick={() => navigate("/dashboard/upload")}
            className="flex items-center gap-2 self-start sm:self-auto rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition-all"
            style={{ background: "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)", boxShadow: "0 4px 24px rgba(109,40,217,0.4)" }}
          >
            <HiOutlineUpload className="text-base" /> Upload Document
          </motion.button>
        </motion.div>

        {/* ── Stats row ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="grid grid-cols-3 gap-3 mb-6"
        >
          {stats.map((s, i) => (
            <div key={i} className="rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 py-3.5 flex items-center gap-3 backdrop-blur-sm">
              <div className={`text-lg ${s.accent ? "text-violet-400" : "text-white/30"}`}>{s.icon}</div>
              <div>
                <p className="text-xl font-bold text-white leading-none">{s.value}</p>
                <p className="text-[11px] text-white/35 mt-0.5">{s.label}</p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* ── Search + Filters ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          className="flex flex-col sm:flex-row gap-3 mb-6"
        >
          {/* Search */}
          <div className="relative flex-1">
            <HiOutlineSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 text-base" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search documents…"
              className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] py-2.5 pl-10 pr-4 text-sm text-white placeholder-white/25 outline-none focus:border-violet-500/40 focus:bg-white/[0.05] transition-all"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                <HiOutlineX className="text-sm" />
              </button>
            )}
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-0.5 hide-scroll">
            {FILTERS.map((f) => (
              <motion.button
                key={f}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilter(f)}
                className={`whitespace-nowrap rounded-lg px-3.5 py-2 text-xs font-medium transition-all border
                  ${filter === f
                    ? "bg-violet-600/20 border-violet-500/40 text-violet-300"
                    : "bg-white/[0.03] border-white/[0.07] text-white/40 hover:text-white/70 hover:bg-white/[0.06]"
                  }`}
              >
                {f}
              </motion.button>
            ))}
          </div>

          {/* View toggle */}
          <div className="flex items-center gap-1 rounded-lg border border-white/[0.07] bg-white/[0.03] p-1">
            {[["grid", <HiOutlineViewGrid />], ["list", <HiOutlineViewList />]].map(([v, icon]) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`rounded-md p-1.5 text-sm transition-all
                  ${view === v ? "bg-white/10 text-white" : "text-white/30 hover:text-white/60"}`}
              >
                {icon}
              </button>
            ))}
          </div>
        </motion.div>

        {/* ── Document Grid / List ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={view + filter}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={view === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
              : "flex flex-col gap-2"}
          >
            <AnimatePresence>
              {filtered.length === 0
                ? <EmptyState />
                : filtered.map((doc, i) => (
                  <motion.div key={doc.id} style={{ transitionDelay: `${i * 30}ms` }}>
                   <DocCard
  doc={doc}
  view={view}
  onDelete={handleDelete}
/>
                  </motion.div>
                ))}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>
        <div className="flex items-center justify-center gap-4 mt-10">

          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-4 py-2 rounded-lg bg-white/10 text-white disabled:opacity-40"
          >
            Previous
          </button>

          <span className="text-white">
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="px-4 py-2 rounded-lg bg-white/10 text-white disabled:opacity-40"
          >
            Next
          </button>

        </div>

        {/* ── Footer hint ── */}
        {filtered.length > 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 text-center text-xs text-white/20"
          >
            {filtered.length} of {docs.length} documents · Powered by <span className="text-violet-400/60">DocuMind AI</span>
          </motion.p>
        )}
      </div>

      {/* ── Upload Modal ── */}
      {/* <AnimatePresence>{uploadOpen && <UploadModal onClose={() => setUploadOpen(false)} />}</AnimatePresence> */}
    </div>
  );
}