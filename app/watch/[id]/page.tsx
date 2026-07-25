"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Play, Info, Share2, Plus, Server, AlertCircle } from "lucide-react";
import { use, useState, useEffect } from "react";
import { getAllMovies, Movie } from "@/app/lib/movies";
import { useHistory } from "@/app/context/history-context";

interface WatchPageProps {
    params: Promise<{ id: string }>;
}

type ServerType = "vidsrc" | "superembed" | "embedsu";

export default function WatchPage({ params }: WatchPageProps) {
    const { id } = use(params);
    const searchParams = useSearchParams();
    const epParam = searchParams.get("ep");
    const currentEpNumber = epParam ? parseInt(epParam, 10) : 1;

    const [movie, setMovie] = useState<Movie | null>(null);
    const [activeServer, setActiveServer] = useState<ServerType>("vidsrc");
    const { addOrUpdateHistory } = useHistory();

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

    const isSeries = movie?.type === "series";
    const currentEpisode = isSeries
        ? movie?.episodes?.find((e) => e.episode_number === currentEpNumber)
        : null;

    // Record history
    useEffect(() => {
        if (movie) {
            addOrUpdateHistory(movie, isSeries ? currentEpNumber : undefined);
        }
    }, [movie, currentEpNumber, isSeries]);

    const displayYear = movie ? movie.year : "";
    const displayGenre = movie ? movie.genre?.join(" / ") : "";

    // Multi-server URL templates
    const getPlayerUrl = (server: ServerType): string => {
        if (isSeries) {
            switch (server) {
                case "superembed":
                    return `https://multiembed.to/embed.php?tmdb=1&id=${id}&s=1&e=${currentEpNumber}`;
                case "embedsu":
                    return `https://embed.su/embed/tv/${id}/1/${currentEpNumber}`;
                case "vidsrc":
                default:
                    return `https://vidsrc.xyz/embed/tv/${id}/1/${currentEpNumber}`;
            }
        } else {
            // Movie / Custom YouTube Fallback
            const isNumericId = id.match(/^\d+$/);
            if (!isNumericId) {
                return `https://www.youtube.com/embed/${id}?autoplay=1`;
            }

            switch (server) {
                case "superembed":
                    return `https://multiembed.to/embed.php?tmdb=1&id=${id}`;
                case "embedsu":
                    return `https://embed.su/embed/movie/${id}`;
                case "vidsrc":
                default:
                    return `https://vidsrc.xyz/embed/movie/${id}`;
            }
        }
    };

    const playerUrl = getPlayerUrl(activeServer);

    return (
        <main className="min-h-screen bg-[#09090b] text-white">
            {/* Back Button */}
            <Link
                href="/"
                className="fixed top-24 left-6 z-50 p-3 bg-black/50 backdrop-blur-md rounded-full hover:bg-white/20 transition-colors border border-white/10"
            >
                <ArrowLeft size={24} />
            </Link>

            {/* Cinema Mode Player */}
            <div className="relative w-full h-[60vh] md:h-[85vh] lg:h-[90vh] bg-black shadow-2xl shadow-purple-900/20">
                <iframe
                    key={playerUrl}
                    width="100%"
                    height="100%"
                    src={playerUrl}
                    title="Player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    className="w-full h-full object-contain"
                    allowFullScreen
                />
            </div>

            {/* Details Section & Server Switcher */}
            <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
                {/* Server Switcher Panel */}
                <div className="bg-zinc-900/40 border border-white/5 rounded-2xl p-5 md:p-6 space-y-4 shadow-xl">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                            <Server size={20} className="text-purple-400" />
                            <h3 className="text-lg font-bold text-zinc-100">
                                Pilih Server Pemutaran
                            </h3>
                        </div>
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-zinc-400 bg-white/5 px-2.5 py-1 rounded-md border border-white/5">
                            <AlertCircle size={12} className="text-zinc-500" />
                            Pilih server alternatif jika video lambat/error.
                        </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <button
                            onClick={() => setActiveServer("vidsrc")}
                            className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border text-sm font-semibold transition-all ${activeServer === "vidsrc"
                                    ? "bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-600/25"
                                    : "bg-white/5 border-white/5 text-zinc-300 hover:bg-white/10 hover:text-white"
                                }`}
                        >
                            <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse shrink-0" />
                            Server 1 (VidSrc)
                            <span className="text-[10px] opacity-75 font-normal ml-1">Recomended</span>
                        </button>

                        <button
                            onClick={() => setActiveServer("superembed")}
                            className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border text-sm font-semibold transition-all ${activeServer === "superembed"
                                    ? "bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-600/25"
                                    : "bg-white/5 border-white/5 text-zinc-300 hover:bg-white/10 hover:text-white"
                                }`}
                        >
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0" />
                            Server 2 (SuperEmbed)
                            <span className="text-[10px] opacity-75 font-normal ml-1">Alternatif</span>
                        </button>

                        <button
                            onClick={() => setActiveServer("embedsu")}
                            className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border text-sm font-semibold transition-all ${activeServer === "embedsu"
                                    ? "bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-600/25"
                                    : "bg-white/5 border-white/5 text-zinc-300 hover:bg-white/10 hover:text-white"
                                }`}
                        >
                            <span className="w-2.5 h-2.5 rounded-full bg-sky-400 shrink-0" />
                            Server 3 (EmbedSu)
                            <span className="text-[10px] opacity-75 font-normal ml-1">Mirror</span>
                        </button>
                    </div>
                </div>

                {/* Details Section */}
                <div className="flex flex-col gap-8">
                    {/* Header Info */}
                    <div className="space-y-4">
                        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-2">
                            {movie?.title || "Loading..."}
                            {isSeries && (
                                <span className="text-purple-400 font-normal text-2xl ml-3">
                                    Episode {currentEpNumber}
                                </span>
                            )}
                        </h1>
                        {currentEpisode?.title && (
                            <h2 className="text-xl text-purple-300 font-medium">
                                {currentEpisode.title}
                            </h2>
                        )}

                        <div className="flex items-center gap-4 text-sm font-medium text-gray-400">
                            <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                IMDb {movie?.vote || "N/A"}
                            </span>
                            <span>{displayYear}</span>
                            <span>•</span>
                            <span className="capitalize">{displayGenre}</span>
                        </div>
                    </div>

                    {/* Episode List (For Series) */}
                    {isSeries && movie?.episodes && (
                        <div className="bg-zinc-900/50 rounded-2xl p-6 border border-white/10">
                            <h3 className="text-xl font-bold mb-4 text-zinc-200">Daftar Episode</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {movie.episodes.map((ep) => (
                                    <Link
                                        key={ep.episode_number}
                                        href={`/watch/${id}?ep=${ep.episode_number}`}
                                        className={`flex items-center gap-4 p-3 rounded-xl transition-all ${currentEpNumber === ep.episode_number
                                                ? "bg-purple-600/30 border border-purple-500/60 shadow-lg shadow-purple-600/10"
                                                : "hover:bg-white/5 border border-white/5"
                                            }`}
                                    >
                                        <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-purple-600/30 text-purple-300 text-sm font-bold">
                                            {ep.episode_number}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p
                                                className={`text-sm font-semibold truncate ${currentEpNumber === ep.episode_number
                                                        ? "text-purple-300"
                                                        : "text-zinc-300"
                                                    }`}
                                            >
                                                {ep.title}
                                            </p>
                                        </div>
                                        {currentEpNumber === ep.episode_number && (
                                            <div className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-pulse" />
                                        )}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Description */}
                    <div className="max-w-3xl text-gray-300 text-base leading-relaxed mt-2">
                        <p>
                            Nikmati pengalaman menonton sinematik resolusi tinggi di NontonYuk.
                            Disajikan khusus untuk para penggemar film, anime, dan serial pilihan.
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}
