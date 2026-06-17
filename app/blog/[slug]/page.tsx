import { blogPosts } from "../../blogData";
import { notFound } from "next/navigation";
import Navbar from "../../components/Navbar";

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";
const IMG_URL = "https://image.tmdb.org/t/p/w780";

async function getCoverImage(dramaId: string) {
  try {
    const data = await fetch(`${BASE_URL}/tv/${dramaId}?api_key=${API_KEY}`, { next: { revalidate: 3600 } }).then(r => r.json());
    return data.backdrop_path ? `${IMG_URL}${data.backdrop_path}` : data.poster_path ? `${IMG_URL}${data.poster_path}` : null;
  } catch {
    return null;
  }
}

export async function generateStaticParams() {
  return blogPosts.map((post: any) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = blogPosts.find((p: any) => p.slug === slug);
  if (!post) return { title: "Article Not Found | YourDramaClub" };
  return {
    title: `${post.title} | YourDramaClub`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = blogPosts.find((p: any) => p.slug === slug);
  if (!post) return notFound();

  const coverImage = await getCoverImage(post.coverDramaId);

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      <Navbar />

      <article className="px-4 sm:px-8 py-10 max-w-3xl mx-auto">
        <a href="/blog" className="text-red-500 text-sm hover:text-red-600">← Back to Blog</a>
        <p className="text-xs text-gray-400 mt-4">{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        <h1 className="text-2xl sm:text-4xl font-bold mt-2 mb-6">{post.title}</h1>
        {coverImage ? (
          <img src={coverImage} alt={post.title} className="w-full h-64 sm:h-96 object-cover rounded-xl mb-8" />
        ) : (
          <div className="w-full h-64 sm:h-96 bg-gray-200 rounded-xl mb-8" />
        )}
        <div className="max-w-none text-gray-700 leading-relaxed">
          {post.content.map((block: any, i: any) => {
            if (block.type === 'heading') {
              return <h3 key={i} className="text-lg sm:text-xl font-bold mt-6 mb-2 text-gray-900">{block.text}</h3>;
            }
            if (block.type === 'drama_link') {
              return (
                <h3 key={i} className="text-lg sm:text-xl font-bold mt-6 mb-2">
                  <a href={`/drama/${block.id}`} className="text-red-500 hover:underline">{block.text}</a>
                </h3>
              );
            }
            return <p key={i} className="mb-4">{block.text}</p>;
          })}
        </div>
      </article>

      <footer className="px-4 sm:px-8 py-8 border-t border-gray-200 text-center text-gray-400 text-xs sm:text-sm mt-10">
        © 2025 YourDramaClub · Built with ❤️ for drama lovers
      </footer>
    </main>
  );
}