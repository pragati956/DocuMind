import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNotifications } from "../../context/NotificationContext";
import {
 FiBell,
 FiRefreshCw,
 FiTrash2,
 FiAlertCircle,
 FiInbox,
 FiCheckCircle
} from "react-icons/fi";
import NotificationRow from "../../components/notifications/NotificationRow";
import NotificationSkeleton from "../../components/notifications/NotificationSkeleton";
import NotificationFilters from "../../components/notifications/NotificationFilters";

/* ─── Helpers ─── */

/* ─── Mock API ─── */

/* ─── Helpers ─── */
// function timeAgo(date) {
//     const diff = Math.floor((Date.now() - date) / 1000);
//     if (diff < 60) return "Just now";
//     if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
//     if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
//     return `${Math.floor(diff / 86400)}d ago`;
// }

function groupByDate(notifications) {
    const groups = {};
    notifications.forEach((n) => {
       const d =
 new Date(n.createdAt);
        const now = new Date();
        let label;
        if (d.toDateString() === now.toDateString()) label = "Today";
        else {
            const yesterday = new Date(now);
            yesterday.setDate(now.getDate() - 1);
            label = d.toDateString() === yesterday.toDateString() ? "Yesterday" : d.toLocaleDateString("en-US", { month: "long", day: "numeric" });
        }
        if (!groups[label]) groups[label] = [];
        groups[label].push(n);
    });
    return groups;
}

// function getIcon(type) {
//     const map = {
//         zap: <FiZap />, upload: <FiUpload />, share: <FiShare2 />,
//         star: <FiStar />, trash: <FiTrash2 />, shield: <FiShield />,
//         info: <FiInfo />, check: <FiCheckCircle />,
//     };
//     return map[type] || <FiBell />;
// }

/* ─── Fake API fetch ─── */




/* ─── Empty State ─── */
function EmptyState({ filter }) {
    return (
        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}
            className="flex flex-col items-center justify-center py-24 rounded-3xl border border-dashed border-[#1F2937]">
            <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 text-2xl mb-5">
                <FiInbox />
            </motion.div>
            <p className="text-white font-semibold text-base mb-2">All caught up!</p>
            <p className="text-gray-500 text-sm text-center max-w-xs">
                {filter === "All" ? "No notifications yet. Activity will appear here in real-time." : `No ${filter.toLowerCase()} notifications at the moment.`}
            </p>
        </motion.div>
    );
}

/* ─── Main Page ─── */
export default function NotificationsPage() {
    const [error, setError] =
        useState(null);
    const { notifications, loading, unreadCount, loadNotifications, markRead, markAll, clearAll, deleteNotification } = useNotifications();
    const [activeFilter, setActiveFilter] = useState("All");
    const [search, setSearch] = useState("");
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selected, setSelected] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
   

  //  const markAllRead =
    // async () => {

    //  try {

    //    await markAllNotificationsRead();

    //    setNotifications(
    //      (prev) =>
    //        prev.map((n) => ({
    //          ...n,
    //          read: true,
    //        }))
    //    );

    //  } catch (error) {

    //    console.error(error);

    //  }

    // };

    const handleOpen = (n) => {
        setSelected(n);
        setDrawerOpen(true);
        if (!n.isRead) markRead(n._id || n.id);
    };

    const handleDelete = async (id) => {
        try {
            await deleteNotification(id);
        } catch (err) {
            console.error(err);
        }
    };

  const handleRefresh = async () => {
  try {

    setError(null);
    setRefreshing(true);

    await loadNotifications();

  } catch (err) {

    setError(
      "Failed to load notifications"
    );

  } finally {

    setRefreshing(false);

  }
};

    /* Filter counts */
    

    const filterCounts = useMemo(() => {
        const m = { All: notifications.length };
        notifications.forEach((n) => { m[n.action] = (m[n.action] || 0) + 1; });
        return m;
    }, [notifications]);

    const filtered = useMemo(() => {
        const byFilter = activeFilter === "All" ? notifications : notifications.filter((n) => n.action === activeFilter);
        if (!search) return byFilter;
        return byFilter.filter((n) => (n.documentName || "").toLowerCase().includes(search.toLowerCase()) || (n.action || "").toLowerCase().includes(search.toLowerCase()));
    }, [notifications, activeFilter, search]);

    const groups = groupByDate(filtered);

    return (
        <div className="min-h-screen bg-[#0B0F19]" style={{ fontFamily: "'Poppins', sans-serif" }}>

            {/* Ambient glows */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <motion.div animate={{ scale: [1, 1.15, 1], opacity: [0.05, 0.1, 0.05] }} transition={{ duration: 10, repeat: Infinity }}
                    className="absolute top-0 left-1/3 w-[600px] h-[400px] bg-blue-600 blur-[140px] rounded-full" />
                <motion.div animate={{ scale: [1, 1.1, 1], opacity: [0.04, 0.08, 0.04] }} transition={{ duration: 13, repeat: Infinity, delay: 3 }}
                    className="absolute bottom-0 right-1/4 w-[500px] h-[400px] bg-purple-600 blur-[140px] rounded-full" />
                <div className="absolute inset-0 opacity-[0.025]"
                    style={{ backgroundImage: "linear-gradient(rgba(100,200,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(100,200,255,1) 1px,transparent 1px)", backgroundSize: "50px 50px" }} />
            </div>

            <div className="relative z-10 max-w-2xl mx-auto px-4 py-10">

                {/* ── Page Header ── */}
                <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                    className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                                <FiBell className="text-lg" />
                            </div>
                            <AnimatePresence>
                                {unreadCount > 0 && (
                                    <motion.span
                                        key={unreadCount}
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        exit={{ scale: 0 }}
                                        transition={{ type: "spring", stiffness: 400 }}
                                        className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-[9px] text-white font-bold border-2 border-[#0B0F19]"
                                    >
                                        {unreadCount > 9 ? "9+" : unreadCount}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </div>
                        <div>
                            <h1 className="text-white font-bold text-xl tracking-tight">Notifications</h1>
                            <p className="text-gray-500 text-xs">
                                {unreadCount > 0 ? `${unreadCount} unread · ` : "All caught up · "}
                                {notifications.length} total
                            </p>
                        </div>
                    </div>

                    {/* Header actions */}
                    <div className="flex items-center gap-2">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleRefresh}
                            className="w-8 h-8 rounded-xl bg-white/[0.04] border border-[#1F2937] flex items-center justify-center text-gray-500 hover:text-white transition-colors"
                        >
                            <motion.div animate={{ rotate: refreshing ? 360 : 0 }} transition={{ duration: 0.7, ease: "easeInOut" }}>
                                <FiRefreshCw className="text-sm" />
                            </motion.div>
                        </motion.button>

                        {unreadCount > 0 && (
                            <motion.button
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                whileHover={{ scale: 1.04 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={markAll}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.05] border border-white/10 text-gray-300 hover:text-white text-xs font-medium hover:bg-white/[0.09] transition-all"
                            >
                                <FiCheckCircle className="text-xs" />
                                Mark all read
                            </motion.button>
                        )}

                        {notifications.length > 0 && (
                            <motion.button
                                whileHover={{ scale: 1.04 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={clearAll}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-red-500/20 bg-red-500/[0.06] text-red-400 text-xs font-medium hover:bg-red-500/10 transition-all"
                            >
                                <FiTrash2 className="text-xs" />
                                Clear all
                            </motion.button>
                        )}
                    </div>
                </motion.div>

                {/* ── Filter Bar ── */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                    <NotificationFilters notifications={notifications} activeFilter={activeFilter} setActiveFilter={setActiveFilter} />
                </motion.div>

                {/* ── Error ── */}
                <AnimatePresence>
                    {error && (
                        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                            className="flex items-center gap-3 px-4 py-3 rounded-2xl border border-red-500/20 bg-red-500/[0.07] mb-5">
                            <FiAlertCircle className="text-red-400 shrink-0" />
                            <p className="text-red-300 text-xs">{error}</p>
                            <motion.button whileHover={{ scale: 1.05 }} onClick={loadNotifications}
                                className="ml-auto text-red-400 hover:text-red-200 text-xs font-semibold transition-colors">
                                Retry
                            </motion.button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ── Content ── */}
                {loading ? (
                    <div className="space-y-3">
                        {Array.from({ length: 5 }).map((_, i) =><NotificationSkeleton
 key={i}
/>)}
                    </div>
                ) : filtered.length === 0 ? (
                    <EmptyState filter={activeFilter} />
                ) : (
                    <div className="space-y-6">
                        {Object.entries(groups).map(([label, items]) => (
                            <div key={label}>
                                {/* Group label */}
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                    className="flex items-center gap-3 mb-3">
                                    <span className="text-gray-600 text-[10px] font-semibold uppercase tracking-widest">{label}</span>
                                    <div className="flex-1 h-px bg-[#1F2937]" />
                                    <span className="text-gray-700 text-[10px]">{items.length}</span>
                                </motion.div>

                                <div className="space-y-2">
                                    <AnimatePresence mode="popLayout">
                                        {items.map((n, i) => (
                                           <NotificationRow
  key={n._id}
  n={n}
  onOpen={handleOpen}
  onMarkRead={markRead}
  onDelete={handleDelete}
/>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* ── Footer summary ── */}
                {!loading && notifications.length > 0 && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                        className="text-center text-gray-700 text-[11px] mt-8">
                        {notifications.filter(n => n.isRead).length} read · {unreadCount} unread · {notifications.length} total
                    </motion.p>
                )}
            </div>
        </div>
    );
}