export default function Home() {
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
        <input
          type="text"
          placeholder="Search dramas..."
          className="w-full max-w-lg px-5 py-3 rounded-full bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-red-500"
        />
      </div>

      {/* Trending Section */}
      <section className="px-8 py-10">
        <h3 className="text-2xl font-bold mb-6">🔥 Trending Now</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {["Goblin", "Crash Landing on You", "Extraordinary Attorney Woo", "My Love from the Star"].map((drama) => (
            <div key={drama} className="bg-gray-800 rounded-lg overflow-hidden hover:scale-105 transition cursor-pointer">
              <div className="h-48 bg-gray-700 flex items-center justify-center text-gray-400 text-sm">Poster</div>
              <div className="p-3">
                <p className="font-semibold text-sm">{drama}</p>
                <p className="text-red-400 text-xs mt-1">⭐ KDrama</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CDrama Section */}
      <section className="px-8 py-10">
        <h3 className="text-2xl font-bold mb-6">🇨🇳 Popular CDramas</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {["The Story of Ming Lan", "Nirvana in Fire", "Love Between Fairy and Devil", "Word of Honor"].map((drama) => (
            <div key={drama} className="bg-gray-800 rounded-lg overflow-hidden hover:scale-105 transition cursor-pointer">
              <div className="h-48 bg-gray-700 flex items-center justify-center text-gray-400 text-sm">Poster</div>
              <div className="p-3">
                <p className="font-semibold text-sm">{drama}</p>
                <p className="text-yellow-400 text-xs mt-1">⭐ CDrama</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}