import React from "react";

export default function NotificationDrawer({ open, notification, onClose }) {
    if (!open || !notification) return null;

    return (
        <div className="fixed right-0 top-0 h-full w-full md:w-96 bg-[#081019] border-l border-[#1f2937] p-6 z-50">
            <div className="flex items-start justify-between">
                <div>
                    <h3 className="text-white text-lg font-semibold">{notification.action}</h3>
                    <p className="text-gray-400 text-sm">{notification.documentName}</p>
                </div>
                <button onClick={onClose} className="text-gray-400">Close</button>
            </div>

            <div className="mt-6 text-sm text-gray-300">
                <div className="mb-3">Created: {new Date(notification.time).toLocaleString()}</div>
                <div className="mb-3">Read: {notification.read ? "Yes" : "No"}</div>
                <pre className="whitespace-pre-wrap bg-white/[0.02] p-3 rounded-md mt-4 text-xs">{JSON.stringify(notification, null, 2)}</pre>
            </div>
        </div>
    );
}
