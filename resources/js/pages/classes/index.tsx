import { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Plus, MoreHorizontal, GraduationCap, Users } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import { index, store, destroy } from '@/routes/classes';
import { dashboard } from '@/routes';

interface ClassData {
    id: string;
    _id: string;
    name: string;
    section: string;
    room_number: string | null;
    students_count: number;
    created_at: string;
}

export default function ClassesIndex({ classes }: { classes: ClassData[] }) {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        name: '',
        section: '',
        room_number: '',
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
            <Head title="Class Configuration" />

            <div className="flex flex-1 flex-col gap-6 p-6 max-w-7xl mx-auto w-full">
                {/* Header & Actions */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">Class Configuration</h2>
                        <p className="text-neutral-500 dark:text-neutral-400">Define academic grade levels and structural sections.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Dialog open={isCreateModalOpen} onOpenChange={handleOpenChange}>
                            <DialogTrigger asChild>
                                <Button className="h-10 rounded-xl bg-indigo-600 font-semibold text-white hover:bg-indigo-700 shadow-sm active:scale-[0.98]">
                                    <Plus className="mr-2 h-4 w-4" /> Add Class
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <form onSubmit={submit}>
                                    <DialogHeader>
                                        <DialogTitle>Create New Class</DialogTitle>
                                        <DialogDescription>
                                            Add a new grade or section. E.g., "10th Grade" and section "A".
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="name">Class Name / Grade Level</Label>
                                            <Input
                                                id="name"
                                                value={data.name}
                                                onChange={(e) => setData('name', e.target.value)}
                                                placeholder="e.g. 10th Grade"
                                            />
                                            <InputError message={errors.name} />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="section">Section Identifier</Label>
                                            <Input
                                                id="section"
                                                value={data.section}
                                                onChange={(e) => setData('section', e.target.value)}
                                                placeholder="e.g. A, B, Science, Arts"
                                            />
                                            <InputError message={errors.section} />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="room">Room Number <span className="text-neutral-400 font-normal">(Optional)</span></Label>
                                            <Input
                                                id="room"
                                                value={data.room_number || ''}
                                                onChange={(e) => setData('room_number', e.target.value)}
                                                placeholder="e.g. 104-B"
                                            />
                                            <InputError message={errors.room_number} />
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button variant="ghost" type="button" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
                                        <Button type="submit" disabled={processing} className="bg-indigo-600 hover:bg-indigo-700 text-white">Save Class</Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                <Card className="shadow-sm">
                    <CardHeader className="p-4 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-white/5">
                        <CardTitle className="text-lg">Configured Classes</CardTitle>
                        <CardDescription>Directory of all structural classes explicitly managed.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-transparent hover:bg-transparent">
                                    <TableHead className="w-[300px]">Class / Grade</TableHead>
                                    <TableHead>Section</TableHead>
                                    <TableHead>Room</TableHead>
                                    <TableHead>Capacity</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {classes?.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-48 text-center text-neutral-500">
                                            No classes defined yet. Click "Add Class" to start configuring the academic structure.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    classes?.map((cls) => (
                                        <TableRow key={cls.id || cls._id} className="group border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-zinc-900/50 transition-colors">
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50">
                                                        <GraduationCap className="h-5 w-5" />
                                                    </div>
                                                    <span className="font-semibold text-neutral-900 dark:text-white">
                                                        {cls.name}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <span className="inline-flex items-center rounded-md bg-neutral-100 dark:bg-neutral-800 px-2.5 py-1 text-sm font-medium text-neutral-800 dark:text-neutral-200">
                                                    {cls.section}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                                                {cls.room_number || 'Unassigned'}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                                                    <Users className="h-4 w-4" />
                                                    {cls.students_count} Enrolled
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
                                                            <Link href={destroy.url({ id: cls.id || cls._id })} method="delete" as="button" className="w-full text-left" onClick={(e) => {
                                                                if (cls.students_count > 0) {
                                                                    e.preventDefault();
                                                                    alert("Cannot delete a class that has enrolled students.");
                                                                }
                                                            }}>
                                                                Delete Class
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

ClassesIndex.layout = (props: { currentTeam?: { slug: string } | null }) => ({
    breadcrumbs: [
        { title: 'Classes', href: index.url() },
    ],
});
