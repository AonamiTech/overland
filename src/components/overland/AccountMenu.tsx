import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, type Role, type AccountType } from '@/auth/AuthContext';
import { US_STATES, CITIES_BY_STATE, DIAL_CODES, digitsOnly, isValidPhone, isValidZip } from '@/lib/geo';

/**
 * Signed-in account control: avatar, dropdown, own-profile card.
 *
 * The card reads from the auth session rather than the profiles table, so it works
 * before the migration is run. Once listings are live it should read from `profiles`
 * so edits persist.
 */

const INK = '#111111';
const ACCENT = '#1E4D6B';
const HAIR = 'rgba(17,17,17,.10)';

const initials = (name: string, email: string) => {
  const n = name.trim();
  if (n) return n.split(/\s+/).slice(0, 2).map((p) => p[0]).join('').toUpperCase();
  return (email[0] ?? '?').toUpperCase();
};

const phoneFmt = (p?: string) =>
  p && p.length === 10 ? `(${p.slice(0, 3)}) ${p.slice(3, 6)}-${p.slice(6)}` : p || '—';

export default function AccountMenu() {
  const { user, signOut, updateProfile } = useAuth();

  /* The mobile tab bar has a "You" tab but no way to reach this card - the card's open
     state lives here. An event keeps that one-way rather than lifting state into a
     provider for a single button. */
  useEffect(() => {
    const open = () => { setCard(true); setEditing(false); setOpen(false); };
    window.addEventListener('overland:open-profile', open);
    return () => window.removeEventListener('overland:open-profile', open);
  }, []);
  const nav = useNavigate();
  const [open, setOpen] = useState(false);
  const [card, setCard] = useState(false);
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [f, setF] = useState({
    name: '', role: 'shipper' as Role, accountType: 'individual' as AccountType,
    orgName: '', dial: '+1', phone: '', state: '', city: '', zip: '',
    mcNumber: '', usdotNumber: '',
  });

  /* Split the stored "City, ST 75201" back into parts so the form can edit them. */
  const openEditor = () => {
    if (!user) return;
    const m = /^(.*?),\s*([A-Z]{2})(?:\s+(\d{5}))?$/.exec(user.city || '');
    const dialMatch = DIAL_CODES.map(([d]) => d).sort((a, b) => b.length - a.length)
      .find((d) => (user.phone || '').startsWith(d));
    setF({
      name: user.name || '',
      role: user.role,
      accountType: user.accountType,
      orgName: user.orgName || '',
      dial: dialMatch || '+1',
      phone: digitsOnly((user.phone || '').replace(dialMatch || '', '')),
      state: m?.[2] || '',
      city: m?.[1] || (m ? '' : user.city || ''),
      zip: m?.[3] || '',
      mcNumber: user.mcNumber || '',
      usdotNumber: user.usdotNumber || '',
    });
    setErr(null);
    setEditing(true);
  };

  const save = async () => {
    if (!f.name.trim()) { setErr('Add a name so counterparties know who they are dealing with.'); return; }
    if (f.phone && !isValidPhone(f.dial, f.phone)) { setErr(`Enter a valid ${f.dial} phone number.`); return; }
    if (f.zip && !isValidZip(f.zip)) { setErr('ZIP codes are 5 digits.'); return; }
    setBusy(true); setErr(null);
    const res = await updateProfile({
      name: f.name.trim(),
      role: f.role,
      accountType: f.accountType,
      orgName: f.accountType === 'company' ? f.orgName.trim() || undefined : undefined,
      phone: f.phone ? `${f.dial}${digitsOnly(f.phone)}` : '',
      city: [f.city.trim(), f.state].filter(Boolean).join(', ') + (f.zip ? ` ${f.zip}` : ''),
      mcNumber: f.role === 'carrier' ? f.mcNumber.trim() || undefined : undefined,
      usdotNumber: f.role === 'carrier' ? f.usdotNumber.trim() || undefined : undefined,
    });
    setBusy(false);
    if (!res.ok) { setErr(res.error ?? 'Could not save.'); return; }
    setEditing(false);
  };

  const inputCls = 'mt-2 w-full rounded-[9px] px-3 py-2.5 text-[14px] outline-none';
  const inputSty = { fontFamily: 'Poppins, sans-serif', background: 'rgba(17,17,17,.04)', border: `1px solid ${HAIR}` } as React.CSSProperties;
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const away = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', away);
    document.addEventListener('keydown', esc);
    return () => { document.removeEventListener('mousedown', away); document.removeEventListener('keydown', esc); };
  }, [open]);

  if (!user) return null;

  return (
    <>
      <div className="relative" ref={ref}>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-haspopup="menu"
          aria-expanded={open}
          aria-label="Account"
          className="flex h-8 w-8 items-center justify-center rounded-full transition-opacity hover:opacity-80"
          style={{ background: INK, color: '#FAF9F7', fontFamily: 'Poppins, sans-serif', fontSize: 11, fontWeight: 600 }}
        >
          {initials(user.name, user.email)}
        </button>

        {open && (
          <div
            role="menu"
            className="absolute right-0 z-[70] mt-2 w-[228px] overflow-hidden rounded-[9px] bg-white"
            style={{ border: `1px solid ${HAIR}`, boxShadow: '0 18px 40px -22px rgba(17,17,17,.35)' }}
          >
            <div className="px-4 py-3" style={{ borderBottom: `1px solid ${HAIR}` }}>
              <div className="truncate text-[13px]" style={{ fontFamily: 'Poppins, sans-serif', color: INK }}>
                {user.name || user.email}
              </div>
              <span className="aon-eyebrow" style={{ fontSize: 9, color: 'rgba(17,17,17,.65)' }}>
                {user.role === 'carrier' ? 'Carrier' : 'Shipper'} · {user.accountType === 'company' ? 'Company' : 'Individual'}
              </span>
            </div>

            {[
              ['Your profile', () => { setCard(true); setEditing(false); setOpen(false); }],
              ['Rate board', () => { nav('/board'); setOpen(false); }],
            ].map(([label, fn]) => (
              <button
                key={label as string}
                type="button"
                role="menuitem"
                onClick={fn as () => void}
                className="block w-full px-4 py-2.5 text-left text-[13px] transition-colors hover:bg-[rgba(17,17,17,.04)]"
                style={{ fontFamily: 'Poppins, sans-serif', color: INK }}
              >
                {label as string}
              </button>
            ))}

            <button
              type="button"
              role="menuitem"
              onClick={() => { setOpen(false); signOut().then(() => nav('/')); }}
              className="block w-full px-4 py-2.5 text-left text-[13px] transition-colors hover:bg-[rgba(17,17,17,.04)]"
              style={{ fontFamily: 'Poppins, sans-serif', color: '#DC2626', borderTop: `1px solid ${HAIR}` }}
            >
              Sign out
            </button>
          </div>
        )}
      </div>

      {card && (
        <div className="fixed inset-0 z-[95] flex items-end justify-center sm:items-center"
             style={{ background: 'rgba(17,17,17,.45)' }} onClick={() => setCard(false)}>
          {/* The mobile tab bar is fixed over the bottom of the viewport, so a sheet that
              ends flush with the bottom has its last control hidden underneath it. */}
          <div className="max-h-[88vh] w-full max-w-[430px] overflow-y-auto rounded-t-[16px] bg-white p-7 pb-[calc(28px+64px+env(safe-area-inset-bottom))] sm:rounded-[9px] sm:pb-7"
               onClick={(e) => e.stopPropagation()}>
            <span className="aon-eyebrow" style={{ color: ACCENT }}>Your profile</span>

            {!editing ? (
              <>
                <div className="mt-2 flex items-start justify-between gap-4">
                  <h2 className="aon-display text-[24px]">{user.name || 'Unnamed'}</h2>
                  <button type="button" onClick={openEditor} className="aon-eyebrow shrink-0" style={{ color: ACCENT }}>
                    Edit
                  </button>
                </div>

                <dl className="mt-5 space-y-0">
                  {[
                    ['Email', user.email],
                    ['Phone', user.phone || '—'],
                    ['Based in', user.city || '—'],
                    ['Posting as', user.accountType === 'company' ? (user.orgName || 'Company') : 'Individual'],
                    ['Role', user.role === 'carrier' ? 'Carrier' : 'Shipper'],
                    ...(user.role === 'carrier'
                      ? [['MC', user.mcNumber || '—'], ['USDOT', user.usdotNumber || '—']] as Array<[string, string]>
                      : []),
                  ].map(([k, v]) => (
                    <div key={k} className="flex items-baseline justify-between gap-4 py-2.5" style={{ borderTop: `1px solid ${HAIR}` }}>
                      <dt className="aon-eyebrow shrink-0" style={{ fontSize: 9 }}>{k}</dt>
                      <dd className="aon-num truncate text-[14px]" style={{ color: INK }}>{v}</dd>
                    </div>
                  ))}
                </dl>

                {(!user.name || !user.phone || !user.city) && (
                  <p className="aon-body mt-4 text-[12px] leading-[1.6]">
                    Missing details are shown to whoever you deal with as blanks. Add them
                    before you post.
                  </p>
                )}
              </>
            ) : (
              <>
                <h2 className="aon-display mt-2 text-[24px]">Edit profile</h2>

                <div className="mt-5 grid grid-cols-2 gap-2">
                  {(['shipper', 'carrier'] as Role[]).map((r) => (
                    <button key={r} type="button" onClick={() => setF({ ...f, role: r })}
                            className="rounded-[9px] px-3 py-2.5 text-[13px]"
                            style={{ fontFamily: 'Poppins, sans-serif',
                                     background: f.role === r ? INK : 'rgba(17,17,17,.04)',
                                     color: f.role === r ? '#FAF9F7' : 'rgba(17,17,17,.6)' }}>
                      {r === 'shipper' ? 'I have freight' : 'I have a truck'}
                    </button>
                  ))}
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2">
                  {(['individual', 'company'] as AccountType[]).map((a) => (
                    <button key={a} type="button" onClick={() => setF({ ...f, accountType: a })}
                            className="rounded-[9px] px-3 py-2.5 text-[13px]"
                            style={{ fontFamily: 'Poppins, sans-serif',
                                     background: f.accountType === a ? 'rgba(30,77,107,.08)' : 'rgba(17,17,17,.04)',
                                     color: f.accountType === a ? ACCENT : 'rgba(17,17,17,.6)',
                                     border: `1px solid ${f.accountType === a ? 'rgba(30,77,107,.35)' : 'transparent'}` }}>
                      {a === 'individual' ? 'An individual' : 'A company'}
                    </button>
                  ))}
                </div>

                <label className="aon-eyebrow mt-4 block">Name</label>
                <input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })}
                       className={inputCls} style={inputSty} placeholder="Pratik Kumar" />

                {f.accountType === 'company' && (
                  <>
                    <label className="aon-eyebrow mt-4 block">Company</label>
                    <input value={f.orgName} onChange={(e) => setF({ ...f, orgName: e.target.value })}
                           className={inputCls} style={inputSty} placeholder="Aonami Freight" />
                  </>
                )}

                <label className="aon-eyebrow mt-4 block">Phone</label>
                <div className="mt-2 flex gap-2">
                  <select aria-label="Country code" value={f.dial} onChange={(e) => setF({ ...f, dial: e.target.value })}
                          className="aon-num rounded-[9px] px-2 py-2.5 text-[14px] outline-none" style={inputSty}>
                    {DIAL_CODES.map(([c, iso]) => <option key={iso} value={c}>{iso} {c}</option>)}
                  </select>
                  <input value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} inputMode="tel"
                         className="aon-num flex-1 rounded-[9px] px-3 py-2.5 text-[14px] outline-none"
                         style={inputSty} placeholder="214 555 0148" />
                </div>

                <div className="mt-4 grid grid-cols-[0.8fr_1.2fr_0.8fr] gap-2">
                  <div>
                    <label className="aon-eyebrow block">State</label>
                    <select value={f.state} onChange={(e) => setF({ ...f, state: e.target.value, city: '' })}
                            className={inputCls} style={inputSty}>
                      <option value="">—</option>
                      {US_STATES.map(([a]) => <option key={a} value={a}>{a}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="aon-eyebrow block">City</label>
                    <input list="ov-edit-cities" value={f.city} onChange={(e) => setF({ ...f, city: e.target.value })}
                           disabled={!f.state} className={inputCls + ' disabled:opacity-50'} style={inputSty}
                           placeholder={f.state ? 'Start typing' : 'Pick a state'} />
                    <datalist id="ov-edit-cities">
                      {(CITIES_BY_STATE[f.state] ?? []).map((c) => <option key={c} value={c} />)}
                    </datalist>
                  </div>
                  <div>
                    <label className="aon-eyebrow block">ZIP</label>
                    <input value={f.zip} maxLength={5} inputMode="numeric"
                           onChange={(e) => setF({ ...f, zip: digitsOnly(e.target.value) })}
                           className={inputCls} style={inputSty} placeholder="75201" />
                  </div>
                </div>

                {f.role === 'carrier' && (
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <div>
                      <label className="aon-eyebrow block">MC</label>
                      <input value={f.mcNumber} inputMode="numeric"
                             onChange={(e) => setF({ ...f, mcNumber: digitsOnly(e.target.value) })}
                             className={inputCls} style={inputSty} placeholder="412885" />
                    </div>
                    <div>
                      <label className="aon-eyebrow block">USDOT</label>
                      <input value={f.usdotNumber} inputMode="numeric"
                             onChange={(e) => setF({ ...f, usdotNumber: digitsOnly(e.target.value) })}
                             className={inputCls} style={inputSty} placeholder="1885402" />
                    </div>
                  </div>
                )}

                {err && (
                  <p className="mt-4 text-[13px]" role="alert"
                     style={{ fontFamily: 'Poppins, sans-serif', color: '#DC2626' }}>{err}</p>
                )}

                <div className="mt-6 flex items-center justify-center gap-2">
                  <button type="button" onClick={save} disabled={busy}
                          className="aon-cta aon-cta--dark" style={{ opacity: busy ? 0.5 : 1 }}>
                    {busy ? 'Saving…' : 'Save profile'}
                  </button>
                  <button type="button" onClick={() => setEditing(false)} className="aon-cta aon-cta--ghost">
                    Cancel
                  </button>
                </div>
              </>
            )}

            {!editing && <button type="button" onClick={() => setCard(false)} className="aon-cta aon-cta--ghost mt-6">Close</button>}
          </div>
        </div>
      )}
    </>
  );
}
