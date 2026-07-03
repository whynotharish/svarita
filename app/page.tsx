"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Studio from "@/components/Studio";
import BatchPanel from "@/components/BatchPanel";
import VoiceCloningPanel from "@/components/VoiceCloningPanel";
import HistoryPanel from "@/components/HistoryPanel";
import { Mic2, Layers, Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";


const TABS = [
  { id: "single", label: "Single script", icon: Mic2 },
  { id: "batch", label: "Batch", icon: Layers },
  { id: "cloning", label: "Voice cloning", icon: Sparkles },
] as const;

export default function Home() {
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("single");

  return (
    <main>
      <Navbar />
      <Hero />

      <section id="studio" className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <div className="mb-8 flex items-center gap-1 rounded-full border border-border bg-surface p-1 w-fit">
          {TABS.map((t) => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`relative flex items-center gap-1.5 rounded-full px-4 py-2 text-sm transition-colors ${
                  active ? "text-white" : "text-muted hover:text-ink"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="tab-pill"
                    className="absolute inset-0 rounded-full bg-accent"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                  />
                )}
                <span className="relative flex items-center gap-1.5">
                  <Icon size={14} /> {t.label}
                </span>
              </button>
            );
          })}
        </div>

        <div id="batch">
          {tab === "single" && <Studio />}
          {tab === "batch" && <BatchPanel />}
          {tab === "cloning" && <VoiceCloningPanel />}
        </div>
      </section>

      <section id="history" className="border-t border-border bg-surface/40">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
          <div className="mb-8">
            <h2 className="font-display text-2xl font-semibold text-ink md:text-3xl">Your history</h2>
            <p className="mt-2 text-sm text-muted">Every clip you've saved, tied to your Udaan account.</p>
          </div>
          <HistoryPanel />
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 py-8 text-xs text-muted md:flex-row">
          <span>Svarita — Udaan's internal voice studio for grocery &amp; organic campaigns.</span>
          <span>Speech by Sarvam AI · Built by Claude</span>
        </div>
      </footer>
    </main>
  );
}
