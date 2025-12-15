import { Navbar } from "./Navbar";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
      <Navbar />
      <main className="flex-1 flex flex-col pt-16">
        {children}
      </main>
      <footer className="py-6 text-center text-sm text-gray-500 border-t border-gray-100 bg-white">
        <p>© {new Date().getFullYear()} EY Techathon Project. Built with love & AI.</p>
      </footer>
    </div>
  );
}
