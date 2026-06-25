import {
  useState,
  
  useContext,
  useEffect
}
from "react";
import toast from "react-hot-toast";
import {
  changePassword,
}
from "../../services/userService";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../../context/AuthContext";
import {
  getProfile,
  updateProfile,
}
from "../../services/userService";
import {
  getStorageStats,
}
from "../../services/userService";
import {
  getNotifications,
  updateNotifications,
}
from "../../services/userService";
import {
  HiOutlineUser,

  HiOutlineLockClosed,
  HiOutlineBell,
  
  HiOutlineDatabase,
  
  
  
  HiOutlineChevronRight,
  HiOutlineCheck,
  
  HiOutlineEye,
  HiOutlineEyeOff,
  HiOutlineKey,
  
} from "react-icons/hi";
import { BsStars} from "react-icons/bs";
import { HiOutlineDocumentDuplicate } from "react-icons/hi2";

// ─── constants ────────────────────────────────────────────────────────────────
const NAV = [
  { id: "profile", label: "Profile", icon: <HiOutlineUser /> },
  { id: "security", label: "Security", icon: <HiOutlineLockClosed /> },
  { id: "notifications", label: "Notifications", icon: <HiOutlineBell /> },
  { id: "storage", label: "Storage", icon: <HiOutlineDatabase /> },
];

const getInitials = (name) =>
  name
    ?.split(" ")
    .map(word => word[0])
    .join("")
    .toUpperCase();


// ─── tiny helpers ─────────────────────────────────────────────────────────────
function SectionTitle({ children }) {
  return (
    <p className="mb-4 text-[10px] font-bold tracking-[0.18em] uppercase text-white/25">
      {children}
    </p>
  );
}




// ─── toggle switch ─────────────────────────────────────────────────────────────
function Toggle({ value, onChange }) {
  return (
    <motion.button
      onClick={() => onChange(!value)}
      className="relative flex h-5 w-9 shrink-0 items-center rounded-full border transition-colors"
      animate={{
        backgroundColor: value ? "rgba(124,58,237,0.25)" : "rgba(255,255,255,0.04)",
        borderColor: value ? "rgba(124,58,237,0.5)" : "rgba(255,255,255,0.1)",
      }}
    >
      <motion.span
        animate={{ x: value ? 17 : 2 }}
        transition={{ type: "spring", stiffness: 500, damping: 32 }}
        className="h-3.5 w-3.5 rounded-full"
        style={{ background: value ? "#a78bfa" : "rgba(255,255,255,0.2)" }}
      />
    </motion.button>
  );
}

// ─── settings row ─────────────────────────────────────────────────────────────
function Row({ icon, label, sub, children, danger }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3.5">
      <div className="flex items-center gap-3 min-w-0">
        {icon && (
          <span className={`shrink-0 text-base ${danger ? "text-red-400/60" : "text-white/25"}`}>
            {icon}
          </span>
        )}
        <div className="min-w-0">
          <p className={`text-sm font-medium ${danger ? "text-red-400/80" : "text-white/75"}`}>
            {label}
          </p>
          {sub && <p className="text-xs text-white/30 mt-0.5 truncate max-w-xs">{sub}</p>}
        </div>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

// ─── card wrapper ─────────────────────────────────────────────────────────────
function Card({ children, className = "", glow }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 24 }}
      className={`rounded-2xl border border-white/[0.07] bg-white/[0.025] backdrop-blur-sm overflow-hidden ${className}`}
      style={glow ? { boxShadow: "0 0 40px rgba(124,58,237,0.07)" } : {}}
    >
      {children}
    </motion.div>
  );
}

// ─── input field ──────────────────────────────────────────────────────────────
function Field({ label, value, onChange, type = "text", placeholder, rightEl }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-white/40">{label}</label>
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-3.5 py-2.5 text-sm text-white/80 placeholder-white/20 outline-none focus:border-violet-500/40 focus:bg-white/[0.05] transition-all pr-10"
          style={{ fontFamily: "inherit" }}
        />
        {rightEl && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightEl}</div>
        )}
      </div>
    </div>
  );
}

// ─── action button ────────────────────────────────────────────────────────────
function Btn({ children, variant = "ghost", onClick, danger, icon, small }) {
  const base = "inline-flex items-center gap-2 rounded-xl font-medium transition-all";
  const size = small ? "px-3 py-1.5 text-xs" : "px-4 py-2.5 text-sm";
  const styles = {
    ghost: "border border-white/[0.08] bg-white/[0.03] text-white/55 hover:bg-white/[0.07] hover:text-white/80",
    primary: "text-white shadow-lg",
    danger: "border border-red-500/20 bg-red-500/8 text-red-400 hover:bg-red-500/15 hover:text-red-300",
  };
  return (
    <motion.button
      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`${base} ${size} ${danger ? styles.danger : styles[variant]}`}
      style={variant === "primary" && !danger
        ? { background: "linear-gradient(135deg,#7c3aed,#5b21b6)", boxShadow: "0 4px 20px rgba(124,58,237,0.35)" }
        : {}}
    >
      {icon && <span className="text-base">{icon}</span>}
      {children}
    </motion.button>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// SECTIONS
// ═════════════════════════════════════════════════════════════════════════════

function ProfileSection() {
  const [role, setRole] = useState("Student");
  const { user, updateUser } = useContext(AuthContext);
const [profile, setProfile] =
  useState(null);
  const [savingProfile, setSavingProfile] =
 useState(false);
  const [name, setName] =
    useState(user?.name || "");
    const [documentsCount,
 setDocumentsCount] =
 useState(0);


  const [bio, setBio] = useState("Building great products with AI-powered document intelligence.");
  const [saved, setSaved] = useState(false);

  const save = async () => {
     if (!name.trim()) {

    toast.error(
      "Name is required"
    );

    return;

  }
    setSavingProfile(true);

  try {

    const token =
      localStorage.getItem("token");

    const data = await updateProfile(
      {
        name,
        role,
        bio,
      },
      token
    );

    if (data?.user) {
      updateUser(data.user);
      setProfile(data.user);
      setName(data.user.name || "");
      setRole(data.user.role || "Student");
      setBio(data.user.bio || "");
    }

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2000);

  } catch(error){

 console.error(error);
 toast.error("Failed to update profile");


}
finally{

 setSavingProfile(false);

}

};
useEffect(() => {

  const fetchProfile =
    async () => {

      try {

        const token =
 localStorage.getItem("token");

const data =
 await getProfile(token);

setProfile(data.user);
          setDocumentsCount(
 data.documentsCount || 0
);

        setName(
          data.user.name || ""
        );

        setRole(
          data.user.role || "Student"
        );

        setBio(
          data.user.bio || ""
        );

      } catch (error) {

        console.error(error);

      }

    };

  fetchProfile();

}, []);

  return (
    <div className="space-y-4">
      <SectionTitle>Profile</SectionTitle>

      {/* avatar card */}
      <Card glow>
        <div className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="relative group">
              <div
                className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-white/10 text-2xl font-bold text-violet-300"
                style={{ background: "linear-gradient(135deg,rgba(124,58,237,0.25),rgba(91,33,182,0.15))" }}
              >
                {getInitials(name)}
              </div>
      
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <p className="text-base font-semibold text-white/90">{name}</p>
                
              </div>
              <p className="text-sm text-white/40">{role}</p>
              <p className="mt-2 text-xs text-white/25 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 inline-block" />
                Member since {
new Date(
 profile?.createdAt ||
 Date.now()
)
 .toLocaleDateString(
   "en-US",
   {
     month:"long",
     year:"numeric"
   }
 )
} · {documentsCount}
documents uploaded
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* fields */}
      <Card>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Full Name" value={name} onChange={setName} placeholder="Your name" />
            <Field label="Job Title" value={role} onChange={setRole} placeholder="Your role" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-white/40">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-3.5 py-2.5 text-sm text-white/80 placeholder-white/20 outline-none focus:border-violet-500/40 focus:bg-white/[0.05] transition-all"
              style={{ fontFamily: "inherit", resize: "none" }}
            />
          </div>
          <div className="flex justify-end">
           <Btn
 variant="primary"
 onClick={save}
 icon={saved ? <HiOutlineCheck /> : null}
>
 {
  savingProfile
   ? "Saving..."
   : saved
     ? "Saved!"
     : "Save Changes"
 }
</Btn>
          </div>
        </div>
      </Card>
    </div>
  );
}



function SecuritySection() {
  const [showCurr, setShowCurr] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [curr, setCurr] = useState("");
  const [newP, setNewP] = useState("");
  const [saving, setSaving] =
useState(false);
  const [confirm, setConfirm] =
  useState("");
 

  const strength = newP.length === 0 ? 0 : newP.length < 6 ? 1 : newP.length < 10 ? 2 : 3;
  const strengthColors = ["transparent", "#ef4444", "#f59e0b", "#10b981"];
  const strengthLabels = ["", "Weak", "Fair", "Strong"];
  const handlePasswordUpdate =
async () => {

  try {
    if (newP.length < 8) {

 toast.error(
  "Password must be at least 8 characters"
 );

 return;

}

    if (
      newP !== confirm
    ) {

      toast.error(
        "Passwords do not match"
      );

      return;
    }

    setSaving(true);

    const token =
      localStorage.getItem(
        "token"
      );

    const response =
      await changePassword(
        {
          currentPassword:
            curr,
          newPassword:
            newP,
        },
        token
      );

    toast.success(
      response.message
    );

    setCurr("");
    setNewP("");
    setConfirm("");

  } catch (error) {

    toast.error(
      error.response?.data?.message ||
      "Failed to update password"
    );

  } finally {

    setSaving(false);

  }

};

  return (
    <div className="space-y-4">
      <SectionTitle>Security</SectionTitle>

      {/* password */}
      <Card>
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <HiOutlineLockClosed className="text-white/30" />
            <p className="text-sm font-semibold text-white/75">Change Password</p>
          </div>
          <Field label="Current Password" value={curr} onChange={setCurr} type={showCurr ? "text" : "password"}
            placeholder="••••••••"
            rightEl={
              <button onClick={() => setShowCurr((v) => !v)} className="text-white/25 hover:text-white/55 transition-colors">
                {showCurr ? <HiOutlineEyeOff className="text-sm" /> : <HiOutlineEye className="text-sm" />}
              </button>
            }
          />
          <Field label="New Password" value={newP} onChange={setNewP} type={showNew ? "text" : "password"}
            placeholder="Min 8 characters"
            rightEl={
              <button onClick={() => setShowNew((v) => !v)} className="text-white/25 hover:text-white/55 transition-colors">
                {showNew ? <HiOutlineEyeOff className="text-sm" /> : <HiOutlineEye className="text-sm" />}
              </button>
            }
          />
          {newP.length > 0 && (
            <div>
              <div className="flex gap-1 mb-1">
                {[1, 2, 3].map((i) => (
                  <motion.div key={i} animate={{ backgroundColor: i <= strength ? strengthColors[strength] : "rgba(255,255,255,0.07)" }}
                    className="h-1 flex-1 rounded-full" />
                ))}
              </div>
              <p className="text-[10px]" style={{ color: strengthColors[strength] }}>{strengthLabels[strength]}</p>
            </div>
          )}
          <Field label="Confirm New Password" value={confirm} onChange={(v) => setConfirm(v)}
            type={showConfirm ? "text" : "password"} placeholder="Re-enter new password"
            rightEl={
              <button onClick={() => setShowConfirm((v) => !v)} className="text-white/25 hover:text-white/55 transition-colors">
                {showConfirm ? <HiOutlineEyeOff className="text-sm" /> : <HiOutlineEye className="text-sm" />}
              </button>
            }
          />
          <div className="flex justify-end">
           <Btn
  variant="primary"
  icon={<HiOutlineKey />}
  onClick={
    handlePasswordUpdate
  }
>
  {
    saving
      ? "Updating..."
      : "Update Password"
  }
</Btn>
          </div>
        </div>
      </Card>

      {/* 2FA + sessions */}
   
    </div>
  );
}

function NotificationsSection() {
 const [notifs, setNotifs] =
useState({
  upload: true,
  summary: true,
});

const { user } =
 useContext(AuthContext);
  const toggle =
async (key) => {

  const updated = {
    ...notifs,
    [key]:
      !notifs[key],
  };
const previous = notifs;
  setNotifs(updated);

  try {

    const token =
      localStorage.getItem(
        "token"
      );

    await updateNotifications(
      updated,
      token
    );

  } catch (error) {
     setNotifs(previous);

    toast.error("Failed to update notifications.");

  }

};

 const groups = [
  {
    title: "Document Activity",
    rows: [
      {
        key: "upload",
        label: "Upload Complete",
        sub: "When a document finishes uploading",
        icon: <HiOutlineDocumentDuplicate />,
      },
      {
        key: "summary",
        label: "AI Summary Ready",
        sub: "When DocuMind AI finishes summarizing",
        icon: <BsStars />,
      },
    ],
  },
];
  useEffect(() => {

  const fetchNotifications =
    async () => {

      try {

        const token =
          localStorage.getItem(
            "token"
          );

        const data =
          await getNotifications(
            token
          );

       setNotifs(
 data.notifications || {
  upload: true,
  summary: true,
 }
);

      } catch (error) {

        console.error(error);

      }

    };

  fetchNotifications();

}, []);

  return (
    <div className="space-y-4">
      <SectionTitle>Notifications</SectionTitle>
      {groups.map((g) => (
        <Card key={g.title}>
          <div className="px-6 pt-4 pb-1">
            <p className="text-[10px] font-bold tracking-widest uppercase text-white/20 mb-1">{g.title}</p>
          </div>
          <div className="px-6 pb-4 divide-y divide-white/[0.05]">
            {g.rows.map((r) => (
              <Row key={r.key} icon={r.icon} label={r.label} sub={r.sub}>
                <Toggle value={Boolean(notifs[r.key])} onChange={() => toggle(r.key)} />
              </Row>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}

function StorageSection() {
    const [stats, setStats] =
    useState({
      totalDocuments: 0,
      pdfCount: 0,
      docxCount: 0,
      txtCount: 0,
      totalStorageMB: 0,
    });
    const totalFiles =
 Math.max(stats.totalDocuments,1);
    useEffect(() => {

  const fetchStats =
    async () => {

      try {

        const token =
          localStorage.getItem(
            "token"
          );

        const data =
          await getStorageStats(
            token
          );


        setStats(data);

      } catch (error) {

        console.error(error);

      }

    };

  fetchStats();

}, []);
  
 const usedMB =
 stats.totalStorageMB;

const STORAGE_LIMIT_MB = 102400;

const usedPercentage =
 Math.min(
  (usedMB / STORAGE_LIMIT_MB) * 100,
  100
 );

const total = 100;
 const breakdown = [
  {
    label: "PDF Files",
    size: `${stats.pdfCount} files`,
    pct:
 (stats.pdfCount / totalFiles) * 100,
    color: "#ff6b6b",
  },

  {
    label: "DOCX Files",
    size: `${stats.docxCount} files`,
   pct:
 (stats.docxCount / totalFiles) * 100,
    color: "#4fc3f7",
  },

  {
    label: "TXT Files",
    size: `${stats.txtCount} files`,
   pct:
 (stats.txtCount / totalFiles) * 100,
    color: "#81c784",
  },

  {
    label: "Documents",
    size: `${stats.totalDocuments} files`,
    pct: 100,
    color: "#ffb74d",
  },
];

  return (
    <div className="space-y-4">
<SectionTitle>
 Storage
</SectionTitle>
      {/* plan card */}
      <Card glow>
        <div className="p-6">
         

          {/* usage bar */}
          <div className="mb-3 flex items-center justify-between text-xs">
<span className="text-white/45 font-medium">
  {usedMB.toFixed(2)} MB used
</span>            <span className="text-white/25">{total} GB total</span>
          </div>
          <div className="h-2 w-full rounded-full bg-white/[0.06] overflow-hidden mb-1">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${usedPercentage}%` }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
              className="h-full rounded-full"
              style={{ background: "linear-gradient(90deg, #7c3aed, #a78bfa)", boxShadow: "0 0 12px rgba(124,58,237,0.4)" }}
            />
          </div>
<p className="text-[11px] text-white/25">
  {stats.totalDocuments} documents uploaded
</p>
          {/* breakdown */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {breakdown.map((b) => (
              <div key={b.label} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
                <div className="flex items-center gap-1.5 mb-2">
                  <span className="h-2 w-2 rounded-full" style={{ background: b.color }} />
                  <span className="text-[10px] text-white/35">{b.label}</span>
                </div>
                <p className="text-sm font-semibold text-white/70">{b.size}</p>
                <div className="mt-1.5 h-1 rounded-full bg-white/[0.06] overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${b.pct}%` }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="h-full rounded-full" style={{ background: b.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* upgrade nudge */}
     
    </div>
  );
}





// ═════════════════════════════════════════════════════════════════════════════
// MAIN
// ═════════════════════════════════════════════════════════════════════════════
const SECTIONS = {
  profile: <ProfileSection />,
  security: <SecuritySection />,
  notifications: <NotificationsSection />,
  storage: <StorageSection />,
};

export default function SettingsPage() {
  const [active, setActive] = useState("profile");
  const [mobileNav, setMobileNav] = useState(false);
  

  const activeNav = NAV.find((n) => n.id === active);

  return (
    <div className="min-h-screen text-white overflow-x-hidden"
      style={{ background: "#09090b" }}>

      

      {/* ambient */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div style={{ position: "absolute", top: "-15%", right: "-5%", width: 600, height: 600, background: "radial-gradient(circle, rgba(109,40,217,0.07) 0%, transparent 70%)", borderRadius: "50%" }} />
        <div style={{ position: "absolute", bottom: "5%", left: "-8%", width: 450, height: 450, background: "radial-gradient(circle, rgba(14,165,233,0.04) 0%, transparent 70%)", borderRadius: "50%" }} />
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style={{ opacity: 0.02 }}>
          <defs><pattern id="g" width="44" height="44" patternUnits="userSpaceOnUse">
            <path d="M 44 0 L 0 0 0 44" fill="none" stroke="white" strokeWidth="0.5" />
          </pattern></defs>
          <rect width="100%" height="100%" fill="url(#g)" />
        </svg>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-10">

        {/* ── page header ── */}
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="h-7 w-7 rounded-lg bg-violet-600 flex items-center justify-center text-sm"
              style={{ boxShadow: "0 0 14px rgba(124,58,237,0.5)" }}>
              <HiOutlineDocumentDuplicate />
            </div>
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-white/30">DocuMind</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Settings</h1>
          <p className="mt-1 text-sm text-white/30">Manage your account, preferences, and integrations.</p>
        </motion.div>

        {/* ── mobile nav trigger ── */}
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setMobileNav((v) => !v)}
            className="flex w-full items-center justify-between rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3"
          >
            <div className="flex items-center gap-2.5 text-sm text-white/70">
              <span className={activeNav?.danger ? "text-red-400/60" : "text-violet-400"}>{activeNav?.icon}</span>
              {activeNav?.label}
            </div>
            <motion.span animate={{ rotate: mobileNav ? 90 : 0 }}>
              <HiOutlineChevronRight className="text-white/25" />
            </motion.span>
          </button>
          <AnimatePresence>
            {mobileNav && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-2 rounded-xl border border-white/[0.07] bg-[#0d0d0f] p-2 space-y-0.5">
                  {NAV.map((n) => (
                    <button key={n.id}
                      onClick={() => { setActive(n.id); setMobileNav(false); }}
                      className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm transition-all
                        ${active === n.id
                          ? "bg-violet-500/10 text-violet-300 border border-violet-500/20"
                          : n.danger
                            ? "text-red-400/60 hover:bg-red-500/5"
                            : "text-white/45 hover:bg-white/[0.04] hover:text-white/70"}`}>
                      {n.icon} {n.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── layout ── */}
        <div className="flex gap-6 items-start">

          {/* ── sidebar nav (desktop) ── */}
          <motion.nav
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.05 }}
            className="hidden lg:flex w-52 shrink-0 flex-col gap-0.5 sticky top-8"
          >
            {NAV.map((n, i) => (
              <motion.button
                key={n.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.04 + i * 0.04 }}
                onClick={() => setActive(n.id)}
                className={`relative flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all text-left w-full
                  ${active === n.id
                    ? n.danger
                      ? "bg-red-500/8 border border-red-500/15 text-red-400/80"
                      : "bg-violet-500/10 border border-violet-500/20 text-violet-300"
                    : n.danger
                      ? "border border-transparent text-red-400/45 hover:bg-red-500/5 hover:text-red-400/70"
                      : "border border-transparent text-white/40 hover:bg-white/[0.04] hover:text-white/70"}`}
              >
                {active === n.id && !n.danger && (
                  <motion.div layoutId="navActive"
                    className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-0.5 rounded-full bg-violet-400"
                    style={{ left: -1 }} />
                )}
                <span className="text-base shrink-0">{n.icon}</span>
                {n.label}
              </motion.button>
            ))}

            {/* plan badge in nav */}
        
          </motion.nav>

          {/* ── content ── */}
          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
              >
                {SECTIONS[active]}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* footer */}
       
      </div>
    </div>
  );
}