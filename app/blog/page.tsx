import { blogPosts } from "../blogData";

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";
const IMG_URL = "https://image.tmdb.org/t/p/w500";

export const metadata = {
  title: "Drama Blog - KDrama & CDrama Articles | YourDramaClub",
  description: "Read articles, recommendations, and guides about the best Korean and Chinese dramas.",
};

async function getCoverImage(dramaId: string) {
  try {
    const data = await fetch(`${BASE_URL}/tv/${dramaId}?api_key=${API_KEY}`, { next: { revalidate: 3600 } }).then(r => r.json());
    return data.poster_path ? `${IMG_URL}${data.poster_path}` : null;
  } catch {
    return null;
  }
}

export default async function BlogPage() {
  const postsWithImages = await Promise.all(
    blogPosts.map(async (post) => ({
      ...post,
      coverImage: await getCoverImage(post.coverDramaId),
    }))
  );

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      <nav className="flex items-center justify-between px-4 sm:px-8 py-3 sm:py-4 bg-white border-b border-gray-200 sticky top-0 z-50">
        <a href="/" className="text-xl sm:text-2xl font-bold text-red-500">YourDramaClub</a>
        <div className="hidden sm:flex gap-6 text-sm font-medium text-gray-600">
          <a href="/KDrama" className="hover:text-red-500 transition">KDrama</a>
          <a href="/Cdrama" className="hover:text-red-500 transition">CDrama</a>
          <a href="/blog" className="text-red-500 font-semibold">Blog</a>
        </div>
        <button className="bg-red-500 hover:bg-red-600 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold text-white transition">Sign In</button>
      </nav>

      <div className="px-4 sm:px-8 py-10 sm:py-16 max-w-5xl mx-auto">
        <h1 className="text-3xl sm:text-5xl font-bold mb-3">📝 Drama Blog</h1>
        <p className="text-gray-500 text-sm sm:text-lg mb-10">Recommendations, guides, and articles for drama lovers</p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {postsWithImages.map(post => (
            <a key={post.slug} href={`/blog/${post.slug}`}
              className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 block">
              {post.coverImage ? (
                <img src={post.coverImage} alt={post.title} className="w-full h-64 object-cover" />
              ) : (
                <div className="w-full h-64 bg-gray-200" />
              )}
              <div className="p-4">
                <p className="text-xs text-gray-400 mb-1">{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <h2 className="font-bold text-lg mb-2 leading-snug">{post.title}</h2>
                <p className="text-gray-500 text-sm line-clamp-3">{post.excerpt}</p>
              </div>
            </a>
          ))}
        </div>
      </div>

      <footer className="px-4 sm:px-8 py-8 border-t border-gray-200 text-center text-gray-400 text-xs sm:text-sm">
        © 2025 YourDramaClub · Built with ❤️ for drama lovers
      </footer>
    </main>
  );
}