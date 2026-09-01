import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, type AccountType, type AuthView, type Role } from '@/auth/AuthContext';
import { DEFAULT_AUTH_RETURN_TO, clearAuthIntent, readAuthIntent } from '@/auth/authIntent';
import { US_STATES, CITIES_BY_STATE, DIAL_CODES, digitsOnly, isValidPhone, isValidZip } from '@/lib/geo';
import { generatePassword, strength, MIN_PASSWORD } from '@/lib/password';
import { scrollToEl } from '@/lib/scrollTo';
import { events } from '@/lib/analytics';

const INK = '#111111';
const ACCENT = '#1E4D6B';
const DANGER = '#DC2626';

/**
 * One auth surface with an explicit sign-in/sign-up state. The same surface keeps
 * Google, password and magic-link paths consistent, while signup alone asks for the
 * profile details needed by a listing.
 */
export default function AuthDialog() {
  const {
    authOpen,
    closeAuth,
    pendingRole,
    pendingAuthMode,
    sendLink,
    mode,
    signInWithGoogle,
    authError,
    signUpWithPassword,
    signInWithPassword,
  } = useAuth();
  const navigate = useNavigate();

  const [view, setView] = useState<AuthView>(pendingAuthMode ?? 'signin');
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
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [justGenerated, setJustGenerated] = useState(false);
  const [method, setMethod] = useState<'password' | 'link'>('password');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [googleBusy, setGoogleBusy] = useState(false);

  const isSignIn = view === 'signin';

  // AuthDialog stays mounted globally, so opening it is the right moment to reset
  // stale form state from a previous attempt and apply the caller's intent.
  useEffect(() => {
    if (!authOpen) return;
    setView(pendingAuthMode ?? 'signin');
    setRole(pendingRole);
    setEmail('');
    setName('');
    setPhone('');
    setDial('+1');
    setState('');
    setCity('');
    setZip('');
    setAcct('individual');
    setOrg('');
    setMc('');
    setUsdot('');
    setPassword('');
    setShowPw(false);
    setJustGenerated(false);
    setMethod('password');
    setBusy(false);
    setError(null);
    setSent(false);
    setGoogleBusy(false);
  }, [authOpen, pendingAuthMode, pendingRole]);

  useEffect(() => {
    if (authOpen && (pendingAuthMode ?? 'signin') === 'signup') events.signUpStarted(pendingRole);
  }, [authOpen, pendingAuthMode, pendingRole]);

  useEffect(() => {
    if (!authOpen) return;
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') closeAuth(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [authOpen, closeAuth]);

  if (!authOpen) return null;

  const fail = (message: string, id: string) => {
    setError(message);
    const element = document.getElementById(id);
    element?.focus();
    scrollToEl(element, { offset: 120 });
  };

  const finish = () => {
    const destination = readAuthIntent() ?? DEFAULT_AUTH_RETURN_TO;
    clearAuthIntent();
    closeAuth();
    navigate(destination);
  };

  const suggest = () => {
    const generated = generatePassword();
    setPassword(generated);
    setShowPw(true);
    setJustGenerated(true);
    setError(null);
  };

  const switchView = (next: AuthView) => {
    setView(next);
    setMethod('password');
    setPassword('');
    setShowPw(false);
    setJustGenerated(false);
    setError(null);
    setSent(false);
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (isSignIn) {
      if (!email.trim()) return fail('Enter your email.', 'ov-email');
      if (method === 'password' && !password) return fail('Enter your password.', 'ov-password');

      setBusy(true);
      try {
        const result = method === 'password'
          ? await signInWithPassword(email, password)
          : await sendLink(email, role, undefined, 'signin');
        if (!result.ok) {
          setError(result.error ?? 'Could not sign you in.');
        } else if (result.emailed) {
          setSent(true);
        } else {
          finish();
        }
      } catch {
        setError('Could not sign you in. Try again.');
      } finally {
        setBusy(false);
      }
      return;
    }

    if (!name.trim()) return fail('We need a name to put on your listings.', 'ov-name');
    const digits = digitsOnly(phone);
    if (!isValidPhone(dial, phone)) return fail(`Enter a valid ${dial} phone number.`, 'ov-phone');
    if (!state) return fail('Pick your state.', 'ov-state');
    if (!city.trim()) return fail('Which city are you based in?', 'ov-city');
    if (zip && !isValidZip(zip)) return fail('ZIP codes are 5 digits.', 'ov-zip');
    if (role === 'carrier' && usdot && !/^\d{5,8}$/.test(usdot.trim())) {
      return setError('USDOT numbers are 5 to 8 digits.');
    }
    if (role === 'carrier' && mc && !/^\d{1,7}$/.test(mc.trim().replace(/^MC-?/i, ''))) {
      return setError('MC numbers are up to 7 digits.');
    }
    if (method === 'password' && password.length < MIN_PASSWORD) {
      return fail(`Passwords need at least ${MIN_PASSWORD} characters.`, 'ov-password');
    }

    const profile = {
      name: name.trim(),
      phone: `${dial}${digits}`,
      city: [city.trim(), state].filter(Boolean).join(', ') + (zip ? ` ${zip.trim()}` : ''),
      accountType: acct,
      orgName: acct === 'company' ? org.trim() || undefined : undefined,
      mcNumber: mc.trim().replace(/^MC-?/i, '') || undefined,
      usdotNumber: usdot.trim() || undefined,
    };

    setBusy(true);
    try {
      const result = method === 'password'
        ? await signUpWithPassword(email, password, role, profile)
        : await sendLink(email, role, profile, 'signup');
      if (!result.ok) {
        setError(result.error ?? 'Something went wrong. Try again.');
      } else if (result.emailed) {
        events.signUpLinkSent(role);
        setSent(true);
      } else {
        events.signUpLinkSent(role);
        finish();
      }
    } catch {
      setError('Could not create your account. Try again.');
    } finally {
      setBusy(false);
    }
  };

  const errorText = error ?? authError;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-4"
      style={{ background: 'rgba(17,17,17,.42)' }}
      onClick={closeAuth}
    >
      <div
        className="relative max-h-[92svh] w-full max-w-[430px] overflow-y-auto overscroll-contain rounded-t-[16px] bg-white p-7 pb-[calc(28px+env(safe-area-inset-bottom))] sm:max-h-[88svh] sm:rounded-[9px] sm:pb-7"
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-dialog-title"
        aria-describedby={errorText ? 'auth-dialog-error' : undefined}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={closeAuth}
          aria-label="Close"
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-[rgba(17,17,17,.06)]"
          style={{ color: 'rgba(17,17,17,.65)', fontSize: 20, lineHeight: 1 }}
        >
          ×
        </button>

        {sent ? (
          <>
            <span className="aon-eyebrow" style={{ color: ACCENT }}>{isSignIn ? 'Sign-in link' : 'Finish your account'}</span>
            <h2 id="auth-dialog-title" className="aon-display mt-3 text-[26px]">
              We sent you a link.
            </h2>
            <p className="aon-body mt-4 text-[14px] leading-[1.7]">
              Open it from this device and we&rsquo;ll take you to the board. The link is
              single use and expires in an hour.
            </p>
            <button type="button" onClick={closeAuth} className="aon-cta aon-cta--dark mt-7 w-full justify-center">
              Done
            </button>
          </>
        ) : (
          <>
            <span className="aon-eyebrow" style={{ color: ACCENT }}>{isSignIn ? 'Your account' : 'Join the board'}</span>
            <h2 id="auth-dialog-title" className="aon-display mt-3 text-[26px]">
              {isSignIn ? 'Welcome back.' : 'Create your account.'}
            </h2>
            <p className="aon-body mt-3 text-[13px] leading-[1.65]">
              {isSignIn
                ? 'Use your email and password, or get a one-time sign-in link.'
                : 'Post freight or capacity in under a minute. We verify an email address and nothing else.'}
            </p>

            {!isSignIn && (
              <div className="mt-6 grid grid-cols-2 gap-2">
                {(['shipper', 'carrier'] as Role[]).map((candidate) => (
                  <button
                    key={candidate}
                    type="button"
                    aria-pressed={role === candidate}
                    onClick={() => setRole(candidate)}
                    className="rounded-[9px] px-4 py-3 text-left"
                    style={{
                      background: role === candidate ? INK : 'rgba(17,17,17,.04)',
                      color: role === candidate ? '#FAF9F7' : 'rgba(17,17,17,.65)',
                    }}
                  >
                    <span className="block text-[14px]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      {candidate === 'shipper' ? 'I have freight' : 'I have a truck'}
                    </span>
                  </button>
                ))}
              </div>
            )}

            <div className="my-5 flex items-center gap-3">
              <span className="h-px flex-1" style={{ background: 'rgba(17,17,17,.10)' }} />
              <span className="aon-eyebrow" style={{ fontSize: 9, color: 'rgba(17,17,17,.65)' }}>
                {isSignIn ? 'sign in' : 'create your account'}
              </span>
              <span className="h-px flex-1" style={{ background: 'rgba(17,17,17,.10)' }} />
            </div>

            <form onSubmit={submit} noValidate>
              {!isSignIn && (
                <>
                  <label className="aon-eyebrow block" htmlFor="ov-name">Your name</label>
                  <input
                    id="ov-name"
                    required
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Pratik Kumar"
                    className="mt-2 w-full rounded-[9px] px-4 py-3 text-[15px] outline-none"
                    style={{ fontFamily: 'Poppins, sans-serif', background: 'rgba(17,17,17,.04)', border: '1px solid rgba(17,17,17,.10)' }}
                  />

                  <div className="mt-4">
                    <label className="aon-eyebrow block" htmlFor="ov-phone">Phone</label>
                    <div className="mt-2 flex gap-2">
                      <select
                        aria-label="Country code"
                        value={dial}
                        onChange={(event) => setDial(event.target.value)}
                        className="aon-num rounded-[9px] px-3 py-3 text-[15px] outline-none"
                        style={{ background: 'rgba(17,17,17,.04)', border: '1px solid rgba(17,17,17,.10)' }}
                      >
                        {DIAL_CODES.map(([code, iso]) => <option key={iso} value={code}>{iso} {code}</option>)}
                      </select>
                      <input
                        id="ov-phone"
                        required
                        inputMode="tel"
                        value={phone}
                        onChange={(event) => setPhone(event.target.value)}
                        placeholder="214 555 0148"
                        className="aon-num flex-1 rounded-[9px] px-4 py-3 text-[15px] outline-none"
                        style={{ background: 'rgba(17,17,17,.04)', border: '1px solid rgba(17,17,17,.10)' }}
                      />
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-[1fr_1.2fr_0.8fr] gap-2">
                    <div>
                      <label className="aon-eyebrow block" htmlFor="ov-state">State</label>
                      <select
                        id="ov-state"
                        required
                        value={state}
                        onChange={(event) => { setState(event.target.value); setCity(''); }}
                        className="mt-2 w-full rounded-[9px] px-3 py-3 text-[15px] outline-none"
                        style={{ fontFamily: 'Poppins, sans-serif', background: 'rgba(17,17,17,.04)', border: '1px solid rgba(17,17,17,.10)' }}
                      >
                        <option value="">—</option>
                        {US_STATES.map(([abbr]) => <option key={abbr} value={abbr}>{abbr}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="aon-eyebrow block" htmlFor="ov-city">City</label>
                      <input
                        id="ov-city"
                        required
                        list="ov-cities"
                        value={city}
                        onChange={(event) => setCity(event.target.value)}
                        disabled={!state}
                        placeholder={state ? 'Start typing' : 'Pick a state'}
                        className="mt-2 w-full rounded-[9px] px-4 py-3 text-[15px] outline-none disabled:opacity-50"
                        style={{ fontFamily: 'Poppins, sans-serif', background: 'rgba(17,17,17,.04)', border: '1px solid rgba(17,17,17,.10)' }}
                      />
                      <datalist id="ov-cities">
                        {(CITIES_BY_STATE[state] ?? []).map((candidate) => <option key={candidate} value={candidate} />)}
                      </datalist>
                    </div>
                    <div>
                      <label className="aon-eyebrow block" htmlFor="ov-zip">ZIP</label>
                      <input
                        id="ov-zip"
                        inputMode="numeric"
                        maxLength={5}
                        value={zip}
                        onChange={(event) => setZip(digitsOnly(event.target.value))}
                        placeholder="75201"
                        className="aon-num mt-2 w-full rounded-[9px] px-3 py-3 text-[15px] outline-none"
                        style={{ background: 'rgba(17,17,17,.04)', border: '1px solid rgba(17,17,17,.10)' }}
                      />
                    </div>
                  </div>

                  {role === 'carrier' && (
                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div>
                        <label className="aon-eyebrow block" htmlFor="ov-mc">MC (optional)</label>
                        <input
                          id="ov-mc"
                          inputMode="numeric"
                          value={mc}
                          onChange={(event) => setMc(event.target.value)}
                          placeholder="123456"
                          className="aon-num mt-2 w-full rounded-[9px] px-4 py-3 text-[15px] outline-none"
                          style={{ background: 'rgba(17,17,17,.04)', border: '1px solid rgba(17,17,17,.10)' }}
                        />
                      </div>
                      <div>
                        <label className="aon-eyebrow block" htmlFor="ov-usdot">USDOT (optional)</label>
                        <input
                          id="ov-usdot"
                          inputMode="numeric"
                          value={usdot}
                          onChange={(event) => setUsdot(event.target.value)}
                          placeholder="1234567"
                          className="aon-num mt-2 w-full rounded-[9px] px-4 py-3 text-[15px] outline-none"
                          style={{ background: 'rgba(17,17,17,.04)', border: '1px solid rgba(17,17,17,.10)' }}
                        />
                      </div>
                      <p className="aon-body col-span-2 text-[12px] leading-[1.6]">
                        Shown to people you deal with so they can look you up. We do not check it.
                      </p>
                    </div>
                  )}
                </>
              )}

              <label className="aon-eyebrow mt-4 block" htmlFor="ov-email">Email</label>
              <input
                id="ov-email"
                type="email"
                required
                value={email}
                autoComplete="username"
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@company.com"
                className="mt-2 w-full rounded-[9px] px-4 py-3 text-[15px] outline-none"
                style={{ fontFamily: 'Poppins, sans-serif', background: 'rgba(17,17,17,.04)', border: '1px solid rgba(17,17,17,.10)' }}
              />

              {method === 'password' && (
                <>
                  <div className="mt-4 flex items-baseline justify-between gap-3">
                    <label className="aon-eyebrow" htmlFor="ov-password">Password</label>
                    {!isSignIn && (
                      <button
                        type="button"
                        onClick={suggest}
                        className="text-[11.5px] underline underline-offset-2"
                        style={{ fontFamily: 'Poppins, sans-serif', color: ACCENT }}
                      >
                        Suggest a strong one
                      </button>
                    )}
                  </div>
                  <div className="relative mt-2">
                    <input
                      id="ov-password"
                      type={showPw ? 'text' : 'password'}
                      value={password}
                      minLength={MIN_PASSWORD}
                      autoComplete={isSignIn ? 'current-password' : 'new-password'}
                      onChange={(event) => { setPassword(event.target.value); setJustGenerated(false); }}
                      placeholder={isSignIn ? 'Your password' : 'At least 8 characters'}
                      className={`w-full rounded-[9px] py-3 pl-4 pr-[68px] text-[15px] outline-none ${showPw ? 'aon-num' : ''}`}
                      style={{ fontFamily: showPw ? undefined : 'Poppins, sans-serif', background: 'rgba(17,17,17,.04)', border: '1px solid rgba(17,17,17,.10)' }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw((visible) => !visible)}
                      aria-label={showPw ? 'Hide password' : 'Show password'}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px]"
                      style={{ fontFamily: 'Poppins, sans-serif', color: 'rgba(17,17,17,.65)' }}
                    >
                      {showPw ? 'Hide' : 'Show'}
                    </button>
                  </div>

                  {!isSignIn && password && (() => {
                    const status = strength(password);
                    const bar = ['#DC2626', '#DC2626', '#B45309', '#0F7A4A', '#0F7A4A'][status.score];
                    return (
                      <div className="mt-2">
                        <div className="flex gap-1" aria-hidden>
                          {[1, 2, 3, 4].map((step) => (
                            <span
                              key={step}
                              className="h-[3px] flex-1 rounded-full"
                              style={{ background: step <= status.score ? bar : 'rgba(17,17,17,.10)' }}
                            />
                          ))}
                        </div>
                        <p className="mt-1.5 text-[11.5px]" style={{ fontFamily: 'Poppins, sans-serif', color: 'rgba(17,17,17,.65)' }}>
                          <span style={{ color: bar }}>{status.label}</span>
                          {status.hint ? ` — ${status.hint}` : ''}
                        </p>
                      </div>
                    );
                  })()}

                  {!isSignIn && justGenerated && (
                    <p className="mt-1.5 text-[11.5px]" style={{ fontFamily: 'Poppins, sans-serif', color: 'rgba(17,17,17,.65)' }}>
                      Generated in your browser. Let your password manager save it when it offers.
                    </p>
                  )}
                  {mode === 'local' && (
                    <p className="mt-2 text-[11.5px] leading-[1.6]" style={{ fontFamily: 'Poppins, sans-serif', color: 'rgba(17,17,17,.65)' }}>
                      Demo mode: this browser does not store or verify passwords; it remembers your profile and matches sign-in by email.
                    </p>
                  )}
                </>
              )}

              {errorText && (
                <p id="auth-dialog-error" className="mt-4 text-[13px]" style={{ fontFamily: 'Poppins, sans-serif', color: DANGER }} role="alert">
                  {errorText}
                </p>
              )}

              <button
                type="submit"
                disabled={busy}
                className="aon-cta aon-cta--dark mt-6 w-full justify-center"
                style={{ opacity: busy ? 0.5 : 1 }}
              >
                {busy
                  ? 'Working…'
                  : method === 'link'
                    ? mode === 'supabase' ? (isSignIn ? 'Email me a sign-in link' : 'Email me a link') : (isSignIn ? 'Sign in (demo mode)' : 'Continue')
                    : isSignIn ? 'Sign in' : 'Create account'}
              </button>

              <div className="mt-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-center">
                <button
                  type="button"
                  onClick={() => switchView(isSignIn ? 'signup' : 'signin')}
                  className="text-[12px] underline underline-offset-2"
                  style={{ fontFamily: 'Poppins, sans-serif', color: ACCENT }}
                >
                  {isSignIn ? 'New here? Create an account' : 'Already have an account? Sign in'}
                </button>
                <span aria-hidden style={{ color: 'rgba(17,17,17,.65)' }}>·</span>
                <button
                  type="button"
                  onClick={() => { setMethod((current) => current === 'password' ? 'link' : 'password'); setError(null); }}
                  className="text-[12px] underline underline-offset-2"
                  style={{ fontFamily: 'Poppins, sans-serif', color: 'rgba(17,17,17,.65)' }}
                >
                  {method === 'password' ? (isSignIn ? 'Use a sign-in link instead' : 'Email me a link instead') : 'Use a password instead'}
                </button>
              </div>
            </form>

            {mode === 'supabase' && (
              <>
                <div className="my-5 flex items-center gap-3">
                  <span className="h-px flex-1" style={{ background: 'rgba(17,17,17,.10)' }} />
                  <span className="aon-eyebrow" style={{ fontSize: 9, color: 'rgba(17,17,17,.65)' }}>or</span>
                  <span className="h-px flex-1" style={{ background: 'rgba(17,17,17,.10)' }} />
                </div>
                <button
                  type="button"
                  disabled={googleBusy}
                  onClick={async () => {
                    setGoogleBusy(true);
                    setError(null);
                    const result = await signInWithGoogle(isSignIn ? undefined : role);
                    if (!result.ok) {
                      setError(result.error ?? 'Google sign-in failed.');
                      setGoogleBusy(false);
                    }
                  }}
                  className="flex w-full items-center justify-center gap-3 rounded-[9px] px-4 py-3 text-[14px] transition-colors hover:bg-[rgba(17,17,17,.03)]"
                  style={{ fontFamily: 'Poppins, sans-serif', color: INK, border: '1px solid rgba(17,17,17,.16)', opacity: googleBusy ? 0.5 : 1 }}
                >
                  <svg width="17" height="17" viewBox="0 0 18 18" aria-hidden>
                    <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62Z" />
                    <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.33A9 9 0 0 0 9 18Z" />
                    <path fill="#FBBC05" d="M3.97 10.72a5.4 5.4 0 0 1 0-3.44V4.95H.96a9 9 0 0 0 0 8.1l3.01-2.33Z" />
                    <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.9 11.43 0 9 0A9 9 0 0 0 .96 4.95l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58Z" />
                  </svg>
                  {googleBusy ? 'Opening Google…' : 'Continue with Google'}
                </button>
              </>
            )}

            {mode === 'local' && (
              <p className="mt-4 text-[12px] leading-[1.6]" style={{ fontFamily: 'Poppins, sans-serif', color: DANGER }}>
                Demo mode: no email is sent. Create an account on this device, then sign in again with its email.
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
