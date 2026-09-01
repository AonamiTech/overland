import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, type Role, type AccountType } from '@/auth/AuthContext';
import { US_STATES, CITIES_BY_STATE, DIAL_CODES, digitsOnly, isValidPhone, isValidZip } from '@/lib/geo';
import { generatePassword, strength, MIN_PASSWORD } from '@/lib/password';
import { scrollToEl } from '@/lib/scrollTo';
import { events } from '@/lib/analytics';

/**
 * Email-only sign-in.
 *
 * Three ways in: Google, a password, or a magic link. The password path exists because
 * the link path depends on an email actually arriving, and when it does not the user is
 * simply stuck with no way through. Passwords are never stored or hashed here - they go
 * straight to Supabase over TLS.
 *
 * The original design had no password field, on purpose: the board verifies that an email is reachable and
 * nothing more. Carriers may add MC/USDOT, which we store and display but never
 * check - the copy says so plainly rather than implying a vetting step we do not run.
 */

const INK = '#111111';
const ACCENT = '#1E4D6B';
const DANGER = '#DC2626';

export default function AuthDialog() {
  const { authOpen, closeAuth, pendingRole, sendLink, mode, signInWithGoogle, authError,
          signUpWithPassword, signInWithPassword } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState<Role>(pendingRole);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [dial, setDial] = useState('+1');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [zip, setZip] = useState('');
  const [acct, setAcct] = useState<AccountType>('individual');
  const [org, setOrg] = useState('');
  const [mc, setMc] = useState('');
  const [usdot, setUsdot] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [googleBusy, setGoogleBusy] = useState(false);
  /* Off when the env says so, or when this browser has already come back from a failed
     Google round trip. Set by AuthContext when Supabase reports it could not exchange
     the code — a provider misconfiguration, not something the visitor can fix. */
  const [googleOff, setGoogleOff] = useState(() => {
    if (import.meta.env.VITE_GOOGLE_AUTH === 'off') return true;
    try { return localStorage.getItem('overland.google_broken') === '1'; } catch { return false; }
  });
  /* Open by default. Email + password is the only path that works end to end today —
     Google's return leg fails on a provider credential we cannot set from the app — so
     hiding the working form behind a link put the broken button first. */
  const [emailOpen, setEmailOpen] = useState(true);
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [justGenerated, setJustGenerated] = useState(false);
  /* 'password' is the default because it works on the first try. Magic links depend on
     an email arriving, which is the step that has failed most often here. */
  const [method, setMethod] = useState<'password' | 'link'>('password');
  const [returning, setReturning] = useState(false);

  useEffect(() => { setRole(pendingRole); }, [pendingRole]);

  // Fires when the dialog opens, so drop-off between opening and submitting is visible.
  useEffect(() => { if (authOpen) events.signUpStarted(pendingRole); }, [authOpen, pendingRole]);

  useEffect(() => {
    if (!authOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeAuth(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [authOpen, closeAuth]);

  if (!authOpen) return null;

  /* Pair every validation message with focus on the field it is about. The dialog
     scrolls, so a message alone can land out of view and read as "nothing happened". */
  const fail = (msg: string, id: string) => {
    setError(msg);
    const el = document.getElementById(id);
    el?.focus();
    scrollToEl(el, { offset: 120 });
    return false;
  };

  const suggest = () => {
    const pw = generatePassword();
    setPassword(pw);
    setShowPw(true);          // no point suggesting one they cannot read
    setJustGenerated(true);
    setError(null);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    /* Returning users answer two questions, not ten. The profile fields below exist to
       populate a listing, and a returning account already has them. */
    if (returning) {
      if (!email.trim()) { fail('Enter your email.', 'ov-email'); return; }
      if (!password) { fail('Enter your password.', 'ov-password'); return; }
      setBusy(true);
      const r = await signInWithPassword(email, password);
      setBusy(false);
      if (!r.ok) { setError(r.error ?? 'Could not sign you in.'); return; }
      closeAuth();
      navigate('/board');
      return;
    }

    if (!name.trim()) { fail('We need a name to put on your listings.', 'ov-name'); return; }
    const digits = digitsOnly(phone);
    if (!isValidPhone(dial, phone)) { fail(`Enter a valid ${dial} phone number.`, 'ov-phone'); return; }
    if (!state) { fail('Pick your state.', 'ov-state'); return; }
    if (!city.trim()) { fail('Which city are you based in?', 'ov-city'); return; }
    if (zip && !isValidZip(zip)) { fail('ZIP codes are 5 digits.', 'ov-zip'); return; }

    if (role === 'carrier' && usdot && !/^\d{5,8}$/.test(usdot.trim())) {
      setError('USDOT numbers are 5 to 8 digits.');
      return;
    }
    if (role === 'carrier' && mc && !/^\d{1,7}$/.test(mc.trim().replace(/^MC-?/i, ''))) {
      setError('MC numbers are up to 7 digits.');
      return;
    }

    if (method === 'password' && password.length < MIN_PASSWORD) {
      fail(`Passwords need at least ${MIN_PASSWORD} characters.`, 'ov-password');
      return;
    }

    setBusy(true);
    const profile = {
      name: name.trim(),
      phone: `${dial}${digits}`,
      city: [city.trim(), state].filter(Boolean).join(', ') + (zip ? ` ${zip.trim()}` : ''),
      accountType: acct,
      orgName: acct === 'company' ? org.trim() || undefined : undefined,
      mcNumber: mc.trim().replace(/^MC-?/i, '') || undefined,
      usdotNumber: usdot.trim() || undefined,
    };
    const res = method === 'password'
      ? await signUpWithPassword(email, password, role, profile)
      : await sendLink(email, role, profile);
    setBusy(false);

    if (!res.ok) { setError(res.error ?? 'Something went wrong. Try again.'); return; }
    events.signUpLinkSent(role);
    // emailed means there is nothing more to do here until they open their inbox -
    // true for a magic link, and for a password signup when confirmation is required.
    if (res.emailed) setSent(true);
    else { closeAuth(); navigate('/board'); }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-4"
      style={{ background: 'rgba(17,17,17,.42)' }}
      onClick={closeAuth}
      role="dialog"
      aria-modal="true"
      aria-label="Sign in to Overland"
    >
      {/* The signup form is taller than a phone screen once the password field and the
          carrier numbers are showing, and the panel had no height cap - so the heading
          ran off the top and the submit button off the bottom with no way to reach
          either. overscroll-contain stops the scroll chaining to the page underneath. */}
      <div
        className="relative max-h-[92svh] w-full max-w-[430px] overflow-y-auto overscroll-contain rounded-t-[16px] bg-white p-7 pb-[calc(28px+env(safe-area-inset-bottom))] sm:max-h-[88svh] sm:rounded-[9px] sm:pb-7"
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-dialog-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={closeAuth}
          aria-label="Close"
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-[rgba(17,17,17,.06)]"
          style={{ color: 'rgba(17,17,17,.45)', fontSize: 20, lineHeight: 1 }}
        >
          ×
        </button>
        {sent ? (
          <>
            <span className="aon-eyebrow" style={{ color: ACCENT }}>Check your inbox</span>
            <h2 id="auth-dialog-title" className="aon-display mt-3 text-[26px]">We sent you a link.</h2>
            <p className="aon-body mt-4 text-[14px] leading-[1.7]">
              Open it from this device and you are on the board. The link is single use
              and expires in an hour.
            </p>
            <button type="button" onClick={closeAuth} className="aon-cta aon-cta--dark mt-7 w-full justify-center">
              Done
            </button>
          </>
        ) : (
          <>
            <span className="aon-eyebrow" style={{ color: ACCENT }}>Join the board</span>
            <h2 id="auth-dialog-title" className="aon-display mt-3 text-[26px]">
              {returning ? 'Welcome back.'
                : !emailOpen ? 'Join the board.'
                : method === 'password' ? 'Create your account.'
                : 'Your email, nothing else.'}
            </h2>
            <p className="aon-body mt-3 text-[13px] leading-[1.65]">
              {returning
                ? 'Email and password. Nothing else to dig out.'
                : !emailOpen
                  ? 'Free to use. Sign up in under a minute, or sign in if you are already on.'
                  : method === 'password'
                    ? 'Pick a password or let us generate one. Your browser can remember it.'
                    : 'No password. You verify the address is real and stop there.'}
            </p>

            {/* Role picks which side of the board you join, so it belongs to signup.
                A returning account already has one, and asking again implies switching. */}
            {!returning && (
            <div className="mt-6 grid grid-cols-2 gap-2">
              {(['shipper', 'carrier'] as Role[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className="rounded-[9px] px-4 py-3 text-left"
                  style={{
                    background: role === r ? INK : 'rgba(17,17,17,.04)',
                    color: role === r ? '#FAF9F7' : 'rgba(17,17,17,.65)',
                  }}
                >
                  <span className="block text-[14px]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    {r === 'shipper' ? 'I have freight' : 'I have a truck'}
                  </span>
                </button>
              ))}
            </div>
            )}



            {/* Both doors, side by side. Signing in was previously reachable only by
                first clicking "sign up with email", which is the wrong words for
                someone who already has an account and reads as the wrong action. */}
            {!emailOpen && (
              <div className="mt-4 flex flex-col items-center gap-2">
                <button
                  type="button"
                  onClick={() => { setEmailOpen(true); setReturning(false); }}
                  className="w-full py-2 text-center text-[13px] underline underline-offset-4"
                  style={{ fontFamily: 'Poppins, sans-serif', color: 'rgba(17,17,17,.55)' }}
                >
                  Sign up with email instead
                </button>
                <button
                  type="button"
                  onClick={() => { setEmailOpen(true); setReturning(true); setMethod('password'); }}
                  className="w-full py-1 text-center text-[13px]"
                  style={{ fontFamily: 'Poppins, sans-serif', color: 'rgba(17,17,17,.5)' }}
                >
                  Already have an account?{' '}
                  <span className="underline underline-offset-4" style={{ color: ACCENT }}>Sign in</span>
                </button>
              </div>
            )}

            {emailOpen && (
              <div className="my-5 flex items-center gap-3">
                <span className="h-px flex-1" style={{ background: 'rgba(17,17,17,.10)' }} />
                <span className="aon-eyebrow" style={{ fontSize: 9, color: 'rgba(17,17,17,.34)' }}>{returning ? 'sign in' : 'create your account'}</span>
                <span className="h-px flex-1" style={{ background: 'rgba(17,17,17,.10)' }} />
              </div>
            )}

            {/* Email is kept alongside Google on purpose: Gmail is not universal among
                owner-operators, and plenty run on Yahoo, AOL or a company address.
                Google-only would turn those people away at the door - but it is the
                slower path, so it stays collapsed until someone asks for it. */}
            {emailOpen && (
            <form onSubmit={submit} noValidate>
              {/* A returning account already has all of this. Asking again is the
                  fastest way to make signing in feel like signing up. */}
              {!returning && (
              <>
              <label className="aon-eyebrow block" htmlFor="ov-name">Your name</label>
              <input id="ov-name" required value={name} onChange={(e) => setName(e.target.value)}
                     placeholder="Pratik Kumar"
                     className="mt-2 w-full rounded-[9px] px-4 py-3 text-[15px] outline-none"
                     style={{ fontFamily: 'Poppins, sans-serif', background: 'rgba(17,17,17,.04)', border: '1px solid rgba(17,17,17,.10)' }} />

              <div className="mt-4">
                <label className="aon-eyebrow block" htmlFor="ov-phone">Phone</label>
                <div className="mt-2 flex gap-2">
                  <select aria-label="Country code" value={dial} onChange={(e) => setDial(e.target.value)}
                          className="aon-num rounded-[9px] px-3 py-3 text-[15px] outline-none"
                          style={{ background: 'rgba(17,17,17,.04)', border: '1px solid rgba(17,17,17,.10)' }}>
                    {DIAL_CODES.map(([code, iso]) => <option key={iso} value={code}>{iso} {code}</option>)}
                  </select>
                  <input id="ov-phone" required inputMode="tel" value={phone}
                         onChange={(e) => setPhone(e.target.value)} placeholder="214 555 0148"
                         className="aon-num flex-1 rounded-[9px] px-4 py-3 text-[15px] outline-none"
                         style={{ background: 'rgba(17,17,17,.04)', border: '1px solid rgba(17,17,17,.10)' }} />
                </div>
              </div>

              <div className="mt-4 grid grid-cols-[1fr_1.2fr_0.8fr] gap-2">
                <div>
                  <label className="aon-eyebrow block" htmlFor="ov-state">State</label>
                  <select id="ov-state" required value={state}
                          onChange={(e) => { setState(e.target.value); setCity(''); }}
                          className="mt-2 w-full rounded-[9px] px-3 py-3 text-[15px] outline-none"
                          style={{ fontFamily: 'Poppins, sans-serif', background: 'rgba(17,17,17,.04)', border: '1px solid rgba(17,17,17,.10)' }}>
                    <option value="">—</option>
                    {US_STATES.map(([abbr]) => <option key={abbr} value={abbr}>{abbr}</option>)}
                  </select>
                </div>
                <div>
                  <label className="aon-eyebrow block" htmlFor="ov-city">City</label>
                  <input id="ov-city" required list="ov-cities" value={city}
                         onChange={(e) => setCity(e.target.value)} disabled={!state}
                         placeholder={state ? 'Start typing' : 'Pick a state'}
                         className="mt-2 w-full rounded-[9px] px-4 py-3 text-[15px] outline-none disabled:opacity-50"
                         style={{ fontFamily: 'Poppins, sans-serif', background: 'rgba(17,17,17,.04)', border: '1px solid rgba(17,17,17,.10)' }} />
                  <datalist id="ov-cities">
                    {(CITIES_BY_STATE[state] ?? []).map((c) => <option key={c} value={c} />)}
                  </datalist>
                </div>
                <div>
                  <label className="aon-eyebrow block" htmlFor="ov-zip">ZIP</label>
                  <input id="ov-zip" inputMode="numeric" maxLength={5} value={zip}
                         onChange={(e) => setZip(digitsOnly(e.target.value))} placeholder="75201"
                         className="aon-num mt-2 w-full rounded-[9px] px-3 py-3 text-[15px] outline-none"
                         style={{ background: 'rgba(17,17,17,.04)', border: '1px solid rgba(17,17,17,.10)' }} />
                </div>
              </div>

              </>
              )}

              <label className="aon-eyebrow mt-4 block" htmlFor="ov-email">Email</label>
              <input id="ov-email" type="email" required value={email}
                     autoComplete="username"
                     onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com"
                     className="mt-2 w-full rounded-[9px] px-4 py-3 text-[15px] outline-none"
                     style={{ fontFamily: 'Poppins, sans-serif', background: 'rgba(17,17,17,.04)', border: '1px solid rgba(17,17,17,.10)' }} />

              {method === 'password' && (
                <>
                  <div className="mt-4 flex items-baseline justify-between gap-3">
                    <label className="aon-eyebrow" htmlFor="ov-password">Password</label>
                    {/* Only when creating an account. Offering to generate one to
                        somebody trying to sign in suggests theirs is about to change. */}
                    {!returning && (
                      <button type="button" onClick={suggest}
                              className="text-[11.5px] underline underline-offset-2"
                              style={{ fontFamily: 'Poppins, sans-serif', color: ACCENT }}>
                        Suggest a strong one
                      </button>
                    )}
                  </div>

                  <div className="relative mt-2">
                    <input
                      id="ov-password"
                      /* type=text when revealed rather than a second field, so the
                         password manager still sees one control to save. */
                      type={showPw ? 'text' : 'password'}
                      value={password}
                      minLength={MIN_PASSWORD}
                      /* new-password is what prompts the browser to offer to generate
                         and then save it; current-password would offer to fill instead. */
                      autoComplete={returning ? 'current-password' : 'new-password'}
                      onChange={(e) => { setPassword(e.target.value); setJustGenerated(false); }}
                      placeholder={returning ? 'Your password' : 'At least 8 characters'}
                      className={`w-full rounded-[9px] py-3 pl-4 pr-[68px] text-[15px] outline-none ${showPw ? 'aon-num' : ''}`}
                      style={{ fontFamily: showPw ? undefined : 'Poppins, sans-serif', background: 'rgba(17,17,17,.04)', border: '1px solid rgba(17,17,17,.10)' }}
                    />
                    <button type="button" onClick={() => setShowPw((v) => !v)}
                            aria-label={showPw ? 'Hide password' : 'Show password'}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px]"
                            style={{ fontFamily: 'Poppins, sans-serif', color: 'rgba(17,17,17,.45)' }}>
                      {showPw ? 'Hide' : 'Show'}
                    </button>
                  </div>

                  {!returning && password && (() => {
                    const st = strength(password);
                    const bar = ['#DC2626', '#DC2626', '#B45309', '#0F7A4A', '#0F7A4A'][st.score];
                    return (
                      <div className="mt-2">
                        <div className="flex gap-1" aria-hidden>
                          {[1, 2, 3, 4].map((i) => (
                            <span key={i} className="h-[3px] flex-1 rounded-full"
                                  style={{ background: i <= st.score ? bar : 'rgba(17,17,17,.10)' }} />
                          ))}
                        </div>
                        <p className="mt-1.5 text-[11.5px]" style={{ fontFamily: 'Poppins, sans-serif', color: 'rgba(17,17,17,.5)' }}>
                          <span style={{ color: bar }}>{st.label}</span>
                          {st.hint ? ` — ${st.hint}` : ''}
                        </p>
                      </div>
                    );
                  })()}

                  {justGenerated && (
                    <p className="mt-1.5 text-[11.5px]" style={{ fontFamily: 'Poppins, sans-serif', color: 'rgba(17,17,17,.5)' }}>
                      Generated in your browser. Let your password manager save it when it
                      offers — you will not need to remember it.
                    </p>
                  )}
                </>
              )}

              {role === 'carrier' && (
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div>
                    <label className="aon-eyebrow block" htmlFor="ov-mc">MC (optional)</label>
                    <input id="ov-mc" inputMode="numeric" value={mc} onChange={(e) => setMc(e.target.value)}
                           placeholder="123456"
                           className="aon-num mt-2 w-full rounded-[9px] px-4 py-3 text-[15px] outline-none"
                           style={{ background: 'rgba(17,17,17,.04)', border: '1px solid rgba(17,17,17,.10)' }} />
                  </div>
                  <div>
                    <label className="aon-eyebrow block" htmlFor="ov-usdot">USDOT (optional)</label>
                    <input id="ov-usdot" inputMode="numeric" value={usdot} onChange={(e) => setUsdot(e.target.value)}
                           placeholder="1234567"
                           className="aon-num mt-2 w-full rounded-[9px] px-4 py-3 text-[15px] outline-none"
                           style={{ background: 'rgba(17,17,17,.04)', border: '1px solid rgba(17,17,17,.10)' }} />
                  </div>
                  <p className="aon-body col-span-2 text-[12px] leading-[1.6]">
                    Shown to people you deal with so they can look you up. We do not check it.
                  </p>
                </div>
              )}

              {/* A failure carried back from the OAuth redirect. Without this the
                  user returns from Google to a signed-out page and no explanation. */}
              {authError && !error && (
                <p className="mt-4 text-[13px]" style={{ fontFamily: 'Poppins, sans-serif', color: DANGER }} role="alert">
                  {authError}
                </p>
              )}
              {error && (
                <p className="mt-4 text-[13px]" style={{ fontFamily: 'Poppins, sans-serif', color: DANGER }} role="alert">
                  {error}
                </p>
              )}

              <button type="submit" disabled={busy}
                      className="aon-cta aon-cta--dark mt-6 w-full justify-center"
                      style={{ opacity: busy ? 0.5 : 1 }}>
                {busy ? 'Working…'
                  : returning ? 'Sign in'
                  : method === 'password' ? 'Create account'
                  : mode === 'supabase' ? 'Email me a link'
                  : 'Continue'}
              </button>

              <div className="mt-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-center">
                <button type="button"
                        onClick={() => { setReturning((v) => !v); setError(null); setMethod('password'); }}
                        className="text-[12px] underline underline-offset-2"
                        style={{ fontFamily: 'Poppins, sans-serif', color: ACCENT }}>
                  {returning ? 'Create an account instead' : 'Already have an account? Sign in'}
                </button>

                {!returning && (
                  <>
                    <span aria-hidden style={{ color: 'rgba(17,17,17,.25)' }}>·</span>
                    <button type="button"
                            onClick={() => { setMethod((m) => (m === 'password' ? 'link' : 'password')); setError(null); }}
                            className="text-[12px] underline underline-offset-2"
                            style={{ fontFamily: 'Poppins, sans-serif', color: 'rgba(17,17,17,.5)' }}>
                      {method === 'password' ? 'Email me a link instead' : 'Use a password instead'}
                    </button>
                  </>
                )}
              </div>
            </form>
            )}

            {mode === 'supabase' && !googleOff && (
              <div className="my-5 flex items-center gap-3">
                <span className="h-px flex-1" style={{ background: 'rgba(17,17,17,.10)' }} />
                <span className="aon-eyebrow" style={{ fontSize: 9, color: 'rgba(17,17,17,.34)' }}>or</span>
                <span className="h-px flex-1" style={{ background: 'rgba(17,17,17,.10)' }} />
              </div>
            )}

            {mode === 'supabase' && !googleOff && (
              <>
                <button
                  type="button"
                  disabled={googleBusy}
                  onClick={async () => {
                    setGoogleBusy(true); setError(null);
                    const r = await signInWithGoogle();
                    if (!r.ok) {
                      setError(r.error ?? 'Google sign-in failed.');
                      setGoogleBusy(false);
                      if (/not available yet/.test(r.error ?? '')) setGoogleOff(true);
                    }
                    // on success the browser navigates to Google, so no reset needed
                  }}
                  className="mt-5 flex w-full items-center justify-center gap-3 rounded-[9px] px-4 py-3 text-[14px] transition-colors hover:bg-[rgba(17,17,17,.03)]"
                  style={{ fontFamily: 'Poppins, sans-serif', color: INK, border: '1px solid rgba(17,17,17,.16)', opacity: googleBusy ? 0.5 : 1 }}
                >
                  <svg width="17" height="17" viewBox="0 0 18 18" aria-hidden>
                    <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62Z"/>
                    <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.33A9 9 0 0 0 9 18Z"/>
                    <path fill="#FBBC05" d="M3.97 10.72a5.4 5.4 0 0 1 0-3.44V4.95H.96a9 9 0 0 0 0 8.1l3.01-2.33Z"/>
                    <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.9 11.43 0 9 0A9 9 0 0 0 .96 4.95l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58Z"/>
                  </svg>
                  {googleBusy ? 'Opening Google…' : 'Continue with Google'}
                </button>

              </>
            )}

            {mode === 'local' && (
              // Never show "check your inbox" when nothing can be sent.
              <p className="mt-4 text-[12px] leading-[1.6]" style={{ fontFamily: 'Poppins, sans-serif', color: DANGER }}>
                Demo mode: no email is sent and this device is signed in directly. Set
                VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to send real links.
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
