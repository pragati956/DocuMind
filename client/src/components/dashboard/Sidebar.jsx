import React, {
  useState,
  useContext,
  useEffect
} from "react";
import {
  getDashboardStats
} from "../../services/dashboardService";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import {
  FiHome, FiFileText, FiSearch, FiZap, FiFolder,
  FiActivity, FiSettings, FiCpu, FiChevronLeft,
   FiHelpCircle, FiLogOut
} from "react-icons/fi";
import { Bug } from "lucide-react";

/* ─── Nav Data ─── */
// const navMain = [
//   { icon: <FiHome />, label: "Dashboard", path: "/dashboard" },
//   { icon: <FiFileText />, label: "Documents", badge: "1.2k", path: "/dashboard/documents" },
//   { icon: <FiSearch />, label: "Smart Search", path: "/dashboard/search" },
//   { icon: <FiZap />, label: "AI Summaries", badge: "3", path: "/dashboard/summaries" },
//   { icon: <FiFolder />, label: "Collections", path: "/dashboard/collections" },
//   { icon: <FiActivity />, label: "Analytics", path: "/dashboard/analytics" },
// ];

const navBottom = [
  { icon: <Bug />, label: "Report Bugs", path: "/dashboard/report-bugs" },
  { icon: <FiSettings />, label: "Settings", path: "/dashboard/settings" },
];

/* ─── Tooltip ─── */
function Tooltip({ label, visible }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, x: -6, scale: 0.92 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -6, scale: 0.92 }}
          transition={{ duration: 0.15 }}
          className="absolute left-full ml-3 top-1/2 -translate-y-1/2 z-50 pointer-events-none"
        >
          <div className="px-3 py-1.5 rounded-lg bg-[#1F2937] border border-white/10 text-white text-xs font-medium whitespace-nowrap shadow-xl">
            {label}
            <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-[#1F2937]" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─── Nav Item ─── */
function NavItem({ item, collapsed }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div className="relative" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <NavLink
        to={item.path}
        end={item.path === "/dashboard"} // <--- ADD THIS LINE: Fixes the highlight bug!
        className={({ isActive }) =>
          `w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 relative group border
          ${isActive ? "bg-blue-500/12 text-blue-400 border-blue-500/20" : "text-gray-500 hover:text-white hover:bg-white/[0.05] border-transparent"}`
        }
      >
        {({ isActive }) => (
          <>
            {isActive && (
              <motion.div layoutId="activeIndicator" className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full bg-blue-400" />
            )}
            <span className="text-lg shrink-0 ml-1">{item.icon}</span>
            <AnimatePresence>
              {!collapsed && (
                <motion.span initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -6 }} className="flex-1 text-left whitespace-nowrap truncate">
                  {item.label}
                </motion.span>
              )}
            </AnimatePresence>
            <AnimatePresence>
              {!collapsed && item.badge && (
                <motion.span initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.7 }} className="px-1.5 py-0.5 rounded-full bg-blue-500/15 text-blue-400 text-[10px] font-semibold border border-blue-500/20 shrink-0">
                  {item.badge}
                </motion.span>
              )}
            </AnimatePresence>
          </>
        )}
      </NavLink>
      {collapsed && <Tooltip label={item.label} visible={hovered} />}
    </div>
  );
}

/* ─── Storage Bar ─── */


/* ─── User Card ─── */
function UserCard({ collapsed }) {
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };
  
  return (
    <div className="relative" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <motion.div whileHover={{ backgroundColor: "rgba(255,255,255,0.04)" }} className={`flex items-center gap-3 mx-2 mb-3 p-3 rounded-2xl border border-transparent hover:border-white/[0.07] cursor-pointer transition-all duration-200 ${collapsed ? "justify-center" : ""}`}>
        <div className="relative shrink-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-xs font-bold">
            {getInitials(user?.name)}
          </div>
          <motion.span animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 2, repeat: Infinity }} className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#0B0F19]" />
        </div>

        <AnimatePresence>
          {!collapsed && (
            <motion.div initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -6 }} transition={{ duration: 0.18 }} className="flex-1 min-w-0">
              <p className="text-white text-xs font-semibold truncate">{user?.name || "Active User"}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {!collapsed && (
           <motion.button onClick={handleLogout} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} whileHover={{ color: "#ef4444" }} className="text-gray-600 hover:text-red-400 transition-colors duration-200 shrink-0" title="Sign out">
             <FiLogOut className="text-sm" />
           </motion.button>
          )}
        </AnimatePresence>
      </motion.div>

      {collapsed && (
  <Tooltip
    label={user?.name || "User"}
    visible={hovered}
  />
)}
    </div>
  );
}

/* ─── Section Label ─── */
function SectionLabel({ label, collapsed }) {
  return (
    <AnimatePresence>
      {!collapsed && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="px-4 pb-1.5 text-[10px] font-semibold text-gray-700 uppercase tracking-widest">
          {label}
        </motion.p>
      )}
    </AnimatePresence>
  );
} 


/* ─── Main Sidebar ─── */
export default function Sidebar({ defaultCollapsed = false, mobileOpen,
 setMobileOpen, }) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  const [statsData, setStatsData] =
useState({
  totalDocuments: 0,
  summarizedDocuments: 0,
  totalCollections: 0, // <-- ADD THIS
});

useEffect(() => {

  const fetchStats = async () => {

    try {

      const data =
        await getDashboardStats();

      setStatsData({
        totalDocuments:
          data?.totalDocuments || 0,

        summarizedDocuments:
          data?.summarizedDocuments || 0,

        totalCollections:
          data?.totalCollections || 0,
      });

    } catch (error) {

      console.error(
        "Sidebar stats error:",
        error
      );

    }
  };

  fetchStats();

  const refreshSidebar = () => {
    fetchStats();
  };

  window.addEventListener(
    "documentUploaded",
    refreshSidebar
  );

  const interval =
    setInterval(
      fetchStats,
      30000
    );

  return () => {

    clearInterval(interval);

    window.removeEventListener(
      "documentUploaded",
      refreshSidebar
    );

  };

}, []);
const navMain = [
  {
    icon: <FiHome />,
    label: "Dashboard",
    path: "/dashboard",
  },

  {
    icon: <FiFileText />,
    label: "Documents",
    badge:
      (statsData.totalDocuments || 0).toString(),
    path:
      "/dashboard/documents",
  },

  {
    icon: <FiSearch />,
    label: "Smart Search",
    path:
      "/dashboard/search",
  },

  {
    icon: <FiZap />,
    label: "AI Summaries",
    badge:
      (statsData
        .summarizedDocuments
         || 0).toString(),
    path:
      "/dashboard/summaries",
  },

  {
    icon: <FiFolder />,
    label: "Collections",
    badge: (statsData.totalCollections || 0).toString(), // <-- ADD THIS BADGE
    path:
      "/dashboard/collections",
  },

  {
    icon: <FiActivity />,
    label: "Analytics",
    path:
      "/dashboard/analytics",
  },
];

  return (
    
    <>
    <AnimatePresence>

{mobileOpen && (

<motion.div
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 onClick={() =>
   setMobileOpen(false)
 }
 className="
 fixed
 inset-0
 bg-black/50
 z-40
 md:hidden
 "
/>

)}

</AnimatePresence>
      <motion.aside
        animate={{ width: collapsed ? 72 : 248 }}
        transition={{ duration: 0.38, ease: [0.4, 0, 0.2, 1] }}
className={`
fixed md:relative
top-0 left-0
h-dvh
z-50
flex flex-col
border-r border-[#1F2937]
bg-[#0B0F19]
shrink-0
select-none

transition-transform
duration-300

${
 mobileOpen
 ? "translate-x-0"
 : "-translate-x-full md:translate-x-0"
}
`}        style={{ fontFamily: "'Poppins', sans-serif" }}
      >
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
        <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500/5 blur-[60px] rounded-full pointer-events-none" />

        {/* ── Logo ── */}
        <div className={`flex items-center gap-3 px-4 py-5 border-b border-[#1F2937] ${collapsed ? "justify-center" : ""}`}>
          <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }} className="w-9 h-9 rounded-xl shrink-0 bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-[0_0_18px_rgba(59,130,246,0.45)]">
            <FiCpu className="text-white text-base" />
          </motion.div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }} transition={{ duration: 0.2 }} className="min-w-0">
                <span className="text-white font-semibold text-lg tracking-tight whitespace-nowrap truncate">DocuMind</span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 2, repeat: Infinity }} className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span className="text-[10px] text-gray-600 font-medium">AI Ready</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── New Doc button ── */}
        {/* <div className="pt-4">
         <NewDocButton
  collapsed={collapsed}
  onUpload={onUpload}
/>
        </div> */}

        {/* ── Navigation ── */}
        <nav className="flex-1 px-2 overflow-y-auto overflow-x-hidden space-y-0.5 pb-2" style={{ scrollbarWidth: "none" }}>
          <SectionLabel label="Menu" collapsed={collapsed} />
          {navMain.map((item) => (
           <NavItem key={item.label} item={item} collapsed={collapsed} />
          ))}

          <div className="my-3 mx-1 h-px bg-[#1F2937]" />

          <SectionLabel label="General" collapsed={collapsed} />
          {navBottom.map((item) => (
           <NavItem key={item.label} item={item} collapsed={collapsed} />
          ))}
        </nav>


        {/* ── Collapse toggle ── */}
        {/* ── Collapse toggle ── */}
        <motion.button 
         
          whileHover={{ scale: 1.15, borderColor: "rgba(255,255,255,0.25)", backgroundColor: "#1e1e24" }} 
          whileTap={{ scale: 0.90 }} 
          onClick={() => setCollapsed(!collapsed)} 
          className=" hidden lg:flex absolute -right-[18px] top-[72px] w-9 h-9 rounded-full bg-[#131314] border border-white/[0.15] flex items-center justify-center text-gray-300 hover:text-white transition-all duration-300 z-50 shadow-[0_4px_20px_rgba(0,0,0,0.5),_0_0_15px_rgba(139,92,246,0.15)] cursor-pointer"
        >
          <motion.div 
            animate={{ rotate: collapsed ? 180 : 0 }} 
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            className="flex items-center justify-center"
          >
            <FiChevronLeft className="text-sm stroke-[2.5]" />
          </motion.div>
        </motion.button>
      </motion.aside>
    </>
  );
}