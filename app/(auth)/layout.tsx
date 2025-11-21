import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Content */}
            <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
                {children}
            </div>
        </div>
    );
}
