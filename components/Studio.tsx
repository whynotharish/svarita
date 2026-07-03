"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wand2, Loader2, Save } from "lucide-react";
import DecimalSlider from "./DecimalSlider";
import WaveformPlayer from "./WaveformPlayer";
import { LANGUAGES, SPEAKERS, SAMPLE_RATES, MAX_CHARS, DEFAULT_SETTINGS, GenerationSettings } from "@/lib/constants";
import { base64ToBlobUrl, base64ToBlob, slugify } from "@/lib/audio";
import { useAuth } from "@/context/AuthContext";
import { saveHistoryEntry } from "@/lib/userData";

export default function Studio() {
  const { user } = useAuth();
  const [text, setText] = useState("");
  const [settings, setSettings] = useState<GenerationSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBase64, setAudioBase64] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [savingHistory, setSavingHistory] = useState(false);

  const charCount = text.length;
  const overLimit = charCount > MAX_CHARS;

  const update = (patch: Partial<GenerationSettings>) => setSettings((s) => ({ ...s, ...patch }));

  const handleGenerate = async () => {
    if (!text.trim() || overLimit || loading) return;
    setLoading(true);
    setError(null);
    setAudioUrl(null);
    setSaved(false);
    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          languageCode: settings.languageCode,
          speaker: settings.speaker,
          pace: settings.pace,
          temperature: settings.temperature,
          sampleRate: settings.sampleRate,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed.");
      setAudioBase64(data.audioBase64);
      setAudioUrl(base64ToBlobUrl(data.audioBase64));
    } catch (e: any) {
      setError(e?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToHistory = async () => {
    if (!user || !audioBase64 || savingHistory) return;
    setSavingHistory(true);
    try {
      const blob = base64ToBlob(audioBase64);
      await saveHistoryEntry(user.uid, { text, settings, blob });
      setSaved(true);
    } catch (e: any) {
      console.error("Save to history failed:", e);
      setError(`Could not save to history: ${e?.code || e?.message || "unknown error"}`);
    } finally {
      setSavingHistory(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      {/* Left: text + result */}
      <div className="space-y-4">
        <div className="rounded-2xl border border-border bg-surface p-5">
          <div className="mb-3 flex items-center justify-between">
            <label className="text-xs font-medium uppercase tracking-wide text-muted">Script</label>
            <span className={`font-mono text-xs ${overLimit ? "text-red-400" : "text-muted"}`}>
              {charCount} / {MAX_CHARS}
            </span>
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="ನಮಸ್ಕಾರ! ಸ್ವರಿತಾಗೆ ಸ್ವಾಗತ. ನಿಮ್ಮ ಆಲೋಚನೆಗಳಿಗೆ ಈಗ ಧ್ವನಿ ನೀಡಿ. ಕನ್ನಡ, ಹಿಂದಿ, ತೆಲುಗು, ತಮಿಳು ಸೇರಿದಂತೆ ಅನೇಕ ಭಾರತೀಯ ಭಾಷೆಗಳಲ್ಲಿ ಸಹಜ ಮತ್ತು ಸ್ಪಷ್ಟವಾದ ಧ್ವನಿಯನ್ನು ಕ್ಷಣಾರ್ಧದಲ್ಲಿ ರಚಿಸಿ"
            rows={9}
            className="w-full resize-none bg-transparent text-[15px] leading-relaxed text-ink outline-none placeholder:text-muted/60"
          />
          <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
            <p className="text-xs text-muted">~{Math.max(1, Math.round(charCount / 14))}s estimated audio</p>
            <button
              onClick={handleGenerate}
              disabled={!text.trim() || overLimit || loading}
              className="flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-40"
            >
              {loading ? <Loader2 size={15} className="animate-spin" /> : <Wand2 size={15} />}
              {loading ? "Generating…" : "Generate audio"}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300"
            >
              {error}
            </motion.div>
          )}

          {audioUrl && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              <WaveformPlayer src={audioUrl} filename={`${slugify(text)}.wav`} />
              {user ? (
                <button
                  onClick={handleSaveToHistory}
                  disabled={savingHistory || saved}
                  className="flex items-center gap-2 text-sm text-muted transition-colors hover:text-accent disabled:opacity-60"
                >
                  <Save size={13} />
                  {saved ? "Saved to history" : savingHistory ? "Saving…" : "Save to my history"}
                </button>
              ) : (
                <p className="text-xs text-muted">Sign in to save this generation to your history.</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Right: settings */}
      <div className="space-y-5">
        <div className="rounded-2xl border border-border bg-surface p-5">
          <h3 className="mb-4 font-display text-sm font-semibold text-ink">Voice settings</h3>

          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-muted">
                Language
              </label>
              <select
                value={settings.languageCode}
                onChange={(e) => update({ languageCode: e.target.value })}
                className="w-full rounded-lg border border-border bg-surface-elevated px-3 py-2 text-sm text-ink outline-none focus:border-accent"
              >
                {LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.label} · {l.native}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-muted">
                Voice
              </label>
              <select
                value={settings.speaker}
                onChange={(e) => update({ speaker: e.target.value })}
                className="w-full rounded-lg border border-border bg-surface-elevated px-3 py-2 text-sm text-ink outline-none focus:border-accent"
              >
                {SPEAKERS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label} · {s.gender}
                  </option>
                ))}
              </select>
            </div>

            <DecimalSlider
              label="Speed"
              value={settings.pace}
              min={0.5}
              max={2.0}
              step={0.01}
              onChange={(v) => update({ pace: v })}
            />
            <DecimalSlider
              label="Expressiveness"
              value={settings.temperature}
              min={0.01}
              max={1.0}
              step={0.01}
              onChange={(v) => update({ temperature: v })}
            />

            <div>
              <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-muted">
                Quality (sample rate)
              </label>
              <select
                value={settings.sampleRate}
                onChange={(e) => update({ sampleRate: parseInt(e.target.value) })}
                className="w-full rounded-lg border border-border bg-surface-elevated px-3 py-2 text-sm text-ink outline-none focus:border-accent"
              >
                {SAMPLE_RATES.map((r) => (
                  <option key={r} value={r}>
                    {r / 1000}kHz {r >= 22050 ? "(High)" : r >= 16000 ? "(Standard)" : "(Low)"}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
