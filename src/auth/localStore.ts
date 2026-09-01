import type { AccountType, Role, SignUpExtra, User } from './AuthContext';

/** Local mode is a demo fallback, so only profile metadata is persisted. */
export const SESSION_STORAGE_KEY = 'overland.session.v1';
export const ACCOUNTS_STORAGE_KEY = 'overland.accounts.v1';

function cleanEmail(email: string): string {
  return email.trim().toLowerCase();
}

function parseUser(value: unknown): User | null {
  if (!value || typeof value !== 'object') return null;
  const candidate = value as Partial<User>;
  if (typeof candidate.id !== 'string' || typeof candidate.email !== 'string') return null;
  if (typeof candidate.role !== 'string' || typeof candidate.accountType !== 'string') return null;
  return candidate as User;
}

function readAccounts(): Record<string, User> {
  try {
    const raw = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    return Object.fromEntries(
      Object.entries(parsed)
        .map(([email, value]) => [cleanEmail(email), parseUser(value)] as const)
        .filter((entry): entry is readonly [string, User] => Boolean(entry[1])),
    );
  } catch {
    return {};
  }
}

function writeAccounts(accounts: Record<string, User>): void {
  try { localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts)); } catch { /* storage unavailable */ }
}

export function readLocalSession(): User | null {
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    const user = raw ? parseUser(JSON.parse(raw)) : null;
    // Migrate sessions created by the previous local implementation so they can
    // sign back in after the first sign-out.
    if (user) saveLocalAccount(user);
    return user;
  } catch {
    return null;
  }
}

export function writeLocalSession(user: User): void {
  try { localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user)); } catch { /* storage unavailable */ }
}

export function clearLocalSession(): void {
  try { localStorage.removeItem(SESSION_STORAGE_KEY); } catch { /* storage unavailable */ }
}

export function readLocalAccount(email: string): User | null {
  return readAccounts()[cleanEmail(email)] ?? null;
}

export function saveLocalAccount(user: User): void {
  const accounts = readAccounts();
  accounts[cleanEmail(user.email)] = user;
  writeAccounts(accounts);
}

export function createLocalUser(email: string, role: Role, extra?: SignUpExtra): User {
  return {
    id: `local-${cleanEmail(email)}`,
    email: cleanEmail(email),
    role,
    accountType: extra?.accountType ?? ('individual' as AccountType),
    name: extra?.name ?? '',
    phone: extra?.phone ?? '',
    city: extra?.city ?? '',
    orgName: extra?.orgName,
    mcNumber: extra?.mcNumber,
    usdotNumber: extra?.usdotNumber,
    createdAt: new Date().toISOString(),
  };
}
