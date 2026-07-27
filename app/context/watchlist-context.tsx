"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Movie } from "@/app/lib/movies";
import { useToast } from "./toast-context";

interface WatchlistContextType {
    watchlist: Movie[];
    addToWatchlist: (movie: Movie) => void;
    removeFromWatchlist: (movieId: string) => void;
    toggleWatchlist: (movie: Movie) => void;
    isBookmarked: (movieId: string) => boolean;
}

const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined);

const STORAGE_KEY = "nontonyuk_watchlist";

export function WatchlistProvider({ children }: { children: React.ReactNode }) {
    const [watchlist, setWatchlist] = useState<Movie[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const { showToast } = useToast();

    // Load from localStorage on mount
    useEffect(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                setWatchlist(JSON.parse(saved));
            }
        } catch (e) {
            console.error("Failed to load watchlist from localStorage:", e);
        } finally {
            setIsLoaded(true);
        }
    }, []);

    // Save to localStorage when watchlist changes
    useEffect(() => {
        if (!isLoaded) return;
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(watchlist));
        } catch (e) {
            console.error("Failed to save watchlist to localStorage:", e);
        }
    }, [watchlist, isLoaded]);

    const addToWatchlist = (movie: Movie) => {
        setWatchlist((prev) => {
            if (prev.some((m) => m._id === movie._id)) return prev;
            showToast(`"${movie.title}" ditambahkan ke Daftarku`, "success");
            return [movie, ...prev];
        });
    };

    const removeFromWatchlist = (movieId: string) => {
        setWatchlist((prev) => {
            const found = prev.find((m) => m._id === movieId);
            if (found) {
                showToast(`"${found.title}" dihapus dari Daftarku`, "info");
            }
            return prev.filter((m) => m._id !== movieId);
        });
    };

    const toggleWatchlist = (movie: Movie) => {
        setWatchlist((prev) => {
            const exists = prev.some((m) => m._id === movie._id);
            if (exists) {
                showToast(`"${movie.title}" dihapus dari Daftarku`, "info");
                return prev.filter((m) => m._id !== movie._id);
            } else {
                showToast(`"${movie.title}" ditambahkan ke Daftarku`, "success");
                return [movie, ...prev];
            }
        });
    };

    const isBookmarked = (movieId: string) => {
        return watchlist.some((m) => m._id === movieId);
    };

    return (
        <WatchlistContext.Provider
            value={{
                watchlist,
                addToWatchlist,
                removeFromWatchlist,
                toggleWatchlist,
                isBookmarked,
            }}
        >
            {children}
        </WatchlistContext.Provider>
    );
}

export function useWatchlist() {
    const context = useContext(WatchlistContext);
    if (!context) {
        throw new Error("useWatchlist must be used within a WatchlistProvider");
    }
    return context;
}
