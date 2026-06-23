import { motion, AnimatePresence } from "framer-motion";

export default function DemoModal({
  isOpen,
  onClose,
}) {

  if (!isOpen) return null;

  return (

    <AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="
          fixed
          inset-0
          z-[9999]
          bg-black/80
          backdrop-blur-sm
          flex
          items-center
          justify-center
          p-4
        "
      >

        <motion.div
          initial={{
            opacity: 0,
            scale: 0.9,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          exit={{
            opacity: 0,
            scale: 0.9,
          }}
          transition={{
            duration: 0.25,
          }}
          onClick={(e) =>
            e.stopPropagation()
          }
          className="
            relative
            w-full
            max-w-5xl
            aspect-video
            rounded-3xl
            overflow-hidden
            bg-black
            border
            border-white/10
          "
        >

          {/* Close Button */}

          <button
            onClick={onClose}
            className="
              absolute
              top-4
              right-4
              z-10
              w-10
              h-10
              rounded-full
              bg-black/70
              text-white
              hover:bg-black
              transition
            "
          >
            ✕
          </button>

          {/* Youtube Video */}

          <iframe
            className="
              w-full
              h-full
            "
src="https://www.youtube.com/embed/T9_klZILJXU"
            title="DocuMind Demo"
            allow="
              accelerometer;
              autoplay;
              clipboard-write;
              encrypted-media;
              gyroscope;
              picture-in-picture
            "
            allowFullScreen
          />

        </motion.div>

      </motion.div>

    </AnimatePresence>

  );
}