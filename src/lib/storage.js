export const storage = {
  get(key) {
    try {
      const raw = localStorage.getItem(key);
      return raw == null ? null : JSON.parse(raw);
    } catch {
      return null;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // ignore quota / serialization errors
    }
  },
  clear(key) {
    try {
      if (key) localStorage.removeItem(key);
      else localStorage.clear();
    } catch {
      // ignore
    }
  },
};
