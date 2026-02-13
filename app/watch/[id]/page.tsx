"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Play, Info, Share2, Plus } from "lucide-react";
import { use, useState, useEffect } from "react";
import { getAllMovies, Movie } from "@/app/lib/movies";

interface WatchPageProps {
    params: Promise<{ id: string }>;
}

export default function WatchPage({ params }: WatchPageProps) {
    const { id } = use(params);
    const searchParams = useSearchParams();
    const epParam = searchParams.get('ep');
    const currentEpNumber = epParam ? parseInt(epParam, 10) : 1;

    const [movie, setMovie] = useState<Movie | null>(null);

    useEffect(() => {
        async function fetchMovie() {
            const movies = await getAllMovies();
            const found = movies.find((m: Movie) => m._id === id);
            if (found) {
                setMovie(found);
            }
        }
        fetchMovie();
    }, [id]);

    const isSeries = movie?.type === 'series';
    const currentEpisode = isSeries
        ? movie?.episodes?.find(e => e.episode_number === currentEpNumber)
        : null;

    const displayTitle = isSeries && currentEpisode
        ? `${movie?.title}: ${currentEpisode.title}`
        : (movie ? movie.title : id);

    const displayYear = movie ? movie.year : "";
    const displayGenre = movie ? movie.genre?.join(" / ") : "";

    // Construct Player URL
    // Movie: vidsrc.xyz/embed/movie/{id}
    // Series: vidsrc.xyz/embed/tv/{id}/1/{ep} (Assuming Season 1 for now)

    // Logic:
    // 1. If it's a Series -> vidsrc TV
    // 2. If it's a numeric ID -> vidsrc Movie (Standard TMDB)
    // 3. Fallback -> Try to treat as YouTube only if it looks like a YouTube ID, otherwise error/placeholder.
    const playerUrl = isSeries
        ? `https://vidsrc.xyz/embed/tv/${id}/1/${currentEpNumber}`
        : (id.match(/^\d+$/) ? `https://vidsrc.xyz/embed/movie/${id}` : `https://www.youtube.com/embed/${id}?autoplay=1`);

    return (
        <main className="min-h-screen bg-[#09090b] text-white">
            {/* Back Button */}
            <Link href="/" className="fixed top-24 left-6 z-50 p-3 bg-black/50 backdrop-blur-md rounded-full hover:bg-white/20 transition-colors">
                <ArrowLeft size={24} />
            </Link>

            {/* Cinema Mode Player */}
            <div className="relative w-full h-[60vh] md:h-[85vh] lg:h-[90vh] bg-black shadow-2xl shadow-purple-900/20">
                <iframe
                    key={playerUrl} // Force reload on URL change
                    width="100%"
                    height="100%"
                    src={playerUrl}
                    title="Player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    className="w-full h-full object-contain"
                    allowFullScreen
                />
            </div>

            {/* Details Section */}
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="flex flex-col gap-8">
                    {/* Header Info */}
                    <div className="space-y-4">
                        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-2">
                            {movie?.title || "Loading..."}
                            {isSeries && <span className="text-zinc-500 font-normal text-2xl ml-2">S1:E{currentEpNumber}</span>}
                        </h1>
                        <h2 className="text-xl text-purple-400 font-medium">
                            {currentEpisode?.title}
                        </h2>

                        <div className="flex items-center gap-4 text-sm font-medium text-gray-400">
                            <span className="px-2 py-0.5 rounded bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">
                                IMDb {movie?.vote || "N/A"}
                            </span>
                            <span>{displayYear}</span>
                            <span>•</span>
                            <span className="capitalize">{displayGenre}</span>
                        </div>
                    </div>

                    {/* Episode List (For Series) */}
                    {isSeries && movie?.episodes && (
                        <div className="bg-zinc-900/50 rounded-2xl p-6 border border-white/5">
                            <h3 className="text-xl font-semibold mb-4 text-zinc-200">Episodes</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {movie.episodes.map((ep) => (
                                    <Link
                                        key={ep.episode_number}
                                        href={`/watch/${id}?ep=${ep.episode_number}`}
                                        className={`flex items-center gap-4 p-3 rounded-lg transition-all ${currentEpNumber === ep.episode_number
                                            ? 'bg-purple-600/20 border border-purple-500/50'
                                            : 'hover:bg-white/5 border border-transparent'
                                            }`}
                                    >
                                        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-white/10 text-sm font-bold">
                                            {ep.episode_number}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-sm font-medium truncate ${currentEpNumber === ep.episode_number ? 'text-purple-300' : 'text-zinc-300'}`}>
                                                {ep.title}
                                            </p>
                                        </div>
                                        {currentEpNumber === ep.episode_number && (
                                            <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                                        )}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Description */}
                    <div className="max-w-3xl text-gray-400 text-lg leading-relaxed mt-4">
                        <p>
                            Experience the ultimate cinematic journey. This title is optimized for NontonYuk streaming.
                            Join millions of viewers watching premium content instantly.
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );

}
