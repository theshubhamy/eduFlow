import React, { useState } from "react";
import {
  usePayments,
  useFees,
  useCollectPayment,
} from "@/hooks/queries/useFinance";
import { useStudents } from "@/hooks/queries/useStudents";
import { Receipt, Plus, X, AlertCircle, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

export default function PaymentsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [studentId, setStudentId] = useState("");
  const [allocationId, setAllocationId] = useState("");
  const [amountPaid, setAmountPaid] = useState("");
  const [method, setMethod] = useState("cash");
  const [period, setPeriod] = useState("");
  const [submitError, setSubmitError] = useState("");

  // 1. Fetch payments list
  const {
    data: paymentsRes,
    isLoading: isPaymentsLoading,
    error,
  } = usePayments({ page: currentPage, limit: 10 });

  // 2. Fetch students options
  const { data: studentsRes } = useStudents(1, 100, isModalOpen);

  // 3. Fetch allocations options (from fees console)
  const { data: feesRes } = useFees({ enabled: isModalOpen });

  const collectPaymentMutation = useCollectPayment();

  const handleSelectAllocation = (allocId: string) => {
    setAllocationId(allocId);
    const alloc = allocations.find((a: any) => a.id === allocId);
    if (alloc) {
      setAmountPaid(alloc.fee_category.amount.toString());
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !studentId ||
      !allocationId ||
      !amountPaid ||
      !method ||
      !period.trim()
    ) {
      setSubmitError("All fields are required.");
      return;
    }
    collectPaymentMutation.mutate(
      {
        student_id: studentId,
        fee_allocation_id: allocationId,
        amount_paid: parseFloat(amountPaid),
        method,
        period_identifier: period,
      },
      {
        onSuccess: () => {
          setIsModalOpen(false);
          setStudentId("");
          setAllocationId("");
          setAmountPaid("");
          setMethod("cash");
          setPeriod("");
          setSubmitError("");
        },
        onError: (err: any) => {
          setSubmitError(err.message || "Failed to collect payment.");
        },
      },
    );
  };

  const handleDownloadReceipt = (paymentId: string) => {
    window.location.assign(`/api/payments/${paymentId}/receipt`);
  };

  if (isPaymentsLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <Skeleton className="h-8 w-[200px] mb-2" />
            <Skeleton className="h-4 w-[300px]" />
          </div>
          <Skeleton className="h-10 w-[120px]" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-[150px]" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Array.from({ length: 6 }).map((_, idx) => (
                <Skeleton key={idx} className="h-10 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-6 text-destructive">
        <h2 className="text-lg font-bold">Error loading Payments Journal</h2>
        <p className="text-sm mt-1">
          {error instanceof Error ? error.message : "Something went wrong."}
        </p>
      </div>
    );
  }

  const payments = paymentsRes?.data || [];
  const totalPages = paymentsRes?.last_page || 1;
  const students = studentsRes?.data || [];
  const allocations = feesRes?.allocations || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-left">
            Payments Journal
          </h1>
          <p className="text-muted-foreground text-left text-sm mt-1">
            Collect school fees, track payment histories, and print official PDF
            tax receipts.
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="cursor-pointer">
          <Plus className="size-4 mr-2" />
          Collect Payment
        </Button>
      </div>

      {payments.length === 0 ? (
        <Card className="border-dashed border-2 py-16 flex flex-col items-center justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
            <Receipt className="size-6" />
          </div>
          <h3 className="font-semibold text-lg text-foreground">
            No Transactions Recorded
          </h3>
          <p className="text-sm text-muted-foreground mt-1 mb-6 max-w-sm text-center">
            Admit students, allocate billing fees, and record payments to start
            managing finances.
          </p>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="cursor-pointer"
          >
            <Plus className="size-4 mr-2" />
            Record First Payment
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          <Card className="border-border bg-card">
            <CardContent className="p-0">
              <div className="relative w-full overflow-auto">
                <table className="w-full border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b border-border font-medium text-muted-foreground bg-muted/30">
                      <th className="p-4">Receipt No.</th>
                      <th className="p-4">Student</th>
                      <th className="p-4">Fee Category</th>
                      <th className="p-4">Period</th>
                      <th className="p-4">Amount</th>
                      <th className="p-4">Method</th>
                      <th className="p-4 text-right pr-6">Receipt</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((p) => (
                      <tr
                        key={p.id}
                        className="border-b border-border/50 hover:bg-muted/30 transition-all"
                      >
                        <td className="p-4 font-mono font-semibold text-foreground">
                          {p.receipt_number}
                        </td>
                        <td className="p-4 font-semibold text-foreground">
                          {p.student.user.name}
                        </td>
                        <td className="p-4 text-muted-foreground">
                          {p.fee_allocation.fee_category.name}
                        </td>
                        <td className="p-4 text-muted-foreground">
                          {p.period_identifier}
                        </td>
                        <td className="p-4 font-bold text-emerald-600 dark:text-emerald-500">
                          ${Number(p.amount_paid).toFixed(2)}
                        </td>
                        <td className="p-4 text-xs font-semibold capitalize text-foreground">
                          {p.method}
                        </td>
                        <td className="p-4 text-right pr-6">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownloadReceipt(p.id)}
                            className="text-xs cursor-pointer border-primary/20 hover:bg-primary/10 hover:text-primary size-8 p-0"
                            title="Download PDF Receipt"
                          >
                            <Download className="size-3.5" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="cursor-pointer"
              >
                Previous
              </Button>
              <span className="text-sm font-medium text-muted-foreground px-2">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="cursor-pointer"
              >
                Next
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Collect Payment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <Card className="w-full max-w-md bg-card border-border my-8 animate-in fade-in zoom-in-95 duration-200">
            <CardHeader className="relative text-left pb-4 border-b border-border">
              <CardTitle className="text-xl">Collect Fee Payment</CardTitle>
              <CardDescription>
                Record a new transaction for student billing.
              </CardDescription>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-muted-foreground hover:bg-muted cursor-pointer"
              >
                <X className="size-4" />
              </Button>
            </CardHeader>

            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4 pt-6 text-left">
                {submitError && (
                  <div className="mb-4 flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive border border-destructive/20 animate-fade-in">
                    <AlertCircle className="size-4 shrink-0 text-destructive" />
                    <span className="text-xs font-semibold">{submitError}</span>
                  </div>
                )}

                <div className="space-y-2">
                  <label
                    htmlFor="studentSelect"
                    className="text-sm font-semibold text-foreground"
                  >
                    Select Student *
                  </label>
                  <select
                    id="studentSelect"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    required
                  >
                    <option value="">Choose Student...</option>
                    {students.map((s: any) => (
                      <option key={s.id} value={s.id}>
                        {s.user.name} (Roll: #{s.rollNumber})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="allocSelect"
                    className="text-sm font-semibold text-foreground"
                  >
                    Fee Allocation *
                  </label>
                  <select
                    id="allocSelect"
                    value={allocationId}
                    onChange={(e) => handleSelectAllocation(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    required
                  >
                    <option value="">Choose Allocation...</option>
                    {allocations.map((a: any) => {
                      const label = a.schoolClass
                        ? `Class: ${a.schoolClass.name} - ${a.fee_category.name}`
                        : a.student
                          ? `Student: ${a.student.name} - ${a.fee_category.name}`
                          : a.fee_category.name;
                      return (
                        <option key={a.id} value={a.id}>
                          {label} (${Number(a.fee_category.amount).toFixed(2)})
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label
                      htmlFor="amount"
                      className="text-sm font-semibold text-foreground"
                    >
                      Amount Paid ($) *
                    </label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      placeholder="e.g. 150.00"
                      value={amountPaid}
                      onChange={(e) => setAmountPaid(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="methodSelect"
                      className="text-sm font-semibold text-foreground"
                    >
                      Payment Mode *
                    </label>
                    <select
                      id="methodSelect"
                      value={method}
                      onChange={(e) => setMethod(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      required
                    >
                      <option value="cash">Cash</option>
                      <option value="card">Credit Card</option>
                      <option value="bank_transfer">Bank Transfer</option>
                      <option value="cheque">Cheque</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="periodInput"
                    className="text-sm font-semibold text-foreground"
                  >
                    Billing Cycle Period *
                  </label>
                  <Input
                    id="periodInput"
                    placeholder="e.g. June 2026, Term 1 2026"
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                    required
                  />
                </div>
              </CardContent>

              <div className="flex justify-end gap-3 p-6 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={collectPaymentMutation.isPending}
                >
                  {collectPaymentMutation.isPending
                    ? "Recording..."
                    : "Record Payment"}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
