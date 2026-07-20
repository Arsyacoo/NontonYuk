"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, Play, Plus, Check, Star, Calendar, Film, Tv } from "lucide-react";
import { Movie } from "@/app/lib/movies";
import { useWatchlist } from "@/app/context/watchlist-context";

interface MovieModalProps {
    movie: Movie | null;
    onClose: () => void;
}

export function MovieModal({ movie, onClose }: MovieModalProps) {
    const { isBookmarked, toggleWatchlist } = useWatchlist();

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose();
            }
        };
        if (movie) {
            document.body.style.overflow = "hidden";
            window.addEventListener("keydown", handleKeyDown);
        }
        return () => {
            document.body.style.overflow = "unset";
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [movie, onClose]);

    if (!movie) return null;

    const bookmarked = isBookmarked(movie._id);
    const isSeries = movie.type === "series";

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6 md:p-10 overflow-y-auto">
                {/* Backdrop Overlay */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm"
                />

                {/* Modal Window */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    transition={{ type: "spring", duration: 0.4 }}
                    className="relative w-full max-w-3xl bg-[#121216] border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-10 my-auto max-h-[90vh] flex flex-col"
                >
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 text-white/80 hover:text-white hover:bg-black/90 transition-colors"
                        aria-label="Close modal"
                    >
                        <X size={20} />
                    </button>

                    {/* Banner Image / Backdrop Header */}
                    <div className="relative h-64 sm:h-80 w-full overflow-hidden shrink-0 bg-zinc-900">
                        <Image
                            src={movie.poster}
                            alt={movie.title}
                            fill
                            className="object-cover object-top opacity-75"
                            sizes="(max-width: 768px) 100vw, 800px"
                            quality={85}
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#121216] via-[#121216]/40 to-transparent" />

                        {/* Title & Category Badges in Banner */}
                        <div className="absolute bottom-4 left-6 right-6 flex flex-col gap-2">
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-600/80 text-purple-100 backdrop-blur-md uppercase tracking-wider">
                                    {isSeries ? <Tv size={12} /> : <Film size={12} />}
                                    {movie.type || "movie"}
                                </span>
                                {movie.vote && (
                                    <span className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 backdrop-blur-md">
                                        <Star size={12} className="fill-amber-400 text-amber-400" />
                                        IMDb {movie.vote}
                                    </span>
                                )}
                                <span className="flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-white/10 text-zinc-300 backdrop-blur-md">
                                    <Calendar size={12} />
                                    {movie.year}
                                </span>
                            </div>

                            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight drop-shadow-md">
                                {movie.title}
                            </h2>
                        </div>
                    </div>

                    {/* Content Body */}
                    <div className="p-6 overflow-y-auto space-y-6 flex-1">
                        {/* Quick Action Buttons */}
                        <div className="flex flex-wrap items-center gap-3">
                            <Link
                                href={`/watch/${movie._id}`}
                                onClick={onClose}
                                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-purple-600 text-white font-semibold hover:bg-purple-500 transition-colors shadow-lg shadow-purple-600/30"
                            >
                                <Play size={20} className="fill-white" />
                                Tonton Sekarang
                            </Link>

                            <button
                                onClick={() => toggleWatchlist(movie)}
                                className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl border text-sm font-semibold transition-all ${bookmarked
                                        ? "bg-purple-950/40 border-purple-500/50 text-purple-300"
                                        : "bg-white/10 border-white/10 text-white hover:bg-white/20"
                                    }`}
                            >
                                {bookmarked ? <Check size={18} className="text-purple-400" /> : <Plus size={18} />}
                                {bookmarked ? "Tersimpan di Daftarku" : "Tambah ke Daftarku"}
                            </button>
                        </div>

                        {/* Genres */}
                        {movie.genre && movie.genre.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {movie.genre.map((g) => (
                                    <span
                                        key={g}
                                        className="text-xs font-medium px-3 py-1 rounded-md bg-white/5 border border-white/10 text-zinc-400 capitalize"
                                    >
                                        {g}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Overview / Description */}
                        <div className="space-y-2">
                            <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Sinopsis</h3>
                            <p className="text-zinc-300 text-sm leading-relaxed">
                                {movie.title} ({movie.year}) menyajikan pengalaman tayangan sinematik terbaik dengan kualitas tinggi. Tonton petualangan dan kisah serunya secara langsung di NontonYuk.
                            </p>
                        </div>

                        {/* Episode List if Series */}
                        {isSeries && movie.episodes && movie.episodes.length > 0 && (
                            <div className="space-y-3 pt-2 border-t border-white/10">
                                <h3 className="text-base font-bold text-white flex items-center justify-between">
                                    <span>Daftar Episode</span>
                                    <span className="text-xs font-normal text-purple-400">
                                        {movie.episodes.length} Episode
                                    </span>
                                </h3>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                                    {movie.episodes.map((ep) => (
                                        <Link
                                            key={ep.id}
                                            href={`/watch/${movie._id}?ep=${ep.episode_number}`}
                                            onClick={onClose}
                                            className="flex items-center gap-3 p-2.5 rounded-lg bg-white/5 hover:bg-purple-600/20 border border-white/5 hover:border-purple-500/40 transition-colors group"
                                        >
                                            <div className="flex items-center justify-center w-7 h-7 rounded-md bg-purple-600/30 text-purple-300 font-bold text-xs group-hover:bg-purple-600 group-hover:text-white transition-colors">
                                                {ep.episode_number}
                                            </div>
                                            <span className="text-xs text-zinc-300 group-hover:text-white truncate">
                                                {ep.title}
                                            </span>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
