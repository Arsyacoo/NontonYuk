"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
    ArrowLeft,
    Play,
    Server,
    AlertCircle,
    Star,
    Trash2,
    Send,
    MessageSquare,
    Maximize2,
    Minimize2,
    Lightbulb,
    LightbulbOff,
    Keyboard,
    ChevronLeft,
    ChevronRight,
    Timer,
    CheckCircle2
} from "lucide-react";
import { use, useState, useEffect, useRef } from "react";
import { clsx } from "clsx";
import { getAllMovies, Movie } from "@/app/lib/movies";
import { useHistory } from "@/app/context/history-context";
import { useToast } from "@/app/context/toast-context";
import { useLanguage } from "@/app/context/language-context";
import { KeyboardShortcutsModal } from "@/app/components/KeyboardShortcutsModal";

interface WatchPageProps {
    params: Promise<{ id: string }>;
}

type ServerType = "vidsrc" | "superembed" | "embedsu";
type AmbientType = "black" | "purple" | "blue" | "red";

interface Comment {
    id: string;
    name: string;
    avatar: string;
    rating: number;
    text: string;
    createdAt: number;
}

export default function WatchPage({ params }: WatchPageProps) {
    const { id } = use(params);
    const router = useRouter();
    const searchParams = useSearchParams();
    const epParam = searchParams.get("ep");
    const currentEpNumber = epParam ? parseInt(epParam, 10) : 1;

    const [movie, setMovie] = useState<Movie | null>(null);
    const [activeServer, setActiveServer] = useState<ServerType>("vidsrc");
    const { addOrUpdateHistory } = useHistory();
    const { showToast } = useToast();
    const { t, locale } = useLanguage();

    const playerContainerRef = useRef<HTMLDivElement>(null);

    // Player Custom Modes & Shortcuts
    const [isTheaterMode, setIsTheaterMode] = useState(false);
    const [isLightsDimmed, setIsLightsDimmed] = useState(false);
    const [ambientTheme, setAmbientTheme] = useState<AmbientType>("black");
    const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
    const [hudMessage, setHudMessage] = useState<string | null>(null);

    // Auto-Next Episode States
    const [isAutoNextEnabled, setIsAutoNextEnabled] = useState(true);
    const [isAutoNextActive, setIsAutoNextActive] = useState(false);
    const [autoNextCountdown, setAutoNextCountdown] = useState(10);

    // Load saved preferences
    useEffect(() => {
        try {
            const savedAmbient = localStorage.getItem("nontonyuk_ambient_theme") as AmbientType | null;
            if (savedAmbient === "black" || savedAmbient === "purple" || savedAmbient === "blue" || savedAmbient === "red") {
                setAmbientTheme(savedAmbient);
            }
            const savedAutoNext = localStorage.getItem("nontonyuk_autonext");
            if (savedAutoNext !== null) {
                setIsAutoNextEnabled(savedAutoNext === "true");
            }
        } catch (e) {
            console.error("Failed to load saved preferences:", e);
        }
    }, []);

    // Local Comments States
    const [comments, setComments] = useState<Comment[]>([]);
    const [commentName, setCommentName] = useState("");
    const [commentText, setCommentText] = useState("");
    const [commentRating, setCommentRating] = useState(5);
    const [hoveredStar, setHoveredStar] = useState(0);

    useEffect(() => {
        async function fetchMovie() {
            const movies = await getAllMovies();
            const found = movies.find((m: Movie) => m._id === id);
            if (found) {
                setMovie(found);
            }
        }
        fetchMovie();
    }, [id]);

    // Load comments on mount & id change
    useEffect(() => {
        try {
            const saved = localStorage.getItem(`nontonyuk_comments_${id}`);
            if (saved) {
                setComments(JSON.parse(saved));
            } else {
                setComments([]);
            }
            const savedName = localStorage.getItem("nontonyuk_username");
            if (savedName) {
                setCommentName(savedName);
            }
        } catch (e) {
            console.error("Failed to load comments:", e);
        }
    }, [id]);

    const isSeries = movie?.type === "series";
    const totalEpisodes = movie?.episodes?.length || 0;
    const currentEpisode = isSeries
        ? movie?.episodes?.find((e) => e.episode_number === currentEpNumber)
        : null;

    // Series Next & Previous Episode calculation
    const hasNextEpisode = isSeries && movie?.episodes && currentEpNumber < totalEpisodes;
    const nextEpisode = hasNextEpisode
        ? movie?.episodes?.find((e) => e.episode_number === currentEpNumber + 1)
        : null;
    const hasPrevEpisode = isSeries && currentEpNumber > 1;
    const prevEpisode = hasPrevEpisode
        ? movie?.episodes?.find((e) => e.episode_number === currentEpNumber - 1)
        : null;

    // Record history
    useEffect(() => {
        if (movie) {
            addOrUpdateHistory(movie, isSeries ? currentEpNumber : undefined);
        }
    }, [movie, currentEpNumber, isSeries]);

    // Trigger HUD banner helper
    const showHUD = (msg: string) => {
        setHudMessage(msg);
        const timer = setTimeout(() => setHudMessage(null), 2500);
        return () => clearTimeout(timer);
    };

    // Fullscreen toggle helper
    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            if (playerContainerRef.current) {
                playerContainerRef.current.requestFullscreen().catch((err) => {
                    console.error("Fullscreen error:", err);
                });
            } else {
                document.documentElement.requestFullscreen().catch(() => {});
            }
            showHUD(locale === "id" ? "📺 Layar Penuh: AKTIF" : "📺 Fullscreen: ON");
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen().catch(() => {});
            }
            showHUD(locale === "id" ? "📺 Layar Penuh: NONAKTIF" : "📺 Fullscreen: OFF");
        }
    };

    const toggleTheaterMode = () => {
        setIsTheaterMode((prev) => {
            const next = !prev;
            showHUD(
                next
                    ? (locale === "id" ? "🎬 Mode Bioskop: AKTIF" : "🎬 Theater Mode: ON")
                    : (locale === "id" ? "🎬 Mode Bioskop: NONAKTIF" : "🎬 Theater Mode: OFF")
            );
            return next;
        });
    };

    const toggleLightsDimmed = () => {
        setIsLightsDimmed((prev) => {
            const next = !prev;
            showHUD(
                next
                    ? (locale === "id" ? "💡 Lampu Diredupkan (ESC untuk batal)" : "💡 Lights Dimmed (ESC to exit)")
                    : (locale === "id" ? "💡 Lampu Dinyalakan" : "💡 Lights ON")
            );
            return next;
        });
    };

    const toggleAutoNext = () => {
        setIsAutoNextEnabled((prev) => {
            const next = !prev;
            try {
                localStorage.setItem("nontonyuk_autonext", String(next));
            } catch (e) {
                console.error(e);
            }
            showToast(
                next
                    ? (locale === "id" ? "Auto-Next Episode diaktifkan" : "Auto-Next Episode enabled")
                    : (locale === "id" ? "Auto-Next Episode dinonaktifkan" : "Auto-Next Episode disabled"),
                "info"
            );
            return next;
        });
    };

    // Global Cinema Keyboard Shortcuts Listener
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const activeTag = document.activeElement?.tagName.toLowerCase();
            const isInputFocused =
                activeTag === "input" ||
                activeTag === "textarea" ||
                (document.activeElement as HTMLElement)?.isContentEditable;

            if (isInputFocused) return;

            if (e.key === "Escape") {
                if (isShortcutsOpen) {
                    setIsShortcutsOpen(false);
                } else if (isLightsDimmed) {
                    setIsLightsDimmed(false);
                    showHUD(locale === "id" ? "💡 Lampu Dinyalakan" : "💡 Lights ON");
                }
            } else if (e.key === "t" || e.key === "T") {
                e.preventDefault();
                toggleTheaterMode();
            } else if (e.key === "l" || e.key === "L") {
                e.preventDefault();
                toggleLightsDimmed();
            } else if (e.key === "f" || e.key === "F") {
                e.preventDefault();
                toggleFullscreen();
            } else if (e.key === "?" || (e.shiftKey && e.key === "/")) {
                e.preventDefault();
                setIsShortcutsOpen((prev) => !prev);
            } else if ((e.key === "n" || e.key === "N") && hasNextEpisode && nextEpisode) {
                e.preventDefault();
                showHUD(`⏭️ Episode ${nextEpisode.episode_number}: ${nextEpisode.title}`);
                router.push(`/watch/${id}?ep=${nextEpisode.episode_number}`);
            } else if ((e.key === "p" || e.key === "P") && hasPrevEpisode && prevEpisode) {
                e.preventDefault();
                showHUD(`⏮️ Episode ${prevEpisode.episode_number}: ${prevEpisode.title}`);
                router.push(`/watch/${id}?ep=${prevEpisode.episode_number}`);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [
        isLightsDimmed,
        isShortcutsOpen,
        hasNextEpisode,
        hasPrevEpisode,
        nextEpisode,
        prevEpisode,
        id,
        locale,
        router,
    ]);

    // Auto-Next Episode Timer Logic
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isAutoNextActive && hasNextEpisode && nextEpisode) {
            interval = setInterval(() => {
                setAutoNextCountdown((prev) => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        setIsAutoNextActive(false);
                        router.push(`/watch/${id}?ep=${nextEpisode.episode_number}`);
                        return 10;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isAutoNextActive, hasNextEpisode, nextEpisode, id, router]);

    const displayYear = movie ? movie.year : "";
    const displayGenre = movie ? movie.genre?.join(" / ") : "";

    // Multi-server URL templates
    const getPlayerUrl = (server: ServerType): string => {
        if (isSeries) {
            switch (server) {
                case "superembed":
                    return `https://multiembed.to/embed.php?tmdb=1&id=${id}&s=1&e=${currentEpNumber}`;
                case "embedsu":
                    return `https://embed.su/embed/tv/${id}/1/${currentEpNumber}`;
                case "vidsrc":
                default:
                    return `https://vidsrc.xyz/embed/tv/${id}/1/${currentEpNumber}`;
            }
        } else {
            const isNumericId = id.match(/^\d+$/);
            if (!isNumericId) {
                return `https://www.youtube.com/embed/${id}?autoplay=1`;
            }

            switch (server) {
                case "superembed":
                    return `https://multiembed.to/embed.php?tmdb=1&id=${id}`;
                case "embedsu":
                    return `https://embed.su/embed/movie/${id}`;
                case "vidsrc":
                default:
                    return `https://vidsrc.xyz/embed/movie/${id}`;
            }
        }
    };

    const playerUrl = getPlayerUrl(activeServer);

    // Comment Submission
    const handleCommentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!commentName.trim()) {
            showToast(t("watch.toast.name_empty"), "warning");
            return;
        }
        if (!commentText.trim()) {
            showToast(t("watch.toast.comment_empty"), "warning");
            return;
        }

        const newComment: Comment = {
            id: Math.random().toString(36).substring(2, 9),
            name: commentName.trim(),
            avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(commentName.trim())}`,
            rating: commentRating,
            text: commentText.trim(),
            createdAt: Date.now(),
        };

        const updatedComments = [newComment, ...comments];
        setComments(updatedComments);
        localStorage.setItem(`nontonyuk_comments_${id}`, JSON.stringify(updatedComments));
        localStorage.setItem("nontonyuk_username", commentName.trim());

        // Reset
        setCommentText("");
        setCommentRating(5);
        showToast(t("watch.toast.submit_success"), "success");
    };

    // Comment Deletion
    const handleDeleteComment = (commentId: string) => {
        const updated = comments.filter((c) => c.id !== commentId);
        setComments(updated);
        localStorage.setItem(`nontonyuk_comments_${id}`, JSON.stringify(updated));
        showToast(t("watch.toast.delete_success"), "info");
    };

    // Calculate rating stats
    const totalReviews = comments.length;
    const avgRating =
        totalReviews > 0
            ? (comments.reduce((acc, curr) => acc + curr.rating, 0) / totalReviews).toFixed(1)
            : null;

    return (
        <main className={clsx(
            "min-h-screen text-white relative transition-colors duration-500 ease-in-out",
            ambientTheme === "black" && "bg-[#09090b]",
            ambientTheme === "purple" && "bg-gradient-to-b from-[#180a2b] via-[#09090b] to-[#09090b]",
            ambientTheme === "blue" && "bg-gradient-to-b from-[#061730] via-[#09090b] to-[#09090b]",
            ambientTheme === "red" && "bg-gradient-to-b from-[#2d0812] via-[#09090b] to-[#09090b]"
        )}>
            {/* Floating HUD Indicator */}
            {hudMessage && (
                <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[110] pointer-events-none animate-in fade-in zoom-in-95 duration-200">
                    <div className="flex items-center gap-2 rounded-full border border-purple-500/40 bg-black/80 px-5 py-2 text-sm font-semibold text-white shadow-2xl backdrop-blur-md">
                        <span>{hudMessage}</span>
                    </div>
                </div>
            )}

            {/* Dim Lights Background Overlay */}
            {isLightsDimmed && (
                <div
                    onClick={toggleLightsDimmed}
                    className="fixed inset-0 bg-black/95 z-[90] cursor-pointer transition-opacity duration-300"
                    title={locale === "id" ? "Klik di mana saja untuk menyalakan lampu" : "Click anywhere to turn on lights"}
                />
            )}

            {/* Back Button */}
            <Link
                href="/"
                className="fixed top-24 left-6 z-[95] p-3 bg-black/50 backdrop-blur-md rounded-full hover:bg-white/20 transition-colors border border-white/10"
            >
                <ArrowLeft size={24} />
            </Link>

            {/* Cinema Mode Player Container */}
            <div
                ref={playerContainerRef}
                className={clsx(
                    "relative bg-black transition-all duration-300 shadow-2xl z-[95]",
                    isTheaterMode
                        ? "w-full h-[75vh] md:h-[90vh] lg:h-[95vh] max-w-none"
                        : "max-w-7xl mx-auto rounded-none md:rounded-2xl overflow-hidden mt-0 md:mt-24 w-full h-[55vh] md:h-[75vh] border border-white/10",
                    ambientTheme === "black" && "shadow-purple-900/10",
                    ambientTheme === "purple" && "shadow-purple-600/35 border-purple-500/20",
                    ambientTheme === "blue" && "shadow-blue-600/30 border-blue-500/20",
                    ambientTheme === "red" && "shadow-rose-600/30 border-rose-500/20"
                )}
            >
                <iframe
                    key={playerUrl}
                    width="100%"
                    height="100%"
                    src={playerUrl}
                    title="Player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    className="w-full h-full object-contain"
                    allowFullScreen
                />
            </div>

            {/* Details Section & Server Switcher */}
            <div className="max-w-7xl mx-auto px-6 py-8 space-y-8 relative z-10">
                {/* Server Switcher & Cinema Toolbar Panel */}
                <div className="bg-zinc-900/40 border border-white/5 rounded-2xl p-5 md:p-6 space-y-4 shadow-xl">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                            <Server size={20} className="text-purple-400" />
                            <h3 className="text-lg font-bold text-zinc-100">
                                {t("watch.server_title")}
                            </h3>
                        </div>
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-zinc-400 bg-white/5 px-2.5 py-1 rounded-md border border-white/5">
                            <AlertCircle size={12} className="text-zinc-500" />
                            {t("watch.server_tip")}
                        </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                        {/* Server Buttons */}
                        <div className="flex flex-wrap gap-2.5 flex-1 min-w-[280px]">
                            <button
                                onClick={() => setActiveServer("vidsrc")}
                                className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold transition-all cursor-pointer ${activeServer === "vidsrc"
                                        ? "bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-600/25"
                                        : "bg-white/5 border-white/5 text-zinc-300 hover:bg-white/10 hover:text-white"
                                    }`}
                            >
                                <span className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
                                Server 1 (VidSrc)
                            </button>

                            <button
                                onClick={() => setActiveServer("superembed")}
                                className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold transition-all cursor-pointer ${activeServer === "superembed"
                                        ? "bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-600/25"
                                        : "bg-white/5 border-white/5 text-zinc-300 hover:bg-white/10 hover:text-white"
                                    }`}
                            >
                                <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                                Server 2 (SuperEmbed)
                            </button>

                            <button
                                onClick={() => setActiveServer("embedsu")}
                                className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold transition-all cursor-pointer ${activeServer === "embedsu"
                                        ? "bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-600/25"
                                        : "bg-white/5 border-white/5 text-zinc-300 hover:bg-white/10 hover:text-white"
                                    }`}
                            >
                                <span className="w-2 h-2 rounded-full bg-sky-400 shrink-0" />
                                Server 3 (EmbedSu)
                            </button>
                        </div>

                        {/* Player Mode Buttons */}
                        <div className="flex flex-wrap items-center gap-2.5 pl-0 sm:pl-4 border-t sm:border-t-0 sm:border-l border-white/10 pt-3 sm:pt-0 w-full sm:w-auto justify-end">
                            {/* Ambient Theme Dots Selector */}
                            <div className="flex items-center gap-2 bg-white/5 border border-white/5 px-3 py-1.5 rounded-xl shrink-0">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 select-none">
                                    {t("watch.ambient_title")}
                                </span>
                                <div className="flex items-center gap-1.5 ml-1">
                                    {([
                                        { id: "black", color: "bg-[#09090b] border-white/30", label: t("watch.ambient_black") },
                                        { id: "purple", color: "bg-purple-600 border-purple-400", label: t("watch.ambient_purple") },
                                        { id: "blue", color: "bg-blue-600 border-blue-400", label: t("watch.ambient_blue") },
                                        { id: "red", color: "bg-rose-600 border-rose-500", label: t("watch.ambient_red") }
                                    ] as const).map((themeOpt) => (
                                        <button
                                            key={themeOpt.id}
                                            onClick={() => {
                                                setAmbientTheme(themeOpt.id);
                                                try {
                                                    localStorage.setItem("nontonyuk_ambient_theme", themeOpt.id);
                                                } catch (e) {
                                                    console.error(e);
                                                }
                                                showToast(
                                                    locale === "id"
                                                        ? `Atmosfer ruangan diganti ke ${themeOpt.label}`
                                                        : `Room atmosphere changed to ${themeOpt.label}`,
                                                    "success"
                                                );
                                            }}
                                            className={clsx(
                                                "w-4.5 h-4.5 rounded-full border transition-all cursor-pointer hover:scale-110 active:scale-95",
                                                themeOpt.color,
                                                ambientTheme === themeOpt.id ? "ring-2 ring-purple-500 border-white" : "border-transparent"
                                            )}
                                            title={themeOpt.label}
                                        />
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={toggleTheaterMode}
                                className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold transition-all cursor-pointer ${isTheaterMode
                                        ? "bg-purple-600/25 border-purple-500/50 text-purple-300 shadow-md shadow-purple-600/20"
                                        : "bg-white/5 border-white/5 text-zinc-400 hover:bg-white/10 hover:text-white"
                                    }`}
                                title={isTheaterMode ? (locale === "id" ? "Matikan Mode Bioskop (T)" : "Turn off Theater Mode (T)") : (locale === "id" ? "Nyalakan Mode Bioskop (T)" : "Turn on Theater Mode (T)")}
                            >
                                {isTheaterMode ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                                <span>{locale === "id" ? "Bioskop" : "Theater"}</span>
                            </button>

                            <button
                                onClick={toggleLightsDimmed}
                                className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold transition-all cursor-pointer ${isLightsDimmed
                                        ? "bg-yellow-500/25 border-yellow-500/40 text-yellow-300 shadow-md shadow-yellow-500/20"
                                        : "bg-white/5 border-white/5 text-zinc-400 hover:bg-white/10 hover:text-white"
                                    }`}
                                title={isLightsDimmed ? (locale === "id" ? "Nyalakan Lampu (L / ESC)" : "Turn on Lights (L / ESC)") : (locale === "id" ? "Redupkan Lampu (L)" : "Dim Lights (L)")}
                            >
                                {isLightsDimmed ? <Lightbulb size={16} /> : <LightbulbOff size={16} />}
                                <span>{locale === "id" ? "Lampu" : "Lights"}</span>
                            </button>

                            {/* Keyboard Shortcuts Trigger Button */}
                            <button
                                onClick={() => setIsShortcutsOpen(true)}
                                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-white/5 bg-white/5 text-zinc-400 hover:bg-purple-600/20 hover:border-purple-500/40 hover:text-purple-300 text-xs sm:text-sm font-semibold transition-all cursor-pointer"
                                title={locale === "id" ? "Panduan Tombol Pintas (?)" : "Keyboard Shortcuts (?)"}
                            >
                                <Keyboard size={16} />
                                <span className="hidden sm:inline">{locale === "id" ? "Pintasan" : "Shortcuts"}</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Series Quick Episode Navigation & Auto-Next Bar */}
                {isSeries && (
                    <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-lg">
                        <div className="flex items-center gap-2">
                            <button
                                disabled={!hasPrevEpisode}
                                onClick={() => {
                                    if (prevEpisode) {
                                        showHUD(`⏮️ Episode ${prevEpisode.episode_number}: ${prevEpisode.title}`);
                                        router.push(`/watch/${id}?ep=${prevEpisode.episode_number}`);
                                    }
                                }}
                                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${hasPrevEpisode
                                        ? "bg-white/10 hover:bg-purple-600 hover:text-white text-zinc-200 border border-white/10 cursor-pointer active:scale-95"
                                        : "bg-white/5 text-zinc-600 border border-white/5 cursor-not-allowed opacity-50"
                                    }`}
                                title={locale === "id" ? "Episode Sebelumnya (P)" : "Previous Episode (P)"}
                            >
                                <ChevronLeft size={16} />
                                <span>{locale === "id" ? "Sebelumnya" : "Prev"}</span>
                            </button>

                            <div className="px-3 py-1.5 rounded-xl bg-purple-950/40 border border-purple-500/30 text-purple-300 text-xs sm:text-sm font-bold">
                                {locale === "id" ? `Episode ${currentEpNumber} dari ${totalEpisodes}` : `Episode ${currentEpNumber} of ${totalEpisodes}`}
                            </div>

                            <button
                                disabled={!hasNextEpisode}
                                onClick={() => {
                                    if (nextEpisode) {
                                        showHUD(`⏭️ Episode ${nextEpisode.episode_number}: ${nextEpisode.title}`);
                                        router.push(`/watch/${id}?ep=${nextEpisode.episode_number}`);
                                    }
                                }}
                                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${hasNextEpisode
                                        ? "bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/25 border border-purple-500/50 cursor-pointer active:scale-95"
                                        : "bg-white/5 text-zinc-600 border border-white/5 cursor-not-allowed opacity-50"
                                    }`}
                                title={locale === "id" ? "Episode Berikutnya (N)" : "Next Episode (N)"}
                            >
                                <span>{locale === "id" ? "Berikutnya" : "Next"}</span>
                                <ChevronRight size={16} />
                            </button>
                        </div>

                        {/* Auto-Next Toggle */}
                        {hasNextEpisode && (
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={toggleAutoNext}
                                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${isAutoNextEnabled
                                            ? "bg-purple-950/40 border-purple-500/30 text-purple-300"
                                            : "bg-white/5 border-white/5 text-zinc-400 hover:text-zinc-200"
                                        }`}
                                >
                                    <Timer size={14} className={isAutoNextEnabled ? "text-purple-400" : "text-zinc-500"} />
                                    <span>{locale === "id" ? "Auto-Next Episode" : "Auto-Next Episode"}:</span>
                                    <span className={isAutoNextEnabled ? "text-emerald-400 font-bold" : "text-zinc-500"}>
                                        {isAutoNextEnabled ? "ON" : "OFF"}
                                    </span>
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Auto-Play Next Episode Countdown / Banner */}
                {isSeries && nextEpisode && (
                    <div className="relative overflow-hidden bg-gradient-to-r from-purple-950/30 via-zinc-900/70 to-zinc-900/40 border border-purple-500/30 rounded-2xl p-5 shadow-2xl space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-purple-300 bg-purple-900/40 px-2 py-0.5 rounded border border-purple-500/30 uppercase tracking-wider">
                                        <Timer size={12} />
                                        {t("watch.next_episode_tag")}
                                    </span>
                                    {isAutoNextActive && (
                                        <span className="text-xs font-bold text-amber-400 animate-pulse">
                                            {locale === "id" ? `Memutar dalam ${autoNextCountdown}s...` : `Playing in ${autoNextCountdown}s...`}
                                        </span>
                                    )}
                                </div>
                                <h4 className="text-base sm:text-lg font-bold text-white">
                                    Episode {nextEpisode.episode_number}: {nextEpisode.title}
                                </h4>
                            </div>

                            <div className="flex items-center gap-3">
                                {isAutoNextActive ? (
                                    <button
                                        onClick={() => setIsAutoNextActive(false)}
                                        className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition-colors cursor-pointer"
                                    >
                                        {locale === "id" ? "Batalkan Countdown" : "Cancel Countdown"}
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => {
                                            setIsAutoNextActive(true);
                                            setAutoNextCountdown(10);
                                        }}
                                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 text-xs font-semibold border border-white/5 transition-colors cursor-pointer"
                                    >
                                        <Timer size={14} />
                                        {locale === "id" ? "Hitung Mundur (10s)" : "Countdown (10s)"}
                                    </button>
                                )}

                                <Link
                                    href={`/watch/${id}?ep=${nextEpisode.episode_number}`}
                                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-sm transition-all shadow-lg shadow-purple-600/25 active:scale-95 cursor-pointer"
                                >
                                    <Play size={14} className="fill-white" /> {t("watch.next_episode_btn")} {nextEpisode.episode_number}
                                </Link>
                            </div>
                        </div>

                        {/* Animated Countdown Progress Bar */}
                        {isAutoNextActive && (
                            <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                                <div
                                    className="bg-purple-500 h-full rounded-full transition-all duration-1000 ease-linear"
                                    style={{ width: `${(autoNextCountdown / 10) * 100}%` }}
                                />
                            </div>
                        )}
                    </div>
                )}

                {/* Details Section */}
                <div className="flex flex-col gap-8 border-b border-white/10 pb-8">
                    {/* Header Info */}
                    <div className="space-y-4">
                        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-2">
                            {movie?.title || "Loading..."}
                            {isSeries && (
                                <span className="text-purple-400 font-normal text-2xl ml-3">
                                    Episode {currentEpNumber}
                                </span>
                            )}
                        </h1>
                        {currentEpisode?.title && (
                            <h2 className="text-xl text-purple-300 font-medium">
                                {currentEpisode.title}
                            </h2>
                        )}

                        <div className="flex items-center gap-4 text-sm font-medium text-gray-400">
                            <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1">
                                <Star size={12} className="fill-amber-400 text-amber-400" />
                                IMDb {movie?.vote || "N/A"}
                            </span>
                            <span>{displayYear}</span>
                            <span>•</span>
                            <span className="capitalize">{displayGenre}</span>
                        </div>
                    </div>

                    {/* Episode List (For Series) */}
                    {isSeries && movie?.episodes && (
                        <div className="bg-zinc-900/50 rounded-2xl p-6 border border-white/10">
                            <h3 className="text-xl font-bold mb-4 text-zinc-200">{t("modal.episodes_title")}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {movie.episodes.map((ep) => (
                                    <Link
                                        key={ep.episode_number}
                                        href={`/watch/${id}?ep=${ep.episode_number}`}
                                        className={`flex items-center gap-4 p-3 rounded-xl transition-all ${currentEpNumber === ep.episode_number
                                                ? "bg-purple-600/30 border border-purple-500/60 shadow-lg shadow-purple-600/10"
                                                : "hover:bg-white/5 border border-white/5"
                                            }`}
                                    >
                                        <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-purple-600/30 text-purple-300 text-sm font-bold">
                                            {ep.episode_number}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p
                                                className={`text-sm font-semibold truncate ${currentEpNumber === ep.episode_number
                                                        ? "text-purple-300"
                                                        : "text-zinc-300"
                                                    }`}
                                            >
                                                {ep.title}
                                            </p>
                                        </div>
                                        {currentEpNumber === ep.episode_number && (
                                            <div className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-pulse" />
                                        )}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Description */}
                    <div className="max-w-3xl text-gray-300 text-base leading-relaxed mt-2">
                        <p>{t("watch.description")}</p>
                    </div>
                </div>

                {/* Reviews & Comments Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">
                    {/* Left: Summary and Submission Form */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="flex items-center gap-2">
                            <MessageSquare size={20} className="text-purple-400" />
                            <h3 className="text-xl font-bold text-white">{t("watch.reviews_title")}</h3>
                        </div>

                        {/* Rating Stats Summary */}
                        <div className="bg-zinc-900/40 border border-white/5 rounded-2xl p-5 space-y-3">
                            <h4 className="text-sm font-semibold text-zinc-400">{t("watch.reviews_average")}</h4>
                            {avgRating ? (
                                <div className="flex items-baseline gap-2">
                                    <span className="text-4xl font-extrabold text-white">{avgRating}</span>
                                    <span className="text-sm text-zinc-500">{t("watch.reviews_stars")}</span>
                                    <div className="flex items-center text-amber-400 gap-0.5 ml-2">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <Star
                                                key={i}
                                                size={16}
                                                className={i < Math.round(parseFloat(avgRating)) ? "fill-amber-400" : "text-zinc-700"}
                                            />
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <p className="text-sm text-zinc-400">{t("watch.reviews_empty_local")}</p>
                            )}
                            <p className="text-xs text-zinc-500">
                                {t("watch.reviews_count_prefix")} {totalReviews} {t("watch.reviews_count_suffix")}
                            </p>
                        </div>

                        {/* Review Form */}
                        <form onSubmit={handleCommentSubmit} className="bg-zinc-900/40 border border-white/5 rounded-2xl p-5 space-y-4">
                            <h4 className="text-sm font-bold text-zinc-200">{t("watch.form_title")}</h4>

                            {/* Stars Rating Selector */}
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">{t("watch.form_rating")}</label>
                                <div className="flex items-center gap-1.5">
                                    {Array.from({ length: 5 }).map((_, i) => {
                                        const starValue = i + 1;
                                        const active = (hoveredStar || commentRating) >= starValue;
                                        return (
                                            <button
                                                key={i}
                                                type="button"
                                                onClick={() => setCommentRating(starValue)}
                                                onMouseEnter={() => setHoveredStar(starValue)}
                                                onMouseLeave={() => setHoveredStar(0)}
                                                className="transition-transform active:scale-90 text-zinc-650 cursor-pointer"
                                            >
                                                <Star
                                                    size={24}
                                                    className={`${active ? "fill-amber-400 text-amber-400" : "text-zinc-650"}`}
                                                />
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Name Input */}
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">{t("watch.form_name")}</label>
                                <input
                                    type="text"
                                    value={commentName}
                                    onChange={(e) => setCommentName(e.target.value)}
                                    placeholder={t("watch.form_name_placeholder")}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-3.5 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                                />
                            </div>

                            {/* Text Input */}
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">{t("watch.form_comment")}</label>
                                <textarea
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                    placeholder={t("watch.form_comment_placeholder")}
                                    rows={3}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-3.5 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-purple-500 resize-none"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-sm transition-colors shadow-lg shadow-purple-600/20 cursor-pointer"
                            >
                                <Send size={14} />
                                {t("watch.form_submit")}
                            </button>
                        </form>
                    </div>

                    {/* Right: Comments List */}
                    <div className="lg:col-span-2 space-y-4">
                        <h4 className="text-lg font-bold text-white">{t("watch.list_title")} ({comments.length})</h4>

                        {comments.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-14 text-center border border-dashed border-white/15 rounded-2xl text-zinc-400 space-y-2 bg-zinc-900/10">
                                <MessageSquare size={32} className="text-zinc-600" />
                                <p className="text-sm font-semibold">{t("watch.list_empty")}</p>
                                <p className="text-xs text-zinc-500 max-w-xs">{t("watch.list_empty_desc")}</p>
                            </div>
                        ) : (
                            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 divide-y divide-white/5">
                                {comments.map((comment) => (
                                    <div key={comment.id} className="pt-4 first:pt-0 flex items-start gap-4 group">
                                        {/* Avatar */}
                                        <div className="relative w-10 h-10 rounded-full overflow-hidden bg-purple-900/40 border border-white/10 shrink-0">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={comment.avatar}
                                                alt={comment.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>

                                        {/* Content Box */}
                                        <div className="flex-1 min-w-0 space-y-1">
                                            <div className="flex items-center justify-between gap-2">
                                                <h5 className="text-sm font-bold text-white truncate">{comment.name}</h5>
                                                <button
                                                    onClick={() => handleDeleteComment(comment.id)}
                                                    className="text-zinc-500 hover:text-rose-455 p-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                                    title="Hapus ulasan"
                                                >
                                                    <Trash2 size={13} />
                                                </button>
                                            </div>

                                            {/* Rating Stars & Timestamp */}
                                            <div className="flex items-center gap-2">
                                                <div className="flex items-center text-amber-400 gap-0.5">
                                                    {Array.from({ length: 5 }).map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            size={12}
                                                            className={i < comment.rating ? "fill-amber-400" : "text-zinc-700"}
                                                        />
                                                    ))}
                                                </div>
                                                <span className="text-[10px] text-zinc-500">
                                                    {new Date(comment.createdAt).toLocaleDateString(locale === "id" ? "id-ID" : "en-US", {
                                                        day: "numeric",
                                                        month: "short",
                                                        year: "numeric",
                                                    })}
                                                </span>
                                            </div>

                                            <p className="text-sm text-zinc-350 leading-relaxed font-normal pt-1">
                                                {comment.text}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Keyboard Shortcuts Modal */}
            <KeyboardShortcutsModal
                isOpen={isShortcutsOpen}
                onClose={() => setIsShortcutsOpen(false)}
            />
        </main>
    );
}
