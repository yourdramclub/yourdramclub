import { MetadataRoute } from "next";

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://yourdramclub.com";

  // Static pages
  const staticPages = [
    { url: baseUrl, lastModified: new Date(), priority: 1 },
    { url: `${baseUrl}/KDrama`, lastModified: new Date(), priority: 0.9 },
    { url: `${baseUrl}/Cdrama`, lastModified: new Date(), priority: 0.9 },
  ];

  // Fetch top KDramas and CDramas for drama detail pages
  const [krRes, cnRes] = await Promise.all([
    fetch(`${BASE_URL}/discover/tv?api_key=${API_KEY}&with_origin_country=KR&sort_by=popularity.desc&page=1`).then(r => r.json()),
    fetch(`${BASE_URL}/discover/tv?api_key=${API_KEY}&with_origin_country=CN&sort_by=popularity.desc&page=1`).then(r => r.json()),
  ]);

  const dramaPages = [
    ...(krRes.results || []),
    ...(cnRes.results || []),
  ].map((drama: any) => ({
    url: `${baseUrl}/drama/${drama.id}`,
    lastModified: new Date(),
    priority: 0.8,
  }));

  return [...staticPages, ...dramaPages];
}