/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                // Semantic colors from CSS variables
                border: "rgb(var(--border))",
                input: "rgb(var(--input))",
                ring: "rgb(var(--ring))",
                background: "rgb(var(--background))",
                foreground: "rgb(var(--foreground))",
                primary: {
                    DEFAULT: "rgb(var(--primary))",
                    foreground: "rgb(var(--primary-foreground))",
                },
                secondary: {
                    DEFAULT: "rgb(var(--secondary))",
                    foreground: "rgb(var(--secondary-foreground))",
                },
                destructive: {
                    DEFAULT: "rgb(var(--destructive))",
                    foreground: "rgb(var(--destructive-foreground))",
                },
                muted: {
                    DEFAULT: "rgb(var(--muted))",
                    foreground: "rgb(var(--muted-foreground))",
                },
                accent: {
                    DEFAULT: "rgb(var(--accent))",
                    foreground: "rgb(var(--accent-foreground))",
                },
                popover: {
                    DEFAULT: "rgb(var(--popover))",
                    foreground: "rgb(var(--popover-foreground))",
                },
                card: {
                    DEFAULT: "rgb(var(--card))",
                    foreground: "rgb(var(--card-foreground))",
                },
                success: {
                    DEFAULT: "rgb(var(--success))",
                    foreground: "rgb(var(--success-foreground))",
                },
                warning: {
                    DEFAULT: "rgb(var(--warning))",
                    foreground: "rgb(var(--warning-foreground))",
                },
                // Emerald palette
                emerald: {
                    50: "rgb(var(--emerald-50))",
                    100: "rgb(var(--emerald-100))",
                    200: "rgb(var(--emerald-200))",
                    300: "rgb(var(--emerald-300))",
                    400: "rgb(var(--emerald-400))",
                    500: "rgb(var(--emerald-500))",
                    600: "rgb(var(--emerald-600))",
                    700: "rgb(var(--emerald-700))",
                    800: "rgb(var(--emerald-800))",
                    900: "rgb(var(--emerald-900))",
                },
                // Gold palette
                gold: {
                    50: "rgb(var(--gold-50))",
                    100: "rgb(var(--gold-100))",
                    200: "rgb(var(--gold-200))",
                    300: "rgb(var(--gold-300))",
                    400: "rgb(var(--gold-400))",
                    500: "rgb(var(--gold-500))",
                    600: "rgb(var(--gold-600))",
                    700: "rgb(var(--gold-700))",
                    800: "rgb(var(--gold-800))",
                    900: "rgb(var(--gold-900))",
                },
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            animation: {
                'float': 'float 3s ease-in-out infinite',
                'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
                'shimmer': 'shimmer 2s infinite',
                'gradient': 'gradient-flow 8s ease infinite',
                'fade-in-up': 'fade-in-up 0.6s ease-out forwards',
                'spin-slow': 'spin-slow 20s linear infinite',
            },
        },
    },
    plugins: [],
}
