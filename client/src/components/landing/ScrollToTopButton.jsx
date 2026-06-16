import { useEffect, useState } from "react";
import { HiArrowUp } from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";

export default function ScrollToTopButton() {
  const [visible, setVisible] =
    useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(
        window.scrollY > 100
      );
    };

    window.addEventListener(
      "scroll",
      handleScroll
    );

    return () =>
      window.removeEventListener(
        "scroll",
        handleScroll
      );
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{
            opacity: 0,
            scale: 0.8,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          exit={{
            opacity: 0,
            scale: 0.8,
          }}
          whileHover={{
            scale: 1.08,
          }}
          whileTap={{
            scale: 0.95,
          }}
          onClick={scrollToTop}
          className="
          fixed
          bottom-6
          right-6
          z-50
          w-12
          h-12
          rounded-full
          bg-gradient-to-r
          from-cyan-500
          to-indigo-500
          text-white
          shadow-lg
          flex
          items-center
          justify-center
          "
        >
          <HiArrowUp size={22} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}