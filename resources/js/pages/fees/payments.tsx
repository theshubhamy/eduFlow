import { collect, downloadReceipt } from '@/actions/App/Http/Controllers/Academic/FeePaymentController';
import { Head, useForm, usePage, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CreditCard, Download, History, Search } from 'lucide-react';
import { toast } from 'sonner';
import { dashboard } from '@/routes';
import payments, { index } from '@/routes/payments';

interface Payment {
    id: string;
    student: { user: { name: string } };
    fee_allocation: { fee_category: { name: string } };
    amount_paid: number;
    payment_date: string;
    method: string;
    period_identifier: string;
    receipt_number: string;
}

export default function FeePayments({ payments }: { payments: { data: Payment[] } }) {
    const { props } = usePage();
    const team = (props as any).currentTeam?.slug;

    const paymentForm = useForm({
        student_id: '',
        fee_allocation_id: '',
        amount_paid: '',
        method: 'cash',
        period_identifier: '',
    });

    const handleCollectPayment = (e: React.FormEvent) => {
        e.preventDefault();
        paymentForm.post(collect.url(), {
            onSuccess: () => {
                paymentForm.reset();
                toast.success('Payment collected successfully');
            }
        });
    };

    return (
        <>
            <Head title="Fee Payments" />

            <div className="container mx-auto p-6 space-y-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Payments & Receipts</h1>
                        <p className="text-muted-foreground">Collect student fees and manage transaction history.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card className="lg:col-span-1">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CreditCard className="h-5 w-5 text-blue-600" />
                                Collect Payment
                            </CardTitle>
                            <CardDescription>Enter payment details for a student.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleCollectPayment} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="s_id">Student ID</Label>
                                    <Input
                                        id="s_id"
                                        value={paymentForm.data.student_id}
                                        onChange={e => paymentForm.setData('student_id', e.target.value)}
                                        placeholder="Enter Student ID"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="a_id">Allocation ID</Label>
                                    <Input
                                        id="a_id"
                                        value={paymentForm.data.fee_allocation_id}
                                        onChange={e => paymentForm.setData('fee_allocation_id', e.target.value)}
                                        placeholder="Allocation Reference"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="amount">Amount ($)</Label>
                                        <Input
                                            id="amount"
                                            type="number"
                                            value={paymentForm.data.amount_paid}
                                            onChange={e => paymentForm.setData('amount_paid', e.target.value)}
                                            placeholder="0.00"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="method">Method</Label>
                                        <Select
                                            onValueChange={value => paymentForm.setData('method', value)}
                                            defaultValue={paymentForm.data.method}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pay via" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="cash">Cash</SelectItem>
                                                <SelectItem value="online">Online</SelectItem>
                                                <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="period">Period (e.g. April 2026)</Label>
                                    <Input
                                        id="period"
                                        value={paymentForm.data.period_identifier}
                                        onChange={e => paymentForm.setData('period_identifier', e.target.value)}
                                        placeholder="Month/Term Name"
                                    />
                                </div>
                                <Button type="submit" className="w-full" disabled={paymentForm.processing}>
                                    Collect & Print
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <History className="h-5 w-5 text-green-600" />
                                Recent Transactions
                            </CardTitle>
                            <CardDescription>History of all fee collections.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Student</TableHead>
                                        <TableHead>Fee Type</TableHead>
                                        <TableHead>Period</TableHead>
                                        <TableHead className="text-right">Amount</TableHead>
                                        <TableHead className="text-center">Receipt</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {payments.data.map((p) => (
                                        <TableRow key={p.id}>
                                            <TableCell className="font-medium text-xs lg:text-sm">
                                                {p.student.user.name}
                                                <div className="text-[10px] text-muted-foreground">{p.receipt_number}</div>
                                            </TableCell>
                                            <TableCell className="text-xs">{p.fee_allocation.fee_category.name}</TableCell>
                                            <TableCell className="text-xs">{p.period_identifier}</TableCell>
                                            <TableCell className="text-right font-mono text-xs font-bold text-green-600">
                                                ${p.amount_paid}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Button size="icon" variant="ghost" asChild>
                                                    <a href={downloadReceipt.url({ id: p.id })} target="_blank">
                                                        <Download className="h-4 w-4" />
                                                    </a>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {payments.data.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                                                No payments recorded yet.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
FeePayments.layout = (props: { currentTeam?: { slug: string } | null }) => ({
    breadcrumbs: [
        { title: 'Payments', href: index.url() },
    ],
});