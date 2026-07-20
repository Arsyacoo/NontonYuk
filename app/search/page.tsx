"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { Movie, searchMovies } from "../lib/movies";
import { searchRebahin } from "../lib/rebahin";
import { MovieGrid } from "../components/MovieGrid";
import { MovieCard } from "../components/MovieCard";
import { MovieModal } from "../components/MovieModal";

function SearchResults() {
    const searchParams = useSearchParams();
    const query = searchParams.get("q") || "";
    const [results, setResults] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

    useEffect(() => {
        async function fetchResults() {
            setLoading(true);
            const [localResults, externalResults] = await Promise.all([
                searchMovies(query),
                searchRebahin(query)
            ]);
            const combined = [...localResults, ...externalResults];

            // Deduplicate
            const uniqueResults = Array.from(new Map(combined.map(m => [m._id, m])).values());

            setResults(uniqueResults);
            setLoading(false);
        }
        fetchResults();
    }, [query]);

    return (
        <div className="container mx-auto px-4 md:px-6 py-32 min-h-screen">
            <h1 className="text-3xl md:text-4xl font-bold mb-8 text-white">
                Hasil Pencarian untuk <span className="text-purple-400">"{query}"</span>
            </h1>

            {loading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {Array.from({ length: 10 }).map((_, i) => (
                        <div key={i} className="aspect-[2/3] bg-zinc-900 animate-pulse rounded-xl" />
                    ))}
                </div>
            ) : results.length > 0 ? (
                <MovieGrid>
                    {results.map((movie) => (
                        <MovieCard
                            key={movie._id}
                            id={movie._id}
                            title={movie.title}
                            year={movie.year}
                            rating={movie.vote}
                            posterUrl={movie.poster}
                            movie={movie}
                            onOpenModal={(m) => setSelectedMovie(m)}
                        />
                    ))}
                </MovieGrid>
            ) : (
                <div className="text-center py-20 text-zinc-400">
                    <p className="text-xl font-medium">Tidak ada film ditemukan untuk "{query}"</p>
                </div>
            )}

            <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
        </div>
    );
}

export default function SearchPage() {
    return (
        <main className="min-h-screen bg-[#09090b]">
            <Suspense fallback={<div className="pt-32 px-4 text-white">Loading search...</div>}>
                <SearchResults />
            </Suspense>
        </main>
    );
}
