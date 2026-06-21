import React from "react";
import { Outlet, useLocation, Link, useNavigate } from "react-router-dom";
import { AppSidebar } from "@/components/app-sidebar";
import { useCurrentUser, useLogout } from "@/hooks/queries/useAuth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, Search, LogOut, Settings, User, Sliders } from "lucide-react";

const routeNameMap: Record<string, string> = {
  dashboard: "Overview",
  classes: "Classes",
  subjects: "Subjects",
  students: "Students",
  attendance: "Attendance",
  fees: "Fees & Allocation",
  payments: "Payments & Receipts",
  team: "Staff & Switcher",
  settings: "Settings",
};

export const DashboardLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const logoutMutation = useLogout();
  const { data } = useCurrentUser();
  const user = data?.user;
  const pathSegments = location.pathname.split("/").filter(Boolean);

  // Generate breadcrumb items
  const breadcrumbs = pathSegments.map((segment, index) => {
    const url = `/${pathSegments.slice(0, index + 1).join("/")}`;
    const label =
      routeNameMap[segment] ||
      segment.charAt(0).toUpperCase() + segment.slice(1);
    const isLast = index === pathSegments.length - 1;

    return {
      url,
      label,
      isLast,
    };
  });

  const fallback = user?.name
    ? user.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "US";

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {/* Top Bar (Height: 64px, bg: #FFFFFF, border-b) */}
        <header className="flex h-16 shrink-0 items-center border-b border-[#E5E7EB] bg-white sticky top-0 z-10 dark:border-[#334155] dark:bg-[#0F172A]">
          <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-8">
            {/* Left: Breadcrumbs & Trigger */}
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-1 text-[#64748B] hover:text-[#0F172A] dark:text-[#94A3B8] dark:hover:text-[#F1F5F9]" />
              <Breadcrumb className="hidden sm:block">
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link
                        to="/dashboard"
                        className="text-sm text-[#64748B] hover:text-[#0F172A] dark:text-[#94A3B8] dark:hover:text-[#F1F5F9]"
                      >
                        eduFlow
                      </Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  {breadcrumbs.map((crumb) => (
                    <React.Fragment key={crumb.url}>
                      <BreadcrumbSeparator className="text-[#94A3B8] dark:text-[#64748B]" />
                      <BreadcrumbItem>
                        {crumb.isLast ? (
                          <BreadcrumbPage className="text-sm font-semibold text-[#0F172A] dark:text-[#F1F5F9]">
                            {crumb.label}
                          </BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink asChild>
                            <Link
                              to={crumb.url}
                              className="text-sm text-[#64748B] hover:text-[#0F172A] dark:text-[#94A3B8] dark:hover:text-[#F1F5F9]"
                            >
                              {crumb.label}
                            </Link>
                          </BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                    </React.Fragment>
                  ))}
                </BreadcrumbList>
              </Breadcrumb>
            </div>

            {/* Center: Global Search (cmd+K) */}
            <div className="hidden md:flex items-center gap-2 max-w-xs w-full border border-[#E5E7EB] bg-[#F8F9FA] rounded-lg px-3 py-1.5 text-xs text-[#94A3B8] dark:border-[#334155] dark:bg-[#1E293B] cursor-pointer hover:bg-[#F1F5F9] dark:hover:bg-[#334155]/50 transition-colors">
              <Search className="h-3.5 w-3.5" />
              <span>Search dashboard...</span>
              <kbd className="ml-auto font-mono text-[9px] bg-white dark:bg-[#0F172A] border border-[#E5E7EB] dark:border-[#334155] px-1.5 py-0.5 rounded text-[#64748B] dark:text-[#94A3B8]">
                ⌘K
              </kbd>
            </div>

            {/* Right: Notifications & User Menu */}
            <div className="flex items-center gap-4">
              {/* Notification Bell */}
              <button className="relative p-1.5 text-[#64748B] hover:text-[#0F172A] rounded-lg hover:bg-[#F8F9FA] transition-colors dark:text-[#94A3B8] dark:hover:text-[#F1F5F9] dark:hover:bg-[#1E293B]">
                <Bell className="h-4.5 w-4.5" />
                <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-[#2563EB]"></span>
              </button>

              {/* User Dropdown Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="outline-none">
                    <Avatar className="h-8 w-8 cursor-pointer border border-[#E5E7EB] hover:opacity-90 dark:border-[#334155]">
                      <AvatarFallback className="bg-[#2563EB]/10 text-[#2563EB] font-bold text-xs">
                        {fallback}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none text-[#0F172A] dark:text-[#F1F5F9]">
                        {user?.name || "Admin User"}
                      </p>
                      <p className="text-xs leading-none text-[#64748B] dark:text-[#94A3B8]">
                        {user?.email || "admin@school.com"}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      onClick={() => navigate("/dashboard/settings")}
                      className="cursor-pointer gap-2"
                    >
                      <User className="h-4 w-4" />
                      <span>My Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => navigate("/dashboard/settings")}
                      className="cursor-pointer gap-2"
                    >
                      <Settings className="h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => navigate("/dashboard/team")}
                      className="cursor-pointer gap-2"
                    >
                      <Sliders className="h-4 w-4" />
                      <span>School Config</span>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => logoutMutation.mutate()}
                    className="cursor-pointer text-[#DC2626] focus:bg-[#FEE2E2] focus:text-[#B91C1C] dark:focus:bg-red-950/20 gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Main Content Area (Padding: 32px = p-8) */}
        <main className="flex-1 overflow-y-auto bg-[#F8F9FA] p-8 dark:bg-[#0F172A]">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};
