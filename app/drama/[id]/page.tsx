'use client';

import { useEffect, useState } from "react";

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const IMG_URL = "https://image.tmdb.org/t/p/w500";

export default function DramaDetailPage() {
  const [drama, setDrama] = useState<any>(null);
  const [trailer, setTrailer] = useState("");
  const [similar, setSimilar] = useState<any[]>([]);

  useEffect(() => {
    const pathParts = window.location.pathname.split("/");
    const dramaId = pathParts[pathParts.length - 1];

    // Drama Details
    fetch(`https://api.themoviedb.org/3/tv/${dramaId}?api_key=${API_KEY}`)
      .then((res) => res.json())
      .then((data) => setDrama(data));

    // Trailer
    fetch(`https://api.themoviedb.org/3/tv/${dramaId}/videos?api_key=${API_KEY}`)
      .then((res) => res.json())
      .then((data) => {
        const video = data.results?.find(
          (v: any) =>
            v.site === "YouTube" &&
            (v.type === "Trailer" || v.type === "Teaser")
        );

        if (video) {
          setTrailer(`https://www.youtube.com/watch?v=${video.key}`);
        }
      });

    // Similar Dramas
    fetch(`https://api.themoviedb.org/3/tv/${dramaId}/recommendations?api_key=${API_KEY}`)
      .then((res) => res.json())
      .then((data) => {
        setSimilar(data.results?.slice(0, 6) || []);
      });

  }, []);

  if (!drama) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white p-8">
      <a
        href="/"
        className="inline-block mb-6 text-red-400 hover:text-red-300"
      >
        ← Back to Home
      </a>

      <div className="grid md:grid-cols-3 gap-8">
        <div>
          <img
            src={`${IMG_URL}${drama.poster_path}`}
            alt={drama.name}
            className="rounded-xl w-full"
          />
        </div>

        <div className="md:col-span-2">
          <h1 className="text-5xl font-bold mb-4">
            {drama.name}
          </h1>

          <p className="text-yellow-400 text-2xl mb-4">
            ⭐ {drama.vote_average?.toFixed(1)}
          </p>

          {trailer && (
            <a
              href={trailer}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mb-6 bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg font-semibold"
            >
              ▶ Watch Trailer
            </a>
          )}

          <p className="text-gray-300 text-lg mb-8">
            {drama.overview}
          </p>

          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-3">
              Genres
            </h3>

            <div className="flex flex-wrap gap-2">
              {drama.genres?.map((genre: any) => (
                <a
                  key={genre.id}
                  href={`/genre/${genre.id}`}
                  className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-full text-sm"
                >
                  {genre.name}
                </a>
              ))}
            </div>
          </div>

          <div className="space-y-3 text-lg">
            <p>
              <strong>First Air Date:</strong> {drama.first_air_date}
            </p>

            <p>
              <strong>Episodes:</strong> {drama.number_of_episodes}
            </p>

            <p>
              <strong>Seasons:</strong> {drama.number_of_seasons}
            </p>

            <p>
              <strong>Status:</strong> {drama.status}
            </p>

            <p>
              <strong>Language:</strong>{" "}
              {drama.original_language?.toUpperCase()}
            </p>
          </div>
        </div>
      </div>

      {similar.length > 0 && (
        <div className="mt-20">
          <h2 className="text-3xl font-bold mb-8">
            🔥 Similar Dramas
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {similar.map((item: any) => (
              <a
                key={item.id}
                href={`/drama/${item.id}`}
                className="bg-gray-800 rounded-xl overflow-hidden hover:scale-105 transition"
              >
                {item.poster_path ? (
                  <img
                    src={`${IMG_URL}${item.poster_path}`}
                    alt={item.name}
                    className="w-full h-64 object-cover"
                  />
                ) : (
                  <div className="w-full h-64 bg-gray-700 flex items-center justify-center">
                    No Poster
                  </div>
                )}

                <div className="p-3">
                  <p className="text-sm font-semibold truncate">
                    {item.name}
                  </p>

                  <p className="text-yellow-400 text-xs mt-1">
                    ⭐ {item.vote_average?.toFixed(1)}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}