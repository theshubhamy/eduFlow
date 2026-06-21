import { LoginForm } from "@/components/login-form";
import { GraduationCap } from "lucide-react";
import { Link } from "react-router-dom";

export default function LoginPage() {
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-white dark:bg-[#0F172A]">
      {/* Left Panel - Brand Storytelling (Hidden on mobile) */}
      <div className="hidden md:flex flex-col justify-between p-12 bg-[#0F172A] text-white relative overflow-hidden">
        {/* Background Subtle Graphic (Grid outline, no gradients) */}
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#334155_1px,transparent_1px),linear-gradient(to_bottom,#334155_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
        
        {/* Top Branding Logo */}
        <div className="flex items-center gap-2 z-10">
          <GraduationCap className="h-6 w-6 text-[#2563EB]" />
          <Link to="/" className="text-xl font-bold tracking-tight text-white hover:opacity-90 transition-opacity">
            edu<span className="text-[#2563EB]">Flow</span>
          </Link>
        </div>

        {/* Center Tagline */}
        <div className="my-auto space-y-6 max-w-lg z-10">
          <h2 className="text-3xl font-bold tracking-tight text-white leading-tight lg:text-4xl">
            Run your academic workflows with perfect clarity.
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            eduFlow coordinates registers, timetables, notifications, and invoicing into one distraction-free operating system.
          </p>
        </div>

        {/* Bottom Testimonial Block */}
        <div className="border-t border-slate-800 pt-6 z-10">
          <p className="text-xs text-slate-400 italic">
            &ldquo;We migrated all our school administration logs from fragmented spreadsheets into eduFlow. The speed gains and minimal friction are remarkable.&rdquo;
          </p>
          <div className="mt-2 text-[10px] font-semibold uppercase tracking-wider text-[#2563EB]">
            — Oakwood Charter Academy
          </div>
        </div>
      </div>

      {/* Right Panel - Form (Full-width on mobile, centered) */}
      <div className="flex flex-col items-center justify-center p-8 bg-white dark:bg-[#0F172A] relative">
        {/* Mobile Header Logo (Visible on mobile only) */}
        <div className="absolute top-8 left-8 flex items-center gap-2 md:hidden">
          <GraduationCap className="h-5 w-5 text-[#2563EB]" />
          <span className="text-lg font-bold tracking-tight text-[#0F172A] dark:text-[#F1F5F9]">
            eduFlow
          </span>
        </div>

        <div className="w-full max-w-sm">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
