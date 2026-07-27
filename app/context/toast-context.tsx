"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from "lucide-react";

export type ToastType = "success" | "info" | "warning" | "error";

export interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((message: string, type: ToastType = "info") => {
        const id = Math.random().toString(36).substring(2, 9);
        setToasts((prev) => [...prev, { id, message, type }]);

        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 3000);
    }, []);

    const removeToast = (id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    const getIcon = (type: ToastType) => {
        switch (type) {
            case "success":
                return <CheckCircle2 className="text-green-400 shrink-0" size={18} />;
            case "warning":
                return <AlertTriangle className="text-amber-400 shrink-0" size={18} />;
            case "error":
                return <XCircle className="text-rose-400 shrink-0" size={18} />;
            case "info":
            default:
                return <Info className="text-purple-400 shrink-0" size={18} />;
        }
    };

    const getStyles = (type: ToastType) => {
        switch (type) {
            case "success":
                return "bg-green-950/70 border-green-500/20 shadow-green-950/20 text-green-100";
            case "warning":
                return "bg-amber-950/70 border-amber-500/20 shadow-amber-950/20 text-amber-100";
            case "error":
                return "bg-rose-950/70 border-rose-500/20 shadow-rose-950/20 text-rose-100";
            case "info":
            default:
                return "bg-purple-950/70 border-purple-500/20 shadow-purple-950/20 text-purple-100";
        }
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}

            {/* Float Container */}
            <div className="fixed bottom-6 right-6 z-[150] space-y-3 flex flex-col items-end pointer-events-none max-w-sm w-full px-4 sm:px-0">
                <AnimatePresence>
                    {toasts.map((toast) => (
                        <motion.div
                            key={toast.id}
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9, y: -10 }}
                            transition={{ duration: 0.25 }}
                            className={`pointer-events-auto flex items-center justify-between gap-3 px-4 py-3.5 rounded-xl border backdrop-blur-md shadow-2xl w-full ${getStyles(
                                toast.type
                            )}`}
                        >
                            <div className="flex items-center gap-3 min-w-0">
                                {getIcon(toast.type)}
                                <p className="text-xs sm:text-sm font-semibold truncate leading-relaxed">
                                    {toast.message}
                                </p>
                            </div>
                            <button
                                onClick={() => removeToast(toast.id)}
                                className="text-white/40 hover:text-white transition-colors p-1"
                            >
                                <X size={14} />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
}
