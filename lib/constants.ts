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
  { id: "abhilash", label: "Abhilash", gender: "Male" },
  { id: "manisha", label: "Manisha", gender: "Female" },
  { id: "vidya", label: "Vidya", gender: "Female" },
  { id: "arya", label: "Arya", gender: "Female" },
  { id: "karun", label: "Karun", gender: "Male" },
  { id: "hitesh", label: "Hitesh", gender: "Male" },
  { id: "aditya", label: "Aditya", gender: "Male" },
  { id: "ritu", label: "Ritu", gender: "Female" },
  { id: "priya", label: "Priya", gender: "Female" },
  { id: "neha", label: "Neha", gender: "Female" },
  { id: "rahul", label: "Rahul", gender: "Male" },
  { id: "pooja", label: "Pooja", gender: "Female" },
  { id: "rohan", label: "Rohan", gender: "Male" },
  { id: "simran", label: "Simran", gender: "Female" },
  { id: "kavya", label: "Kavya", gender: "Female" },
  { id: "amit", label: "Amit", gender: "Male" },
  { id: "dev", label: "Dev", gender: "Male" },
  { id: "ishita", label: "Ishita", gender: "Female" },
  { id: "shreya", label: "Shreya", gender: "Female" },
  { id: "ratan", label: "Ratan", gender: "Male" },
  { id: "varun", label: "Varun", gender: "Male" },
  { id: "manan", label: "Manan", gender: "Male" },
  { id: "sumit", label: "Sumit", gender: "Male" },
  { id: "roopa", label: "Roopa", gender: "Female" },
  { id: "kabir", label: "Kabir", gender: "Male" },
  { id: "aayan", label: "Aayan", gender: "Male" },
  { id: "shubh", label: "Shubh", gender: "Male" },
  { id: "ashutosh", label: "Ashutosh", gender: "Male" },
  { id: "advait", label: "Advait", gender: "Male" },
  { id: "anand", label: "Anand", gender: "Male" },
  { id: "tanya", label: "Tanya", gender: "Female" },
  { id: "tarun", label: "Tarun", gender: "Male" },
  { id: "sunny", label: "Sunny", gender: "Male" },
  { id: "mani", label: "Mani", gender: "Male" },
  { id: "gokul", label: "Gokul", gender: "Male" },
  { id: "vijay", label: "Vijay", gender: "Male" },
  { id: "shruti", label: "Shruti", gender: "Female" },
  { id: "suhani", label: "Suhani", gender: "Female" },
  { id: "mohit", label: "Mohit", gender: "Male" },
  { id: "kavitha", label: "Kavitha", gender: "Female" },
  { id: "rehan", label: "Rehan", gender: "Male" },
  { id: "soham", label: "Soham", gender: "Male" },
  { id: "rupali", label: "Rupali", gender: "Female" },
] as const;

export const SAMPLE_RATES = [8000, 16000, 22050, 24000] as const;

export const MAX_CHARS = 2000;

export type GenerationSettings = {
  languageCode: string;
  speaker: string;
  pace: number;
  sampleRate: number;
};

export const DEFAULT_SETTINGS: GenerationSettings = {
  languageCode: "hi-IN",
  speaker: "anushka",
  pace: 1.0,
  sampleRate: 22050,
};

export type HistoryEntry = {
  id: string;
  text: string;
  languageCode: string;
  speaker: string;
  pace: number;
  audioUrl: string;
  durationSec?: number;
  createdAt: number;
};

export type Preset = {
  id: string;
  name: string;
  settings: GenerationSettings;
};
