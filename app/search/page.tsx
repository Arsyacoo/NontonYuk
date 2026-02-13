"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { Movie, searchMovies } from "../lib/movies";
import { searchRebahin } from "../lib/rebahin";
import { MovieGrid } from "../components/MovieGrid";
import { MovieCard } from "../components/MovieCard";

function SearchResults() {
    const searchParams = useSearchParams();
    const query = searchParams.get("q") || "";
    const [results, setResults] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);

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
        <div className="container mx-auto px-4 py-32 min-h-screen">
            <h1 className="text-3xl font-bold mb-8 text-white">
                Search Results for <span className="text-purple-500">"{query}"</span>
            </h1>

            {loading ? (
                <p className="text-white/50">Searching...</p>
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
                        />
                    ))}
                </MovieGrid>
            ) : (
                <div className="text-center py-20 text-white/50">
                    <p className="text-xl">No movies found for "{query}"</p>
                </div>
            )}
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
