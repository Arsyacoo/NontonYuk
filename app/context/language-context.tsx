"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { translations, Locale } from "@/app/lib/translations";

interface LanguageContextType {
    locale: Locale;
    setLocale: (loc: Locale) => void;
    t: (key: string, replacements?: { [key: string]: string | number }) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = "nontonyuk_lang";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [locale, setLocaleState] = useState<Locale>("id");
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY) as Locale | null;
            if (saved === "id" || saved === "en") {
                setLocaleState(saved);
            }
        } catch (e) {
            console.error("Failed to load language from localStorage:", e);
        } finally {
            setIsLoaded(true);
        }
    }, []);

    const setLocale = useCallback((loc: Locale) => {
        setLocaleState(loc);
        try {
            localStorage.setItem(STORAGE_KEY, loc);
        } catch (e) {
            console.error("Failed to save language to localStorage:", e);
        }
    }, []);

    const t = useCallback(
        (key: string, replacements?: { [key: string]: string | number }): string => {
            const dict = translations[locale];
            // @ts-ignore
            let value = dict[key] || key;

            if (replacements) {
                Object.entries(replacements).forEach(([k, v]) => {
                    value = value.replace(`{${k}}`, String(v));
                });
            }

            return value;
        },
        [locale]
    );

    return (
        <LanguageContext.Provider value={{ locale, setLocale, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
}
