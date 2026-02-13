import { use } from "react";
import { getMoviesByGenre } from "../../lib/movies";
import { MovieGrid } from "../../components/MovieGrid";
import { MovieCard } from "../../components/MovieCard";

interface GenrePageProps {
    params: Promise<{ slug: string }>;
}

export default async function GenrePage({ params }: GenrePageProps) {
    const { slug } = await params;
    const movies = await getMoviesByGenre(slug);

    // Format title: "k-drama" -> "K Drama"
    const title = slug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());

    return (
        <main className="min-h-screen bg-[#09090b] text-white pt-32 pb-20">
            <div className="container mx-auto px-4">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold tracking-tight mb-2">{title}</h1>
                    <p className="text-white/60">Browse the latest {title} movies and series.</p>
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
                        />
                    ))}
                </MovieGrid>
            </div>
        </main>
    );
}
