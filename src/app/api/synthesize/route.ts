import { NextResponse } from "next/server";
import { auth } from "firebase-admin"; // Ensure you have your Firebase Admin SDK initialized elsewhere

export async function POST(request: Request) {
  try {
    // 1. Firebase Authentication Barrier
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Unauthorized access. Missing token." },
        { status: 401 }
      );
    }

    const token = authHeader.split("Bearer ")[1];

    try {
      // Verify the Google Sign-In token via Firebase Admin
      await auth().verifyIdToken(token);
    } catch (verifyError) {
      return NextResponse.json(
        { error: "Unauthorized. Invalid or expired Firebase session." },
        { status: 401 }
      );
    }

    // 2. Payload Parsing
    const payload = await request.json();
    const { text, language, voice, sampleRate, format, pace } = payload;

    const apiKey = process.env.SARVAM_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Configuration Missing: Upstream API Key is not set." },
        { status: 500 }
      );
    }

    // 3. Engine Execution
    const response = await fetch("https://api.sarvam.ai/text-to-speech", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-subscription-key": apiKey,
      },
      body: JSON.stringify({
        text,
        target_language_code: language,
        speaker: voice,
        speech_sample_rate: parseInt(sampleRate),
        audio_format: format,
        pace: pace || 1.0,
        model: "bulbul:v3",
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || "Upstream voice generation failed." },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal system error." },
      { status: 500 }
    );
  }
}