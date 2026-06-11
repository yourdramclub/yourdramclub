'use client';
import { useEffect, useState } from "react";
import Image from "next/image";

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";
const IMG_URL = "https://image.tmdb.org/t/p/w500";

async function fetchDramas(query: string) {
  const res = await fetch(`${BASE_URL}/search/tv?api_key=${API_KEY}&query=${query}&page=1`);
  const data = await res.json();
  return data.results?.slice(0, 4) || [];
}

export default function Home() {
  const [kdramas, setKdramas] = useState<any[]>([]);
  const [cdramas, setCdramas] = useState<any[]>([]);

  useEffect(() => {
    fetchDramas("Crash Landing on You").then(setKdramas);
    fetchDramas("Nirvana in Fire").then(setCdramas);
  }, []);

  const DramaCard = ({ drama, type }: { drama: any; type: string }) => (
    <div className="bg-gray-800 rounded-lg overflow-hidden hover:scale-105 transition cursor-pointer">
      {drama.poster_path ? (
        <img src={`${IMG_URL}${drama.poster_path}`} alt={drama.name} className="w-full h-64 object-cover" />
      ) : (
        <div className="w-full h-64 bg-gray-700 flex items-center justify-center text-gray-400">No Image</div>
      )}
      <div className="p-3">
        <p className="font-semibold text-sm truncate">{drama.name}</p>
        <p className={`text-xs mt-1 ${type === 'kdrama' ? 'text-red-400' : 'text-yellow-400'}`}>
          ⭐ {drama.vote_average?.toFixed(1)} · {type === 'kdrama' ? 'KDrama' : 'CDrama'}
        </p>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-4 bg-gray-900 border-b border-gray-800">
        <h1 className="text-2xl font-bold text-red-500">YourDramaClub</h1>
        <div className="flex gap-6 text-sm text-gray-300">
          <a href="#" className="hover:text-white">KDrama</a>
          <a href="#" className="hover:text-white">CDrama</a>
          <a href="#" className="hover:text-white">Movies</a>
        </div>
        <button className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm font-semibold">Sign In</button>
      </nav>

      {/* Hero */}
      <div className="px-8 py-20 bg-gradient-to-b from-gray-900 to-gray-950 text-center">
        <h2 className="text-5xl font-bold mb-4">Discover Your Next Favorite Drama</h2>
        <p className="text-gray-400 text-lg mb-8">Track, rate, and explore the best KDramas and CDramas</p>
        <input type="text" placeholder="Search dramas..." className="w-full max-w-lg px-5 py-3 rounded-full bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-red-500" />
      </div>

      {/* KDrama Section */}
      <section className="px-8 py-10">
        <h3 className="text-2xl font-bold mb-6">🔥 Trending KDramas</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {kdramas.length > 0 ? kdramas.map((drama) => (
            <DramaCard key={drama.id} drama={drama} type="kdrama" />
          )) : [1,2,3,4].map(i => (
            <div key={i} className="bg-gray-800 rounded-lg h-80 animate-pulse" />
          ))}
        </div>
      </section>

      {/* CDrama Section */}
      <section className="px-8 py-10">
        <h3 className="text-2xl font-bold mb-6">🇨🇳 Popular CDramas</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {cdramas.length > 0 ? cdramas.map((drama) => (
            <DramaCard key={drama.id} drama={drama} type="cdrama" />
          )) : [1,2,3,4].map(i => (
            <div key={i} className="bg-gray-800 rounded-lg h-80 animate-pulse" />
          ))}
        </div>
      </section>
    </main>
  );
}