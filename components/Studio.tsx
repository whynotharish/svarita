import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  limit as fbLimit,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { getFirebaseDb, getFirebaseStorage } from "@/lib/firebase";
import { GenerationSettings } from "@/lib/constants";

export function historyCollection(uid: string) {
  return collection(getFirebaseDb(), "users", uid, "history");
}

export async function saveHistoryEntry(
  uid: string,
  data: { text: string; settings: GenerationSettings; blob: Blob; durationSec?: number }
) {
  const path = `users/${uid}/audio/${Date.now()}.wav`;
  const storageRef = ref(getFirebaseStorage(), path);
  await uploadBytes(storageRef, data.blob, { contentType: "audio/wav" });
  const audioUrl = await getDownloadURL(storageRef);

  await addDoc(historyCollection(uid), {
    text: data.text,
    languageCode: data.settings.languageCode,
    speaker: data.settings.speaker,
    pace: data.settings.pace,
    temperature: data.settings.temperature,
    audioUrl,
    storagePath: path,
    durationSec: data.durationSec ?? null,
    createdAt: serverTimestamp(),
  });
}

export function listenToHistory(
  uid: string,
  cb: (entries: any[]) => void,
  max = 50
) {
  const q = query(historyCollection(uid), orderBy("createdAt", "desc"), fbLimit(max));
  return onSnapshot(q, (snap) => {
    cb(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
}

export async function deleteHistoryEntry(uid: string, id: string, storagePath?: string) {
  await deleteDoc(doc(getFirebaseDb(), "users", uid, "history", id));
  if (storagePath) {
    try {
      await deleteObject(ref(getFirebaseStorage(), storagePath));
    } catch {
      // ignore if already gone
    }
  }
}
