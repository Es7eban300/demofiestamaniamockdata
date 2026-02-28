"use client";

import { motion } from "framer-motion";

const SHAPES = [
  { x: "8%", y: "20%", color: "#FF3B7B", size: 10, delay: 0 },
  { x: "15%", y: "65%", color: "#00BCBC", size: 7, delay: 0.5 },
  { x: "5%", y: "45%", color: "#FFD6E0", size: 12, delay: 1 },
  { x: "88%", y: "15%", color: "#FF3B7B", size: 8, delay: 0.3 },
  { x: "92%", y: "55%", color: "#00BCBC", size: 10, delay: 0.8 },
  { x: "80%", y: "75%", color: "#FFD6E0", size: 6, delay: 1.2 },
  { x: "45%", y: "5%", color: "#FF3B7B", size: 9, delay: 0.6 },
  { x: "60%", y: "90%", color: "#00BCBC", size: 8, delay: 0.2 },
];

export function ConfettiDecoration({ className }: { className?: string }) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className ?? ""}`}>
      {SHAPES.map((s, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full opacity-70"
          style={{
            left: s.x,
            top: s.y,
            width: s.size,
            height: s.size,
            backgroundColor: s.color,
          }}
          animate={{ y: [0, -14, 0], rotate: [0, 180, 360] }}
          transition={{
            duration: 3 + s.delay,
            repeat: Infinity,
            ease: "easeInOut",
            delay: s.delay,
          }}
        />
      ))}
      {/* Stars */}
      {[
        { x: "20%", y: "30%", delay: 0.4 },
        { x: "75%", y: "40%", delay: 1.1 },
        { x: "50%", y: "15%", delay: 0.7 },
      ].map((s, i) => (
        <motion.div
          key={`star-${i}`}
          className="absolute text-yellow-400 text-lg"
          style={{ left: s.x, top: s.y }}
          animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity, delay: s.delay }}
        >
          ✦
        </motion.div>
      ))}
    </div>
  );
}
