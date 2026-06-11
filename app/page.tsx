'use client';
import { useEffect, useState } from "react";

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";
const IMG_URL = "https://image.tmdb.org/t/p/w500";

async function fetchKDramas() {
  const res = await fetch(`${BASE_URL}/discover/tv?api_key=${API_KEY}&with_origin_country=KR&sort_by=popularity.desc&page=1`);
  const data = await res.json();
  return data.results?.slice(0, 8) || [];
}

async function fetchCDramas() {
  const res = await fetch(`${BASE_URL}/discover/tv?api_key=${API_KEY}&with_origin_country=CN&sort_by=popularity.desc&page=1`);
  const data = await res.json();
  return data.results?.slice(0, 8) || [];
}

export default function Home() {
  const [kdramas, setKdramas] = useState<any[]>([]);
  const [cdramas, setCdramas] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    fetchKDramas().then(setKdramas);
    fetchCDramas().then(setCdramas);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!search.trim()) return;
    window.location.href = `/search?q=${encodeURIComponent(search)}`;
  };

  const DramaCard = ({ drama, type }: { drama: any; type: string }) => (
    <a
  href={`/drama/${drama.id}`}
  className="bg-gray-800 rounded-xl overflow-hidden hover:scale-105 hover:shadow-xl transition-all duration-300 cursor-pointer group block"
>
      {drama.poster_path ? (
        <img src={`${IMG_URL}${drama.poster_path}`} alt={drama.name} className="w-full h-64 object-cover group-hover:opacity-90 transition" />
      ) : (
        <div className="w-full h-64 bg-gray-700 flex items-center justify-center text-gray-400 text-sm">No Poster</div>
      )}
      <div className="p-3">
        <p className="font-semibold text-sm truncate text-white">{drama.name}</p>
        <div className="flex items-center justify-between mt-1">
          <span className={`text-xs font-medium ${type === 'kdrama' ? 'text-red-400' : 'text-yellow-400'}`}>
            {type === 'kdrama' ? '🇰🇷 KDrama' : '🇨🇳 CDrama'}
          </span>
          <span className="text-xs text-gray-400">⭐ {drama.vote_average?.toFixed(1)}</span>
        </div>
      </div>
    </a>
  );

  const SkeletonCard = () => (
    <div className="bg-gray-800 rounded-xl overflow-hidden animate-pulse">
      <div className="w-full h-64 bg-gray-700" />
      <div className="p-3 space-y-2">
        <div className="h-3 bg-gray-700 rounded w-3/4" />
        <div className="h-3 bg-gray-700 rounded w-1/2" />
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-4 bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
        <h1 className="text-2xl font-bold text-red-500">YourDramaClub</h1>
        <div className="flex gap-6 text-sm text-gray-300">
          <a href="#kdrama" className="hover:text-white transition">KDrama</a>
          <a href="#cdrama" className="hover:text-white transition">CDrama</a>
        </div>
        <button className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm font-semibold transition">Sign In</button>
      </nav>

      {/* Hero */}
      <div className="px-8 py-24 bg-gradient-to-b from-gray-900 to-gray-950 text-center">
        <h2 className="text-5xl font-bold mb-4 leading-tight">Discover Your Next<br />Favorite Drama</h2>
        <p className="text-gray-400 text-lg mb-8">Track, rate, and explore the best KDramas and CDramas</p>
        <form onSubmit={handleSearch} className="flex gap-2 justify-center max-w-lg mx-auto">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search dramas..."
            className="flex-1 px-5 py-3 rounded-full bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-red-500 transition"
          />
          <button type="submit" className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-full font-semibold transition">
            Search
          </button>
        </form>
      </div>

      {/* Search Results */}
      {(searchResults.length > 0 || searching) && (
        <section className="px-8 py-10">
          <h3 className="text-2xl font-bold mb-6">🔍 Search Results for "{search}"</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {searching ? [1,2,3,4].map(i => <SkeletonCard key={i} />) :
              searchResults.map(drama => <DramaCard key={drama.id} drama={drama} type="search" />)}
          </div>
        </section>
      )}

      {/* KDrama Section */}
      <section id="kdrama" className="px-8 py-10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold">🔥 Trending KDramas</h3>
          <a href="/KDrama" className="text-red-400 text-sm hover:text-red-300">
  View all →
</a>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {kdramas.length > 0 ? kdramas.map(drama => <DramaCard key={drama.id} drama={drama} type="kdrama" />) :
            [1,2,3,4,5,6,7,8].map(i => <SkeletonCard key={i} />)}
        </div>
      </section>

      {/* CDrama Section */}
      <section id="cdrama" className="px-8 py-10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold">🇨🇳 Popular CDramas</h3>
          <a href="/Cdrama" className="text-yellow-400 text-sm hover:text-yellow-300">
  View all →
</a>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {cdramas.length > 0 ? cdramas.map(drama => <DramaCard key={drama.id} drama={drama} type="cdrama" />) :
            [1,2,3,4,5,6,7,8].map(i => <SkeletonCard key={i} />)}
        </div>
      </section>

      {/* Footer */}
      <footer className="px-8 py-8 border-t border-gray-800 text-center text-gray-500 text-sm mt-10">
        © 2025 YourDramaClub · Built with ❤️ for drama lovers
      </footer>
    </main>
  );
}