import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineX, HiOutlineDownload } from "react-icons/hi";

const DocumentPreviewModal = ({ document, onClose }) => {
  const [textContent, setTextContent] = useState("");
  const [loadingText, setLoadingText] = useState(false);

  useEffect(() => {
    if (!document) return;
    
const mimeType = document.fileType || "";

const isTextFile =
  mimeType.startsWith("text/") ||
  mimeType.includes("json");
    let cancelled = false;

    const loadText = async () => {
      if (!isTextFile) return;
      setLoadingText(true);
      try {
        const res = await fetch(document.fileUrl, { method: "GET", mode: "cors" });
        let text = "";
        try {
          text = await res.text();
        } catch (err) {
          const blob = await res.blob();
          text = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(String(reader.result || ""));
            reader.onerror = (e) => reject(e);
            reader.readAsText(blob);
          });
        }

        if (!cancelled) setTextContent(text || "");
      } catch (err) {
        console.error("Text fetch error:", err);
        if (!cancelled) setTextContent("Failed to load text content. Try 'View Raw'.");
      } finally {
        if (!cancelled) setLoadingText(false);
      }
    };

    loadText();

    return () => { cancelled = true; };
  }, [document]);

  if (!document) return null;

const mimeType = document.fileType || "";

const isPdf =
  mimeType.includes("pdf");

const isImage =
  mimeType.startsWith("image/");

const isOffice =
  mimeType.includes("word") ||
  mimeType.includes("presentation") ||
  mimeType.includes("excel") ||
  mimeType.includes("spreadsheet");

const isText =
  mimeType.startsWith("text/") ||
  mimeType.includes("json");
  

  let viewerUrl = "";
 if (isOffice || isPdf) {
  viewerUrl =
    `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(document.fileUrl)}`;
} else {
  viewerUrl = document.fileUrl;
}

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="w-full max-w-6xl h-[90vh] bg-[#111827] rounded-2xl border border-white/10 overflow-hidden flex flex-col"
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.95 }}
        >

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
            <h2 className="text-white font-semibold truncate">
              {document.name}
            </h2>

            <div className="flex items-center gap-3">

              <a
                href={document.fileUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm"
              >
                <HiOutlineDownload />
                Download
              </a>

              <button
                onClick={onClose}
                className="text-white/70 hover:text-white"
              >
                <HiOutlineX size={24} />
              </button>

            </div>
          </div>

{/* Preview Area */}
          <div className="flex-1 bg-black relative overflow-hidden">

            {isImage ? (
              <img
                src={document.fileUrl}
                alt={document.name}
                className="w-full h-full object-contain"
              />
            ) : isText ? (
              <div className="absolute inset-0 bg-[#0B0F19] text-gray-300 p-4 flex flex-col">
                <div className="flex items-center justify-end gap-3 px-2 pb-2 shrink-0">
                  <a
                    href={document.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-gray-400 hover:text-white underline"
                  >
                    View Raw
                  </a>
                </div>

                {loadingText && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 z-20 pointer-events-none">
                    <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-3"></div>
                    <p className="text-sm font-medium">Loading text...</p>
                  </div>
                )}

                <div className="overflow-y-auto flex-1 z-10 pr-2" tabIndex={0} style={{ outline: "none", scrollbarWidth: "thin" }}>
                  <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed w-full max-w-none">{textContent}</pre>
                </div>
              </div>
            ) : (
              <div className="relative w-full h-full bg-white">
                {/* Fallback text sitting behind the iframe */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 z-0">
                  <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-3"></div>
                  <p className="text-sm font-medium">Loading preview...</p>
                  <p className="text-xs mt-1">If the preview doesn't load, use the Download button above.</p>
                </div>

                {/* The actual viewer iframe */}
                <iframe
                  src={viewerUrl}
                  title={document.name}
                  className="w-full h-full border-none relative z-10"
                  allowFullScreen
                />
              </div>
            )}

          </div>

        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default DocumentPreviewModal;