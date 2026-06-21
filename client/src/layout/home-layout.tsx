import { Outlet, Link } from "react-router-dom";
import { GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";

const HomeLayout = () => {
  return (
    <div className="flex min-h-screen flex-col bg-background font-sans selection:bg-primary/10">
      {/* Navbar (Height: 64px, Sticky, z-50, bg-background/95, backdrop-blur) */}
      <header className="sticky top-0 z-50 w-full border-b border-[#E5E7EB] bg-background/95 backdrop-blur-md dark:border-[#334155]">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-[#2563EB]" />
            <Link to="/" className="text-xl font-bold tracking-tight text-[#0F172A] dark:text-[#F1F5F9]">
              edu<span className="text-[#2563EB]">Flow</span>
            </Link>
          </div>
          
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#64748B] dark:text-[#94A3B8]">
            <a href="#features" className="hover:text-[#0F172A] dark:hover:text-[#F1F5F9] transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-[#0F172A] dark:hover:text-[#F1F5F9] transition-colors">How It Works</a>
            <a href="#pricing" className="hover:text-[#0F172A] dark:hover:text-[#F1F5F9] transition-colors">Pricing</a>
          </nav>
          
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-medium text-[#64748B] hover:text-[#0F172A] dark:text-[#94A3B8] dark:hover:text-[#F1F5F9] transition-colors">
              Sign In
            </Link>
            <Button asChild size="sm" variant="default">
              <Link to="/register">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>

      {/* Footer (4-col links + copy) */}
      <footer className="border-t border-[#E5E7EB] bg-[#F8F9FA] dark:border-[#334155] dark:bg-[#1E293B]">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4 text-[#0F172A] dark:text-[#F1F5F9]">
                <GraduationCap className="h-5 w-5 text-[#2563EB]" />
                <span className="font-semibold tracking-tight">eduFlow</span>
              </div>
              <p className="text-sm text-[#64748B] dark:text-[#94A3B8] max-w-xs">
                The modern, minimal school operating system to coordinate academic rosters, billing, and communication.
              </p>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-[#0F172A] dark:text-[#F1F5F9] uppercase tracking-wider mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-[#64748B] dark:text-[#94A3B8]">
                <li><a href="#features" className="hover:text-[#2563EB] transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-[#2563EB] transition-colors">Pricing</a></li>
                <li><span className="opacity-50">API Reference</span></li>
                <li><span className="opacity-50">Integrations</span></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-[#0F172A] dark:text-[#F1F5F9] uppercase tracking-wider mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-[#64748B] dark:text-[#94A3B8]">
                <li><span className="opacity-50">About Us</span></li>
                <li><span className="opacity-50">Careers</span></li>
                <li><span className="opacity-50">Blog</span></li>
                <li><span className="opacity-50">Press Kit</span></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-[#0F172A] dark:text-[#F1F5F9] uppercase tracking-wider mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-[#64748B] dark:text-[#94A3B8]">
                <li><span className="opacity-50">Privacy Policy</span></li>
                <li><span className="opacity-50">Terms of Service</span></li>
                <li><span className="opacity-50">GDPR Compliance</span></li>
                <li><span className="opacity-50">Security Trust</span></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-[#E5E7EB] pt-8 dark:border-[#334155] flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
              &copy; {new Date().getFullYear()} eduFlow Inc. All rights reserved. Designed with intentional minimalism.
            </p>
            <div className="text-xs text-[#94A3B8] dark:text-[#64748B]">
              V1.2.0-stable
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomeLayout;
