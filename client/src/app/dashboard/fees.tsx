import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from '@/lib/api';
import {
  CreditCard,
  Plus,
  X,
  AlertCircle,
  Calendar,
  Users,
  School,
  Download,
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

interface FeeCategory {
  id: string;
  name: string;
  amount: number;
  periodicity: string;
  description: string | null;
}

interface FeeAllocation {
  id: string;
  fee_category: FeeCategory;
  schoolClass: { id: string; name: string; section: string } | null;
  student: { id: string; name: string } | null;
  start_date: string;
  end_date: string;
}

interface FeesResponse {
  categories: FeeCategory[];
  allocations: FeeAllocation[];
}

export default function FeesPage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<"categories" | "allocations">(
    "categories",
  );

  // Category Modal Form States
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [catName, setCatName] = useState("");
  const [catAmount, setCatAmount] = useState("");
  const [catPeriod, setCatPeriod] = useState("monthly");
  const [catDesc, setCatDesc] = useState("");
  const [catError, setCatError] = useState("");

  // Allocation Modal Form States
  const [isAllocModalOpen, setIsAllocModalOpen] = useState(false);
  const [allocCategoryId, setAllocCategoryId] = useState("");
  const [allocTargetType, setAllocTargetType] = useState<"class" | "student">(
    "class",
  );
  const [allocClassId, setAllocClassId] = useState("");
  const [allocStudentId, setAllocStudentId] = useState("");
  const [allocStartDate, setAllocStartDate] = useState("");
  const [allocEndDate, setAllocEndDate] = useState("");
  const [allocError, setAllocError] = useState("");

  // Fetch fees categories and allocations
  const {
    data: feesData,
    isLoading: isFeesLoading,
    error,
  } = useQuery<FeesResponse>({
    queryKey: ["fees"],
    queryFn: () => api.get("/api/fees").then(res => res.data),
  });

  // Fetch classes for allocation dropdown
  const { data: classes = [] } = useQuery<any[]>({
    queryKey: ["classes"],
    queryFn: () => api.get("/api/classes").then(res => res.data),
    enabled: isAllocModalOpen,
  });

  // Fetch students for allocation dropdown
  const { data: studentsResponse } = useQuery<any>({
    queryKey: ["studentsListForAllocation"],
    queryFn: () => api.get("/api/students?limit=100").then(res => res.data),
    enabled: isAllocModalOpen && allocTargetType === "student",
  });

  const createCategoryMutation = useMutation({
    mutationFn: (payload: {
      name: string;
      amount: number;
      periodicity: string;
      description?: string;
    }) =>
      api.post("/api/fees/category", JSON.stringify(payload),).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fees"] });
      setIsCatModalOpen(false);
      setCatName("");
      setCatAmount("");
      setCatPeriod("monthly");
      setCatDesc("");
      setCatError("");
    },
    onError: (err: any) => {
      setCatError(err.message || "Failed to create fee category.");
    },
  });

  const allocateFeeMutation = useMutation({
    mutationFn: (payload: any) =>
      api.post("/api/fees/allocate", JSON.stringify(payload),).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fees"] });
      setIsAllocModalOpen(false);
      setAllocCategoryId("");
      setAllocClassId("");
      setAllocStudentId("");
      setAllocStartDate("");
      setAllocEndDate("");
      setAllocError("");
    },
    onError: (err: any) => {
      setAllocError(err.message || "Failed to allocate fee.");
    },
  });

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim() || !catAmount) {
      setCatError("Category name and amount are required.");
      return;
    }
    createCategoryMutation.mutate({
      name: catName,
      amount: parseFloat(catAmount),
      periodicity: catPeriod,
      description: catDesc || undefined,
    });
  };

  const handleAllocateFee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!allocCategoryId || !allocStartDate || !allocEndDate) {
      setAllocError("Category and date constraints are required.");
      return;
    }
    if (allocTargetType === "class" && !allocClassId) {
      setAllocError("Please select a class for allocation.");
      return;
    }
    if (allocTargetType === "student" && !allocStudentId) {
      setAllocError("Please select a student for allocation.");
      return;
    }

    allocateFeeMutation.mutate({
      fee_category_id: allocCategoryId,
      class_id: allocTargetType === "class" ? allocClassId : undefined,
      student_id: allocTargetType === "student" ? allocStudentId : undefined,
      start_date: allocStartDate,
      end_date: allocEndDate,
    });
  };

  if (isFeesLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-[200px] mb-2" />
          <Skeleton className="h-4 w-[300px]" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-[120px]" />
          <Skeleton className="h-10 w-[120px]" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-[150px]" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, idx) => (
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
        <h2 className="text-lg font-bold">Error loading Fees Console</h2>
        <p className="text-sm mt-1">
          {error instanceof Error ? error.message : "Something went wrong."}
        </p>
      </div>
    );
  }

  const categories = feesData?.categories || [];
  const allocations = feesData?.allocations || [];
  const students = studentsResponse?.data || [];

  const handleExportLedger = (format: "csv" | "json") => {
    window.location.href = `/api/finance/export?format=${format}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-left">
            Fees Console
          </h1>
          <p className="text-muted-foreground text-left text-sm mt-1">
            Setup school fee structures and allocate billing groups to classes
            or students.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={() => handleExportLedger("csv")}
            className="cursor-pointer border-blue-500/20 text-blue-600 dark:text-blue-500 hover:bg-blue-500/10"
          >
            <Download className="size-4 mr-2" />
            Tally Export (CSV)
          </Button>
          <Button
            variant="outline"
            onClick={() => handleExportLedger("json")}
            className="cursor-pointer border-indigo-500/20 text-indigo-600 dark:text-indigo-500 hover:bg-indigo-500/10"
          >
            <Download className="size-4 mr-2" />
            Export JSON
          </Button>
          <Button
            variant="outline"
            onClick={() => setIsCatModalOpen(true)}
            className="cursor-pointer"
          >
            <Plus className="size-4 mr-2" />
            Add Category
          </Button>
          <Button
            onClick={() => setIsAllocModalOpen(true)}
            className="cursor-pointer"
          >
            <Calendar className="size-4 mr-2" />
            Allocate Fee
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border gap-4">
        <button
          onClick={() => setActiveTab("categories")}
          className={`pb-3 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === "categories"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Fee Categories ({categories.length})
        </button>
        <button
          onClick={() => setActiveTab("allocations")}
          className={`pb-3 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === "allocations"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Active Allocations ({allocations.length})
        </button>
      </div>

      {/* Categories View */}
      {activeTab === "categories" && (
        <Card className="border-border bg-card">
          <CardContent className="p-0">
            {categories.length === 0 ? (
              <div className="py-16 text-center text-muted-foreground flex flex-col items-center justify-center">
                <CreditCard className="size-8 stroke-[1.5] mb-2" />
                <p className="text-sm">No fee categories created yet.</p>
                <Button
                  variant="link"
                  onClick={() => setIsCatModalOpen(true)}
                  className="mt-2 text-primary"
                >
                  Create First Category
                </Button>
              </div>
            ) : (
              <div className="relative w-full overflow-auto">
                <table className="w-full border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b border-border font-medium text-muted-foreground bg-muted/30">
                      <th className="p-4">Name</th>
                      <th className="p-4">Billing Frequency</th>
                      <th className="p-4">Amount</th>
                      <th className="p-4">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((cat) => (
                      <tr
                        key={cat.id}
                        className="border-b border-border/50 hover:bg-muted/30 transition-all"
                      >
                        <td className="p-4 font-semibold text-foreground">
                          {cat.name}
                        </td>
                        <td className="p-4">
                          <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary capitalize">
                            {cat.periodicity}
                          </span>
                        </td>
                        <td className="p-4 font-semibold text-foreground">
                          ${Number(cat.amount).toFixed(2)}
                        </td>
                        <td className="p-4 text-muted-foreground">
                          {cat.description || "N/A"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Allocations View */}
      {activeTab === "allocations" && (
        <Card className="border-border bg-card">
          <CardContent className="p-0">
            {allocations.length === 0 ? (
              <div className="py-16 text-center text-muted-foreground flex flex-col items-center justify-center">
                <Calendar className="size-8 stroke-[1.5] mb-2" />
                <p className="text-sm">
                  No active fee allocations mapping found.
                </p>
                <Button
                  variant="link"
                  onClick={() => setIsAllocModalOpen(true)}
                  className="mt-2 text-primary"
                >
                  Allocate First Fee
                </Button>
              </div>
            ) : (
              <div className="relative w-full overflow-auto">
                <table className="w-full border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b border-border font-medium text-muted-foreground bg-muted/30">
                      <th className="p-4">Fee Category</th>
                      <th className="p-4">Target Audience</th>
                      <th className="p-4">Amount</th>
                      <th className="p-4">Frequency</th>
                      <th className="p-4">Billing Period</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allocations.map((alloc) => (
                      <tr
                        key={alloc.id}
                        className="border-b border-border/50 hover:bg-muted/30 transition-all"
                      >
                        <td className="p-4 font-semibold text-foreground">
                          {alloc.fee_category.name}
                        </td>
                        <td className="p-4">
                          {alloc.schoolClass ? (
                            <span className="inline-flex items-center gap-1 text-foreground">
                              <School className="size-3.5 text-purple-500" />
                              Class: {alloc.schoolClass.name} (
                              {alloc.schoolClass.section})
                            </span>
                          ) : alloc.student ? (
                            <span className="inline-flex items-center gap-1 text-foreground">
                              <Users className="size-3.5 text-blue-500" />
                              Student: {alloc.student.name}
                            </span>
                          ) : (
                            <span className="text-muted-foreground">
                              General
                            </span>
                          )}
                        </td>
                        <td className="p-4 font-semibold text-foreground">
                          ${Number(alloc.fee_category.amount).toFixed(2)}
                        </td>
                        <td className="p-4 capitalize text-muted-foreground">
                          {alloc.fee_category.periodicity}
                        </td>
                        <td className="p-4 text-muted-foreground">
                          {new Date(alloc.start_date).toLocaleDateString(
                            undefined,
                            { month: "short", year: "numeric" },
                          )}
                          {" - "}
                          {new Date(alloc.end_date).toLocaleDateString(
                            undefined,
                            { month: "short", year: "numeric" },
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Add Category Modal */}
      {isCatModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <Card className="w-full max-w-md bg-card border-border animate-in fade-in zoom-in-95 duration-200">
            <CardHeader className="relative text-left pb-4 border-b border-border">
              <CardTitle className="text-xl">Create Fee Category</CardTitle>
              <CardDescription>
                Setup a reusable billing category and pricing structure.
              </CardDescription>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsCatModalOpen(false)}
                className="absolute top-4 right-4 text-muted-foreground hover:bg-muted cursor-pointer"
              >
                <X className="size-4" />
              </Button>
            </CardHeader>

            <form onSubmit={handleCreateCategory}>
              <CardContent className="space-y-4 pt-6 text-left">
                {catError && (
                  <div className="mb-4 flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive border border-destructive/20 animate-fade-in">
                    <AlertCircle className="size-4 shrink-0 text-destructive" />
                    <span className="text-xs font-semibold">{catError}</span>
                  </div>
                )}

                <div className="space-y-2">
                  <label
                    htmlFor="catName"
                    className="text-sm font-semibold text-foreground"
                  >
                    Category Name *
                  </label>
                  <Input
                    id="catName"
                    placeholder="e.g. Tuition Fee, Exam Fee, Laboratory Fee"
                    value={catName}
                    onChange={(e) => setCatName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="catAmount"
                    className="text-sm font-semibold text-foreground"
                  >
                    Charge Amount ($) *
                  </label>
                  <Input
                    id="catAmount"
                    type="number"
                    step="0.01"
                    placeholder="e.g. 150.00"
                    value={catAmount}
                    onChange={(e) => setCatAmount(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="catPeriod"
                    className="text-sm font-semibold text-foreground"
                  >
                    Billing Periodicity *
                  </label>
                  <select
                    id="catPeriod"
                    value={catPeriod}
                    onChange={(e) => setCatPeriod(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                    required
                  >
                    <option value="monthly">Monthly</option>
                    <option value="term">Per Term</option>
                    <option value="annual">Annual</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="catDesc"
                    className="text-sm font-semibold text-foreground"
                  >
                    Short Description
                  </label>
                  <Input
                    id="catDesc"
                    placeholder="e.g. Mandatory monthly core class instruction charges"
                    value={catDesc}
                    onChange={(e) => setCatDesc(e.target.value)}
                  />
                </div>
              </CardContent>

              <div className="flex justify-end gap-3 p-6 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCatModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createCategoryMutation.isPending}
                >
                  {createCategoryMutation.isPending
                    ? "Creating..."
                    : "Create Category"}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Allocate Fee Modal */}
      {isAllocModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <Card className="w-full max-w-md bg-card border-border my-8 animate-in fade-in zoom-in-95 duration-200">
            <CardHeader className="relative text-left pb-4 border-b border-border">
              <CardTitle className="text-xl">Allocate School Fee</CardTitle>
              <CardDescription>
                Bind a fee structure to specific academic groups.
              </CardDescription>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsAllocModalOpen(false)}
                className="absolute top-4 right-4 text-muted-foreground hover:bg-muted cursor-pointer"
              >
                <X className="size-4" />
              </Button>
            </CardHeader>

            <form onSubmit={handleAllocateFee}>
              <CardContent className="space-y-4 pt-6 text-left">
                {allocError && (
                  <div className="mb-4 flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive border border-destructive/20 animate-fade-in">
                    <AlertCircle className="size-4 shrink-0 text-destructive" />
                    <span className="text-xs font-semibold">{allocError}</span>
                  </div>
                )}

                <div className="space-y-2">
                  <label
                    htmlFor="allocCategory"
                    className="text-sm font-semibold text-foreground"
                  >
                    Fee Category *
                  </label>
                  <select
                    id="allocCategory"
                    value={allocCategoryId}
                    onChange={(e) => setAllocCategoryId(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    required
                  >
                    <option value="">Choose Category...</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} (${Number(c.amount).toFixed(2)} -{" "}
                        {c.periodicity})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">
                    Allocation Target *
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center text-sm font-medium cursor-pointer">
                      <input
                        type="radio"
                        checked={allocTargetType === "class"}
                        onChange={() => {
                          setAllocTargetType("class");
                          setAllocStudentId("");
                        }}
                        className="mr-2 h-4 w-4"
                      />
                      Entire Classroom
                    </label>
                    <label className="flex items-center text-sm font-medium cursor-pointer">
                      <input
                        type="radio"
                        checked={allocTargetType === "student"}
                        onChange={() => {
                          setAllocTargetType("student");
                          setAllocClassId("");
                        }}
                        className="mr-2 h-4 w-4"
                      />
                      Individual Student
                    </label>
                  </div>
                </div>

                {allocTargetType === "class" ? (
                  <div className="space-y-2">
                    <label
                      htmlFor="allocClass"
                      className="text-sm font-semibold text-foreground"
                    >
                      Target ClassRoom *
                    </label>
                    <select
                      id="allocClass"
                      value={allocClassId}
                      onChange={(e) => setAllocClassId(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      required
                    >
                      <option value="">Select Class...</option>
                      {classes.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} - {c.section}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <label
                      htmlFor="allocStudent"
                      className="text-sm font-semibold text-foreground"
                    >
                      Target Student *
                    </label>
                    <select
                      id="allocStudent"
                      value={allocStudentId}
                      onChange={(e) => setAllocStudentId(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      required
                    >
                      <option value="">Select Student...</option>
                      {students.map((s: any) => (
                        <option key={s.id} value={s.id}>
                          {s.user.name} (Roll: #{s.rollNumber})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

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
                      value={allocStartDate}
                      onChange={(e) => setAllocStartDate(e.target.value)}
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
                      value={allocEndDate}
                      onChange={(e) => setAllocEndDate(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </CardContent>

              <div className="flex justify-end gap-3 p-6 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAllocModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={allocateFeeMutation.isPending}>
                  {allocateFeeMutation.isPending
                    ? "Allocating..."
                    : "Allocate Fee"}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
