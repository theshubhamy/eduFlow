import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarIcon } from 'lucide-react';

interface SchoolClass {
    id: string;
    name: string;
    section: string;
}

export default function AttendanceIndex({ classes }: { classes: SchoolClass[] }) {
    const { data, setData, get, processing } = useForm({
        class_id: '',
        date: new Date().toISOString().split('T')[0],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        get('/attendance/create');
    };

    return (
        <>
            <Head title="Attendance Management" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4 max-w-md mx-auto justify-center">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CalendarIcon className="h-5 w-5" />
                            Daily Attendance
                        </CardTitle>
                        <CardDescription>Select a class and date to record attendance.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="class_id">Class</Label>
                                <Select 
                                    onValueChange={(value) => setData('class_id', value)}
                                    required
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Choose a class..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {classes.map((cls) => (
                                            <SelectItem key={cls.id} value={cls.id.toString()}>
                                                {cls.name} - {cls.section}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="date">Date</Label>
                                <Input
                                    id="date"
                                    type="date"
                                    value={data.date}
                                    onChange={(e) => setData('date', e.target.value)}
                                    required
                                />
                            </div>

                            <Button type="submit" className="w-full" disabled={processing || !data.class_id}>
                                Fetch Students
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

AttendanceIndex.layout = () => ({
    breadcrumbs: [
        { title: 'Attendance', href: '/attendance' },
    ],
});
