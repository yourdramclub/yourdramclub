'use client';
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Navbar from "../components/Navbar";

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";
const IMG_URL = "https://image.tmdb.org/t/p/w500";

function SearchResults() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);
  const [searchInput, setSearchInput] = useState(initialQuery);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setQuery(initialQuery);
    setSearchInput(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    if (!query) {
      setLoading(false);
      return;
    }
    setLoading(true);
    fetch(`${BASE_URL}/search/tv?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`)
      .then(r => r.json())
      .then(data => {
        const filtered = (data.results || []).filter((show: any) =>
          show.origin_country?.some((c: string) => ["KR", "CN"].includes(c))
        );
        setResults(filtered);
        setTotalPages(data.total_pages || 1);
        setLoading(false);
      });
  }, [query, page]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    setPage(1);
    window.history.pushState({}, "", `/search?q=${encodeURIComponent(searchInput)}`);
    setQuery(searchInput);
  };

  return (
    <div className="px-4 sm:px-8 py-6 sm:py-10 max-w-6xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4">🔍 Search Dramas</h1>

      <form onSubmit={handleSearch} className="flex gap-2 mb-8 max-w-xl">
        <input type="text" value={searchInput} onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search KDramas, CDramas..."
          className="flex-1 px-4 py-2.5 rounded-full bg-white border border-gray-200 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-red-300" />
        <button type="submit" className="bg-red-500 hover:bg-red-600 px-5 py-2.5 rounded-full font-semibold text-white text-sm transition">
          Search
        </button>
      </form>

      {query && (
        <p className="text-gray-500 text-sm mb-6">
          {loading ? "Searching..." : `${results.length} result${results.length !== 1 ? "s" : ""} for "${query}"`}
        </p>
      )}

      {!query ? (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">🔍</p>
          <p className="text-gray-400">Type a drama name above to start searching.</p>
        </div>
      ) : loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="bg-gray-200 rounded-xl aspect-[2/3] animate-pulse" />
          ))}
        </div>
      ) : results.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">😔</p>
          <p className="text-gray-500">No KDrama/CDrama results found for "{query}"</p>
          <a href="/" className="inline-block mt-6 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-full font-semibold transition">
            Back to Home
          </a>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4">
            {results.map(drama => (
              <a key={drama.id} href={`/drama/${drama.id}`} className="block">
                {drama.poster_path
                  ? <img src={`${IMG_URL}${drama.poster_path}`} alt={drama.name} className="w-full aspect-[2/3] object-cover rounded-xl" />
                  : <div className="w-full aspect-[2/3] bg-gray-200 rounded-xl flex items-center justify-center text-gray-400 text-xs">No Poster</div>}
                <p className="text-xs font-medium mt-1.5 text-gray-800 truncate">{drama.name}</p>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-gray-400">{drama.first_air_date?.slice(0, 4) || "N/A"}</span>
                  <span className="text-[10px] text-yellow-500">⭐ {drama.vote_average?.toFixed(1)}</span>
                </div>
              </a>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center gap-3 sm:gap-4 mt-10">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="px-4 sm:px-6 py-2 bg-white border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50 text-sm transition">
                ← Previous
              </button>
              <span className="px-4 sm:px-6 py-2 bg-red-500 text-white rounded-lg text-sm">Page {page} of {totalPages}</span>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="px-4 sm:px-6 py-2 bg-white border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50 text-sm transition">
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      <Navbar />
      <Suspense fallback={<div className="text-center py-20 text-gray-400">Loading...</div>}>
        <SearchResults />
      </Suspense>
    </main>
  );
}