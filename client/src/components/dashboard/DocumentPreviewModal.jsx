import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineX, HiOutlineDownload } from "react-icons/hi";

const DocumentPreviewModal = ({ document, onClose }) => {
  if (!document) return null;

  const isImage =
    document.type === "PNG" ||
    document.type === "JPG" ||
    document.type === "JPEG";

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
          <div className="flex-1 bg-black">

            {isImage ? (
              <img
                src={document.fileUrl}
                alt={document.name}
                className="w-full h-full object-contain"
              />
            ) : (
              <iframe
                src={document.fileUrl}
                title={document.name}
                className="w-full h-full"
              />
            )}

          </div>

        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default DocumentPreviewModal;