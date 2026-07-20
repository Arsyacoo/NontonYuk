"use client";

import { useState } from "react";
import { Movie } from "@/app/lib/movies";
import { MovieGrid } from "@/app/components/MovieGrid";
import { MovieCard } from "@/app/components/MovieCard";
import { MovieModal } from "@/app/components/MovieModal";

interface GenreClientProps {
    title: string;
    movies: Movie[];
}

export function GenreClient({ title, movies }: GenreClientProps) {
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

    return (
        <main className="min-h-screen bg-[#09090b] text-white pt-32 pb-20">
            <div className="container mx-auto px-4 md:px-6">
                <div className="mb-8">
                    <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-2 text-white">
                        Genre: <span className="text-purple-400">{title}</span>
                    </h1>
                    <p className="text-zinc-400 text-sm md:text-base">
                        Jelajahi koleksi film dan serial kategori {title}.
                    </p>
                </div>

                <MovieGrid>
                    {movies.map((movie) => (
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

                <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
            </div>
        </main>
    );
}
