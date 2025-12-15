import { Moon, Sun } from "lucide-react"
import { useTheme } from "@/components/ThemeProvider"
import { motion } from "framer-motion"

export function ThemeToggle() {
    const { theme, setTheme } = useTheme()

    return (
        <motion.button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-xl bg-secondary hover:bg-muted transition-colors border border-border"
            title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
        >
            <div className="relative w-5 h-5">
                <Sun className="h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 absolute top-0 left-0 text-amber-500" />
                <Moon className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 absolute top-0 left-0 text-emerald-400" />
            </div>
            <span className="sr-only">Toggle theme</span>
        </motion.button>
    )
}
