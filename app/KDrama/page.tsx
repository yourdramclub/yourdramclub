'use client';
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";
const IMG_URL = "https://image.tmdb.org/t/p/w500";

export default function KDramaPage() {
  const [dramas, setDramas] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("All");
  const [genre, setGenre] = useState("All");
  const [sort, setSort] = useState("popularity.desc");

  const genres = ["All", "Romance", "Action", "Thriller", "Fantasy", "Comedy"];
  const genreMap: Record<string, number> = {
    "Romance": 10749, "Action": 10759, "Thriller": 9648, "Fantasy": 10765, "Comedy": 35
  };
  const statusMap: Record<string, string> = {
    "Ongoing": "returning series", "Completed": "ended", "Upcoming": "in production"
  };

  useEffect(() => {
    setLoading(true);
    let url = `${BASE_URL}/discover/tv?api_key=${API_KEY}&with_origin_country=KR&sort_by=${sort}&page=${page}&vote_count.gte=10&with_original_language=ko&without_genres=16`;
    if (genre !== "All") url += `&with_genres=${genreMap[genre]}`;
    if (status !== "All") url += `&with_status=${encodeURIComponent(statusMap[status])}`;

    fetch(url).then(r => r.json()).then(data => {
      setDramas(data.results || []);
      setLoading(false);
    });
  }, [page, status, genre, sort]);

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      <Navbar />

      <div className="px-4 sm:px-8 py-6">
        <h1 className="text-2xl sm:text-4xl font-bold mb-6">🇰🇷 All KDramas</h1>

        {/* Filters */}
        <div className="bg-white rounded-xl p-4 mb-6 shadow-sm border border-gray-100 space-y-3">
          {/* Genre */}
          <div>
            <p className="text-xs text-gray-400 font-medium mb-2">GENRE</p>
            <div className="flex gap-2 flex-wrap">
              {genres.map(g => (
                <button key={g} onClick={() => { setGenre(g); setPage(1); }}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition
                    ${genre === g ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Status */}
          <div>
            <p className="text-xs text-gray-400 font-medium mb-2">STATUS</p>
            <div className="flex gap-2 flex-wrap">
              {["All", "Ongoing", "Completed", "Upcoming"].map(s => (
                <button key={s} onClick={() => { setStatus(s); setPage(1); }}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition
                    ${status === s ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Sort */}
          <div>
            <p className="text-xs text-gray-400 font-medium mb-2">SORT BY</p>
            <div className="flex gap-2 flex-wrap">
              {[
                { label: "Popular", value: "popularity.desc" },
                { label: "Top Rated", value: "vote_average.desc" },
                { label: "Newest", value: "first_air_date.desc" },
                { label: "Oldest", value: "first_air_date.asc" },
              ].map(s => (
                <button key={s.value} onClick={() => { setSort(s.value); setPage(1); }}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition
                    ${sort === s.value ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Drama Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-xl aspect-[2/3] animate-pulse" />
            ))}
          </div>
        ) : dramas.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-3">😔</p>
            <p className="text-gray-500">No dramas found with these filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4">
            {dramas.map(drama => (
              <a key={drama.id} href={`/drama/${drama.id}`} className="block">
                <img src={`${IMG_URL}${drama.poster_path}`} alt={drama.name}
                  className="w-full aspect-[2/3] object-cover rounded-xl" />
                <p className="text-xs font-medium mt-1.5 text-gray-800 truncate">{drama.name}</p>
                <p className="text-[10px] text-gray-400">⭐ {drama.vote_average?.toFixed(1)}</p>
              </a>
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-center gap-4 mt-10">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
            className="px-6 py-2 bg-white border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50 text-sm">
            ← Previous
          </button>
          <span className="px-6 py-2 bg-red-500 text-white rounded-lg text-sm">Page {page}</span>
          <button onClick={() => setPage(p => p + 1)}
            className="px-6 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-sm">
            Next →
          </button>
        </div>
      </div>

      <footer className="px-4 sm:px-8 py-8 border-t border-gray-200 text-center text-gray-400 text-xs mt-10">
        © 2025 YourDramaClub · Built with ❤️ for drama lovers
      </footer>
    </main>
  );
}