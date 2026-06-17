import { notFound } from "next/navigation";
import Navbar from "../../../components/Navbar";

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";
const IMG_URL = "https://image.tmdb.org/t/p/w500";

async function getDramaData(id: string) {
  try {
    const [drama, credits, providers] = await Promise.all([
      fetch(`${BASE_URL}/tv/${id}?api_key=${API_KEY}`, { next: { revalidate: 3600 } }).then(r => r.json()),
      fetch(`${BASE_URL}/tv/${id}/credits?api_key=${API_KEY}`, { next: { revalidate: 3600 } }).then(r => r.json()),
      fetch(`${BASE_URL}/tv/${id}/watch/providers?api_key=${API_KEY}`, { next: { revalidate: 3600 } }).then(r => r.json()),
    ]);
    return { drama, credits, providers };
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await getDramaData(id);
  if (!data?.drama || data.drama.success === false) return { title: "Drama Not Found | YourDramaClub" };
  const { drama } = data;
  return {
    title: `Where to Watch ${drama.name} Online — Streaming Guide | YourDramaClub`,
    description: `Find out where to stream ${drama.name} online. Complete guide with streaming platforms, cast, episodes, and ratings for this ${drama.origin_country?.[0] === "KR" ? "KDrama" : "CDrama"}.`,
    keywords: `where to watch ${drama.name}, ${drama.name} streaming, ${drama.name} online, watch ${drama.name}`,
  };
}

export default async function DramaBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await getDramaData(id);

  if (!data?.drama || data.drama.success === false) return notFound();

  const { drama, credits, providers } = data;
  const cast = (credits.cast || []).slice(0, 5);
  const castNames = cast.map((c: any) => c.name).join(", ");

  const providerData = providers?.results;
  const regionData = providerData?.US || providerData?.GB || providerData?.KR ||
    providerData?.CN || providerData?.IN || Object.values(providerData || {})[0] || null;
  const streamingProviders = (regionData as any)?.flatrate || [];

  const country = drama.origin_country?.[0];
  const isKdrama = country === "KR";
  const isCdrama = country === "CN";
  const dramaType = isKdrama ? "KDrama" : isCdrama ? "CDrama" : "Asian Drama";
  const year = drama.first_air_date?.slice(0, 4);
  const rating = drama.vote_average?.toFixed(1);
  const genres = drama.genres?.map((g: any) => g.name).join(", ");

  const fallbackPlatforms = isKdrama
    ? ["Netflix", "Viki", "Viu", "Disney+"]
    : ["iQIYI", "WeTV", "Viki", "Netflix"];

  const platformUrls: Record<string, string> = {
    "Netflix": `https://www.netflix.com/search?q=${encodeURIComponent(drama.name)}`,
    "Viki": `https://www.viki.com/search?q=${encodeURIComponent(drama.name)}`,
    "iQIYI": `https://www.iq.com/search/${encodeURIComponent(drama.name)}`,
    "WeTV": `https://wetv.vip/search?query=${encodeURIComponent(drama.name)}`,
    "Viu": `https://www.viu.com/search?q=${encodeURIComponent(drama.name)}`,
    "Disney+": `https://www.disneyplus.com/search/${encodeURIComponent(drama.name)}`,
    "Amazon Prime Video": `https://www.amazon.com/s?k=${encodeURIComponent(drama.name)}`,
    "Apple TV Plus": `https://tv.apple.com/search?term=${encodeURIComponent(drama.name)}`,
  };

  const platformColors: Record<string, string> = {
    "Netflix": "bg-red-600", "Viki": "bg-blue-600", "iQIYI": "bg-green-700",
    "WeTV": "bg-green-500", "Viu": "bg-yellow-500", "Disney+": "bg-blue-800",
    "Amazon Prime Video": "bg-blue-500", "Apple TV Plus": "bg-gray-900",
  };

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      <Navbar />

      <article className="px-4 sm:px-8 py-10 max-w-3xl mx-auto">
        <a href="/blog" className="text-red-500 text-sm hover:text-red-600">← Back to Blog</a>

        <div className="mt-4 mb-6">
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-red-100 text-red-600 mr-2">{dramaType}</span>
          <span className="text-xs text-gray-400">{year}</span>
          <h1 className="text-2xl sm:text-4xl font-bold mt-2 mb-3">
            Where to Watch <span className="text-red-500">{drama.name}</span> — Complete Streaming Guide
          </h1>
          <p className="text-gray-500 text-sm">
            Looking for where to watch <strong>{drama.name}</strong>? Here's everything you need to know about streaming this {dramaType} online.
          </p>
        </div>

        {/* Poster + Quick Info */}
        <div className="flex gap-4 bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6">
          {drama.poster_path && (
            <img src={`${IMG_URL}${drama.poster_path}`} alt={drama.name}
              className="w-24 sm:w-36 rounded-xl flex-shrink-0" />
          )}
          <div className="flex-1">
            <h2 className="font-bold text-lg">{drama.name}</h2>
            {drama.original_name !== drama.name && (
              <p className="text-gray-400 text-sm">{drama.original_name}</p>
            )}
            <div className="mt-2 space-y-1 text-sm text-gray-600">
              <p>⭐ <strong>{rating}</strong> / 10 on TMDb</p>
              {drama.number_of_episodes && <p>🎬 <strong>{drama.number_of_episodes}</strong> Episodes</p>}
              {year && <p>📅 First aired: <strong>{year}</strong></p>}
              {genres && <p>🎭 Genres: <strong>{genres}</strong></p>}
              {castNames && <p>👥 Stars: <strong>{castNames}</strong></p>}
            </div>
            <a href={`/drama/${id}`}
              className="inline-block mt-3 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full text-sm font-semibold transition">
              View Full Details →
            </a>
          </div>
        </div>

        {/* Synopsis */}
        {drama.overview && (
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-2">
              What is <span className="text-red-500">{drama.name}</span> About?
            </h2>
            <p className="text-gray-600 leading-relaxed">{drama.overview}</p>
          </div>
        )}

        {/* Where to Watch */}
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-3">
            Watch <span className="text-red-500">{drama.name}</span> Online
          </h2>
          {streamingProviders.length > 0 ? (
            <>
              <p className="text-gray-600 text-sm mb-4">
                <strong>{drama.name}</strong> is available on these streaming platforms:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {streamingProviders.map((provider: any) => {
                  const url = platformUrls[provider.provider_name] ||
                    `https://www.google.com/search?q=watch+${encodeURIComponent(drama.name)}+on+${encodeURIComponent(provider.provider_name)}`;
                  return (
                    <a key={provider.provider_id} href={url} target="_blank" rel="noopener noreferrer"
                      className="bg-gray-900 text-white px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-3 hover:bg-gray-700 transition">
                      {provider.logo_path && (
                        <img src={`https://image.tmdb.org/t/p/w45${provider.logo_path}`}
                          alt={provider.provider_name} className="w-8 h-8 rounded-lg" />
                      )}
                      <span>Watch on {provider.provider_name}</span>
                      <span className="ml-auto">→</span>
                    </a>
                  );
                })}
              </div>
            </>
          ) : (
            <>
              <p className="text-gray-600 text-sm mb-4">
                Try searching <strong>{drama.name}</strong> on these popular platforms:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {fallbackPlatforms.map((platform) => (
                  <a key={platform} href={platformUrls[platform]} target="_blank" rel="noopener noreferrer"
                    className={`${platformColors[platform]} text-white px-4 py-3 rounded-xl text-sm font-semibold flex items-center justify-between hover:opacity-90 transition`}>
                    <span>Search on {platform}</span>
                    <span>→</span>
                  </a>
                ))}
              </div>
            </>
          )}
          <p className="text-xs text-gray-400 mt-2">* Availability varies by country and region.</p>
        </div>

        {/* Rating */}
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-2">
            Is <span className="text-red-500">{drama.name}</span> Worth Watching?
          </h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            With a TMDb rating of <strong>{rating}/10</strong>, {drama.name} is{" "}
            {parseFloat(rating) >= 8 ? "highly rated and definitely worth your time." :
             parseFloat(rating) >= 7 ? "well received by drama fans and worth checking out." :
             "a decent watch for fans of the genre."}{" "}
            {genres && `If you enjoy ${genres} dramas, this one is a great pick.`}
          </p>
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="text-3xl font-bold text-yellow-500">{rating}</div>
              <div>
                <p className="text-sm font-semibold">TMDb Rating</p>
                <p className="text-xs text-gray-400">{drama.vote_count?.toLocaleString()} user votes</p>
              </div>
            </div>
          </div>
        </div>

        {/* Cast */}
        {cast.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-3">Main Cast</h2>
            <div className="flex gap-3 flex-wrap">
              {cast.map((member: any) => (
                <a key={member.id} href={`/actor/${member.id}`}
                  className="flex flex-col items-center w-16 text-center hover:opacity-80 transition">
                  {member.profile_path && (
                    <img src={`https://image.tmdb.org/t/p/w185${member.profile_path}`}
                      alt={member.name} className="w-14 h-14 rounded-full object-cover border-2 border-gray-100" />
                  )}
                  <p className="text-[10px] font-medium mt-1 truncate w-full">{member.name}</p>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="bg-red-50 border border-red-100 rounded-xl p-5 text-center">
          <h3 className="font-bold text-lg mb-2">Want More Details?</h3>
          <p className="text-gray-600 text-sm mb-4">View the full cast, trailer, episodes, and similar dramas.</p>
          <a href={`/drama/${id}`}
            className="inline-block bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-full font-semibold transition">
            View <strong>{drama.name}</strong> Full Page →
          </a>
        </div>
      </article>

      <footer className="px-4 sm:px-8 py-8 border-t border-gray-200 text-center text-gray-400 text-xs mt-10">
        © 2025 YourDramaClub · Built with ❤️ for drama lovers
      </footer>
    </main>
  );
}