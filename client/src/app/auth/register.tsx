import * as React from "react";
import { useState } from "react";
import { useRegister } from "@/hooks/queries/useAuth";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, AlertCircle, Eye, EyeOff, GraduationCap } from "lucide-react";

export default function RegisterPage() {
  const registerMutation = useRegister();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    try {
      await registerMutation.mutateAsync({
        name,
        email,
        password,
        company_name: schoolName,
      });
      navigate("/dashboard");
    } catch (err) {
      setErrorMsg(
        err instanceof Error
          ? err.message
          : "Registration failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-white dark:bg-[#0F172A]">
      {/* Left Panel - Brand Storytelling (Hidden on mobile) */}
      <div className="hidden md:flex flex-col justify-between p-12 bg-[#0F172A] text-white relative overflow-hidden">
        {/* Background Subtle Graphic */}
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
            Streamline your school workflows in minutes.
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            Create an administrator profile, register your school name, and establish core academic structures.
          </p>
        </div>

        {/* Bottom Testimonial Block */}
        <div className="border-t border-slate-800 pt-6 z-10">
          <p className="text-xs text-slate-400 italic">
            &ldquo;Onboarding Springfield Elementary took less than ten minutes. The clean interfaces let our teachers take attendance registers without any special training.&rdquo;
          </p>
          <div className="mt-2 text-[10px] font-semibold uppercase tracking-wider text-[#2563EB]">
            — Springfield School District
          </div>
        </div>
      </div>

      {/* Right Panel - Form (Full-width on mobile, centered) */}
      <div className="flex flex-col items-center justify-center p-8 bg-white dark:bg-[#0F172A] relative">
        {/* Mobile Header Logo */}
        <div className="absolute top-8 left-8 flex items-center gap-2 md:hidden">
          <GraduationCap className="h-5 w-5 text-[#2563EB]" />
          <span className="text-lg font-bold tracking-tight text-[#0F172A] dark:text-[#F1F5F9]">
            eduFlow
          </span>
        </div>

        <div className="w-full max-w-sm flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-[#0F172A] dark:text-[#F1F5F9]">
              Create school account
            </h1>
            <p className="text-sm text-[#64748B] dark:text-[#94A3B8]">
              Register your school and configure your administrator login
            </p>
          </div>

          {errorMsg && (
            <div className="flex items-center gap-2 rounded-lg bg-[#FEE2E2] p-3 text-[#B91C1C] border border-[#FEE2E2] dark:bg-red-950/20 dark:border-red-950/30">
              <AlertCircle className="h-4 w-4 shrink-0 text-[#B91C1C]" />
              <span className="text-xs font-semibold">{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Admin Name Field */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="name" className="text-sm font-medium text-[#0F172A] dark:text-[#F1F5F9]">
                Admin Full Name
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Principal Skinner"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
                required
              />
            </div>

            {/* Email Field */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email" className="text-sm font-medium text-[#0F172A] dark:text-[#F1F5F9]">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="skinner@springfield.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
              />
            </div>

            {/* School Name Field */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="schoolName" className="text-sm font-medium text-[#0F172A] dark:text-[#F1F5F9]">
                School / Organization Name
              </Label>
              <Input
                id="schoolName"
                type="text"
                placeholder="Springfield Elementary School"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                disabled={loading}
                required
              />
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password" className="text-sm font-medium text-[#0F172A] dark:text-[#F1F5F9]">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#64748B] dark:text-[#64748B] dark:hover:text-[#94A3B8]"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full mt-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Register School"
              )}
            </Button>
          </form>

          {/* Switch Link */}
          <p className="text-center text-sm text-[#64748B] dark:text-[#94A3B8]">
            Already have an account?{" "}
            <Link to="/login" className="text-[#2563EB] hover:underline font-semibold">
              Login here
            </Link>
          </p>

          {/* Tiny Footer */}
          <p className="text-center text-[10px] text-[#94A3B8] dark:text-[#64748B]">
            By clicking continue, you agree to our{" "}
            <span className="underline cursor-pointer">Terms of Service</span> and{" "}
            <span className="underline cursor-pointer">Privacy Policy</span>.
          </p>
        </div>
      </div>
    </div>
  );
}
