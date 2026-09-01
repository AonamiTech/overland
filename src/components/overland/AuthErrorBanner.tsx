import React, { useEffect, useState } from 'react';
import { useAuth } from '@/auth/AuthContext';
import { DEFAULT_AUTH_RETURN_TO, readAuthIntent } from '@/auth/authIntent';

/**
 * Surfaces a failure that happened during the OAuth return.
 *
 * Coming back from Google to a signed-out homepage with no explanation is the worst
 * outcome in the whole flow: nothing is broken on screen, so there is nothing to react
 * to, and the only signal is that you are still logged out. The auth dialog is closed
 * at that point, so the message needs somewhere top-level to live.
 */
export default function AuthErrorBanner() {
  const { authError, user, openAuth, authOpen } = useAuth();
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => { if (authError) setDismissed(false); }, [authError]);

  if (!authError || user || dismissed || authOpen) return null;

  return (
    <div
      role="alert"
      className="fixed inset-x-0 top-0 z-[120] flex flex-wrap items-center justify-center gap-3 px-4 py-2.5 text-center"
      style={{ background: '#DC2626', color: '#FFFFFF', fontFamily: 'Poppins, sans-serif' }}
    >
      <span className="text-[13px]">{authError}</span>
      <button
        type="button"
        onClick={() => openAuth({ mode: 'signin', returnTo: readAuthIntent() ?? DEFAULT_AUTH_RETURN_TO })}
        className="text-[13px] underline underline-offset-2"
      >
        Try again
      </button>
      <button type="button" onClick={() => setDismissed(true)} aria-label="Dismiss" className="text-[15px] leading-none">
        ×
      </button>
    </div>
  );
}
