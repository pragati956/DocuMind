import React, { useState, useEffect, useContext,useRef } from "react"; // Added useContext
import { motion, AnimatePresence } from "framer-motion";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import { Link } from 'react-router-dom';
import { AuthContext } from "../../context/AuthContext"; // Imported AuthContext
import { User, LogOut, Settings } from 'lucide-react'; 
import { useNavigate } from "react-router-dom";// Imported Lucide icons

const navLinks = [
 { name: "Home", href: "#home" },
 { name: "Features", href: "#features" },
 { name: "AI Workflow", href: "#workflow" },
 { name: "Pricing", href: "#pricing" },
];

export default function Navbar() {
  const navigate = useNavigate();
  const [mobileMenu, setMobileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useContext(AuthContext); // Extracted user and logout from context
  const [profileDropdown, setProfileDropdown] = useState(false); 
  const profileRef = useRef(null);// Added state for desktop profile dropdown

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {

 const handleClickOutside =
  (event) => {

   if (
    profileRef.current &&
    !profileRef.current.contains(
      event.target
    )
   ) {

    setProfileDropdown(false);

   }

  };

 document.addEventListener(
  "mousedown",
  handleClickOutside
 );

 return () => {

  document.removeEventListener(
   "mousedown",
   handleClickOutside
  );

 };

}, []);
useEffect(() => {

 const handleEscape =
  (e) => {

   if (
    e.key === "Escape"
   ) {

    setProfileDropdown(false);
    setMobileMenu(false);

   }

  };

 document.addEventListener(
  "keydown",
  handleEscape
 );

 return () => {

  document.removeEventListener(
   "keydown",
   handleEscape
  );

 };

}, []);


  return (
    <>

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
<Link to="/">
<motion.div
 whileHover={{ scale: 1.05 }}
 className="flex items-center gap-2 cursor-pointer"
>              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.5)]"
              >
                <span className="text-white font-bold text-lg">D</span>
              </motion.div>
              <h1 className="text-white text-2xl font-semibold tracking-tight">DocuMind</h1>
            </motion.div>
            </Link>

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
            <div className="hidden md:flex items-center gap-4 relative">
              {/* Wrapped buttons in conditional rendering based on user state */}
              {user ? (
               <div
 className="relative"
 ref={profileRef}
>
                 <button
 aria-label="Profile Menu"
 aria-expanded={
  profileDropdown
 }
 onClick={() =>
  setProfileDropdown(
   !profileDropdown
  )
 }

                    className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 transition-all text-white"
                  >
                    <span className="font-semibold">
 {user?.name?.charAt(0)?.toUpperCase()}
</span>
                  </button>

                  {profileDropdown && (
                    <div className="absolute right-0 mt-3 w-48 bg-[#0a0f25] border border-white/10 rounded-xl shadow-2xl py-2 z-50">
                      <div className="px-4 py-2 border-b border-white/10 mb-2">
                        <p className="text-xs text-gray-400">Signed in as</p>
                        <p className="text-sm font-medium text-white truncate">{user.email}</p>
                      </div>
              <button
 onClick={()=>{
  navigate("/dashboard");
  setMobileMenu(false);
 }}
 className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-300 flex justify-center items-center gap-2"
>
 <Settings size={18}/>
 My Workspace
</button>
                      <button
                        onClick={() => {
                          logout();
                          setProfileDropdown(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-white/5 flex items-center gap-2"
                      >
                        <LogOut size={16} /> Sign out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link to="/login">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.96 }}
                      className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-300 hover:text-white bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300"
                    >
                      Login
                    </motion.button>
                  </Link>
                  <Link to="/register">
                    <motion.button
                      whileHover={{ scale: 1.06, boxShadow: "0 0 30px rgba(99,102,241,0.6)" }}
                      whileTap={{ scale: 0.95 }}
                      className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-cyan-500 transition-all duration-300"
                    >
                      Get Started
                    </motion.button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
 aria-label="Toggle Menu"
 aria-expanded={mobileMenu}
 onClick={() =>
  setMobileMenu(!mobileMenu)
 }
 className="md:hidden text-white text-3xl">
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
 onClick={() =>
  setMobileMenu(false)
 }

                      className="text-gray-300 hover:text-white text-base font-medium transition-all duration-300"
                    >
                      {link.name}
                    </motion.a>
                  ))}
                  <div className="flex flex-col gap-3 pt-4">
                    {/* Added conditional rendering for mobile menu user state */}
                    {user ? (
                      <>
                        <div className="px-4 py-2 border-b border-white/10 mb-2">
                          <p className="text-xs text-gray-400">Signed in as</p>
                          <p className="text-sm font-medium text-white truncate">{user.email}</p>
                        </div>
                        <button className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-300 flex justify-center items-center gap-2">
                          <Settings size={18} /> My Workspace
                        </button>
                        <button
                          onClick={() => {
                            logout();
                            setMobileMenu(false);
                          }}
                          className="w-full py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:text-red-300 hover:bg-red-500/20 transition-all duration-300 flex justify-center items-center gap-2"
                        >
                          <LogOut size={18} /> Sign Out
                        </button>
                      </>
                    ) : (
                      <>
                        <Link to="/login" onClick={() => setMobileMenu(false)} className="w-full">
                          <button className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-300">
                            Login
                          </button>
                        </Link>
                        <Link to="/register" onClick={() => setMobileMenu(false)} className="w-full">
                          <button className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-medium hover:shadow-[0_0_20px_rgba(99,102,241,0.5)] transition-all duration-300">
                            Get Started
                          </button>
                        </Link>
                      </>
                    )}
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