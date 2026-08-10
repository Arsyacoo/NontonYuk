"use client";

import { useState } from "react";
import Link from "next/link";
import { Bookmark, Film, Trash2, ArrowLeft } from "lucide-react";
import { useWatchlist } from "@/app/context/watchlist-context";
import { MovieCard } from "@/app/components/MovieCard";
import { MovieModal } from "@/app/components/MovieModal";
import { Movie } from "@/app/lib/movies";
import { useLanguage } from "@/app/context/language-context";

export default function WatchlistPage() {
    const { watchlist, removeFromWatchlist } = useWatchlist();
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
    const { t } = useLanguage();

    return (
        <main className="min-h-screen bg-[#09090b] text-white pt-28 pb-20 px-4 md:px-12">
            {/* Header */}
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center p-2.5 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30">
                                <Bookmark size={24} />
                            </div>
                            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white">
                                {t("watchlist.title")}
                            </h1>
                        </div>
                        <p className="text-zinc-400 text-sm md:text-base">
                            {t("watchlist.subtitle")}
                        </p>
                    </div>

                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-medium text-zinc-300 transition-colors"
                    >
                        <ArrowLeft size={16} />
                        {t("watchlist.back_home")}
                    </Link>
                </div>

                {/* Content Grid or Empty State */}
                {watchlist.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center space-y-5 bg-zinc-900/30 rounded-3xl border border-white/5 my-8">
                        <div className="flex items-center justify-center w-20 h-20 rounded-full bg-purple-600/10 text-purple-400 border border-purple-500/20">
                            <Film size={36} />
                        </div>
                        <div className="space-y-2 max-w-md">
                            <h3 className="text-2xl font-bold text-white">{t("watchlist.empty_title")}</h3>
                            <p className="text-zinc-400 text-sm leading-relaxed">
                                {t("watchlist.empty_desc")}
                            </p>
                        </div>
                        <Link
                            href="/"
                            className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold shadow-lg shadow-purple-600/30 transition-all cursor-pointer"
                        >
                            {t("watchlist.empty_btn")}
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4 pt-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-zinc-400">
                                {t("watchlist.show_count", { count: watchlist.length })}
                            </span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                            {watchlist.map((movie) => (
                                <div key={movie._id} className="relative group animate-fade-in">
                                    <MovieCard
                                        id={movie._id}
                                        title={movie.title}
                                        year={movie.year}
                                        rating={movie.vote}
                                        posterUrl={movie.poster}
                                        movie={movie}
                                        onOpenModal={(m) => setSelectedMovie(m)}
                                    />
                                    {/* Hapus Button */}
                                    <button
                                        onClick={() => removeFromWatchlist(movie._id)}
                                        className="absolute -top-2 -right-2 z-30 flex items-center justify-center p-2 rounded-full bg-rose-600 hover:bg-rose-500 text-white shadow-lg transition-transform hover:scale-110 cursor-pointer"
                                        title={t("card.toast.remove_watchlist")}
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Quick Preview Modal */}
            <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
        </main>
    );
}
