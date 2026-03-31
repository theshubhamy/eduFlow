import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CheckCircle2, ChevronLeft, Save } from 'lucide-react';
import { Link } from '@inertiajs/react';

interface Student {
    id: string;
    user: {
        name: string;
    };
    roll_number: string;
}

interface SchoolClass {
    id: string;
    name: string;
    section: string;
}

interface AttendanceRecord {
    student_id: string;
    status: string;
}

interface PageProps {
    class: SchoolClass;
    date: string;
    students: Student[];
    existingAttendance: Record<string, AttendanceRecord>;
}

export default function AttendanceCreate({ class: schoolClass, date, students, existingAttendance }: PageProps) {
    const { data, setData, post, processing } = useForm({
        class_id: schoolClass.id,
        date: date,
        attendance: students.reduce((acc, student) => {
            acc[student.id] = existingAttendance[student.id]?.status || 'present';
            return acc;
        }, {} as Record<string, string>),
    });

    const handleStatusChange = (studentId: string, status: string) => {
        setData('attendance', {
            ...data.attendance,
            [studentId]: status,
        });
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/attendance');
    };

    return (
        <>
            <Head title="Mark Attendance" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" asChild>
                            <Link href="/attendance">
                                <ChevronLeft className="h-5 w-5" />
                            </Link>
                        </Button>
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight">Mark Attendance</h2>
                            <p className="text-muted-foreground">
                                {schoolClass.name} - {schoolClass.section} | {new Date(date).toLocaleDateString(undefined, { dateStyle: 'full' })}
                            </p>
                        </div>
                    </div>
                    <Button onClick={submit} disabled={processing} className="px-6">
                        <Save className="mr-2 h-4 w-4" />
                        Save Attendance
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Class Register</CardTitle>
                        <CardDescription>Select the status for each student. All are marked "Present" by default.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-24">Roll No.</TableHead>
                                    <TableHead>Student Name</TableHead>
                                    <TableHead className="text-right">Attendance Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {students.map((student) => (
                                    <TableRow key={student.id}>
                                        <TableCell className="font-mono text-muted-foreground">{student.roll_number}</TableCell>
                                        <TableCell className="font-semibold text-lg">{student.user.name}</TableCell>
                                        <TableCell className="text-right">
                                            <RadioGroup 
                                                defaultValue={data.attendance[student.id]} 
                                                onValueChange={(value) => handleStatusChange(student.id, value)}
                                                className="flex justify-end gap-6"
                                            >
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="present" id={`${student.id}-present`} className="text-green-600 border-green-600" />
                                                    <Label htmlFor={`${student.id}-present`}>Present</Label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="absent" id={`${student.id}-absent`} className="text-red-600 border-red-600" />
                                                    <Label htmlFor={`${student.id}-absent`}>Absent</Label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="late" id={`${student.id}-late`} className="text-yellow-600 border-yellow-600" />
                                                    <Label htmlFor={`${student.id}-late`}>Late</Label>
                                                </div>
                                            </RadioGroup>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {students.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-center h-24 text-muted-foreground">
                                            No students enrolled in this class.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

AttendanceCreate.layout = () => ({
    breadcrumbs: [
        { title: 'Attendance', href: '/attendance' },
        { title: 'Mark', href: '/attendance/create' },
    ],
});
