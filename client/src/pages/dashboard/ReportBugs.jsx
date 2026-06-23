import React, { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { submitBugReport } from "../../services/dashboardService";
import {
  FiSend,
  FiAlertTriangle,
  FiCheckCircle,
  FiInfo,
} from "react-icons/fi";
import { Bug } from "lucide-react";

const ISSUE_TYPES = [
  "UI/UX Glitch",
  "Functionality Broken",
  "Performance Issue",
  "Feature Request",
  "Other",
];

const SEVERITIES = [
  { level: "Low", color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
  { level: "Medium", color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
  { level: "High", color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20" },
  { level: "Critical", color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20" },
];

export default function ReportBugs() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    type: "UI/UX Glitch",
    severity: "Medium",
    subject: "",
    description: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.subject.trim() || !formData.description.trim()) {
      return toast.error("Please provide a subject and description.");
    }

    setLoading(true);
    try {
      await submitBugReport(formData);
      setSuccess(true);
      toast.success("Bug report submitted successfully!");
      setFormData({ type: "UI/UX Glitch", severity: "Medium", subject: "", description: "" });
      
      // Reset success state after a few seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to submit report.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F19]" style={{ fontFamily: "'Poppins', sans-serif" }}>
      {/* Ambient blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div animate={{ scale: [1, 1.1, 1], opacity: [0.05, 0.1, 0.05] }} transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-red-600 blur-[150px] rounded-full" />
        <motion.div animate={{ scale: [1, 1.15, 1], opacity: [0.03, 0.07, 0.03] }} transition={{ duration: 12, repeat: Infinity, delay: 2 }}
          className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-orange-600 blur-[150px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-10">
        
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
              <Bug className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-white font-bold text-2xl tracking-tight">Report a Bug</h1>
              <p className="text-gray-500 text-sm mt-0.5">Help us improve by reporting issues or requesting features.</p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Form Section */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="lg:col-span-2">
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl p-6 sm:p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Issue Type */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Issue Type</label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3.5 text-sm text-white outline-none focus:border-red-500/50 focus:bg-white/[0.05] transition-all cursor-pointer appearance-none"
                    >
                      {ISSUE_TYPES.map((type) => (
                        <option key={type} value={type} className="bg-[#111827]">{type}</option>
                      ))}
                    </select>
                  </div>

                  {/* Severity */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Severity</label>
                    <div className="flex gap-2">
                      {SEVERITIES.map((sev) => (
                        <button
                          key={sev.level}
                          type="button"
                          onClick={() => setFormData({ ...formData, severity: sev.level })}
                          className={`flex-1 py-3 rounded-xl text-xs font-semibold transition-all duration-200 border ${
                            formData.severity === sev.level
                              ? `${sev.bg} ${sev.border} ${sev.color}`
                              : "border-white/5 bg-white/[0.02] text-gray-500 hover:bg-white/[0.05]"
                          }`}
                        >
                          {sev.level}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Brief description of the issue"
                    className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3.5 text-sm text-white placeholder-gray-600 outline-none focus:border-red-500/50 focus:bg-white/[0.05] transition-all"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Detailed Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="6"
                    placeholder="Steps to reproduce, expected behavior, and what actually happened..."
                    className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3.5 text-sm text-white placeholder-gray-600 outline-none focus:border-red-500/50 focus:bg-white/[0.05] transition-all resize-none"
                  ></textarea>
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <motion.button
                    whileHover={!loading ? { scale: 1.02, boxShadow: "0 0 20px rgba(239,68,68,0.3)" } : {}}
                    whileTap={!loading ? { scale: 0.98 } : {}}
                    type="submit"
                    disabled={loading}
                    className={`w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                      success 
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" 
                        : "bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg"
                    }`}
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                        Submitting...
                      </>
                    ) : success ? (
                      <>
                        <FiCheckCircle className="text-lg" />
                        Report Submitted
                      </>
                    ) : (
                      <>
                        <FiSend className="text-lg" />
                        Submit Report
                      </>
                    )}
                  </motion.button>
                </div>

              </form>
            </div>
          </motion.div>

          {/* Guidelines / Info Section */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="space-y-4">
            
            <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-6">
              <div className="flex items-center gap-2 mb-3 text-blue-400">
                <FiInfo className="text-lg" />
                <h3 className="font-semibold text-sm">How to write a good report</h3>
              </div>
              <ul className="space-y-3 text-xs text-blue-200/70 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="mt-1 w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                  Be specific. "Upload is broken" is hard to debug. "PDF upload hangs at 99%" is much better.
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                  Include the steps required to reproduce the issue.
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                  Mention what browser or device you were using when the bug occurred.
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-white/5 bg-[#111827] p-6">
              <div className="flex items-center gap-2 mb-3 text-gray-300">
                <FiAlertTriangle className="text-lg" />
                <h3 className="font-semibold text-sm">Severity Guide</h3>
              </div>
              <div className="space-y-4 text-xs text-gray-500">
                <div>
                  <span className="text-red-400 font-semibold block mb-0.5">Critical</span>
                  System crash, data loss, or core feature completely broken.
                </div>
                <div>
                  <span className="text-orange-400 font-semibold block mb-0.5">High</span>
                  Major feature broken but a workaround exists.
                </div>
                <div>
                  <span className="text-amber-400 font-semibold block mb-0.5">Medium</span>
                  Minor feature broken or UI glitches causing friction.
                </div>
              </div>
            </div>

          </motion.div>
        </div>
      </div>
    </div>
  );
}