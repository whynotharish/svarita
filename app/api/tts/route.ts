import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const SARVAM_URL = "https://api.sarvam.ai/text-to-speech";
const MAX_CHARS = 2000;

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
    const {
      text,
      languageCode = "hi-IN",
      speaker = "shubh",
      pace = 1.0,
      temperature = 0.6,
      sampleRate = 24000,
    } = body || {};

    if (!text || typeof text !== "string" || !text.trim()) {
      return NextResponse.json({ error: "Text is required." }, { status: 400 });
    }
    if (text.length > MAX_CHARS) {
      return NextResponse.json(
        { error: `Text exceeds the ${MAX_CHARS} character limit.` },
        { status: 400 }
      );
    }

    // bulbul:v3 does not support pitch or loudness — only pace, temperature,
    // and sample rate are meaningful here. Sending pitch/loudness is silently
    // ignored by Sarvam, so we just don't send them.
    const payload = {
      inputs: [text],
      target_language_code: languageCode,
      speaker,
      pace: clamp(Number(pace) || 1, 0.5, 2.0),
      temperature: clamp(Number(temperature) || 0.6, 0.01, 1.0),
      speech_sample_rate: sampleRate,
      enable_preprocessing: true,
      model: "bulbul:v3",
    };

    const res = await fetch(SARVAM_URL, {
      method: "POST",
      headers: {
        "API-Subscription-Key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errText = await res.text();
      return NextResponse.json(
        { error: `Sarvam API error (${res.status}): ${errText}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    const audioBase64 = data?.audios?.[0];
    if (!audioBase64) {
      return NextResponse.json({ error: "No audio returned by Sarvam." }, { status: 502 });
    }

    return NextResponse.json({ audioBase64, requestId: data.request_id ?? null });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Unexpected server error." }, { status: 500 });
  }
}

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}
