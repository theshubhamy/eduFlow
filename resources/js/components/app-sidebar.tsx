import { Link, usePage } from '@inertiajs/react';
import { CheckCircle2, CreditCard, GraduationCap, LayoutGrid, Users, Briefcase } from 'lucide-react';
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
import { index as membersIndex } from '@/routes/members';
import type { NavItem } from '@/types';

export function AppSidebar() {
    const { props } = usePage();
    const currentTeam = (props as any).currentTeam;
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
            title: 'Staff & Faculty',
            href: membersIndex().url,
            icon: Briefcase,
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
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
