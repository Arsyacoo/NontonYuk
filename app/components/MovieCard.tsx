"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Play, Eye, Star, Plus, Check } from "lucide-react";
import { useState } from "react";
import { Movie } from "@/app/lib/movies";
import { useWatchlist } from "@/app/context/watchlist-context";

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
    const [imgSrc, setImgSrc] = useState(posterUrl);
    const { isBookmarked, toggleWatchlist } = useWatchlist();

    const bookmarked = isBookmarked(id);

    const fullMovie: Movie = movie || {
        _id: id,
        title,
        year: String(year),
        vote: rating,
        poster: posterUrl,
    };

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
        <div className="block h-full">
            <div
                className="group relative flex flex-col gap-3 cursor-pointer h-full"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <motion.div
                    whileHover={{ scale: 1.04 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="relative aspect-[2/3] w-full overflow-hidden rounded-xl border border-white/10 bg-zinc-900 shadow-lg group-hover:shadow-purple-500/20"
                >
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
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                    {/* Bookmark Quick Button on Top Left */}
                    <button
                        onClick={handleBookmark}
                        className={`absolute top-2 left-2 z-20 flex h-8 w-8 items-center justify-center rounded-full border transition-all ${bookmarked
                                ? "bg-purple-600 border-purple-400 text-white"
                                : "bg-black/60 border-white/20 text-white/80 opacity-0 group-hover:opacity-100 hover:bg-black/90"
                            }`}
                        title={bookmarked ? "Hapus dari Daftarku" : "Tambah ke Daftarku"}
                    >
                        {bookmarked ? <Check size={14} /> : <Plus size={14} />}
                    </button>

                    {/* Action Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: isHovered ? 1 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/60 backdrop-blur-[2px]"
                    >
                        <Link href={`/watch/${id}`} className="block">
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-600 text-white shadow-lg shadow-purple-600/30 transition-colors hover:bg-purple-500"
                            >
                                <Play className="fill-white ml-0.5" size={20} />
                            </motion.button>
                        </Link>

                        {onOpenModal && (
                            <motion.button
                                onClick={handleQuickView}
                                whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.25)" }}
                                whileTap={{ scale: 0.95 }}
                                className="flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-white backdrop-blur-md transition-colors"
                            >
                                <Eye size={14} />
                                Quick View
                            </motion.button>
                        )}
                    </motion.div>

                    {/* Rating Badge */}
                    {rating && (
                        <div className="absolute top-2 right-2 flex items-center gap-1 rounded-md border border-white/10 bg-black/60 px-1.5 py-0.5 text-xs font-semibold backdrop-blur-md text-amber-400">
                            <Star size={10} className="fill-amber-400" />
                            {rating}
                        </div>
                    )}
                </motion.div>

                <div className="space-y-1">
                    <Link href={`/watch/${id}`}>
                        <h3 className="line-clamp-1 text-sm md:text-base font-semibold text-zinc-100 group-hover:text-purple-300 transition-colors">
                            {title}
                        </h3>
                    </Link>
                    <p className="text-xs text-zinc-500">{year}</p>
                </div>
            </div>
        </div>
    );
}
