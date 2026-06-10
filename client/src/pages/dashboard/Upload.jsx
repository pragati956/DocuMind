import { useState, useRef, useCallback, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";
const API_URL =
 import.meta.env.VITE_API_URL;
import { AuthContext } from "../../context/AuthContext";
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
  JPG:  { icon: <BsFileImage />,  color: "#ffb74d", bg: "rgba(255,183,77,0.08)",  border: "rgba(255,183,77,0.18)",  label: "JPG",  desc: "Images, screenshots, scans" },
  JPEG: { icon: <BsFileImage />,  color: "#ffb74d", bg: "rgba(255,183,77,0.08)",  border: "rgba(255,183,77,0.18)",  label: "JPEG", desc: "Images, screenshots, scans" },
};

const SIZE_LIMITS = { PDF: "50 MB", DOCX: "25 MB", TXT: "10 MB", PNG: "20 MB", JPG: "20 MB", JPEG: "20 MB" };

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
      {isActive && (
        <motion.div
          animate={{ x: ["-100%", "200%"] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
          className="absolute inset-y-0 left-0 w-1/3 pointer-events-none"
          style={{ background: `linear-gradient(90deg, transparent, ${meta.color}18, transparent)` }}
        />
      )}

      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border text-xl"
          style={{ background: meta.bg, borderColor: meta.border, color: meta.color }}>
          {meta.icon}
        </div>

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
            <span>{file.sizeStr}</span>
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

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
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
  const inputRef = useRef(null);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFiles(Array.from(e.dataTransfer.files));
      e.dataTransfer.clearData();
    }
  }, [onFiles, setDragging]);

  const handleChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      onFiles(Array.from(e.target.files));
    }
    e.target.value = null; // Reset input so same file can be selected again
  };

  return (
    <motion.div
      onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setDragging(true); }}
      onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setDragging(false); }}
      onDrop={handleDrop}
      animate={dragging
        ? { scale: 1.015, borderColor: "rgba(124,58,237,0.7)", background: "rgba(124,58,237,0.05)" }
        : { scale: 1,     borderColor: "rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.018)" }
      }
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className="relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed cursor-pointer overflow-hidden"
      style={{ minHeight: 300 }}
    >
      {/* Hidden File Input */}
      <input 
        ref={inputRef} 
        type="file" 
        multiple 
accept=".pdf,.docx,.txt,.png,.jpg,.jpeg,.webp"
        className="hidden" 
        onChange={handleChange} 
      />

      {/* inner glow */}
      <motion.div
        animate={dragging ? { opacity: 1, scale: 1.1 } : { opacity: 0.4, scale: 1 }}
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 60%, rgba(124,58,237,0.12) 0%, transparent 65%)" }}
      />

      <div className="relative z-10 flex flex-col items-center gap-4 px-8 py-10 text-center select-none pointer-events-none">
        <motion.div
          animate={dragging ? { y: -8, scale: 1.15 } : { y: [0, -5, 0] }}
          transition={dragging ? { type: "spring", stiffness: 300 } : { duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
          className="relative flex h-20 w-20 items-center justify-center rounded-2xl border border-white/10"
          style={{ background: "rgba(124,58,237,0.12)", boxShadow: dragging ? "0 0 40px rgba(124,58,237,0.35)" : "none" }}
        >
          <BsCloudArrowUp className="text-4xl text-violet-400" />
        </motion.div>

        <div>
          <p className="text-base font-semibold text-white/80">
            {dragging ? "Release to upload" : "Drop files here or click to browse"}
          </p>
          <p className="mt-1.5 text-sm text-white/30">PDF, DOCX, TXT, PNG, JPG, WEBP — up to 50 MB each</p>
        </div>

        {/* Pointer events auto so the button is clickable */}
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
          className="pointer-events-auto flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold text-white shadow-lg z-20"
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
  const [uploads, setUploads] = useState([]); 
  useContext(AuthContext);// Access context for auth token if needed

  // GLOBAL DRAG PREVENTION: Stops browser from opening files if you miss the dropzone
  useEffect(() => {
    const preventDefault = (e) => e.preventDefault();
    window.addEventListener("dragover", preventDefault);
    window.addEventListener("drop", preventDefault);
    return () => {
      window.removeEventListener("dragover", preventDefault);
      window.removeEventListener("drop", preventDefault);
    };
  }, []);

  const removeUpload = (id) => setUploads((u) => u.filter((f) => f.id !== id));

const executeUpload = async (fileRaw) => {
  const id = genId();
  const type = extOf(fileRaw.name);
  
  const entry = {
    id, name: fileRaw.name, type, sizeStr: fmtBytes(fileRaw.size),
    date: "just now", status: "uploading", progress: 0, pages: null,
  };
  setUploads((u) => [entry, ...u]);

  const formData = new FormData();
  formData.append("document", fileRaw);

  try {
    const token = localStorage.getItem("token");
    // This is the real request
const response = await axios.post(
  `${API_URL}/documents/upload`,
  formData,
  {
    headers: {
      "Content-Type": "multipart/form-data",
      "Authorization": `Bearer ${token}`
    },
    onUploadProgress: (e) => {
      const p = Math.round((e.loaded * 100) / e.total);

      setUploads((u) =>
        u.map((f) =>
          f.id === id
            ? { ...f, progress: p }
            : f
        )
      );
    }
  }
);

    // Only set to "done" if the BACKEND successfully returns the saved document
    setUploads((u) => u.map((f) => f.id === id ? { ...f, status: "done", progress: 100 } : f));
    toast.success("Saved to database!");

  } catch (error) {
    console.error("Upload failed:", error.response?.data || error);
    toast.error("Database save failed");
    setUploads((u) => u.map((f) => f.id === id ? { ...f, status: "error" } : f));
  }
};
const allowedTypes = [

 "application/pdf",

 "application/vnd.openxmlformats-officedocument.wordprocessingml.document",

 "application/msword",

 "text/plain",

 "image/png",

 "image/jpeg",

 "image/jpg",

 "image/webp"

];

 const handleFiles = (files) => {

 setDragging(false);

 files.forEach(file => {
  if(
 file.size >
 50* 1024 * 1024
){

 toast.error(
  `${file.name} exceeds 10MB limit`
 );

 return;

}

  if(
   !allowedTypes.includes(file.type)
  ){
   toast.error(
    `${file.name} is not supported`
   );
   return;
  }

  executeUpload(file);

 });

};

 


  return (
    <div className="min-h-screen text-white overflow-x-hidden"
      style={{ background: "#09090b", fontFamily: "'Sora', sans-serif" }}>
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
Drop your files below — DocuMind will securely upload and organize them.              </p>
            </div>
          </div>
        </motion.div>

        {/* ── two-col grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* ── LEFT: drop zone + formats ── */}
          <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.08 }} className="lg:col-span-3 flex flex-col gap-6">
            <DropZone onFiles={handleFiles} dragging={dragging} setDragging={setDragging} />
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }}>
              <p className="mb-3 text-xs font-semibold tracking-widest uppercase text-white/30">Supported Formats</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {["PDF", "DOCX", "TXT", "PNG"].map((fmt) => (
                  <FormatChip key={fmt} fmt={fmt} />
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* ── RIGHT: upload queue ── */}
          <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-2 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-white/80">Upload Queue</h2>
                <p className="text-[11px] text-white/30 mt-0.5 font-mono">{uploads.length} files total</p>
              </div>
            </div>

            {/* queue list */}
            <div className="flex flex-col gap-2.5 overflow-y-auto" style={{ maxHeight: 520 }}>
              <AnimatePresence mode="popLayout">
{uploads.length === 0 ? (  
                  <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="h-14 w-14 rounded-2xl border border-white/[0.07] bg-white/[0.02] flex items-center justify-center text-2xl text-white/15 mb-3">
                      <HiOutlineDocumentText />
                    </div>
                    <p className="text-sm text-white/30 font-medium">No uploads yet</p>
                  </motion.div>
                ) : (
                  uploads.map((file) => (
                    <UploadCard key={file.id} file={file} onRemove={removeUpload} />
                  ))
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}