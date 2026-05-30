import React, {
  useState,
  useRef,
  useEffect,
} from "react";

import {
  getActivities,
} from "../../services/dashboardService";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  FiUpload, FiShare2, FiSearch, FiZap, FiDownload,
  FiTrash2, FiEye, FiEdit3, FiUsers, FiStar,
  FiActivity, FiFilter, FiCheck, FiMoreHorizontal,
  FiClock, FiChevronDown, FiRefreshCw, FiFolder,
} from "react-icons/fi";

/* ─── Activity Data ─── */


const actionFilters = ["All", "Uploads", "AI", "Shared", "Searches"];

/* ─── Avatar ─── */
function Avatar({ user, size = "sm" }) {
  const sz = size === "sm" ? "w-7 h-7 text-[10px]" : "w-8 h-8 text-xs";
  if (user.name === "AI") {
    return (
      <motion.div
        animate={{ boxShadow: ["0 0 0px rgba(139,92,246,0.3)", "0 0 12px rgba(139,92,246,0.6)", "0 0 0px rgba(139,92,246,0.3)"] }}
        transition={{ duration: 2, repeat: Infinity }}
        className={`${sz} rounded-xl bg-gradient-to-br ${user.color} flex items-center justify-center shrink-0`}
      >
        <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }}>
          <FiZap className="text-white text-[10px]" />
        </motion.div>
      </motion.div>
    );
  }
  return (
    <div className={`${sz} rounded-xl bg-gradient-to-br ${user.color} flex items-center justify-center text-white font-bold shrink-0`}>
      {user.initials}
    </div>
  );
}

/* ─── Timeline Connector ─── */
function TimelineConnector({ color, isLast }) {
  if (isLast) return <div className="w-px" />;
  return (
    <div className="flex flex-col items-center" style={{ width: 1 }}>
      <motion.div
        initial={{ height: 0 }}
        animate={{ height: "100%" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-px flex-1 min-h-[24px]"
        style={{ background: `linear-gradient(to bottom, ${color}60, rgba(31,41,55,0.5))` }}
      />
    </div>
  );
}

/* ─── Activity Item ─── */
function ActivityItem({ item, index, isLast }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-20px" });
  const [hovered, setHovered] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <AnimatePresence>
      {!dismissed && (
        <motion.div
          ref={ref}
          initial={{ opacity: 0, x: -16, scale: 0.98 }}
          animate={inView ? { opacity: 1, x: 0, scale: 1 } : {}}
          exit={{ opacity: 0, x: 20, height: 0, marginBottom: 0 }}
          transition={{ duration: 0.45, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
          className="flex gap-3 group"
        >
          {/* Timeline column */}
          <div className="flex flex-col items-center gap-1 pt-1 shrink-0" style={{ width: 28 }}>
            <Avatar user={item.user} size="sm" />
            {!isLast && (
              <motion.div
                initial={{ scaleY: 0 }}
                animate={inView ? { scaleY: 1 } : {}}
                transition={{ duration: 0.5, delay: index * 0.07 + 0.2 }}
                className="w-px flex-1 min-h-[20px] origin-top"
                style={{ background: `linear-gradient(to bottom, ${item.accentColor}50, rgba(31,41,55,0.3))` }}
              />
            )}
          </div>

          {/* Card */}
          <motion.div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => { setHovered(false); setMenuOpen(false); }}
            animate={{
              borderColor: hovered ? item.accentBorder : "rgba(31,41,55,0.8)",
              backgroundColor: hovered ? item.accentDim : "rgba(17,24,39,0.5)",
              boxShadow: hovered ? `0 0 24px ${item.accentDim}, 0 2px 12px rgba(0,0,0,0.2)` : "none",
            }}
            transition={{ duration: 0.25 }}
            className={`relative flex-1 rounded-2xl border mb-3 overflow-hidden cursor-pointer transition-all duration-200`}
          >
            {/* Top accent line */}
            <motion.div
              animate={{ scaleX: hovered ? 1 : 0, opacity: hovered ? 1 : 0 }}
              transition={{ duration: 0.25 }}
              className="absolute top-0 left-0 right-0 h-px origin-left"
              style={{ background: `linear-gradient(to right, ${item.accentColor}, transparent)` }}
            />

            <div className="p-3.5">
              <div className="flex items-start justify-between gap-2">
                {/* Left: icon + content */}
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  {/* Action icon */}
                  <motion.div
                    animate={{ scale: hovered ? 1.1 : 1, rotate: hovered ? 5 : 0 }}
                    transition={{ duration: 0.2 }}
                    className={`w-8 h-8 rounded-xl border flex items-center justify-center text-sm shrink-0 ${item.iconBg} ${item.iconColor}`}
                  >
                    {item.icon}
                  </motion.div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <span className="text-white text-xs font-semibold">{item.user.name}</span>
                      <span className="text-gray-500 text-xs">{item.action}</span>
                      {item.badge && (
                        <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold border ${item.badgeBg}`}>
                          {item.badge}
                        </span>
                      )}
                    </div>

                    <p className={`text-xs font-medium truncate transition-colors duration-200 ${hovered ? "text-white" : "text-gray-300"}`}>
                      {item.target}
                    </p>

                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-gray-600 text-[10px]">{item.meta}</span>
                    </div>
                  </div>
                </div>

                {/* Right: time + actions */}
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <div className="flex items-center gap-1 text-gray-600 text-[10px]">
                    <FiClock className="text-[9px]" />
                    <span>{item.timeShort} ago</span>
                  </div>

                  {/* Context menu */}
                  <div className="relative">
                    <motion.button
                      animate={{ opacity: hovered ? 1 : 0 }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen); }}
                      className="w-6 h-6 rounded-lg bg-white/5 border border-white/[0.07] flex items-center justify-center text-gray-500 hover:text-gray-200 transition-all"
                    >
                      <FiMoreHorizontal className="text-[10px]" />
                    </motion.button>

                    <AnimatePresence>
                      {menuOpen && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9, y: -4 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ duration: 0.15 }}
                          onClick={(e) => e.stopPropagation()}
                          className="absolute right-0 top-full mt-1 w-36 rounded-xl border border-[#1F2937] overflow-hidden shadow-xl z-20"
                          style={{ background: "rgba(17,24,39,0.98)", backdropFilter: "blur(16px)" }}
                        >
                          {[
                            { icon: <FiEye />, label: "View" },
                            { icon: <FiShare2 />, label: "Share" },
                            { icon: <FiTrash2 />, label: "Dismiss", danger: true },
                          ].map((m, i) => (
                            <motion.button
                              key={i}
                              whileHover={{ backgroundColor: m.danger ? "rgba(239,68,68,0.07)" : "rgba(255,255,255,0.04)" }}
                              onClick={() => { if (m.label === "Dismiss") setDismissed(true); setMenuOpen(false); }}
                              className={`w-full flex items-center gap-2.5 px-3 py-2 text-[11px] transition-colors ${m.danger ? "text-red-400" : "text-gray-300"} ${i > 0 ? "border-t border-white/[0.04]" : ""}`}
                            >
                              <span className={m.danger ? "text-red-400" : "text-gray-500"}>{m.icon}</span>
                              {m.label}
                            </motion.button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              {/* Type pill */}
              <motion.div
                animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 4 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-2 mt-2.5 pt-2.5 border-t border-white/[0.04]"
              >
                <span
                  className={`px-2 py-0.5 rounded-full text-[9px] font-semibold border ${item.accentText}`}
                  style={{ background: item.accentDim, borderColor: item.accentBorder }}
                >
                  {item.targetType}
                </span>
                <span className="text-gray-700 text-[10px]">{item.time}</span>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─── Group Label ─── */
function GroupLabel({ label }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center gap-2 mb-3 ml-10"
    >
      <span className="text-gray-600 text-[10px] font-semibold uppercase tracking-widest">{label}</span>
      <div className="flex-1 h-px bg-[#1F2937]" />
    </motion.div>
  );
}

/* ─── Live Indicator ─── */
function LiveIndicator() {
  return (
    <div className="flex items-center gap-1.5">
      <motion.span
        animate={{ scale: [1, 1.5, 1], opacity: [1, 0.4, 1] }}
        transition={{ duration: 1.6, repeat: Infinity }}
        className="w-1.5 h-1.5 rounded-full bg-emerald-400"
      />
      <span className="text-emerald-300 text-[10px] font-semibold">Live</span>
    </div>
  );
}

/* ─── Main Export ─── */
export default function ActivityFeed() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [showAll, setShowAll] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const filterMap = {
    "All": null,
    "Uploads": "uploaded",
    "AI": "summarized",
    "Shared": "shared",
    "Searches": "searched",
  };
  const [activities, setActivities] =
  useState([]);
  useEffect(() => {

  const fetchActivities =
    async () => {

      try {

        const data =
          await getActivities();

        console.log(
          "Activities:",
          data
        );

        setActivities(
          data.activities || []
        );

      } catch (error) {

        console.error(
          "Activity Error:",
          error
        );

      }
    };

  fetchActivities();

}, []);
const mappedActivities =
  activities.map((activity) => ({

    id: activity._id,

    action: activity.action,

    target:
      activity.documentName,

    time:
      new Date(
        activity.createdAt
      ).toLocaleString(),

    timeShort:
      "now",

    group:
      "today",

    user: {
      name: "You",
      initials: "YU",
      color:
        "from-blue-500 to-indigo-600",
    },

    icon:
      activity.action === "uploaded"
        ? <FiUpload />
        : activity.action === "edited"
        ? <FiEdit3 />
        : <FiTrash2 />,

    iconColor:
      activity.action === "uploaded"
        ? "text-blue-400"
        : activity.action === "edited"
        ? "text-yellow-400"
        : "text-red-400",

    iconBg:
      activity.action === "uploaded"
        ? "bg-blue-500/10 border-blue-500/20"
        : activity.action === "edited"
        ? "bg-yellow-500/10 border-yellow-500/20"
        : "bg-red-500/10 border-red-500/20",

    accentColor:
      activity.action === "uploaded"
        ? "#3b82f6"
        : activity.action === "edited"
        ? "#f59e0b"
        : "#ef4444",

    accentDim:
      "rgba(59,130,246,0.08)",

    accentBorder:
      "rgba(59,130,246,0.18)",

    accentText:
      "text-blue-300",

    badge: null,

    badgeBg: "",

    meta:
      activity.action,

    targetType:
      "Document",

  }));

  const filtered =
mappedActivities.filter((a) => {
    const f = filterMap[activeFilter];
    return !f || a.action === f;
  });

  const visible = showAll ? filtered : filtered.slice(0, 5);
  const todayItems = visible.filter(a => a.group === "today");
  const yesterdayItems = visible.filter(a => a.group === "yesterday");

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1200);
  };

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');`}</style>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-between mb-4"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 text-sm">
            <FiActivity />
          </div>
          <div>
            <h2 className="text-white font-semibold text-sm">Recent Activity</h2>
           <p className="text-gray-600 text-[10px]">
  {mappedActivities.length} events
</p>
          </div>
          <LiveIndicator />
        </div>

        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
            onClick={handleRefresh}
            className="w-7 h-7 rounded-lg bg-white/[0.04] border border-[#1F2937] flex items-center justify-center text-gray-500 hover:text-gray-300 transition-all"
          >
            <motion.div animate={{ rotate: refreshing ? 360 : 0 }} transition={{ duration: 0.7, ease: "easeInOut" }}>
              <FiRefreshCw className="text-xs" />
            </motion.div>
          </motion.button>
          <button className="text-gray-600 hover:text-gray-300 text-xs transition-colors">Clear all</button>
        </div>
      </motion.div>

      {/* Filter chips */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex items-center gap-1.5 mb-5 overflow-x-auto pb-1"
        style={{ scrollbarWidth: "none" }}
      >
        {actionFilters.map((f) => (
          <motion.button
            key={f}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setActiveFilter(f)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all duration-200 shrink-0 ${
              activeFilter === f
                ? "bg-blue-500/15 border border-blue-500/25 text-blue-300"
                : "text-gray-500 hover:text-gray-300 border border-transparent hover:border-white/[0.07] hover:bg-white/[0.04]"
            }`}
          >
            {f}
          </motion.button>
        ))}
      </motion.div>

      {/* Feed */}
      <AnimatePresence mode="popLayout">
        {filtered.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-12 rounded-2xl border border-[#1F2937] bg-[#111827]/50"
          >
            <div className="w-11 h-11 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 text-lg mb-3">
              <FiActivity />
            </div>
            <p className="text-white text-sm font-medium mb-1">No activity yet</p>
            <p className="text-gray-600 text-xs">Actions will appear here in real-time</p>
          </motion.div>
        ) : (
          <div key="feed">
            {/* Today group */}
            {todayItems.length > 0 && (
              <>
                <GroupLabel label="Today" />
                {todayItems.map((item, i) => (
                  <ActivityItem
                    key={item.id}
                    item={item}
                    index={i}
                    isLast={i === todayItems.length - 1 && yesterdayItems.length === 0}
                  />
                ))}
              </>
            )}

            {/* Yesterday group */}
            {yesterdayItems.length > 0 && (
              <>
                <GroupLabel label="Yesterday" />
                {yesterdayItems.map((item, i) => (
                  <ActivityItem
                    key={item.id}
                    item={item}
                    index={todayItems.length + i}
                    isLast={i === yesterdayItems.length - 1}
                  />
                ))}
              </>
            )}
          </div>
        )}
      </AnimatePresence>

      {/* Show more */}
      {filtered.length > 5 && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowAll(!showAll)}
          className="w-full mt-2 py-2.5 rounded-xl border border-[#1F2937] bg-white/[0.02] text-gray-500 hover:text-gray-300 text-xs font-medium flex items-center justify-center gap-1.5 hover:bg-white/[0.04] transition-all duration-200"
        >
          {showAll ? "Show less" : `Show ${filtered.length - 5} more`}
          <motion.div animate={{ rotate: showAll ? 180 : 0 }} transition={{ duration: 0.3 }}>
            <FiChevronDown className="text-[11px]" />
          </motion.div>
        </motion.button>
      )}
    </div>
  );
}