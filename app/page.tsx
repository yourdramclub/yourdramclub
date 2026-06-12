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
  const [krActors, setKrActors] = useState<any[]>([]);
  const [krActresses, setKrActresses] = useState<any[]>([]);
  const [cnActors, setCnActors] = useState<any[]>([]);
  const [cnActresses, setCnActresses] = useState<any[]>([]);
  const [showAllKrActors, setShowAllKrActors] = useState(false);
  const [showAllKrActresses, setShowAllKrActresses] = useState(false);
  const [showAllCnActors, setShowAllCnActors] = useState(false);
  const [showAllCnActresses, setShowAllCnActresses] = useState(false);

  useEffect(() => {
    fetchKDramas().then(setKdramas);
    fetchCDramas().then(setCdramas);

    Promise.all([
      fetch(`${BASE_URL}/discover/tv?api_key=${API_KEY}&with_origin_country=KR&sort_by=popularity.desc&page=1`).then(r => r.json()),
      fetch(`${BASE_URL}/discover/tv?api_key=${API_KEY}&with_origin_country=CN&sort_by=popularity.desc&page=1`).then(r => r.json()),
    ]).then(async ([krShows, cnShows]) => {
      const krIds = (krShows.results || []).slice(0, 8).map((s: any) => s.id);
      const cnIds = (cnShows.results || []).slice(0, 8).map((s: any) => s.id);

      const krCasts = await Promise.all(krIds.map((id: number) =>
        fetch(`${BASE_URL}/tv/${id}/credits?api_key=${API_KEY}`).then(r => r.json())
      ));
      const cnCasts = await Promise.all(cnIds.map((id: number) =>
        fetch(`${BASE_URL}/tv/${id}/credits?api_key=${API_KEY}`).then(r => r.json())
      ));

      const dedupe = (arr: any[]) => {
        const seen = new Set();
        return arr.filter((p: any) => {
          if (!p.profile_path || seen.has(p.id)) return false;
          seen.add(p.id);
          return true;
        });
      };

      const krCast = dedupe(krCasts.flatMap(c => c.cast || []).sort((a, b) => b.popularity - a.popularity));
      const cnCast = dedupe(cnCasts.flatMap(c => c.cast || []).sort((a, b) => b.popularity - a.popularity));

      setKrActors(krCast.filter((p: any) => p.gender === 2).slice(0, 10));
      setKrActresses(krCast.filter((p: any) => p.gender === 1).slice(0, 10));
      setCnActors(cnCast.filter((p: any) => p.gender === 2).slice(0, 10));
      setCnActresses(cnCast.filter((p: any) => p.gender === 1).slice(0, 10));
    });
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!search.trim()) return;
    window.location.href = `/search?q=${encodeURIComponent(search)}`;
  };

  const DramaCard = ({ drama, type }: { drama: any; type: string }) => (
    <a href={`/drama/${drama.id}`}
      className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 block border border-gray-100">
      {drama.poster_path ? (
        <img src={`${IMG_URL}${drama.poster_path}`} alt={drama.name} className="w-full aspect-[2/3] object-cover" />
      ) : (
        <div className="w-full aspect-[2/3] bg-gray-100 flex items-center justify-center text-gray-400 text-sm">No Poster</div>
      )}
      <div className="p-2 sm:p-3">
        <p className="font-semibold text-xs sm:text-sm truncate text-gray-900">{drama.name}</p>
        <div className="flex items-center justify-between mt-1">
          <span className={`text-[10px] sm:text-xs font-medium ${type === 'kdrama' ? 'text-red-500' : 'text-amber-500'}`}>
            {type === 'kdrama' ? '🇰🇷' : '🇨🇳'}
          </span>
          <span className="text-[10px] sm:text-xs text-gray-500">⭐ {drama.vote_average?.toFixed(1)}</span>
        </div>
      </div>
    </a>
  );

  const SkeletonCard = () => (
    <div className="bg-gray-100 rounded-xl overflow-hidden animate-pulse">
      <div className="w-full aspect-[2/3] bg-gray-200" />
      <div className="p-3 space-y-2">
        <div className="h-3 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
      </div>
    </div>
  );

  const ActorCard = ({ actor, accent }: { actor: any; accent: string }) => (
    <a href={`/actor/${actor.id}`}
      className="bg-white rounded-xl p-3 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
      <img src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`} alt={actor.name}
        className={`w-14 h-14 sm:w-20 sm:h-20 rounded-full object-cover border-2 ${accent}`} />
      <p className="text-[11px] sm:text-sm font-medium mt-2 text-gray-800 truncate w-full">{actor.name}</p>
    </a>
  );

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-4 sm:px-8 py-3 sm:py-4 bg-white border-b border-gray-200 sticky top-0 z-50">
        <h1 className="text-xl sm:text-2xl font-bold text-red-500">YourDramaClub</h1>
        <div className="hidden sm:flex gap-6 text-sm font-medium text-gray-600">
          <a href="/KDrama" className="hover:text-red-500 transition">KDrama</a>
          <a href="/Cdrama" className="hover:text-red-500 transition">CDrama</a>
          <a href="#kdrama" className="hover:text-red-500 transition">Actors</a>
          <a href="/search?q=" className="hover:text-red-500 transition">Search</a>
        </div>
        <button className="bg-red-500 hover:bg-red-600 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold text-white transition">Sign In</button>
      </nav>

      {/* Hero */}
      <div className="px-4 sm:px-8 py-10 sm:py-16 bg-gradient-to-b from-red-50 to-gray-50 text-center">
        <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold mb-4 leading-tight bg-gradient-to-r from-red-500 to-amber-500 bg-clip-text text-transparent">
          Discover Your Next<br />Favorite Drama
        </h2>
        <p className="text-gray-500 text-sm sm:text-lg mb-8">Track, rate, and explore the best KDramas and CDramas</p>
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 justify-center max-w-xl mx-auto px-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search dramas..."
            className="flex-1 px-5 sm:px-6 py-3 sm:py-4 rounded-full bg-white text-gray-900 border border-gray-200 focus:outline-none focus:border-red-400 transition text-base shadow-sm"
          />
          <button type="submit" className="bg-red-500 hover:bg-red-600 px-8 py-3 sm:py-4 rounded-full font-bold transition text-white text-base shadow-md hover:shadow-lg">
            🔍 Search
          </button>
        </form>
      </div>

      {/* KDrama Section */}
      <section id="kdrama" className="px-4 sm:px-8 py-6 sm:py-10">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h3 className="text-lg sm:text-2xl font-bold">🔥 Trending KDramas</h3>
          <a href="/KDrama" className="text-red-500 text-xs sm:text-sm font-medium hover:text-red-600">View all →</a>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-8 gap-2 sm:gap-4">
          {kdramas.length > 0 ? kdramas.map(drama => <DramaCard key={drama.id} drama={drama} type="kdrama" />) :
            [1,2,3,4,5,6,7,8].map(i => <SkeletonCard key={i} />)}
        </div>
      </section>

      {/* KDrama Actors */}
      {(krActors.length > 0 || krActresses.length > 0) && (
      <section className="px-4 sm:px-8 py-6 sm:py-8 bg-white">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h3 className="text-base sm:text-xl font-bold">🇰🇷 KDrama Actors</h3>
          {krActors.length > 5 && (
            <button onClick={() => setShowAllKrActors(!showAllKrActors)} className="text-red-500 text-xs sm:text-sm font-medium hover:text-red-600">
              {showAllKrActors ? "Show less" : "View more →"}
            </button>
          )}
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-4 mb-6">
          {krActors.slice(0, showAllKrActors ? 10 : 5).map(actor => <ActorCard key={actor.id} actor={actor} accent="border-red-200" />)}
        </div>

        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h3 className="text-base sm:text-xl font-bold">🇰🇷 KDrama Actresses</h3>
          {krActresses.length > 5 && (
            <button onClick={() => setShowAllKrActresses(!showAllKrActresses)} className="text-pink-500 text-xs sm:text-sm font-medium hover:text-pink-600">
              {showAllKrActresses ? "Show less" : "View more →"}
            </button>
          )}
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-4">
          {krActresses.slice(0, showAllKrActresses ? 10 : 5).map(actor => <ActorCard key={actor.id} actor={actor} accent="border-pink-200" />)}
        </div>
      </section>
      )}

      {/* CDrama Section */}
      <section id="cdrama" className="px-4 sm:px-8 py-6 sm:py-10">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h3 className="text-lg sm:text-2xl font-bold">🇨🇳 Popular CDramas</h3>
          <a href="/Cdrama" className="text-amber-500 text-xs sm:text-sm font-medium hover:text-amber-600">View all →</a>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-8 gap-2 sm:gap-4">
          {cdramas.length > 0 ? cdramas.map(drama => <DramaCard key={drama.id} drama={drama} type="cdrama" />) :
            [1,2,3,4,5,6,7,8].map(i => <SkeletonCard key={i} />)}
        </div>
      </section>

      {/* CDrama Actors */}
      {(cnActors.length > 0 || cnActresses.length > 0) && (
      <section className="px-4 sm:px-8 py-6 sm:py-8 bg-white">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h3 className="text-base sm:text-xl font-bold">🇨🇳 CDrama Actors</h3>
          {cnActors.length > 5 && (
            <button onClick={() => setShowAllCnActors(!showAllCnActors)} className="text-amber-500 text-xs sm:text-sm font-medium hover:text-amber-600">
              {showAllCnActors ? "Show less" : "View more →"}
            </button>
          )}
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-4 mb-6">
          {cnActors.slice(0, showAllCnActors ? 10 : 5).map(actor => <ActorCard key={actor.id} actor={actor} accent="border-amber-200" />)}
        </div>

        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h3 className="text-base sm:text-xl font-bold">🇨🇳 CDrama Actresses</h3>
          {cnActresses.length > 5 && (
            <button onClick={() => setShowAllCnActresses(!showAllCnActresses)} className="text-orange-400 text-xs sm:text-sm font-medium hover:text-orange-500">
              {showAllCnActresses ? "Show less" : "View more →"}
            </button>
          )}
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-4">
          {cnActresses.slice(0, showAllCnActresses ? 10 : 5).map(actor => <ActorCard key={actor.id} actor={actor} accent="border-orange-200" />)}
        </div>
      </section>
      )}

      {/* Footer */}
      <footer className="px-4 sm:px-8 py-8 border-t border-gray-200 text-center text-gray-400 text-xs sm:text-sm">
        © 2025 YourDramaClub · Built with ❤️ for drama lovers
      </footer>
    </main>
  );
}