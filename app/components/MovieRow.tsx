"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { MovieCard } from "./MovieCard";
import { Movie } from "../lib/movies";

interface MovieRowProps {
    title: string;
    movies: Movie[];
}

export function MovieRow({ title, movies }: MovieRowProps) {
    const rowRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: "left" | "right") => {
        if (rowRef.current) {
            const { current } = rowRef;
            const scrollAmount = direction === "left" ? -window.innerWidth / 2 : window.innerWidth / 2;
            current.scrollBy({ left: scrollAmount, behavior: "smooth" });
        }
    };

    if (!movies || movies.length === 0) return null;

    return (
        <div className="space-y-4 md:space-y-4 mb-8 group hover:z-20">
            <h2 className="w-56 cursor-pointer text-xl md:text-2xl font-semibold text-[#e5e5e5] transition duration-200 hover:text-white pl-4 md:pl-12">
                {title}
            </h2>

            <div className="group relative md:-ml-2">
                <ChevronLeft
                    className="absolute top-0 bottom-0 left-2 z-40 m-auto h-9 w-9 cursor-pointer opacity-0 transition hover:scale-125 group-hover:opacity-100 hidden md:block"
                    onClick={() => scroll("left")}
                />

                <div
                    ref={rowRef}
                    className="flex items-center space-x-2.5 overflow-x-scroll scrollbar-hide md:space-x-3.5 md:p-2 pl-4 md:pl-12"
                >
                    {movies.map((movie) => (
                        <div key={movie._id} className="relative min-w-[180px] md:min-w-[220px] h-[280px] md:h-[340px] transition duration-200 ease-out md:hover:scale-105 group-focus:z-50 border-2 border-transparent">
                            {/* We wrap MovieCard to control sizing in the row */}
                            <div className="w-full h-full transform scale-95 hover:scale-100 transition-transform">
                                <MovieCard
                                    id={movie._id}
                                    title={movie.title}
                                    year={movie.year}
                                    rating={movie.vote}
                                    posterUrl={movie.poster}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                <ChevronRight
                    className="absolute top-0 bottom-0 right-2 z-40 m-auto h-9 w-9 cursor-pointer opacity-0 transition hover:scale-125 group-hover:opacity-100 hidden md:block"
                    onClick={() => scroll("right")}
                />
            </div>
        </div>
    );
}
