"use client";

import { motion } from "framer-motion";

const BAR_COUNT = 48;

function seededHeights() {
  // deterministic pseudo-random heights so SSR/CSR match
  const heights: number[] = [];
  let seed = 42;
  for (let i = 0; i < BAR_COUNT; i++) {
    seed = (seed * 9301 + 49297) % 233280;
    const rnd = seed / 233280;
    heights.push(0.25 + rnd * 0.75);
  }
  return heights;
}

const HEIGHTS = seededHeights();

export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="bg-grain pointer-events-none absolute inset-0 opacity-40" />
      <div
        className="pointer-events-none absolute -top-40 left-1/2 h-[480px] w-[820px] -translate-x-1/2 rounded-full opacity-30 blur-3xl"
        style={{ background: "radial-gradient(circle, #7C5CFF 0%, transparent 70%)" }}
      />

      <div className="relative mx-auto max-w-6xl px-6 pb-16 pt-20 md:pt-28">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-live animate-pulseGlow" />
            Powered by Sarvam AI
          </span>
          <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.1] tracking-tight text-ink md:text-6xl">
            Create polished voiceovers
            <br />
            in Indian languages.
          </h1>
          <p className="mx-auto mt-5 max-w-lg text-base text-muted md:text-lg">
            Type your script, choose a voice and language, then fine-tune pace, pitch,
            and loudness before downloading broadcast-ready audio.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mx-auto mt-14 flex h-24 max-w-3xl items-end justify-center gap-[3px] md:h-28"
        >
          {HEIGHTS.map((h, i) => (
            <motion.span
              key={i}
              className="w-[5px] flex-1 origin-bottom rounded-full md:w-2"
              style={{
                background: i % 7 === 0 ? "#FFB74D" : "#7C5CFF",
                height: `${h * 100}%`,
              }}
              initial={{ scaleY: 0.15, opacity: 0.4 }}
              animate={{ scaleY: [0.3, h, 0.5, h * 0.8, h], opacity: 1 }}
              transition={{
                duration: 2.4 + (i % 5) * 0.3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.02,
              }}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
