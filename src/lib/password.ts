/**
 * Password generation and strength, for the sign-up form.
 *
 * The point of the suggest button is that the password never has to be memorable, so
 * it is generated long and random rather than shaped into something pronounceable.
 * The browser's password manager stores it - that is why the form carries the right
 * autocomplete attributes - and the user never types it again.
 *
 * Nothing here hashes or stores anything. The password is handed to Supabase over TLS
 * and hashed server-side; it is never written to our own storage.
 */

// Ambiguous glyphs are removed: a generated password gets read off a screen and typed
// on a phone often enough that 1/l/I and 0/O cost more than the entropy they add.
const LOWER = 'abcdefghijkmnopqrstuvwxyz';
const UPPER = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
const DIGIT = '23456789';
const SYMBOL = '!@#$%^&*-_=+?';
const ALL = LOWER + UPPER + DIGIT + SYMBOL;

/** Uniform index into `n`, rejection-sampled so the modulo does not skew the tail. */
function randIndex(n: number): number {
  const limit = Math.floor(0xffffffff / n) * n;
  const buf = new Uint32Array(1);
  let v = 0;
  do {
    crypto.getRandomValues(buf);
    v = buf[0];
  } while (v >= limit);
  return v % n;
}

const pick = (set: string) => set[randIndex(set.length)];

export function generatePassword(length = 20): string {
  // One from each class up front, so the result always satisfies a policy that
  // demands them, then fill the rest from the full alphabet.
  const chars = [pick(LOWER), pick(UPPER), pick(DIGIT), pick(SYMBOL)];
  while (chars.length < length) chars.push(pick(ALL));

  // Fisher-Yates, or the guaranteed characters sit in a predictable prefix.
  for (let i = chars.length - 1; i > 0; i--) {
    const j = randIndex(i + 1);
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  return chars.join('');
}

export type Strength = { score: 0 | 1 | 2 | 3 | 4; label: string; hint: string | null };

/**
 * Deliberately crude. A real strength meter needs a dictionary, and shipping one to
 * every visitor to grade a field costs more than it is worth here. This catches the
 * things that actually get people compromised - short, single-class, or obvious - and
 * otherwise rewards length, which is what matters most.
 */
export function strength(pw: string): Strength {
  if (!pw) return { score: 0, label: '', hint: null };
  if (pw.length < 8) return { score: 0, label: 'Too short', hint: 'Use at least 8 characters.' };

  const classes = [/[a-z]/, /[A-Z]/, /\d/, /[^A-Za-z0-9]/].filter((r) => r.test(pw)).length;
  const obvious = /^(?:password|qwerty|letmein|welcome|admin|overland|freight|trucking)/i.test(pw)
    || /^(.)\1+$/.test(pw)
    || /^(?:0123|1234|2345|abcd|abc123)/i.test(pw);

  if (obvious) return { score: 1, label: 'Weak', hint: 'That is one of the first things anyone would guess.' };

  let score = 1;
  if (pw.length >= 10 && classes >= 2) score = 2;
  if (pw.length >= 12 && classes >= 3) score = 3;
  if (pw.length >= 16 && classes >= 3) score = 4;

  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const hint = score < 3 ? 'Longer helps more than adding symbols.' : null;
  return { score: score as Strength['score'], label: labels[score], hint };
}

/** Supabase rejects under 6; we ask for 8 as the floor worth having. */
export const MIN_PASSWORD = 8;
