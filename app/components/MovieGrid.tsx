import { ReactNode } from "react";

interface MovieGridProps {
    children: ReactNode;
}

export function MovieGrid({ children }: MovieGridProps) {
    return (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6 lg:gap-8 xl:grid-cols-6">
            {children}
        </div>
    );
}
