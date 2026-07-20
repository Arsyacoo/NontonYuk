import { getMoviesByGenre } from "../../lib/movies";
import { GenreClient } from "./GenreClient";

interface GenrePageProps {
    params: Promise<{ slug: string }>;
}

export default async function GenrePage({ params }: GenrePageProps) {
    const { slug } = await params;
    const movies = await getMoviesByGenre(slug);

    // Format title: "k-drama" -> "K Drama"
    const title = slug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());

    return <GenreClient title={title} movies={movies} />;
}
