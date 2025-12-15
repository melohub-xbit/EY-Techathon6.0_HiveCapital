import { Link, useLocation } from "react-router-dom";
import { cn } from "../lib/utils";
import { MessageSquare, Home, Sparkles } from "lucide-react";

export function Navbar() {
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-white/5 backdrop-blur-md transition-all">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white shadow-lg shadow-blue-500/30">
                <Sparkles size={18} fill="currentColor" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            EY Techathon
            </span>
        </div>

        <div className="flex items-center gap-6">
          <Link
            to="/"
            className={cn(
              "text-sm font-medium transition-colors hover:text-blue-600",
              location.pathname === "/" ? "text-blue-600" : "text-gray-600"
            )}
          >
            <span className="flex items-center gap-1">
                <Home className="h-4 w-4" />
                Home
            </span>
          </Link>
          <Link
            to="/chat"
            className={cn(
              "text-sm font-medium transition-colors hover:text-blue-600",
              location.pathname === "/chat" ? "text-blue-600" : "text-gray-600"
            )}
          >
             <span className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4" />
                Chat
            </span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
