import React, { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";
import {
  FiUpload, FiX, FiFile, FiFileText, FiImage,
  FiCheck, FiAlertCircle, FiTrash2, FiZap,
  FiChevronRight, FiCpu, FiPlus,
} from "react-icons/fi";

/* ─── Helpers ─── */
const formatBytes = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
};

const getFileIcon = (name) => {
  const ext = name.split(".").pop().toLowerCase();
  if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext)) return { icon: <FiImage />, color: "from-pink-500 to-rose-600", accent: "#f43f5e", dim: "rgba(244,63,94,0.12)", border: "rgba(244,63,94,0.25)", text: "text-rose-300" };
  if (["pdf"].includes(ext)) return { icon: <FiFileText />, color: "from-blue-500 to-indigo-600", accent: "#3b82f6", dim: "rgba(59,130,246,0.12)", border: "rgba(59,130,246,0.25)", text: "text-blue-300" };
  if (["docx", "doc"].includes(ext)) return { icon: <FiFileText />, color: "from-purple-500 to-indigo-600", accent: "#8b5cf6", dim: "rgba(139,92,246,0.12)", border: "rgba(139,92,246,0.25)", text: "text-purple-300" };
  if (["txt", "md"].includes(ext)) return { icon: <FiFile />, color: "from-emerald-500 to-teal-600", accent: "#10b981", dim: "rgba(16,185,129,0.12)", border: "rgba(16,185,129,0.25)", text: "text-emerald-300" };
  return { icon: <FiFile />, color: "from-gray-500 to-gray-700", accent: "#6b7280", dim: "rgba(107,114,128,0.12)", border: "rgba(107,114,128,0.25)", text: "text-gray-400" };
};

const ACCEPTED = ".pdf,.docx,.doc,.txt,.md,.png,.jpg,.jpeg,.webp";

/* ─── Particle ─── */
function Particle({ x, y, delay }) {
  return (
    <motion.div
      className="absolute w-1 h-1 rounded-full bg-blue-400/50 pointer-events-none"
      style={{ left: `${x}%`, top: `${y}%` }}
      animate={{ y: [0, -20, 0], opacity: [0, 0.8, 0], scale: [0.5, 1.2, 0.5] }}
      transition={{ duration: 2.5 + Math.random() * 2, repeat: Infinity, delay, ease: "easeInOut" }}
    />
  );
}

/* ─── File Row ─── */
function FileRow({ file, index, onRemove, uploadState }) {
  const meta = getFileIcon(file.name);
  const progress = uploadState?.progress ?? 0;
  const status = uploadState?.status ?? "queued";
  const ext = file.name.split(".").pop().toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 20, scale: 0.95 }}
      transition={{ duration: 0.35, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex items-center gap-3 p-3.5 rounded-2xl border overflow-hidden transition-all duration-300"
      style={{
        borderColor: status === "done" ? "rgba(16,185,129,0.3)" : status === "error" ? "rgba(239,68,68,0.3)" : meta.border,
        background: status === "done" ? "rgba(16,185,129,0.05)" : status === "error" ? "rgba(239,68,68,0.05)" : meta.dim,
      }}
    >
      {/* Progress background fill */}
      {status === "uploading" && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{ background: `linear-gradient(to right, ${meta.dim} 0%, transparent 100%)`, transformOrigin: "left" }}
          animate={{ scaleX: progress / 100 }}
          transition={{ duration: 0.2 }}
        />
      )}

      {/* File icon */}
      <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${meta.color} flex items-center justify-center text-white text-sm shrink-0 relative z-10`}>
        {meta.icon}
      </div>

      {/* File info */}
      <div className="flex-1 min-w-0 relative z-10">
        <p className="text-white text-xs font-semibold truncate">{file.name}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-gray-500 text-[10px] uppercase font-bold">{ext}</span>
          <span className="text-gray-700 text-[10px]">·</span>
          <span className="text-gray-500 text-[10px]">{formatBytes(file.size)}</span>
          {status === "uploading" && (
            <>
              <span className="text-gray-700 text-[10px]">·</span>
              <span className={`text-[10px] font-semibold ${meta.text}`}>{Math.round(progress)}%</span>
            </>
          )}
        </div>
        {status === "uploading" && (
          <div className="mt-1.5 h-1 rounded-full bg-white/[0.06] overflow-hidden">
            <motion.div
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.15 }}
              className={`h-full rounded-full bg-gradient-to-r ${meta.color}`}
            />
          </div>
        )}
      </div>

      {/* Status icon */}
      <div className="relative z-10 shrink-0">
        <AnimatePresence mode="wait">
          {status === "done" ? (
            <motion.div key="done" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 400 }}
              className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
              <FiCheck className="text-emerald-400 text-[10px]" />
            </motion.div>
          ) : status === "error" ? (
            <motion.div key="error" initial={{ scale: 0 }} animate={{ scale: 1 }}
              className="w-6 h-6 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center">
              <FiAlertCircle className="text-red-400 text-[10px]" />
            </motion.div>
          ) : status === "uploading" ? (
            <motion.div key="uploading"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className={`w-5 h-5 rounded-full border-2 border-transparent border-t-current ${meta.text}`}
            />
          ) : (
            <motion.button key="remove"
              whileHover={{ scale: 1.15, color: "#ef4444" }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onRemove(file)}
              className="w-6 h-6 rounded-lg bg-white/5 border border-white/[0.07] flex items-center justify-center text-gray-600 hover:border-red-500/30 hover:bg-red-500/10 transition-all duration-200">
              <FiTrash2 className="text-[10px]" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

/* ─── Upload Zone ─── */
function UploadZone({ onFiles, dragging, setDragging }) {
  const inputRef = useRef(null);
  const particles = Array.from({ length: 10 }, (_, i) => ({ x: 10 + i * 8, y: 30 + (i % 3) * 20, delay: i * 0.2 }));

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
  }, [setDragging]);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDragging(false);
    }
  }, [setDragging]);

  const onDrop = useCallback((e) => {
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
    e.target.value = null;
  };

  return (
    <motion.div
      onDragOver={handleDragOver}
      onDragEnter={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={onDrop}
      onClick={() => inputRef.current?.click()}
      animate={{
        borderColor: dragging ? "rgba(59,130,246,0.7)" : "rgba(255,255,255,0.09)",
        background: dragging ? "rgba(59,130,246,0.05)" : "rgba(255,255,255,0.02)",
        scale: dragging ? 1.01 : 1,
      }}
      transition={{ duration: 0.2 }}
      className="relative rounded-2xl border-2 border-dashed p-8 flex flex-col items-center gap-4 cursor-pointer overflow-hidden"
      style={{ minHeight: 180 }}
    >
      <AnimatePresence>
        {dragging && particles.map((p, i) => <Particle key={i} {...p} />)}
      </AnimatePresence>

      <AnimatePresence>
        {dragging && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse at center, rgba(59,130,246,0.12) 0%, transparent 70%)" }}
          />
        )}
      </AnimatePresence>

      <motion.div
        animate={{
          scale: dragging ? 1.15 : 1,
          y: dragging ? -6 : 0,
          boxShadow: dragging ? "0 0 30px rgba(59,130,246,0.5)" : "none",
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-indigo-600/20 border border-blue-500/20 flex items-center justify-center pointer-events-none"
      >
        <motion.div animate={{ rotate: dragging ? [0, -15, 15, -10, 10, 0] : 0 }} transition={{ duration: 0.5 }}>
          <FiUpload className="text-blue-400 text-2xl" />
        </motion.div>

        <AnimatePresence>
          {dragging && (
            <motion.div
              initial={{ scale: 0.5, opacity: 0.6 }}
              animate={{ scale: 2, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1, repeat: Infinity }}
              className="absolute inset-0 rounded-2xl border border-blue-400/40"
            />
          )}
        </AnimatePresence>
      </motion.div>

      <div className="text-center relative z-10 pointer-events-none">
        <motion.p animate={{ color: dragging ? "#93c5fd" : "#e5e7eb" }} className="font-semibold text-sm mb-1">
          {dragging ? "Drop files to upload" : "Drop files here or click to browse"}
        </motion.p>
        <p className="text-gray-600 text-xs">PDF, DOCX, TXT, PNG up to 50 MB</p>
      </div>

      <input ref={inputRef} type="file" multiple accept={ACCEPTED} className="hidden" onChange={handleChange} />
    </motion.div>
  );
}

/* ─── Main Upload Modal ─── */
export default function UploadModal({ onClose }) {
  const [files, setFiles] = useState([]);
  const [dragging, setDragging] = useState(false);
  const [uploadStates, setUploadStates] = useState({});
  const [phase, setPhase] = useState("idle");

  // Global drag prevention
  useEffect(() => {
    const preventDefault = (e) => e.preventDefault();
    window.addEventListener("dragover", preventDefault);
    window.addEventListener("drop", preventDefault);
    return () => {
      window.removeEventListener("dragover", preventDefault);
      window.removeEventListener("drop", preventDefault);
    };
  }, []);

  const addFiles = (newFiles) => {
    setFiles((prev) => {
      const existing = new Set(prev.map((f) => f.name + f.size));
      return [...prev, ...newFiles.filter((f) => !existing.has(f.name + f.size))];
    });
  };

  const removeFile = (file) => {
    setFiles((prev) => prev.filter((f) => f !== file));
  };

  const startUpload = async () => {
    if (!files.length) return;
    setPhase("uploading");

    const token = localStorage.getItem("token");
    let completedCount = 0;
    let hasError = false;

    // Process files sequentially or map via Promise.all. Doing sequentially for clearer UI state.
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileKey = file.name + file.size;

      setUploadStates((s) => ({ ...s, [fileKey]: { progress: 0, status: "uploading" } }));

      const formData = new FormData();
      formData.append("document", file);

      try {
        await axios.post("http://localhost:5000/api/documents/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${token}`
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadStates((s) => ({ ...s, [fileKey]: { progress: percentCompleted, status: percentCompleted === 100 ? "summarizing" : "uploading" } }));
          }
        });

        setUploadStates((s) => ({ ...s, [fileKey]: { progress: 100, status: "done" } }));
        completedCount++;
        toast.success(`${file.name} uploaded!`);

      } catch (error) {
        console.error("Upload error:", error);
        hasError = true;
        setUploadStates((s) => ({ ...s, [fileKey]: { progress: 0, status: "error" } }));
        toast.error(`Failed to upload ${file.name}`);
      }
    }

    if (completedCount > 0 && !hasError) {
      setTimeout(() => setPhase("done"), 500);
    } else if (hasError && completedCount === 0) {
      setPhase("idle");
    } else {
      setTimeout(() => setPhase("done"), 500);
    }
  };

  const totalProgress = files.length === 0 ? 0 : files.reduce((acc, f) => acc + (uploadStates[f.name + f.size]?.progress ?? 0), 0) / files.length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(12px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose?.()}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 28 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 16 }}
        transition={{ type: "spring", stiffness: 280, damping: 24 }}
        className="relative w-full max-w-lg rounded-3xl overflow-hidden"
        style={{ background: "rgba(17,24,39,0.95)", backdropFilter: "blur(24px)", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 0 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04) inset" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent" />
        <motion.div animate={{ opacity: [0.4, 0.8, 0.4] }} transition={{ duration: 3, repeat: Infinity }}
          className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-indigo-400/40 to-transparent blur-sm" />
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-40 bg-blue-500/10 blur-[60px] rounded-full pointer-events-none" />

        <div className="relative z-10 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-[0_0_18px_rgba(59,130,246,0.45)]">
                <FiCpu className="text-white text-base" />
              </motion.div>
              <div>
                <h2 className="text-white font-semibold text-base">Upload Documents</h2>
                <p className="text-gray-500 text-[11px]">AI will analyze and summarize automatically</p>
              </div>
            </div>
            <motion.button whileHover={{ scale: 1.1, rotate: 90, backgroundColor: "rgba(239,68,68,0.1)", borderColor: "rgba(239,68,68,0.3)" }}
              whileTap={{ scale: 0.9 }} onClick={onClose}
              className="w-8 h-8 rounded-xl bg-white/5 border border-white/[0.08] flex items-center justify-center text-gray-500 hover:text-red-400 transition-all duration-200">
              <FiX className="text-sm" />
            </motion.button>
          </div>

          <AnimatePresence mode="wait">
            {phase === "done" ? (
              <motion.div key="done" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center py-8 text-center">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
                  className="w-16 h-16 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mb-4">
                  <FiCheck className="text-emerald-400 text-2xl" />
                </motion.div>
                <h3 className="text-white font-bold text-lg mb-1">Upload Complete!</h3>
                <p className="text-gray-400 text-sm mb-2">{files.length} document{files.length > 1 ? "s" : ""} uploaded successfully</p>
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-500/10 border border-purple-500/20 mb-6">
                  <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
                    <FiZap className="text-purple-400 text-sm" />
                  </motion.div>
                  <span className="text-purple-300 text-xs font-medium">AI analysis in progress…</span>
                </div>
                <motion.button whileHover={{ scale: 1.04, boxShadow: "0 0 20px rgba(59,130,246,0.35)" }} whileTap={{ scale: 0.97 }} onClick={onClose}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm font-semibold">
                  Go to Dashboard <FiChevronRight />
                </motion.button>
              </motion.div>
            ) : (
              <motion.div key="upload" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <UploadZone onFiles={addFiles} dragging={dragging} setDragging={setDragging} />

                <AnimatePresence>
                  {files.length > 0 && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }} className="mt-4 space-y-2 overflow-hidden">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-gray-500 text-[10px] font-semibold uppercase tracking-widest">
                          {files.length} file{files.length > 1 ? "s" : ""} selected
                        </p>
                        {phase === "uploading" && (
                          <div className="flex items-center gap-2">
                            <div className="w-24 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                              <motion.div animate={{ width: `${totalProgress}%` }} transition={{ duration: 0.2 }} className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-400" />
                            </div>
                            <span className="text-gray-500 text-[10px]">{Math.round(totalProgress)}%</span>
                          </div>
                        )}
                        {phase === "idle" && (
                          <button onClick={() => setFiles([])} className="text-gray-600 hover:text-red-400 text-[10px] transition-colors flex items-center gap-1">
                            <FiTrash2 className="text-[9px]" /> Clear all
                          </button>
                        )}
                      </div>

                      <div className="space-y-2 max-h-48 overflow-y-auto pr-1" style={{ scrollbarWidth: "thin", scrollbarColor: "#1F2937 transparent" }}>
                        <AnimatePresence>
                          {files.map((file, i) => (
                            <FileRow key={file.name + file.size} file={file} index={i} onRemove={removeFile} uploadState={uploadStates[file.name + file.size]} />
                          ))}
                        </AnimatePresence>
                      </div>

                      {phase === "idle" && (
                        <motion.button whileHover={{ borderColor: "rgba(59,130,246,0.3)", color: "#93c5fd" }} onClick={() => document.querySelector("input[type=file]")?.click()}
                          className="w-full py-2 rounded-xl border border-dashed border-white/[0.07] text-gray-600 text-xs flex items-center justify-center gap-1.5 transition-all duration-200 hover:bg-blue-500/[0.04]">
                          <FiPlus className="text-[11px]" /> Add more files
                        </motion.button>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex gap-3 mt-5">
                  <motion.button whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.07)" }} whileTap={{ scale: 0.98 }} onClick={onClose}
                    className="flex-1 py-3 rounded-xl border border-white/10 bg-white/[0.04] text-gray-300 text-sm font-medium transition-all duration-200">
                    Cancel
                  </motion.button>
                  <motion.button whileHover={files.length && phase === "idle" ? { scale: 1.03, boxShadow: "0 0 28px rgba(59,130,246,0.45)" } : {}} whileTap={files.length && phase === "idle" ? { scale: 0.97 } : {}}
                    onClick={startUpload} disabled={!files.length || phase === "uploading"}
                    className={`flex-2 flex-1 py-3 rounded-xl text-white text-sm font-semibold relative overflow-hidden flex items-center justify-center gap-2 transition-all duration-300 ${!files.length ? "bg-white/10 text-gray-600 cursor-not-allowed" : phase === "uploading" ? "bg-gradient-to-r from-blue-600/70 to-indigo-600/70 cursor-wait" : "bg-gradient-to-r from-blue-500 to-indigo-500 shadow-[0_0_20px_rgba(59,130,246,0.25)]"}`}>
                    {files.length > 0 && phase === "idle" && (
                      <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12" animate={{ x: ["-100%", "200%"] }} transition={{ duration: 2.8, repeat: Infinity, repeatDelay: 1.5 }} />
                    )}
                    <AnimatePresence mode="wait">
                      {phase === "uploading" ? (
                        <motion.div key="up" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                          <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }} className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white" />
                          Uploading {files.length} file{files.length > 1 ? "s" : ""}…
                        </motion.div>
                      ) : (
                        <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2 relative z-10">
                          <FiUpload className="text-sm" />
                          {files.length ? `Upload ${files.length} file${files.length > 1 ? "s" : ""}` : "Upload & Analyze"}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}