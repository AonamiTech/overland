import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { clearAuthIntent, readAuthIntent } from './authIntent';

/**
 * Completes a full-page Google or email-link redirect. Password auth navigates
 * directly from AuthDialog; this component handles the browser-return case after
 * AuthProvider has restored the Supabase session.
 */
export default function AuthReturnRedirect() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (loading || !user) return;
    const destination = readAuthIntent();
    if (!destination) return;

    clearAuthIntent();
    const current = `${location.pathname}${location.search}${location.hash}`;
    if (destination !== current) navigate(destination, { replace: true });
  }, [loading, user, location.pathname, location.search, location.hash, navigate]);

  return null;
}
