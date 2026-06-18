import React, { useMemo } from "react";

// We will implement a small FilterPill locally to avoid adding another file dependency
export function LocalFilterPill({ label, active, count, onClick }) {
    return (
        <button
            onClick={onClick}
            className={`relative flex items-center gap-2 px-4 py-2  whitespace-nowrap rounded-xl text-xs font-semibold transition-all duration-200 shrink-0 ${active ? "bg-white/10 border border-white/20 text-white" : "border border-transparent text-gray-500 hover:text-gray-300 hover:bg-white/[0.04]"}`}>
            {label}
            {count > 0 && (
                <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold leading-none ${active ? "bg-blue-500 text-white" : "bg-white/10 text-gray-400"}`}>
                    {count}
                </span>
            )}
        </button>
    );
}

export default function NotificationFilters({ notifications, activeFilter, setActiveFilter }) {
    const counts = useMemo(() => {
        const map = { All: notifications.length };
      notifications.forEach((n) => {
  const action = n?.action || "Unknown";

  map[action] =
    (map[action] || 0) + 1;
});
        return map;
    }, [notifications]);

const filters = [
  "All",
  ...Array.from(
    new Set(
      notifications
        .map((n) => n?.action)
        .filter(Boolean)
    )
  ),
];
    return (
        <div className="
flex
items-center
gap-1.5
mb-6

overflow-x-auto
overflow-y-hidden

pb-1
-px-1

scroll-smooth

whitespace-nowrap
" style={{ scrollbarWidth: "none" }}>
            {filters.map((f) => (
                <LocalFilterPill key={f} label={f} active={activeFilter === f} count={counts[f] || 0} onClick={() => setActiveFilter(f)} />
            ))}
        </div>
    );
}
