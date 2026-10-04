/*
 * Saves a quiz answer (story 7.3): to the account when signed in (POST /api/answers), otherwise
 * on this device. Guests only keep which terms they've learned; that's what progress needs.
 */
import { GUEST_LEARNED_KEY } from '../paths/progress';

export interface Answer {
  termId: string;
  questionIndex: number;
  chosenIndex: number;
  isCorrect: boolean;
}

function saveOnDevice(answer: Answer): void {
  if (!answer.isCorrect) return;
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(GUEST_LEARNED_KEY) ?? '[]');
    const learned = new Set(Array.isArray(saved) ? saved : []);
    learned.add(answer.termId);
    localStorage.setItem(GUEST_LEARNED_KEY, JSON.stringify([...learned]));
  } catch {
    // Storage blocked: progress lasts only for this page.
  }
}

/** Returns where the answer was saved. */
export async function recordAnswer(answer: Answer): Promise<'account' | 'device'> {
  try {
    const res = await fetch('/api/answers', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(answer),
    });
    if (res.ok) return 'account';
  } catch {
    // Offline: keep it on the device.
  }
  // TODO(edge-cases): when a signed-in request fails for another reason (server down), the
  // answer is kept on the device and not sent to the account later.
  saveOnDevice(answer);
  return 'device';
}
