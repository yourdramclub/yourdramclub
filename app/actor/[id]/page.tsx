'use client';
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "../../components/Navbar";

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";
const IMG_URL = "https://image.tmdb.org/t/p/w500";
const PROFILE_URL = "https://image.tmdb.org/t/p/w300";

export default function ActorPage() {
  const params = useParams();
  const actorId = params.id as string;
  const [actor, setActor] = useState<any>(null);
  const [dramas, setDramas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [bioExpanded, setBioExpanded] = useState(false);

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
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-red-500"></div>
      </div>
    </main>
  );

  const age = actor?.birthday
    ? Math.floor((new Date().getTime() - new Date(actor.birthday).getTime()) / 3.15576e10)
    : null;

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      <Navbar />

      <div className="px-4 sm:px-8 py-6 sm:py-10 max-w-5xl mx-auto">
        <a href="/" className="text-red-500 hover:text-red-600 text-sm transition mb-6 inline-block">← Back to Home</a>

        {/* Actor Profile */}
        <div className="flex flex-col sm:flex-row gap-6 mb-10 bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          {actor?.profile_path ? (
            <img src={`${PROFILE_URL}${actor.profile_path}`} alt={actor.name}
              className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover border-4 border-red-100 shadow-md mx-auto sm:mx-0 flex-shrink-0" />
          ) : (
            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-gray-200 flex items-center justify-center text-4xl border-4 border-red-100 mx-auto sm:mx-0 flex-shrink-0">👤</div>
          )}
          <div className="flex-1 min-w-0 text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">{actor?.name}</h1>
            <div className="flex flex-wrap justify-center sm:justify-start gap-x-4 gap-y-1 text-sm text-gray-500 mb-3">
              {actor?.place_of_birth && <span>📍 {actor.place_of_birth}</span>}
              {actor?.birthday && <span>🎂 {actor.birthday}{age ? ` (${age} years old)` : ""}</span>}
              {actor?.known_for_department && <span>🎭 {actor.known_for_department}</span>}
            </div>
            {actor?.biography && (
              <div>
                <p className={`text-gray-600 text-sm leading-relaxed ${bioExpanded ? "" : "line-clamp-3"}`}>
                  {actor.biography}
                </p>
                <button onClick={() => setBioExpanded(!bioExpanded)}
                  className="text-red-500 text-xs font-semibold mt-1 hover:underline">
                  {bioExpanded ? "Show less" : "Read more"}
                </button>
              </div>
            )}
            {!actor?.biography && (
              <p className="text-gray-400 text-sm italic">No biography available.</p>
            )}
          </div>
        </div>

        {/* Their Dramas */}
        {dramas.length > 0 && (
          <>
            <h2 className="text-lg sm:text-2xl font-bold mb-4">🎬 Dramas & Shows — Ranked by Rating</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4">
              {dramas.map((drama, index) => (
                <a key={drama.id} href={`/drama/${drama.id}`}
                  className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 block relative">
                  <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full z-10">
                    #{index + 1}
                  </div>
                  <img src={`${IMG_URL}${drama.poster_path}`} alt={drama.name} className="w-full aspect-[2/3] object-cover" />
                  <div className="p-2.5">
                    <p className="font-semibold text-xs sm:text-sm truncate text-gray-900">{drama.name}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-gray-400 text-[10px] sm:text-xs">{drama.first_air_date?.slice(0, 4)}</span>
                      <span className="text-yellow-500 text-[10px] sm:text-xs">⭐ {drama.vote_average?.toFixed(1)}</span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </>
        )}

        {dramas.length === 0 && (
          <p className="text-gray-400 text-center py-10">No drama credits found for this actor.</p>
        )}
      </div>

      <footer className="px-4 sm:px-8 py-8 border-t border-gray-200 text-center text-gray-400 text-xs mt-10">
        © 2025 YourDramaClub · Built with ❤️ for drama lovers
      </footer>
    </main>
  );
}