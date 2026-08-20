"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Eye, Star, Plus, Check, Film, Volume2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Movie } from "@/app/lib/movies";
import { useWatchlist } from "@/app/context/watchlist-context";
import { useLanguage } from "@/app/context/language-context";

interface Top10CardProps {
    rank: number;
    movie: Movie;
    onOpenModal?: (movie: Movie) => void;
}

export function Top10Card({ rank, movie, onOpenModal }: Top10CardProps) {
    const [isHovered, setIsHovered] = useState(false);
    const [isPreviewActive, setIsPreviewActive] = useState(false);
    const [imgSrc, setImgSrc] = useState(movie.poster);
    const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const { isBookmarked, toggleWatchlist } = useWatchlist();
    const { locale } = useLanguage();

    const bookmarked = isBookmarked(movie._id);
    const trailerId = movie.trailer;

    const handleMouseEnter = () => {
        setIsHovered(true);
        hoverTimeoutRef.current = setTimeout(() => {
            setIsPreviewActive(true);
        }, 650);
    };

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
            onOpenModal(movie);
        }
    };

    const handleBookmark = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        toggleWatchlist(movie);
    };

    // Calculate dynamic viewBox and SVG dimensions for single vs double digit
    const isDoubleDigit = rank >= 10;
    const svgWidth = isDoubleDigit ? 150 : 100;

    return (
        <div
            className="group relative flex items-center h-[260px] sm:h-[300px] md:h-[340px] cursor-pointer select-none"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* Giant Number SVG (Netflix 3D Metallic Style) */}
            <div className="relative h-full flex items-center justify-end shrink-0 z-0 -mr-6 md:-mr-8 pointer-events-none">
                <svg
                    viewBox={`0 0 ${svgWidth} 170`}
                    className="h-[80%] md:h-[90%] w-auto overflow-visible select-none drop-shadow-[0_8px_16px_rgba(0,0,0,0.9)]"
                >
                    <defs>
                        {/* Outer Glow Gradient */}
                        <linearGradient id={`grad-stroke-${rank}`} x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
                            <stop offset="50%" stopColor="#8e8e93" stopOpacity="0.7" />
                            <stop offset="100%" stopColor="#3a3a3c" stopOpacity="0.5" />
                        </linearGradient>

                        {/* Inner Body Gradient */}
                        <linearGradient id={`grad-fill-${rank}`} x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#1c1c1e" />
                            <stop offset="50%" stopColor="#0c0c0e" />
                            <stop offset="100%" stopColor="#000000" />
                        </linearGradient>
                    </defs>

                    {/* Dark Shadow Silhouette */}
                    <text
                        x={isDoubleDigit ? "50%" : "55%"}
                        y="82%"
                        textAnchor="middle"
                        className="font-black text-[150px] fill-black stroke-[#2c2c2e] stroke-[8px]"
                        style={{
                            fontFamily: "system-ui, -apple-system, sans-serif",
                            letterSpacing: isDoubleDigit ? "-14px" : "-4px",
                            paintOrder: "stroke fill",
                        }}
                    >
                        {rank}
                    </text>

                    {/* Outer Silver Stroke */}
                    <text
                        x={isDoubleDigit ? "50%" : "55%"}
                        y="82%"
                        textAnchor="middle"
                        className="font-black text-[150px] stroke-[4px]"
                        stroke={`url(#grad-stroke-${rank})`}
                        fill={`url(#grad-fill-${rank})`}
                        style={{
                            fontFamily: "system-ui, -apple-system, sans-serif",
                            letterSpacing: isDoubleDigit ? "-14px" : "-4px",
                            paintOrder: "stroke fill",
                        }}
                    >
                        {rank}
                    </text>
                </svg>
            </div>

            {/* Movie Poster Card */}
            <div className="relative z-10 w-[140px] sm:w-[160px] md:w-[190px] h-[210px] sm:h-[240px] md:h-[285px] shrink-0">
                <motion.div
                    whileHover={{ scale: 1.04 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="relative w-full h-full overflow-hidden rounded-xl md:rounded-2xl border border-white/10 bg-zinc-900 shadow-xl transition-all duration-300 group-hover:shadow-[0_0_30px_rgba(225,29,72,0.3)] group-hover:border-rose-500/50 shimmer-sweep"
                >
                    <Image
                        src={imgSrc}
                        alt={movie.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 768px) 40vw, 20vw"
                        quality={80}
                        onError={() => setImgSrc("https://placehold.co/400x600/18181b/ffffff/png?text=No+Poster")}
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                    {/* Top 10 Red Ribbon Badge */}
                    <div className="absolute top-2 left-2 z-20 flex items-center gap-1 rounded bg-rose-600 px-1.5 py-0.5 text-[9px] font-black text-white shadow-md shadow-rose-950 uppercase tracking-wider">
                        TOP 10
                    </div>

                    {/* Bookmark Quick Button on Top Right */}
                    <button
                        onClick={handleBookmark}
                        className={`absolute top-2 right-2 z-20 flex h-7 w-7 items-center justify-center rounded-full border transition-all ${
                            bookmarked
                                ? "bg-rose-600 border-rose-400 text-white shadow-md shadow-rose-600/40"
                                : "bg-black/60 border-white/20 text-white/80 opacity-0 group-hover:opacity-100 hover:bg-black/90"
                        }`}
                        title={bookmarked ? (locale === "id" ? "Hapus dari Daftarku" : "Remove from Watchlist") : (locale === "id" ? "Tambah ke Daftarku" : "Add to Watchlist")}
                    >
                        {bookmarked ? <Check size={13} /> : <Plus size={13} />}
                    </button>

                    {/* Rating Badge Bottom Left */}
                    {movie.vote && (
                        <div className="absolute bottom-2 left-2 flex items-center gap-1 rounded-md border border-white/10 bg-black/70 px-1.5 py-0.5 text-[10px] font-bold backdrop-blur-md text-amber-400">
                            <Star size={10} className="fill-amber-400" />
                            {movie.vote}
                        </div>
                    )}
                </motion.div>
            </div>

            {/* Netflix-Style Expandable Trailer Preview Popup on Hover */}
            <AnimatePresence>
                {isPreviewActive && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -5 }}
                        animate={{ opacity: 1, scale: 1.15, y: -18 }}
                        exit={{ opacity: 0, scale: 0.95, y: -5 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        className="absolute -top-3 left-10 md:left-14 w-[240px] sm:w-[270px] z-[70] overflow-hidden rounded-2xl border border-rose-500/50 bg-[#121217] shadow-2xl shadow-rose-950/80 pointer-events-auto"
                    >
                        {/* Video / Poster Header */}
                        <div className="relative aspect-video w-full overflow-hidden bg-black">
                            {trailerId ? (
                                <iframe
                                    src={`https://www.youtube-nocookie.com/embed/${trailerId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${trailerId}&modestbranding=1&rel=0&showinfo=0`}
                                    title={movie.title}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    className="w-full h-full object-cover scale-110 pointer-events-none"
                                />
                            ) : (
                                <Image
                                    src={imgSrc}
                                    alt={movie.title}
                                    fill
                                    className="object-cover"
                                    quality={80}
                                />
                            )}

                            <div className="absolute inset-0 bg-gradient-to-t from-[#121217] via-transparent to-black/40 pointer-events-none" />

                            {/* Rank Ribbon */}
                            <div className="absolute top-2 left-2 flex items-center gap-1 rounded bg-rose-600 px-2 py-0.5 text-[10px] font-black text-white shadow-md uppercase tracking-wider">
                                #{rank} Trending
                            </div>

                            {/* Audio muted indicator */}
                            {trailerId && (
                                <div className="absolute bottom-2 right-2 rounded-full bg-black/70 p-1.5 text-zinc-400 backdrop-blur-md">
                                    <Volume2 size={12} />
                                </div>
                            )}
                        </div>

                        {/* Content & Action Bar */}
                        <div className="p-3.5 space-y-3">
                            <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                    <Link href={`/watch/${movie._id}`}>
                                        <motion.button
                                            whileHover={{ scale: 1.08 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-600 text-white shadow-lg shadow-rose-600/40 hover:bg-rose-500 transition-colors cursor-pointer"
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
                                                ? "bg-rose-600/30 border-rose-500 text-rose-300"
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

                            <div className="space-y-1">
                                <h4 className="font-bold text-white text-xs leading-snug line-clamp-1">
                                    {movie.title}
                                </h4>
                                <div className="flex items-center gap-2 text-[11px] text-zinc-400 font-medium">
                                    {movie.vote && (
                                        <span className="flex items-center gap-0.5 text-amber-400 font-bold">
                                            <Star size={10} className="fill-amber-400" />
                                            {movie.vote}
                                        </span>
                                    )}
                                    <span>{movie.year}</span>
                                    {movie.genre && movie.genre.length > 0 && (
                                        <>
                                            <span>•</span>
                                            <span className="text-rose-300 capitalize truncate max-w-[90px]">
                                                {movie.genre[0]}
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
