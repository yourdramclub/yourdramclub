'use client';
import { useEffect, useState } from "react";

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";
const IMG_URL = "https://image.tmdb.org/t/p/w500";

export default function CDramaPage() {
  const [dramas, setDramas] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "All CDramas - Browse Chinese Dramas | YourDramaClub";
    setLoading(true);
    fetch(`${BASE_URL}/discover/tv?api_key=${API_KEY}&with_origin_country=CN&sort_by=popularity.desc&page=${page}`)
      .then(r => r.json())
      .then(data => { setDramas(data.results || []); setLoading(false); });
  }, [page]);

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <nav className="flex items-center justify-between px-8 py-4 bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
        <a href="/" className="text-2xl font-bold text-red-500">YourDramaClub</a>
        <button className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm font-semibold">Sign In</button>
      </nav>

      <div className="px-8 py-10">
        <h2 className="text-3xl font-bold mb-8">🇨🇳 All CDramas</h2>
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="bg-gray-800 rounded-xl h-80 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {dramas.map(drama => (
              <div key={drama.id} className="bg-gray-800 rounded-xl overflow-hidden hover:scale-105 transition cursor-pointer">
                {drama.poster_path
                  ? <img src={`${IMG_URL}${drama.poster_path}`} alt={drama.name} className="w-full h-64 object-cover" />
                  : <div className="w-full h-64 bg-gray-700 flex items-center justify-center text-gray-400">No Poster</div>}
                <div className="p-3">
                  <p className="font-semibold text-sm truncate">{drama.name}</p>
                  <p className="text-yellow-400 text-xs mt-1">🇨🇳 CDrama · ⭐ {drama.vote_average?.toFixed(1)}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-center gap-4 mt-10">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
            className="px-6 py-2 bg-gray-800 rounded-lg disabled:opacity-40 hover:bg-gray-700 transition">
            ← Previous
          </button>
          <span className="px-6 py-2 bg-gray-900 rounded-lg">Page {page}</span>
          <button onClick={() => setPage(p => p + 1)}
            className="px-6 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg transition">
            Next →
          </button>
        </div>
      </div>
    </main>
  );
}