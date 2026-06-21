import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from '@/lib/api';
import { Users, Plus, Loader2, X, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

interface Student {
  id: string;
  rollNumber: string;
  admissionDate: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  schoolClass: {
    id: string;
    name: string;
    section: string;
  };
}

interface StudentsPaginatedResponse {
  data: Student[];
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}

interface ClassOption {
  id: string;
  name: string;
  section: string;
}

export default function StudentsPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [classId, setClassId] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [admissionDate, setAdmissionDate] = useState("");
  const [submitError, setSubmitError] = useState("");

  const { data: response, isLoading: isStudentsLoading, error } = useQuery<StudentsPaginatedResponse>({
    queryKey: ["students", currentPage],
    queryFn: () => api.get(`/api/students?page=${currentPage}&limit=10`).then(res => res.data),
  });

  const { data: classes = [], isLoading: isClassesLoading } = useQuery<ClassOption[]>({
    queryKey: ["admissionClasses"],
    queryFn: () => api.get("/api/students/create").then(res => res.data),
    enabled: isModalOpen, // Only fetch options when the modal is opened
  });

  const admitStudentMutation = useMutation({
    mutationFn: (newStudent: any) =>
      api.post("/api/students", JSON.stringify(newStudent),).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      setIsModalOpen(false);
      setName("");
      setEmail("");
      setPassword("");
      setClassId("");
      setRollNumber("");
      setAdmissionDate("");
      setSubmitError("");
    },
    onError: (err: any) => {
      setSubmitError(err.message || "Failed to admit student.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim() || !classId || !rollNumber.trim() || !admissionDate) {
      setSubmitError("All fields are required.");
      return;
    }
    admitStudentMutation.mutate({
      name,
      email,
      password,
      class_id: classId,
      roll_number: rollNumber,
      admission_date: admissionDate,
    });
  };

  if (isStudentsLoading) {
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
        <h2 className="text-lg font-bold">Error loading Students</h2>
        <p className="text-sm mt-1">{error instanceof Error ? error.message : "Something went wrong."}</p>
      </div>
    );
  }

  const students = response?.data || [];
  const totalPages = response?.last_page || 1;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-left">Students</h1>
          <p className="text-muted-foreground text-left text-sm mt-1">
            Browse your school's student directory and perform new student admissions.
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="cursor-pointer">
          <Plus className="size-4 mr-2" />
          Admit Student
        </Button>
      </div>

      {students.length === 0 ? (
        <Card className="border-dashed border-2 py-16 flex flex-col items-center justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
            <Users className="size-6" />
          </div>
          <h3 className="font-semibold text-lg text-foreground">No Students Registered</h3>
          <p className="text-sm text-muted-foreground mt-1 mb-6 max-w-sm text-center">
            Admit your first student and map them to their respective class and section.
          </p>
          <Button onClick={() => setIsModalOpen(true)} className="cursor-pointer">
            <Plus className="size-4 mr-2" />
            Admit First Student
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
                      <th className="p-4">Roll No.</th>
                      <th className="p-4">Student Name</th>
                      <th className="p-4">Email</th>
                      <th className="p-4">Class & Section</th>
                      <th className="p-4">Admission Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student) => (
                      <tr key={student.id} className="border-b border-border/50 hover:bg-muted/30 transition-all">
                        <td className="p-4 font-mono font-bold text-foreground">#{student.rollNumber}</td>
                        <td className="p-4 font-semibold text-foreground">{student.user.name}</td>
                        <td className="p-4 text-muted-foreground">{student.user.email}</td>
                        <td className="p-4 text-foreground">
                          {student.schoolClass
                            ? `${student.schoolClass.name} (${student.schoolClass.section})`
                            : "Unassigned"}
                        </td>
                        <td className="p-4 text-muted-foreground">
                          {new Date(student.admissionDate).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
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
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="cursor-pointer"
              >
                Next
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Admission Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <Card className="w-full max-w-lg bg-card border-border my-8 animate-in fade-in zoom-in-95 duration-200">
            <CardHeader className="relative text-left pb-4 border-b border-border">
              <CardTitle className="text-xl">Admit New Student</CardTitle>
              <CardDescription>Setup their personal details, academic class, and credentials.</CardDescription>
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="studentName" className="text-sm font-semibold text-foreground">
                      Full Name *
                    </label>
                    <Input
                      id="studentName"
                      placeholder="e.g. Bart Simpson"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="studentEmail" className="text-sm font-semibold text-foreground">
                      Email Address *
                    </label>
                    <Input
                      id="studentEmail"
                      type="email"
                      placeholder="bart@simpson.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="studentPass" className="text-sm font-semibold text-foreground">
                      Account Password *
                    </label>
                    <Input
                      id="studentPass"
                      type="password"
                      placeholder="Min. 6 chars"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="rollNo" className="text-sm font-semibold text-foreground">
                      Roll Number *
                    </label>
                    <Input
                      id="rollNo"
                      placeholder="e.g. 24"
                      value={rollNumber}
                      onChange={(e) => setRollNumber(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="studentClass" className="text-sm font-semibold text-foreground">
                      Class Room *
                    </label>
                    {isClassesLoading ? (
                      <div className="flex items-center h-10 border border-input rounded-md px-3 bg-muted/30">
                        <Loader2 className="size-4 animate-spin text-muted-foreground mr-2" />
                        <span className="text-sm text-muted-foreground">Loading classes...</span>
                      </div>
                    ) : (
                      <select
                        id="studentClass"
                        value={classId}
                        onChange={(e) => setClassId(e.target.value)}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        required
                      >
                        <option value="">Select Class...</option>
                        {classes.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name} - {c.section}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="adminDate" className="text-sm font-semibold text-foreground">
                      Admission Date *
                    </label>
                    <Input
                      id="adminDate"
                      type="date"
                      value={admissionDate}
                      onChange={(e) => setAdmissionDate(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </CardContent>

              <div className="flex justify-end gap-3 p-6 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  className="cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={admitStudentMutation.isPending}
                  className="cursor-pointer"
                >
                  {admitStudentMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Admitting...
                    </>
                  ) : (
                    "Admit Student"
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
