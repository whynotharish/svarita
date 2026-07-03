"use client";

import { useEffect, useState } from "react";
import { Bookmark, Trash2, Plus } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { listenToPresets, savePreset, deletePreset } from "@/lib/userData";
import { GenerationSettings } from "@/lib/constants";

export default function PresetManager({
  settings,
  onApply,
}: {
  settings: GenerationSettings;
  onApply: (s: GenerationSettings) => void;
}) {
  const { user, signInWithGoogle } = useAuth();
  const [presets, setPresets] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) {
      setPresets([]);
      return;
    }
    return listenToPresets(user.uid, setPresets);
  }, [user]);

  if (!user) {
    return (
      <div className="rounded-xl border border-dashed border-border p-4 text-center text-sm text-muted">
        <button onClick={() => signInWithGoogle()} className="text-accent hover:underline">
          Sign in
        </button>{" "}
        to save voice presets to your account.
      </div>
    );
  }

  const handleSave = async () => {
    if (!name.trim()) return;
    setSaving(true);
    try {
      await savePreset(user.uid, name.trim(), settings);
      setName("");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Preset name, e.g. Kirana PN Hindi"
          className="flex-1 rounded-lg border border-border bg-surface-elevated px-3 py-2 text-sm text-ink outline-none focus:border-accent"
        />
        <button
          onClick={handleSave}
          disabled={saving || !name.trim()}
          className="flex items-center gap-1.5 rounded-lg bg-accent px-3 py-2 text-sm text-white transition-colors hover:bg-accent-hover disabled:opacity-40"
        >
          <Plus size={14} /> Save
        </button>
      </div>

      {presets.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {presets.map((p) => (
            <div
              key={p.id}
              className="group flex items-center gap-2 rounded-full border border-border bg-surface-elevated px-3 py-1.5 text-xs text-ink"
            >
              <button onClick={() => onApply(p.settings)} className="flex items-center gap-1.5 hover:text-accent">
                <Bookmark size={12} /> {p.name}
              </button>
              <button
                onClick={() => deletePreset(user.uid, p.id)}
                className="text-muted opacity-0 transition-opacity hover:text-red-400 group-hover:opacity-100"
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
