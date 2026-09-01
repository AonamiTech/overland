import '@testing-library/jest-dom';

// Node 22 exposes a placeholder global `localStorage` that throws unless a
// `--localstorage-file` is supplied. Vitest's jsdom window has a real per-test
// origin-backed store; expose that store to code and tests using the browser global.
if (typeof window !== 'undefined') {
  const makeStorage = (): Storage => {
    const values = new Map<string, string>();
    return {
      get length() { return values.size; },
      clear: () => values.clear(),
      getItem: (key) => values.get(String(key)) ?? null,
      key: (index) => Array.from(values.keys())[index] ?? null,
      removeItem: (key) => values.delete(String(key)),
      setItem: (key, value) => values.set(String(key), String(value)),
    };
  };

  const browserLocalStorage = typeof window.localStorage === 'object' ? window.localStorage : makeStorage();
  const browserSessionStorage = typeof window.sessionStorage === 'object' ? window.sessionStorage : makeStorage();
  Object.defineProperty(window, 'localStorage', { configurable: true, value: browserLocalStorage });
  Object.defineProperty(window, 'sessionStorage', { configurable: true, value: browserSessionStorage });
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: browserLocalStorage });
  Object.defineProperty(globalThis, 'sessionStorage', { configurable: true, value: browserSessionStorage });
}
