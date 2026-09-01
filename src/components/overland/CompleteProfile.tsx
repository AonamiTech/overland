import React, { useEffect, useState } from 'react';
import { useAuth, type Role, type AccountType } from '@/auth/AuthContext';
import { US_STATES, CITIES_BY_STATE, DIAL_CODES, digitsOnly, isValidPhone, isValidZip } from '@/lib/geo';

/**
 * Post-OAuth completion.
 *
 * Google returns a name and an email and nothing else, so a user who signs in that way
 * has no role, phone or location - and every listing they post would show blanks to a
 * counterparty. This asks for the missing pieces once, immediately after sign-in.
 *
 * Only shown when something is actually missing, so email signups (which collect it all
 * up front) never see it.
 */

const INK = '#111111';
const ACCENT = '#1E4D6B';
const HAIR = 'rgba(17,17,17,.10)';
const DANGER = '#DC2626';

export default function CompleteProfile() {
  const { user, loading, updateProfile } = useAuth();
  const [role, setRole] = useState<Role>('shipper');
  const [acct, setAcct] = useState<AccountType>('individual');
  const [org, setOrg] = useState('');
  const [dial, setDial] = useState('+1');
  const [phone, setPhone] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [zip, setZip] = useState('');
  const [mc, setMc] = useState('');
  const [usdot, setUsdot] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [skipped, setSkipped] = useState(false);

  /* Escape dismisses, matching every other dialog here. Registered before the
     early return so the hook order stays stable across renders. */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setSkipped(true); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const incomplete = !!user && (!user.phone || !user.city);
  if (loading || !user || !incomplete || skipped) return null;

  const save = async () => {
    if (!isValidPhone(dial, phone)) { setErr(`Enter a valid ${dial} phone number.`); return; }
    if (!state || !city.trim()) { setErr('Where are you based?'); return; }
    if (zip && !isValidZip(zip)) { setErr('ZIP codes are 5 digits.'); return; }
    setBusy(true); setErr(null);
    const res = await updateProfile({
      role, accountType: acct,
      orgName: acct === 'company' ? org.trim() || undefined : undefined,
      phone: `${dial}${digitsOnly(phone)}`,
      city: `${city.trim()}, ${state}${zip ? ` ${zip}` : ''}`,
      mcNumber: role === 'carrier' ? mc.trim() || undefined : undefined,
      usdotNumber: role === 'carrier' ? usdot.trim() || undefined : undefined,
    });
    setBusy(false);
    if (!res.ok) setErr(res.error ?? 'Could not save.');
  };

  const fld = 'mt-2 w-full rounded-[9px] px-3 py-2.5 text-[14px] outline-none';
  const sty = { fontFamily: 'Poppins, sans-serif', background: 'rgba(17,17,17,.04)', border: `1px solid ${HAIR}` } as React.CSSProperties;
  const pill = (on: boolean) => ({
    fontFamily: 'Poppins, sans-serif',
    background: on ? INK : 'rgba(17,17,17,.04)',
    color: on ? '#FAF9F7' : 'rgba(17,17,17,.6)',
  });

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center overflow-y-auto sm:items-center"
         style={{ background: 'rgba(17,17,17,.5)' }}>
      <div className="relative my-6 w-full max-w-[440px] rounded-t-[16px] bg-white p-7 sm:rounded-[9px]">
        {/* Same dismissal as "I'll do this later", in the place people look for it.
            The step is genuinely optional - it is skippable either way - so leaving
            only a text link at the bottom made it read as a wall. */}
        <button
          type="button"
          onClick={() => setSkipped(true)}
          aria-label="Close"
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-[rgba(17,17,17,.06)]"
          style={{ color: 'rgba(17,17,17,.45)', fontSize: 20, lineHeight: 1 }}
        >
          &times;
        </button>
        <span className="aon-eyebrow" style={{ color: ACCENT }}>One more step</span>
        <h2 className="aon-display mt-2 text-[24px]">
          {user.name ? `Welcome, ${user.name.split(' ')[0]}.` : 'Almost there.'}
        </h2>
        <p className="aon-body mt-2 text-[13px] leading-[1.6]">
          Counterparties see who they are dealing with before they bid. Two details and
          you are on the board.
        </p>

        <div className="mt-5 grid grid-cols-2 gap-2">
          {(['shipper', 'carrier'] as Role[]).map((r) => (
            <button key={r} type="button" onClick={() => setRole(r)}
                    className="rounded-[9px] px-3 py-2.5 text-[13px]" style={pill(role === r)}>
              {r === 'shipper' ? 'I have freight' : 'I have a truck'}
            </button>
          ))}
        </div>

        <div className="mt-2 grid grid-cols-2 gap-2">
          {(['individual', 'company'] as AccountType[]).map((a) => (
            <button key={a} type="button" onClick={() => setAcct(a)}
                    className="rounded-[9px] px-3 py-2.5 text-[13px]"
                    style={{ fontFamily: 'Poppins, sans-serif',
                             background: acct === a ? 'rgba(30,77,107,.08)' : 'rgba(17,17,17,.04)',
                             color: acct === a ? ACCENT : 'rgba(17,17,17,.6)',
                             border: `1px solid ${acct === a ? 'rgba(30,77,107,.35)' : 'transparent'}` }}>
              {a === 'individual' ? 'An individual' : 'A company'}
            </button>
          ))}
        </div>

        {acct === 'company' && (
          <>
            <label className="aon-eyebrow mt-4 block">Company</label>
            <input value={org} onChange={(e) => setOrg(e.target.value)} className={fld} style={sty}
                   placeholder="Reed Logistics" />
          </>
        )}

        <label className="aon-eyebrow mt-4 block">Phone</label>
        <div className="mt-2 flex gap-2">
          <select aria-label="Country code" value={dial} onChange={(e) => setDial(e.target.value)}
                  className="aon-num rounded-[9px] px-2 py-2.5 text-[14px] outline-none" style={sty}>
            {DIAL_CODES.map(([c, iso]) => <option key={iso} value={c}>{iso} {c}</option>)}
          </select>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel"
                 className="aon-num flex-1 rounded-[9px] px-3 py-2.5 text-[14px] outline-none"
                 style={sty} placeholder="214 555 0148" />
        </div>

        <div className="mt-4 grid grid-cols-[0.8fr_1.2fr_0.8fr] gap-2">
          <div>
            <label className="aon-eyebrow block">State</label>
            <select value={state} onChange={(e) => { setState(e.target.value); setCity(''); }}
                    className={fld} style={sty}>
              <option value="">—</option>
              {US_STATES.map(([a]) => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
          <div>
            <label className="aon-eyebrow block">City</label>
            <input list="ov-cp-cities" value={city} onChange={(e) => setCity(e.target.value)}
                   disabled={!state} className={fld + ' disabled:opacity-50'} style={sty}
                   placeholder={state ? 'Start typing' : 'Pick a state'} />
            <datalist id="ov-cp-cities">
              {(CITIES_BY_STATE[state] ?? []).map((c) => <option key={c} value={c} />)}
            </datalist>
          </div>
          <div>
            <label className="aon-eyebrow block">ZIP</label>
            <input value={zip} maxLength={5} inputMode="numeric"
                   onChange={(e) => setZip(digitsOnly(e.target.value))} className={fld} style={sty}
                   placeholder="75201" />
          </div>
        </div>

        {role === 'carrier' && (
          <div className="mt-4 grid grid-cols-2 gap-2">
            <div>
              <label className="aon-eyebrow block">MC (optional)</label>
              <input value={mc} inputMode="numeric" onChange={(e) => setMc(digitsOnly(e.target.value))}
                     className={fld} style={sty} placeholder="412885" />
            </div>
            <div>
              <label className="aon-eyebrow block">USDOT (optional)</label>
              <input value={usdot} inputMode="numeric" onChange={(e) => setUsdot(digitsOnly(e.target.value))}
                     className={fld} style={sty} placeholder="1885402" />
            </div>
          </div>
        )}

        {err && <p className="mt-4 text-[13px]" role="alert"
                   style={{ fontFamily: 'Poppins, sans-serif', color: DANGER }}>{err}</p>}

        <button type="button" onClick={save} disabled={busy}
                className="aon-cta aon-cta--dark mt-6 w-full justify-center" style={{ opacity: busy ? 0.5 : 1 }}>
          {busy ? 'Saving…' : 'Start using the board'}
        </button>
        {/* Escapable on purpose - a hard gate on first login loses people. They can
            fill it in later from the profile menu, and posting nags them then. */}
        <button type="button" onClick={() => setSkipped(true)}
                className="mt-3 w-full text-center text-[12px]"
                style={{ fontFamily: 'Poppins, sans-serif', color: 'rgba(17,17,17,.42)' }}>
          I'll do this later
        </button>
      </div>
    </div>
  );
}
