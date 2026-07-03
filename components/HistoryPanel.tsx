"use client";

import { useEffect, useState } from "react";
import { Trash2, History as HistoryIcon } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { listenToHistory, deleteHistoryEntry } from "@/lib/userData";
import WaveformPlayer from "./WaveformPlayer";
import { LANGUAGES } from "@/lib/constants";

export default function HistoryPanel() {
  const { user, signInWithGoogle } = useAuth();
  const [entries, setEntries] = useState<any[]>([]);

  useEffect(() => {
    if (!user) {
      setEntries([]);
      return;
    }
    return listenToHistory(user.uid, setEntries);
  }, [user]);

  if (!user) {
    return (
      <div className="rounded-2xl border border-dashed border-border p-10 text-center">
        <HistoryIcon className="mx-auto mb-3 text-muted" size={22} />
        <p className="text-sm text-muted">
          <button onClick={() => signInWithGoogle()} className="text-accent hover:underline">
            Sign in with Google
          </button>{" "}
          to see your saved voiceovers here.
        </p>
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted">
        Nothing saved yet. Generate a clip in the Studio and hit "Save to my history".
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {entries.map((e) => {
        const lang = LANGUAGES.find((l) => l.code === e.languageCode);
        return (
          <div key={e.id} className="rounded-xl border border-border bg-surface p-4">
            <div className="mb-2 flex items-start justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="rounded-full bg-accent-soft px-2 py-0.5 font-medium text-accent">
                  {lang?.label || e.languageCode}
                </span>
                <span className="rounded-full bg-surface-elevated px-2 py-0.5 capitalize text-muted">
                  {e.speaker}
                </span>
                <span className="text-muted">
                  {e.createdAt?.toDate ? e.createdAt.toDate().toLocaleString() : ""}
                </span>
              </div>
              <button
                onClick={() => deleteHistoryEntry(user.uid, e.id, e.storagePath)}
                className="flex-shrink-0 text-muted transition-colors hover:text-red-400"
                aria-label="Delete"
              >
                <Trash2 size={14} />
              </button>
            </div>
            <p className="mb-3 line-clamp-2 text-sm text-ink">{e.text}</p>
            <WaveformPlayer src={e.audioUrl} filename={`${e.id}.wav`} />
          </div>
        );
      })}
    </div>
  );
}
