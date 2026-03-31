import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus } from 'lucide-react';

interface Student {
    id: string;
    roll_number: string;
    admission_date: string;
    user: {
        name: string;
        email: string;
    };
    school_class?: {
        name: string;
        section: string;
    };
}

interface PaginatedStudents {
    data: Student[];
    links: any[];
}

export default function StudentIndex({ students }: { students: PaginatedStudents }) {
    return (
        <>
            <Head title="Student Directory" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Students</h2>
                        <p className="text-muted-foreground">Manage and view all admitted students.</p>
                    </div>
                    <Button asChild>
                        <Link href="/students/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Admit Student
                        </Link>
                    </Button>
                </div>

                <div className="rounded-md border bg-card text-card-foreground shadow-sm">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Roll No.</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Class</TableHead>
                                <TableHead>Admission Date</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {students.data.map((student) => (
                                <TableRow key={student.id}>
                                    <TableCell className="font-medium text-blue-600">{student.roll_number}</TableCell>
                                    <TableCell className="font-semibold">{student.user.name}</TableCell>
                                    <TableCell className="text-muted-foreground">{student.user.email}</TableCell>
                                    <TableCell>
                                        {student.school_class 
                                            ? `${student.school_class.name} - ${student.school_class.section}` 
                                            : 'Not Assigned'}
                                    </TableCell>
                                    <TableCell>{new Date(student.admission_date).toLocaleDateString()}</TableCell>
                                </TableRow>
                            ))}
                            {students.data.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                                        No students found. Admit one to get started.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </>
    );
}

StudentIndex.layout = () => ({
    breadcrumbs: [
        { title: 'Students', href: '/students' },
    ],
});
