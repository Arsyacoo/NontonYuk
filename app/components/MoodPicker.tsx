"use client";

import { motion } from "framer-motion";
import { Sparkles, Compass } from "lucide-react";
import { MOOD_DEFINITIONS, MoodId, MoodItem } from "@/app/lib/movies";
import { useLanguage } from "@/app/context/language-context";
import { clsx } from "clsx";

interface MoodPickerProps {
    activeMood: MoodId;
    onSelectMood: (mood: MoodId) => void;
    title?: string;
    subtitle?: string;
    className?: string;
}

export function MoodPicker({
    activeMood,
    onSelectMood,
    title,
    subtitle,
    className,
}: MoodPickerProps) {
    const { t, locale } = useLanguage();

    const activeItem = MOOD_DEFINITIONS.find((m) => m.id === activeMood) || MOOD_DEFINITIONS[0];

    return (
        <div className={clsx("space-y-4", className)}>
            {/* Header / Mood Description Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-400">
                        <Sparkles size={20} className="animate-pulse" />
                    </div>
                    <div>
                        <h3 className="text-lg md:text-xl font-extrabold text-white flex items-center gap-2">
                            {title || (locale === "id" ? "Pilih Sesuai Suasana Hatimu" : "Pick by Your Mood")}
                            <span className="text-xs px-2 py-0.5 rounded-full bg-purple-950/60 border border-purple-500/30 text-purple-300 font-bold uppercase tracking-wider hidden sm:inline">
                                Mood Hub
                            </span>
                        </h3>
                        <p className="text-xs text-zinc-400">
                            {subtitle || (locale === "id"
                                ? "Temukan kurasi film terbaik yang pas dengan vibe dan perasaanmu saat ini."
                                : "Discover curated movies matching your current vibe & feeling.")}
                        </p>
                    </div>
                </div>

                {/* Active Mood Pill Indicator */}
                {activeMood !== "all" && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={clsx(
                            "inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold border backdrop-blur-md self-start sm:self-auto",
                            activeItem.bgGlow,
                            "bg-white/[0.04]"
                        )}
                    >
                        <span className="text-base">{activeItem.emoji}</span>
                        <span className={activeItem.color}>{t(activeItem.labelKey)}</span>
                        <span className="text-zinc-500 text-[11px]">• {t(activeItem.descKey)}</span>
                    </motion.div>
                )}
            </div>

            {/* Mood Pills Grid / Carousel */}
            <div className="flex items-center gap-2.5 overflow-x-auto scrollbar-hide py-2 px-0.5">
                {MOOD_DEFINITIONS.map((mood) => {
                    const isActive = activeMood === mood.id;

                    return (
                        <motion.button
                            key={mood.id}
                            onClick={() => onSelectMood(mood.id)}
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.96 }}
                            transition={{ type: "spring", stiffness: 400, damping: 25 }}
                            className={clsx(
                                "relative flex items-center gap-2.5 px-4 py-2.5 rounded-2xl border text-xs sm:text-sm font-bold transition-all cursor-pointer shrink-0 shadow-lg select-none",
                                isActive
                                    ? clsx(
                                          "bg-gradient-to-r text-white shadow-lg",
                                          mood.gradient,
                                          mood.bgGlow
                                      )
                                    : "bg-[#141419]/90 border-white/10 text-zinc-300 hover:bg-white/10 hover:border-white/20 hover:text-white"
                            )}
                        >
                            <span className="text-base sm:text-lg leading-none">{mood.emoji}</span>
                            <span>{t(mood.labelKey)}</span>

                            {isActive && (
                                <motion.span
                                    layoutId="mood-active-indicator"
                                    className="w-1.5 h-1.5 rounded-full bg-white animate-ping"
                                />
                            )}
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
}
