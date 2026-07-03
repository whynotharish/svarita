"use client";

import React, { useState, useRef, useEffect } from "react";
import { Play, Pause, Download, Sliders, RefreshCw, LogOut } from "lucide-react";
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase"; // <-- UPDATE THIS to your firebase config path

const SUPPORTED_VOICES = [
  { id: "shubh", name: "Shubh", details: "Male • Balanced" },
  { id: "neha", name: "Neha", details: "Female • Clear" },
  { id: "tarun", name: "Tarun", details: "Male • Deep" },
  { id: "ritu", name: "Ritu", details: "Female • Natural" },
  { id: "aditya", name: "Aditya", details: "Male • Crisp" },
  { id: "shreya", name: "Shreya", details: "Female • Expressive" }
];

const SAMPLE_RATES = [
  { value: "24000", label: "24 kHz (High Definition)" },
  { value: "44100", label: "44.1 kHz (Studio Standard)" },
  { value: "48000", label: "48 kHz (Ultra Master HD)" }
];

const AUDIO_FORMATS = [
  { id: "wav", label: "WAV", mime: "audio/wav" },
  { id: "mp3", label: "MP3", mime: "audio/mpeg" },
  { id: "aac", label: "AAC", mime: "audio/aac" }
];

const LANGUAGES = [
  { code: "en-IN", name: "English (India)" },
  { code: "hi-IN", name: "Hindi (हिन्दी)" },
  { code: "bn-IN", name: "Bengali (বাংলা)" },
  { code: "ta-IN", name: "Tamil (தமிழ்)" },
  { code: "te-IN", name: "Telugu (తెలుగు)" }
];

export default function SvaritaStudio() {
  // Firebase Auth State
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState("");

  // Studio State
  const [text, setText] = useState("");
  const [language, setLanguage] = useState("hi-IN");
  const [voice, setVoice] = useState("shubh");
  const [sampleRate, setSampleRate] = useState("24000");
  const [format, setFormat] = useState("wav");
  const [pace, setPace] = useState(1.0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Listen to Firebase Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleGoogleSignIn = async () => {
    setAuthError("");
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      setAuthError(err.message || "Failed to sign in with Google.");
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setAudioUrl(null);
  };

  const handleGenerate = async () => {
    if (!text.trim() || !user) return;
    setLoading(true);
    setError(null);
    setAudioUrl(null);
    setIsPlaying(false);

    try {
      // Grab fresh Firebase ID token
      const idToken = await user.getIdToken();

      const response = await fetch("/api/synthesize", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${idToken}` 
        },
        body: JSON.stringify({ text, language, voice, sampleRate, format, pace }),
      });

      const data = await response.json();

      if (response.status === 401) {
        await handleLogout();
        throw new Error("Session expired. Please sign in again.");
      }

      if (!response.ok) throw new Error(data.error || "Generation mismatch encountered.");

      if (data.audios?.[0]) {
        const currentMime = AUDIO_FORMATS.find(f => f.id === format)?.mime || "audio/wav";
        const generatedUrl = `data:${currentMime};base64,${data.audios[0]}`;
        setAudioUrl(generatedUrl);
      } else {
        throw new Error("Empty sound stream packets returned.");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const togglePlayback = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  // ---------------------------------------------------------------------------
  // AUTHENTICATION VIEW (Firebase Google Sign-In)
  // ---------------------------------------------------------------------------
  if (authLoading) {
    return <div className="min-h-screen bg-black flex items-center justify-center text-neutral-500">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white font-sans antialiased flex items-center justify-center p-6 selection:bg-[#3393FF] selection:text-white">
        <div className="w-full max-w-sm">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-semibold tracking-tight">Svarita</h1>
            <p className="text-sm text-neutral-500 mt-2">Sign in to access the studio</p>
          </div>
          
          <button
            onClick={handleGoogleSignIn}
            className="w-full py-4 bg-white text-black rounded-2xl font-medium text-sm transition-transform active:scale-[0.98] flex items-center justify-center gap-3"
          >
            {/* Minimalist Google 'G' SVG */}
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </button>

          {authError && <p className="text-red-400 text-xs mt-4 text-center">{authError}</p>}
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // MAIN STUDIO VIEW
  // ---------------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-black text-white font-sans antialiased selection:bg-[#3393FF] selection:text-white pb-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        
        <header className="mb-8 border-b border-neutral-900 pb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Svarita</h1>
            <p className="text-xs text-neutral-500 mt-1">Acoustic Generation Engine</p>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-[#121212] hover:bg-neutral-900 border border-neutral-800 rounded-full text-xs font-medium text-neutral-400 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-[#121212] border border-neutral-800/60 rounded-3xl p-5 sm:p-6 shadow-sm flex flex-col min-h-[320px]">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter your script here..."
                maxLength={2500}
                className="w-full flex-1 bg-transparent text-white placeholder-neutral-600 focus:outline-none text-[15px] sm:text-base leading-relaxed resize-none"
              />
              <div className="flex justify-end text-[11px] font-mono text-neutral-600 border-t border-neutral-900 pt-4 mt-4">
                {text.length} / 2500 characters
              </div>
            </div>

            {error && (
              <div className="p-4 bg-[#1A0505] border border-red-900/30 rounded-2xl text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              onClick={handleGenerate}
              disabled={loading || !text.trim()}
              className="w-full py-4 sm:py-4 bg-white hover:bg-neutral-200 disabled:bg-neutral-900 text-black disabled:text-neutral-600 rounded-full font-medium text-[15px] transition-all shadow-sm flex items-center justify-center gap-2"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                "Generate Audio"
              )}
            </button>

            {audioUrl && (
              <div className="bg-[#121212] border border-neutral-800 rounded-3xl p-4 sm:p-5 flex items-center justify-between gap-4 animate-in fade-in duration-300">
                <div className="flex items-center gap-4 flex-1">
                  <button
                    onClick={togglePlayback}
                    className="w-12 h-12 shrink-0 rounded-full bg-neutral-800 hover:bg-neutral-700 text-white flex items-center justify-center transition-colors"
                  >
                    {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-1" />}
                  </button>
                  <div className="flex-1 flex items-center gap-1.5 h-8 overflow-hidden">
                    {[...Array(24)].map((_, i) => (
                      <span 
                        key={i} 
                        className="w-1 bg-neutral-600 rounded-full transition-all duration-300"
                        style={{ height: isPlaying ? `${Math.floor(Math.random() * 100)}%` : "20%" }}
                      />
                    ))}
                  </div>
                </div>

                <a
                  href={audioUrl}
                  download={`svarita-${voice}.${format}`}
                  className="w-12 h-12 shrink-0 bg-neutral-900 hover:bg-neutral-800 text-white rounded-full flex items-center justify-center transition-colors border border-neutral-800"
                >
                  <Download className="w-5 h-5" />
                </a>

                <audio ref={audioRef} src={audioUrl} onEnded={() => setIsPlaying(false)} className="hidden" />
              </div>
            )}
          </div>

          <div className="lg:col-span-5 bg-[#121212] border border-neutral-800/60 rounded-3xl p-5 sm:p-6 space-y-6">
            
            <div className="flex items-center gap-2 text-xs font-medium text-neutral-400 uppercase tracking-wider pb-3 border-b border-neutral-900">
              <Sliders className="w-4 h-4" />
              <span>Voice Settings</span>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider block">Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full bg-[#1A1A1A] border border-neutral-800 text-white rounded-2xl px-4 py-3.5 text-sm focus:outline-none focus:border-neutral-600 appearance-none"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>{lang.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider block">Voice Profile</label>
              <div className="grid grid-cols-1 gap-2 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                {SUPPORTED_VOICES.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setVoice(v.id)}
                    className={`w-full text-left px-4 py-3.5 rounded-2xl text-sm border transition-colors ${
                      voice === v.id
                        ? "bg-white border-white text-black font-medium"
                        : "bg-[#1A1A1A] border-transparent text-neutral-400 hover:text-white"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span>{v.name}</span>
                      <span className={`text-[11px] font-mono ${voice === v.id ? "text-neutral-600" : "text-neutral-500"}`}>
                        {v.details}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider block">Sample Rate</label>
              <select
                value={sampleRate}
                onChange={(e) => setSampleRate(e.target.value)}
                className="w-full bg-[#1A1A1A] border border-neutral-800 text-white rounded-2xl px-4 py-3.5 text-sm focus:outline-none focus:border-neutral-600 appearance-none"
              >
                {SAMPLE_RATES.map((rate) => (
                  <option key={rate.value} value={rate.value}>{rate.label}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider block">Format</label>
              <div className="grid grid-cols-3 gap-2">
                {AUDIO_FORMATS.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setFormat(f.id)}
                    className={`py-3.5 rounded-2xl text-xs font-medium tracking-wide transition-colors uppercase ${
                      format === f.id
                        ? "bg-white text-black"
                        : "bg-[#1A1A1A] text-neutral-400 hover:text-white"
                    }`}
                  >
                    {f.id}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-neutral-900">
              <div className="flex justify-between text-[11px] font-medium uppercase tracking-wider text-neutral-500">
                <span>Speed Control</span>
                <span className="text-white font-mono">{pace.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="2.0"
                step="0.1"
                value={pace}
                onChange={(e) => setPace(parseFloat(e.target.value))}
                className="w-full accent-white h-1.5 bg-neutral-900 rounded-full appearance-none"
              />
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}