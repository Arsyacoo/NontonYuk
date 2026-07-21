"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { clsx } from "clsx";
import { Menu, X, Search, Bookmark, Star, Film, Tv, ChevronRight } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useWatchlist } from "@/app/context/watchlist-context";
import { getAllMovies, Movie } from "@/app/lib/movies";

const NAV_ITEMS = [
    { label: "Beranda", href: "/" },
    { label: "Daftarku", href: "/watchlist", isWatchlist: true },
    { label: "Trending", href: "/genre/trending" },
    { label: "Action", href: "/genre/action" },
    { label: "Anime", href: "/genre/anime" },
    { label: "Sci-Fi", href: "/genre/sci-fi" },
    { label: "Indo Dub", href: "/genre/indo-dub" },
];

export function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [liveResults, setLiveResults] = useState<Movie[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [allMovies, setAllMovies] = useState<Movie[]>([]);

    const searchRef = useRef<HTMLDivElement>(null);
    const { watchlist } = useWatchlist();

    // Fetch all movies once for instant live autocomplete
    useEffect(() => {
        async function loadMovies() {
            const movies = await getAllMovies();
            setAllMovies(movies);
        }
        loadMovies();
    }, []);

    // Handle Scroll
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Live search filtering
    useEffect(() => {
        if (!searchQuery.trim()) {
            setLiveResults([]);
            setShowDropdown(false);
            return;
        }

        const q = searchQuery.toLowerCase().trim();
        const matches = allMovies.filter((movie) =>
            movie.title.toLowerCase().includes(q)
        );
        setLiveResults(matches.slice(0, 6)); // Top 6 instant matches
        setShowDropdown(true);
    }, [searchQuery, allMovies]);

    // Close dropdown on click outside or escape
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
                setShowDropdown(false);
            }
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setShowDropdown(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    // Close dropdown on route change
    useEffect(() => {
        setShowDropdown(false);
        setIsMobileMenuOpen(false);
    }, [pathname]);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
            setShowDropdown(false);
            setIsMobileMenuOpen(false);
        }
    };

    const handleResultClick = (movieId: string) => {
        setShowDropdown(false);
        setSearchQuery("");
        router.push(`/watch/${movieId}`);
    };

    return (
        <>
            <header
                className={clsx(
                    "fixed top-0 left-0 right-0 z-[100] transition-all duration-300",
                    isScrolled
                        ? "bg-[#09090b]/90 backdrop-blur-md border-b border-white/10 py-3 shadow-lg"
                        : "bg-transparent py-5"
                )}
            >
                <div className="container mx-auto px-4 md:px-6 flex items-center gap-4 lg:gap-8 justify-between">
                    <Link href="/" className="text-2xl font-bold tracking-tighter text-white shrink-0">
                        Nonton<span className="text-purple-500">Yuk</span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden xl:flex items-center gap-6">
                        {NAV_ITEMS.map((item) => (
                            <Link
                                key={item.label}
                                href={item.href}
                                className={clsx(
                                    "relative text-sm font-medium transition-colors hover:text-purple-400 flex items-center gap-1.5",
                                    pathname === item.href ? "text-purple-400 font-semibold" : "text-zinc-300"
                                )}
                            >
                                {item.isWatchlist && <Bookmark size={15} className="text-purple-400" />}
                                <span>{item.label}</span>

                                {item.isWatchlist && watchlist.length > 0 && (
                                    <span className="flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full bg-purple-600 text-white text-[10px] font-bold">
                                        {watchlist.length}
                                    </span>
                                )}
                            </Link>
                        ))}
                    </nav>

                    {/* Live Search Bar & Watchlist Shortcut - Desktop */}
                    <div ref={searchRef} className="hidden md:flex items-center gap-4 flex-1 max-w-md ml-auto xl:ml-0 relative">
                        <form onSubmit={handleSearchSubmit} className="relative w-full">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => searchQuery.trim() && setShowDropdown(true)}
                                placeholder="Cari film, anime, series..."
                                className="w-full bg-white/10 border border-white/10 rounded-full py-2 pl-10 pr-8 text-sm text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                            />
                            {searchQuery && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSearchQuery("");
                                        setShowDropdown(false);
                                    }}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white text-xs p-1"
                                >
                                    <X size={14} />
                                </button>
                            )}
                        </form>

                        {/* Live Search Autocomplete Dropdown */}
                        <AnimatePresence>
                            {showDropdown && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    transition={{ duration: 0.2 }}
                                    className="absolute top-full left-0 right-0 mt-2 bg-[#121216]/95 backdrop-blur-xl border border-white/15 rounded-2xl shadow-2xl overflow-hidden z-[110]"
                                >
                                    {liveResults.length > 0 ? (
                                        <div className="py-2 divide-y divide-white/5">
                                            <div className="px-4 py-1.5 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                                                Hasil Instant ({liveResults.length})
                                            </div>
                                            {liveResults.map((movie) => (
                                                <div
                                                    key={movie._id}
                                                    onClick={() => handleResultClick(movie._id)}
                                                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-purple-600/20 cursor-pointer transition-colors group"
                                                >
                                                    {/* Thumbnail */}
                                                    <div className="relative w-10 h-14 rounded-md overflow-hidden bg-zinc-800 shrink-0">
                                                        <Image
                                                            src={movie.poster}
                                                            alt={movie.title}
                                                            fill
                                                            className="object-cover"
                                                            sizes="50px"
                                                        />
                                                    </div>

                                                    {/* Info */}
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="text-sm font-semibold text-white group-hover:text-purple-300 truncate">
                                                            {movie.title}
                                                        </h4>
                                                        <div className="flex items-center gap-2 text-xs text-zinc-400 mt-0.5">
                                                            <span className="flex items-center gap-1 text-amber-400 font-semibold">
                                                                <Star size={10} className="fill-amber-400" />
                                                                {movie.vote || "N/A"}
                                                            </span>
                                                            <span>•</span>
                                                            <span>{movie.year}</span>
                                                            <span>•</span>
                                                            <span className="capitalize">{movie.type || "movie"}</span>
                                                        </div>
                                                    </div>

                                                    <ChevronRight size={16} className="text-zinc-500 group-hover:text-purple-400 transition-colors" />
                                                </div>
                                            ))}

                                            {/* View All Search Results Footer */}
                                            <button
                                                onClick={handleSearchSubmit}
                                                className="w-full text-center py-2.5 text-xs font-semibold text-purple-400 hover:text-purple-300 bg-white/5 hover:bg-purple-600/30 transition-colors"
                                            >
                                                Lihat semua hasil untuk "{searchQuery}" →
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="p-4 text-center text-xs text-zinc-400">
                                            Tidak ada film ditemukan untuk "{searchQuery}"
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <Link
                            href="/watchlist"
                            className="xl:hidden relative p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/10 shrink-0"
                            title="Daftarku"
                        >
                            <Bookmark size={18} className="text-purple-400" />
                            {watchlist.length > 0 && (
                                <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-4 h-4 px-1 rounded-full bg-purple-600 text-white text-[9px] font-bold">
                                    {watchlist.length}
                                </span>
                            )}
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="xl:hidden text-white ml-auto md:ml-0 p-2 rounded-lg bg-white/5 border border-white/10"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </header>

            {/* Mobile Nav Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed inset-0 z-[90] bg-[#09090b] pt-24 px-6 xl:hidden overflow-y-auto"
                    >
                        {/* Mobile Search */}
                        <form onSubmit={handleSearchSubmit} className="mb-6 relative">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Cari film, anime, series..."
                                className="w-full bg-white/10 border border-white/10 rounded-full py-3 pl-10 pr-4 text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                            />
                        </form>

                        <nav className="flex flex-col gap-2">
                            {NAV_ITEMS.map((item) => (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={clsx(
                                        "text-lg font-medium py-3 border-b border-white/5 transition-colors flex items-center justify-between",
                                        pathname === item.href ? "text-purple-400 font-semibold" : "text-zinc-300"
                                    )}
                                >
                                    <span className="flex items-center gap-2">
                                        {item.isWatchlist && <Bookmark size={18} className="text-purple-400" />}
                                        {item.label}
                                    </span>
                                    {item.isWatchlist && watchlist.length > 0 && (
                                        <span className="px-2.5 py-0.5 rounded-full bg-purple-600 text-white text-xs font-bold">
                                            {watchlist.length} film
                                        </span>
                                    )}
                                </Link>
                            ))}
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
