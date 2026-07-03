"use client";

import { useState } from "react";
import { Plus, Trash2, Loader2, Layers, FolderDown } from "lucide-react";
import WaveformPlayer from "./WaveformPlayer";
import { LANGUAGES, SPEAKERS, MAX_CHARS, DEFAULT_SETTINGS } from "@/lib/constants";
import { base64ToBlobUrl, base64ToBlob, slugify } from "@/lib/audio";

type BatchItem = { id: string; text: string };
type BatchResult = { index: number; text: string; audioBase64?: string; error?: string };

export default function BatchPanel() {
  const [items, setItems] = useState<BatchItem[]>([
    { id: crypto.randomUUID(), text: "" },
    { id: crypto.randomUUID(), text: "" },
  ]);
  const [languageCode, setLanguageCode] = useState(DEFAULT_SETTINGS.languageCode);
  const [speaker, setSpeaker] = useState(DEFAULT_SETTINGS.speaker);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<BatchResult[]>([]);

  const addItem = () => setItems((it) => [...it, { id: crypto.randomUUID(), text: "" }]);
  const removeItem = (id: string) => setItems((it) => it.filter((i) => i.id !== id));
  const updateItem = (id: string, text: string) =>
    setItems((it) => it.map((i) => (i.id === id ? { ...i, text } : i)));

  const handleGenerateAll = async () => {
    const texts = items.map((i) => i.text.trim()).filter(Boolean);
    if (texts.length === 0) return;
    setLoading(true);
    setError(null);
    setResults([]);
    try {
      const res = await fetch("/api/batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: texts, languageCode, speaker }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Batch generation failed.");
      setResults(data.results);
    } catch (e: any) {
      setError(e?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadAll = async () => {
    const ok = results.filter((r) => r.audioBase64);
    if (ok.length === 0) return;
    const JSZip = (await import("jszip")).default;
    const zip = new JSZip();
    ok.forEach((r) => {
      zip.file(`${String(r.index + 1).padStart(2, "0")}-${slugify(r.text)}.wav`, base64ToBlob(r.audioBase64!));
    });
    const blob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "svarita-batch.zip";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-border bg-surface p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-ink">
            <Layers size={16} className="text-accent" />
            <h3 className="font-display text-sm font-semibold">Batch generation</h3>
          </div>
          <div className="flex gap-2">
            <select
              value={languageCode}
              onChange={(e) => setLanguageCode(e.target.value)}
              className="rounded-lg border border-border bg-surface-elevated px-2.5 py-1.5 text-xs text-ink outline-none focus:border-accent"
            >
              {LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.label}
                </option>
              ))}
            </select>
            <select
              value={speaker}
              onChange={(e) => setSpeaker(e.target.value)}
              className="rounded-lg border border-border bg-surface-elevated px-2.5 py-1.5 text-xs text-ink outline-none focus:border-accent"
            >
              {SPEAKERS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-2">
          {items.map((item, idx) => (
            <div key={item.id} className="flex items-start gap-2">
              <span className="mt-2.5 w-5 flex-shrink-0 font-mono text-xs text-muted">
                {String(idx + 1).padStart(2, "0")}
              </span>
              <textarea
                value={item.text}
                onChange={(e) => updateItem(item.id, e.target.value.slice(0, MAX_CHARS))}
                placeholder={`Line ${idx + 1} script…`}
                rows={2}
                className="flex-1 resize-none rounded-lg border border-border bg-surface-elevated px-3 py-2 text-sm text-ink outline-none focus:border-accent"
              />
              <button
                onClick={() => removeItem(item.id)}
                className="mt-2.5 flex-shrink-0 text-muted transition-colors hover:text-red-400"
                aria-label="Remove line"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
          <button
            onClick={addItem}
            className="flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-ink"
          >
            <Plus size={14} /> Add line
          </button>
          <button
            onClick={handleGenerateAll}
            disabled={loading || items.every((i) => !i.text.trim())}
            className="flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover disabled:opacity-40"
          >
            {loading ? <Loader2 size={15} className="animate-spin" /> : <Layers size={15} />}
            {loading ? "Generating batch…" : `Generate ${items.filter((i) => i.text.trim()).length} clips`}
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {results.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted">
              {results.filter((r) => r.audioBase64).length} of {results.length} generated
            </p>
            <button
              onClick={handleDownloadAll}
              className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs text-ink transition-colors hover:border-accent hover:text-accent"
            >
              <FolderDown size={13} /> Download all (.zip)
            </button>
          </div>
          {results.map((r) =>
            r.audioBase64 ? (
              <div key={r.index}>
                <p className="mb-1.5 truncate text-xs text-muted">{r.text}</p>
                <WaveformPlayer src={base64ToBlobUrl(r.audioBase64)} filename={`${slugify(r.text)}.wav`} />
              </div>
            ) : (
              <div key={r.index} className="rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-2 text-xs text-red-300">
                Line {r.index + 1}: {r.error}
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
