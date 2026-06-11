'use client';
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";
const IMG_URL = "https://image.tmdb.org/t/p/w500";

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (!query) return;
    setLoading(true);
    fetch(`${BASE_URL}/search/tv?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`)
      .then(r => r.json())
      .then(data => {
        setResults(data.results || []);
        setTotalPages(data.total_pages || 1);
        setLoading(false);
      });
  }, [query, page]);

  return (
    <div className="px-8 py-10">
      <h2 className="text-3xl font-bold mb-2">
        🔍 Search Results
      </h2>
      <p className="text-gray-400 mb-8">
        {loading ? "Searching..." : `Showing results for "${query}"`}
      </p>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="bg-gray-800 rounded-xl h-80 animate-pulse" />
          ))}
        </div>
      ) : results.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-6xl mb-4">😔</p>
          <p className="text-xl text-gray-400">No results found for "{query}"</p>
          <a href="/" className="inline-block mt-6 bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg font-semibold transition">
            Back to Home
          </a>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {results.map(drama => (
              <a key={drama.id} href={`/drama/${drama.id}`}
                className="bg-gray-800 rounded-xl overflow-hidden hover:scale-105 transition-all duration-300 cursor-pointer block">
                {drama.poster_path
                  ? <img src={`${IMG_URL}${drama.poster_path}`} alt={drama.name} className="w-full h-64 object-cover" />
                  : <div className="w-full h-64 bg-gray-700 flex items-center justify-center text-gray-400">No Poster</div>}
                <div className="p-3">
                  <p className="font-semibold text-sm truncate text-white">{drama.name}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-gray-400 text-xs">{drama.first_air_date?.slice(0, 4) || "N/A"}</span>
                    <span className="text-yellow-400 text-xs">⭐ {drama.vote_average?.toFixed(1)}</span>
                  </div>
                </div>
              </a>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center gap-4 mt-10">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="px-6 py-2 bg-gray-800 rounded-lg disabled:opacity-40 hover:bg-gray-700 transition">
              ← Previous
            </button>
            <span className="px-6 py-2 bg-gray-900 rounded-lg">Page {page} of {totalPages}</span>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg disabled:opacity-40 transition">
              Next →
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <nav className="flex items-center justify-between px-8 py-4 bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
        <a href="/" className="text-2xl font-bold text-red-500">YourDramaClub</a>
        <button className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm font-semibold">Sign In</button>
      </nav>
      <Suspense fallback={<div className="text-center py-20 text-gray-400">Loading...</div>}>
        <SearchResults />
      </Suspense>
    </main>
  );
}