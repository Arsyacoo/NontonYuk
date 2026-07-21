"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Movie } from "@/app/lib/movies";

export interface WatchHistoryItem {
    movieId: string;
    movie: Movie;
    episodeNumber?: number;
    updatedAt: number;
}

interface HistoryContextType {
    history: WatchHistoryItem[];
    addOrUpdateHistory: (movie: Movie, episodeNumber?: number) => void;
    removeFromHistory: (movieId: string) => void;
    clearHistory: () => void;
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

const STORAGE_KEY = "nontonyuk_watch_history";

export function HistoryProvider({ children }: { children: React.ReactNode }) {
    const [history, setHistory] = useState<WatchHistoryItem[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load from localStorage on mount
    useEffect(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                setHistory(JSON.parse(saved));
            }
        } catch (e) {
            console.error("Failed to load history from localStorage:", e);
        } finally {
            setIsLoaded(true);
        }
    }, []);

    // Save to localStorage when history changes
    useEffect(() => {
        if (!isLoaded) return;
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
        } catch (e) {
            console.error("Failed to save history to localStorage:", e);
        }
    }, [history, isLoaded]);

    const addOrUpdateHistory = (movie: Movie, episodeNumber?: number) => {
        setHistory((prev) => {
            const filtered = prev.filter((item) => item.movieId !== movie._id);
            const newItem: WatchHistoryItem = {
                movieId: movie._id,
                movie,
                episodeNumber,
                updatedAt: Date.now(),
            };
            return [newItem, ...filtered];
        });
    };

    const removeFromHistory = (movieId: string) => {
        setHistory((prev) => prev.filter((item) => item.movieId !== movieId));
    };

    const clearHistory = () => {
        setHistory([]);
    };

    return (
        <HistoryContext.Provider
            value={{
                history,
                addOrUpdateHistory,
                removeFromHistory,
                clearHistory,
            }}
        >
            {children}
        </HistoryContext.Provider>
    );
}

export function useHistory() {
    const context = useContext(HistoryContext);
    if (!context) {
        throw new Error("useHistory must be used within a HistoryProvider");
    }
    return context;
}
