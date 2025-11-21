"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Avoid hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-gray-500 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/5 hover:text-foreground dark:hover:text-white transition-all duration-200"
        >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            <span className="font-medium">
                {theme === "dark" ? "Light Mode" : "Dark Mode"}
            </span>
        </button>
    );
}
