"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { clsx } from "clsx";
import { Menu, X, Search } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const NAV_ITEMS = [
    { label: "Beranda", href: "/" },
    { label: "Trending", href: "/genre/trending" },
    { label: "Action", href: "/genre/action" },
    { label: "Anime", href: "/genre/anime" },
    { label: "Sci-Fi", href: "/genre/sci-fi" },
    { label: "Indo Dub", href: "/genre/indo-dub" },
    // { label: "Informasi", href: "/info" }, 
];

export function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
            setIsMobileMenuOpen(false);
        }
    };

    return (
        <>
            <header
                className={clsx(
                    "fixed top-0 left-0 right-0 z-[100] transition-all duration-300",
                    isScrolled ? "bg-[#09090b]/80 backdrop-blur-md border-b border-white/5 py-3" : "bg-transparent py-5"
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
                                    "text-sm font-medium transition-colors hover:text-purple-400",
                                    pathname === item.href ? "text-purple-400" : "text-zinc-300"
                                )}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Search Bar - Desktop & Tablet */}
                    <div className="hidden md:flex flex-1 max-w-md ml-auto xl:ml-0">
                        <form onSubmit={handleSearch} className="relative w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Cari film..."
                                className="w-full bg-white/10 border border-white/5 rounded-full py-2 pl-10 pr-4 text-sm text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                            />
                        </form>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="xl:hidden text-white ml-auto md:ml-0"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X /> : <Menu />}
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
                        className="fixed inset-0 z-[90] bg-[#09090b] pt-24 px-4 xl:hidden overflow-y-auto"
                    >
                        {/* Mobile Search */}
                        <form onSubmit={handleSearch} className="mb-6 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Cari film..."
                                className="w-full bg-white/10 border border-white/5 rounded-full py-3 pl-10 pr-4 text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                            />
                        </form>

                        <nav className="flex flex-col gap-2">
                            {NAV_ITEMS.map((item) => (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={clsx(
                                        "text-lg font-medium py-3 border-b border-white/5 transition-colors",
                                        pathname === item.href ? "text-purple-400" : "text-zinc-300"
                                    )}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
