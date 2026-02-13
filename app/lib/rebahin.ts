import { Movie } from "./movies";

const API_BASE = "https://zeldvorik.ru/rebahin21/api.php";

interface ApiMovie {
    slug: string;
    title: string;
    thumbnail: string;
    rating: string;
    year: string;
    type: string;
}

interface ApiResponse {
    success?: boolean;
    data?: ApiMovie[];
    result?: ApiMovie[]; // Sometimes it might be result, checking both
}

// Helper to normalize the weird API response format if needed
// Based on curl, it returns a JSON object with a data array
async function fetchFromApi(params: string): Promise<Movie[]> {
    try {
        const res = await fetch(`${API_BASE}?${params}`, { next: { revalidate: 60 } });
        if (!res.ok) throw new Error("API Failed");

        // The API might return jagged JSON or just keys. 
        // We treat it as standard JSON for now based on the last successful curl 
        // which showed { "data": [...] } for search and likely similar for home
        const json: any = await res.json();

        // Handle different response structures
        const list = json.data || json.result || (Array.isArray(json) ? json : []);

        return list.map((item: any) => ({
            _id: item.slug || Math.random().toString(), // Fallback if slug missing
            title: item.title,
            poster: item.thumbnail,
            year: item.year,
            vote: parseFloat(item.rating) || 0,
            // Identify if it's a real TMDB ID (numeric) or custom slug
            genre: ["external"]
        }));
    } catch (error) {
        console.error("Rebahin API Error:", error);
        return [];
    }
}

// Replaced external API with curated TMDB data to ensure video player compatibility
export async function getRebahinHome(): Promise<Movie[]> {
    return [
        { _id: "609681", title: "The Marvels", year: "2023", vote: 6.3, poster: "https://image.tmdb.org/t/p/w500/9GBhzXMFbwrpXsNnWWcUEavoy2r.jpg", genre: ["action", "sci-fi", "adventure"] },
        { _id: "872585", title: "Oppenheimer", year: "2023", vote: 8.1, poster: "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg", genre: ["drama", "history"] },
        { _id: "507089", title: "Five Nights at Freddy's", year: "2023", vote: 7.8, poster: "https://image.tmdb.org/t/p/w500/A4j8S6moJS2zNtRR8oWF08gRnWd.jpg", genre: ["horror", "mystery"] },
        { _id: "933131", title: "Godzilla Minus One", year: "2023", vote: 8.4, poster: "https://image.tmdb.org/t/p/w500/hkxxMIGaiCTmrEArK7J98umTo3Q.jpg", genre: ["sci-fi", "action"] },
        { _id: "695721", title: "The Hunger Games: The Ballad of Songbirds & Snakes", year: "2023", vote: 7.2, poster: "https://image.tmdb.org/t/p/w500/mBaXZ95R2OxueZhvQbcEWy2DqyO.jpg", genre: ["action", "drama", "sci-fi"] },
        { _id: "897087", title: "Freelance", year: "2023", vote: 6.5, poster: "https://image.tmdb.org/t/p/w500/7Bd4EUOqQDKZXA6Od5gkfzRNb0.jpg", genre: ["action", "comedy"] },
        { _id: "1071215", title: "Thanksgiving", year: "2023", vote: 6.7, poster: "https://image.tmdb.org/t/p/w500/f5f3TEVst1nHHyqgn7Z3q4UuQaX.jpg", genre: ["horror", "thriller"] },
        { _id: "572802", title: "Aquaman and the Lost Kingdom", year: "2023", vote: 6.5, poster: "https://image.tmdb.org/t/p/w500/7lTnXOy0iNtBAdRP3ZA50e8.jpg", genre: ["action", "fantasy"] }
    ].map(m => ({ ...m, type: 'movie' }));
}

export async function searchRebahin(query: string): Promise<Movie[]> {
    return []; // Disable external search for now to prioritize local DB
}
