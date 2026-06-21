import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { BookOpen, Plus, Trash2, Loader2, X, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

interface Subject {
  id: string;
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

interface SubjectsData {
  subjects: Subject[];
  classes: Array<{ id: string; name: string; section: string }>;
  teachers: Array<{ id: string; name: string }>;
}

export default function SubjectsPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [classId, setClassId] = useState("");
  const [teacherId, setTeacherId] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [deleteError, setDeleteError] = useState("");

  const { data, isLoading, error } = useQuery<SubjectsData>({
    queryKey: ["subjectsData"],
    queryFn: () => apiFetch("/api/subjects"),
  });

  const createSubjectMutation = useMutation({
    mutationFn: (newSubject: { name: string; code: string; class_id: string; teacher_id: string }) =>
      apiFetch("/api/subjects", {
        method: "POST",
        body: JSON.stringify(newSubject),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subjectsData"] });
      setIsModalOpen(false);
      setName("");
      setCode("");
      setClassId("");
      setTeacherId("");
      setSubmitError("");
    },
    onError: (err: any) => {
      setSubmitError(err.message || "Failed to create subject.");
    },
  });

  const deleteSubjectMutation = useMutation({
    mutationFn: (subjectId: string) =>
      apiFetch(`/api/subjects/${subjectId}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subjectsData"] });
      setDeleteError("");
    },
    onError: (err: any) => {
      setDeleteError(err.message || "Failed to delete subject.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !code.trim() || !classId || !teacherId) {
      setSubmitError("All fields are required.");
      return;
    }
    createSubjectMutation.mutate({
      name,
      code,
      class_id: classId,
      teacher_id: teacherId,
    });
  };

  if (isLoading) {
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
              {Array.from({ length: 5 }).map((_, idx) => (
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
        <h2 className="text-lg font-bold">Error loading Subjects</h2>
        <p className="text-sm mt-1">{error instanceof Error ? error.message : "Something went wrong."}</p>
      </div>
    );
  }

  const subjects = data?.subjects || [];
  const classes = data?.classes || [];
  const teachers = data?.teachers || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-left">Subjects</h1>
          <p className="text-muted-foreground text-left text-sm mt-1">
            Configure course subjects, code identifiers, assigned classes, and instructors.
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="cursor-pointer">
          <Plus className="size-4 mr-2" />
          Add Subject
        </Button>
      </div>

      {deleteError && (
        <div className="mb-4 flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive border border-destructive/20 animate-fade-in">
          <AlertCircle className="size-4 shrink-0 text-destructive" />
          <span className="text-sm font-semibold">{deleteError}</span>
        </div>
      )}

      {subjects.length === 0 ? (
        <Card className="border-dashed border-2 py-16 flex flex-col items-center justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
            <BookOpen className="size-6" />
          </div>
          <h3 className="font-semibold text-lg text-foreground">No Subjects Mapped</h3>
          <p className="text-sm text-muted-foreground mt-1 mb-6 max-w-sm text-center">
            Map academic subjects to your classes and assign teachers to start instructing.
          </p>
          <Button onClick={() => setIsModalOpen(true)} className="cursor-pointer">
            <Plus className="size-4 mr-2" />
            Add First Subject
          </Button>
        </Card>
      ) : (
        <Card className="border-border bg-card">
          <CardContent className="p-0">
            <div className="relative w-full overflow-auto">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-border font-medium text-muted-foreground bg-muted/30">
                    <th className="p-4">Subject Name</th>
                    <th className="p-4">Subject Code</th>
                    <th className="p-4">Class / Section</th>
                    <th className="p-4">Assigned Teacher</th>
                    <th className="p-4 text-right pr-6">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {subjects.map((sub) => (
                    <tr key={sub.id} className="border-b border-border/50 hover:bg-muted/30 transition-all">
                      <td className="p-4 font-semibold text-foreground">{sub.name}</td>
                      <td className="p-4 text-muted-foreground">
                        <span className="font-mono bg-muted/60 px-2 py-1 rounded text-xs">{sub.code}</span>
                      </td>
                      <td className="p-4 text-foreground">
                        {sub.school_class
                          ? `${sub.school_class.name} (${sub.school_class.section})`
                          : "Unassigned"}
                      </td>
                      <td className="p-4 text-muted-foreground">{sub.teacher?.name || "Unassigned"}</td>
                      <td className="p-4 text-right pr-6">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteSubjectMutation.mutate(sub.id)}
                          disabled={deleteSubjectMutation.isPending && deleteSubjectMutation.variables === sub.id}
                          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer size-8"
                        >
                          {deleteSubjectMutation.isPending && deleteSubjectMutation.variables === sub.id ? (
                            <Loader2 className="size-4 animate-spin" />
                          ) : (
                            <Trash2 className="size-4" />
                          )}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add Subject Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <Card className="w-full max-w-md bg-card border-border animate-in fade-in zoom-in-95 duration-200">
            <CardHeader className="relative text-left pb-4 border-b border-border">
              <CardTitle className="text-xl">Add New Subject</CardTitle>
              <CardDescription>Configure subject details, assigned class, and teacher.</CardDescription>
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
                  <label htmlFor="subName" className="text-sm font-semibold text-foreground">
                    Subject Name *
                  </label>
                  <Input
                    id="subName"
                    placeholder="e.g. Mathematics, English Literature"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="subCode" className="text-sm font-semibold text-foreground">
                    Subject Code *
                  </label>
                  <Input
                    id="subCode"
                    placeholder="e.g. MATH101, ENG-SEC-A"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="classSelect" className="text-sm font-semibold text-foreground">
                    Class / Grade *
                  </label>
                  <select
                    id="classSelect"
                    value={classId}
                    onChange={(e) => setClassId(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    required
                  >
                    <option value="">Select a Class...</option>
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} - {c.section}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="teacherSelect" className="text-sm font-semibold text-foreground">
                    Assigned Teacher *
                  </label>
                  <select
                    id="teacherSelect"
                    value={teacherId}
                    onChange={(e) => setTeacherId(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    required
                  >
                    <option value="">Select a Teacher...</option>
                    {teachers.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
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
                  disabled={createSubjectMutation.isPending}
                  className="cursor-pointer"
                >
                  {createSubjectMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    "Add Subject"
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
