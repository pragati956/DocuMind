import React, {
  useState,
  useContext,
  useEffect,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../../context/AuthContext";
import {
  getDashboardStats,
} from "../../services/dashboardService";
import {
  FiUpload, FiArrowRight, FiZap, FiFileText,
  FiStar, FiTrendingUp, FiChevronRight, FiX,
} from "react-icons/fi";

/* ─── Floating Orb ─── */
function Orb({ className, animate, transition }) {
  return (
    <motion.div
      animate={animate}
      transition={transition}
      className={`absolute rounded-full pointer-events-none ${className}`}
    />
  );
}

/* ─── Particle ─── */
function Particle({ x, y, delay, size = 2 }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none bg-blue-300/50"
      style={{ left: `${x}%`, top: `${y}%`, width: size, height: size }}
      animate={{ y: [0, -24, 0], opacity: [0, 0.8, 0], scale: [0.5, 1.4, 0.5] }}
      transition={{ duration: 3.5 + Math.random() * 2, repeat: Infinity, delay, ease: "easeInOut" }}
    />
  );
}

/* ─── Stat Chip ─── */
function StatChip({ icon, value, label, delay, color }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ scale: 1.06, y: -2 }}
      className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl border border-white/[0.08] bg-white/[0.05] backdrop-blur-xl cursor-default"
    >
      <div className={`w-7 h-7 rounded-xl ${color} flex items-center justify-center text-sm`}>
        {icon}
      </div>
      <div>
        <p className="text-white text-sm font-bold leading-none">{value}</p>
        <p className="text-gray-400 text-[10px] mt-0.5">{label}</p>
      </div>
    </motion.div>
  );
}

/* ─── Main Welcome Banner ─── */
export default function WelcomeBanner({ onUpload }) {
  const [dismissed, setDismissed] = useState(false);
  const { user } = useContext(AuthContext); 
  const [statsData, setStatsData] =
  useState({
    totalDocuments: 0,
    summarizedDocuments: 0,
    processingDocuments: 0,
  });

useEffect(() => {

  const fetchStats = async () => {

    try {

      const data =
        await getDashboardStats();

      setStatsData(data);

    } catch (error) {

      console.error(
        "Welcome stats error:",
        error
      );

    }
  };

  fetchStats();

}, []);// Dynamically access global user context

  // Get the first name or default to 'User'
  const firstName = user?.name ? user.name.split(" ")[0] : "User";

  const particles = Array.from({ length: 18 }, (_, i) => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: i * 0.25,
    size: Math.random() > 0.6 ? 3 : 2,
  }));

  const stats = [
  {
    icon: <FiFileText className="text-blue-300" />,
    value: statsData.totalDocuments,
    label: "Docs processed",
    color:
      "bg-blue-500/15 border border-blue-500/20",
    delay: 0.55,
  },

  {
    icon: <FiZap className="text-purple-300" />,
    value:
      statsData.summarizedDocuments,
    label: "AI summaries",
    color:
      "bg-purple-500/15 border border-purple-500/20",
    delay: 0.65,
  },

  {
    icon:
      <FiTrendingUp className="text-emerald-300" />,
    value:
      statsData.processingDocuments,
    label: "Processing",
    color:
      "bg-emerald-500/15 border border-emerald-500/20",
    delay: 0.75,
  },
];
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');`}</style>

      <AnimatePresence>
        {!dismissed && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.97 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative rounded-3xl overflow-hidden mb-6"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            {/* ── Background layers ── */}
            <div
              className="absolute inset-0"
              style={{
                background: "linear-gradient(135deg, rgba(30,27,75,0.95) 0%, rgba(17,24,39,0.98) 40%, rgba(17,24,57,0.95) 100%)",
              }}
            />

            {/* Orbs */}
            <Orb
              className="w-[420px] h-[420px] -top-28 -left-16 blur-[90px]"
              style={{ background: "radial-gradient(circle, rgba(59,130,246,0.22) 0%, transparent 70%)" }}
              animate={{ scale: [1, 1.18, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 8, repeat: Infinity }}
            />
            <Orb
              className="w-[380px] h-[380px] -bottom-24 -right-12 blur-[90px]"
              style={{ background: "radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 70%)" }}
              animate={{ scale: [1, 1.22, 1], opacity: [0.5, 0.9, 0.5] }}
              transition={{ duration: 10, repeat: Infinity, delay: 2 }}
            />
            <Orb
              className="w-[260px] h-[260px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 blur-[80px]"
              style={{ background: "radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 70%)" }}
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 7, repeat: Infinity, delay: 4 }}
            />

            {/* Grid */}
            <div
              className="absolute inset-0 opacity-[0.04] pointer-events-none"
              style={{
                backgroundImage: "linear-gradient(rgba(148,163,184,1) 1px,transparent 1px),linear-gradient(90deg,rgba(148,163,184,1) 1px,transparent 1px)",
                backgroundSize: "44px 44px",
              }}
            />

            {/* Particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {particles.map((p, i) => <Particle key={i} {...p} />)}
            </div>

            {/* Shimmer sweep */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{ background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.025) 50%, transparent 60%)" }}
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 4, repeat: Infinity, repeatDelay: 5, ease: "easeInOut" }}
            />

            {/* Border glow */}
            <div className="absolute inset-0 rounded-3xl border border-white/[0.08] pointer-events-none" />
            <div
              className="absolute inset-0 rounded-3xl pointer-events-none"
              style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -1px 0 rgba(0,0,0,0.3)" }}
            />

            {/* ── Content ── */}
            <div className="relative z-10 p-7 md:p-8">

              {/* Dismiss */}
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setDismissed(true)}
                className="absolute top-5 right-5 w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 hover:text-white transition-colors"
              >
                <FiX className="text-xs" />
              </motion.button>

              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-7">

                {/* ── Left ── */}
                <div className="flex-1 max-w-xl">

                  {/* AI Ready Badge */}
                  <motion.div
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.15 }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/[0.06] backdrop-blur-xl mb-5"
                  >
                    <motion.span
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 1.8, repeat: Infinity }}
                      className="w-2 h-2 rounded-full bg-emerald-400 shrink-0"
                    />
                    <FiZap className="text-emerald-300 text-xs" />
                    <span className="text-emerald-300 text-xs font-semibold tracking-wide">AI Ready — All systems operational</span>
                  </motion.div>

                  {/* Heading */}
                  <motion.h1
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.22 }}
                    className="text-3xl md:text-4xl font-bold tracking-tight text-white leading-tight mb-3"
                  >
                    {greeting},{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-indigo-300 to-purple-300">
                      {firstName} 👋
                    </span>
                  </motion.h1>

                  {/* Subtext */}
                  <motion.p
  initial={{ opacity: 0, y: 12 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, delay: 0.3 }}
  className="text-gray-400 text-sm leading-relaxed mb-6 max-w-md"
>
  You have{" "}
  <span className="text-white font-semibold">
    {statsData.processingDocuments}
  </span>{" "}
  documents pending AI analysis and{" "}
  <span className="text-white font-semibold">
    {statsData.summarizedDocuments}
  </span>{" "}
  summaries ready to review.
</motion.p>

                  {/* CTA Buttons */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="flex flex-wrap items-center gap-3"
                  >
                    <motion.button
                      whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(59,130,246,0.5)" }}
                      whileTap={{ scale: 0.97 }}
                      onClick={onUpload}
                      className="relative flex items-center gap-2.5 px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold text-sm overflow-hidden"
                    >
                      {/* shimmer */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -skew-x-12"
                        animate={{ x: ["-100%", "200%"] }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
                      />
                      <FiUpload className="relative z-10" />
                      <span className="relative z-10">Upload Document</span>
                      <motion.span
                        animate={{ x: [0, 4, 0] }}
                        transition={{ duration: 1.4, repeat: Infinity }}
                        className="relative z-10"
                      >
                        <FiChevronRight />
                      </motion.span>
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.04, borderColor: "rgba(255,255,255,0.15)", backgroundColor: "rgba(255,255,255,0.07)" }}
                      whileTap={{ scale: 0.97 }}
                      className="flex items-center gap-2 px-5 py-3 rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl text-gray-300 text-sm font-medium transition-all duration-200"
                    >
                      <FiZap className="text-purple-300" />
                      View AI Summaries
                    </motion.button>
                  </motion.div>
                </div>

                {/* ── Right: Stats + Visual ── */}
                <div className="flex flex-col gap-4 lg:items-end shrink-0">

                  {/* Stat chips */}
                  <div className="flex flex-wrap gap-2 lg:flex-col lg:items-end">
                    {stats.map((s, i) => (
                      <StatChip key={i} {...s} />
                    ))}
                  </div>

                  {/* Mini doc preview card */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.88, y: 16 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="hidden lg:block w-52 rounded-2xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-xl p-4 cursor-default"
                  >
                    <div className="flex items-center gap-2.5 mb-3">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white text-xs">
                        <FiFileText />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-[11px] font-semibold truncate">Q4 Financial.pdf</p>
                        <p className="text-gray-600 text-[10px]">2.4 MB · Just now</p>
                      </div>
                    </div>

                    {/* skeleton lines */}
                    {[100, 80, 90, 60].map((w, i) => (
                      <motion.div
                        key={i}
                        initial={{ width: 0 }}
                        animate={{ width: `${w}%` }}
                        transition={{ duration: 0.7, delay: 1 + i * 0.1, ease: "easeOut" }}
                        className="h-1.5 rounded-full bg-white/10 mb-1.5"
                      />
                    ))}

                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.6 }}
                      className="mt-3 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20"
                    >
                      <FiZap className="text-purple-300 text-[10px]" />
                      <span className="text-purple-300 text-[10px] font-medium">Summary ready</span>
                      <motion.span
                        animate={{ opacity: [1, 0.3, 1] }}
                        transition={{ duration: 1.2, repeat: Infinity }}
                        className="ml-auto w-1.5 h-1.5 rounded-full bg-purple-400"
                      />
                    </motion.div>
                  </motion.div>
                </div>
              </div>

              {/* ── Bottom progress strip ── */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="mt-7 pt-5 border-t border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-2.5">
                  <FiStar className="text-amber-400 text-sm shrink-0" />
                  <p className="text-gray-400 text-xs">
                    <span className="text-white font-medium">Pro Plan</span> — 24.6 GB of 50 GB used
                  </p>
                </div>

                <div className="flex items-center gap-3 flex-1 sm:max-w-xs">
                  <div className="flex-1 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "49%" }}
                      transition={{ duration: 1.4, delay: 1, ease: "easeOut" }}
                      className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-400"
                    />
                  </div>
                  <span className="text-gray-500 text-[11px] shrink-0">49%</span>
                  <motion.button
                    whileHover={{ scale: 1.04, color: "#93c5fd" }}
                    className="text-blue-400 text-[11px] font-semibold flex items-center gap-1 shrink-0 transition-colors"
                  >
                    Upgrade <FiArrowRight className="text-[10px]" />
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}