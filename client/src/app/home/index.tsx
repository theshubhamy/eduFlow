import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  LayoutDashboard,
  Sparkles,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <>
      <div className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-24 pb-32 md:pt-32 md:pb-40">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))]" />
          <div className="container mx-auto px-4 md:px-8 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-8 animate-fade-in-up">
              <Sparkles className="size-4" />
              <span>The Next-Gen School Management OS</span>
            </div>
            <h1 className="mx-auto max-w-4xl text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl">
              Manage your school with{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">
                beautiful simplicity.
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed">
              eduFlow streamlines attendance, grades, fees, and communication
              into one intuitive, lightning-fast platform designed for modern
              educational institutions.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                asChild
                size="lg"
                className="h-12 px-8 rounded-full shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-0.5 transition-all w-full sm:w-auto"
              >
                <Link to="/register">
                  Start for free <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 px-8 rounded-full border-border/50 bg-background/50 backdrop-blur-sm hover:bg-muted w-full sm:w-auto"
              >
                <Link to="/login">Go to Dashboard</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="py-24 bg-muted/30">
          <div className="container mx-auto px-4 md:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Everything you need to run your school
              </h2>
              <p className="mt-4 text-muted-foreground">
                Powerful features packed into a clean, minimal interface.
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
              {[
                {
                  icon: LayoutDashboard,
                  title: "Smart Dashboard",
                  desc: "Get a bird's-eye view of your institution's health, attendance, and revenue at a glance.",
                },
                {
                  icon: Users,
                  title: "Student Roster",
                  desc: "Easily manage student records, class assignments, and parental communication.",
                },
                {
                  icon: BookOpen,
                  title: "Academic Hub",
                  desc: "Streamline scheduling, curriculum tracking, and exam grading workflows.",
                },
              ].map((feature, idx) => (
                <div
                  key={idx}
                  className="group relative overflow-hidden rounded-3xl border border-border/50 bg-background p-8 shadow-sm transition-all hover:shadow-md hover:-translate-y-1"
                >
                  <div className="mb-6 inline-flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <feature.icon className="size-6" />
                  </div>
                  <h3 className="mb-3 text-xl font-semibold">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
