import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from '@/lib/api';
import { useAuth } from "@/contexts/AuthContext";
import {
  Plus,
  X,
  Check,
  AlertCircle,
  Loader2,
  Clock,
  FileText,
  CheckCircle,
  XCircle,
} from "lucide-react";
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

interface LeaveRequest {
  id: string;
  type: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: string;
  user: {
    name: string;
    email: string;
  };
  approvedBy: {
    name: string;
  } | null;
  createdAt: string;
}

interface LeavesResponse {
  leaves: LeaveRequest[];
  isManager: boolean;
}

export default function LeavesPage() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"myLeaves" | "review">("myLeaves");

  // Form States
  const [leaveType, setLeaveType] = useState("sick");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const { data, isLoading, error } = useQuery<LeavesResponse>({
    queryKey: ["leaves"],
    queryFn: () => api.get("/api/leaves").then(res => res.data),
  });

  const applyLeaveMutation = useMutation({
    mutationFn: (payload: {
      type: string;
      startDate: string;
      endDate: string;
      reason: string;
    }) =>
      api.post("/api/leaves", JSON.stringify(payload),).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leaves"] });
      setIsModalOpen(false);
      setLeaveType("sick");
      setStartDate("");
      setEndDate("");
      setReason("");
      setSubmitError("");
      setSuccessMessage("Leave application submitted successfully.");
      setTimeout(() => setSuccessMessage(""), 5000);
    },
    onError: (err: any) => {
      setSubmitError(err.message || "Failed to submit leave request.");
    },
  });

  const reviewLeaveMutation = useMutation({
    mutationFn: (payload: {
      leaveId: string;
      status: "approved" | "rejected";
    }) =>
      api.post("/api/leaves/approve", JSON.stringify(payload),).then(res => res.data),
    onSuccess: (resData: any) => {
      queryClient.invalidateQueries({ queryKey: ["leaves"] });
      setSuccessMessage(resData.message || "Leave request status updated.");
      setTimeout(() => setSuccessMessage(""), 5000);
    },
    onError: (err: any) => {
      setSuccessMessage("");
      alert(err.message || "Failed to update leave request.");
    },
  });

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leaveType || !startDate || !endDate || !reason.trim()) {
      setSubmitError("All fields are required.");
      return;
    }
    applyLeaveMutation.mutate({ type: leaveType, startDate, endDate, reason });
  };

  const handleReview = (leaveId: string, status: "approved" | "rejected") => {
    reviewLeaveMutation.mutate({ leaveId, status });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-[200px]" />
          <Skeleton className="h-10 w-[120px]" />
        </div>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, idx) => (
            <Skeleton key={idx} className="h-[120px] w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-6 text-destructive">
        <h2 className="text-lg font-bold">Error loading leaves registry</h2>
        <p className="text-sm mt-1">
          {error instanceof Error ? error.message : "Something went wrong."}
        </p>
      </div>
    );
  }

  const leaves = data?.leaves || [];
  const isManager = data?.isManager || false;

  // Split leaves logs if manager
  const myLeaves = isManager
    ? leaves.filter((l) => l.user.email === user?.email)
    : leaves;
  const pendingReviews = isManager
    ? leaves.filter(
        (l) => l.status === "pending" && l.user.email !== user?.email,
      )
    : [];
  const processedReviews = isManager
    ? leaves.filter(
        (l) => l.status !== "pending" && l.user.email !== user?.email,
      )
    : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="text-left">
          <h1 className="text-3xl font-bold tracking-tight">
            Leaves Management
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Submit leave applications, track balances, and approve time-off
            requests.
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="cursor-pointer">
          <Plus className="size-4 mr-2" />
          Request Leave
        </Button>
      </div>

      {successMessage && (
        <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 p-3 text-sm text-emerald-600 dark:text-emerald-500 border border-emerald-500/20 text-left animate-fade-in">
          <Check className="size-4 shrink-0 text-emerald-500" />
          <span className="text-sm font-semibold">{successMessage}</span>
        </div>
      )}

      {/* Tabs */}
      {isManager && (
        <div className="flex border-b border-border gap-4">
          <button
            onClick={() => setActiveTab("myLeaves")}
            className={`pb-3 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === "myLeaves"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            My Leave History ({myLeaves.length})
          </button>
          <button
            onClick={() => setActiveTab("review")}
            className={`pb-3 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === "review"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Review Pending Requests ({pendingReviews.length})
          </button>
        </div>
      )}

      {/* Leave Application Log */}
      {(activeTab === "myLeaves" && myLeaves.length === 0) ||
      (activeTab === "review" && pendingReviews.length === 0) ? (
        <Card className="border-dashed border-2 py-16 flex flex-col items-center justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
            <Clock className="size-6" />
          </div>
          <h3 className="font-semibold text-lg text-foreground">
            No Requests Found
          </h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm text-center">
            {activeTab === "myLeaves"
              ? "You haven't submitted any leave applications yet."
              : "There are no pending staff leave requests awaiting your approval."}
          </p>
        </Card>
      ) : activeTab === "myLeaves" ? (
        <div className="space-y-4">
          {myLeaves.map((leave) => {
            const statusColor =
              leave.status === "approved"
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-500 border-emerald-500/20"
                : leave.status === "rejected"
                  ? "bg-destructive/10 text-destructive border-destructive/20"
                  : "bg-amber-500/10 text-amber-600 dark:text-amber-500 border-amber-500/20";

            return (
              <Card key={leave.id} className="border-border bg-card text-left">
                <CardContent className="p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5">
                      <span className="font-semibold text-sm capitalize text-foreground">
                        {leave.type} Leave
                      </span>
                      <span
                        className={`inline-flex items-center rounded-full border px-2 py-0.2 text-[10px] font-semibold capitalize ${statusColor}`}
                      >
                        {leave.status}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Period: {new Date(leave.startDate).toLocaleDateString()}{" "}
                      to {new Date(leave.endDate).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-foreground/80 mt-2 font-normal flex items-start gap-1">
                      <FileText className="size-3.5 mt-0.5 text-muted-foreground shrink-0" />
                      <span>{leave.reason}</span>
                    </p>
                  </div>

                  {leave.status !== "pending" && leave.approvedBy && (
                    <div className="text-xs text-muted-foreground md:text-right border-t md:border-t-0 pt-2 md:pt-0 w-full md:w-auto">
                      Reviewed by:{" "}
                      <span className="font-semibold">
                        {leave.approvedBy.name}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="space-y-6">
          {/* Pending Reviews */}
          <div className="space-y-3">
            {pendingReviews.map((leave) => (
              <Card key={leave.id} className="border-border bg-card text-left">
                <CardContent className="p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-foreground">
                        {leave.user.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        ({leave.user.email})
                      </span>
                    </div>
                    <p className="text-xs font-semibold capitalize text-primary mt-1">
                      Type: {leave.type} Leave | Period:{" "}
                      {new Date(leave.startDate).toLocaleDateString()} -{" "}
                      {new Date(leave.endDate).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-foreground/90 mt-2 flex items-start gap-1">
                      <FileText className="size-3.5 mt-0.5 text-muted-foreground shrink-0" />
                      <span>{leave.reason}</span>
                    </p>
                  </div>

                  <div className="flex gap-2 w-full md:w-auto justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleReview(leave.id, "approved")}
                      className="text-xs cursor-pointer border-emerald-500/20 text-emerald-600 dark:text-emerald-500 hover:bg-emerald-500/10"
                    >
                      <CheckCircle className="size-3.5 mr-1" />
                      Approve
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleReview(leave.id, "rejected")}
                      className="text-xs cursor-pointer border-destructive/20 text-destructive hover:bg-destructive/10"
                    >
                      <XCircle className="size-3.5 mr-1" />
                      Reject
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Processed History for reference */}
          {processedReviews.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-border/80">
              <h3 className="text-sm font-bold text-muted-foreground text-left">
                Review History
              </h3>
              {processedReviews.map((leave) => {
                const statusColor =
                  leave.status === "approved"
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-500 border-emerald-500/20"
                    : "bg-destructive/10 text-destructive border-destructive/20";

                return (
                  <Card
                    key={leave.id}
                    className="border-border bg-card/60 text-left opacity-80"
                  >
                    <CardContent className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-foreground">
                            {leave.user.name}
                          </span>
                          <span
                            className={`inline-flex items-center rounded-full border px-2 py-0.2 text-[9px] font-bold capitalize ${statusColor}`}
                          >
                            {leave.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          Type: {leave.type} | Duration:{" "}
                          {new Date(leave.startDate).toLocaleDateString()} to{" "}
                          {new Date(leave.endDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-xs text-muted-foreground italic">
                        Reviewed by: {leave.approvedBy?.name || "System"}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Apply Leave Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <Card className="w-full max-w-md bg-card border-border my-8 animate-in fade-in zoom-in-95 duration-200">
            <CardHeader className="relative text-left pb-4 border-b border-border">
              <CardTitle className="text-xl">Apply for Leave</CardTitle>
              <CardDescription>
                File a new time-off application for administrative approval.
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

            <form onSubmit={handleApply}>
              <CardContent className="space-y-4 pt-6 text-left">
                {submitError && (
                  <div className="mb-4 flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive border border-destructive/20 animate-fade-in">
                    <AlertCircle className="size-4 shrink-0 text-destructive" />
                    <span className="text-xs font-semibold">{submitError}</span>
                  </div>
                )}

                <div className="space-y-2">
                  <label
                    htmlFor="leaveType"
                    className="text-sm font-semibold text-foreground"
                  >
                    Leave Category *
                  </label>
                  <select
                    id="leaveType"
                    value={leaveType}
                    onChange={(e) => setLeaveType(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    required
                  >
                    <option value="sick">Sick Leave</option>
                    <option value="casual">Casual Leave</option>
                    <option value="annual">Annual Leave</option>
                    <option value="unpaid">Unpaid Leave</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label
                      htmlFor="startDate"
                      className="text-sm font-semibold text-foreground"
                    >
                      Start Date *
                    </label>
                    <Input
                      id="startDate"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="endDate"
                      className="text-sm font-semibold text-foreground"
                    >
                      End Date *
                    </label>
                    <Input
                      id="endDate"
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="reason"
                    className="text-sm font-semibold text-foreground"
                  >
                    Reason for Leave *
                  </label>
                  <textarea
                    id="reason"
                    rows={4}
                    placeholder="Provide a brief explanation of why you are requesting this leave..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none"
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
                <Button type="submit" disabled={applyLeaveMutation.isPending}>
                  {applyLeaveMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Apply"
                  )}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
