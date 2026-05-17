import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FiTwitter,
  FiGithub,
  FiLinkedin,
  FiYoutube,
  FiArrowRight,
  FiMail,
  FiCpu,
} from "react-icons/fi";

/* ─── Data ─── */
const links = {
  Product: [
    "AI Summary",
    "OCR Extraction",
    "Smart Search",
    "File Sharing",
    "Cloud Storage",
    "Workflow Automation",
  ],
  Resources: [
    "Documentation",
    "API Reference",
    "Changelog",
    "Status Page",
    "Blog",
    "Tutorials",
  ],
  Company: [
    "About Us",
    "Careers",
    "Press Kit",
    "Privacy Policy",
    "Terms of Service",
    "Contact",
  ],
};

const socials = [
  { icon: <FiTwitter />, label: "Twitter", href: "#", color: "hover:text-sky-400 hover:border-sky-400/30 hover:bg-sky-400/5" },
  { icon: <FiGithub />, label: "GitHub", href: "#", color: "hover:text-white hover:border-white/20 hover:bg-white/5" },
  { icon: <FiLinkedin />, label: "LinkedIn", href: "#", color: "hover:text-blue-400 hover:border-blue-400/30 hover:bg-blue-400/5" },
  { icon: <FiYoutube />, label: "YouTube", href: "#", color: "hover:text-rose-400 hover:border-rose-400/30 hover:bg-rose-400/5" },
];

/* ─── Newsletter Input ─── */
function Newsletter() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = () => {
    if (email.trim()) { setSent(true); setEmail(""); }
  };

  return (
    <div className="mb-12 pb-12 border-b border-white/[0.06]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div>
          <h3 className="text-white font-semibold text-lg mb-1">
            Stay in the loop
          </h3>
          <p className="text-gray-500 text-sm">
            Product updates, AI news, and zero spam. Unsubscribe anytime.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {sent ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm font-medium"
            >
              <motion.span
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-2 h-2 rounded-full bg-emerald-400 inline-block"
              />
              You're subscribed!
            </motion.div>
          ) : (
            <>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  placeholder="you@company.com"
                  className="pl-9 pr-4 py-3 w-64 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-cyan-500/40 focus:bg-white/[0.07] transition-all duration-300"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.04, boxShadow: "0 0 25px rgba(34,211,238,0.3)" }}
                whileTap={{ scale: 0.97 }}
                onClick={handleSubmit}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 text-white text-sm font-semibold shrink-0"
              >
                Subscribe
                <motion.span
                  animate={{ x: [0, 3, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <FiArrowRight />
                </motion.span>
              </motion.button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Link Column ─── */
function LinkColumn({ title, items, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      viewport={{ once: true }}
    >
      <h4 className="text-white text-xs font-semibold tracking-widest uppercase mb-5">
        {title}
      </h4>
      <ul className="space-y-3">
        {items.map((item, i) => (
          <li key={i}>
            <motion.a
              href="#"
              whileHover={{ x: 4 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className="group flex items-center gap-1.5 text-gray-500 hover:text-white text-sm transition-colors duration-300"
            >
              <span>{item}</span>
              <FiArrowRight className="opacity-0 group-hover:opacity-100 text-xs text-cyan-400 transition-all duration-200 -translate-x-1 group-hover:translate-x-0" />
            </motion.a>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

/* ─── Main Footer ─── */
export default function Footer() {
  return (
    <footer
      className="relative bg-[#0B0F19] overflow-hidden"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');`}</style>

      {/* Top glow border */}
      <div className="relative h-px w-full">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-400/40 to-transparent blur-sm"
        />
      </div>

      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ opacity: [0.04, 0.09, 0.04] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-cyan-500 blur-[140px] rounded-full"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-8">

        {/* Newsletter */}
        <Newsletter />

        {/* Main grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10 mb-14">

          {/* Brand column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="col-span-2 md:col-span-4 lg:col-span-2"
          >
            {/* Logo */}
            <div className="flex items-center gap-2.5 mb-5">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.45)]"
              >
                <FiCpu className="text-white text-base" />
              </motion.div>
              <span className="text-white text-xl font-semibold tracking-tight">DocuMind</span>
            </div>

            <p className="text-gray-500 text-sm leading-relaxed max-w-xs mb-7">
              The AI-powered document platform that helps teams process, search,
              and automate faster than ever before.
            </p>

            {/* Socials */}
            <div className="flex items-center gap-2">
              {socials.map(({ icon, label, href, color }, i) => (
                <motion.a
                  key={i}
                  href={href}
                  aria-label={label}
                  whileHover={{ scale: 1.15, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-9 h-9 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-gray-500 text-base transition-all duration-300 ${color}`}
                >
                  {icon}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Link columns */}
          {Object.entries(links).map(([title, items], i) => (
            <LinkColumn key={title} title={title} items={items} delay={i * 0.08} />
          ))}
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4">

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-gray-600 text-xs"
          >
            © {new Date().getFullYear()} DocuMind, Inc. All rights reserved.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/[0.06] bg-white/[0.03]"
          >
            <motion.span
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full bg-emerald-400"
            />
            <span className="text-gray-600 text-xs">All systems operational</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex items-center gap-4"
          >
            {["Privacy", "Terms", "Cookies"].map((item, i) => (
              <a
                key={i}
                href="#"
                className="text-gray-600 hover:text-gray-300 text-xs transition-colors duration-300"
              >
                {item}
              </a>
            ))}
          </motion.div>
        </div>
      </div>
    </footer>
  );
}