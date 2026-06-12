'use client';
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";
const IMG_URL = "https://image.tmdb.org/t/p/w500";
const PROFILE_URL = "https://image.tmdb.org/t/p/w185";

export default function ActorPage() {
  const params = useParams();
  const actorId = params.id as string;
  const [actor, setActor] = useState<any>(null);
  const [dramas, setDramas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`${BASE_URL}/person/${actorId}?api_key=${API_KEY}`).then(r => r.json()),
      fetch(`${BASE_URL}/person/${actorId}/tv_credits?api_key=${API_KEY}`).then(r => r.json()),
    ]).then(([personData, creditsData]) => {
      setActor(personData);
      const sorted = (creditsData.cast || [])
        .filter((show: any) => show.poster_path && show.vote_average > 0)
        .sort((a: any, b: any) => b.vote_average - a.vote_average)
        .slice(0, 20);
      setDramas(sorted);
      setLoading(false);
    });
  }, [actorId]);

  if (loading) return (
    <main className="min-h-screen bg-gray-950 text-white">
      <nav className="flex items-center justify-between px-8 py-4 bg-gray-900 border-b border-gray-800">
        <a href="/" className="text-2xl font-bold text-red-500">YourDramaClub</a>
      </nav>
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-red-500"></div>
      </div>
    </main>
  );

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <nav className="flex items-center justify-between px-8 py-4 bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
        <a href="/" className="text-2xl font-bold text-red-500">YourDramaClub</a>
        <button className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm font-semibold">Sign In</button>
      </nav>

      {/* Actor Profile */}
      <div className="px-8 py-10">
        <a href="/" className="text-gray-400 hover:text-white text-sm transition mb-6 inline-block">← Back to Home</a>
        
        <div className="flex gap-8 mb-12 flex-wrap">
          {actor?.profile_path ? (
            <img src={`${PROFILE_URL}${actor.profile_path}`} alt={actor.name}
              className="w-40 h-40 rounded-full object-cover border-4 border-red-500 shadow-xl" />
          ) : (
            <div className="w-40 h-40 rounded-full bg-gray-700 flex items-center justify-center text-4xl border-4 border-red-500">👤</div>
          )}
          <div className="flex-1 min-w-0">
            <h1 className="text-4xl font-bold mb-2">{actor?.name}</h1>
            {actor?.place_of_birth && (
              <p className="text-gray-400 mb-2">📍 {actor.place_of_birth}</p>
            )}
            {actor?.birthday && (
              <p className="text-gray-400 mb-4">🎂 {actor.birthday}</p>
            )}
            {actor?.biography && (
              <p className="text-gray-300 text-sm leading-relaxed max-w-2xl line-clamp-4">
                {actor.biography}
              </p>
            )}
          </div>
        </div>

        {/* Their Dramas */}
        <h2 className="text-2xl font-bold mb-6">🎬 Dramas & Shows — Ranked by Rating</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {dramas.map((drama, index) => (
            <a key={drama.id} href={`/drama/${drama.id}`}
              className="bg-gray-800 rounded-xl overflow-hidden hover:scale-105 transition-all duration-300 block relative">
              <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
                #{index + 1}
              </div>
              <img src={`${IMG_URL}${drama.poster_path}`} alt={drama.name} className="w-full h-64 object-cover" />
              <div className="p-3">
                <p className="font-semibold text-sm truncate text-white">{drama.name}</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-gray-400 text-xs">{drama.first_air_date?.slice(0, 4)}</span>
                  <span className="text-yellow-400 text-xs">⭐ {drama.vote_average?.toFixed(1)}</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </main>
  );
}