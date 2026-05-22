import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import {
  FiHome, FiFileText, FiSearch, FiZap, FiFolder,
  FiActivity, FiSettings, FiCpu, FiChevronLeft,
  FiPlus, FiHelpCircle, FiLogOut, FiChevronRight,
} from "react-icons/fi";

/* ─── Nav Data ─── */
const navMain = [
  { icon: <FiHome />, label: "Dashboard", badge: null, id: "dashboard" },
  { icon: <FiFileText />, label: "Documents", badge: "1.2k", id: "documents" },
  { icon: <FiSearch />, label: "Smart Search", badge: null, id: "search" },
  { icon: <FiZap />, label: "AI Summaries", badge: "3", id: "summaries" },
  { icon: <FiFolder />, label: "Collections", badge: null, id: "collections" },
  { icon: <FiActivity />, label: "Analytics", badge: null, id: "analytics" },
];

const navBottom = [
  { icon: <FiHelpCircle />, label: "Help & Support", id: "help" },
  { icon: <FiSettings />, label: "Settings", id: "settings" },
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
function NavItem({ item, active, collapsed, onClick }) {
  const [hovered, setHovered] = useState(false);
  const isActive = active === item.id;

  return (
    <div className="relative" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <motion.button
        onClick={() => onClick(item.id)}
        whileTap={{ scale: 0.97 }}
        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 relative group
          ${isActive
            ? "bg-blue-500/12 text-blue-400 border border-blue-500/20"
            : "text-gray-500 hover:text-white hover:bg-white/[0.05] border border-transparent"
          }`}
        style={{ backgroundColor: isActive ? "rgba(59,130,246,0.1)" : undefined }}
      >
        {/* Active indicator */}
        {isActive && (
          <motion.div
            layoutId="activeIndicator"
            className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full bg-blue-400"
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          />
        )}

        {/* Icon */}
        <motion.span
          animate={{ color: isActive ? "#60a5fa" : hovered ? "#ffffff" : "#6b7280" }}
          transition={{ duration: 0.2 }}
          className="text-lg shrink-0 ml-1"
        >
          {item.icon}
        </motion.span>

        {/* Label */}
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -6 }}
              transition={{ duration: 0.18 }}
              className="flex-1 text-left whitespace-nowrap truncate"
            >
              {item.label}
            </motion.span>
          )}
        </AnimatePresence>

        {/* Badge */}
        <AnimatePresence>
          {!collapsed && item.badge && (
            <motion.span
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              className="px-1.5 py-0.5 rounded-full bg-blue-500/15 text-blue-400 text-[10px] font-semibold border border-blue-500/20 shrink-0"
            >
              {item.badge}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Collapsed tooltip */}
      {collapsed && <Tooltip label={item.label} visible={hovered} />}
    </div>
  );
}

/* ─── Storage Bar ─── */
function StorageBar({ collapsed }) {
  return (
    <AnimatePresence>
      {!collapsed && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="overflow-hidden"
        >
          <div className="mx-2 mb-3 p-4 rounded-2xl border border-white/[0.06] bg-white/[0.03]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-400 text-xs font-semibold">Storage</span>
              <span className="text-gray-600 text-[10px]">24.6 / 50 GB</span>
            </div>

            {/* Bar */}
            <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden mb-3">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "49%" }}
                transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"
              />
            </div>

            {/* Usage breakdown */}
            <div className="space-y-1.5">
              {[
                { label: "Documents", pct: 45, color: "bg-blue-500" },
                { label: "Images", pct: 28, color: "bg-purple-500" },
                { label: "Other", pct: 27, color: "bg-slate-500" },
              ].map(({ label, pct, color }, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${color} shrink-0`} />
                  <span className="text-gray-600 text-[10px] flex-1">{label}</span>
                  <span className="text-gray-600 text-[10px]">{pct}%</span>
                </div>
              ))}
            </div>

            {/* Upgrade CTA */}
            <motion.button
              whileHover={{ scale: 1.02, boxShadow: "0 0 16px rgba(59,130,246,0.3)" }}
              whileTap={{ scale: 0.98 }}
              className="mt-4 w-full py-2 rounded-xl bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border border-blue-500/20 text-blue-300 text-xs font-semibold hover:from-blue-500/30 hover:to-indigo-500/30 transition-all duration-200"
            >
              Upgrade Storage
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─── User Card ─── */
function UserCard({ collapsed }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <motion.div
        whileHover={{ backgroundColor: "rgba(255,255,255,0.04)" }}
        className={`flex items-center gap-3 mx-2 mb-3 p-3 rounded-2xl border border-transparent hover:border-white/[0.07] cursor-pointer transition-all duration-200 ${collapsed ? "justify-center" : ""}`}
      >
        <div className="relative shrink-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-xs font-bold">
            AJ
          </div>
          <motion.span
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#0B0F19]"
          />
        </div>

        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -6 }}
              transition={{ duration: 0.18 }}
              className="flex-1 min-w-0"
            >
              <p className="text-white text-xs font-semibold truncate">Alex Johnson</p>
              <p className="text-gray-600 text-[10px] truncate">Pro Plan</p>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {!collapsed && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              whileHover={{ color: "#ef4444" }}
              className="text-gray-600 hover:text-red-400 transition-colors duration-200 shrink-0"
              title="Sign out"
            >
              <FiLogOut className="text-sm" />
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>

      {collapsed && <Tooltip label="Alex Johnson — Pro Plan" visible={hovered} />}
    </div>
  );
}

/* ─── New Document Button ─── */
function NewDocButton({ collapsed }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative px-2 mb-4"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <motion.button
        whileHover={{ scale: 1.03, boxShadow: "0 0 20px rgba(59,130,246,0.3)" }}
        whileTap={{ scale: 0.97 }}
        className={`w-full flex items-center gap-2.5 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm font-semibold shadow-[0_0_14px_rgba(59,130,246,0.25)] transition-all duration-200 ${collapsed ? "justify-center px-0" : "px-4"}`}
      >
        <FiPlus className="text-base shrink-0" />
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -4 }}
              transition={{ duration: 0.15 }}
              className="whitespace-nowrap"
            >
              New Document
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {collapsed && <Tooltip label="New Document" visible={hovered} />}
    </div>
  );
}

/* ─── Section Label ─── */
function SectionLabel({ label, collapsed }) {
  return (
    <AnimatePresence>
      {!collapsed && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="px-4 pb-1.5 text-[10px] font-semibold text-gray-700 uppercase tracking-widest"
        >
          {label}
        </motion.p>
      )}
    </AnimatePresence>
  );
}

/* ─── Main Sidebar ─── */
export default function Sidebar({ defaultCollapsed = false }) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  const [active, setActive] = useState("dashboard");

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');`}</style>

      <motion.aside
        animate={{ width: collapsed ? 72 : 248 }}
        transition={{ duration: 0.38, ease: [0.4, 0, 0.2, 1] }}
        className="relative h-screen flex flex-col overflow-hidden border-r border-[#1F2937] bg-[#0B0F19] shrink-0 select-none"
        style={{ fontFamily: "'Poppins', sans-serif" }}
      >
        {/* Top glow line */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />

        {/* Ambient glow */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500/5 blur-[60px] rounded-full pointer-events-none" />

        {/* ── Logo ── */}
        <div className={`flex items-center gap-3 px-4 py-5 border-b border-[#1F2937] ${collapsed ? "justify-center" : ""}`}>
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="w-9 h-9 rounded-xl shrink-0 bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-[0_0_18px_rgba(59,130,246,0.45)]"
          >
            <FiCpu className="text-white text-base" />
          </motion.div>

          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.2 }}
                className="min-w-0"
              >
                <span className="text-white font-semibold text-lg tracking-tight whitespace-nowrap">DocuMind</span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <motion.span
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-1.5 h-1.5 rounded-full bg-emerald-400"
                  />
                  <span className="text-[10px] text-gray-600 font-medium">AI Ready</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── New Doc button ── */}
        <div className="pt-4">
          <NewDocButton collapsed={collapsed} />
        </div>

        {/* ── Navigation ── */}
        <nav className="flex-1 px-2 overflow-y-auto overflow-x-hidden space-y-0.5 pb-2"
          style={{ scrollbarWidth: "none" }}
        >
          <SectionLabel label="Menu" collapsed={collapsed} />
          {navMain.map((item) => (
            <NavItem
              key={item.id}
              item={item}
              active={active}
              collapsed={collapsed}
              onClick={setActive}
            />
          ))}

          {/* Divider */}
          <div className="my-3 mx-1 h-px bg-[#1F2937]" />

          <SectionLabel label="General" collapsed={collapsed} />
          {navBottom.map((item) => (
            <NavItem
              key={item.id}
              item={item}
              active={active}
              collapsed={collapsed}
              onClick={setActive}
            />
          ))}
        </nav>

        {/* ── Storage ── */}
        <StorageBar collapsed={collapsed} />

        {/* ── User ── */}
        <div className="border-t border-[#1F2937] pt-3">
          <UserCard collapsed={collapsed} />
        </div>

        {/* ── Collapse toggle ── */}
        <motion.button
          whileHover={{ scale: 1.12, backgroundColor: "#374151" }}
          whileTap={{ scale: 0.92 }}
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3.5 top-[72px] w-7 h-7 rounded-full bg-[#1F2937] border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors duration-200 z-30 shadow-lg"
        >
          <motion.div
            animate={{ rotate: collapsed ? 180 : 0 }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
          >
            <FiChevronLeft className="text-xs" />
          </motion.div>
        </motion.button>
      </motion.aside>
    </>
  );
}