import React from "react";
import { motion } from "framer-motion";

export default function NotificationDrawer({ open, notification, onClose }) {
    if (!open || !notification) return null;

   return (
  <>
    {/* Overlay */}
    <div
      className="
      fixed
      inset-0
      bg-black/50
      backdrop-blur-sm
      z-40
      "
      onClick={onClose}
    />

    {/* Drawer */}
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ duration: 0.25 }}
      className="
      fixed
      right-0
      top-0
      h-full
      w-[100vw]
max-w-full
sm:w-[420px]
      bg-[#081019]
      border-l
      border-[#1f2937]
      p-4
      sm:p-6
      z-50
      overflow-y-auto
      "
    >

      <div
        className="
        flex
        flex-col
        sm:flex-row
        sm:items-start
        justify-between
        gap-3
        "
      >
       <div className="min-w-0 flex-1">
         <h3
  className="
  text-white
  text-lg
  font-semibold
  break-words
  "
>
  {notification.action}
</h3>

          <p
            className="
            text-gray-400
            text-sm
              break-all
            "
          >
            {notification.documentName}
          </p>
        </div>

        <button
          onClick={onClose}
          className="
          px-3
          py-2
          rounded-lg
          text-gray-400
          hover:text-white
          hover:bg-white/5
          "
        >
          Close
        </button>
      </div>

      <div className="mt-6 text-sm text-gray-300">

        <div className="mb-3">
          Created:{" "}
          {new Date(notification.time).toLocaleString()}
        </div>

        <div className="mb-3">
          Read: {notification.read ? "Yes" : "No"}
        </div>

        <pre
          className="
          whitespace-pre-wrap
          break-words
          overflow-x-auto
          bg-white/[0.02]
          p-3
          rounded-md
          mt-4
          text-xs
          "
        >
          {JSON.stringify(notification, null, 2)}
        </pre>

      </div>

    </motion.div>
  </>
);
}