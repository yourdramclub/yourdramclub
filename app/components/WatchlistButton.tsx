'use client';
import { useEffect, useState } from "react";
import { isInWatchlist, addToWatchlist, removeFromWatchlist, WatchlistItem } from "../lib/watchlist";

export default function WatchlistButton({ drama }: { drama: WatchlistItem }) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSaved(isInWatchlist(drama.id));
  }, [drama.id]);

  const toggle = () => {
    if (saved) {
      removeFromWatchlist(drama.id);
      setSaved(false);
    } else {
      addToWatchlist(drama);
      setSaved(true);
    }
  };

  return (
    <button onClick={toggle}
      className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 transition
        ${saved ? "bg-gray-900 text-white" : "bg-white border border-gray-300 text-gray-700 hover:border-red-300"}`}>
      {saved ? "✓ In Watchlist" : "+ Add to Watchlist"}
    </button>
  );
}