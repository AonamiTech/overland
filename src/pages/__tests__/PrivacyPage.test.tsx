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
    expect(screen.getByRole('heading', { level: 2, name: /Google Sign-In data/i })).toBeInTheDocument();
    expect(screen.getByText(/Why we collect and use information/i)).toBeInTheDocument();
    expect(screen.getByText(/What is public and who receives information/i)).toBeInTheDocument();
    expect(screen.getByText(/Retention and deletion/i)).toBeInTheDocument();
    expect(screen.getByText(/do not request access to your Gmail/i)).toBeInTheDocument();
    expect(screen.getByText(/do not sell personal information or Google user data/i)).toBeInTheDocument();

    const emailLinks = screen.getAllByRole('link', { name: /privacy@overland.com/i });
    expect(emailLinks).toHaveLength(2);
    expect(emailLinks.every((link) => link.getAttribute('href') === 'mailto:privacy@overland.com')).toBe(true);
  });
});
