'use client';
import { useEffect, useState } from "react";

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";
const IMG_URL = "https://image.tmdb.org/t/p/w500";

export default function Home() {
  const [kdramas, setKdramas] = useState<any[]>([]);
  const [cdramas, setCdramas] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [krActors, setKrActors] = useState<any[]>([]);
  const [cnActors, setCnActors] = useState<any[]>([]);
  const [featured, setFeatured] = useState<any>(null);
  const [activeFilter, setActiveFilter] = useState("All");

  const filters = ["All", "Romance", "Action", "Thriller", "Fantasy", "Comedy"];

  useEffect(() => {
    // Fetch KDramas
    fetch(`${BASE_URL}/discover/tv?api_key=${API_KEY}&with_origin_country=KR&sort_by=popularity.desc&page=1`)
      .then(r => r.json())
      .then(data => {
        const results = data.results || [];
        setKdramas(results.slice(0, 10));
        setFeatured(results[0]);
      });

    // Fetch CDramas
    fetch(`${BASE_URL}/discover/tv?api_key=${API_KEY}&with_origin_country=CN&sort_by=popularity.desc&page=1`)
      .then(r => r.json())
      .then(data => setCdramas((data.results || []).slice(0, 10)));

    // Fetch actors
    Promise.all([
      fetch(`${BASE_URL}/discover/tv?api_key=${API_KEY}&with_origin_country=KR&sort_by=popularity.desc&page=1`).then(r => r.json()),
      fetch(`${BASE_URL}/discover/tv?api_key=${API_KEY}&with_origin_country=CN&sort_by=popularity.desc&page=1`).then(r => r.json()),
    ]).then(async ([krShows, cnShows]) => {
      const krIds = (krShows.results || []).slice(0, 5).map((s: any) => s.id);
      const cnIds = (cnShows.results || []).slice(0, 5).map((s: any) => s.id);
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
          seen.add(p.id); return true;
        });
      };
      setKrActors(dedupe(krCasts.flatMap(c => c.cast || []).sort((a, b) => b.popularity - a.popularity)).slice(0, 8));
      setCnActors(dedupe(cnCasts.flatMap(c => c.cast || []).sort((a, b) => b.popularity - a.popularity)).slice(0, 8));
    });
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!search.trim()) return;
    window.location.href = `/search?q=${encodeURIComponent(search)}`;
  };

  const DramaRow = ({ dramas, type }: { dramas: any[]; type: string }) => (
    <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-hide px-4 sm:px-8">
      {dramas.map((drama, index) => (
        <a key={drama.id} href={`/drama/${drama.id}`}
          className="flex-shrink-0 w-32 sm:w-40 block relative">
          <div className="relative">
            {index < 3 && (
              <span className={`absolute top-2 left-2 z-10 text-white text-xs font-bold px-2 py-0.5 rounded-full
                ${index === 0 ? 'bg-red-500' : index === 1 ? 'bg-orange-500' : 'bg-yellow-500'}`}>
                TOP {index + 1}
              </span>
            )}
            {drama.poster_path
              ? <img src={`${IMG_URL}${drama.poster_path}`} alt={drama.name}
                  className="w-full aspect-[2/3] object-cover rounded-xl" />
              : <div className="w-full aspect-[2/3] bg-gray-200 rounded-xl" />}
          </div>
          <p className="text-xs font-medium mt-1.5 text-gray-800 truncate">{drama.name}</p>
          <p className="text-[10px] text-gray-400">⭐ {drama.vote_average?.toFixed(1)}</p>
        </a>
      ))}
    </div>
  );

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-4 sm:px-8 py-3 bg-white border-b border-gray-200 sticky top-0 z-50">
        <h1 className="text-lg sm:text-2xl font-bold text-red-500">YourDramaClub</h1>
        <div className="hidden sm:flex gap-6 text-sm font-medium text-gray-600">
          <a href="/KDrama" className="hover:text-red-500">KDrama</a>
          <a href="/Cdrama" className="hover:text-red-500">CDrama</a>
          <a href="/blog" className="hover:text-red-500">Blog</a>
        </div>
        <button className="bg-red-500 hover:bg-red-600 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold text-white">Sign In</button>
      </nav>

      {/* Hero Banner */}
      {featured && (
        <div className="relative h-56 sm:h-96 overflow-hidden">
          <img src={`https://image.tmdb.org/t/p/original${featured.backdrop_path}`}
            alt={featured.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          <div className="absolute bottom-0 left-0 p-4 sm:p-8">
            <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold mb-2 inline-block">🔥 TOP PICK</span>
            <h2 className="text-white text-xl sm:text-4xl font-bold">{featured.name}</h2>
            <p className="text-gray-300 text-xs sm:text-sm mt-1 line-clamp-2 max-w-md">{featured.overview}</p>
            <a href={`/drama/${featured.id}`}
              className="inline-block mt-3 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full text-xs sm:text-sm font-semibold">
              ▶ Watch Now
            </a>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="px-4 sm:px-8 py-4 bg-white border-b border-gray-100">
        <form onSubmit={handleSearch} className="flex gap-2 max-w-xl mx-auto">
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search dramas, actors..."
            className="flex-1 px-4 py-2.5 rounded-full bg-gray-100 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-red-300" />
          <button type="submit" className="bg-red-500 hover:bg-red-600 px-5 py-2.5 rounded-full font-semibold text-white text-sm">
            Search
          </button>
        </form>
      </div>

      {/* Filter Chips */}
      <div className="flex gap-2 overflow-x-auto px-4 sm:px-8 py-3 scrollbar-hide bg-white border-b border-gray-100">
        {filters.map(f => (
          <button key={f} onClick={() => setActiveFilter(f)}
            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition
              ${activeFilter === f ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            {f}
          </button>
        ))}
      </div>

      {/* Trending KDramas */}
      <section className="py-5">
        <div className="flex items-center justify-between px-4 sm:px-8 mb-3">
          <h3 className="text-base sm:text-xl font-bold">🔥 Trending KDramas</h3>
          <a href="/KDrama" className="text-red-500 text-xs sm:text-sm font-medium">View all →</a>
        </div>
        <DramaRow dramas={kdramas} type="kdrama" />
      </section>

      {/* KDrama Celebrities */}
      {krActors.length > 0 && (
        <section className="py-5 bg-white">
          <div className="flex items-center justify-between px-4 sm:px-8 mb-3">
            <h3 className="text-base sm:text-xl font-bold">🇰🇷 Popular KDrama Stars</h3>
          </div>
          <div className="flex gap-4 overflow-x-auto px-4 sm:px-8 pb-3 scrollbar-hide">
            {krActors.map(actor => (
              <a key={actor.id} href={`/actor/${actor.id}`} className="flex-shrink-0 flex flex-col items-center w-16 sm:w-20">
                <img src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`} alt={actor.name}
                  className="w-14 h-14 sm:w-18 sm:h-18 rounded-full object-cover border-2 border-red-100" />
                <p className="text-[10px] sm:text-xs text-center mt-1 text-gray-700 truncate w-full">{actor.name}</p>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Popular CDramas */}
      <section className="py-5">
        <div className="flex items-center justify-between px-4 sm:px-8 mb-3">
          <h3 className="text-base sm:text-xl font-bold">🇨🇳 Popular CDramas</h3>
          <a href="/Cdrama" className="text-amber-500 text-xs sm:text-sm font-medium">View all →</a>
        </div>
        <DramaRow dramas={cdramas} type="cdrama" />
      </section>

      {/* CDrama Celebrities */}
      {cnActors.length > 0 && (
        <section className="py-5 bg-white">
          <div className="flex items-center justify-between px-4 sm:px-8 mb-3">
            <h3 className="text-base sm:text-xl font-bold">🇨🇳 Popular CDrama Stars</h3>
          </div>
          <div className="flex gap-4 overflow-x-auto px-4 sm:px-8 pb-3 scrollbar-hide">
            {cnActors.map(actor => (
              <a key={actor.id} href={`/actor/${actor.id}`} className="flex-shrink-0 flex flex-col items-center w-16 sm:w-20">
                <img src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`} alt={actor.name}
                  className="w-14 h-14 sm:w-18 sm:h-18 rounded-full object-cover border-2 border-amber-100" />
                <p className="text-[10px] sm:text-xs text-center mt-1 text-gray-700 truncate w-full">{actor.name}</p>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Blog Section */}
      <section className="py-5 px-4 sm:px-8">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base sm:text-xl font-bold">📝 Latest Articles</h3>
          <a href="/blog" className="text-red-500 text-xs sm:text-sm font-medium">View all →</a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { title: "Top 10 KDramas to Watch in 2026", slug: "top-10-kdramas-2026", date: "June 1, 2026" },
            { title: "Best CDramas for Beginners", slug: "best-cdramas-beginners", date: "May 28, 2026" },
            { title: "If You Loved Squid Game...", slug: "kdramas-like-squid-game", date: "May 20, 2026" },
          ].map(post => (
            <a key={post.slug} href={`/blog/${post.slug}`}
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition">
              <p className="text-xs text-gray-400 mb-1">{post.date}</p>
              <p className="font-semibold text-sm text-gray-900">{post.title}</p>
            </a>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 sm:px-8 py-8 border-t border-gray-200 text-center text-gray-400 text-xs sm:text-sm mt-4">
        © 2025 YourDramaClub · Built with ❤️ for drama lovers
      </footer>
    </main>
  );
}