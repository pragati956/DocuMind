import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiGithub, FiLinkedin, FiCpu } from "react-icons/fi";
const socialLinks = [
 {
  href:"https://github.com/pragati956/DocuMind",
  icon: FiGithub,
  label:"GitHub",
 },
 {
  href:"https://linkedin.com/in/sandipan-ray14",
  icon: FiLinkedin,
  label:"LinkedIn",
 },
];
const footerLinks = [
 {
  label:"Home",
  to:"/",
  scrollTop:true
 },
 {
  label:"Login",
  to:"/login"
 },
 {
  label:"Register",
  to:"/register"
 }
];

export default function Footer() {
  return (
    <footer
      className="
relative
overflow-hidden
border-t
bg-[#0B0F19]
border-white/10
"
    >

      {/* Top glow line */}
      <div className="absolute top-0 left-0 right-0 h-px">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-400/40 to-transparent blur-sm"
        />
      </div>

      {/* Ambient glow blob */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ opacity: [0.04, 0.09, 0.04] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[220px] bg-cyan-500 blur-[120px] rounded-full"
        />
      </div>

<div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-10">

          {/* ── Logo + Description ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="max-w-md text-center lg:text-left"
          >
            <div className="flex items-center justify-center lg:justify-start gap-3 mb-4">
              <motion.div
                whileHover={{
 rotate:15
}}
                transition={{
 duration:0.2
}}
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-500 flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.35)]"
              >
                <FiCpu className="text-white text-lg" />
              </motion.div>

<span
 className="
 text-white
 text-2xl
 font-semibold
 tracking-tight
 transition-colors
 duration-300
 hover:text-cyan-300
 "
>                DocuMind
              </span>
            </div>

            <p className="text-gray-500 text-sm leading-relaxed">
              AI-powered document intelligence platform for
              summarization, smart search and workflow automation.
            </p>
          </motion.div>

          {/* ── Navigation Links ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="flex flex-wrap items-center justify-center gap-2 text-sm"
          >
            {footerLinks.map(
 ({ label, to, scrollTop }, i) => (
              <motion.div key={i} whileHover={{ scale: 1.05 }}>
               <Link
 to={to}
 onClick={() => {

  if(scrollTop){

   window.scrollTo({
    top:0,
    behavior:"smooth"
   });

  }

 }}
 className="block px-4 py-2 rounded-xl border border-transparent text-gray-400 hover:text-white hover:border-white/[0.08] hover:bg-white/[0.04] transition-all duration-200"
                >
                  {label}
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {/* ── Social Links ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex items-center gap-3"
          >
         {socialLinks.map(
 ({ href, icon: Icon, label }, i) => (
              <motion.a
                key={i}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                whileHover={{ scale: 1.12, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 rounded-xl border border-white/10 bg-white/[0.04] flex items-center justify-center text-gray-400 hover:text-white hover:border-cyan-500/40 hover:bg-cyan-500/[0.07] hover:shadow-[0_0_14px_rgba(34,211,238,0.2)] transition-all duration-200"
              >
               <Icon />
              </motion.a>
            ))}
          </motion.div>

        </div>

        {/* ── Bottom Bar ── */}
      <motion.div
  initial={{ opacity: 0 }}
  whileInView={{ opacity: 1 }}
  transition={{ duration: 0.5, delay: 0.3 }}
  viewport={{ once: true }}
  className="mt-10 pt-6 border-t border-white/[0.06]"
>
  <div className="flex flex-col md:flex-row items-center justify-between gap-4">

    {/* Left Side */}
    <div className="text-center md:text-left">
      <p className="text-gray-600 text-xs">
        © {new Date().getFullYear()} DocuMind. All rights reserved.
      </p>

    <p
  className="
  mt-2
  text-base
  sm:text-lg
  font-bold
  text-white
  tracking-wide
  "
>
  Developed by

  <a
    href="https://www.linkedin.com/in/pragati-singh0208/"
    target="_blank"
    rel="noopener noreferrer"
    className="
    ml-2
    bg-gradient-to-r
    from-cyan-400
    to-violet-400
    bg-clip-text
    text-transparent
    hover:opacity-80
    transition-all
    duration-200
    "
  >
    Pragati Singh
  </a>

  <span className="mx-2 text-white/70">
    &
  </span>

  <a
    href="https://linkedin.com/in/sandipan-ray14"
    target="_blank"
    rel="noopener noreferrer"
    className="
    bg-gradient-to-r
    from-cyan-400
    to-violet-400
    bg-clip-text
    text-transparent
    hover:opacity-80
    transition-all
    duration-200
    "
  >
    Sandipan Ray
  </a>
</p>
    </div>

    {/* Right Side */}
    <div className="flex items-center gap-2">
      <motion.span
        animate={{ opacity: [1, 0.4, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="w-1.5 h-1.5 rounded-full bg-emerald-400"
      />

     <p
  className="
  text-xs
  sm:text-sm
  text-cyan-400/80
  font-medium
  tracking-wide
  "
>
  MERN Stack • Gemini AI • Cloudinary
</p>
    </div>

  </div>
</motion.div>

      </div>
    </footer>
  );
}