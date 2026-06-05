import React from "react";
import { motion } from "framer-motion";

export default function NotificationSkeleton({ index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: index * 0.06 }}
      className="flex items-start gap-4 px-5 py-4 rounded-2xl border border-[#1F2937] bg-[#111827]/60"
    >
      <div className="w-10 h-10 rounded-xl bg-white/[0.05] shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-3 rounded-full bg-white/[0.07] w-1/3" />
        <div className="h-2.5 rounded-full bg-white/[0.05] w-2/3" />
        <div className="h-2.5 rounded-full bg-white/[0.04] w-1/2" />
      </div>
    </motion.div>
  );
}
