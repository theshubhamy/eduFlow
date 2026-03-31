import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Plus, Search, MoreHorizontal, User, Mail, PenSquare } from 'lucide-react';
import { create } from '@/routes/students';
import { dashboard } from '@/routes';

interface StudentData {
    id: string;
    _id: string; // MongoDB format
    roll_number: string;
    admission_date: string;
    user: {
        id: string;
        name: string;
        email: string;
    };
    school_class: {
        id: string;
        name: string;
        section: string;
    };
}

interface StudentsProps {
    students: {
        data: StudentData[];
        current_page: number;
        last_page: number;
        total: number;
    };
}

export default function StudentsIndex({ students }: StudentsProps) {
    const data = students?.data || [];

    return (
        <>
            <Head title="Student Directory" />

            <div className="flex flex-1 flex-col gap-6 p-6 max-w-7xl mx-auto w-full">
                {/* Header & Actions */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">Student Directory</h2>
                        <p className="text-neutral-500 dark:text-neutral-400">Manage all admitted students ({students?.total || 0} total)</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button asChild className="h-10 rounded-xl bg-indigo-600 font-semibold text-white hover:bg-indigo-700 shadow-sm active:scale-[0.98]">
                            <Link href={create.url()}>
                                <Plus className="mr-2 h-4 w-4" /> Add Student
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Filters */}
                <Card className="shadow-sm">
                    <CardHeader className="p-4 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-white/5">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                            <div className="relative flex-1 max-w-sm">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
                                <Input
                                    type="text"
                                    placeholder="Search by student name, roll number, or email..."
                                    className="h-10 pl-9 rounded-lg bg-white dark:bg-zinc-900"
                                />
                            </div>
                            <Select defaultValue="all">
                                <SelectTrigger className="w-[180px] h-10 rounded-lg bg-white dark:bg-zinc-900">
                                    <SelectValue placeholder="All Classes" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Classes</SelectItem>
                                    <SelectItem value="1">10th Grade (A)</SelectItem>
                                    <SelectItem value="2">9th Grade (B)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardHeader>

                    {/* Table */}
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-transparent hover:bg-transparent">
                                    <TableHead className="w-[300px]">Student Details</TableHead>
                                    <TableHead>Class / Section</TableHead>
                                    <TableHead>Admission Date</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-48 text-center text-neutral-500">
                                            No students found. Enroll your first student to get started.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    data.map((student) => (
                                        <TableRow key={student.id || student._id} className="group border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-zinc-900/50 transition-colors">
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-10 w-10 border border-neutral-200 shadow-sm dark:border-neutral-800">
                                                        <AvatarFallback className="bg-indigo-100/80 text-indigo-700 font-semibold text-sm dark:bg-indigo-900/50 dark:text-indigo-300">
                                                            {student.user?.name?.substring(0, 2).toUpperCase()}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex flex-col">
                                                        <span className="font-semibold text-neutral-900 dark:text-white">
                                                            {student.user?.name}
                                                        </span>
                                                        <span className="text-xs text-neutral-500 dark:text-neutral-400">
                                                            {student.roll_number} • {student.user?.email}
                                                        </span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-neutral-800 dark:text-neutral-200">
                                                        {student.school_class?.name || 'Unassigned'}
                                                    </span>
                                                    <span className="text-xs text-neutral-500">
                                                        Section {student.school_class?.section || 'N/A'}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-sm text-neutral-600 dark:text-neutral-400">
                                                {new Date(student.admission_date).toLocaleDateString(undefined, {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                            </TableCell>
                                            <TableCell>
                                                <Badge className="bg-emerald-100/80 text-emerald-800 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 font-medium">
                                                    Enrolled
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 data-[state=open]:opacity-100">
                                                            <span className="sr-only">Open menu</span>
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-[160px]">
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem className="cursor-pointer">
                                                            <User className="mr-2 h-4 w-4" />
                                                            View Profile
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="cursor-pointer">
                                                            <PenSquare className="mr-2 h-4 w-4" />
                                                            Edit Student
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="cursor-pointer">
                                                            <Mail className="mr-2 h-4 w-4" />
                                                            Contact Family
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                        
                        {/* Pagination Footer */}
                        {students?.last_page > 1 && (
                            <div className="flex items-center justify-between px-4 py-3 border-t border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-white/5">
                                <div className="text-sm text-neutral-500">
                                    Showing page <span className="font-medium text-neutral-900 dark:text-white">{students.current_page}</span> of <span className="font-medium text-neutral-900 dark:text-white">{students.last_page}</span>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" disabled={students.current_page === 1}>Previous</Button>
                                    <Button variant="outline" size="sm" disabled={students.current_page === students.last_page}>Next</Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

StudentsIndex.layout = (props: { currentTeam?: { slug: string } | null }) => ({
    breadcrumbs: [
        { title: 'Dashboard', href: props.currentTeam ? dashboard().url : '/' },
        { title: 'Students', href: '#' },
    ],
});
