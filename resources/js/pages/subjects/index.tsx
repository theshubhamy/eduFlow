import { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Plus, MoreHorizontal, BookOpen, GraduationCap } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import InputError from '@/components/input-error';
import { index, store, destroy } from '@/routes/subjects';
import { dashboard } from '@/routes';

interface SubjectData {
    id: string;
    _id: string;
    name: string;
    code: string;
    school_class: {
        id: string;
        name: string;
        section: string;
    } | null;
    teacher: {
        id: string;
        name: string;
    } | null;
}

interface OptionData {
    id: string;
    name: string;
    section?: string;
}

export default function SubjectsIndex({
    subjects,
    classes,
    teachers,
}: {
    subjects: SubjectData[];
    classes: OptionData[];
    teachers: OptionData[];
}) {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        name: '',
        code: '',
        class_id: '',
        teacher_id: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(store.url(), {
            onSuccess: () => {
                setIsCreateModalOpen(false);
                reset();
            },
        });
    };

    const handleOpenChange = (open: boolean) => {
        if (!open) {
            reset();
            clearErrors();
        }
        setIsCreateModalOpen(open);
    };

    return (
        <>
            <Head title="Subjects Dictionary" />

            <div className="flex flex-1 flex-col gap-6 p-6 max-w-7xl mx-auto w-full">
                {/* Header & Actions */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">Subjects Dictionary</h2>
                        <p className="text-neutral-500 dark:text-neutral-400">Map specialized subjects to classes and faculty.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Dialog open={isCreateModalOpen} onOpenChange={handleOpenChange}>
                            <DialogTrigger asChild>
                                <Button className="h-10 rounded-xl bg-indigo-600 font-semibold text-white hover:bg-indigo-700 shadow-sm active:scale-[0.98]">
                                    <Plus className="mr-2 h-4 w-4" /> Add Subject
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <form onSubmit={submit}>
                                    <DialogHeader>
                                        <DialogTitle>Create New Subject</DialogTitle>
                                        <DialogDescription>
                                            Define a curriculum subject and link it to an existing teacher and class.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="name">Subject Name</Label>
                                            <Input
                                                id="name"
                                                value={data.name}
                                                onChange={(e) => setData('name', e.target.value)}
                                                placeholder="e.g. Advanced Physics"
                                            />
                                            <InputError message={errors.name} />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="code">Subject Code</Label>
                                            <Input
                                                id="code"
                                                value={data.code}
                                                onChange={(e) => setData('code', e.target.value)}
                                                placeholder="e.g. PHY-201"
                                                className="uppercase"
                                            />
                                            <InputError message={errors.code} />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="class_id">Associated Class</Label>
                                            <Select value={data.class_id} onValueChange={(val) => setData('class_id', val)}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select class..." />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {classes?.map((c) => (
                                                        <SelectItem key={c.id} value={c.id}>
                                                            {c.name} (Section {c.section})
                                                        </SelectItem>
                                                    ))}
                                                    {(!classes || classes.length === 0) && (
                                                        <SelectItem value="empty" disabled>Please create a class first.</SelectItem>
                                                    )}
                                                </SelectContent>
                                            </Select>
                                            <InputError message={errors.class_id} />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="teacher_id">Lead Teacher</Label>
                                            <Select value={data.teacher_id} onValueChange={(val) => setData('teacher_id', val)}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select teacher..." />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {teachers?.map((t) => (
                                                        <SelectItem key={t.id} value={t.id}>
                                                            {t.name}
                                                        </SelectItem>
                                                    ))}
                                                    {(!teachers || teachers.length === 0) && (
                                                        <SelectItem value="empty" disabled>No teachers found.</SelectItem>
                                                    )}
                                                </SelectContent>
                                            </Select>
                                            <InputError message={errors.teacher_id} />
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button variant="ghost" type="button" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
                                        <Button type="submit" disabled={processing} className="bg-indigo-600 hover:bg-indigo-700 text-white">Save Subject</Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                <Card className="shadow-sm">
                    <CardHeader className="p-4 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-white/5">
                        <CardTitle className="text-lg">Active Subjects</CardTitle>
                        <CardDescription>Curriculum layout categorized by instructional code.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-transparent hover:bg-transparent">
                                    <TableHead className="w-[300px]">Subject Title</TableHead>
                                    <TableHead>Assignee (Teacher)</TableHead>
                                    <TableHead>Class Cohort</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {subjects?.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-48 text-center text-neutral-500">
                                            No subjects mapped yet. Ensure you have valid Classes and Teachers before linking.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    subjects?.map((subject) => (
                                        <TableRow key={subject.id || subject._id} className="group border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-zinc-900/50 transition-colors">
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400 border border-violet-100 dark:border-violet-900/50">
                                                        <BookOpen className="h-5 w-5" />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="font-semibold text-neutral-900 dark:text-white">
                                                            {subject.name}
                                                        </span>
                                                        <span className="text-xs font-mono text-neutral-500 dark:text-neutral-400">
                                                            {subject.code}
                                                        </span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <span className="font-medium text-neutral-800 dark:text-neutral-200">
                                                    {subject.teacher?.name || 'Unassigned'}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <GraduationCap className="h-4 w-4 text-neutral-400" />
                                                    <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                                        {subject.school_class?.name || 'No Class'}
                                                    </span>
                                                    {subject.school_class?.section && (
                                                        <span className="text-xs text-neutral-500">
                                                            (Sec {subject.school_class.section})
                                                        </span>
                                                    )}
                                                </div>
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
                                                        <DropdownMenuLabel>Manage</DropdownMenuLabel>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem asChild className="cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-700 dark:focus:bg-red-900/20 dark:focus:text-red-400">
                                                            <Link href={destroy.url({ id: subject.id || subject._id })} method="delete" as="button" className="w-full text-left">
                                                                Drop Subject
                                                            </Link>
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

SubjectsIndex.layout = (props: { currentTeam?: { slug: string } | null }) => ({
    breadcrumbs: [
        { title: 'Subjects', href: index.url() },
    ],
});
