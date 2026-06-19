export interface WatchlistItem {
  id: number;
  name: string;
  poster_path: string;
  vote_average: number;
}

const KEY = "ydc_watchlist";

export function getWatchlist(): WatchlistItem[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function isInWatchlist(id: number): boolean {
  return getWatchlist().some(item => item.id === id);
}

export function addToWatchlist(item: WatchlistItem) {
  const list = getWatchlist();
  if (!list.some(i => i.id === item.id)) {
    list.push(item);
    localStorage.setItem(KEY, JSON.stringify(list));
  }
}

export function removeFromWatchlist(id: number) {
  const list = getWatchlist().filter(i => i.id !== id);
  localStorage.setItem(KEY, JSON.stringify(list));
}