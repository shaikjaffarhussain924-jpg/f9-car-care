// SSR polyfills — must be imported before anything else.
// The Supabase client (auto-generated, not editable) references `localStorage`
// at module load time, which doesn't exist in Node during static prerendering.
if (typeof globalThis.localStorage === "undefined") {
  const store = new Map<string, string>();
  // @ts-expect-error - minimal Storage shim for SSR
  globalThis.localStorage = {
    getItem: (k: string) => (store.has(k) ? store.get(k)! : null),
    setItem: (k: string, v: string) => {
      store.set(k, String(v));
    },
    removeItem: (k: string) => {
      store.delete(k);
    },
    clear: () => store.clear(),
    key: (i: number) => Array.from(store.keys())[i] ?? null,
    get length() {
      return store.size;
    },
  };
}
