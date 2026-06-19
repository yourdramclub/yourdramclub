'use client';
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getWatchlist, removeFromWatchlist, WatchlistItem } from "../lib/watchlist";

const IMG_URL = "https://image.tmdb.org/t/p/w500";

export default function WatchlistPage() {
  const [list, setList] = useState<WatchlistItem[]>([]);

  useEffect(() => {
    setList(getWatchlist());
  }, []);

  const handleRemove = (id: number) => {
    removeFromWatchlist(id);
    setList(getWatchlist());
  };

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      <Navbar />

      <div className="px-4 sm:px-8 py-6">
        <h1 className="text-2xl sm:text-4xl font-bold mb-2">❤️ My Watchlist</h1>
        <p className="text-gray-500 text-sm mb-6">
          {list.length > 0
            ? `${list.length} drama${list.length > 1 ? "s" : ""} saved on this device`
            : "Dramas you save will appear here"}
        </p>

        {list.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-3">📺</p>
            <p className="text-gray-500 mb-4">Your watchlist is empty.</p>
            <a href="/" className="inline-block bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-full font-semibold transition">
              Browse Dramas →
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4">
            {list.map(drama => (
              <div key={drama.id} className="relative group">
                <a href={`/drama/${drama.id}`} className="block">
                  {drama.poster_path ? (
                    <img src={`${IMG_URL}${drama.poster_path}`} alt={drama.name}
                      className="w-full aspect-[2/3] object-cover rounded-xl" />
                  ) : (
                    <div className="w-full aspect-[2/3] bg-gray-200 rounded-xl" />
                  )}
                  <p className="text-xs font-medium mt-1.5 text-gray-800 truncate">{drama.name}</p>
                  <p className="text-[10px] text-gray-400">⭐ {drama.vote_average?.toFixed(1)}</p>
                </a>
                <button onClick={() => handleRemove(drama.id)}
                  className="absolute top-2 right-2 bg-black/70 text-white w-7 h-7 rounded-full text-sm flex items-center justify-center hover:bg-red-600 transition">
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <footer className="px-4 sm:px-8 py-8 border-t border-gray-200 text-center text-gray-400 text-xs mt-10">
        © 2025 YourDramaClub · Built with ❤️ for drama lovers
      </footer>
    </main>
  );
}