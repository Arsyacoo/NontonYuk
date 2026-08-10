"use client";

import { useState, useEffect, useMemo } from "react";
import { clsx } from "clsx";
import { HeroCarousel } from "./HeroCarousel";
import { MovieRow } from "./MovieRow";
import { MovieModal } from "./MovieModal";
import { ContinueWatchingRow } from "./ContinueWatchingRow";
import { MovieCard } from "./MovieCard";
import { Movie } from "@/app/lib/movies";
import { useHistory } from "@/app/context/history-context";
import { useWatchlist } from "@/app/context/watchlist-context";
import { useLanguage } from "@/app/context/language-context";

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
    const [activeGenre, setActiveGenre] = useState<string>("all");
    
    const { history } = useHistory();
    const { watchlist } = useWatchlist();
    const { t } = useLanguage();

    const handleOpenModal = (movie: Movie) => {
        setSelectedMovie(movie);
    };

    // Genre Tag Definitions
    const genres = useMemo(() => [
        { id: "all", label: t("home.genre.all") },
        { id: "trending", label: "Trending" },
        { id: "action", label: "Action" },
        { id: "anime", label: "Anime" },
        { id: "sci-fi", label: "Sci-Fi" },
    ], [t]);

    // Dynamic Filter Grid Movies
    const filteredMovies = useMemo(() => {
        switch (activeGenre) {
            case "trending":
                return trending;
            case "action":
                return action;
            case "anime":
                return anime;
            case "sci-fi":
                return scifi;
            default:
                return [];
        }
    }, [activeGenre, trending, action, anime, scifi]);

    // Personalized Recommendation Algorithm
    useEffect(() => {
        const watchedIds = new Set(history.map((item) => item.movieId));
        const unwatched = allMovies.filter((m) => !watchedIds.has(m._id));

        let results: Movie[] = [];

        if (history.length === 0) {
            results = [...unwatched]
                .sort((a, b) => (b.vote || 0) - (a.vote || 0))
                .slice(0, 8);
        } else {
            const genreCounts: { [key: string]: number } = {};
            history.forEach((item) => {
                item.movie.genre?.forEach((g) => {
                    const lg = g.toLowerCase();
                    genreCounts[lg] = (genreCounts[lg] || 0) + 1;
                });
            });

            const topGenres = Object.entries(genreCounts)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 2)
                .map((entry) => entry[0]);

            let matches = unwatched.filter((m) =>
                m.genre?.some((g) => topGenres.includes(g.toLowerCase()))
            );

            matches = matches.sort((a, b) => (b.vote || 0) - (a.vote || 0));

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

            {/* Quick Genre Tag Filters */}
            <div className="relative z-40 -mt-8 md:-mt-12 max-w-7xl mx-auto px-6 mb-8 overflow-x-auto scrollbar-hide flex items-center gap-2.5">
                {genres.map((g) => (
                    <button
                        key={g.id}
                        onClick={() => setActiveGenre(g.id)}
                        className={clsx(
                            "px-5 py-2.5 rounded-full text-xs font-extrabold transition-all border shrink-0 cursor-pointer shadow-md select-none",
                            activeGenre === g.id
                                ? "bg-purple-600 border-purple-500 text-white shadow-purple-600/35"
                                : "bg-[#121214]/80 border-white/5 text-zinc-400 hover:bg-white/10 hover:text-white"
                        )}
                    >
                        {g.label}
                    </button>
                ))}
            </div>

            {/* Content Rows */}
            <div className="relative z-30 space-y-8 pb-20">
                {activeGenre === "all" ? (
                    <>
                        {/* Continue Watching Section */}
                        <ContinueWatchingRow onOpenModal={handleOpenModal} />

                        {/* Watchlist Section */}
                        {watchlist.length > 0 && (
                            <MovieRow
                                title={t("home.my_watchlist")}
                                movies={watchlist}
                                onOpenModal={handleOpenModal}
                            />
                        )}

                        {/* Personalized Recommendations Row */}
                        {recommendations.length > 0 && (
                            <MovieRow
                                title={t("home.recommendations")}
                                movies={recommendations}
                                onOpenModal={handleOpenModal}
                            />
                        )}

                        <MovieRow
                            title={t("home.row.trending")}
                            movies={trending}
                            onOpenModal={handleOpenModal}
                        />
                        <MovieRow
                            title={t("home.row.new_releases")}
                            movies={newReleases}
                            onOpenModal={handleOpenModal}
                        />
                        <MovieRow
                            title={t("home.row.action")}
                            movies={action}
                            onOpenModal={handleOpenModal}
                        />
                        <MovieRow
                            title={t("home.row.anime")}
                            movies={anime}
                            onOpenModal={handleOpenModal}
                        />
                        <MovieRow
                            title={t("home.row.scifi")}
                            movies={scifi}
                            onOpenModal={handleOpenModal}
                        />
                    </>
                ) : (
                    /* Unified Filter Grid Section */
                    <div className="max-w-7xl mx-auto px-6 space-y-6 animate-fade-in">
                        <h2 className="text-2xl font-extrabold tracking-tight text-white capitalize">
                            {genres.find((g) => g.id === activeGenre)?.label} Hits 🎬
                        </h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                            {filteredMovies.map((movie) => (
                                <MovieCard
                                    key={movie._id}
                                    id={movie._id}
                                    title={movie.title}
                                    year={Number(movie.year)}
                                    rating={movie.vote || 0}
                                    posterUrl={movie.poster}
                                    movie={movie}
                                    onOpenModal={handleOpenModal}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Quick Preview Modal */}
            <MovieModal
                movie={selectedMovie}
                onClose={() => setSelectedMovie(null)}
            />
        </main>
    );
}
