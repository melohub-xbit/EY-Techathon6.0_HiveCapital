import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Menu,
    ChevronRight,
    X,
    Settings,
    User,
    LogOut
} from "lucide-react";
import { useSidebar } from "./SidebarContext";
import { useNavigate } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";

interface DashboardNavbarProps {
    title?: string;
    subtitle?: string;
}

// Simple Modal Component
const Modal = ({
    isOpen,
    onClose,
    title,
    children
}: {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}) => (
    <AnimatePresence>
        {isOpen && (
            <>
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                />
                {/* Modal */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -20 }}
                    className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl z-50 overflow-hidden"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    {/* Content */}
                    <div className="p-6">
                        {children}
                    </div>
                </motion.div>
            </>
        )}
    </AnimatePresence>
);

export const DashboardNavbar = ({ title = "Dashboard", subtitle }: DashboardNavbarProps) => {
    const { isCollapsed, toggleSidebar } = useSidebar();
    const navigate = useNavigate();
    const [showNotifications, setShowNotifications] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);

    return (
        <>
            <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border transition-colors duration-300">
                <div className="flex items-center justify-between px-6 py-4">
                    {/* Left Section */}
                    <div className="flex items-center gap-4">
                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={toggleSidebar}
                            className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                        >
                            <Menu className="w-6 h-6" />
                        </button>

                        {/* Breadcrumb / Title */}
                        <div className="flex items-center gap-2">
                            {!isCollapsed && (
                                <motion.span
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-muted-foreground text-sm hidden md:inline"
                                >
                                    Dashboard
                                </motion.span>
                            )}
                            {!isCollapsed && subtitle && (
                                <ChevronRight className="w-4 h-4 text-muted-foreground hidden md:inline" />
                            )}
                            <h1 className="text-lg font-semibold text-foreground">{title}</h1>
                        </div>
                    </div>

                    {/* Right Section */}
                    <div className="flex items-center gap-3">
                        {/* Search */}
                        {/* Search */}
                        {/* <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary/50 border border-border text-muted-foreground hover:border-emerald-500/30 transition-colors cursor-pointer group w-64">
                            <Search className="w-4 h-4 group-hover:text-emerald-500 transition-colors" />
                            <span className="text-sm">Search...</span>
                            <kbd className="ml-auto px-2 py-0.5 rounded bg-muted text-xs text-muted-foreground">⌘K</kbd>
                        </div> */}

                        {/* Theme Toggle */}
                        <ThemeToggle />

                        {/* Notifications */}
                        

                        {/* User Avatar */}
                        
                    </div>
                </div>
            </header>

            {/* Notifications Modal */}
            <Modal
                isOpen={showNotifications}
                onClose={() => setShowNotifications(false)}
                title="Notifications"
            >
                <div className="space-y-4">
                    {/* Sample notifications */}
                    {[
                        { title: "Application Approved", desc: "Your loan application #12345 has been approved.", time: "2 min ago", unread: true },
                        { title: "Document Required", desc: "Please upload your latest salary slip.", time: "1 hour ago", unread: true },
                        { title: "Welcome!", desc: "Thank you for joining Hive Capital.", time: "2 days ago", unread: false }
                    ].map((notif, i) => (
                        <div
                            key={i}
                            className={`p-4 rounded-xl border transition-colors cursor-pointer ${notif.unread
                                ? 'bg-emerald-500/10 border-emerald-500/20 hover:border-emerald-500/40'
                                : 'bg-secondary/50 border-border hover:border-foreground/20'
                                }`}
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <p className="text-foreground font-medium text-sm">{notif.title}</p>
                                    <p className="text-muted-foreground text-sm mt-1">{notif.desc}</p>
                                </div>
                                {notif.unread && (
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0 mt-1.5" />
                                )}
                            </div>
                            <p className="text-muted-foreground/70 text-xs mt-2">{notif.time}</p>
                        </div>
                    ))}
                </div>
                <button className="w-full mt-4 py-3 rounded-xl bg-secondary hover:bg-muted border border-border text-muted-foreground hover:text-foreground transition-all text-sm font-medium">
                    View All Notifications
                </button>
            </Modal>

            {/* User Profile Modal */}
            <Modal
                isOpen={showUserMenu}
                onClose={() => setShowUserMenu(false)}
                title="Account"
            >
                <div className="space-y-4">
                    {/* User Info */}
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-secondary/50 border border-border">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-gold-500 flex items-center justify-center text-white font-bold text-xl">
                            TC
                        </div>
                        <div>
                            <p className="text-foreground font-semibold">Tata User</p>
                            <p className="text-muted-foreground text-sm">user@tatacapital.com</p>
                            <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-medium">Admin</span>
                        </div>
                    </div>

                    {/* Menu Options */}
                    <div className="space-y-2">
                        <button
                            onClick={() => { setShowUserMenu(false); navigate('/profile'); }}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-all text-left"
                        >
                            <User className="w-5 h-5" />
                            <span>View Profile</span>
                        </button>
                        <button
                            onClick={() => { setShowUserMenu(false); navigate('/settings'); }}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-all text-left"
                        >
                            <Settings className="w-5 h-5" />
                            <span>Settings</span>
                        </button>
                        <div className="border-t border-border pt-2">
                            <button
                                onClick={() => { setShowUserMenu(false); navigate('/'); }}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-rose-400/80 hover:text-rose-400 hover:bg-rose-500/10 transition-all text-left"
                            >
                                <LogOut className="w-5 h-5" />
                                <span>Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    );
};

