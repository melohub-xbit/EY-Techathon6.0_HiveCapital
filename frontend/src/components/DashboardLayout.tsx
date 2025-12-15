import { useState, ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { DashboardNavbar } from "./DashboardNavbar";
import { SidebarContext } from "./SidebarContext";

// Re-export useSidebar for backwards compatibility
export { useSidebar } from "./SidebarContext";

interface DashboardLayoutProps {
    children: ReactNode;
    title?: string;
    subtitle?: string;
}

export const DashboardLayout = ({ children, title, subtitle }: DashboardLayoutProps) => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const toggleSidebar = () => setIsCollapsed(!isCollapsed);
    const setCollapsed = (collapsed: boolean) => setIsCollapsed(collapsed);

    return (
        <SidebarContext.Provider value={{ isCollapsed, toggleSidebar, setCollapsed }}>
            <div className="min-h-screen bg-[#0A0F0D] text-white flex overflow-x-hidden">
                {/* Sidebar */}
                <Sidebar />

                {/* Main Content */}
                <div
                    className={`flex-1 flex flex-col transition-all duration-300 ${isCollapsed ? "md:ml-20" : "md:ml-64"
                        }`}
                >
                    {/* Navbar */}
                    <DashboardNavbar title={title} subtitle={subtitle} />

                    {/* Page Content */}
                    <main className="flex-1 overflow-y-auto p-6">
                        {children}
                    </main>
                </div>
            </div>
        </SidebarContext.Provider>
    );
};
