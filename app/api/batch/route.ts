import { NextRequest, NextResponse } from "next/server";
import { SPEAKERS } from "@/lib/constants";

export const runtime = "nodejs";

const SARVAM_URL = "https://api.sarvam.ai/text-to-speech";
const MAX_CHARS = 2000;
const VALID_SPEAKERS = new Set(SPEAKERS.map((speaker) => speaker.id));
const MAX_ITEMS = 20;

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.SARVAM_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Server is missing SARVAM_API_KEY. Add it in your deployment's environment variables." },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { items, languageCode = "hi-IN", speaker = "anushka", pace = 1.0, pitch = 0, loudness = 1.0, sampleRate = 22050 } = body || {};

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Provide a non-empty list of text items." }, { status: 400 });
    }
    if (items.length > MAX_ITEMS) {
      return NextResponse.json({ error: `Batch limited to ${MAX_ITEMS} items at a time.` }, { status: 400 });
    }
    if (!VALID_SPEAKERS.has(speaker)) {
      return NextResponse.json(
        { error: `Speaker '${speaker}' is not supported. Choose one of: ${[...VALID_SPEAKERS].join(", ")}.` },
        { status: 400 }
      );
    }

    const results: { index: number; text: string; audioBase64?: string; error?: string }[] = [];

    for (let i = 0; i < items.length; i++) {
      const text = String(items[i] ?? "").trim();
      if (!text) {
        results.push({ index: i, text, error: "Empty text." });
        continue;
      }
      if (text.length > MAX_CHARS) {
        results.push({ index: i, text, error: `Exceeds ${MAX_CHARS} character limit.` });
        continue;
      }
      try {
        const res = await fetch(SARVAM_URL, {
          method: "POST",
          headers: {
            "API-Subscription-Key": apiKey,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            inputs: [text],
            target_language_code: languageCode,
            speaker,
            pace: clamp(Number(pace) || 1, 0.3, 2.0),
            pitch: clamp(Number(pitch) || 0, -0.75, 0.75),
            loudness: clamp(Number(loudness) || 1, 0.5, 2.0),
            speech_sample_rate: sampleRate,
            enable_preprocessing: true,
            model: "bulbul:v2",
          }),
        });
        if (!res.ok) {
          const errText = await res.text();
          results.push({ index: i, text, error: `Sarvam error (${res.status}): ${errText}` });
          continue;
        }
        const data = await res.json();
        results.push({ index: i, text, audioBase64: data?.audios?.[0] });
      } catch (e: any) {
        results.push({ index: i, text, error: e?.message || "Request failed." });
      }
    }

    return NextResponse.json({ results });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Unexpected server error." }, { status: 500 });
  }
}

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}
