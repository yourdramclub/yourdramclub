'use client';
import { useEffect, useState } from "react";

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";
const IMG_URL = "https://image.tmdb.org/t/p/w500";

export default function ComingSoonPage() {
  const [dramas, setDramas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [region, setRegion] = useState("All");

  useEffect(() => {
    setLoading(true);
    const today = new Date().toISOString().split('T')[0];
    const country = region === "KDrama" ? "KR" : region === "CDrama" ? "CN" : null;

    const urls = country
      ? [`${BASE_URL}/discover/tv?api_key=${API_KEY}&with_origin_country=${country}&sort_by=first_air_date.asc&first_air_date.gte=${today}&page=1`,
         `${BASE_URL}/discover/tv?api_key=${API_KEY}&with_origin_country=${country}&sort_by=first_air_date.asc&first_air_date.gte=${today}&page=2`]
      : [`${BASE_URL}/discover/tv?api_key=${API_KEY}&with_origin_country=KR&sort_by=first_air_date.asc&first_air_date.gte=${today}&page=1`,
         `${BASE_URL}/discover/tv?api_key=${API_KEY}&with_origin_country=CN&sort_by=first_air_date.asc&first_air_date.gte=${today}&page=1`,
         `${BASE_URL}/discover/tv?api_key=${API_KEY}&with_origin_country=KR&sort_by=first_air_date.asc&first_air_date.gte=${today}&page=2`,
         `${BASE_URL}/discover/tv?api_key=${API_KEY}&with_origin_country=CN&sort_by=first_air_date.asc&first_air_date.gte=${today}&page=2`];

    Promise.all(urls.map(u => fetch(u).then(r => r.json())))
      .then(results => {
        const combined = results.flatMap(d => d.results || [])
          .filter((d: any) => d.poster_path)
          .sort((a: any, b: any) => new Date(a.first_air_date).getTime() - new Date(b.first_air_date).getTime());
        const seen = new Set();
        const unique = combined.filter((d: any) => {
          if (seen.has(d.id)) return false;
          seen.add(d.id); return true;
        });
        setDramas(unique);
        setLoading(false);
      });
  }, [region]);

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      <nav className="flex items-center justify-between px-4 sm:px-8 py-3 bg-white border-b border-gray-200 sticky top-0 z-50">
        <a href="/" className="text-lg sm:text-2xl font-bold text-red-500">YourDramaClub</a>
        <button className="bg-red-500 hover:bg-red-600 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold text-white">Sign In</button>
      </nav>

      <div className="px-4 sm:px-8 py-6">
        <h1 className="text-2xl sm:text-4xl font-bold mb-2">🗓️ Coming Soon</h1>
        <p className="text-gray-500 text-sm mb-6">Upcoming KDramas & CDramas with release dates</p>

        {/* Region Filter */}
        <div className="flex gap-2 mb-6">
          {["All", "KDrama", "CDrama"].map(r => (
            <button key={r} onClick={() => setRegion(r)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition
                ${region === r ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {r}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-xl aspect-[2/3] animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
            {dramas.map(drama => (
              <a key={drama.id} href={`/drama/${drama.id}`} className="block">
                <div className="relative">
                  <img src={`${IMG_URL}${drama.poster_path}`} alt={drama.name}
                    className="w-full aspect-[2/3] object-cover rounded-xl" />
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 rounded-b-xl px-2 py-1.5">
                    <p className="text-white text-[10px] font-semibold">
                      📅 {new Date(drama.first_air_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                </div>
                <p className="text-xs font-medium mt-1.5 text-gray-800 truncate">{drama.name}</p>
                <p className="text-[10px] text-gray-400">
                  {drama.origin_country?.includes("KR") ? "🇰🇷 KDrama" : "🇨🇳 CDrama"}
                </p>
              </a>
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