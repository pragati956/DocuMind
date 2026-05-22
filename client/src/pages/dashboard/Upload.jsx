import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import {
  HiOutlineCloudUpload,
  HiOutlineDocumentText,
  HiOutlinePhotograph,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineX,
  HiOutlineLightningBolt,
  HiOutlineChip,
  HiOutlineSparkles,
  HiOutlineClock,
  HiOutlineTrash,
  HiOutlineEye,
} from "react-icons/hi";
import { BsFilePdf, BsFileWord, BsFileText, BsFileImage, BsStars, BsCloudArrowUp } from "react-icons/bs";
import { HiOutlineDocumentDuplicate } from "react-icons/hi2";

// ─── constants ────────────────────────────────────────────────────────────────
const FORMAT_META = {
  PDF:  { icon: <BsFilePdf />,    color: "#ff6b6b", bg: "rgba(255,107,107,0.08)", border: "rgba(255,107,107,0.18)", label: "PDF",  desc: "Reports, papers, contracts" },
  DOCX: { icon: <BsFileWord />,   color: "#4fc3f7", bg: "rgba(79,195,247,0.08)",  border: "rgba(79,195,247,0.18)",  label: "DOCX", desc: "Word documents, drafts" },
  TXT:  { icon: <BsFileText />,   color: "#81c784", bg: "rgba(129,199,132,0.08)", border: "rgba(129,199,132,0.18)", label: "TXT",  desc: "Plain text, logs, notes" },
  PNG:  { icon: <BsFileImage />,  color: "#ffb74d", bg: "rgba(255,183,77,0.08)",  border: "rgba(255,183,77,0.18)",  label: "PNG",  desc: "Images, screenshots, scans" },
};

const SIZE_LIMITS = { PDF: "50 MB", DOCX: "25 MB", TXT: "10 MB", PNG: "20 MB" };

const SEED_UPLOADS = [
  { id: 1, name: "Q4_Financial_Report.pdf",   type: "PDF",  size: "4.2 MB", date: "2 min ago",   status: "done",       progress: 100, pages: 48 },
  { id: 2, name: "Product_Roadmap_v3.docx",   type: "DOCX", size: "1.8 MB", date: "8 min ago",   status: "done",       progress: 100, pages: 22 },
  { id: 3, name: "User_Research_Data.pdf",    type: "PDF",  size: "6.7 MB", date: "15 min ago",  status: "summarizing",progress: 100, pages: 64 },
  { id: 4, name: "Infrastructure_Notes.txt",  type: "TXT",  size: "0.3 MB", date: "1 hr ago",    status: "done",       progress: 100, pages: null },
];

let idCounter = 100;
function genId() { return ++idCounter; }

function extOf(name) {
  const e = name.split(".").pop().toUpperCase();
  return FORMAT_META[e] ? e : "TXT";
}
function fmtBytes(b) {
  if (b < 1024) return b + " B";
  if (b < 1024 * 1024) return (b / 1024).toFixed(1) + " KB";
  return (b / 1024 / 1024).toFixed(1) + " MB";
}

// ─── animated background orbs ────────────────────────────────────────────────
function Orb({ style }) {
  return (
    <motion.div
      animate={{ scale: [1, 1.12, 1], opacity: [0.6, 1, 0.6] }}
      transition={{ duration: 8 + Math.random() * 4, repeat: Infinity, ease: "easeInOut" }}
      className="absolute rounded-full pointer-events-none"
      style={style}
    />
  );
}

// ─── progress bar ─────────────────────────────────────────────────────────────
function ProgressBar({ value, color }) {
  return (
    <div className="h-1 w-full rounded-full bg-white/[0.06] overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="h-full rounded-full"
        style={{ background: `linear-gradient(90deg, ${color}88, ${color})`, boxShadow: `0 0 6px ${color}66` }}
      />
    </div>
  );
}

// ─── upload card ─────────────────────────────────────────────────────────────
function UploadCard({ file, onRemove }) {
  const meta = FORMAT_META[file.type] || FORMAT_META.TXT;
  const isDone   = file.status === "done";
  const isError  = file.status === "error";
  const isSumm   = file.status === "summarizing";
  const isActive = file.status === "uploading";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 14, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 30, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300, damping: 28 }}
      className="group relative rounded-xl border border-white/[0.07] bg-white/[0.025] backdrop-blur-sm px-4 py-3.5 overflow-hidden"
    >
      {/* glow stripe on active */}
      {isActive && (
        <motion.div
          animate={{ x: ["-100%", "200%"] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
          className="absolute inset-y-0 left-0 w-1/3 pointer-events-none"
          style={{ background: `linear-gradient(90deg, transparent, ${meta.color}18, transparent)` }}
        />
      )}

      <div className="flex items-center gap-3">
        {/* icon */}
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border text-xl"
          style={{ background: meta.bg, borderColor: meta.border, color: meta.color }}>
          {meta.icon}
        </div>

        {/* info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className="truncate text-sm font-medium text-white/85">{file.name}</p>
            <div className="flex items-center gap-1.5 shrink-0">
              {isDone && !isSumm && (
                <span className="flex items-center gap-1 rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400">
                  <HiOutlineCheckCircle className="text-xs" /> Done
                </span>
              )}
              {isSumm && (
                <span className="flex items-center gap-1 rounded-md border border-violet-500/20 bg-violet-500/10 px-2 py-0.5 text-[10px] font-medium text-violet-300">
                  <BsStars className="text-xs animate-pulse" /> Summarizing
                </span>
              )}
              {isError && (
                <span className="flex items-center gap-1 rounded-md border border-red-500/20 bg-red-500/10 px-2 py-0.5 text-[10px] font-medium text-red-400">
                  <HiOutlineXCircle className="text-xs" /> Failed
                </span>
              )}
              {isActive && (
                <span className="text-[10px] font-mono text-white/40">{file.progress}%</span>
              )}
            </div>
          </div>

          <div className="mt-0.5 flex items-center gap-2 text-[11px] text-white/30">
            <span>{file.size}</span>
            {file.pages && <><span>·</span><span>{file.pages} pages</span></>}
            <span>·</span>
            <HiOutlineClock className="text-[10px]" />
            <span>{file.date}</span>
          </div>

          {(isActive || (isDone && file.progress < 100)) && (
            <div className="mt-2">
              <ProgressBar value={file.progress} color={meta.color} />
            </div>
          )}
        </div>

        {/* actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="rounded-lg p-1.5 text-white/25 hover:bg-white/8 hover:text-white/60 transition-colors">
            <HiOutlineEye className="text-sm" />
          </button>
          <button onClick={() => onRemove(file.id)} className="rounded-lg p-1.5 text-white/25 hover:bg-red-500/10 hover:text-red-400 transition-colors">
            <HiOutlineTrash className="text-sm" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── format chip ──────────────────────────────────────────────────────────────
function FormatChip({ fmt }) {
  const meta = FORMAT_META[fmt];
  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      className="flex flex-col gap-2.5 rounded-2xl border p-4 backdrop-blur-sm cursor-default select-none"
      style={{ background: meta.bg, borderColor: meta.border }}
    >
      <div className="flex items-center justify-between">
        <span className="text-2xl" style={{ color: meta.color }}>{meta.icon}</span>
        <span className="rounded-md px-2 py-0.5 text-[10px] font-bold tracking-widest uppercase border"
          style={{ color: meta.color, borderColor: meta.border, background: "rgba(0,0,0,0.25)" }}>
          {meta.label}
        </span>
      </div>
      <div>
        <p className="text-xs font-medium text-white/70">{meta.desc}</p>
        <p className="text-[10px] text-white/30 mt-0.5">Max {SIZE_LIMITS[fmt]}</p>
      </div>
    </motion.div>
  );
}

// ─── drop zone ────────────────────────────────────────────────────────────────
function DropZone({ onFiles, dragging, setDragging }) {
  const inputRef = useRef();

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length) onFiles(files);
  }, [onFiles, setDragging]);

  const handleChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length) onFiles(files);
    e.target.value = "";
  };

  return (
    <motion.div
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      animate={dragging
        ? { scale: 1.015, borderColor: "rgba(124,58,237,0.7)" }
        : { scale: 1,     borderColor: "rgba(255,255,255,0.1)" }
      }
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      onClick={() => inputRef.current?.click()}
      className="relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed cursor-pointer overflow-hidden"
      style={{ minHeight: 300, background: "rgba(255,255,255,0.018)" }}
    >
      <input ref={inputRef} type="file" multiple accept=".pdf,.docx,.txt,.png" className="hidden" onChange={handleChange} />

      {/* pulsing rings */}
      <AnimatePresence>
        {dragging && (
          <>
            {[0, 1, 2].map((i) => (
              <motion.div key={i}
                initial={{ scale: 0.4, opacity: 0.6 }}
                animate={{ scale: 2.2, opacity: 0 }}
                transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.5, ease: "easeOut" }}
                className="absolute rounded-full border border-violet-500/40 pointer-events-none"
                style={{ width: 120, height: 120 }}
              />
            ))}
          </>
        )}
      </AnimatePresence>

      {/* inner glow */}
      <motion.div
        animate={dragging
          ? { opacity: 1, scale: 1.1 }
          : { opacity: 0.4, scale: 1 }}
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 60%, rgba(124,58,237,0.12) 0%, transparent 65%)" }}
      />

      {/* content */}
      <div className="relative z-10 flex flex-col items-center gap-4 px-8 py-10 text-center select-none">
        <motion.div
          animate={dragging
            ? { y: -8, scale: 1.15 }
            : { y: [0, -5, 0] }}
          transition={dragging
            ? { type: "spring", stiffness: 300 }
            : { duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
          className="relative flex h-20 w-20 items-center justify-center rounded-2xl border border-white/10"
          style={{ background: "rgba(124,58,237,0.12)", boxShadow: dragging ? "0 0 40px rgba(124,58,237,0.35)" : "none" }}
        >
          <BsCloudArrowUp className="text-4xl text-violet-400" />
          {dragging && (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-2xl border-t-2 border-violet-500/60"
            />
          )}
        </motion.div>

        <div>
          <AnimatePresence mode="wait">
            {dragging ? (
              <motion.p key="drop" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="text-lg font-semibold text-violet-300">
                Release to upload
              </motion.p>
            ) : (
              <motion.p key="drag" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="text-base font-semibold text-white/80">
                Drop files here or{" "}
                <span className="text-violet-400 underline underline-offset-2">browse</span>
              </motion.p>
            )}
          </AnimatePresence>
          <p className="mt-1.5 text-sm text-white/30">PDF, DOCX, TXT, PNG · up to 50 MB each</p>
        </div>

        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
          className="flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold text-white shadow-lg"
          style={{ background: "linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)", boxShadow: "0 4px 24px rgba(124,58,237,0.4)" }}
        >
          <HiOutlineCloudUpload className="text-base" /> Choose Files
        </motion.button>
      </div>
    </motion.div>
  );
}

// ─── main page ────────────────────────────────────────────────────────────────
export default function UploadPage() {
  const [dragging, setDragging] = useState(false);
  const [uploads, setUploads] = useState(SEED_UPLOADS);
  const [tab, setTab] = useState("all"); // all | active | done

  const removeUpload = (id) => setUploads((u) => u.filter((f) => f.id !== id));

  const simulateUpload = (file) => {
    const id  = genId();
    const type = extOf(file.name);
    const entry = {
      id,
      name: file.name,
      type,
      size: fmtBytes(file.size),
      date: "just now",
      status: "uploading",
      progress: 0,
      pages: null,
    };
    setUploads((u) => [entry, ...u]);

    // fake progress
    let prog = 0;
    const tick = setInterval(() => {
      prog += Math.random() * 18 + 6;
      if (prog >= 100) {
        prog = 100;
        clearInterval(tick);
        setUploads((u) => u.map((f) => f.id === id ? { ...f, progress: 100, status: "summarizing" } : f));
        setTimeout(() => {
          setUploads((u) => u.map((f) => f.id === id ? { ...f, status: "done" } : f));
        }, 2200);
      } else {
        setUploads((u) => u.map((f) => f.id === id ? { ...f, progress: Math.round(prog) } : f));
      }
    }, 220);
  };

  const handleFiles = (files) => files.forEach(simulateUpload);

  const filtered = uploads.filter((f) => {
    if (tab === "active") return f.status === "uploading" || f.status === "summarizing";
    if (tab === "done")   return f.status === "done" || f.status === "error";
    return true;
  });

  const activeCount = uploads.filter((f) => f.status === "uploading" || f.status === "summarizing").length;
  const doneCount   = uploads.filter((f) => f.status === "done").length;

  return (
    <div className="min-h-screen text-white overflow-x-hidden"
      style={{ background: "#09090b", fontFamily: "'Sora', sans-serif" }}>

      {/* ── fonts + resets ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.07); border-radius: 99px; }
        body { background: #09090b; }
      `}</style>

      {/* ── background ── */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <Orb style={{ top: "-15%", right: "-5%",  width: 700, height: 700, background: "radial-gradient(circle, rgba(109,40,217,0.09) 0%, transparent 70%)" }} />
        <Orb style={{ bottom: "5%", left: "-10%", width: 550, height: 550, background: "radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)" }} />
        <Orb style={{ top: "50%",  left: "40%",   width: 400, height: 400, background: "radial-gradient(circle, rgba(236,72,153,0.04) 0%, transparent 70%)" }} />
        {/* grid */}
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style={{ opacity: 0.022 }}>
          <defs><pattern id="g" width="44" height="44" patternUnits="userSpaceOnUse">
            <path d="M 44 0 L 0 0 0 44" fill="none" stroke="white" strokeWidth="0.5"/>
          </pattern></defs>
          <rect width="100%" height="100%" fill="url(#g)" />
        </svg>
        {/* horizontal separator glow */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg, transparent 0%, rgba(124,58,237,0.3) 50%, transparent 100%)" }} />
      </div>

      {/* ── layout ── */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-10">

        {/* ── page header ── */}
        <motion.div initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="h-7 w-7 rounded-lg bg-violet-600 flex items-center justify-center text-sm shadow-lg" style={{ boxShadow: "0 0 16px rgba(124,58,237,0.5)" }}>
              <HiOutlineDocumentDuplicate />
            </div>
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-white/35">DocuMind</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white">Upload Documents</h1>
              <p className="mt-1 text-sm text-white/35 max-w-md">
                Drop your files below — DocuMind AI will process and summarize them automatically.
              </p>
            </div>
            {/* live indicator */}
            {activeCount > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2 rounded-xl border border-violet-500/20 bg-violet-500/8 px-4 py-2.5 self-start sm:self-auto"
              >
                <motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.2, repeat: Infinity }}
                  className="h-2 w-2 rounded-full bg-violet-400" />
                <span className="text-sm text-violet-300 font-medium">{activeCount} uploading</span>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* ── two-col grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* ── LEFT: drop zone + formats ── */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.08 }}
            className="lg:col-span-3 flex flex-col gap-6"
          >
            {/* drop zone */}
            <DropZone onFiles={handleFiles} dragging={dragging} setDragging={setDragging} />

            {/* AI badge */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18 }}
              className="flex items-start gap-3.5 rounded-2xl border border-violet-500/15 bg-violet-500/[0.06] px-5 py-4"
            >
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-violet-500/20 bg-violet-500/10 text-violet-400">
                <BsStars className="text-base" />
              </div>
              <div>
                <p className="text-sm font-semibold text-violet-200">AI Summarization Enabled</p>
                <p className="mt-0.5 text-xs text-violet-300/55 leading-relaxed">
                  Every document is automatically analyzed and summarized by DocuMind AI. Key insights, topics, and action items are extracted within seconds of upload.
                </p>
              </div>
            </motion.div>

            {/* supported formats */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }}>
              <p className="mb-3 text-xs font-semibold tracking-widest uppercase text-white/30">Supported Formats</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {Object.keys(FORMAT_META).map((fmt) => (
                  <FormatChip key={fmt} fmt={fmt} />
                ))}
              </div>
            </motion.div>

            {/* tips row */}
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { icon: <HiOutlineLightningBolt />, title: "Instant processing", desc: "Files are queued and processed in real-time" },
                { icon: <HiOutlineChip />,          title: "AI extraction",      desc: "Key insights surfaced automatically" },
                { icon: <HiOutlineSparkles />,      title: "Smart search",       desc: "Ask questions about any document" },
              ].map((t, i) => (
                <div key={i} className="flex items-start gap-2.5 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3.5">
                  <span className="mt-0.5 text-violet-400 text-sm shrink-0">{t.icon}</span>
                  <div>
                    <p className="text-xs font-semibold text-white/70">{t.title}</p>
                    <p className="text-[11px] text-white/30 mt-0.5 leading-relaxed">{t.desc}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* ── RIGHT: upload queue ── */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 flex flex-col gap-4"
          >
            {/* panel header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-white/80">Upload Queue</h2>
                <p className="text-[11px] text-white/30 mt-0.5 font-mono">{uploads.length} files total</p>
              </div>
              {uploads.length > 0 && (
                <button onClick={() => setUploads([])}
                  className="flex items-center gap-1.5 rounded-lg border border-white/[0.07] bg-white/[0.03] px-3 py-1.5 text-xs text-white/35 hover:text-red-400 hover:border-red-500/20 hover:bg-red-500/5 transition-all">
                  <HiOutlineTrash className="text-xs" /> Clear all
                </button>
              )}
            </div>

            {/* tabs */}
            <div className="flex gap-1 rounded-xl border border-white/[0.07] bg-white/[0.025] p-1">
              {[
                { key: "all",    label: "All",     count: uploads.length },
                { key: "active", label: "Active",  count: activeCount },
                { key: "done",   label: "Done",    count: doneCount },
              ].map((t) => (
                <button key={t.key} onClick={() => setTab(t.key)}
                  className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-medium transition-all
                    ${tab === t.key ? "bg-white/[0.08] text-white" : "text-white/30 hover:text-white/60"}`}>
                  {t.label}
                  <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-mono
                    ${tab === t.key ? "bg-white/10 text-white/70" : "bg-white/[0.04] text-white/25"}`}>
                    {t.count}
                  </span>
                </button>
              ))}
            </div>

            {/* queue list */}
            <div className="flex flex-col gap-2.5 overflow-y-auto" style={{ maxHeight: 520 }}>
              <AnimatePresence mode="popLayout">
                {filtered.length === 0 ? (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center py-16 text-center"
                  >
                    <div className="h-14 w-14 rounded-2xl border border-white/[0.07] bg-white/[0.02] flex items-center justify-center text-2xl text-white/15 mb-3">
                      <HiOutlineDocumentText />
                    </div>
                    <p className="text-sm text-white/30 font-medium">No uploads yet</p>
                    <p className="text-xs text-white/18 mt-1">Drop files on the left to start</p>
                  </motion.div>
                ) : (
                  filtered.map((file) => (
                    <UploadCard key={file.id} file={file} onRemove={removeUpload} />
                  ))
                )}
              </AnimatePresence>
            </div>

            {/* summary footer */}
            {uploads.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-auto rounded-xl border border-white/[0.06] bg-white/[0.02] p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-white/40 font-medium">Overall progress</span>
                  <span className="text-xs font-mono text-white/40">{doneCount}/{uploads.length}</span>
                </div>
                <ProgressBar value={(doneCount / uploads.length) * 100} color="#7c3aed" />
                <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                  {[
                    { label: "Queued",  val: uploads.filter(f => f.status === "uploading").length,   color: "text-sky-400" },
                    { label: "AI Proc", val: uploads.filter(f => f.status === "summarizing").length, color: "text-violet-400" },
                    { label: "Done",    val: doneCount,                                               color: "text-emerald-400" },
                  ].map((s) => (
                    <div key={s.label} className="rounded-lg border border-white/[0.05] bg-white/[0.02] py-2">
                      <p className={`text-base font-bold ${s.color}`}>{s.val}</p>
                      <p className="text-[10px] text-white/30 mt-0.5">{s.label}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* ── footer ── */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center text-xs text-white/15"
        >
          Files are encrypted in transit and at rest · Powered by{" "}
          <span className="text-violet-400/50">DocuMind AI</span>
        </motion.p>
      </div>
    </div>
  );
}