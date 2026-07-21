"use client";

import { useState } from "react";
import { HeroCarousel } from "./HeroCarousel";
import { MovieRow } from "./MovieRow";
import { MovieModal } from "./MovieModal";
import { ContinueWatchingRow } from "./ContinueWatchingRow";
import { Movie } from "@/app/lib/movies";

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

    const handleOpenModal = (movie: Movie) => {
        setSelectedMovie(movie);
    };

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
