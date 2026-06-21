import { Outlet, Link } from "react-router-dom";
import { GraduationCap, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

const HomeLayout = () => {
  return (
    <div className="flex min-h-screen flex-col bg-background font-sans selection:bg-primary/20">
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/60 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
              <GraduationCap className="size-5" />
            </div>
            <Link to="/" className="text-xl font-bold tracking-tight text-foreground">
              edu<span className="text-primary">Flow</span>
            </Link>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <Link to="/#features" className="hover:text-foreground transition-colors">Features</Link>
            <Link to="/#about" className="hover:text-foreground transition-colors">About</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Sign In
            </Link>
            <Button asChild className="rounded-full shadow-md hover:shadow-lg transition-all">
              <Link to="/register">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 py-12 bg-background">
        <div className="container mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 text-foreground">
            <GraduationCap className="size-5 text-primary" />
            <span className="font-semibold tracking-tight">eduFlow</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} eduFlow Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-muted-foreground">
            <ShieldCheck className="size-4 hover:text-foreground cursor-pointer transition-colors" />
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomeLayout;
