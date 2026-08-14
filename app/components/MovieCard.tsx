"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Eye, Star, Plus, Check, Film, Volume2, Sparkles } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Movie } from "@/app/lib/movies";
import { useWatchlist } from "@/app/context/watchlist-context";
import { useLanguage } from "@/app/context/language-context";

interface MovieCardProps {
    id: string;
    title: string;
    year: string | number;
    rating?: number;
    posterUrl: string;
    movie?: Movie;
    onOpenModal?: (movie: Movie) => void;
}

export function MovieCard({ id, title, year, rating, posterUrl, movie, onOpenModal }: MovieCardProps) {
    const [isHovered, setIsHovered] = useState(false);
    const [isPreviewActive, setIsPreviewActive] = useState(false);
    const [imgSrc, setImgSrc] = useState(posterUrl);
    const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const { isBookmarked, toggleWatchlist } = useWatchlist();
    const { locale } = useLanguage();

    const bookmarked = isBookmarked(id);

    const fullMovie: Movie = movie || {
        _id: id,
        title,
        year: String(year),
        vote: rating,
        poster: posterUrl,
    };

    const trailerId = fullMovie.trailer;

    // Handle mouse enter with 650ms debounce for preview trigger
    const handleMouseEnter = () => {
        setIsHovered(true);
        hoverTimeoutRef.current = setTimeout(() => {
            setIsPreviewActive(true);
        }, 650);
    };

    // Handle mouse leave to cancel preview
    const handleMouseLeave = () => {
        setIsHovered(false);
        setIsPreviewActive(false);
        if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current);
            hoverTimeoutRef.current = null;
        }
    };

    useEffect(() => {
        return () => {
            if (hoverTimeoutRef.current) {
                clearTimeout(hoverTimeoutRef.current);
            }
        };
    }, []);

    const handleQuickView = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (onOpenModal) {
            onOpenModal(fullMovie);
        }
    };

    const handleBookmark = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        toggleWatchlist(fullMovie);
    };

    return (
        <div
            className="block h-full relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* Standard Base Card */}
            <div className="group relative flex flex-col gap-2.5 cursor-pointer h-full">
                <div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl border border-white/10 bg-zinc-900 shadow-lg transition-all duration-300 group-hover:shadow-[0_0_25px_rgba(168,85,247,0.3)] group-hover:border-purple-500/50 shimmer-sweep">
                    <Image
                        src={imgSrc}
                        alt={title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 16vw"
                        quality={75}
                        onError={() => setImgSrc("https://placehold.co/400x600/18181b/ffffff/png?text=No+Poster")}
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                    {/* Bookmark Quick Button on Top Left */}
                    <button
                        onClick={handleBookmark}
                        className={`absolute top-2 left-2 z-20 flex h-8 w-8 items-center justify-center rounded-full border transition-all ${
                            bookmarked
                                ? "bg-purple-600 border-purple-400 text-white shadow-md shadow-purple-600/40"
                                : "bg-black/60 border-white/20 text-white/80 opacity-0 group-hover:opacity-100 hover:bg-black/90"
                        }`}
                        title={bookmarked ? (locale === "id" ? "Hapus dari Daftarku" : "Remove from Watchlist") : (locale === "id" ? "Tambah ke Daftarku" : "Add to Watchlist")}
                    >
                        {bookmarked ? <Check size={14} /> : <Plus size={14} />}
                    </button>

                    {/* Rating Badge */}
                    {rating && (
                        <div className="absolute top-2 right-2 flex items-center gap-1 rounded-md border border-white/10 bg-black/70 px-1.5 py-0.5 text-[11px] font-bold backdrop-blur-md text-amber-400">
                            <Star size={10} className="fill-amber-400" />
                            {rating}
                        </div>
                    )}

                    {/* Trailer Indicator Pill */}
                    {trailerId && (
                        <div className="absolute bottom-2 left-2 flex items-center gap-1 rounded-md border border-purple-500/30 bg-purple-950/80 px-1.5 py-0.5 text-[10px] font-semibold text-purple-300 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity">
                            <Film size={10} />
                            <span>Trailer Preview</span>
                        </div>
                    )}
                </div>

                <div className="space-y-0.5 px-0.5">
                    <Link href={`/watch/${id}`}>
                        <h3 className="line-clamp-1 text-sm md:text-base font-semibold text-zinc-100 group-hover:text-purple-300 transition-colors">
                            {title}
                        </h3>
                    </Link>
                    <div className="flex items-center justify-between text-xs text-zinc-500">
                        <span>{year}</span>
                        {fullMovie.type === "series" && (
                            <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider bg-purple-950/40 border border-purple-500/30 px-1.5 py-0.2 rounded">
                                Series
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Netflix-Style Expandable Trailer Preview Popup on Hover */}
            <AnimatePresence>
                {isPreviewActive && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -5 }}
                        animate={{ opacity: 1, scale: 1.15, y: -18 }}
                        exit={{ opacity: 0, scale: 0.95, y: -5 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        className="absolute -top-3 -left-3 -right-3 z-[60] overflow-hidden rounded-2xl border border-purple-500/50 bg-[#121217] shadow-2xl shadow-purple-950/80 pointer-events-auto"
                    >
                        {/* Video / Poster Header */}
                        <div className="relative aspect-video w-full overflow-hidden bg-black">
                            {trailerId ? (
                                <iframe
                                    src={`https://www.youtube-nocookie.com/embed/${trailerId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${trailerId}&modestbranding=1&rel=0&showinfo=0`}
                                    title={title}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    className="w-full h-full object-cover scale-110 pointer-events-none"
                                />
                            ) : (
                                <Image
                                    src={imgSrc}
                                    alt={title}
                                    fill
                                    className="object-cover"
                                    quality={80}
                                />
                            )}

                            <div className="absolute inset-0 bg-gradient-to-t from-[#121217] via-transparent to-black/40 pointer-events-none" />

                            {/* Audio muted indicator */}
                            {trailerId && (
                                <div className="absolute bottom-2 right-2 rounded-full bg-black/70 p-1.5 text-zinc-400 backdrop-blur-md">
                                    <Volume2 size={12} />
                                </div>
                            )}
                        </div>

                        {/* Content & Action Bar */}
                        <div className="p-3.5 space-y-3">
                            {/* Action Buttons Row */}
                            <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                    <Link href={`/watch/${id}`}>
                                        <motion.button
                                            whileHover={{ scale: 1.08 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-600 text-white shadow-lg shadow-purple-600/40 hover:bg-purple-500 transition-colors cursor-pointer"
                                            title={locale === "id" ? "Tonton Sekarang" : "Play Now"}
                                        >
                                            <Play className="fill-white ml-0.5" size={16} />
                                        </motion.button>
                                    </Link>

                                    <motion.button
                                        whileHover={{ scale: 1.08 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleBookmark}
                                        className={`flex h-9 w-9 items-center justify-center rounded-full border transition-all cursor-pointer ${
                                            bookmarked
                                                ? "bg-purple-600/30 border-purple-500 text-purple-300"
                                                : "bg-white/10 border-white/20 text-white hover:bg-white/20"
                                        }`}
                                        title={bookmarked ? (locale === "id" ? "Di Daftarku" : "In Watchlist") : (locale === "id" ? "Tambah ke Daftarku" : "Add to Watchlist")}
                                    >
                                        {bookmarked ? <Check size={16} /> : <Plus size={16} />}
                                    </motion.button>
                                </div>

                                {onOpenModal && (
                                    <motion.button
                                        whileHover={{ scale: 1.08 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleQuickView}
                                        className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer"
                                        title={locale === "id" ? "Info Selengkapnya" : "More Info"}
                                    >
                                        <Eye size={16} />
                                    </motion.button>
                                )}
                            </div>

                            {/* Title & Metadata */}
                            <div className="space-y-1">
                                <h4 className="font-bold text-white text-xs leading-snug line-clamp-1">
                                    {title}
                                </h4>
                                <div className="flex items-center gap-2 text-[11px] text-zinc-400 font-medium">
                                    {rating && (
                                        <span className="flex items-center gap-0.5 text-amber-400 font-bold">
                                            <Star size={10} className="fill-amber-400" />
                                            {rating}
                                        </span>
                                    )}
                                    <span>{year}</span>
                                    {fullMovie.genre && fullMovie.genre.length > 0 && (
                                        <>
                                            <span>•</span>
                                            <span className="text-purple-300 capitalize truncate max-w-[90px]">
                                                {fullMovie.genre[0]}
                                            </span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
