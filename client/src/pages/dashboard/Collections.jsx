import React, {
  useState,
  useEffect,
  useCallback,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import {
  createCollection,
  getCollections,
  toggleStarCollection,
  deleteCollection
} from "../../services/collectionService";
import {
  FiFolder, FiPlus, FiMoreHorizontal, FiFileText,
  FiStar, FiUsers, FiLock, FiGlobe, 
  FiTrash2, FiShare2, FiGrid, FiList, FiSearch,
   FiCheck, FiX, 
  FiArrowRight, 
} from "react-icons/fi";

/* ─── Privacy Icon ─── */
function PrivacyIcon({ type }) {
  if (type === "private") return <FiLock className="text-[10px]" />;
  if (type === "public") return <FiGlobe className="text-[10px]" />;
  return <FiUsers className="text-[10px]" />;
}

/* ─── Context Menu ─── */
function ContextMenu({ onClose, onAction }) {
  const items = [
  {
    icon: <FiTrash2 />,
    label: "Delete",
    danger: true,
  },
];
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: -6 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.15 }}
      className="absolute right-0 top-full mt-1.5 w-44 rounded-2xl border border-[#1F2937] overflow-hidden shadow-2xl z-30"
      style={{ background: "rgba(17,24,39,0.98)", backdropFilter: "blur(20px)" }}
      onClick={(e) => e.stopPropagation()}
    >
      {items.map((item, i) => (
        <motion.button
          key={i}
          whileHover={{ backgroundColor: item.danger ? "rgba(239,68,68,0.07)" : "rgba(255,255,255,0.04)" }}
          onClick={() => {
            onAction(item.label);
            onClose();
          }}
          className={`w-full flex items-center gap-3 px-4 py-2.5 text-xs transition-colors ${item.danger ? "text-red-400" : "text-gray-300"} ${i > 0 ? "border-t border-white/[0.04]" : ""}`}
        >
          <span className={item.danger ? "text-red-400" : "text-gray-500 text-sm"}>{item.icon}</span>
          {item.label}
        </motion.button>
      ))}
    </motion.div>
  );
}

/* ─── Create Collection Modal ─── */
function CreateModal({ onClose, onCreate }) {
  const [creating, setCreating] =
 useState(false);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [privacy, setPrivacy] = useState("team");
  const [selectedColor, setSelectedColor] = useState(0);
  const [nameFocused, setNameFocused] = useState(false);
  const [descFocused, setDescFocused] = useState(false);

  const colorOptions = [
    { label: "Blue", gradient: "from-blue-500 to-indigo-600" },
    { label: "Purple", gradient: "from-purple-500 to-pink-600" },
    { label: "Emerald", gradient: "from-emerald-500 to-teal-600" },
    { label: "Amber", gradient: "from-amber-500 to-orange-600" },
    { label: "Rose", gradient: "from-rose-500 to-pink-600" },
    { label: "Cyan", gradient: "from-cyan-500 to-blue-600" },
  ];

  const privacyOptions = [
    { value: "private", icon: <FiLock />, label: "Private", desc: "Only you" },
    { value: "team", icon: <FiUsers />, label: "Team", desc: "Your workspace" },
    { value: "public", icon: <FiGlobe />, label: "Public", desc: "Anyone with link" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(12px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 24 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ type: "spring", stiffness: 280, damping: 24 }}
        className="w-full max-w-md rounded-3xl overflow-hidden"
        style={{ background: "rgba(17,24,39,0.96)", backdropFilter: "blur(24px)", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 0 60px rgba(0,0,0,0.6)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent" />

        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${colorOptions[selectedColor].gradient} flex items-center justify-center`}>
                <FiFolder className="text-white text-base" />
              </div>
              <div>
                <h2 className="text-white font-semibold text-base">New Collection</h2>
                <p className="text-gray-500 text-[11px]">Organize your documents</p>
              </div>
            </div>
            <motion.button whileHover={{ scale: 1.1, rotate: 90 }} onClick={onClose}
              className="w-8 h-8 rounded-xl bg-white/5 border border-white/[0.08] flex items-center justify-center text-gray-500 hover:text-white transition-colors">
              <FiX className="text-sm" />
            </motion.button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-[10px] text-gray-600 font-semibold uppercase tracking-widest mb-1.5">Collection Name</label>
              <motion.div animate={{ borderColor: nameFocused ? "rgba(59,130,246,0.45)" : "rgba(31,41,55,1)", boxShadow: nameFocused ? "0 0 0 3px rgba(59,130,246,0.08)" : "none" }}
                className="flex items-center gap-2 px-4 py-3 rounded-xl border bg-white/[0.03]">
                <FiFolder className={`text-sm shrink-0 transition-colors ${nameFocused ? "text-blue-400" : "text-gray-600"}`} />
                <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                  onFocus={() => setNameFocused(true)} onBlur={() => setNameFocused(false)}
                  placeholder="e.g. Finance Reports" className="flex-1 bg-transparent text-white text-sm placeholder-gray-600 outline-none" />
              </motion.div>
            </div>

            <div>
              <label className="block text-[10px] text-gray-600 font-semibold uppercase tracking-widest mb-1.5">Description <span className="text-gray-700 normal-case">(optional)</span></label>
              <motion.div animate={{ borderColor: descFocused ? "rgba(59,130,246,0.45)" : "rgba(31,41,55,1)", boxShadow: descFocused ? "0 0 0 3px rgba(59,130,246,0.08)" : "none" }}
                className="px-4 py-3 rounded-xl border bg-white/[0.03]">
                <textarea value={desc} onChange={(e) => setDesc(e.target.value)}
                  onFocus={() => setDescFocused(true)} onBlur={() => setDescFocused(false)}
                  placeholder="What's in this collection?" rows={2}
                  className="w-full bg-transparent text-white text-sm placeholder-gray-600 outline-none resize-none" />
              </motion.div>
            </div>

            <div>
              <label className="block text-[10px] text-gray-600 font-semibold uppercase tracking-widest mb-2">Color</label>
              <div className="flex items-center gap-2">
                {colorOptions.map((c, i) => (
                  <motion.button key={i} whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }} onClick={() => setSelectedColor(i)}
                    className={`w-7 h-7 rounded-xl bg-gradient-to-br ${c.gradient} relative transition-all`}>
                    {selectedColor === i && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute inset-0 flex items-center justify-center">
                        <FiCheck className="text-white text-xs" />
                      </motion.div>
                    )}
                  </motion.button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[10px] text-gray-600 font-semibold uppercase tracking-widest mb-2">Privacy</label>
              <div className="grid grid-cols-3 gap-2">
                {privacyOptions.map((p) => (
                  <motion.button key={p.value} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => setPrivacy(p.value)}
                    className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border text-xs transition-all duration-200 ${
                      privacy === p.value ? "bg-blue-500/10 border-blue-500/30 text-blue-300" : "border-[#1F2937] bg-white/[0.02] text-gray-500 hover:border-white/10 hover:text-gray-300"
                    }`}>
                    {p.icon}
                    <span className="font-medium">{p.label}</span>
                    <span className="text-[9px] text-gray-600">{p.desc}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-white/10 bg-white/[0.04] text-gray-300 text-sm font-medium hover:bg-white/[0.07] transition-all">
              Cancel
            </motion.button>
            <motion.button
            disabled={creating} whileHover={name ? { scale: 1.02, boxShadow: "0 0 25px rgba(59,130,246,0.4)" } : {}} whileTap={name ? { scale: 0.97 } : {}}
onClick={async () => {

  if (creating) return;

  setCreating(true);

  try {

    if (name) {

      await onCreate({
        name,
        desc,
        privacy,
        color:
          colorOptions[selectedColor]
            .gradient
      });

      onClose();

    }

  } finally {

    setCreating(false);

  }

}}              className={`flex-1 py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all ${name ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white" : "bg-white/10 text-gray-600 cursor-not-allowed"}`}>
              <FiPlus /> Create Collection
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Collection Card (Grid / List) ─── */
function CollectionCard({ col, index, view, onToggleStar, onDelete }) {
  const [hovered, setHovered] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const docCount = col.documents?.length || 0;

  if (view === "list") {
    return (
      <motion.div
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: index * 0.06 }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => { setHovered(false); setMenuOpen(false); }}
        className="relative flex items-center gap-4 px-5 py-4 rounded-2xl border border-white/5 bg-[#111827] cursor-pointer transition-all duration-300 group"
        style={{
          borderColor: hovered ? "rgba(59,130,246,0.3)" : "rgba(31,41,55,1)",
          boxShadow: hovered ? `0 0 24px rgba(59,130,246,0.05)` : "none",
        }}
      >
        <motion.div animate={{ scale: hovered ? 1.08 : 1, rotate: hovered ? 5 : 0 }} transition={{ duration: 0.25 }}
          className={`w-10 h-10 rounded-xl bg-gradient-to-br ${col.color || "from-blue-500 to-indigo-600"} flex items-center justify-center text-white text-base shrink-0`}>
          <FiFolder />
        </motion.div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className={`text-sm font-semibold truncate transition-colors ${hovered ? "text-white" : "text-gray-100"}`}>{col.name}</p>
            {col.starred && <FiStar className="text-amber-400 text-xs shrink-0" style={{ fill: "#f59e0b" }} />}
          </div>
          <p className="text-gray-500 text-xs truncate mt-0.5">{col.desc}</p>
        </div>

        <div className="hidden sm:flex items-center gap-4 text-gray-600 text-xs shrink-0">
          <div className="flex items-center gap-1"><FiFileText className="text-[10px]" />{docCount}</div>
          <div className="flex items-center gap-1"><PrivacyIcon type={col.privacy} />{col.privacy}</div>
        </div>

        <div className={`flex items-center gap-1.5 transition-opacity duration-200 ${hovered ? "opacity-100" : "opacity-0"}`}>
          <motion.button whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.9 }}
            onClick={(e) => { e.stopPropagation(); onToggleStar(col._id); }}
            className="w-7 h-7 rounded-lg bg-white/5 border border-white/[0.07] flex items-center justify-center hover:bg-white/10 transition-all">
            <FiStar className={`text-xs ${col.starred ? "text-amber-400" : "text-gray-600"}`} style={{ fill: col.starred ? "#f59e0b" : "none" }} />
          </motion.button>
          <div className="relative">
            <motion.button whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.9 }}
              onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen); }}
              className="w-7 h-7 rounded-lg bg-white/5 border border-white/[0.07] flex items-center justify-center text-gray-600 hover:text-gray-200 hover:bg-white/10 transition-all">
              <FiMoreHorizontal className="text-xs" />
            </motion.button>
            <AnimatePresence>
              {menuOpen && <ContextMenu onClose={() => setMenuOpen(false)} onAction={(action) => {
                if (action === "Delete") onDelete(col._id);
              }} />}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setMenuOpen(false); }}
      className="relative rounded-2xl border border-white/5 bg-[#111827] overflow-hidden cursor-pointer transition-all duration-300"
      style={{
        borderColor: hovered ? "rgba(59,130,246,0.3)" : "rgba(31,41,55,1)",
        boxShadow: hovered ? `0 0 36px rgba(59,130,246,0.06), 0 4px 20px rgba(0,0,0,0.3)` : "0 2px 12px rgba(0,0,0,0.2)",
      }}
    >
      <motion.div animate={{ scaleX: hovered ? 1 : 0, opacity: hovered ? 1 : 0 }} transition={{ duration: 0.3 }}
        className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${col.color || "from-blue-500 to-indigo-600"} origin-left`} />

      <div className={`relative h-20 bg-gradient-to-br ${col.color || "from-blue-500 to-indigo-600"} opacity-15`} />
      <div className="absolute top-4 left-4 flex items-center gap-2">
        <motion.div animate={{ scale: hovered ? 1.1 : 1, rotate: hovered ? 8 : 0 }} transition={{ duration: 0.25 }}
          className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${col.color || "from-blue-500 to-indigo-600"} flex items-center justify-center text-white text-xl shadow-lg`}>
          <FiFolder />
        </motion.div>
      </div>

      <div className="absolute top-3 right-3 flex items-center gap-1.5">
        <motion.button whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}
          onClick={(e) => { e.stopPropagation(); onToggleStar(col._id); }}
          className="w-7 h-7 rounded-xl bg-black/30 backdrop-blur-sm flex items-center justify-center transition-all">
          <FiStar className={`text-xs ${col.starred ? "text-amber-400" : "text-white/50"}`} style={{ fill: col.starred ? "#f59e0b" : "none" }} />
        </motion.button>
        <div className="relative">
          <motion.button whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}
            onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen); }}
            className="w-7 h-7 rounded-xl bg-black/30 backdrop-blur-sm flex items-center justify-center text-white/50 hover:text-white transition-colors">
            <FiMoreHorizontal className="text-xs" />
          </motion.button>
          <AnimatePresence>
            {menuOpen && <ContextMenu onClose={() => setMenuOpen(false)} onAction={(action) => {
                if (action === "Delete") onDelete(col._id);
            }} />}
          </AnimatePresence>
        </div>
      </div>

      <div className="relative z-10 p-4 pt-3">
        <div className="flex items-start justify-between gap-2 mb-1">
          <p className={`font-semibold text-sm transition-colors ${hovered ? "text-white" : "text-gray-100"}`}>{col.name}</p>
        </div>
        <p className="text-gray-500 text-[11px] leading-relaxed mb-4 line-clamp-2">
          {col.desc || "No description provided."}
        </p>

        <div className="flex items-center justify-between pt-3 border-t border-white/[0.05]">
          <div className="flex items-center gap-3 text-gray-600 text-[10px]">
            <div className="flex items-center gap-1"><FiFileText className="text-[9px]" />{docCount} files</div>
            <div className="flex items-center gap-1"><PrivacyIcon type={col.privacy} />{col.privacy}</div>
          </div>
          <motion.div animate={{ opacity: hovered ? 1 : 0.4 }} className="flex items-center gap-1 text-[10px] font-medium text-blue-400">
            View <FiArrowRight className="text-[9px] mt-0.5" />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Empty State ─── */
function EmptyCollectionState({ onCreate }) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-24 rounded-3xl border border-dashed border-[#1F2937] col-span-full">
      <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 text-2xl mb-5">
        <FiFolder />
      </motion.div>
      <h3 className="text-white font-semibold text-base mb-2">No collections yet</h3>
      <p className="text-gray-500 text-sm mb-6 text-center max-w-xs">Create your first collection to group and organize your documents.</p>
      <motion.button whileHover={{ scale: 1.05, boxShadow: "0 0 22px rgba(59,130,246,0.35)" }} whileTap={{ scale: 0.97 }}
        onClick={onCreate}
        className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm font-semibold">
        <FiPlus /> Create Collection
      </motion.button>
    </motion.div>
  );
}

/* ─── Main Page ─── */
export default function Collections() {
 const [collections, setCollections] = useState([]);
const [loading, setLoading] = useState(true);
const [view, setView] = useState("grid");
const [searchQuery, setSearchQuery] = useState("");
const [searchFocused, setSearchFocused] =
 useState(false);

const isSearching =
 searchQuery.trim() !== "";
  const [showModal, setShowModal] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");

  const filterOptions = ["All", "Starred", "Private", "Team", "Public"];

 const fetchCollectionsData =
  useCallback(async () => {
    try {

      setLoading(true);

      const data =
        await getCollections();

      setCollections(
        data.collections || []
      );

    } catch (error) {

      console.error(error);

      toast.error(
        "Failed to load collections"
      );

    } finally {

      setLoading(false);

    }
  }, []);

 useEffect(() => {
  fetchCollectionsData();
}, [fetchCollectionsData]);

  const handleCreate = async ({ name, desc, privacy, color }) => {
    if (!name.trim()) {
  toast.error(
    "Collection name required"
  );
  return;
}
if (
 name.trim().length < 2
) {
 toast.error(
  "Minimum 2 characters required"
 );
 return;
}
if (
 name.trim().length > 50
){
  toast.error(
    "Maximum 50 characters allowed"
  );
   return;
}
  if (
 desc.length > 300
) {
 toast.error(
  "Description too long"
 );
 return;
}
 
    try {
     const response =
  await createCollection({
    name,
    desc,
    privacy,
    color,
  });

setCollections(prev => [
  response.collection,
  ...prev,
]);

toast.success(
  "Collection created!"
);
    } catch (error) {

 console.error(error);

 toast.error(
  "Failed to create collection"
 );

}
  };

  const handleDelete = async (id) => {
    try {
      if (
 !window.confirm(
  "Delete this collection?"
 )
) {
 return;
}

await deleteCollection(id);

setCollections(prev =>
  prev.filter(
    col => col._id !== id
  )
);

toast.success(
  "Collection deleted"
);
    } catch (error) {

 console.error(error);

 toast.error(
  "Failed to delete collection"
 );

}
  };

  const handleToggleStar = async (id) => {
    try {
      await toggleStarCollection(id);

setCollections(prev =>
 prev.map(col =>
  col._id === id
   ? {
      ...col,
      starred: !col.starred,
     }
   : col
 )
);
    } catch (error) {

 console.error(error);

 toast.error(
  "Failed to update status"
 );

}
  };

  const filtered = collections.filter((c) => {
    const matchSearch = !searchQuery ||(c.name || "")
.toLowerCase()
.includes(
 searchQuery
  .trim()
  .toLowerCase()
);
    const matchFilter = activeFilter === "All" ? true
      : activeFilter === "Starred" ? c.starred
      : c.privacy === activeFilter.toLowerCase();
    return matchSearch && matchFilter;
  });

  return (
    <div className="min-h-screen bg-[#0B0F19]" style={{ fontFamily: "'Poppins', sans-serif" }}>

      {/* Ambient Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/3 w-[500px] h-[300px] rounded-full blur-[120px]" style={{ background: "rgba(59,130,246,0.08)" }} />
        <div className="absolute bottom-0 right-1/4 w-[450px] h-[300px] rounded-full blur-[120px]" style={{ background: "rgba(139,92,246,0.06)" }} />
        <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-10">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <FiFolder className="text-base" />
              </div>
              <h1 className="text-white font-bold text-xl tracking-tight">Collections</h1>
              <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/[0.08] text-gray-400 text-[11px]">{collections.length}</span>
            </div>
            <p className="text-gray-500 text-sm ml-12">Organize your documents into smart collections</p>
          </div>
          <motion.button whileHover={{ scale: 1.04, boxShadow: "0 0 24px rgba(59,130,246,0.4)" }} whileTap={{ scale: 0.97 }}
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm font-semibold relative overflow-hidden shrink-0">
            <FiPlus className="relative z-10" />
            <span className="relative z-10">New Collection</span>
          </motion.button>
        </motion.div>

        {/* Toolbar */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-2 overflow-x-auto pb-0.5" style={{ scrollbarWidth: "none" }}>
            {filterOptions.map((f) => (
              <motion.button key={f} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} onClick={() => setActiveFilter(f)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all shrink-0 ${
                  activeFilter === f ? "bg-blue-500/15 border border-blue-500/25 text-blue-300" : "text-gray-500 hover:text-gray-300 border border-transparent hover:border-white/[0.07] hover:bg-white/[0.04]"
                }`}>
                {f}
              </motion.button>
            ))}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <motion.div animate={{ borderColor: searchFocused ? "rgba(59,130,246,0.4)" : "rgba(31,41,55,1)" }}
              className="flex items-center gap-2 px-3 py-2 rounded-xl border bg-white/[0.03]">
              <FiSearch className={`text-xs transition-colors ${searchFocused ? "text-blue-400" : "text-gray-600"}`} />
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)} onBlur={() => setSearchFocused(false)}
                placeholder="Search collections…" className="bg-transparent text-white text-xs placeholder-gray-700 outline-none w-32" />
            </motion.div>

            <div className="flex items-center gap-0.5 p-1 rounded-xl border border-[#1F2937] bg-white/[0.02]">
              {[{ icon: <FiGrid />, val: "grid" }, { icon: <FiList />, val: "list" }].map(({ icon, val }) => (
                <motion.button key={val} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setView(val)}
                  className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs transition-all ${view === val ? "bg-blue-500/15 border border-blue-500/20 text-blue-400" : "text-gray-600 hover:text-gray-300"}`}>
                  {icon}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Grid / List */}
        {loading ? (
          <div className="flex items-center justify-center py-20 text-gray-500">Loading collections...</div>
        ) : (
          <AnimatePresence mode="wait">
            {view === "grid" ? (
              <motion.div key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filtered.length > 0
                  ? filtered.map((col, i) => <CollectionCard key={col._id} col={col} index={i} view="grid" onToggleStar={handleToggleStar} onDelete={handleDelete} />)
                 : isSearching ? (
    <div className="col-span-full text-center py-20 text-gray-500">
      No matching collections found
    </div>
  ) : (
    <EmptyCollectionState
      onCreate={() =>
        setShowModal(true)
      }
    />
  )}
              </motion.div>
            ) : (
              <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
                {filtered.length > 0
                  ? filtered.map((col, i) => <CollectionCard key={col._id} col={col} index={i} view="list" onToggleStar={handleToggleStar} onDelete={handleDelete} />)
                 : isSearching ? (
    <div className="col-span-full text-center py-20 text-gray-500">
      No matching collections found
    </div>
  ) : (
    <EmptyCollectionState
      onCreate={() =>
        setShowModal(true)
      }
    />
  )}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && <CreateModal onClose={() => setShowModal(false)} onCreate={handleCreate} />}
      </AnimatePresence>
    </div>
  );
}