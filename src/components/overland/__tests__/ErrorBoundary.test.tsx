import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import * as Sentry from '@sentry/react';
import ErrorBoundaryFallback from '../ErrorBoundaryFallback';

function ProblemChild(): JSX.Element {
  throw new Error('Test crash in child component');
}

describe('Task 3 Error Boundary and Monitoring', () => {
  it('renders ErrorBoundaryFallback with apology, board link, and error message when a child throws', () => {
    // Suppress console.error output from React boundary in test logs
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <Sentry.ErrorBoundary
        fallback={({ error, componentStack, eventId, resetError }) => (
          <ErrorBoundaryFallback error={error} componentStack={componentStack} eventId={eventId} resetError={resetError} />
        )}
      >
        <ProblemChild />
      </Sentry.ErrorBoundary>
    );

    expect(screen.getByText(/Something went wrong on our side/i)).toBeInTheDocument();
    expect(screen.getByText(/Test crash in child component/i)).toBeInTheDocument();

    const boardLink = screen.getByRole('link', { name: /Back to the board/i });
    expect(boardLink).toBeInTheDocument();
    expect(boardLink.getAttribute('href')).toBe('/board');

    consoleSpy.mockRestore();
  });

  it('renders event ID if provided', () => {
    render(
      <ErrorBoundaryFallback
        error={new Error('Test error')}
        componentStack={null}
        eventId="evt_12345abc"
        resetError={vi.fn()}
      />
    );

    expect(screen.getByText(/Event ID: evt_12345abc/i)).toBeInTheDocument();
  });
});
