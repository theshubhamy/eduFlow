import { Head, Link, useForm } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { store, index } from '@/routes/students';
import { dashboard } from '@/routes';
import InputError from '@/components/input-error';
import { LoaderCircle, ChevronLeft } from 'lucide-react';

interface ClassData {
    id: string;
    _id?: string;
    name: string;
    section: string;
}

export default function StudentCreate({ classes }: { classes: ClassData[] }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        class_id: '',
        roll_number: '',
        admission_date: new Date().toISOString().split('T')[0],
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(store.url());
    };

    return (
        <>
            <Head title="Admit Student" />

            <div className="flex flex-1 flex-col gap-6 p-6 max-w-4xl mx-auto w-full">
                {/* Header Section */}
                <div className="flex items-center gap-3">
                    <Button variant="outline" size="icon" asChild className="h-9 w-9 rounded-full">
                        <Link href={index.url()}>
                            <ChevronLeft className="h-4 w-4" />
                            <span className="sr-only">Back</span>
                        </Link>
                    </Button>
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">Admit New Student</h2>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">Enter personal and academic details to complete enrollment.</p>
                    </div>
                </div>

                <form onSubmit={submit}>
                    <Card className="shadow-sm overflow-hidden">
                        <CardHeader className="bg-neutral-50/50 dark:bg-white/5 border-b border-neutral-100 dark:border-neutral-800">
                            <CardTitle>Enrollment Form</CardTitle>
                            <CardDescription>All fields are required unless otherwise noted.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="grid gap-8 md:grid-cols-2">
                                
                                {/* Personal Information */}
                                <div className="space-y-6">
                                    <div className="space-y-4">
                                        <h3 className="text-sm border-b pb-2 font-semibold text-neutral-900 dark:text-neutral-200 border-neutral-100 dark:border-neutral-800">Personal Data</h3>
                                        <div className="grid gap-2">
                                            <Label htmlFor="name">Full Name</Label>
                                            <Input
                                                id="name"
                                                autoFocus
                                                value={data.name}
                                                onChange={(e) => setData('name', e.target.value)}
                                                placeholder="e.g. Sarah Jenkins"
                                                className="bg-neutral-50/50 dark:bg-zinc-900/50"
                                            />
                                            <InputError message={errors.name} />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="email">Guardian / Student Email</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                value={data.email}
                                                onChange={(e) => setData('email', e.target.value)}
                                                placeholder="guardian@example.com"
                                                className="bg-neutral-50/50 dark:bg-zinc-900/50"
                                            />
                                            <InputError message={errors.email} />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="password">Temporary Portal Password</Label>
                                            <Input
                                                id="password"
                                                type="password"
                                                value={data.password}
                                                onChange={(e) => setData('password', e.target.value)}
                                                placeholder="••••••••"
                                                className="bg-neutral-50/50 dark:bg-zinc-900/50"
                                            />
                                            <InputError message={errors.password} />
                                        </div>
                                    </div>
                                </div>

                                {/* Academic Information */}
                                <div className="space-y-6">
                                    <div className="space-y-4">
                                        <h3 className="text-sm border-b pb-2 font-semibold text-neutral-900 dark:text-neutral-200 border-neutral-100 dark:border-neutral-800">Academic Assignment</h3>
                                        
                                        <div className="grid gap-2">
                                            <Label htmlFor="class_id">Class & Section</Label>
                                            <Select value={data.class_id} onValueChange={(val) => setData('class_id', val)}>
                                                <SelectTrigger className="bg-neutral-50/50 dark:bg-zinc-900/50">
                                                    <SelectValue placeholder="Select class..." />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {classes?.map((c) => (
                                                        <SelectItem key={c.id || c._id} value={(c.id || c._id) as string}>
                                                            {c.name} (Section {c.section})
                                                        </SelectItem>
                                                    ))}
                                                    {(!classes || classes.length === 0) && (
                                                        <SelectItem value="empty" disabled>No classes available</SelectItem>
                                                    )}
                                                </SelectContent>
                                            </Select>
                                            <InputError message={errors.class_id} />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="roll_number">Roll Number / Identifier</Label>
                                            <Input
                                                id="roll_number"
                                                value={data.roll_number}
                                                onChange={(e) => setData('roll_number', e.target.value)}
                                                placeholder="e.g. STD-2405"
                                                className="bg-neutral-50/50 dark:bg-zinc-900/50"
                                            />
                                            <InputError message={errors.roll_number} />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="admission_date">Admission Date</Label>
                                            <Input
                                                id="admission_date"
                                                type="date"
                                                value={data.admission_date}
                                                onChange={(e) => setData('admission_date', e.target.value)}
                                                className="bg-neutral-50/50 dark:bg-zinc-900/50"
                                            />
                                            <InputError message={errors.admission_date} />
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </CardContent>
                        <CardFooter className="bg-neutral-50/80 dark:bg-white/5 border-t border-neutral-100 dark:border-neutral-800 px-6 py-4 flex justify-end gap-3">
                            <Button variant="ghost" asChild disabled={processing}>
                                <Link href={index.url()}>Cancel</Link>
                            </Button>
                            <Button type="submit" disabled={processing} className="bg-indigo-600 text-white hover:bg-indigo-700 min-w-32">
                                {processing ? <LoaderCircle className="h-5 w-5 animate-spin" /> : "Complete Enrollment"}
                            </Button>
                        </CardFooter>
                    </Card>
                </form>
            </div>
        </>
    );
}

StudentCreate.layout = (props: { currentTeam?: { slug: string } | null }) => ({
    breadcrumbs: [
        { title: 'Dashboard', href: props.currentTeam ? dashboard().url : '/' },
        { title: 'Students', href: index.url() },
        { title: 'Admit Student', href: '#' },
    ],
});
