import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { HiOutlineX } from "react-icons/hi";
import { FiFolder } from "react-icons/fi";
import { getCollections, addDocumentToCollection } from "../../services/collectionService";
import { toast } from "react-hot-toast";

export default function AddToCollectionModal({ documentId, onClose }) {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchColls = async () => {
      try {
        const data = await getCollections();
        setCollections(data.collections || []);
      } catch (error) {
        toast.error("Failed to load collections");
      } finally {
        setLoading(false);
      }
    };
    fetchColls();
  }, []);

  const handleAdd = async (collectionId) => {
    try {
      await addDocumentToCollection(collectionId, documentId);
      toast.success("Added to collection!");
      onClose();
    } catch (error) {
      toast.error("Failed to add to collection");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#111827] shadow-2xl overflow-hidden"
      >
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <h2 className="text-white font-semibold">Add to Collection</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            <HiOutlineX className="text-lg" />
          </button>
        </div>

        <div className="p-3 max-h-80 overflow-y-auto" style={{ scrollbarWidth: "thin" }}>
          {loading ? (
            <p className="text-center text-gray-500 py-6 text-sm">Loading...</p>
          ) : collections.length === 0 ? (
            <p className="text-center text-gray-500 py-6 text-sm">No collections found. Create one first!</p>
          ) : (
            collections.map((col) => (
              <motion.button
                key={col._id}
                whileHover={{ backgroundColor: "rgba(255,255,255,0.04)" }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleAdd(col._id)}
                className="w-full flex items-center gap-3 p-3 rounded-xl transition-colors text-left"
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${col.color || "from-blue-500 to-indigo-600"} flex items-center justify-center text-white`}>
                  <FiFolder />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">{col.name}</p>
                  <p className="text-[10px] text-gray-500">{col.documents?.length || 0} documents</p>
                </div>
              </motion.button>
            ))
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}