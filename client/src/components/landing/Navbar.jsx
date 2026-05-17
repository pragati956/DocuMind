import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiMenuAlt3, HiX } from "react-icons/hi";

const navLinks = [
  { name: "Home", href: "#" },
  { name: "Features", href: "#" },
  { name: "AI Workflow", href: "#" },
  { name: "Pricing", href: "#" },
];

export default function Navbar() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap'); * { font-family: 'Poppins', sans-serif; }`}</style>

      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed top-0 left-0 w-full z-50 px-4 md:px-8 pt-3"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            animate={{
              boxShadow: scrolled ? "0 8px 40px rgba(0,0,0,0.6)" : "0 8px 32px rgba(0,0,0,0.37)",
              backgroundColor: scrolled ? "rgba(11,15,25,0.85)" : "rgba(255,255,255,0.04)",
            }}
            transition={{ duration: 0.3 }}
            className="flex items-center justify-between border border-white/10 backdrop-blur-xl rounded-2xl px-6 py-4"
          >
            {/* Logo */}
            <motion.div whileHover={{ scale: 1.05 }} className="flex items-center gap-2 cursor-pointer">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.5)]"
              >
                <span className="text-white font-bold text-lg">D</span>
              </motion.div>
              <h1 className="text-white text-2xl font-semibold tracking-tight">DocuMind</h1>
            </motion.div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link, i) => (
                <motion.a
                  key={i}
                  href={link.href}
                  whileHover={{ scale: 1.06 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="text-gray-300 hover:text-white text-sm font-medium transition-all duration-300 relative group"
                >
                  {link.name}
                  <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-gradient-to-r from-cyan-400 to-indigo-500 transition-all duration-300 group-hover:w-full" />
                </motion.a>
              ))}
            </div>

            {/* Desktop Buttons */}
            <div className="hidden md:flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.96 }}
                className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-300 hover:text-white bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300"
              >
                Login
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.06, boxShadow: "0 0 30px rgba(99,102,241,0.6)" }}
                whileTap={{ scale: 0.95 }}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-cyan-500 transition-all duration-300"
              >
                Get Started
              </motion.button>
            </div>

            {/* Mobile Menu Button */}
            <button onClick={() => setMobileMenu(!mobileMenu)} className="md:hidden text-white text-3xl">
              {mobileMenu ? <HiX /> : <HiMenuAlt3 />}
            </button>
          </motion.div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {mobileMenu && (
              <motion.div
                initial={{ opacity: 0, y: -15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="md:hidden mt-4 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.37)]"
              >
                <div className="flex flex-col p-6 gap-5">
                  {navLinks.map((link, i) => (
                    <motion.a
                      key={i}
                      href={link.href}
                      whileHover={{ x: 5 }}
                      className="text-gray-300 hover:text-white text-base font-medium transition-all duration-300"
                    >
                      {link.name}
                    </motion.a>
                  ))}
                  <div className="flex flex-col gap-3 pt-4">
                    <button className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-300">
                      Login
                    </button>
                    <button className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-medium hover:shadow-[0_0_20px_rgba(99,102,241,0.5)] transition-all duration-300">
                      Get Started
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.nav>
    </>
  );
}