import { index, createCategory, allocate } from '@/actions/App/Http/Controllers/Academic/FeeController';
import { Head, useForm, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreditCard, Plus, UserPlus } from 'lucide-react';
import { toast } from 'sonner';
import { dashboard } from '@/routes';

interface Category {
    id: string;
    name: string;
    amount: number;
    periodicity: string;
    description: string;
}

interface Allocation {
    id: string;
    fee_category: Category;
    school_class?: { name: string; section: string };
    student?: { user: { name: string } };
    start_date: string;
    end_date: string;
}

export default function FeeIndex({ categories, allocations }: { categories: Category[], allocations: Allocation[] }) {
    const categoryForm = useForm({
        name: '',
        amount: '',
        periodicity: 'monthly',
        description: '',
    });

    const allocationForm = useForm({
        fee_category_id: '',
        class_id: '',
        student_id: '',
        start_date: '',
        end_date: '',
    });

    const { props } = usePage();
    const team = (props as any).currentTeam?.slug;

    const handleCreateCategory = (e: React.FormEvent) => {
        e.preventDefault();
        categoryForm.post(createCategory.url(), {
            onSuccess: () => {
                categoryForm.reset();
                toast.success('Fee category created successfully');
            }
        });
    };

    const handleAllocate = (e: React.FormEvent) => {
        e.preventDefault();
        allocationForm.post(allocate.url(), {
            onSuccess: () => {
                allocationForm.reset();
                toast.success('Fee allocated successfully');
            }
        });
    };

    return (
        < >
            <Head title="Fee Management" />

            <div className="container mx-auto p-6 space-y-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Fee Management</h1>
                        <p className="text-muted-foreground">Define your school's fee structures and allocations.</p>
                    </div>
                </div>

                <Tabs defaultValue="categories" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
                        <TabsTrigger value="categories">Fee Categories</TabsTrigger>
                        <TabsTrigger value="allocations">Allocations</TabsTrigger>
                    </TabsList>

                    <TabsContent value="categories" className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <Card className="lg:col-span-1">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Plus className="h-5 w-5" />
                                        New Category
                                    </CardTitle>
                                    <CardDescription>Create a new fee type (e.g. Tuition, Transport).</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleCreateCategory} className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Name</Label>
                                            <Input
                                                id="name"
                                                value={categoryForm.data.name}
                                                onChange={e => categoryForm.setData('name', e.target.value)}
                                                placeholder="e.g. Monthly Tuition"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="amount">Amount ($)</Label>
                                            <Input
                                                id="amount"
                                                type="number"
                                                value={categoryForm.data.amount}
                                                onChange={e => categoryForm.setData('amount', e.target.value)}
                                                placeholder="0.00"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="periodicity">Periodicity</Label>
                                            <Select
                                                onValueChange={value => categoryForm.setData('periodicity', value)}
                                                defaultValue={categoryForm.data.periodicity}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select frequency" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="monthly">Monthly</SelectItem>
                                                    <SelectItem value="term">Term-based</SelectItem>
                                                    <SelectItem value="annual">Annual</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="description">Description (Optional)</Label>
                                            <Input
                                                id="description"
                                                value={categoryForm.data.description}
                                                onChange={e => categoryForm.setData('description', e.target.value)}
                                            />
                                        </div>
                                        <Button type="submit" className="w-full" disabled={categoryForm.processing}>
                                            Create Category
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>

                            <Card className="lg:col-span-2">
                                <CardHeader>
                                    <CardTitle>Existing Categories</CardTitle>
                                    <CardDescription>Defined fee types for this school.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Name</TableHead>
                                                <TableHead>Type</TableHead>
                                                <TableHead className="text-right">Amount</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {categories.map((cat) => (
                                                <TableRow key={cat.id}>
                                                    <TableCell className="font-medium">{cat.name}</TableCell>
                                                    <TableCell className="capitalize">{cat.periodicity}</TableCell>
                                                    <TableCell className="text-right font-mono">${cat.amount}</TableCell>
                                                </TableRow>
                                            ))}
                                            {categories.length === 0 && (
                                                <TableRow>
                                                    <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                                                        No categories defined yet.
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="allocations" className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <Card className="lg:col-span-1">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <UserPlus className="h-5 w-5" />
                                        Assign Fee
                                    </CardTitle>
                                    <CardDescription>Allocate a fee to a class or specific student.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleAllocate} className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="cat_id">Fee Category</Label>
                                            <Select
                                                onValueChange={value => allocationForm.setData('fee_category_id', value)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select category" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {categories.map(c => (
                                                        <SelectItem key={c.id} value={c.id}>{c.name} (${c.amount})</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        {/* Simplified for now - can add Student/Class Picker later */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="start">Start Date</Label>
                                                <Input
                                                    id="start"
                                                    type="date"
                                                    value={allocationForm.data.start_date}
                                                    onChange={e => allocationForm.setData('start_date', e.target.value)}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="end">End Date</Label>
                                                <Input
                                                    id="end"
                                                    type="date"
                                                    value={allocationForm.data.end_date}
                                                    onChange={e => allocationForm.setData('end_date', e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <Button type="submit" className="w-full" variant="secondary" disabled={allocationForm.processing}>
                                            Assign Fee
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>

                            <Card className="lg:col-span-2">
                                <CardHeader>
                                    <CardTitle>Active Allocations</CardTitle>
                                    <CardDescription>Fees currently assigned to students or classes.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Category</TableHead>
                                                <TableHead>Target</TableHead>
                                                <TableHead>Validity</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {allocations.map((all) => (
                                                <TableRow key={all.id}>
                                                    <TableCell className="font-medium">{all.fee_category.name}</TableCell>
                                                    <TableCell>
                                                        {all.student ? `Student: ${all.student.user.name}` : (all.school_class ? `Class: ${all.school_class.name}` : 'Global')}
                                                    </TableCell>
                                                    <TableCell className="text-xs text-muted-foreground">
                                                        {all.start_date} to {all.end_date}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                            {allocations.length === 0 && (
                                                <TableRow>
                                                    <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                                                        No fees assigned yet.
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </>
    );
}
FeeIndex.layout = (props: { currentTeam?: { slug: string } | null }) => ({
    breadcrumbs: [
        { title: 'Fees', href: index.url() },
    ],
});