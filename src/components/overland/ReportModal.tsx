import React, { useState } from 'react';
import { useAuth } from '@/auth/AuthContext';
import { currentAuthReturnTo } from '@/auth/authIntent';
import { reportContent } from '@/lib/db';

const ACCENT = '#1E4D6B';
const HAIR = 'rgba(17,17,17,.10)';

export default function ReportModal({
  subjectType,
  subjectId,
  onClose,
}: {
  subjectType: 'listing' | 'bid' | 'profile';
  subjectId: string;
  onClose: () => void;
}) {
  const { user, openAuth } = useAuth();
  const [reason, setReason] = useState('');
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  if (!user) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ background: 'rgba(17,17,17,.45)' }} onClick={onClose}>
        <div className="aon-card w-full max-w-[420px] p-6 text-center" onClick={(e) => e.stopPropagation()}>
          <h3 className="aon-display text-[20px]">Sign in to report</h3>
          <p className="aon-body mt-2 text-[13px] leading-[1.6]">
            Reporting suspicious freight or capacity requires a member account.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <button
              type="button"
              onClick={() => { onClose(); openAuth({ mode: 'signin', returnTo: currentAuthReturnTo() }); }}
              className="aon-cta aon-cta--dark"
            >
              Sign in
            </button>
            <button type="button" onClick={onClose} className="aon-cta aon-cta--ghost">
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return setErr('Please provide a reason for the report.');
    setBusy(true);
    setErr(null);

    const res = await reportContent({
      reporterId: user.id,
      subjectType,
      subjectId,
      reason: reason.trim(),
    });

    setBusy(false);
    if (res.ok) {
      setDone(true);
    } else {
      setErr(res.error ?? 'Could not submit report.');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ background: 'rgba(17,17,17,.45)' }} onClick={onClose}>
      <div className="aon-card relative w-full max-w-[460px] p-6" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full hover:bg-[rgba(17,17,17,.06)]"
          style={{ color: 'rgba(17,17,17,.65)', fontSize: 18 }}
        >
          ×
        </button>

        {done ? (
          <div className="text-center py-4">
            <span className="aon-eyebrow" style={{ color: ACCENT }}>Submitted</span>
            <h3 className="aon-display mt-2 text-[22px]">Thank you</h3>
            <p className="aon-body mt-3 text-[13.5px] leading-[1.6]">
              Your report has been received and flagged for review.
            </p>
            <button type="button" onClick={onClose} className="aon-cta aon-cta--dark mt-6 w-full justify-center">
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={submit}>
            <span className="aon-eyebrow" style={{ color: ACCENT }}>Flag content</span>
            <h3 className="aon-display mt-1.5 text-[22px]">Report this {subjectType}</h3>
            <p className="aon-body mt-2 text-[13px] leading-[1.6]">
              Reports are reviewed by platform operators to remove fraudulent or misleading postings.
            </p>

            <div className="mt-4">
              <label htmlFor="ov-report-reason" className="aon-eyebrow block">
                Reason for report
              </label>
              <textarea
                id="ov-report-reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                maxLength={500}
                rows={4}
                placeholder="Describe why this load, bid, or profile is suspicious (e.g. double brokering, fake DOT, spam)..."
                className="mt-2 w-full rounded-[9px] p-3 text-[13.5px] outline-none"
                style={{ fontFamily: 'Poppins, sans-serif', background: '#FAF9F7', border: `1px solid ${HAIR}` }}
              />
              <span className="aon-num text-right text-[11px] block mt-1" style={{ color: 'rgba(17,17,17,.65)' }}>
                {reason.length}/500
              </span>
            </div>

            {err && (
              <p className="mt-3 text-[12.5px]" role="alert" style={{ color: '#DC2626', fontFamily: 'Poppins, sans-serif' }}>
                {err}
              </p>
            )}

            <div className="mt-5 flex items-center justify-end gap-2">
              <button type="button" onClick={onClose} className="aon-cta aon-cta--ghost">
                Cancel
              </button>
              <button type="submit" disabled={busy} className="aon-cta aon-cta--dark" style={{ opacity: busy ? 0.6 : 1 }}>
                {busy ? 'Submitting…' : 'Submit Report'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
