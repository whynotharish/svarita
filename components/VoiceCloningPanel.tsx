"use client";

import { Sparkles, Mail } from "lucide-react";

export default function VoiceCloningPanel() {
  return (
    <div className="rounded-2xl border border-border bg-surface p-6">
      <div className="flex items-center gap-2 text-ink">
        <Sparkles size={16} className="text-amber" />
        <h3 className="font-display text-base font-semibold">Voice cloning</h3>
        <span className="rounded-full bg-amber-soft px-2 py-0.5 text-[11px] font-medium text-amber">
          Enterprise
        </span>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-muted">
        Sarvam's voice cloning isn't available as a self-serve API call today — it's a
        consent-based process for enterprise accounts: you send a 30–60 second sample,
        confirm consent from the voice owner, and their team builds the custom voice on
        their end. There's no endpoint this app can call directly to clone a voice
        on-demand.
      </p>
      <p className="mt-3 text-sm leading-relaxed text-muted">
        To request one for a Udaan brand voice, reach out with your sample and consent
        confirmation:
      </p>
      <a
        href="mailto:developer@sarvam.ai?subject=Voice%20cloning%20request%20-%20Voice%20Studio%20Udaan"
        className="mt-4 inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm text-ink transition-colors hover:border-accent hover:text-accent"
      >
        <Mail size={14} /> developer@sarvam.ai
      </a>
    </div>
  );
}
