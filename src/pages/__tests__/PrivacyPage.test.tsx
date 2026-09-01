import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import PrivacyPage from '../PrivacyPage';

describe('Task 5 Privacy Page', () => {
  it('renders privacy policy heading and key sections', () => {
    render(
      <BrowserRouter>
        <PrivacyPage />
      </BrowserRouter>
    );

    expect(screen.getByRole('heading', { level: 1, name: /Privacy Policy/i })).toBeInTheDocument();
    expect(screen.getByText(/What information we collect/i)).toBeInTheDocument();
    expect(screen.getByText(/Why we collect it/i)).toBeInTheDocument();
    expect(screen.getByText(/Who sees your information/i)).toBeInTheDocument();
    expect(screen.getByText(/Your rights and deletion requests/i)).toBeInTheDocument();

    const emailLink = screen.getByRole('link', { name: /privacy@overland.com/i });
    expect(emailLink).toBeInTheDocument();
    expect(emailLink.getAttribute('href')).toBe('mailto:privacy@overland.com');
  });
});
