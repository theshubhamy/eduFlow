import { Link } from "react-router-dom";
import {
  ArrowRight,
  LayoutDashboard,
  Users,
  ClipboardList,
  Check,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="flex-1 bg-white dark:bg-[#0F172A]">
      {/* 1. Hero Section (py-24 = 96px vertical padding) */}
      <section className="relative overflow-hidden py-24 border-b border-[#E5E7EB] dark:border-[#334155]">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <h1 className="mx-auto max-w-3xl  text-center text-4xl font-bold tracking-tight text-[#0F172A] dark:text-[#F1F5F9] sm:text-5xl lg:text-6xl">
            The operating system for modern school management.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-relaxed text-[#64748B] dark:text-[#94A3B8]">
            Coordinate classrooms, track attendance rosters, manage financial
            billing pipelines, and clear administrative noise in one clean,
            unified workspace.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              asChild
              variant="default"
              size="lg"
              className="w-full sm:w-auto"
            >
              <Link to="/register">
                Register School <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="w-full sm:w-auto"
            >
              <Link to="/login">Go to App</Link>
            </Button>
          </div>

          {/* Premium CSS Product Screenshot (Browser Mockup) */}
          <div className="mt-16 mx-auto max-w-5xl rounded-xl border border-[#E5E7EB] bg-[#F8F9FA] p-3 shadow-md dark:border-[#334155] dark:bg-[#1E293B]">
            <div className="rounded-lg border border-[#E5E7EB] bg-white shadow-xs overflow-hidden dark:border-[#334155] dark:bg-[#0F172A]">
              {/* Browser Header Bar */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-[#E5E7EB] bg-[#F8F9FA] dark:border-[#334155] dark:bg-[#1E293B]">
                <div className="flex gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-red-400 opacity-60"></span>
                  <span className="h-3 w-3 rounded-full bg-yellow-400 opacity-60"></span>
                  <span className="h-3 w-3 rounded-full bg-green-400 opacity-60"></span>
                </div>
                <div className="mx-auto bg-white border border-[#E5E7EB] rounded-md px-16 py-0.5 text-xs text-[#94A3B8] dark:bg-[#0F172A] dark:border-[#334155]">
                  eduflow.app/dashboard
                </div>
              </div>

              {/* Browser App Preview Content */}
              <div className="grid grid-cols-[180px_1fr] text-left min-h-[360px] text-xs">
                {/* Mock Sidebar */}
                <div className="border-r border-[#E5E7EB] p-4 bg-[#F8F9FA] dark:border-[#334155] dark:bg-[#1E293B] space-y-4">
                  <div className="font-semibold text-[#0F172A] dark:text-[#F1F5F9] mb-4">
                    eduFlow
                  </div>
                  <div className="space-y-1">
                    <div className="px-2.5 py-1.5 rounded-md bg-[#EFF6FF] text-[#2563EB] font-medium flex items-center gap-2">
                      <LayoutDashboard className="h-3.5 w-3.5" /> Overview
                    </div>
                    <div className="px-2.5 py-1.5 rounded-md text-[#64748B] flex items-center gap-2 dark:text-[#94A3B8]">
                      <Users className="h-3.5 w-3.5" /> Students
                    </div>
                    <div className="px-2.5 py-1.5 rounded-md text-[#64748B] flex items-center gap-2 dark:text-[#94A3B8]">
                      <ClipboardList className="h-3.5 w-3.5" /> Attendance
                    </div>
                  </div>
                </div>

                {/* Mock Dashboard Area */}
                <div className="p-6 space-y-6 bg-white dark:bg-[#0F172A]">
                  <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3 dark:border-[#334155]">
                    <div>
                      <h4 className="font-bold text-[#0F172A] dark:text-[#F1F5F9]">
                        Dashboard Overview
                      </h4>
                      <p className="text-[10px] text-[#64748B] dark:text-[#94A3B8]">
                        Welcome back, Admin
                      </p>
                    </div>
                    <div className="h-7 w-24 rounded-md bg-[#2563EB] text-white flex items-center justify-center font-medium">
                      + Add New
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 border border-[#E5E7EB] rounded-lg dark:border-[#334155]">
                      <span className="text-[10px] text-[#64748B] dark:text-[#94A3B8] font-medium uppercase tracking-wider">
                        Total Students
                      </span>
                      <div className="text-xl font-bold text-[#0F172A] dark:text-[#F1F5F9] mt-1">
                        1,248
                      </div>
                      <div className="text-[9px] text-green-600 font-semibold flex items-center gap-0.5 mt-1">
                        <TrendingUp className="h-3 w-3" /> +12% this term
                      </div>
                    </div>
                    <div className="p-4 border border-[#E5E7EB] rounded-lg dark:border-[#334155]">
                      <span className="text-[10px] text-[#64748B] dark:text-[#94A3B8] font-medium uppercase tracking-wider">
                        Staff Members
                      </span>
                      <div className="text-xl font-bold text-[#0F172A] dark:text-[#F1F5F9] mt-1">
                        84
                      </div>
                      <div className="text-[9px] text-[#64748B] dark:text-[#94A3B8] mt-1">
                        Active rosters
                      </div>
                    </div>
                    <div className="p-4 border border-[#E5E7EB] rounded-lg dark:border-[#334155]">
                      <span className="text-[10px] text-[#64748B] dark:text-[#94A3B8] font-medium uppercase tracking-wider">
                        Fee Collection
                      </span>
                      <div className="text-xl font-bold text-[#0F172A] dark:text-[#F1F5F9] mt-1">
                        94.2%
                      </div>
                      <div className="text-[9px] text-green-600 font-semibold flex items-center gap-0.5 mt-1">
                        <Check className="h-3 w-3" /> Targets met
                      </div>
                    </div>
                  </div>

                  {/* Striped Table Preview */}
                  <div className="border border-[#E5E7EB] rounded-lg overflow-hidden dark:border-[#334155]">
                    <div className="grid grid-cols-3 bg-[#F8F9FA] dark:bg-[#1E293B] p-2.5 font-semibold text-[#0F172A] dark:text-[#F1F5F9]">
                      <span>Student</span>
                      <span>Class</span>
                      <span>Attendance</span>
                    </div>
                    <div className="grid grid-cols-3 p-2.5 border-b border-[#E5E7EB] dark:border-[#334155]">
                      <span>Alex Rivera</span>
                      <span>Grade 10-A</span>
                      <span className="text-green-600 font-semibold">
                        98.5%
                      </span>
                    </div>
                    <div className="grid grid-cols-3 p-2.5 bg-[#F8F9FA] dark:bg-[#1E293B]/50 border-b border-[#E5E7EB] dark:border-[#334155]">
                      <span>Jane Doe</span>
                      <span>Grade 11-B</span>
                      <span className="text-green-600 font-semibold">
                        97.2%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Social Proof Section */}
      <section className="py-12 bg-[#F8F9FA] border-b border-[#E5E7EB] dark:bg-[#1E293B] dark:border-[#334155]">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8]">
            TRUSTED BY TEAMS AND ACADEMIES WORLDWIDE
          </p>
          <div className="mt-6 flex flex-wrap justify-center items-center gap-x-12 gap-y-6 font-bold text-sm text-[#94A3B8] dark:text-[#64748B] tracking-widest">
            <span>SPRINGFIELD ACADEMY</span>
            <span>OAKWOOD PREP</span>
            <span>PINECREST COLLEGE</span>
            <span>HORIZON CHARTERS</span>
          </div>
        </div>
      </section>

      {/* 3. Features Section (3-column grid) */}
      <section
        id="features"
        className="py-24 border-b border-[#E5E7EB] dark:border-[#334155]"
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-center text-[#0F172A] dark:text-[#F1F5F9]">
              Designed to optimize school operations.
            </h2>
            <p className="mt-4 text-center text-[#64748B] dark:text-[#94A3B8]">
              All essential modules built directly into one central command hub.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-sm dark:border-[#334155] dark:bg-[#1E293B]">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[#EFF6FF] text-[#2563EB] mb-4">
                <LayoutDashboard className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-[#0F172A] dark:text-[#F1F5F9]">
                Real-Time Dashboard
              </h3>
              <p className="mt-2 text-sm text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
                Analyze total student counts, financial invoicing collection
                targets, and staff leaves in one centralized command screen.
              </p>
            </div>
            <div className="rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-sm dark:border-[#334155] dark:bg-[#1E293B]">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[#EFF6FF] text-[#2563EB] mb-4">
                <ClipboardList className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-[#0F172A] dark:text-[#F1F5F9]">
                Attendance Logs
              </h3>
              <p className="mt-2 text-sm text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
                Log daily attendance roster records in seconds per class. Keep
                instant logs of status changes and terms with zero effort.
              </p>
            </div>
            <div className="rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-sm dark:border-[#334155] dark:bg-[#1E293B]">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[#EFF6FF] text-[#2563EB] mb-4">
                <Users className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-[#0F172A] dark:text-[#F1F5F9]">
                Admissions & Staff
              </h3>
              <p className="mt-2 text-sm text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
                Bulk register new students, delegate staff administrative
                permissions, and track active classrooms with clear division.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. How It Works Section (3-step timeline) */}
      <section
        id="how-it-works"
        className="py-24 bg-[#F8F9FA] border-b border-[#E5E7EB] dark:bg-[#1E293B] dark:border-[#334155]"
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-center text-[#0F172A] dark:text-[#F1F5F9]">
              Three steps to complete onboarding.
            </h2>
            <p className="mt-4 text-center text-[#64748B] dark:text-[#94A3B8]">
              Getting your school setup with eduFlow is extremely fast.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <div className="text-4xl font-bold text-[#2563EB]">01</div>
              <h4 className="text-lg font-semibold text-[#0F172A] dark:text-[#F1F5F9]">
                Register Your School
              </h4>
              <p className="text-sm text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
                Create your school administrative account and establish class
                configurations.
              </p>
            </div>
            <div className="space-y-3">
              <div className="text-4xl font-bold text-[#2563EB]">02</div>
              <h4 className="text-lg font-semibold text-[#0F172A] dark:text-[#F1F5F9]">
                Bulk Onboard Students
              </h4>
              <p className="text-sm text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
                Import CSV files containing rosters, subjects list, class
                details, and fee structure specifications.
              </p>
            </div>
            <div className="space-y-3">
              <div className="text-4xl font-bold text-[#2563EB]">03</div>
              <h4 className="text-lg font-semibold text-[#0F172A] dark:text-[#F1F5F9]">
                Run School Workflows
              </h4>
              <p className="text-sm text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
                Begin log registries, process parental invoices, schedule
                examinations, and coordinate announcements.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Testimonials (2-col cards) */}
      <section className="py-24 border-b border-[#E5E7EB] dark:border-[#334155]">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-center text-[#0F172A] dark:text-[#F1F5F9]">
              Endorsed by academic leaders.
            </h2>
            <p className="mt-4 text-center text-[#64748B] dark:text-[#94A3B8]">
              Hear how administrators shifted their operations into a clean
              workflow.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-sm dark:border-[#334155] dark:bg-[#1E293B]">
              <p className="text-sm text-[#64748B] dark:text-[#94A3B8] italic leading-relaxed">
                &ldquo;eduFlow cut our weekly administration overhead in half.
                The lack of visual bloat is a breath of fresh air for our
                teachers. They can log classroom grades and mark rosters in
                seconds.&rdquo;
              </p>
              <div className="mt-4 flex items-center gap-3 border-t border-[#E5E7EB] pt-4 dark:border-[#334155]">
                <div className="h-8 w-8 rounded-full bg-[#E5E7EB] flex items-center justify-center font-bold text-xs text-[#0F172A]">
                  AP
                </div>
                <div>
                  <div className="text-sm font-semibold text-[#0F172A] dark:text-[#F1F5F9]">
                    Arthur Pendelton
                  </div>
                  <div className="text-xs text-[#64748B] dark:text-[#94A3B8]">
                    Principal at Oakridge Academy
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-sm dark:border-[#334155] dark:bg-[#1E293B]">
              <p className="text-sm text-[#64748B] dark:text-[#94A3B8] italic leading-relaxed">
                &ldquo;Managing school fee collection lists and tracking teacher
                leaves was extremely challenging with spreadsheets. eduFlow
                simplified operations down to a few daily clicks.&rdquo;
              </p>
              <div className="mt-4 flex items-center gap-3 border-t border-[#E5E7EB] pt-4 dark:border-[#334155]">
                <div className="h-8 w-8 rounded-full bg-[#E5E7EB] flex items-center justify-center font-bold text-xs text-[#0F172A]">
                  SJ
                </div>
                <div>
                  <div className="text-sm font-semibold text-[#0F172A] dark:text-[#F1F5F9]">
                    Sarah Jenkins
                  </div>
                  <div className="text-xs text-[#64748B] dark:text-[#94A3B8]">
                    Registrar at Springfield Elementary
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Pricing (3-col cards) */}
      <section
        id="pricing"
        className="py-24 bg-[#F8F9FA] border-b border-[#E5E7EB] dark:bg-[#1E293B] dark:border-[#334155]"
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-center text-[#0F172A] dark:text-[#F1F5F9]">
              Simple, transparent school plans.
            </h2>
            <p className="mt-4 text-center text-[#64748B] dark:text-[#94A3B8]">
              Select a tier matching your student roster capacity.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {/* Starter Plan */}
            <div className="rounded-xl border border-[#E5E7EB] bg-white p-8 flex flex-col justify-between dark:border-[#334155] dark:bg-[#0F172A]">
              <div>
                <h4 className="text-sm font-semibold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider">
                  Starter
                </h4>
                <div className="mt-4 flex items-baseline gap-1 text-[#0F172A] dark:text-[#F1F5F9]">
                  <span className="text-4xl font-bold tracking-tight">$49</span>
                  <span className="text-sm text-[#64748B] dark:text-[#94A3B8]">
                    /month
                  </span>
                </div>
                <p className="mt-2 text-xs text-[#64748B] dark:text-[#94A3B8]">
                  For small academies up to 200 students.
                </p>
                <ul className="mt-6 space-y-3 text-sm text-[#64748B] dark:text-[#94A3B8]">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[#2563EB]" /> Academic
                    Rosters
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[#2563EB]" /> Roster
                    Attendance logs
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[#2563EB]" /> Single
                    Administrator
                  </li>
                </ul>
              </div>
              <Button asChild variant="outline" className="mt-8 w-full">
                <Link to="/register">Register Free</Link>
              </Button>
            </div>

            {/* Pro Plan (Recommended) */}
            <div className="rounded-xl border-2 border-[#2563EB] bg-white p-8 flex flex-col justify-between relative dark:bg-[#0F172A]">
              <span className="absolute -top-3.5 right-6 rounded-full bg-[#2563EB] px-3 py-1 text-[10px] font-semibold text-white uppercase tracking-wider">
                RECOMMENDED
              </span>
              <div>
                <h4 className="text-sm font-semibold text-[#2563EB] uppercase tracking-wider">
                  Academic Pro
                </h4>
                <div className="mt-4 flex items-baseline gap-1 text-[#0F172A] dark:text-[#F1F5F9]">
                  <span className="text-4xl font-bold tracking-tight">$99</span>
                  <span className="text-sm text-[#64748B] dark:text-[#94A3B8]">
                    /month
                  </span>
                </div>
                <p className="mt-2 text-xs text-[#64748B] dark:text-[#94A3B8]">
                  For school institutions up to 1,000 students.
                </p>
                <ul className="mt-6 space-y-3 text-sm text-[#64748B] dark:text-[#94A3B8]">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[#2563EB]" /> Everything in
                    Starter
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[#2563EB]" /> Invoice Billing
                    Engine
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[#2563EB]" /> Class
                    scheduling & Timetables
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[#2563EB]" /> Unlimited
                    Administrators
                  </li>
                </ul>
              </div>
              <Button asChild variant="default" className="mt-8 w-full">
                <Link to="/register">Onboard Now</Link>
              </Button>
            </div>

            {/* Enterprise Plan */}
            <div className="rounded-xl border border-[#E5E7EB] bg-white p-8 flex flex-col justify-between dark:border-[#334155] dark:bg-[#0F172A]">
              <div>
                <h4 className="text-sm font-semibold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider">
                  Enterprise
                </h4>
                <div className="mt-4 flex items-baseline gap-1 text-[#0F172A] dark:text-[#F1F5F9]">
                  <span className="text-4xl font-bold tracking-tight">
                    Custom
                  </span>
                </div>
                <p className="mt-2 text-xs text-[#64748B] dark:text-[#94A3B8]">
                  For large institutions with multi-school clusters.
                </p>
                <ul className="mt-6 space-y-3 text-sm text-[#64748B] dark:text-[#94A3B8]">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[#2563EB]" /> Everything in
                    Pro
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[#2563EB]" /> Multi-Campus
                    Databases
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[#2563EB]" /> Dedicated
                    Account Rep
                  </li>
                </ul>
              </div>
              <Button asChild variant="outline" className="mt-8 w-full">
                <Link to="/register">Contact Sales</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 7. CTA Banner (solid blue accent color) */}
      <section className="bg-[#2563EB] py-16 text-white text-center">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="text-3xl font-bold text-white tracking-tight sm:text-4xl">
            Upgrade your school management today.
          </h2>
          <p className="mt-4 text-blue-100 max-w-xl mx-auto text-sm leading-relaxed">
            Onboard your classes and staff in under 10 minutes. No card payment
            details required during initial trial setup.
          </p>
          <div className="mt-8">
            <Button
              asChild
              variant="secondary"
              size="lg"
              className="bg-white text-[#2563EB] hover:bg-blue-50 font-semibold shadow-xs"
            >
              <Link to="/register">Create School Account</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
