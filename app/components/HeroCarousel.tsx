"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Info, Plus, Check, ChevronLeft, ChevronRight, Star, Sparkles } from "lucide-react";
import { Movie } from "@/app/lib/movies";
import { useWatchlist } from "@/app/context/watchlist-context";

interface HeroCarouselProps {
    movies: Movie[];
    onOpenModal: (movie: Movie) => void;
}

export function HeroCarousel({ movies, onOpenModal }: HeroCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const { isBookmarked, toggleWatchlist } = useWatchlist();

    const featuredMovies = movies.length > 0 ? movies.slice(0, 5) : [];

    // Auto-advance slide every 6s unless paused
    useEffect(() => {
        if (featuredMovies.length <= 1 || isPaused) return;
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % featuredMovies.length);
        }, 6000);
        return () => clearInterval(timer);
    }, [featuredMovies.length, isPaused]);

    if (featuredMovies.length === 0) return null;

    const currentMovie = featuredMovies[currentIndex];
    const bookmarked = isBookmarked(currentMovie._id);

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % featuredMovies.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev - 1 + featuredMovies.length) % featuredMovies.length);
    };

    return (
        <div
            className="relative h-[70vh] md:h-[85vh] w-full overflow-hidden mb-8 group bg-[#09090b]"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            {/* Background Slides */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentMovie._id}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    className="absolute inset-0"
                >
                    <Image
                        src={currentMovie.poster}
                        alt={currentMovie.title}
                        fill
                        priority
                        className="object-cover object-top opacity-50 filter blur-[1px] md:blur-none"
                        quality={90}
                    />
                </motion.div>
            </AnimatePresence>

            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/40 to-transparent z-10" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#09090b] via-[#09090b]/60 to-transparent z-10" />

            {/* Banner Main Content */}
            <div className="relative z-20 flex h-full flex-col justify-center px-6 md:px-16 pt-20 max-w-4xl">
                <motion.div
                    key={`content-${currentMovie._id}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="space-y-4"
                >
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-3.5 py-1 text-xs font-semibold text-purple-300 backdrop-blur-md">
                        <Sparkles size={14} className="text-purple-400 animate-pulse" />
                        <span># Trending #{currentIndex + 1} Hari Ini</span>
                    </div>

                    {/* Title */}
                    <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white drop-shadow-2xl line-clamp-2">
                        {currentMovie.title}
                    </h1>

                    {/* Meta Info */}
                    <div className="flex items-center gap-3 text-sm font-medium text-zinc-300">
                        {currentMovie.vote && (
                            <span className="flex items-center gap-1 font-bold text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded border border-amber-400/20">
                                <Star size={14} className="fill-amber-400" />
                                IMDb {currentMovie.vote}
                            </span>
                        )}
                        <span>{currentMovie.year}</span>
                        {currentMovie.genre && currentMovie.genre.length > 0 && (
                            <>
                                <span>•</span>
                                <span className="capitalize text-zinc-400">
                                    {currentMovie.genre.slice(0, 3).join(", ")}
                                </span>
                            </>
                        )}
                    </div>

                    {/* Subtitle / Description */}
                    <p className="text-sm md:text-base text-zinc-300 max-w-xl line-clamp-3 leading-relaxed font-normal drop-shadow">
                        Saksikan keseruan petualangan dan momen epik dari {currentMovie.title}. Nikmati pengalaman streaming cinema tanpa gangguan.
                    </p>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3 pt-2">
                        <Link
                            href={`/watch/${currentMovie._id}`}
                            className="flex items-center gap-2 rounded-xl bg-white text-black px-6 py-3 font-bold text-base hover:bg-zinc-200 transition-transform active:scale-95 shadow-lg shadow-white/10"
                        >
                            <Play className="fill-black" size={20} /> Putar Sekarang
                        </Link>

                        <button
                            onClick={() => onOpenModal(currentMovie)}
                            className="flex items-center gap-2 rounded-xl bg-zinc-800/80 text-white px-6 py-3 font-semibold text-base hover:bg-zinc-700 transition-colors backdrop-blur-sm border border-white/10"
                        >
                            <Info size={20} /> Info Selengkapnya
                        </button>

                        <button
                            onClick={() => toggleWatchlist(currentMovie)}
                            className={`flex items-center justify-center p-3 rounded-xl border transition-all ${bookmarked
                                    ? "bg-purple-600/30 border-purple-500/60 text-purple-300"
                                    : "bg-white/10 border-white/10 text-white hover:bg-white/20"
                                }`}
                            title={bookmarked ? "Hapus dari Daftarku" : "Tambah ke Daftarku"}
                        >
                            {bookmarked ? <Check size={20} className="text-purple-400" /> : <Plus size={20} />}
                        </button>
                    </div>
                </motion.div>
            </div>

            {/* Slider Navigation Arrows */}
            <button
                onClick={handlePrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-black/40 text-white/80 opacity-0 group-hover:opacity-100 hover:bg-black/70 transition-all hidden md:flex"
                aria-label="Previous slide"
            >
                <ChevronLeft size={24} />
            </button>
            <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-black/40 text-white/80 opacity-0 group-hover:opacity-100 hover:bg-black/70 transition-all hidden md:flex"
                aria-label="Next slide"
            >
                <ChevronRight size={24} />
            </button>

            {/* Pagination Indicators */}
            <div className="absolute bottom-6 right-6 md:right-16 z-30 flex items-center gap-2">
                {featuredMovies.map((m, idx) => (
                    <button
                        key={m._id}
                        onClick={() => setCurrentIndex(idx)}
                        className={`h-2 rounded-full transition-all duration-300 ${idx === currentIndex ? "w-8 bg-purple-500" : "w-2 bg-white/30 hover:bg-white/60"
                            }`}
                        aria-label={`Go to slide ${idx + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}
