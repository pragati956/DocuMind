import React from "react";
import { motion } from "framer-motion";
import { FiArrowRight, FiPlay } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useState,useEffect }
from "react";
import DemoModal from "./DemoModal";


export default function CTASection() {
  const [showDemo,setShowDemo] =
 useState(false);
  const [stats,setStats] =
 useState({
  totalDocuments:0,
  totalUsers:0,
  totalSummaries:0
 });
 useEffect(()=>{

 const loadStats =
 async()=>{

  try{

   const res =
    await fetch(
`${import.meta.env.VITE_API_URL}/dashboard/public-stats`
    );

   const data =
    await res.json();

   if(data.success){

    setStats(data);

   }

  }catch(error){

   console.error(error);

  }

 };

 loadStats();

},[]);
  return (
    <>
<section className="relative overflow-hidden bg-[#0B0F19] py-20 md:py-28">
      {/* BACKGROUND GLOW */}
      <div className="absolute inset-0 overflow-hidden">

        <div
          className="
            absolute
            top-1/2
            left-1/2
            -translate-x-1/2
            -translate-y-1/2
            w-[700px]
            h-[700px]
            bg-cyan-500/10
            blur-[180px]
            rounded-full
            motion-safe:animate-pulse
          "
        />

        <div
          className="
            absolute
            bottom-0
            right-0
            w-[400px]
            h-[400px]
            bg-indigo-500/10
            blur-[140px]
            rounded-full
          "
        />

      </div>

<div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        {/* CTA CARD */}
        <motion.div
          initial={{
            opacity: 0,
            y: 40,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.8,
          }}
          viewport={{ once: true }}
          className="
            relative
            overflow-hidden
            rounded-[2.5rem]
            border border-white/10
            bg-white/5
            backdrop-blur-2xl
            px-5
sm:px-8
md:px-16
py-14
md:py-20
            text-center
            shadow-[0_0_80px_rgba(15,23,42,0.65)]
          "
        >

          {/* INNER GLOW */}
          <div
            className="
              absolute
              inset-0
              bg-gradient-to-br
              from-cyan-500/5
              to-indigo-500/5
            "
          />

          {/* CONTENT */}
          <div className="relative z-10 max-w-4xl mx-auto">

            {/* BADGE */}
            <motion.div
              initial={{
                opacity: 0,
                y: 20,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.1,
              }}
              viewport={{ once: true }}
              className="
                inline-flex
                items-center
                gap-2
                px-5 py-2
                rounded-full
                border border-white/10
                bg-white/5
                backdrop-blur-xl
                mb-8
              "
            >
              <span className="text-cyan-300 text-sm font-medium">
                AI Powered Productivity
              </span>
            </motion.div>

            {/* HEADING */}
            <motion.h2
              initial={{
                opacity: 0,
                y: 30,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.8,
                delay: 0.2,
              }}
              viewport={{ once: true }}
              className="
                text-3xl
sm:text-4xl
md:text-6xl
                font-bold
                tracking-tight
                leading-tight
                text-white
              "
            >
              Transform Your
              <span
                className="
                  block
                  mt-2
                  text-transparent
                  bg-clip-text
                  bg-gradient-to-r
                  from-cyan-400
                  to-indigo-500
                "
              >
                Document Workflow with AI
              </span>
            </motion.h2>

            {/* SUBHEADING */}
            <motion.p
              initial={{
                opacity: 0,
              }}
              whileInView={{
                opacity: 1,
              }}
              transition={{
                delay: 0.3,
              }}
              viewport={{ once: true }}
              className="
                mt-8
                text-lg
                md:text-xl
                text-gray-400
                leading-relaxed
                max-w-2xl
                mx-auto
              "
            >
              Automate document processing, generate AI summaries,
              search intelligently and collaborate seamlessly with
              the power of modern AI workflows.
            </motion.p>
            <div
 className="
 mt-8
 flex
 flex-wrap
 justify-center
 gap-6
 text-sm
 text-gray-400
 "
>

 <span>
  {stats.totalDocuments}+
  Documents
 </span>

 <span>
  {stats.totalSummaries}+
  Summaries
 </span>

 <span>
  {stats.totalUsers}+
  Users
 </span>

</div>

            {/* BUTTONS */}
            <div
              className="
                mt-12
                flex
                flex-col
                sm:flex-row
                items-center
                justify-center
                gap-5
              "
            >

              {/* PRIMARY BUTTON */}
             <Link to="/register">

<motion.button
 aria-label="Get Started"
 whileHover={{
  scale:1.05
 }}
 whileTap={{
  scale:0.96
 }}
 className="
 w-full
 sm:w-auto
 group
 flex
 items-center
 justify-center
 gap-2
 px-8
 py-4
 rounded-2xl
 bg-gradient-to-r
 from-cyan-500
 to-indigo-500
 text-white
 font-semibold
 shadow-[0_0_35px_rgba(59,130,246,0.45)]
 transition-all
 duration-300
 "
>

 Get Started

 <FiArrowRight
  className="
   group-hover:translate-x-1
   transition-transform
  "
 />

</motion.button>

</Link>

              {/* SECONDARY BUTTON */}
              

<motion.button
 onClick={() =>
  setShowDemo(true)
 }
 aria-label="Watch Demo"
 whileHover={{
  scale:1.03
 }}
 whileTap={{
  scale:0.96
 }}
 className="
 flex
 w-full
 sm:w-auto
 items-center
 justify-center
 gap-3
 px-8
 py-4
 rounded-2xl
 border border-white/10
 bg-white/5
 backdrop-blur-xl
 text-white
 transition-all
 duration-300
 hover:border-cyan-500/30
 hover:bg-white/10
 "
>

 <FiPlay />

 Watch Demo

</motion.button>


            </div>

          </div>
        </motion.div>

      </div>
    </section>
    <DemoModal
 isOpen={showDemo}
 onClose={() =>
  setShowDemo(false)
 }
/>

</>
  );
}