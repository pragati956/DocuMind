import React, { useState, useRef, useEffect, useContext } from "react";
import {
 useCallback
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNotifications } from "../../context/NotificationContext";
import { useNavigate } from "react-router-dom";
// notification service is used via NotificationContext
import { AuthContext } from "../../context/AuthContext";
import {
  FiSearch,
  FiBell,
  FiMenu,
  FiX,
  FiSettings,
  FiFileText,
  FiZap,
  FiLogOut,
  FiUser,
  FiChevronDown,
  FiStar,
  FiActivity, // ADD THIS
  FiTrash2,   // ADD THIS
  FiFolder,   // ADD THIS
  FiPlus,     // ADD THIS
} from "react-icons/fi";
import { Bug } from "lucide-react";
import {
  searchDocuments
}
  from "../../services/documentService";
import { getActivities } from "../../services/dashboardService"; // ADD THIS

/* ─── Mock Data ─── */
// const notifications = [
//   { id: 1, icon: <FiZap />, color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20", title: "AI summary ready", desc: "Q4 Financial Report summarized", time: "2m ago", unread: true },
//   { id: 2, icon: <FiFileText />, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20", title: "Document uploaded", desc: "Product Roadmap 2025.docx", time: "18m ago", unread: true },
//   { id: 3, icon: <FiStar />, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20", title: "Team shared a file", desc: "Legal NDA — shared by Sarah K.", time: "1h ago", unread: true },
//   { id: 4, icon: <FiCheck />, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", title: "Export complete", desc: "Meeting Notes exported as PDF", time: "3h ago", unread: false },
// ];

// const searchSuggestions = [
//   { icon: <FiFileText />, label: "Q4 Financial Report.pdf", type: "Document" },
//   { icon: <FiZap />, label: "Product Roadmap Summary", type: "AI Summary" },
//   { icon: <FiFileText />, label: "Legal Contract — NDA.pdf", type: "Document" },
//   { icon: <FiClock />, label: "Team Meeting Notes.txt", type: "Recent" },
// ];

/* ─── Search Bar ─── */
function SearchBar() {

  const [results,
    setResults] =
    useState([]);
  const [focused, setFocused] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  useEffect(() => {

    const timer =
      setTimeout(async () => {

        if (!query.trim()) {

          setResults([]);

          return;

        }

        try {
           const data =
    await searchDocuments(query);

          setResults(
 data?.documents || []
);

        } catch (err) {

          console.error(err);

        }

      }, 300);

    return () =>
      clearTimeout(timer);

  }, [query]);
  const ref = useRef(null);

  // const filtered = query.length > 0
  //   ? searchSuggestions.filter((s) => s.label.toLowerCase().includes(query.toLowerCase()))
  //   : searchSuggestions;

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        ref.current?.focus();
        setFocused(true);
      }
      if (e.key === "Escape") {
        ref.current?.blur();
        setFocused(false);
        setQuery("");
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div className="relative flex-1  w-full max-w-md">
      {/* Input */}
      <motion.div
        animate={{
          borderColor: focused ? "rgba(59,130,246,0.5)" : "rgba(31,41,55,1)",
          boxShadow: focused ? "0 0 0 3px rgba(59,130,246,0.08), 0 0 20px rgba(59,130,246,0.1)" : "none",
          backgroundColor: focused ? "rgba(59,130,246,0.04)" : "rgba(255,255,255,0.03)",
        }}
        transition={{ duration: 0.25 }}
        className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl border"
      >
        <input
          onKeyDown={(e) => {

            if (
              e.key === "Enter"
            ) {

              navigate(
                `/dashboard/search?q=${query}`
              );

            }

          }}
          ref={ref}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => { setFocused(false); setQuery(""); }, 150)}
          placeholder="Search documents, summaries…"
          className="flex-1 bg-transparent text-white text-sm placeholder-gray-600 outline-none min-w-0"
        />

        <AnimatePresence>
          {query && focused && (
                <motion.button
                  key="clear"
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.7 }}
                  onClick={() => setQuery("")}
                  className="text-gray-600 hover:text-white transition-colors shrink-0"
                >
                <FiX className="text-xs" />
              </motion.button>
              )}
        </AnimatePresence>
      </motion.div>

      {/* Dropdown */}
      <AnimatePresence>
        {focused && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="absolute top-full left-0 right-0 mt-2 rounded-2xl border border-[#1F2937] overflow-hidden shadow-2xl z-50"
            style={{ background: "rgba(17,24,39,0.97)", backdropFilter: "blur(20px)" }}
          >
            <div className="px-3 pt-3 pb-1">
              <p className="text-[10px] text-gray-600 font-semibold uppercase tracking-widest px-1 mb-2">
                {query ? "Results" : "Recent"}
              </p>
              {query &&
                results.length === 0 && (

                  <div className="p-4 text-center text-gray-500">
                    No documents found
                  </div>

                )}
              {results.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  whileHover={{ backgroundColor: "rgba(59,130,246,0.07)" }}
                  onClick={() => navigate(
                    `/dashboard/documents?id=${item._id}`
                  )}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-colors duration-150"
                >
                  <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/[0.07] flex items-center justify-center text-blue-400 text-sm shrink-0">
                    <FiFileText />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-xs font-medium truncate">{item.title}</p>
                    <p className="text-gray-600 text-[10px]">{item.fileType}</p>
                  </div>
                  <FiChevronDown className="text-gray-700 text-xs rotate-[-90deg] shrink-0" />
                </motion.div>
              ))}
            </div>

            <div className="px-4 py-3 border-t border-[#1F2937] flex items-center justify-between">
              <span className="text-gray-700 text-[10px]">Press Enter to search all</span>
              <div className="flex items-center gap-2">
                {[["↑↓", "navigate"], ["↵", "open"], ["esc", "close"]].map(([key, label]) => (
                  <div key={key} className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/[0.07] text-gray-600 text-[9px] font-mono">{key}</kbd>
                    <span className="text-gray-700 text-[9px]">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Upload Button ─── */
// function UploadButton({ onClick }) {
//   return (
//     <motion.button
//       whileHover={{ scale: 1.04, boxShadow: "0 0 22px rgba(59,130,246,0.4)" }}
//       whileTap={{ scale: 0.97 }}
//       onClick={onClick}
//       className="relative flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm font-semibold overflow-hidden shrink-0"
//     >
//       <motion.div
//         className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12"
//         animate={{ x: ["-100%", "200%"] }}
//         transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 2 }}
//       />
//       <FiPlus className="text-sm relative z-10" />
//       <span className="hidden sm:inline relative z-10">Upload</span>
//     </motion.button>
//   );
// }


/* ─── Activity Menu (Replaces Notification Bell) ─── */
function ActivityMenu() {
  const timeAgo = (date) => {
    const seconds = Math.floor((Date.now() - new Date(date)) / 1000);
    if (seconds < 60) return "Just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const ref = useRef(null);

  const fetchActivities = async () => {
    setLoading(true);
    try {
      const data = await getActivities();
      setActivities(data.activities || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const getActionDetails = (action) => {
    switch (action) {
      case "uploaded": return { title: "Document Uploaded", icon: <FiFileText /> };
      case "summary": return { title: "Document Summarized", icon: <FiZap /> };
      case "edited": return { title: "Document Updated", icon: <FiSettings /> };
      case "deleted": return { title: "Document Deleted", icon: <FiX /> };
      case "starred": return { title: "Document Starred", icon: <FiStar /> };
      case "created_collection": return { title: "Collection Created", icon: <FiFolder /> };
      case "deleted_collection": return { title: "Collection Deleted", icon: <FiTrash2 /> };
      case "added_to_collection": return { title: "Added to Collection", icon: <FiPlus /> };
      case "collection_summarized": return { title: "Collection Summarized", icon: <FiZap /> };
      case "collection_starred": return { title: "Collection Starred", icon: <FiStar /> };
      case "bug_reported": return { title: "Bug Reported", icon: <Bug className="h-4 w-4 text-red-400" /> };
      default: return { title: "New Activity", icon: <FiActivity /> };
    }
  };

  return (
    <div className="relative" ref={ref}>
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        onClick={() => {
          if (!open) fetchActivities();
          setOpen(prev => !prev);
        }}
        className="relative w-9 h-9 rounded-xl bg-white/[0.04] border border-[#1F2937] flex items-center justify-center text-gray-400 hover:text-white hover:border-white/10 hover:bg-white/[0.07] transition-all duration-200"
      >
        <FiActivity className="text-base" />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.96 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-0 top-full mt-2 w-[320px] max-w-[92vw] rounded-2xl border border-[#1F2937] shadow-2xl z-50 overflow-hidden"
            style={{ background: "rgba(17,24,39,0.97)", backdropFilter: "blur(20px)" }}
          >
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-[#1F2937]">
              <h3 className="text-white text-sm font-semibold">Activity Feed</h3>
            </div>

            <div className="max-h-72 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
              {loading ? (
                <div className="p-6 text-center text-gray-500 text-sm">Loading activity...</div>
              ) : activities.length === 0 ? (
                <div className="p-6 text-center">
                  <FiActivity className="mx-auto mb-2 text-gray-600 text-xl" />
                  <p className="text-gray-500 text-sm">No activity yet</p>
                </div>
              ) : (
                activities.map((a, i) => {
                  const { title, icon } = getActionDetails(a.action);
                  return (
                    <motion.div
                      key={a._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-start gap-3 px-4 py-3.5 border-b border-white/[0.02] last:border-0 hover:bg-white/[0.02] transition-colors"
                    >
                      <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/[0.07] flex items-center justify-center text-blue-400 text-sm shrink-0 mt-0.5">
                        {icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-xs font-semibold mb-0.5">{title}</p>
                        <p className="text-gray-500 text-[11px] truncate">{a.documentName}</p>
                      </div>
                      <span className="text-gray-700 text-[10px] shrink-0 mt-0.5">{timeAgo(a.createdAt)}</span>
                    </motion.div>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Profile Dropdown ─── */
function ProfileMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const { user, logout } = useContext(AuthContext);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

 const menuItems = [
  {
    icon: <FiUser />,
    label: "Profile",
    sub: "Manage your account",
  },
];

  const getInitials = (name) => {
    if (!name) return "U";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  return (
    <div className="relative" ref={ref}>
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => setOpen(prev => !prev)}
        className="flex items-center gap-2.5 pl-1 pr-3 py-1 rounded-xl border border-transparent hover:border-white/[0.07] hover:bg-white/[0.04] transition-all duration-200"
      >
        <div className="relative">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-xs font-bold">
            {getInitials(user?.name)}
          </div>
          <motion.span
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#0B0F19]"
          />
        </div>
        <div className="hidden md:block text-left">
          <p className="text-white text-xs font-semibold leading-none truncate max-w-[100px]">{user?.name || "Active User"}</p>
        </div>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          className="hidden md:block"
        >
          <FiChevronDown className="text-gray-600 text-xs" />
        </motion.div>
      </motion.button>
      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.96 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute
right-0
top-full
mt-2
w-[280px]
max-w-[90vw] rounded-2xl border border-[#1F2937] shadow-2xl z-50 overflow-hidden"
            style={{ background: "rgba(17,24,39,0.97)", backdropFilter: "blur(20px)" }}
          >
            {/* Header */}
            <div className="px-4 py-4 border-b border-[#1F2937]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-sm font-bold">
                  {getInitials(user?.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-semibold truncate">{user?.name || "Active User"}</p>
                  <p className="text-gray-500 text-[11px] truncate">{user?.email || "user@example.com"}</p>
                </div>
              </div>
             
            </div>
            {/* Items */}
            <div className="p-2">
              {menuItems.map((item, i) => (
                <motion.button
                  key={i}
                  whileHover={{ backgroundColor: item.highlight ? "rgba(59,130,246,0.08)" : "rgba(255,255,255,0.04)" }}
                onClick={() => {
  if (item.label === "Profile") {
    navigate("/dashboard/settings");
    setOpen(false);
  }
}}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors duration-150 ${item.highlight ? "border border-blue-500/20 bg-blue-500/[0.05]" : ""}`}
                >
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm ${item.highlight ? "bg-blue-500/15 text-blue-400" : "bg-white/5 text-gray-400"}`}>
                    {item.icon}
                  </div>
                  <div>
                    <p className={`text-xs font-medium ${item.highlight ? "text-blue-300" : "text-white"}`}>{item.label}</p>
                    <p className="text-gray-600 text-[10px]">{item.sub}</p>
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Footer */}
            <div className="px-2 pb-2 border-t border-[#1F2937] pt-2">
              <motion.button onClick={handleLogout}
                whileHover={{ backgroundColor: "rgba(239,68,68,0.06)" }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors duration-150 group"
              >
                <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-gray-500 group-hover:bg-red-500/10 group-hover:text-red-400 transition-all text-sm">
                  <FiLogOut />
                </div>
                <span className="text-gray-500 group-hover:text-red-400 text-xs font-medium transition-colors">Sign out</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Main Topbar ─── */
export default function Topbar({ onMobileSidebarToggle }) {
  const { user } =
    useContext(AuthContext);

  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  return (
    <>

      <motion.header
        initial={{ y: -64, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="h-16 border-b border-[#1F2937] flex items-center justify-between px-4 md:px-6 shrink-0 sticky top-0 z-30"
        style={{
          background: "rgba(11,15,25,0.85)",
          backdropFilter: "blur(20px)",
          fontFamily: "'Poppins', sans-serif",
        }}
      >
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent pointer-events-none" />
        {/* ── Left ── */}
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
            onClick={onMobileSidebarToggle}
            className="md:hidden w-9 h-9 rounded-xl bg-white/[0.04] border border-[#1F2937] flex items-center justify-center text-gray-400 hover:text-white hover:border-white/10 transition-all duration-200"
          >
            <FiMenu className="text-base" />
          </motion.button>

          <div className="hidden sm:flex items-center gap-2">
            <span className="text-gray-600 text-sm">DocuMind</span>
            <span className="text-gray-700 text-sm">/</span>
<span
 className="
 text-white
 text-sm
 font-medium
 truncate
 max-w-[180px]
 "
>              {user?.name
                ? `${user.name}'s Workspace`
                : "Workspace"}
            </span>
          </div>

          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            className="md:hidden w-9 h-9 rounded-xl bg-white/[0.04] border border-[#1F2937] flex items-center justify-center text-gray-400 hover:text-white hover:border-white/10 transition-all duration-200"
          >
            <FiSearch className="text-base" />
          </motion.button>
        </div>

        {/* ── Center: Search (desktop) ── */}
        <div className="hidden md:flex flex-1 justify-center px-8 max-w-xl mx-auto">
          <SearchBar />
        </div>

        {/* ── Right ── */}
        <div className="flex items-center gap-2">
          <ActivityMenu />
          <div className="w-px h-6 bg-[#1F2937] mx-1" />
          <ProfileMenu />
        </div>
      </motion.header>

      {/* Mobile Search Expand */}
      <AnimatePresence>
        {mobileSearchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden border-b border-[#1F2937] overflow-hidden"
            style={{ background: "rgba(11,15,25,0.95)", backdropFilter: "blur(20px)" }}
          >
            <div className="px-4 py-3">
              <SearchBar />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Since Topbar triggers Upload, we keep a simplified Upload Modal fallback here */}
      <AnimatePresence>
        {/* If you need upload from topbar to function across all routes, consider lifting this modal to DashboardLayout */}
      </AnimatePresence>
    </>
  );
}