"use client";

import { useState, useEffect } from "react";
import { HeroCarousel } from "./HeroCarousel";
import { MovieRow } from "./MovieRow";
import { MovieModal } from "./MovieModal";
import { ContinueWatchingRow } from "./ContinueWatchingRow";
import { Movie } from "@/app/lib/movies";
import { useHistory } from "@/app/context/history-context";
import { useWatchlist } from "@/app/context/watchlist-context";

interface HomeClientProps {
    allMovies: Movie[];
    trending: Movie[];
    newReleases: Movie[];
    action: Movie[];
    anime: Movie[];
    scifi: Movie[];
}

export function HomeClient({
    allMovies,
    trending,
    newReleases,
    action,
    anime,
    scifi,
}: HomeClientProps) {
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
    const [recommendations, setRecommendations] = useState<Movie[]>([]);
    const { history } = useHistory();
    const { watchlist } = useWatchlist();

    const handleOpenModal = (movie: Movie) => {
        setSelectedMovie(movie);
    };

    // Personalized Recommendation Algorithm
    useEffect(() => {
        const watchedIds = new Set(history.map((item) => item.movieId));
        const unwatched = allMovies.filter((m) => !watchedIds.has(m._id));

        let results: Movie[] = [];

        if (history.length === 0) {
            // Fallback: Show top-rated unwatched movies
            results = [...unwatched]
                .sort((a, b) => (b.vote || 0) - (a.vote || 0))
                .slice(0, 8);
        } else {
            // Count watched genre frequencies
            const genreCounts: { [key: string]: number } = {};
            history.forEach((item) => {
                item.movie.genre?.forEach((g) => {
                    const lg = g.toLowerCase();
                    genreCounts[lg] = (genreCounts[lg] || 0) + 1;
                });
            });

            // Get top 2 favorite genres
            const topGenres = Object.entries(genreCounts)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 2)
                .map((entry) => entry[0]);

            // Filter unwatched movies sharing top genres
            let matches = unwatched.filter((m) =>
                m.genre?.some((g) => topGenres.includes(g.toLowerCase()))
            );

            // Sort matches by rating desc
            matches = matches.sort((a, b) => (b.vote || 0) - (a.vote || 0));

            // Pad if less than 8 results
            if (matches.length < 8) {
                const matchedIds = new Set(matches.map((m) => m._id));
                const remaining = unwatched
                    .filter((m) => !matchedIds.has(m._id))
                    .sort((a, b) => (b.vote || 0) - (a.vote || 0));
                matches = [...matches, ...remaining];
            }

            results = matches.slice(0, 8);
        }

        setRecommendations(results);
    }, [history, allMovies]);

    return (
        <main className="min-h-screen bg-[#09090b] overflow-x-hidden">
            {/* Dynamic Hero Carousel */}
            <HeroCarousel
                movies={trending.length > 0 ? trending : allMovies}
                onOpenModal={handleOpenModal}
            />

            {/* Content Rows */}
            <div className="relative z-30 -mt-16 md:-mt-24 space-y-8 pb-20">
                {/* Continue Watching Section */}
                <ContinueWatchingRow onOpenModal={handleOpenModal} />

                {/* Watchlist Section */}
                {watchlist.length > 0 && (
                    <MovieRow
                        title="Daftar Tontonan Saya 🔖"
                        movies={watchlist}
                        onOpenModal={handleOpenModal}
                    />
                )}

                {/* Personalized Recommendations Row */}
                {recommendations.length > 0 && (
                    <MovieRow
                        title="Rekomendasi Untukmu 🌟"
                        movies={recommendations}
                        onOpenModal={handleOpenModal}
                    />
                )}

                <MovieRow
                    title="Trending Now 🔥"
                    movies={trending}
                    onOpenModal={handleOpenModal}
                />
                <MovieRow
                    title="New Releases 🎬"
                    movies={newReleases}
                    onOpenModal={handleOpenModal}
                />
                <MovieRow
                    title="Action Hits 💥"
                    movies={action}
                    onOpenModal={handleOpenModal}
                />
                <MovieRow
                    title="Anime Collection 🌸"
                    movies={anime}
                    onOpenModal={handleOpenModal}
                />
                <MovieRow
                    title="Sci-Fi & Fantasy 🚀"
                    movies={scifi}
                    onOpenModal={handleOpenModal}
                />
            </div>

            {/* Quick Preview Modal */}
            <MovieModal
                movie={selectedMovie}
                onClose={() => setSelectedMovie(null)}
            />
        </main>
    );
}
