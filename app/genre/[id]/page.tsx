'use client';

import { useEffect, useState } from "react";

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const IMG_URL = "https://image.tmdb.org/t/p/w500";

export default function GenrePage() {
  const [dramas, setDramas] = useState<any[]>([]);
  const [genreName, setGenreName] = useState("");

  useEffect(() => {
    const pathParts = window.location.pathname.split('/');
    const genreId = pathParts[pathParts.length - 1];

    fetch(
      `https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&with_genres=${genreId}&sort_by=popularity.desc`
    )
      .then(res => res.json())
      .then(data => setDramas(data.results || []));

    fetch(
      `https://api.themoviedb.org/3/genre/tv/list?api_key=${API_KEY}`
    )
      .then(res => res.json())
      .then(data => {
        const genre = data.genres.find((g: any) => g.id == genreId);
        setGenreName(genre?.name || "Genre");
      });
  }, []);

  return (
    <main className="min-h-screen bg-gray-950 text-white p-8">
      <a
        href="/"
        className="inline-block mb-6 text-red-400 hover:text-red-300"
      >
        ← Back to Home
      </a>

      <h1 className="text-4xl font-bold mb-8">
        {genreName} Dramas
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-5">
        {dramas.map(drama => (
          <a
            key={drama.id}
            href={`/drama/${drama.id}`}
            className="bg-gray-800 rounded-xl overflow-hidden hover:scale-105 transition block"
          >
            {drama.poster_path ? (
              <img
                src={`${IMG_URL}${drama.poster_path}`}
                alt={drama.name}
                className="w-full h-64 object-cover"
              />
            ) : (
              <div className="w-full h-64 bg-gray-700 flex items-center justify-center">
                No Poster
              </div>
            )}

            <div className="p-3">
              <p className="font-semibold text-sm truncate">
                {drama.name}
              </p>

              <p className="text-yellow-400 text-xs mt-1">
                ⭐ {drama.vote_average?.toFixed(1)}
              </p>
            </div>
          </a>
        ))}
      </div>
    </main>
  );
}