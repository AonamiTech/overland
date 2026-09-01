import React from 'react';

type FallbackProps = {
  error: unknown;
  componentStack: string | null;
  eventId: string | null;
  resetError(): void;
};

export default function ErrorBoundaryFallback({ error, eventId, resetError }: FallbackProps) {
  const message = error instanceof Error ? error.message : 'An unexpected error occurred.';

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FAF9F7] px-6 py-12">
      <div className="aon-card w-full max-w-[500px] p-8 text-center" style={{ border: '1px solid rgba(17,17,17,.10)' }}>
        <span className="aon-eyebrow" style={{ color: '#1E4D6B' }}>Error</span>
        <h1 className="aon-display mt-3 text-[26px]">Something went wrong on our side.</h1>
        <p className="aon-body mt-3 text-[14px] leading-[1.65]" style={{ color: 'rgba(17,17,17,.65)' }}>
          {message}
        </p>

        {eventId && (
          <p className="aon-num mt-4 rounded-[6px] bg-[rgba(17,17,17,.04)] px-3 py-1.5 text-[12px]" style={{ color: 'rgba(17,17,17,.65)' }}>
            Event ID: {eventId}
          </p>
        )}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <a
            href="/board"
            onClick={() => resetError()}
            className="aon-cta aon-cta--dark justify-center"
          >
            Back to the board
          </a>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="aon-cta aon-cta--ghost justify-center"
          >
            Reload page
          </button>
        </div>
      </div>
    </div>
  );
}
