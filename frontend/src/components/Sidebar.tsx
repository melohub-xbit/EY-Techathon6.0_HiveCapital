import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import {
    MessageSquare,
    LayoutDashboard,
    LogOut,
    ChevronLeft,
    ChevronRight,
    Sparkles,
    Home
} from "lucide-react";
import { useSidebar } from "./SidebarContext";

interface NavItemProps {
    icon: React.ReactNode;
    label: string;
    path: string;
    isActive: boolean;
    isCollapsed: boolean;
    onClick: () => void;
}

const NavItem = ({ icon, label, isActive, isCollapsed, onClick }: NavItemProps) => (
    <motion.button
        onClick={onClick}
        className={`
      w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative
      ${isActive
                ? "bg-gradient-to-r from-emerald-500/20 to-emerald-600/10 text-emerald-500 border border-emerald-500/30"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }
    `}
        whileHover={{ x: 4 }}
        whileTap={{ scale: 0.98 }}
    >
        {/* Active indicator */}
        {isActive && (
            <motion.div
                layoutId="activeIndicator"
                className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-emerald-500 rounded-r-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            />
        )}

        <span className={`flex-shrink-0 ${isActive ? "text-emerald-500" : "text-muted-foreground group-hover:text-emerald-500"}`}>
            {icon}
        </span>

        <AnimatePresence>
            {!isCollapsed && (
                <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    className="font-medium whitespace-nowrap overflow-hidden"
                >
                    {label}
                </motion.span>
            )}
        </AnimatePresence>

        {/* Tooltip when collapsed */}
        {isCollapsed && (
            <div className="absolute left-full ml-2 px-3 py-2 rounded-lg bg-popover border border-border text-popover-foreground text-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                {label}
            </div>
        )}
    </motion.button>
);

export const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { isCollapsed, toggleSidebar } = useSidebar();

    const navItems = [
        { icon: <Home className="w-5 h-5" />, label: "Home", path: "/" },
        { icon: <MessageSquare className="w-5 h-5" />, label: "AI Assistant", path: "/chat" },
        { icon: <LayoutDashboard className="w-5 h-5" />, label: "Customer Data", path: "/mock-dashboard" },
        // { icon: <User className="w-5 h-5" />, label: "Profile", path: "/profile" },
        // { icon: <Settings className="w-5 h-5" />, label: "Settings", path: "/settings" },
    ];

    return (
        <>
            {/* Mobile Overlay */}
            <div
                className={`fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity ${!isCollapsed ? "opacity-100" : "opacity-0 pointer-events-none"
                    }`}
                onClick={toggleSidebar}
            />

            {/* Sidebar */}
            <motion.aside
                initial={false}
                animate={{ width: isCollapsed ? 80 : 256 }}
                className={`
          fixed left-0 top-0 h-full z-50
          bg-background/95 backdrop-blur-xl
          border-r border-border
          flex flex-col
          overflow-hidden
          transition-transform duration-300 md:translate-x-0
          ${isCollapsed ? "-translate-x-full md:translate-x-0" : "translate-x-0"}
        `}
            >
                {/* Logo Section */}
                <div className={`border-b border-border ${isCollapsed ? 'p-2' : 'p-4'}`}>
                    <div className="flex items-center justify-between">
                        {/* Clickable Logo - Redirects to Landing Page */}
                        <div
                            className="flex items-center gap-3 cursor-pointer group"
                            onClick={() => navigate('/')}
                        >
                            <motion.div
                                className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center glow-emerald flex-shrink-0 group-hover:glow-emerald-lg transition-all"
                                whileHover={{ scale: 1.05 }}
                            >
                                <Sparkles className="w-5 h-5 text-white" />
                            </motion.div>
                            <AnimatePresence>
                                {!isCollapsed && (
                                    <motion.div
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -10 }}
                                        className="overflow-hidden"
                                    >
                                        <h1 className="font-bold text-foreground whitespace-nowrap group-hover:text-emerald-400 transition-colors">Hive Capital</h1>
                                        <p className="text-xs text-emerald-500 whitespace-nowrap">AI Assistant</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Collapse Toggle Arrow */}
                        <motion.button
                            onClick={toggleSidebar}
                            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            {isCollapsed ? (
                                <ChevronRight className="w-4 h-4" />
                            ) : (
                                <ChevronLeft className="w-4 h-4" />
                            )}
                        </motion.button>
                    </div>
                </div>


                {/* Navigation */}
                <nav className={`flex-1 space-y-2 overflow-y-auto overflow-x-hidden scrollbar-thin ${isCollapsed ? 'p-2' : 'p-4'}`}>
                    {navItems.map((item) => (
                        <NavItem
                            key={item.path}
                            icon={item.icon}
                            label={item.label}
                            path={item.path}
                            isActive={location.pathname === item.path}
                            isCollapsed={isCollapsed}
                            onClick={() => navigate(item.path)}
                        />
                    ))}
                </nav>

                {/* Bottom Section */}
                <div className={`border-t border-border ${isCollapsed ? 'p-2' : 'p-4'}`}>
                    {/* Logout - TODO: Replace with proper auth logout logic */}
                    <button
                        onClick={() => {
                            // Temporary logout: redirect to landing page
                            // TODO: Implement proper authentication logout here
                            navigate('/');
                        }}
                        className={`
                            w-full flex items-center gap-3 px-4 py-3 rounded-xl
                            text-rose-400/80 hover:text-rose-400 hover:bg-rose-500/10
                            transition-all duration-200
                            ${isCollapsed ? "justify-center" : ""}
                        `}
                    >
                        <LogOut className="w-5 h-5 flex-shrink-0" />
                        {!isCollapsed && <span className="font-medium">Logout</span>}
                    </button>
                </div>
            </motion.aside>
        </>
    );
};
