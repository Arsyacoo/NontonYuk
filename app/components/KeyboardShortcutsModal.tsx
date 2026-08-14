"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Keyboard, Sparkles } from "lucide-react";
import { useLanguage } from "@/app/context/language-context";

interface KeyboardShortcutsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function KeyboardShortcutsModal({ isOpen, onClose }: KeyboardShortcutsModalProps) {
    const { locale } = useLanguage();

    if (!isOpen) return null;

    const shortcuts = [
        {
            key: "T",
            label: locale === "id" ? "Mode Bioskop (Theater)" : "Theater Mode",
            desc: locale === "id" ? "Perbesar layar pemutar video" : "Expand video player size",
        },
        {
            key: "L",
            label: locale === "id" ? "Redupkan Lampu (Lights)" : "Dim Lights",
            desc: locale === "id" ? "Fokus menonton tanpa distraksi" : "Focus on video with dimmed UI",
        },
        {
            key: "F",
            label: locale === "id" ? "Layar Penuh (Fullscreen)" : "Fullscreen",
            desc: locale === "id" ? "Masuk ke mode layar penuh" : "Toggle full browser screen",
        },
        {
            key: "N",
            label: locale === "id" ? "Episode Selanjutnya" : "Next Episode",
            desc: locale === "id" ? "Lompat ke episode berikutnya (Serial)" : "Jump to next episode (Series)",
        },
        {
            key: "P",
            label: locale === "id" ? "Episode Sebelumnya" : "Previous Episode",
            desc: locale === "id" ? "Kembali ke episode sebelumnya (Serial)" : "Go back to previous episode",
        },
        {
            key: "Esc",
            label: locale === "id" ? "Keluar / Nyalakan Lampu" : "Exit / Lights On",
            desc: locale === "id" ? "Nyalakan lampu atau tutup popup" : "Turn lights back on or close popup",
        },
        {
            key: "?",
            label: locale === "id" ? "Panduan Pintasan" : "Shortcuts Guide",
            desc: locale === "id" ? "Buka panduan tombol ini kapan saja" : "Open this keyboard helper anytime",
        },
    ];

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="fixed inset-0 bg-black/80 backdrop-blur-md"
                />

                {/* Modal Window */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.92, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.92, y: 15 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-purple-500/30 bg-[#121217] p-6 shadow-2xl shadow-purple-950/40 z-10"
                >
                    {/* Background glow accent */}
                    <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-purple-600/20 blur-3xl pointer-events-none" />
                    <div className="absolute -left-16 -bottom-16 h-48 w-48 rounded-full bg-blue-600/15 blur-3xl pointer-events-none" />

                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-400">
                                <Keyboard size={20} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                    {locale === "id" ? "Pintasan Keyboard Bioskop" : "Cinema Keyboard Shortcuts"}
                                    <Sparkles size={16} className="text-amber-400" />
                                </h3>
                                <p className="text-xs text-zinc-400">
                                    {locale === "id"
                                        ? "Kendalikan pemutar film dengan tombol cepat"
                                        : "Control player easily with your keyboard"}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="rounded-full p-2 text-zinc-400 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* Shortcut List */}
                    <div className="mt-4 space-y-2.5 max-h-[60vh] overflow-y-auto pr-1">
                        {shortcuts.map((sc, idx) => (
                            <div
                                key={idx}
                                className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.03] p-3 transition-colors hover:bg-white/[0.06] hover:border-white/10"
                            >
                                <div className="space-y-0.5 pr-3">
                                    <p className="text-sm font-semibold text-zinc-100">{sc.label}</p>
                                    <p className="text-xs text-zinc-400">{sc.desc}</p>
                                </div>
                                <div className="shrink-0">
                                    <kbd className="inline-flex min-w-[32px] items-center justify-center rounded-lg border border-purple-500/30 bg-purple-950/40 px-2.5 py-1.5 text-xs font-bold text-purple-300 shadow-md shadow-purple-950/50">
                                        {sc.key}
                                    </kbd>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Footer Tip */}
                    <div className="mt-5 rounded-xl bg-purple-900/20 border border-purple-500/20 p-3 text-center">
                        <p className="text-xs text-purple-300/90">
                            {locale === "id"
                                ? "💡 Tip: Tekan tombol '?' kapan saja saat menonton untuk membuka panduan ini."
                                : "💡 Tip: Press '?' anytime while watching to open this guide."}
                        </p>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
