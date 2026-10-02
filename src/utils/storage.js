const STORAGE_KEY = 'magic-mind-best-times';

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function save(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // storage unavailable — degrade silently
  }
}

/**
 * Get stored best time (in seconds) for a level, or null.
 * @param {number} level – 1 or 2
 */
export function getBestTime(level) {
  const data = load();
  return data[`level${level}`] ?? null;
}

/**
 * Attempt to set a new best time.
 * @param {number} level – 1 or 2
 * @param {number} seconds
 * @returns {boolean} true if this was a new record
 */
export function setBestTime(level, seconds) {
  const data = load();
  const key = `level${level}`;
  const prev = data[key] ?? Infinity;
  if (seconds < prev) {
    data[key] = seconds;
    save(data);
    return true;
  }
  return false;
}
