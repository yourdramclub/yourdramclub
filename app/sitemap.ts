import { MetadataRoute } from "next";

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://yourdramclub.com";

  const staticPages = [
    { url: baseUrl, lastModified: new Date(), priority: 1 },
    { url: `${baseUrl}/KDrama`, lastModified: new Date(), priority: 0.9 },
    { url: `${baseUrl}/Cdrama`, lastModified: new Date(), priority: 0.9 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), priority: 0.8 },
    { url: `${baseUrl}/coming-soon`, lastModified: new Date(), priority: 0.7 },
    { url: `${baseUrl}/blog/top-10-kdramas-2026`, lastModified: new Date(), priority: 0.8 },
    { url: `${baseUrl}/blog/best-cdramas-beginners`, lastModified: new Date(), priority: 0.8 },
    { url: `${baseUrl}/blog/kdramas-like-squid-game`, lastModified: new Date(), priority: 0.8 },
  ];

  const pages = [1, 2, 3, 4, 5, 6];
  const krFetches = pages.map(p =>
    fetch(`${BASE_URL}/discover/tv?api_key=${API_KEY}&with_origin_country=KR&sort_by=popularity.desc&page=${p}&with_original_language=ko&without_genres=16`).then(r => r.json())
  );
  const cnFetches = pages.map(p =>
    fetch(`${BASE_URL}/discover/tv?api_key=${API_KEY}&with_origin_country=CN&sort_by=popularity.desc&page=${p}&with_original_language=zh&without_genres=16,10762`).then(r => r.json())
  );

  const [krResults, cnResults] = await Promise.all([
    Promise.all(krFetches),
    Promise.all(cnFetches),
  ]);

  const allDramas = [
    ...krResults.flatMap(r => r.results || []),
    ...cnResults.flatMap(r => r.results || []),
  ];

  const dramaPages = allDramas.map((drama: any) => ({
    url: `${baseUrl}/drama/${drama.id}`,
    lastModified: new Date(),
    priority: 0.8,
  }));

  const dramaBlogPages = allDramas.map((drama: any) => ({
    url: `${baseUrl}/blog/drama/${drama.id}`,
    lastModified: new Date(),
    priority: 0.7,
  }));

  return [...staticPages, ...dramaPages, ...dramaBlogPages];
}