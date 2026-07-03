"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause, Download } from "lucide-react";

export default function WaveformPlayer({
  src,
  filename = "svarita.wav",
  accent = "#7C5CFF",
}: {
  src: string; // object URL or data URL
  filename?: string;
  accent?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [peaks, setPeaks] = useState<number[]>([]);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch(src);
        const buf = await res.arrayBuffer();
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const audioBuf = await ctx.decodeAudioData(buf.slice(0));
        if (cancelled) return;
        const raw = audioBuf.getChannelData(0);
        const samples = 120;
        const blockSize = Math.floor(raw.length / samples);
        const filtered: number[] = [];
        for (let i = 0; i < samples; i++) {
          const start = blockSize * i;
          let sum = 0;
          for (let j = 0; j < blockSize; j++) sum += Math.abs(raw[start + j] || 0);
          filtered.push(sum / blockSize);
        }
        const max = Math.max(...filtered, 0.001);
        setPeaks(filtered.map((v) => v / max));
        ctx.close();
      } catch {
        setPeaks(Array.from({ length: 120 }, () => 0.15));
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [src]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || peaks.length === 0) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, rect.width, rect.height);

    const barW = rect.width / peaks.length;
    const playedIdx = Math.floor((progress / (duration || 1)) * peaks.length);

    peaks.forEach((p, i) => {
      const h = Math.max(2, p * rect.height * 0.9);
      const x = i * barW;
      const y = (rect.height - h) / 2;
      ctx.fillStyle = i <= playedIdx ? accent : "rgba(140,139,155,0.35)";
      ctx.beginPath();
      const w = Math.max(1.5, barW - 1.5);
      ctx.roundRect ? ctx.roundRect(x, y, w, h, 2) : ctx.rect(x, y, w, h);
      ctx.fill();
    });
  }, [peaks, progress, duration, accent]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
    } else {
      audio.play();
    }
  };

  const fmt = (s: number) => {
    if (!isFinite(s)) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const handleDownload = () => {
    const a = document.createElement("a");
    a.href = src;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <audio
        ref={audioRef}
        src={src}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onTimeUpdate={(e) => setProgress(e.currentTarget.currentTime)}
      />
      <div className="flex items-center gap-3">
        <button
          onClick={togglePlay}
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-accent text-white transition-transform hover:scale-105"
          aria-label={playing ? "Pause" : "Play"}
        >
          {playing ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
        </button>
        <canvas
          ref={canvasRef}
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const ratio = (e.clientX - rect.left) / rect.width;
            if (audioRef.current) audioRef.current.currentTime = ratio * duration;
          }}
          className="h-10 flex-1 cursor-pointer"
        />
        <span className="w-16 flex-shrink-0 text-right font-mono text-xs text-muted">
          {fmt(progress)} / {fmt(duration)}
        </span>
        <button
          onClick={handleDownload}
          className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-border text-ink transition-colors hover:border-accent"
          aria-label="Download"
        >
          <Download size={14} />
        </button>
      </div>
    </div>
  );
}
