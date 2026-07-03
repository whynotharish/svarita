export const LANGUAGES = [
  { code: "hi-IN", label: "Hindi", native: "हिंदी" },
  { code: "en-IN", label: "English (India)", native: "English" },
  { code: "bn-IN", label: "Bengali", native: "বাংলা" },
  { code: "ta-IN", label: "Tamil", native: "தமிழ்" },
  { code: "te-IN", label: "Telugu", native: "తెలుగు" },
  { code: "kn-IN", label: "Kannada", native: "ಕನ್ನಡ" },
  { code: "ml-IN", label: "Malayalam", native: "മലയാളം" },
  { code: "mr-IN", label: "Marathi", native: "मराठी" },
  { code: "gu-IN", label: "Gujarati", native: "ગુજરાતી" },
  { code: "pa-IN", label: "Punjabi", native: "ਪੰਜਾਬੀ" },
  { code: "od-IN", label: "Odia", native: "ଓଡ଼ିଆ" },
] as const;

export const SPEAKERS = [
  { id: "anushka", label: "Anushka", gender: "Female" },
  { id: "meera", label: "Meera", gender: "Female" },
  { id: "pavithra", label: "Pavithra", gender: "Female" },
  { id: "maitreyi", label: "Maitreyi", gender: "Female" },
  { id: "manisha", label: "Manisha", gender: "Female" },
  { id: "vidya", label: "Vidya", gender: "Female" },
  { id: "arya", label: "Arya", gender: "Female" },
  { id: "arvind", label: "Arvind", gender: "Male" },
  { id: "amol", label: "Amol", gender: "Male" },
  { id: "amartya", label: "Amartya", gender: "Male" },
  { id: "karun", label: "Karun", gender: "Male" },
  { id: "hitesh", label: "Hitesh", gender: "Male" },
] as const;

export const SAMPLE_RATES = [8000, 16000, 22050, 24000] as const;

export const MAX_CHARS = 2000;

export type GenerationSettings = {
  languageCode: string;
  speaker: string;
  pace: number;
  pitch: number;
  loudness: number;
  sampleRate: number;
};

export const DEFAULT_SETTINGS: GenerationSettings = {
  languageCode: "hi-IN",
  speaker: "anushka",
  pace: 1.0,
  pitch: 0,
  loudness: 1.0,
  sampleRate: 22050,
};

export type HistoryEntry = {
  id: string;
  text: string;
  languageCode: string;
  speaker: string;
  pace: number;
  pitch: number;
  audioUrl: string;
  durationSec?: number;
  createdAt: number;
};
