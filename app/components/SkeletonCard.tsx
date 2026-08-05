import { clsx } from "clsx";

export function SkeletonCard() {
    return (
        <div className="flex flex-col gap-3">
            <div className="aspect-[2/3] w-full rounded-xl shimmer-bg border border-white/5" />
            <div className="space-y-2">
                <div className="h-5 w-3/4 rounded shimmer-bg" />
                <div className="h-4 w-1/4 rounded shimmer-bg" />
            </div>
        </div>
    );
}
