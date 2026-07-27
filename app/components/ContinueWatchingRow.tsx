"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Play, Clock, X, ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { useHistory } from "@/app/context/history-context";
import { Movie } from "@/app/lib/movies";
import { useToast } from "@/app/context/toast-context";

interface ContinueWatchingRowProps {
    onOpenModal?: (movie: Movie) => void;
}

export function ContinueWatchingRow({ onOpenModal }: ContinueWatchingRowProps) {
    const { history, removeFromHistory, clearHistory } = useHistory();
    const { showToast } = useToast();
    const rowRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: "left" | "right") => {
        if (rowRef.current) {
            const { current } = rowRef;
            const scrollAmount = direction === "left" ? -window.innerWidth / 2 : window.innerWidth / 2;
            current.scrollBy({ left: scrollAmount, behavior: "smooth" });
        }
    };

    const handleClearHistory = () => {
        clearHistory();
        showToast("Riwayat menonton berhasil dibersihkan", "info");
    };

    const handleRemoveItem = (movieId: string, title: string) => {
        removeFromHistory(movieId);
        showToast(`"${title}" dihapus dari riwayat`, "info");
    };

    if (!history || history.length === 0) return null;

    return (
        <div className="space-y-4 mb-10 group relative">
            <div className="flex items-center justify-between pl-4 md:pl-12 pr-4 md:pr-12">
                <div className="flex items-center gap-2">
                    <Clock size={22} className="text-purple-400" />
                    <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                        Lanjutkan Nonton
                    </h2>
                </div>
                <button
                    onClick={handleClearHistory}
                    className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-rose-450 transition-colors px-2.5 py-1 rounded-md bg-white/5 border border-white/5 cursor-pointer"
                    title="Bersihkan Riwayat"
                >
                    <RotateCcw size={12} />
                    Bersihkan
                </button>
            </div>

            <div className="group relative md:-ml-2">
                <ChevronLeft
                    className="absolute top-0 bottom-0 left-2 z-40 m-auto h-9 w-9 cursor-pointer opacity-0 transition hover:scale-125 group-hover:opacity-100 hidden md:block text-white bg-black/60 rounded-full p-1 border border-white/20"
                    onClick={() => scroll("left")}
                />

                <div
                    ref={rowRef}
                    className="flex items-center space-x-4 overflow-x-scroll scrollbar-hide md:p-2 pl-4 md:pl-12 py-2"
                >
                    {history.map((item) => {
                        const movie = item.movie;
                        const watchUrl = `/watch/${movie._id}${item.episodeNumber ? `?ep=${item.episodeNumber}` : ""
                            }`;

                        return (
                            <motion.div
                                key={item.movieId}
                                whileHover={{ scale: 1.03 }}
                                className="relative min-w-[200px] sm:min-w-[240px] md:min-w-[260px] bg-zinc-900/90 border border-white/10 rounded-xl overflow-hidden shrink-0 shadow-lg group/card"
                            >
                                {/* Thumbnail Image Header */}
                                <div className="relative aspect-[16/9] w-full bg-zinc-950 overflow-hidden">
                                    <Image
                                        src={movie.poster}
                                        alt={movie.title}
                                        fill
                                        className="object-cover object-top opacity-80 group-hover/card:scale-105 transition-transform duration-300"
                                        sizes="300px"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-black/40" />

                                    {/* Play Action Button */}
                                    <Link
                                        href={watchUrl}
                                        className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover/card:opacity-100 transition-opacity"
                                    >
                                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-600 text-white shadow-lg shadow-purple-600/40">
                                            <Play className="fill-white ml-0.5" size={20} />
                                        </div>
                                    </Link>

                                    {/* Remove Item Button */}
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            handleRemoveItem(item.movieId, movie.title);
                                        }}
                                        className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white/70 hover:text-white hover:bg-rose-600 transition-colors z-20"
                                        title="Hapus dari riwayat"
                                    >
                                        <X size={14} />
                                    </button>

                                    {/* Episode / Type Tag */}
                                    {item.episodeNumber && (
                                        <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-purple-600/90 text-white text-[11px] font-semibold backdrop-blur-md">
                                            Ep {item.episodeNumber}
                                        </span>
                                    )}
                                </div>

                                {/* Content Details Footer */}
                                <div className="p-3 space-y-2">
                                    <Link href={watchUrl} className="block">
                                        <h3 className="text-sm font-bold text-white line-clamp-1 group-hover/card:text-purple-300 transition-colors">
                                            {movie.title}
                                        </h3>
                                    </Link>

                                    {/* Progress Line */}
                                    <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                                        <div className="bg-purple-500 h-full w-[70%] rounded-full animate-pulse" />
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                <ChevronRight
                    className="absolute top-0 bottom-0 right-2 z-40 m-auto h-9 w-9 cursor-pointer opacity-0 transition hover:scale-125 group-hover:opacity-100 hidden md:block text-white bg-black/60 rounded-full p-1 border border-white/20"
                    onClick={() => scroll("right")}
                />
            </div>
        </div>
    );
}
