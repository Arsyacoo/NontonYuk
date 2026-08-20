"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight, Flame } from "lucide-react";
import { Top10Card } from "./Top10Card";
import { Movie } from "../lib/movies";
import { useLanguage } from "../context/language-context";

interface Top10RowProps {
    title?: string;
    movies: Movie[];
    onOpenModal?: (movie: Movie) => void;
}

export function Top10Row({ title, movies, onOpenModal }: Top10RowProps) {
    const rowRef = useRef<HTMLDivElement>(null);
    const { locale } = useLanguage();

    const scroll = (direction: "left" | "right") => {
        if (rowRef.current) {
            const { current } = rowRef;
            const scrollAmount = direction === "left" ? -window.innerWidth / 1.5 : window.innerWidth / 1.5;
            current.scrollBy({ left: scrollAmount, behavior: "smooth" });
        }
    };

    if (!movies || movies.length === 0) return null;

    const top10List = movies.slice(0, 10);

    return (
        <div className="space-y-4 md:space-y-5 mb-12 group/row hover:z-30 relative">
            {/* Header with Netflix-Style TOP 10 Badge */}
            <div className="pl-4 md:pl-12 flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 bg-rose-600/20 border border-rose-500/40 px-3 py-1 rounded-xl shadow-lg shadow-rose-950/30">
                    <Flame size={18} className="text-rose-500 fill-rose-500 animate-pulse" />
                    <span className="text-xs font-black text-rose-300 uppercase tracking-wider">
                        TOP 10
                    </span>
                </div>

                <div>
                    <h2 className="text-xl md:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                        {title || (locale === "id" ? "Top 10 Film & Serial Hari Ini di Indonesia" : "Top 10 Movies & Series in Indonesia Today")}
                    </h2>
                </div>
            </div>

            {/* Carousel Container */}
            <div className="group relative">
                {/* Scroll Left Button */}
                <button
                    onClick={() => scroll("left")}
                    className="absolute top-0 bottom-0 left-2 z-40 m-auto h-11 w-11 items-center justify-center opacity-0 transition-all hover:scale-110 group-hover/row:opacity-100 hidden md:flex text-white bg-black/80 hover:bg-rose-600 rounded-full border border-white/20 shadow-2xl cursor-pointer"
                    aria-label="Scroll left"
                >
                    <ChevronLeft size={24} />
                </button>

                {/* Horizontal Scroll Track */}
                <div
                    ref={rowRef}
                    className="flex items-center space-x-2 sm:space-x-4 overflow-x-scroll scrollbar-hide md:px-4 pl-4 md:pl-12 py-6 -my-3"
                >
                    {top10List.map((movie, index) => (
                        <div key={movie._id} className="shrink-0">
                            <Top10Card
                                rank={index + 1}
                                movie={movie}
                                onOpenModal={onOpenModal}
                            />
                        </div>
                    ))}
                </div>

                {/* Scroll Right Button */}
                <button
                    onClick={() => scroll("right")}
                    className="absolute top-0 bottom-0 right-2 z-40 m-auto h-11 w-11 items-center justify-center opacity-0 transition-all hover:scale-110 group-hover/row:opacity-100 hidden md:flex text-white bg-black/80 hover:bg-rose-600 rounded-full border border-white/20 shadow-2xl cursor-pointer"
                    aria-label="Scroll right"
                >
                    <ChevronRight size={24} />
                </button>
            </div>
        </div>
    );
}
