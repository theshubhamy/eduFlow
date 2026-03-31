import { Head, Link } from '@inertiajs/react';
import {
    Users,
    GraduationCap,
    DollarSign,
    CalendarCheck,
    UserPlus,
    FileEdit,
    CreditCard,
    Megaphone,
    Clock,
    MoreHorizontal
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { dashboard } from '@/routes';
import { create } from '@/routes/students';

export default function Dashboard() {
    return (
        <>
            <Head title="Management Dashboard" />
            <div className="flex flex-1 flex-col gap-6 p-6">
                
                {/* Header Section */}
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">Dashboard Overview</h2>
                        <p className="text-neutral-500 dark:text-neutral-400">Welcome back. Here is today's summary for your institution.</p>
                    </div>
                </div>

                {/* KPI Stats Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Total Students</CardTitle>
                            <GraduationCap className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-neutral-900 dark:text-white">2,420</div>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 whitespace-nowrap">
                                <span className="text-green-600 font-medium">+12%</span> from last academic year
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Total Faculty & Staff</CardTitle>
                            <Users className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-neutral-900 dark:text-white">145</div>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 whitespace-nowrap">
                                <span className="text-emerald-600 font-medium">96%</span> present today
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Daily Attendance</CardTitle>
                            <CalendarCheck className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-neutral-900 dark:text-white">92.4%</div>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 whitespace-nowrap">
                                <span className="text-red-600 font-medium">-1.2%</span> compared to yesterday
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Fees Collected (YTD)</CardTitle>
                            <DollarSign className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-neutral-900 dark:text-white">$1.2M</div>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 whitespace-nowrap">
                                <span className="text-green-600 font-medium">+8%</span> ahead of projection
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions Row */}
                <div className="grid gap-4 grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
                    <Button asChild variant="outline" className="h-20 border-neutral-200 bg-white hover:bg-neutral-50 hover:text-indigo-600 dark:border-neutral-800 dark:bg-zinc-950 dark:hover:bg-zinc-900 dark:hover:text-indigo-400 transition-colors rounded-xl shadow-sm">
                        <Link href={create.url()} className="flex flex-col items-center justify-center gap-2 h-full w-full">
                            <UserPlus className="h-5 w-5" />
                            <span className="text-xs font-semibold">Add Student</span>
                        </Link>
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2 border-neutral-200 bg-white hover:bg-neutral-50 hover:text-emerald-600 dark:border-neutral-800 dark:bg-zinc-950 dark:hover:bg-zinc-900 dark:hover:text-emerald-400 transition-colors rounded-xl shadow-sm">
                        <CalendarCheck className="h-5 w-5" />
                        <span className="text-xs font-semibold">Log Attendance</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2 border-neutral-200 bg-white hover:bg-neutral-50 hover:text-violet-600 dark:border-neutral-800 dark:bg-zinc-950 dark:hover:bg-zinc-900 dark:hover:text-violet-400 transition-colors rounded-xl shadow-sm">
                        <CreditCard className="h-5 w-5" />
                        <span className="text-xs font-semibold">Collect Fee</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2 border-neutral-200 bg-white hover:bg-neutral-50 hover:text-amber-600 dark:border-neutral-800 dark:bg-zinc-950 dark:hover:bg-zinc-900 dark:hover:text-amber-400 transition-colors rounded-xl shadow-sm">
                        <Megaphone className="h-5 w-5" />
                        <span className="text-xs font-semibold">Send Notice</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2 border-neutral-200 bg-white hover:bg-neutral-50 hover:text-sky-600 dark:border-neutral-800 dark:bg-zinc-950 dark:hover:bg-zinc-900 dark:hover:text-sky-400 transition-colors rounded-xl shadow-sm md:hidden lg:flex">
                        <FileEdit className="h-5 w-5" />
                        <span className="text-xs font-semibold">Exams & Results</span>
                    </Button>
                </div>

                {/* Main Content Area */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                    
                    {/* Left Column - Wider */}
                    <Card className="lg:col-span-4 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between pb-4">
                            <div>
                                <CardTitle className="text-lg">Recent Admissions</CardTitle>
                                <CardDescription>Latest students added to the roster this week.</CardDescription>
                            </div>
                            <Button variant="ghost" size="sm" className="hidden sm:flex text-neutral-500 hover:text-indigo-600">View All</Button>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-neutral-100 dark:border-neutral-800">
                                        <TableHead>Student Details</TableHead>
                                        <TableHead>Grade</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Enrolled Date</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {[
                                        { name: 'Sarah Jenkins', id: 'STD-2401', grade: '10th Grade (A)', status: 'Active', date: 'Today, 09:41 AM', img: 'SJ' },
                                        { name: 'Michael Chang', id: 'STD-2402', grade: '8th Grade (B)', status: 'Pending Docs', date: 'Yesterday', img: 'MC' },
                                        { name: 'Emily Rodriguez', id: 'STD-2403', grade: '12th Grade (Science)', status: 'Active', date: 'Mar 28, 2026', img: 'ER' },
                                        { name: 'David Kim', id: 'STD-2404', grade: '5th Grade (C)', status: 'Active', date: 'Mar 25, 2026', img: 'DK' },
                                    ].map((student) => (
                                        <TableRow key={student.id} className="border-neutral-100 dark:border-neutral-800">
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-8 w-8">
                                                        <AvatarFallback className="bg-indigo-100 text-indigo-700 text-xs dark:bg-indigo-900/50 dark:text-indigo-300">{student.img}</AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex flex-col">
                                                        <span className="font-medium text-neutral-900 dark:text-white">{student.name}</span>
                                                        <span className="text-xs text-neutral-500">{student.id}</span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-sm font-medium">{student.grade}</TableCell>
                                            <TableCell>
                                                <Badge variant={student.status === 'Active' ? 'default' : 'secondary'} className={student.status === 'Active' ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-amber-100 text-amber-800 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-400'}>
                                                    {student.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right text-sm text-neutral-500">{student.date}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    {/* Right Column */}
                    <Card className="lg:col-span-3 shadow-sm">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-lg">Today's Administrative Schedule</CardTitle>
                            <CardDescription>Upcoming meetings and tasks for faculty.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {[
                                    { time: '10:00 AM', title: 'Staff Meeting: Quarter 1 Results', type: 'Meeting', detail: 'Conference Room 2' },
                                    { time: '11:30 AM', title: 'Parent-Teacher Conf (Smith Family)', type: 'Conference', detail: 'Faculty Office A' },
                                    { time: '01:00 PM', title: 'Facility Safety Inspection', type: 'Operational', detail: 'Science Block' },
                                    { time: '03:15 PM', title: 'Review Payroll Submissions', type: 'Financial', detail: 'Due by EOD' },
                                ].map((schedule, i) => (
                                    <div key={i} className="flex gap-4 items-start">
                                        <div className="flex flex-col items-center mt-0.5">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800">
                                                <Clock className="h-4 w-4 text-neutral-500 dark:text-neutral-400" />
                                            </div>
                                            {i !== 3 && <div className="h-full w-px bg-neutral-200 mt-2 mb-[-8px] dark:bg-neutral-800" />}
                                        </div>
                                        <div className="flex flex-col gap-1 pb-4">
                                            <span className="text-sm font-semibold text-neutral-900 dark:text-white leading-none">{schedule.title}</span>
                                            <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                                                <span className="font-medium text-indigo-600 dark:text-indigo-400">{schedule.time}</span>
                                                <span>•</span>
                                                <span>{schedule.detail}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            <Button variant="ghost" className="w-full mt-2 text-sm text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300">
                                View Full Calendar
                            </Button>
                        </CardContent>
                    </Card>
                    
                </div>
            </div>
        </>
    );
}

Dashboard.layout = (props: { currentTeam?: { slug: string } | null }) => ({
    breadcrumbs: [
        {
            title: 'Management Dashboard',
            href: props.currentTeam ? dashboard().url : '/',
        },
    ],
});
