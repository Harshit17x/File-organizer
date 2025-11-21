import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: "class",
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: [
                    "-apple-system",
                    "BlinkMacSystemFont",
                    "Segoe UI",
                    "Roboto",
                    "Helvetica",
                    "Arial",
                    "sans-serif",
                    "Apple Color Emoji",
                    "Segoe UI Emoji",
                    "Segoe UI Symbol",
                ],
            },
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                card: "var(--card-bg)",
                "card-border": "var(--card-border)",
                "text-primary": "var(--text-primary)",
                "text-secondary": "var(--text-secondary)",
                "text-muted": "var(--text-muted)",
                "neon-blue": "#4361ee",
                "neon-purple": "#7209b7",
                "neon-cyan": "#4cc9f0",
            },
        },
    },
    plugins: [],
};
export default config;
