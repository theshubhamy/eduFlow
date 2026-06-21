import * as React from "react";
import { Link, useLocation } from "react-router-dom";
import { TeamSwitcher } from "@/components/team-switcher";
import { useCurrentUser } from "@/hooks/queries/useAuth";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  School,
  BookOpen,
  Users,
  ClipboardList,
  CreditCard,
  Receipt,
  UserCheck,
  Settings,
  Calendar,
  Award,
  Library,
  CalendarDays,
  Megaphone,
} from "lucide-react";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const location = useLocation();
  const { state } = useSidebar();
  const { data } = useCurrentUser();
  const user = data?.user;
  const isCollapsed = state === "collapsed";

  const isActive = (path: string) => {
    if (path === "/dashboard") {
      return location.pathname === "/dashboard";
    }
    return location.pathname.startsWith(path);
  };

  const academicItems = [
    { title: "Classes", url: "/dashboard/classes", icon: School },
    { title: "Subjects", url: "/dashboard/subjects", icon: BookOpen },
    { title: "Students", url: "/dashboard/students", icon: Users },
    { title: "Attendance", url: "/dashboard/attendance", icon: ClipboardList },
    { title: "Timetable", url: "/dashboard/timetable", icon: Calendar },
    { title: "Exams & Results", url: "/dashboard/exams", icon: Award },
    { title: "Library", url: "/dashboard/library", icon: Library },
  ];

  const financialItems = [
    { title: "Fees Allocation", url: "/dashboard/fees", icon: CreditCard },
    { title: "Payments & Receipts", url: "/dashboard/payments", icon: Receipt },
  ];

  const managementItems = [
    { title: "Notice Board", url: "/dashboard/notices", icon: Megaphone },
    { title: "Staff Leaves", url: "/dashboard/leaves", icon: CalendarDays },
    { title: "Staff & Invites", url: "/dashboard/team", icon: UserCheck },
    { title: "Settings", url: "/dashboard/settings", icon: Settings },
  ];

  // Generate fallback avatar characters
  const fallback = user?.name
    ? user.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "US";

  return (
    <Sidebar collapsible="icon" className="border-r border-[#E5E7EB] dark:border-[#334155]" {...props}>
      <SidebarHeader className="h-16 flex flex-row items-center justify-center border-b border-[#E5E7EB] px-4 dark:border-[#334155]">
        <TeamSwitcher />
      </SidebarHeader>

      <SidebarContent className="py-2">
        {/* Core Overview */}
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={isActive("/dashboard")}
                className={cn(
                  "relative h-10 gap-3 px-3 rounded-lg font-medium transition-colors duration-150",
                  isActive("/dashboard")
                    ? "bg-[#EFF6FF] text-[#2563EB] hover:bg-[#EFF6FF] hover:text-[#2563EB] border-l-[3px] border-[#2563EB] rounded-l-none! font-semibold"
                    : "text-[#64748B] hover:bg-[#F8F9FA] hover:text-[#0F172A]! dark:text-[#94A3B8] dark:hover:bg-[#1E293B]"
                )}
              >
                <Link to="/dashboard">
                  <LayoutDashboard className="size-4 shrink-0" />
                  <span>Overview</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        {/* Academic Group */}
        <SidebarGroup>
          <SidebarGroupLabel className="uppercase text-[0.625rem] text-[#94A3B8] tracking-wider font-semibold mb-1 px-3">
            Academic
          </SidebarGroupLabel>
          <SidebarMenu>
            {academicItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive(item.url)}
                  className={cn(
                    "relative h-10 gap-3 px-3 rounded-lg font-medium transition-colors duration-150",
                    isActive(item.url)
                      ? "bg-[#EFF6FF] text-[#2563EB] hover:bg-[#EFF6FF] hover:text-[#2563EB] border-l-[3px] border-[#2563EB] rounded-l-none! font-semibold"
                      : "text-[#64748B] hover:bg-[#F8F9FA] hover:text-[#0F172A]! dark:text-[#94A3B8] dark:hover:bg-[#1E293B]"
                  )}
                >
                  <Link to={item.url}>
                    <item.icon className="size-4 shrink-0" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        {/* Finance Group */}
        <SidebarGroup>
          <SidebarGroupLabel className="uppercase text-[0.625rem] text-[#94A3B8] tracking-wider font-semibold mb-1 px-3">
            Finance
          </SidebarGroupLabel>
          <SidebarMenu>
            {financialItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive(item.url)}
                  className={cn(
                    "relative h-10 gap-3 px-3 rounded-lg font-medium transition-colors duration-150",
                    isActive(item.url)
                      ? "bg-[#EFF6FF] text-[#2563EB] hover:bg-[#EFF6FF] hover:text-[#2563EB] border-l-[3px] border-[#2563EB] rounded-l-none! font-semibold"
                      : "text-[#64748B] hover:bg-[#F8F9FA] hover:text-[#0F172A]! dark:text-[#94A3B8] dark:hover:bg-[#1E293B]"
                  )}
                >
                  <Link to={item.url}>
                    <item.icon className="size-4 shrink-0" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        {/* Management Group */}
        <SidebarGroup>
          <SidebarGroupLabel className="uppercase text-[0.625rem] text-[#94A3B8] tracking-wider font-semibold mb-1 px-3">
            Management
          </SidebarGroupLabel>
          <SidebarMenu>
            {managementItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive(item.url)}
                  className={cn(
                    "relative h-10 gap-3 px-3 rounded-lg font-medium transition-colors duration-150",
                    isActive(item.url)
                      ? "bg-[#EFF6FF] text-[#2563EB] hover:bg-[#EFF6FF] hover:text-[#2563EB] border-l-[3px] border-[#2563EB] rounded-l-none! font-semibold"
                      : "text-[#64748B] hover:bg-[#F8F9FA] hover:text-[#0F172A]! dark:text-[#94A3B8] dark:hover:bg-[#1E293B]"
                  )}
                >
                  <Link to={item.url}>
                    <item.icon className="size-4 shrink-0" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-0 border-t border-[#E5E7EB] dark:border-[#334155]">
        {/* Minimal User Block */}
        <div className={cn("flex items-center p-4", isCollapsed ? "justify-center" : "gap-3")}>
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#2563EB]/10 text-[#2563EB] font-bold text-xs">
            {fallback}
          </div>
          {!isCollapsed && (
            <div className="flex flex-col text-left overflow-hidden">
              <span className="truncate text-xs font-semibold text-[#0F172A] dark:text-[#F1F5F9]">
                {user?.name || "Admin User"}
              </span>
              <span className="truncate text-[10px] text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider font-semibold">
                {user?.role || "admin"}
              </span>
            </div>
          )}
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
