"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Play, Eye, Star } from "lucide-react";
import { useState } from "react";

interface MovieCardProps {
    id: string;
    title: string;
    year: string | number;
    rating?: number;
    posterUrl: string;
}

export function MovieCard({ id, title, year, rating, posterUrl }: MovieCardProps) {
    const [isHovered, setIsHovered] = useState(false);
    const [imgSrc, setImgSrc] = useState(posterUrl);

    return (
        <Link href={`/watch/${id}`} className="block">
            <div
                className="group relative flex flex-col gap-3 cursor-pointer"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="relative aspect-[2/3] w-full overflow-hidden rounded-xl border border-white/10 bg-zinc-900 shadow-lg group-hover:shadow-purple-500/10"
                >
                    <Image
                        src={imgSrc}
                        alt={title}
                        fill
                        unoptimized // Disable server-side optimization for external proxies
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 16vw"
                        quality={80}
                        onError={() => setImgSrc("https://placehold.co/400x600/18181b/ffffff/png?text=No+Poster")}
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                    {/* Action Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: isHovered ? 1 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/40 backdrop-blur-[2px]"
                    >
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-black shadow-lg shadow-white/20 transition-colors hover:bg-zinc-200"
                        >
                            <Play className="fill-black ml-1" size={20} />
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.2)" }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-md transition-colors"
                        >
                            <Eye size={16} />
                            Quick View
                        </motion.button>
                    </motion.div>

                    {/* Rating Badge */}
                    {rating && (
                        <div className="absolute top-2 right-2 flex items-center gap-1 rounded-md border border-white/10 bg-black/50 px-1.5 py-0.5 text-xs font-semibold backdrop-blur-md text-amber-400">
                            <Star size={10} className="fill-amber-400" />
                            {rating}
                        </div>
                    )}
                </motion.div>

                <div className="space-y-1">
                    <h3 className="line-clamp-1 text-base font-medium text-zinc-100 group-hover:text-white transition-colors">
                        {title}
                    </h3>
                    <p className="text-sm text-zinc-500">{year}</p>
                </div>
            </div>
        </Link>
    );
}
