export interface ReadingProgress {
  book: string;
  bookName: string;
  chapter: number;
  verse?: number;
}

const STORAGE_KEY = "last_reading";

export function saveLastReading(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getLastReading() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function clearLastReading() {
  localStorage.removeItem(STORAGE_KEY);
}