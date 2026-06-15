'use client';
import { useEffect, useState } from "react";

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const IMG_URL = "https://image.tmdb.org/t/p/w500";
const BASE_URL = "https://api.themoviedb.org/3";

export default function DramaDetailPage() {
  const [drama, setDrama] = useState<any>(null);
  const [trailer, setTrailer] = useState("");
  const [similar, setSimilar] = useState<any[]>([]);
  const [cast, setCast] = useState<any[]>([]);
  const [showTrailer, setShowTrailer] = useState(false);
  const [providers, setProviders] = useState<any[]>([]);

  useEffect(() => {
    const pathParts = window.location.pathname.split("/");
    const dramaId = pathParts[pathParts.length - 1];

    // Drama Details
    fetch(`${BASE_URL}/tv/${dramaId}?api_key=${API_KEY}`)
      .then(res => res.json())
      .then(data => {
        setDrama(data);
        document.title = `${data.name || 'Drama'} - Cast, Rating & Trailer | YourDramaClub`;
      });

    // Trailer
    fetch(`${BASE_URL}/tv/${dramaId}/videos?api_key=${API_KEY}`)
      .then(res => res.json())
      .then(data => {
        const video = data.results?.find(
          (v: any) => v.site === "YouTube" && (v.type === "Trailer" || v.type === "Teaser")
        );
        if (video) setTrailer(`https://www.youtube.com/embed/${video.key}`);
      });

    // Providers
    fetch(`${BASE_URL}/tv/${dramaId}/watch/providers?api_key=${API_KEY}`)
      .then(res => res.json())
      .then(data => {
        const regionData = data?.results?.US || data?.results?.GB || 
          data?.results?.KR || data?.results?.IN || 
          Object.values(data?.results || {})[0] || null;
        setProviders((regionData as any)?.flatrate || []);
      });

    // Cast
    fetch(`${BASE_URL}/tv/${dramaId}/credits?api_key=${API_KEY}`)
      .then(res => res.json())
      .then(data => setCast((data.cast || []).filter((c: any) => c.profile_path).slice(0, 10)));

    // Similar — same country and genre
    fetch(`${BASE_URL}/tv/${dramaId}?api_key=${API_KEY}`)
      .then(res => res.json())
      .then(dramaInfo => {
        const country = dramaInfo.origin_country?.[0] || "KR";
        const genreIds = dramaInfo.genres?.map((g: any) => g.id).slice(0, 2).join(",") || "";
        const lang = country === "KR" ? "ko" : country === "CN" ? "zh" : "ko";
        fetch(`${BASE_URL}/discover/tv?api_key=${API_KEY}&with_origin_country=${country}&with_original_language=${lang}&with_genres=${genreIds}&sort_by=popularity.desc&without_genres=16&vote_count.gte=10`)
          .then(r => r.json())
          .then(data => {
            const filtered = (data.results || [])
              .filter((s: any) => s.poster_path && s.id !== parseInt(dramaId))
              .slice(0, 10);
            setSimilar(filtered);
          });
      });
  }, []);

  if (!drama) return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-red-500"></div>
    </main>
  );

  const country = drama.origin_country?.[0];
  const isKdrama = country === "KR";
  const isCdrama = country === "CN";
  const accentColor = isKdrama ? "red" : isCdrama ? "amber" : "red";

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-4 sm:px-8 py-3 bg-white border-b border-gray-200 sticky top-0 z-50">
        <a href="/" className="text-lg sm:text-2xl font-bold text-red-500">YourDramaClub</a>
        <div className="hidden sm:flex gap-6 text-sm font-medium text-gray-600">
          <a href="/KDrama" className="hover:text-red-500">KDrama</a>
          <a href="/Cdrama" className="hover:text-red-500">CDrama</a>
          <a href="/blog" className="hover:text-red-500">Blog</a>
        </div>
        <button className="bg-red-500 hover:bg-red-600 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold text-white">Sign In</button>
      </nav>

      {/* Hero Backdrop */}
      {drama.backdrop_path && (
        <div className="relative h-48 sm:h-72 overflow-hidden">
          <img src={`https://image.tmdb.org/t/p/original${drama.backdrop_path}`}
            alt={drama.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-50 via-black/20 to-transparent" />
        </div>
      )}

      <div className="px-4 sm:px-8 py-6 max-w-5xl mx-auto">
        <a href="/" className="text-red-500 text-sm hover:text-red-600">← Back to Home</a>

        {/* Main Info */}
        <div className="flex gap-4 sm:gap-8 mt-4">
          {/* Poster */}
          <div className="flex-shrink-0">
            {drama.poster_path
              ? <img src={`${IMG_URL}${drama.poster_path}`} alt={drama.name}
                  className="w-28 sm:w-48 rounded-xl shadow-lg" />
              : <div className="w-28 sm:w-48 aspect-[2/3] bg-gray-200 rounded-xl" />}
          </div>

          {/* Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-red-100 text-red-600">
                {isKdrama ? "🇰🇷 KDrama" : isCdrama ? "🇨🇳 CDrama" : "🌏 Asian Drama"}
              </span>
              {drama.status && (
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full
                  ${drama.status === "Returning Series" ? "bg-green-100 text-green-600" :
                    drama.status === "Ended" ? "bg-gray-100 text-gray-600" : "bg-blue-100 text-blue-600"}`}>
                  {drama.status === "Returning Series" ? "● Ongoing" : drama.status === "Ended" ? "✓ Completed" : drama.status}
                </span>
              )}
            </div>

            <h1 className="text-xl sm:text-4xl font-bold mb-1">{drama.name}</h1>
            {drama.original_name !== drama.name && (
              <p className="text-gray-400 text-sm mb-2">{drama.original_name}</p>
            )}

            {/* Rating */}
            <div className="flex items-center gap-3 mb-3">
              <div className="flex items-center gap-1 bg-yellow-50 border border-yellow-200 px-3 py-1 rounded-full">
                <span className="text-yellow-500">⭐</span>
                <span className="font-bold text-sm">{drama.vote_average?.toFixed(1)}</span>
                <span className="text-gray-400 text-xs">TMDb</span>
              </div>
              <span className="text-xs text-gray-400">{drama.vote_count?.toLocaleString()} votes</span>
            </div>

            {/* Quick Info */}
            <div className="flex flex-wrap gap-3 text-xs text-gray-600 mb-4">
              {drama.first_air_date && <span>📅 {drama.first_air_date?.slice(0, 4)}</span>}
              {drama.number_of_episodes && <span>🎬 {drama.number_of_episodes} Episodes</span>}
              {drama.number_of_seasons && <span>📺 {drama.number_of_seasons} Season{drama.number_of_seasons > 1 ? 's' : ''}</span>}
            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-2 mb-4">
              {drama.genres?.map((g: any) => (
                <a key={g.id} href={`/genre/${g.id}`}
                  className="px-3 py-1 bg-white border border-gray-200 rounded-full text-xs font-medium hover:bg-red-50 hover:border-red-200 hover:text-red-500 transition">
                  {g.name}
                </a>
              ))}
            </div>

            {/* Buttons */}
            <div className="flex gap-2 flex-wrap">
              {trailer && (
                <button onClick={() => setShowTrailer(true)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 transition">
                  ▶ Watch Trailer
                </button>
              )}
              <a href={`https://www.imdb.com/search/title/?title=${encodeURIComponent(drama.name)}`}
                target="_blank" rel="noopener noreferrer"
                className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded-full text-sm font-semibold transition">
                IMDb
              </a>
              <a href={`https://mydramalist.com/search?q=${encodeURIComponent(drama.name)}`}
                target="_blank" rel="noopener noreferrer"
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold transition">
                MyDramaList
              </a>
              <a href={`/blog/drama/${drama.id}`}
                className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-full text-sm font-semibold transition">
                📝 Watch Guide
              </a>
            </div>
          </div>
        </div>

        {/* Synopsis */}
        {drama.overview && (
          <div className="mt-6 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <h2 className="font-bold text-lg mb-2">📖 Synopsis</h2>
            <p className="text-gray-600 text-sm leading-relaxed">{drama.overview}</p>
          </div>
        )}

        {/* Where to Watch */}
        <div className="mt-4 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <h2 className="font-bold text-lg mb-3">📺 Where to Watch</h2>
          {providers.length > 0 ? (
            <div className="flex flex-wrap gap-3">
              {providers.map((provider: any) => {
                const urls: Record<string, string> = {
                  "Netflix": `https://www.netflix.com/search?q=${encodeURIComponent(drama.name)}`,
                  "Amazon Prime Video": `https://www.amazon.com/s?k=${encodeURIComponent(drama.name)}`,
                  "Disney Plus": `https://www.disneyplus.com/search/${encodeURIComponent(drama.name)}`,
                  "Viki": `https://www.viki.com/search?q=${encodeURIComponent(drama.name)}`,
                  "iQIYI": `https://www.iq.com/search/${encodeURIComponent(drama.name)}`,
                  "WeTV": `https://wetv.vip/search?query=${encodeURIComponent(drama.name)}`,
                  "Viu": `https://www.viu.com/search?q=${encodeURIComponent(drama.name)}`,
                  "Apple TV Plus": `https://tv.apple.com/search?term=${encodeURIComponent(drama.name)}`,
                };
                const url = urls[provider.provider_name] ||
                  `https://www.google.com/search?q=watch+${encodeURIComponent(drama.name)}+on+${encodeURIComponent(provider.provider_name)}`;
                return (
                  <a key={provider.provider_id} href={url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-gray-900 hover:bg-gray-700 text-white px-4 py-2 rounded-full text-sm font-semibold transition">
                    {provider.logo_path && (
                      <img src={`https://image.tmdb.org/t/p/w45${provider.logo_path}`}
                        alt={provider.provider_name} className="w-5 h-5 rounded" />
                    )}
                    {provider.provider_name}
                  </a>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-wrap gap-3">
              {[
                { name: "Netflix", color: "bg-red-600", url: `https://www.netflix.com/search?q=${encodeURIComponent(drama.name)}` },
                { name: "Viki", color: "bg-blue-600", url: `https://www.viki.com/search?q=${encodeURIComponent(drama.name)}` },
                { name: "WeTV", color: "bg-green-600", url: `https://wetv.vip/search?query=${encodeURIComponent(drama.name)}` },
                { name: "iQIYI", color: "bg-green-700", url: `https://www.iq.com/search/${encodeURIComponent(drama.name)}` },
                { name: "Viu", color: "bg-yellow-500", url: `https://www.viu.com/search?q=${encodeURIComponent(drama.name)}` },
              ].map(platform => (
                <a key={platform.name} href={platform.url} target="_blank" rel="noopener noreferrer"
                  className={`${platform.color} text-white px-4 py-2 rounded-full text-sm font-semibold hover:opacity-90 transition`}>
                  {platform.name}
                </a>
              ))}
            </div>
          )}
          <p className="text-xs text-gray-400 mt-2">* Availability may vary by region</p>
        </div>

        {/* Cast */}
        {cast.length > 0 && (
          <div className="mt-4 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <h2 className="font-bold text-lg mb-3">🎭 Main Cast</h2>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {cast.map((member: any) => (
                <a key={member.id} href={`/actor/${member.id}`}
                  className="flex-shrink-0 flex flex-col items-center w-16 sm:w-20 text-center hover:opacity-80 transition">
                  <img src={`https://image.tmdb.org/t/p/w185${member.profile_path}`}
                    alt={member.name} className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-gray-100" />
                  <p className="text-[10px] sm:text-xs font-medium mt-1 truncate w-full">{member.name}</p>
                  <p className="text-[9px] text-gray-400 truncate w-full">{member.character}</p>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Trailer Modal */}
        {showTrailer && trailer && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={() => setShowTrailer(false)}>
            <div className="w-full max-w-3xl" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-white font-bold">{drama.name} — Trailer</h3>
                <button onClick={() => setShowTrailer(false)} className="text-white text-2xl">✕</button>
              </div>
              <iframe src={trailer} className="w-full aspect-video rounded-xl"
                allowFullScreen allow="autoplay" />
            </div>
          </div>
        )}

        {/* Similar Dramas */}
        {similar.length > 0 && (
          <div className="mt-4">
            <h2 className="font-bold text-lg mb-3">🔥 Similar Dramas</h2>
            <div className="flex gap-3 overflow-x-auto pb-3">
              {similar.map((s: any) => (
                <a key={s.id} href={`/drama/${s.id}`} className="flex-shrink-0 w-28 sm:w-36 block">
                  <img src={`${IMG_URL}${s.poster_path}`} alt={s.name}
                    className="w-full aspect-[2/3] object-cover rounded-xl" />
                  <p className="text-xs font-medium mt-1 truncate">{s.name}</p>
                  <p className="text-[10px] text-gray-400">⭐ {s.vote_average?.toFixed(1)}</p>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      <footer className="px-4 sm:px-8 py-8 border-t border-gray-200 text-center text-gray-400 text-xs mt-10">
        © 2025 YourDramaClub · Built with ❤️ for drama lovers
      </footer>
    </main>
  );
}