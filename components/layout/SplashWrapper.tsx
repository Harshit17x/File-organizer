"use client";

import { ReactNode, useEffect, useState } from "react";
import { SplashScreen } from "@/components/ui/SplashScreen";
import { AnimatePresence } from "framer-motion";

export function SplashWrapper({ children }: { children: ReactNode }) {
    const [isLoading, setIsLoading] = useState(true);

    // Optional: Check if we've already shown the splash screen in this session
    // to avoid showing it on every refresh if desired.
    // For now, we'll show it on every hard refresh as requested.

    return (
        <>
            <AnimatePresence mode="wait">
                {isLoading && (
                    <SplashScreen onComplete={() => setIsLoading(false)} />
                )}
            </AnimatePresence>

            {!isLoading && children}
        </>
    );
}
