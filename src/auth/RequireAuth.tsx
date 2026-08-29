import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

/**
 * Route guard. Holds render until the session is restored so an authenticated user
 * never sees a flash of the signed-out state, then bounces to the board's public
 * face and opens the sign-in dialog.
 */
export default function RequireAuth({ children }: { children: JSX.Element }) {
  const { user, loading, openAuth } = useAuth();
  const loc = useLocation();

  useEffect(() => {
    if (!loading && !user) openAuth();
  }, [loading, user, openAuth]);

  if (loading) return <div className="min-h-screen bg-[#FBFAF8]" />;
  if (!user) return <Navigate to="/" replace state={{ from: loc.pathname }} />;
  return children;
}
