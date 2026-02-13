import { clsx } from "clsx";

export function SkeletonCard() {
    return (
        <div className="flex flex-col gap-3">
            <div className="aspect-[2/3] w-full rounded-xl bg-white/5 animate-pulse border border-white/5" />
            <div className="space-y-1">
                <div className="h-5 w-3/4 rounded bg-white/5 animate-pulse" />
                <div className="h-4 w-1/4 rounded bg-white/5 animate-pulse" />
            </div>
        </div>
    );
}
