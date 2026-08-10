"use client";

import { useState, useEffect, useMemo } from "react";
import { Search, Filter, RefreshCw, Film, Sliders, ChevronDown } from "lucide-react";
import { Movie, getAllMovies } from "@/app/lib/movies";
import { MovieGrid } from "@/app/components/MovieGrid";
import { MovieCard } from "@/app/components/MovieCard";
import { MovieModal } from "@/app/components/MovieModal";
import { useLanguage } from "@/app/context/language-context";

const GENRES = [
    "action",
    "animation",
    "anime",
    "sci-fi",
    "drama",
    "comedy",
    "fantasy",
    "adventure",
    "thriller",
    "crime",
];

export default function ExplorePage() {
    const { t } = useLanguage();
    const [allMovies, setAllMovies] = useState<Movie[]>([]);
    const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
    const [loading, setLoading] = useState(true);

    // Filter States
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedType, setSelectedType] = useState<"all" | "movie" | "series">("all");
    const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
    const [selectedYear, setSelectedYear] = useState("all");
    const [selectedRating, setSelectedRating] = useState("all");
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    // Localized options
    const YEARS = useMemo(() => [
        { label: t("explore.year_all"), value: "all" },
        { label: "2024", value: "2024" },
        { label: "2023", value: "2023" },
        { label: "2022", value: "2022" },
        { label: t("explore.year_2020s"), value: "2020s" },
        { label: t("explore.year_2010s"), value: "2010s" },
    ], [t]);

    const RATINGS = useMemo(() => [
        { label: t("explore.rating_all"), value: "all" },
        { label: t("explore.rating_best"), value: "8.5" },
        { label: t("explore.rating_pop"), value: "8.0" },
        { label: t("explore.rating_good"), value: "7.5" },
        { label: t("explore.rating_decent"), value: "7.0" },
    ], [t]);

    const mediaTypes = useMemo(() => [
        { label: t("explore.type_all"), value: "all" },
        { label: t("explore.type_movie"), value: "movie" },
        { label: t("explore.type_series"), value: "series" },
    ] as const, [t]);

    useEffect(() => {
        async function fetchMovies() {
            setLoading(true);
            const data = await getAllMovies();
            setAllMovies(data);
            setFilteredMovies(data);
            setLoading(false);
        }
        fetchMovies();
    }, []);

    // Filter Trigger
    useEffect(() => {
        let results = [...allMovies];

        // 1. Search Query
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase().trim();
            results = results.filter((m) => m.title.toLowerCase().includes(query));
        }

        // 2. Media Type
        if (selectedType !== "all") {
            results = results.filter((m) => m.type === selectedType);
        }

        // 3. Genres (Matches at least one selected genre if any selected)
        if (selectedGenres.length > 0) {
            results = results.filter((m) =>
                m.genre?.some((g) => selectedGenres.includes(g.toLowerCase()))
            );
        }

        // 4. Release Year
        if (selectedYear !== "all") {
            if (selectedYear === "2020s") {
                results = results.filter((m) => parseInt(m.year, 10) >= 2020);
            } else if (selectedYear === "2010s") {
                results = results.filter(
                    (m) => parseInt(m.year, 10) >= 2010 && parseInt(m.year, 10) < 2020
                );
            } else {
                results = results.filter((m) => m.year === selectedYear);
            }
        }

        // 5. IMDb Rating
        if (selectedRating !== "all") {
            const minRating = parseFloat(selectedRating);
            results = results.filter((m) => m.vote && m.vote >= minRating);
        }

        setFilteredMovies(results);
    }, [searchQuery, selectedType, selectedGenres, selectedYear, selectedRating, allMovies]);

    const handleGenreToggle = (genre: string) => {
        setSelectedGenres((prev) =>
            prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
        );
    };

    const handleResetFilters = () => {
        setSearchQuery("");
        setSelectedType("all");
        setSelectedGenres([]);
        setSelectedYear("all");
        setSelectedRating("all");
    };

    return (
        <main className="min-h-screen bg-[#09090b] text-white pt-28 pb-20 px-4 md:px-12">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="border-b border-white/10 pb-6 space-y-2 animate-fade-in">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center p-2.5 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30">
                            <Sliders size={24} />
                        </div>
                        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white">
                            {t("explore.title")}
                        </h1>
                    </div>
                    <p className="text-zinc-400 text-sm md:text-base">
                        {t("explore.subtitle")}
                    </p>
                </div>

                {/* Collapsible Mobile Filters Button */}
                <button
                    onClick={() => setShowMobileFilters(!showMobileFilters)}
                    className="md:hidden w-full flex items-center justify-between px-4 py-3 rounded-xl bg-zinc-900 border border-white/10 text-sm font-semibold cursor-pointer"
                >
                    <span className="flex items-center gap-2">
                        <Filter size={16} className="text-purple-400" />
                        {t("explore.filter_btn")}
                    </span>
                    <ChevronDown
                        size={16}
                        className={`transition-transform duration-300 ${showMobileFilters ? "rotate-180" : ""}`}
                    />
                </button>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Filters Panel (Sidebar on desktop, Collapsible on mobile) */}
                    <div
                        className={`md:block space-y-6 bg-zinc-900/40 border border-white/5 p-6 rounded-2xl h-fit ${showMobileFilters ? "block" : "hidden"}`}
                    >
                        <div className="flex items-center justify-between border-b border-white/5 pb-4">
                            <h3 className="font-bold text-zinc-200 text-base">Filter</h3>
                            <button
                                onClick={handleResetFilters}
                                className="flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300 font-semibold cursor-pointer"
                            >
                                <RefreshCw size={12} />
                                {t("explore.reset")}
                            </button>
                        </div>

                        {/* Search Input */}
                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                                {t("explore.search_label")}
                            </label>
                            <div className="relative">
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder={t("explore.search_placeholder")}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                                />
                            </div>
                        </div>

                        {/* Type Select */}
                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                                {t("explore.type_label")}
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                                {mediaTypes.map((tItem) => (
                                    <button
                                        key={tItem.value}
                                        onClick={() => setSelectedType(tItem.value)}
                                        className={`py-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${selectedType === tItem.value
                                                ? "bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-600/10"
                                                : "bg-white/5 border-transparent text-zinc-400 hover:bg-white/10 hover:text-white"
                                            }`}
                                    >
                                        {tItem.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Year Selector */}
                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                                {t("explore.year_label")}
                            </label>
                            <select
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-3.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                            >
                                {YEARS.map((y) => (
                                    <option key={y.value} value={y.value} className="bg-[#121216]">
                                        {y.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Rating Selector */}
                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                                {t("explore.rating_label")}
                            </label>
                            <select
                                value={selectedRating}
                                onChange={(e) => setSelectedRating(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-3.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                            >
                                {RATINGS.map((r) => (
                                    <option key={r.value} value={r.value} className="bg-[#121216]">
                                        {r.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Genres Multi-select checkboxes */}
                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                                {t("explore.genre_label")}
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                {GENRES.map((genre) => {
                                    const active = selectedGenres.includes(genre);
                                    return (
                                        <button
                                            key={genre}
                                            onClick={() => handleGenreToggle(genre)}
                                            className={`py-1.5 px-3 text-left rounded-lg text-xs font-semibold border transition-all capitalize truncate cursor-pointer ${active
                                                    ? "bg-purple-600/30 border-purple-500/50 text-purple-300 font-bold"
                                                    : "bg-white/5 border-transparent text-zinc-400 hover:bg-white/10 hover:text-white"
                                                }`}
                                        >
                                            {genre}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Results Grid */}
                    <div className="md:col-span-3 space-y-4">
                        <div className="flex items-center justify-between text-sm text-zinc-400">
                            <span>
                                {loading
                                    ? t("explore.loading")
                                    : t("explore.results_count", { count: filteredMovies.length })}
                            </span>
                        </div>

                        {loading ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {Array.from({ length: 8 }).map((_, i) => (
                                    <div key={i} className="aspect-[2/3] shimmer-bg rounded-xl border border-white/5" />
                                ))}
                            </div>
                        ) : filteredMovies.length > 0 ? (
                            <MovieGrid>
                                {filteredMovies.map((movie) => (
                                    <MovieCard
                                        key={movie._id}
                                        id={movie._id}
                                        title={movie.title}
                                        year={movie.year}
                                        rating={movie.vote}
                                        posterUrl={movie.poster}
                                        movie={movie}
                                        onOpenModal={(m) => setSelectedMovie(m)}
                                    />
                                ))}
                            </MovieGrid>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 bg-zinc-900/25 rounded-3xl border border-white/5">
                                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-zinc-800 text-zinc-500">
                                    <Film size={28} />
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-xl font-bold text-white">{t("explore.empty_title")}</h4>
                                    <p className="text-zinc-400 text-sm max-w-sm">
                                        {t("explore.empty_desc")}
                                    </p>
                                </div>
                                <button
                                    onClick={handleResetFilters}
                                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-sm font-semibold transition-colors cursor-pointer"
                                >
                                    {t("explore.empty_btn")}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
        </main>
    );
}
