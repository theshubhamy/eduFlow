import * as React from "react";
import { Link, useLocation } from "react-router-dom";
import { TeamSwitcher } from "@/components/team-switcher";
import { NavUser } from "@/components/nav-user";
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

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>

      <SidebarContent>
        {/* Core Overview */}
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive("/dashboard")}>
                <Link to="/dashboard">
                  <LayoutDashboard className="size-4" />
                  <span className="font-medium">Overview</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        {/* Academic Group */}
        <SidebarGroup>
          <SidebarGroupLabel>Academic</SidebarGroupLabel>
          <SidebarMenu>
            {academicItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild isActive={isActive(item.url)}>
                  <Link to={item.url}>
                    <item.icon className="size-4" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        {/* Finance Group */}
        <SidebarGroup>
          <SidebarGroupLabel>Finance</SidebarGroupLabel>
          <SidebarMenu>
            {financialItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild isActive={isActive(item.url)}>
                  <Link to={item.url}>
                    <item.icon className="size-4" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        {/* Management Group */}
        <SidebarGroup>
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarMenu>
            {managementItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild isActive={isActive(item.url)}>
                  <Link to={item.url}>
                    <item.icon className="size-4" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
