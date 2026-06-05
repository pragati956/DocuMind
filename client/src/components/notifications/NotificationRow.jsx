import React from "react";
import { FiFileText, FiZap, FiSettings, FiX, FiBell } from "react-icons/fi";

export default function NotificationRow({
 n,
 onOpen,
 onMarkRead,
 onDelete
})
{
 
    return (
        <div className={`flex items-start gap-3 px-4 py-3.5 rounded-2xl border border-[#1F2937] bg-[#0b1117] relative ${!n.isRead ? "bg-blue-500/[0.03]" : ""}`}>
            {!n.isRead && <div className="absolute left-3 top-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-blue-400" />}
            <div className={`w-10 h-10 rounded-xl bg-white/5 border border-white/[0.06] flex items-center justify-center text-blue-400 text-sm shrink-0`}>
                {n.action === "uploaded" ? <FiFileText /> : n.action === "summary" ? <FiZap /> : n.action === "edited" ? <FiSettings /> : n.action === "deleted" ? <FiX /> : <FiBell />}
            </div>

            <div className="flex-1 min-w-0" onClick={() => onOpen(n)}>
                <p className="text-white text-sm font-semibold mb-0.5">{n.action === "uploaded" ? "Document Uploaded" : n.action === "summary" ? "AI Summary Ready" : n.action}</p>
                <p className="text-gray-500 text-[13px] truncate">{n.documentName}</p>
            </div>

            <div className="flex items-center gap-2">
                {!n.isRead && (
                    <button onClick={() => onMarkRead(n._id)} className="text-xs px-2 py-1 rounded-lg bg-white/5 text-gray-200">Mark read</button>
                )}
                <button onClick={() => onDelete(n._id)} className="text-xs px-2 py-1 rounded-lg bg-white/5 text-red-400">Delete</button>
            </div>
        </div>
    );
}

