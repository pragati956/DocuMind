import { useState } from "react";
import { motion } from "framer-motion";
import { HiOutlineX } from "react-icons/hi";

import { updateDocument } from "../../services/documentService";

const EditDocumentModal = ({
  document,
  onClose,
  onSuccess,
}) => {
  const [title, setTitle] = useState(
    document?.name || ""
  );

  const [tags, setTags] = useState(
    document?.tags?.join(", ") || ""
  );

  const [summary, setSummary] = useState(
    document?.summary || ""
  );

  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    try {
      setLoading(true);

      await updateDocument(
        document.id,
        {
          title,

          tags: tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean),

          summary,
        }
      );

      if (onSuccess) {
        onSuccess();
      }

      onClose();

    } catch (error) {
      console.error(
        "Update failed:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="w-full max-w-2xl rounded-2xl bg-[#111827] border border-white/10 p-6"
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">
            Edit Document
          </h2>

          <button
            onClick={onClose}
            className="text-white/60 hover:text-white"
          >
            <HiOutlineX size={24} />
          </button>
        </div>

        {/* Title */}
        <div className="mb-4">
          <label className="block text-sm text-white/70 mb-2">
            Title
          </label>

          <input
            type="text"
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
            className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-3 text-white outline-none focus:border-violet-500"
          />
        </div>

        {/* Tags */}
        <div className="mb-4">
          <label className="block text-sm text-white/70 mb-2">
            Tags
          </label>

          <input
            type="text"
            value={tags}
            onChange={(e) =>
              setTags(e.target.value)
            }
            placeholder="resume, internship, ai"
            className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-3 text-white outline-none focus:border-violet-500"
          />
        </div>

        {/* Summary */}
        <div className="mb-6">
          <label className="block text-sm text-white/70 mb-2">
            Summary
          </label>

          <textarea
            rows={6}
            value={summary}
            onChange={(e) =>
              setSummary(e.target.value)
            }
            className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-3 text-white outline-none focus:border-violet-500 resize-none"
          />
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-white/10 text-white/70 hover:bg-white/5"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={loading}
            className="px-5 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-medium disabled:opacity-50"
          >
            {loading
              ? "Saving..."
              : "Save Changes"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default EditDocumentModal;