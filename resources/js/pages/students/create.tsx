import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FormEventHandler } from 'react';

interface SchoolClass {
    id: string;
    name: string;
    section: string;
}

export default function StudentCreate({ classes }: { classes: SchoolClass[] }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: 'password123',
        class_id: '',
        roll_number: '',
        admission_date: new Date().toISOString().split('T')[0],
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/students');
    };

    return (
        <>
            <Head title="Admit Student" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4 max-w-2xl mx-auto">
                <Card>
                    <CardHeader>
                        <CardTitle>Student Admission</CardTitle>
                        <CardDescription>Enter details to enroll a new student.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                />
                                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        required
                                    />
                                    {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password">Temporary Password</Label>
                                    <Input
                                        id="password"
                                        type="text"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        required
                                    />
                                    {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="class_id">Class</Label>
                                    <Select 
                                        value={data.class_id} 
                                        onValueChange={(value) => setData('class_id', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Class" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {classes.map((cls) => (
                                                <SelectItem key={cls.id} value={cls.id.toString()}>
                                                    {cls.name} - {cls.section}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.class_id && <p className="text-sm text-red-500">{errors.class_id}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="roll_number">Roll Number</Label>
                                    <Input
                                        id="roll_number"
                                        value={data.roll_number}
                                        onChange={(e) => setData('roll_number', e.target.value)}
                                        required
                                    />
                                    {errors.roll_number && <p className="text-sm text-red-500">{errors.roll_number}</p>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="admission_date">Admission Date</Label>
                                <Input
                                    id="admission_date"
                                    type="date"
                                    value={data.admission_date}
                                    onChange={(e) => setData('admission_date', e.target.value)}
                                    required
                                />
                                {errors.admission_date && <p className="text-sm text-red-500">{errors.admission_date}</p>}
                            </div>

                            <div className="flex justify-end pt-4">
                                <Button type="submit" disabled={processing}>
                                    Admit Student
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

StudentCreate.layout = () => ({
    breadcrumbs: [
        { title: 'Students', href: '/students' },
        { title: 'Admit', href: '/students/create' },
    ],
});
