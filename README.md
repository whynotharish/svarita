# Svarita

A modern voiceover generator for Udaan campaigns — text-to-speech in 11 Indian
languages via Sarvam AI, with batch generation, presets, Google sign-in, and
per-account history. Built with Next.js, deployed on Vercel, data on Firebase.

---

## 0. Before anything else: rotate your Sarvam key

You pasted your Sarvam API key in our chat, which means it's now sitting in
plaintext in your conversation history. Treat it as compromised:

1. Go to `dashboard.sarvam.ai` → API Keys.
2. Revoke the old key, generate a new one.
3. Use the **new** key below. Never paste it into chat, code, or anything
   that isn't an environment variable.

---

## 1. Firebase setup (Auth + Firestore + Storage)

1. Go to [console.firebase.google.com](https://console.firebase.google.com) → **Add project** → name it `svarita`.
2. **Authentication** → Sign-in method → enable **Google**.
3. **Firestore Database** → Create database → start in **production mode**.
4. **Storage** → Get started → production mode.
5. Project settings (gear icon) → **General** → scroll to "Your apps" → click the `</>` (Web) icon → register app "Svarita" → copy the `firebaseConfig` values. You'll paste these into Vercel env vars in step 3.
6. Deploy the security rules included in this repo so users can only read/write their own data:
   - Firestore → Rules tab → paste the contents of `firestore.rules` → Publish.
   - Storage → Rules tab → paste the contents of `storage.rules` → Publish.
7. Authentication → Settings → **Authorized domains** → add your future Vercel domain (e.g. `svarita.vercel.app`) once you have it from step 3.

## 2. Push to GitHub

```bash
cd svarita
git init
git add .
git commit -m "Svarita"
gh repo create svarita --private --source=. --push
# or manually: create a repo on github.com, then
# git remote add origin https://github.com/<you>/svarita.git
# git branch -M main && git push -u origin main
```

## 3. Deploy on Vercel

1. [vercel.com/new](https://vercel.com/new) → Import the GitHub repo.
2. Framework preset: **Next.js** (auto-detected).
3. Add environment variables (Project Settings → Environment Variables), for **Production, Preview, and Development**:

   | Key | Value |
   |---|---|
   | `SARVAM_API_KEY` | your new, rotated Sarvam key (server-only, never `NEXT_PUBLIC_`) |
   | `NEXT_PUBLIC_FIREBASE_API_KEY` | from Firebase config |
   | `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | from Firebase config |
   | `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | from Firebase config |
   | `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | from Firebase config |
   | `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | from Firebase config |
   | `NEXT_PUBLIC_FIREBASE_APP_ID` | from Firebase config |

4. Deploy. Copy the resulting `*.vercel.app` domain and add it to Firebase Auth's authorized domains (step 1.7).
5. If you attach a custom domain later, add that to authorized domains too.

## 4. Local development (optional)

```bash
npm install
cp .env.local.example .env.local   # fill in the values from above
npm run dev
```

Open `http://localhost:3000`.

---

## What's included

- **Studio** — single script → speech, with language, voice, decimal-precision
  speed/pitch/loudness sliders, sample rate, live waveform playback, download.
- **Batch** — multiple scripts generated in one pass, downloadable as a zip.
- **Voice cloning** — Sarvam's cloning is enterprise/consent-based, not a
  self-serve API call, so this panel is honest about that and gives you the
  request path instead of faking a broken feature.
- **Presets** — save named voice-setting combos per account.
- **History** — every saved generation, stored in Firebase Storage with
  metadata in Firestore, scoped to your account by security rules.
- **Auth** — Google sign-in via Firebase, no separate password system.
- **Theme toggle** — light/dark, persisted locally.

## Notes on limits

- No Replit-style usage caps — Vercel's free (Hobby) tier and Firebase's
  Spark (free) tier are generous for a small internal tool; you'll only pay
  if usage grows significantly, and you control that directly instead of
  hitting a host's arbitrary ceiling.
- Sarvam billing is separate and usage-based (see `sarvam.ai/api-pricing`) —
  that's the one meter to watch regardless of where this is hosted.
- Script length is capped at 2000 characters per generation to match Sarvam's
  REST limits and keep generations fast; batch mode is capped at 20 lines per
  request.
