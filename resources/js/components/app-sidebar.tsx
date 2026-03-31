import { Link, usePage } from '@inertiajs/react';
import { BookOpen, CheckCircle2, CreditCard, FolderGit2, GraduationCap, LayoutGrid, Users } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { TeamSwitcher } from '@/components/team-switcher';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard as schoolDashboard } from '@/routes';
import { index as studentsIndex } from '@/routes/students';
import { index as attendanceIndex } from '@/routes/attendance';
import { index as feesIndex } from '@/routes/fees';
import { index as paymentsIndex } from '@/routes/payments';
import { index as classesIndex } from '@/routes/classes';
import { index as subjectsIndex } from '@/routes/subjects';
import type { NavItem } from '@/types';

export function AppSidebar() {
    const dashboardUrl = schoolDashboard().url;

    const mainNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: dashboardUrl,
            icon: LayoutGrid,
        },
        {
            title: 'Admission',
            href: studentsIndex().url,
            icon: Users,
        },
        {
            title: 'Attendance',
            href: attendanceIndex().url,
            icon: CheckCircle2,
        },
        {
            title: 'Finance',
            href: '#',
            icon: CreditCard,
            isActive: true,
            items: [
                {
                    title: 'Fees & Allocations',
                    href: feesIndex().url,
                },
                {
                    title: 'Payments & Receipts',
                    href: paymentsIndex().url,
                },
            ],
        },
        {
            title: 'Academic',
            href: '#',
            icon: GraduationCap,
            items: [
                {
                    title: 'Classes',
                    href: classesIndex().url,
                },
                {
                    title: 'Subjects',
                    href: subjectsIndex().url,
                },
            ],
        },
    ];

    const footerNavItems: NavItem[] = [
        {
            title: 'Repository',
            href: 'https://github.com/laravel/react-starter-kit',
            icon: FolderGit2,
        },
        {
            title: 'Documentation',
            href: 'https://laravel.com/docs/starter-kits#react',
            icon: BookOpen,
        },
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboardUrl} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <TeamSwitcher />
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
