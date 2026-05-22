import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiOutlineMenuAlt2,
  HiOutlineX,
  HiOutlinePaperAirplane,
  HiOutlineLightningBolt,
  HiOutlineDocumentText,
  HiOutlineChip,
  HiOutlineTrash,
  HiOutlinePencil,
  HiOutlinePlus,
  HiOutlineDotsHorizontal,
  HiOutlineClipboardCopy,
  HiOutlineThumbUp,
  HiOutlineThumbDown,
  HiOutlineRefresh,
  HiOutlineSearch,
  HiOutlineChevronRight,
} from "react-icons/hi";
import { BsStars, BsRobot, BsPerson, BsFilePdf, BsFileWord } from "react-icons/bs";
import { HiOutlineDocumentDuplicate, HiMiniSparkles } from "react-icons/hi2";

// ─── data ──────────────────────────────────────────────────────────────────────
const HISTORY = [
  {
    id: 1, title: "Q4 Report Analysis", preview: "Summarize key findings…",
    date: "Today", active: true,
    doc: { name: "Q4_Financial_Report.pdf", type: "PDF" },
  },
  {
    id: 2, title: "Product Roadmap Review", preview: "What are the main priorities?",
    date: "Today", active: false,
    doc: { name: "Product_Roadmap_v3.docx", type: "DOCX" },
  },
  {
    id: 3, title: "Legal Contract Summary", preview: "Extract key obligations…",
    date: "Yesterday", active: false,
    doc: { name: "Legal_Contract_2026.pdf", type: "PDF" },
  },
  {
    id: 4, title: "User Research Insights", preview: "What pain points were found?",
    date: "Yesterday", active: false,
    doc: { name: "User_Research_Synthesis.pdf", type: "PDF" },
  },
  {
    id: 5, title: "Infrastructure Notes", preview: "List all action items",
    date: "May 20", active: false,
    doc: { name: "Infrastructure_Notes.txt", type: "TXT" },
  },
  {
    id: 6, title: "Marketing Strategy 2026", preview: "Key campaigns summary",
    date: "May 19", active: false,
    doc: null,
  },
];

const SUGGESTED = [
  { icon: <HiOutlineDocumentText />, label: "Summarize this document", color: "#7c3aed" },
  { icon: <HiOutlineLightningBolt />, label: "Extract key action items", color: "#f59e0b" },
  { icon: <HiOutlineChip />, label: "Find all risks and blockers", color: "#ef4444" },
  { icon: <BsStars />, label: "Compare with previous version", color: "#06b6d4" },
  { icon: <HiOutlineSearch />, label: "Search for specific clauses", color: "#10b981" },
  { icon: <HiOutlinePencil />, label: "Rewrite in simpler language", color: "#ec4899" },
];

const SEED_MESSAGES = [
  {
    id: 1, role: "assistant", ts: "10:42 AM",
    text: "Hello! I'm **DocuMind AI**, your intelligent document assistant. I've loaded **Q4 Financial Report 2024** (48 pages, 4.2 MB).\n\nHere's what I found at a glance:\n\n• **Revenue** grew 23% YoY to $142M\n• **Operating margin** improved to 18.4%\n• **3 key risks** flagged in Section 4\n• **12 action items** across departments\n\nWhat would you like to explore?",
  },
  {
    id: 2, role: "user", ts: "10:43 AM",
    text: "Can you summarize the top 3 risks mentioned in the report?",
  },
  {
    id: 3, role: "assistant", ts: "10:43 AM",
    text: "Absolutely. Here are the **top 3 risks** identified in Section 4 of the Q4 report:\n\n**1. Supply Chain Disruption**\nOngoing delays in APAC region suppliers affecting ~$8M in projected Q1 revenue. Mitigation plan outlined in Appendix C.\n\n**2. Regulatory Compliance Gap**\nNew EU data residency requirements (effective March 2026) require infrastructure changes estimated at $1.2M.\n\n**3. Talent Retention**\nEngineering attrition rate reached 14% in Q4 — above the 10% threshold. Compensation benchmarking review recommended.\n\nWould you like me to draft a risk mitigation summary or pull the relevant action items?",
  },
  {
    id: 4, role: "user", ts: "10:44 AM",
    text: "Yes, draft a risk mitigation summary for the executive team.",
  },
];

const AI_RESPONSES = [
  "I've analyzed the document thoroughly. Here's what stands out:\n\n**Key Finding:** The data shows a consistent upward trend over the past 3 quarters, with a notable inflection point in Q3.\n\nI can break this down further or extract specific sections if needed.",
  "Great question. Based on the document content, there are **4 main themes** I've identified:\n\n1. Strategic alignment across business units\n2. Resource allocation efficiency\n3. Customer satisfaction metrics\n4. Technical debt reduction initiatives\n\nShould I expand on any of these?",
  "I've cross-referenced this with the other documents in your workspace. Here's what I found that's relevant to your question...\n\nThe information aligns with the **Product Roadmap v3** — specifically the Q2 milestones section. Would you like a side-by-side comparison?",
  "Understood. I've drafted a concise summary optimized for executive review. The key points are structured for clarity and action-orientation.\n\nWould you like me to adjust the tone or add specific metrics from the appendix?",
];

// ─── utils ─────────────────────────────────────────────────────────────────────
const docIcon = (type) => {
  if (type === "PDF")  return <BsFilePdf  className="text-[#ff6b6b] text-xs" />;
  if (type === "DOCX") return <BsFileWord className="text-[#4fc3f7] text-xs" />;
  return <HiOutlineDocumentText className="text-[#81c784] text-xs" />;
};

function parseMarkdown(text) {
  const lines = text.split("\n");
  return lines.map((line, i) => {
    const boldParsed = line.split(/\*\*(.*?)\*\*/g).map((part, j) =>
      j % 2 === 1 ? <strong key={j} className="font-semibold text-white/95">{part}</strong> : part
    );
    if (line.startsWith("• ") || line.startsWith("- ")) {
      return (
        <div key={i} className="flex items-start gap-2 my-0.5">
          <span className="mt-1.5 h-1 w-1 rounded-full bg-white/30 shrink-0" />
          <span>{boldParsed.slice(1)}</span>
        </div>
      );
    }
    if (/^\d+\./.test(line)) {
      return <div key={i} className="my-0.5 pl-1">{boldParsed}</div>;
    }
    if (line === "") return <div key={i} className="h-2" />;
    return <div key={i}>{boldParsed}</div>;
  });
}

// ─── typing indicator ─────────────────────────────────────────────────────────
function TypingIndicator() {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
      className="flex items-end gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-violet-500/25 bg-violet-500/10 text-violet-400 text-sm">
        <BsStars />
      </div>
      <div className="rounded-2xl rounded-bl-sm border border-white/[0.07] bg-white/[0.03] px-4 py-3 backdrop-blur-sm">
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.span key={i} animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.18, ease: "easeInOut" }}
              className="h-1.5 w-1.5 rounded-full bg-violet-400" />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ─── message bubble ───────────────────────────────────────────────────────────
function MessageBubble({ msg, isLast }) {
  const isAI = msg.role === "assistant";
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard?.writeText(msg.text.replace(/\*\*/g, ""));
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 24 }}
      className={`group flex items-end gap-3 ${isAI ? "" : "flex-row-reverse"}`}
    >
      {/* avatar */}
      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-sm
        ${isAI
          ? "border border-violet-500/25 bg-violet-500/10 text-violet-400"
          : "border border-sky-500/20 bg-sky-500/10 text-sky-400"}`}>
        {isAI ? <BsStars /> : <BsPerson />}
      </div>

      {/* bubble */}
      <div className={`relative max-w-[78%] ${isAI ? "" : "items-end"} flex flex-col gap-1`}>
        <div className={`rounded-2xl border px-4 py-3 text-sm leading-relaxed backdrop-blur-sm
          ${isAI
            ? "rounded-bl-sm border-white/[0.07] bg-white/[0.03] text-white/80"
            : "rounded-br-sm border-sky-500/15 bg-sky-500/[0.08] text-white/85"}`}>
          {isAI ? (
            <div className="space-y-0.5">{parseMarkdown(msg.text)}</div>
          ) : (
            <p>{msg.text}</p>
          )}
        </div>

        {/* actions */}
        <div className={`flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200
          ${isAI ? "ml-1" : "mr-1 flex-row-reverse"}`}>
          <span className="text-[10px] text-white/20 font-mono px-1">{msg.ts}</span>
          {isAI && (
            <>
              <button onClick={copy}
                className="flex items-center gap-1 rounded-lg px-2 py-1 text-[10px] text-white/30 hover:bg-white/[0.06] hover:text-white/60 transition-colors">
                {copied ? <HiOutlineClipboardCopy className="text-emerald-400" /> : <HiOutlineClipboardCopy />}
                {copied ? "Copied" : "Copy"}
              </button>
              <button className="rounded-lg p-1 text-white/25 hover:bg-white/[0.06] hover:text-white/60 transition-colors">
                <HiOutlineThumbUp className="text-xs" />
              </button>
              <button className="rounded-lg p-1 text-white/25 hover:bg-white/[0.06] hover:text-white/60 transition-colors">
                <HiOutlineThumbDown className="text-xs" />
              </button>
              <button className="rounded-lg p-1 text-white/25 hover:bg-white/[0.06] hover:text-white/60 transition-colors">
                <HiOutlineRefresh className="text-xs" />
              </button>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ─── sidebar item ─────────────────────────────────────────────────────────────
function SidebarItem({ chat, onClick, onDelete }) {
  const [hover, setHover] = useState(false);
  return (
    <motion.div
      whileHover={{ x: 2 }}
      onHoverStart={() => setHover(true)}
      onHoverEnd={() => setHover(false)}
      onClick={onClick}
      className={`group relative flex items-start gap-2.5 rounded-xl px-3 py-2.5 cursor-pointer transition-all
        ${chat.active
          ? "bg-violet-500/10 border border-violet-500/20"
          : "border border-transparent hover:bg-white/[0.035] hover:border-white/[0.06]"}`}
    >
      {chat.active && (
        <motion.div layoutId="activePill"
          className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-0.5 rounded-full bg-violet-400"
          style={{ left: -1 }} />
      )}
      <div className={`mt-0.5 shrink-0 text-sm ${chat.active ? "text-violet-400" : "text-white/25"}`}>
        <HiOutlineDocumentText />
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-xs font-medium truncate ${chat.active ? "text-white/90" : "text-white/55"}`}>
          {chat.title}
        </p>
        <p className="text-[10px] text-white/25 truncate mt-0.5">{chat.preview}</p>
        {chat.doc && (
          <div className="flex items-center gap-1 mt-1">
            {docIcon(chat.doc.type)}
            <span className="text-[10px] text-white/20 truncate">{chat.doc.name}</span>
          </div>
        )}
      </div>
      <AnimatePresence>
        {hover && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={(e) => { e.stopPropagation(); onDelete(chat.id); }}
            className="shrink-0 rounded-md p-1 text-white/20 hover:bg-red-500/10 hover:text-red-400 transition-colors"
          >
            <HiOutlineTrash className="text-xs" />
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── empty state ──────────────────────────────────────────────────────────────
function EmptyState({ onPrompt }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center h-full px-6 py-16 text-center">
      <motion.div
        animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.05, 1] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="relative mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-violet-500/20 bg-violet-500/8"
        style={{ boxShadow: "0 0 40px rgba(124,58,237,0.15)" }}
      >
        <BsStars className="text-4xl text-violet-400" />
        <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity }}
          className="absolute -top-1 -right-1 h-3 w-3 rounded-full border border-violet-400/40 bg-violet-500/60" />
      </motion.div>

      <h2 className="text-xl font-bold text-white/80 tracking-tight">Ask DocuMind AI</h2>
      <p className="mt-2 text-sm text-white/30 max-w-xs leading-relaxed">
        Upload a document or start a conversation. I'll analyze, summarize, and answer anything about your files.
      </p>

      <div className="mt-8 w-full max-w-sm grid grid-cols-1 gap-2">
        {SUGGESTED.map((s, i) => (
          <motion.button
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.08 + i * 0.05 }}
            whileHover={{ x: 4, backgroundColor: "rgba(255,255,255,0.04)" }}
            onClick={() => onPrompt(s.label)}
            className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.02] px-4 py-3 text-left text-sm text-white/50 hover:text-white/75 transition-all"
          >
            <span className="text-base shrink-0" style={{ color: s.color }}>{s.icon}</span>
            {s.label}
            <HiOutlineChevronRight className="ml-auto text-xs text-white/20" />
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}

// ─── main ──────────────────────────────────────────────────────────────────────
export default function ChatPage() {
  const [messages, setMessages] = useState(SEED_MESSAGES);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [history, setHistory] = useState(HISTORY);
  const [activeChat, setActiveChat] = useState(1);
  const [isEmpty, setIsEmpty] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const aiIdx = useRef(0);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const sendMessage = useCallback((text) => {
    const content = (text || input).trim();
    if (!content) return;
    setInput("");
    setIsEmpty(false);

    const userMsg = {
      id: Date.now(),
      role: "user",
      ts: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      text: content,
    };
    setMessages((m) => [...m, userMsg]);
    setTyping(true);

    const delay = 1200 + Math.random() * 900;
    setTimeout(() => {
      const aiMsg = {
        id: Date.now() + 1,
        role: "assistant",
        ts: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        text: AI_RESPONSES[aiIdx.current % AI_RESPONSES.length],
      };
      aiIdx.current++;
      setTyping(false);
      setMessages((m) => [...m, aiMsg]);
    }, delay);
  }, [input]);

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const deleteChat = (id) => setHistory((h) => h.filter((c) => c.id !== id));

  const newChat = () => {
    setMessages([]);
    setIsEmpty(true);
    setActiveChat(null);
    setHistory((h) => h.map((c) => ({ ...c, active: false })));
  };

  const selectChat = (id) => {
    setActiveChat(id);
    setIsEmpty(false);
    setMessages(id === 1 ? SEED_MESSAGES : []);
    setHistory((h) => h.map((c) => ({ ...c, active: c.id === id })));
  };

  const filteredHistory = history.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const grouped = {
    Today: filteredHistory.filter((c) => c.date === "Today"),
    Yesterday: filteredHistory.filter((c) => c.date === "Yesterday"),
    Earlier: filteredHistory.filter((c) => !["Today", "Yesterday"].includes(c.date)),
  };

  return (
    <div className="flex h-screen overflow-hidden text-white"
      style={{ background: "#09090b", fontFamily: "'Geist', 'DM Sans', sans-serif" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.06); border-radius: 99px; }
        textarea { resize: none; }
      `}</style>

      {/* ── ambient background ── */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div style={{ position:"absolute", top:"-20%", right:"-5%",  width:600, height:600, background:"radial-gradient(circle, rgba(109,40,217,0.07) 0%, transparent 70%)", borderRadius:"50%" }} />
        <div style={{ position:"absolute", bottom:"0%", left:"-5%",  width:400, height:400, background:"radial-gradient(circle, rgba(14,165,233,0.05) 0%, transparent 70%)", borderRadius:"50%" }} />
      </div>

      {/* ══════════════════════════════════════════════════
          SIDEBAR
      ══════════════════════════════════════════════════ */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            key="sidebar"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 260, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 32 }}
            className="relative z-20 flex h-full shrink-0 flex-col border-r border-white/[0.06] bg-[#0d0d0f] overflow-hidden"
            style={{ minWidth: 0 }}
          >
            <div className="flex flex-col h-full w-[260px]">
              {/* logo */}
              <div className="flex items-center justify-between px-4 pt-5 pb-4 border-b border-white/[0.05]">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-lg bg-violet-600 flex items-center justify-center text-sm"
                    style={{ boxShadow: "0 0 14px rgba(124,58,237,0.5)" }}>
                    <HiOutlineDocumentDuplicate />
                  </div>
                  <span className="text-sm font-semibold text-white/80">DocuMind</span>
                </div>
                <button onClick={() => setSidebarOpen(false)}
                  className="rounded-lg p-1.5 text-white/25 hover:bg-white/[0.05] hover:text-white/60 transition-colors">
                  <HiOutlineMenuAlt2 className="text-sm" />
                </button>
              </div>

              {/* new chat */}
              <div className="px-3 pt-3 pb-2">
                <motion.button
                  whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                  onClick={newChat}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] py-2.5 text-xs font-medium text-white/55 hover:bg-white/[0.06] hover:text-white/80 transition-all"
                >
                  <HiOutlinePlus className="text-sm" /> New Chat
                </motion.button>
              </div>

              {/* search */}
              <div className="px-3 pb-2">
                <div className="relative">
                  <HiOutlineSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 text-white/20 text-xs" />
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search chats…"
                    className="w-full rounded-lg border border-white/[0.06] bg-white/[0.02] py-2 pl-7 pr-3 text-xs text-white/60 placeholder-white/20 outline-none focus:border-violet-500/30 transition-colors"
                  />
                </div>
              </div>

              {/* history */}
              <div className="flex-1 overflow-y-auto px-2 pb-4 space-y-4">
                {Object.entries(grouped).map(([group, chats]) =>
                  chats.length > 0 && (
                    <div key={group}>
                      <p className="px-2 pb-1.5 text-[10px] font-semibold tracking-widest uppercase text-white/20">
                        {group}
                      </p>
                      <div className="space-y-0.5">
                        {chats.map((chat) => (
                          <SidebarItem
                            key={chat.id} chat={chat}
                            onClick={() => selectChat(chat.id)}
                            onDelete={deleteChat}
                          />
                        ))}
                      </div>
                    </div>
                  )
                )}
              </div>

              {/* footer */}
              <div className="border-t border-white/[0.05] px-3 py-3">
                <div className="flex items-center gap-2.5 rounded-xl px-2 py-2">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-sky-500/20 bg-sky-500/10 text-sky-400 text-xs">
                    <BsPerson />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-white/70 truncate">Alex Johnson</p>
                    <p className="text-[10px] text-white/25 truncate">Pro Plan · 142 docs</p>
                  </div>
                  <button className="text-white/20 hover:text-white/50 transition-colors">
                    <HiOutlineDotsHorizontal className="text-sm" />
                  </button>
                </div>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════════════
          MAIN
      ══════════════════════════════════════════════════ */}
      <div className="relative z-10 flex flex-1 flex-col min-w-0 overflow-hidden">

        {/* ── top bar ── */}
        <motion.header
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 border-b border-white/[0.06] bg-[#09090b]/80 px-5 py-3.5 backdrop-blur-sm shrink-0"
        >
          {!sidebarOpen && (
            <button onClick={() => setSidebarOpen(true)}
              className="rounded-lg p-1.5 text-white/30 hover:bg-white/[0.05] hover:text-white/60 transition-colors shrink-0">
              <HiOutlineMenuAlt2 className="text-base" />
            </button>
          )}

          {/* model pill */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 rounded-lg border border-violet-500/20 bg-violet-500/8 px-2.5 py-1.5">
              <motion.span animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 2, repeat: Infinity }}
                className="h-1.5 w-1.5 rounded-full bg-violet-400" />
              <span className="text-xs font-medium text-violet-300">DocuMind AI</span>
              <BsStars className="text-violet-400/60 text-[10px]" />
            </div>
          </div>

          {/* active doc */}
          {!isEmpty && (
            <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
              className="hidden sm:flex items-center gap-1.5 rounded-lg border border-white/[0.07] bg-white/[0.03] px-2.5 py-1.5">
              <BsFilePdf className="text-[#ff6b6b] text-xs" />
              <span className="text-xs text-white/40 truncate max-w-[160px]">Q4_Financial_Report.pdf</span>
            </motion.div>
          )}

          <div className="ml-auto flex items-center gap-2">
            {!isEmpty && (
              <button onClick={newChat}
                className="flex items-center gap-1.5 rounded-lg border border-white/[0.07] bg-white/[0.03] px-3 py-1.5 text-xs text-white/40 hover:bg-white/[0.06] hover:text-white/70 transition-all">
                <HiOutlinePlus className="text-xs" />
                <span className="hidden sm:inline">New Chat</span>
              </button>
            )}
            <button className="flex items-center gap-1.5 rounded-lg border border-white/[0.07] bg-white/[0.03] px-3 py-1.5 text-xs text-white/40 hover:bg-white/[0.06] hover:text-white/70 transition-all">
              <HiMiniSparkles className="text-xs text-violet-400" />
              <span className="hidden sm:inline text-violet-300/70">Summarize</span>
            </button>
          </div>
        </motion.header>

        {/* ── messages area ── */}
        <div className="flex-1 overflow-y-auto">
          {isEmpty || messages.length === 0 ? (
            <EmptyState onPrompt={(p) => { setInput(p); inputRef.current?.focus(); }} />
          ) : (
            <div className="mx-auto max-w-2xl px-4 py-8 space-y-6">
              <AnimatePresence initial={false}>
                {messages.map((msg, i) => (
                  <MessageBubble key={msg.id} msg={msg} isLast={i === messages.length - 1} />
                ))}
                {typing && <TypingIndicator key="typing" />}
              </AnimatePresence>
              <div ref={bottomRef} />
            </div>
          )}
        </div>

        {/* ── suggested prompts strip (when has messages) ── */}
        {!isEmpty && messages.length > 0 && !typing && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-t border-white/[0.04] bg-[#09090b]/60 backdrop-blur-sm px-4 py-2 flex items-center gap-2 overflow-x-auto shrink-0"
            style={{ scrollbarWidth: "none" }}
          >
            <span className="text-[10px] text-white/20 shrink-0 font-mono uppercase tracking-widest">Try:</span>
            {SUGGESTED.slice(0, 4).map((s, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => sendMessage(s.label)}
                className="flex shrink-0 items-center gap-1.5 rounded-lg border border-white/[0.07] bg-white/[0.025] px-3 py-1.5 text-xs text-white/40 hover:border-white/[0.12] hover:text-white/65 transition-all whitespace-nowrap"
              >
                <span style={{ color: s.color }}>{s.icon}</span>
                {s.label}
              </motion.button>
            ))}
          </motion.div>
        )}

        {/* ── input area ── */}
        <div className="border-t border-white/[0.06] bg-[#09090b]/90 backdrop-blur-md px-4 py-4 shrink-0">
          <div className="mx-auto max-w-2xl">
            <motion.div
              animate={input.length > 0
                ? { boxShadow: "0 0 0 1px rgba(124,58,237,0.3), 0 8px 32px rgba(0,0,0,0.4)" }
                : { boxShadow: "0 0 0 1px rgba(255,255,255,0.06), 0 4px 16px rgba(0,0,0,0.3)" }}
              className="relative flex items-end gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.03] px-4 py-3 transition-all"
            >
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Ask anything about your document…"
                rows={1}
                className="flex-1 bg-transparent text-sm text-white/85 placeholder-white/25 outline-none leading-relaxed"
                style={{
                  maxHeight: 160, overflowY: "auto",
                  fontFamily: "inherit",
                  lineHeight: "1.6",
                }}
                onInput={(e) => {
                  e.target.style.height = "auto";
                  e.target.style.height = Math.min(e.target.scrollHeight, 160) + "px";
                }}
              />
              <motion.button
                whileHover={input.trim() ? { scale: 1.08 } : {}}
                whileTap={input.trim() ? { scale: 0.92 } : {}}
                onClick={() => sendMessage()}
                disabled={!input.trim() || typing}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition-all"
                style={{
                  background: input.trim() && !typing
                    ? "linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)"
                    : "rgba(255,255,255,0.05)",
                  boxShadow: input.trim() && !typing ? "0 4px 14px rgba(124,58,237,0.4)" : "none",
                }}
              >
                <HiOutlinePaperAirplane
                  className={`text-sm rotate-90 transition-colors ${input.trim() && !typing ? "text-white" : "text-white/20"}`}
                />
              </motion.button>
            </motion.div>
            <p className="mt-2 text-center text-[10px] text-white/15">
              Press <kbd className="rounded border border-white/10 bg-white/[0.04] px-1 py-0.5 font-mono text-[9px]">Enter</kbd> to send
              · <kbd className="rounded border border-white/10 bg-white/[0.04] px-1 py-0.5 font-mono text-[9px]">Shift+Enter</kbd> for new line
              · Powered by <span className="text-violet-400/40">DocuMind AI</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}