"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wallet } from "lucide-react";

export function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      setTimeout(onComplete, 500); // Allow exit animation to finish
    }, 2500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-surface dark:bg-zinc-950 px-6"
        >
          <div className="flex flex-col items-center text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
              className="w-24 h-24 rounded-3xl primary-gradient flex items-center justify-center mb-8 shadow-2xl"
            >
              <Wallet className="text-white w-12 h-12" />
            </motion.div>
            
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-4xl font-headline font-extrabold tracking-tight text-primary dark:text-purple-400 mb-2"
            >
              Pix Flow
            </motion.h1>
            
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="text-muted-foreground text-sm font-label tracking-wide uppercase"
            >
              Simples. Rápido. Instantâneo.
            </motion.p>
          </div>

          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 140 }}
            transition={{ delay: 0.8, duration: 1.5 }}
            className="mt-12 h-1 bg-[#2e0052] rounded-full overflow-hidden dark:bg-purple-900"
          >
            <motion.div
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="h-full w-1/2 bg-white/40 dark:bg-purple-400/40"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
