import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { Calendar, Plus, X, Trash2, AlertCircle, Check, Loader2, MapPin, User, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

interface ClassItem {
  id: string;
  name: string;
  section: string;
}

interface SubjectItem {
  id: string;
  name: string;
  code: string;
  classId: string;
}

interface MemberItem {
  id: string;
  name: string;
  role: string;
}

interface TimetableEntry {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  room: string | null;
  schoolClass: {
    name: string;
    section: string;
  };
  subject: {
    name: string;
    code: string;
  };
  teacher: {
    name: string;
  } | null;
}

interface TimetableResponse {
  entries: TimetableEntry[];
}

const DAYS_OF_WEEK = [
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" },
];

export default function TimetablePage() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [selectedClassId, setSelectedClassId] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form States
  const [classId, setClassId] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [teacherId, setTeacherId] = useState("");
  const [dayOfWeek, setDayOfWeek] = useState("1");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [room, setRoom] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const userRole = user?.role || "member";
  const isManager = ["owner", "admin", "principal"].includes(userRole);

  // Load Classes
  const { data: classesData = [], isLoading: isClassesLoading } = useQuery<ClassItem[]>({
    queryKey: ["classes"],
    queryFn: () => apiFetch("/api/classes"),
  });

  // Load Subjects
  const { data: subjectsData = [] } = useQuery<SubjectItem[]>({
    queryKey: ["subjects"],
    queryFn: () => apiFetch("/api/subjects"),
  });

  // Load Staff
  const { data: membersRes } = useQuery<{ members: MemberItem[] }>({
    queryKey: ["members"],
    queryFn: () => apiFetch("/api/members"),
    enabled: isModalOpen,
  });

  // Load Timetable Entries
  const { data: timetableRes, isLoading: isTimetableLoading } = useQuery<TimetableResponse>({
    queryKey: ["timetable", selectedClassId],
    queryFn: () => apiFetch(`/api/timetable?class_id=${selectedClassId}`),
  });

  const createTimetableMutation = useMutation({
    mutationFn: (payload: any) =>
      apiFetch("/api/timetable", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["timetable", selectedClassId] });
      setIsModalOpen(false);
      setClassId("");
      setSubjectId("");
      setTeacherId("");
      setDayOfWeek("1");
      setStartTime("");
      setEndTime("");
      setRoom("");
      setSubmitError("");
      setSuccessMessage("Timetable entry added successfully.");
      setTimeout(() => setSuccessMessage(""), 5000);
    },
    onError: (err: any) => {
      setSubmitError(err.message || "Failed to add timetable entry.");
    },
  });

  const deleteTimetableMutation = useMutation({
    mutationFn: (id: string) =>
      apiFetch(`/api/timetable/${id}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["timetable", selectedClassId] });
      setSuccessMessage("Timetable entry deleted successfully.");
      setTimeout(() => setSuccessMessage(""), 5000);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!classId || !subjectId || !dayOfWeek || !startTime || !endTime) {
      setSubmitError("Please fill out all required fields.");
      return;
    }
    createTimetableMutation.mutate({
      classId,
      subjectId,
      teacherId: teacherId || undefined,
      dayOfWeek: parseInt(dayOfWeek, 10),
      startTime,
      endTime,
      room: room || undefined,
    });
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this timetable entry?")) {
      deleteTimetableMutation.mutate(id);
    }
  };

  const teachers = membersRes?.members || [];
  const entries = timetableRes?.entries || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="text-left">
          <h1 className="text-3xl font-bold tracking-tight">Class Timetable</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Configure weekly lecture timings, map subject rooms, and schedule faculty periods.
          </p>
        </div>
        {isManager && (
          <Button onClick={() => setIsModalOpen(true)} className="cursor-pointer">
            <Plus className="size-4 mr-2" />
            Add Entry
          </Button>
        )}
      </div>

      {successMessage && (
        <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 p-3 text-sm text-emerald-600 dark:text-emerald-500 border border-emerald-500/20 text-left animate-fade-in">
          <Check className="size-4 shrink-0 text-emerald-500" />
          <span className="text-sm font-semibold">{successMessage}</span>
        </div>
      )}

      {/* Filter Control */}
      <Card className="border-border bg-card">
        <CardContent className="p-6">
          <div className="max-w-xs text-left space-y-2">
            <label htmlFor="filterClass" className="text-sm font-semibold text-foreground">
              Select Class to View Timetable
            </label>
            {isClassesLoading ? (
              <Skeleton className="h-10 w-full" />
            ) : (
              <select
                id="filterClass"
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              >
                <option value="">All Timetable Classes</option>
                {classesData.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} - {c.section}
                  </option>
                ))}
              </select>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Timetable Weekly Planner View */}
      {isTimetableLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, idx) => (
            <Skeleton key={idx} className="h-12 w-full" />
          ))}
        </div>
      ) : entries.length === 0 ? (
        <Card className="border-dashed border-2 py-16 flex flex-col items-center justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
            <Calendar className="size-6" />
          </div>
          <h3 className="font-semibold text-lg text-foreground">Timetable Planner Empty</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm text-center">
            No schedule entries mapped yet. Choose a class or add a timetable entry to start.
          </p>
        </Card>
      ) : (
        <div className="grid gap-6">
          {DAYS_OF_WEEK.map((day) => {
            const dayEntries = entries.filter((e) => e.dayOfWeek === day.value);
            if (dayEntries.length === 0 && selectedClassId) return null; // hide empty days when filtering by specific class

            return (
              <Card key={day.value} className="border-border bg-card">
                <CardHeader className="py-4 border-b border-border/40 text-left bg-muted/20">
                  <CardTitle className="text-base font-bold text-primary">{day.label}</CardTitle>
                </CardHeader>
                <CardContent className="p-0 text-left">
                  {dayEntries.length === 0 ? (
                    <div className="p-4 text-xs text-muted-foreground italic text-center">
                      No sessions scheduled.
                    </div>
                  ) : (
                    <div className="divide-y divide-border/60">
                      {dayEntries.map((entry) => (
                        <div
                          key={entry.id}
                          className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 gap-4 hover:bg-muted/10 transition-colors"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm text-foreground">
                                {entry.startTime} - {entry.endTime}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                (Class: {entry.schoolClass.name} - {entry.schoolClass.section})
                              </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <BookOpen className="size-3 text-purple-500" />
                                {entry.subject.name} ({entry.subject.code})
                              </span>
                              <span className="flex items-center gap-1">
                                <User className="size-3 text-blue-500" />
                                {entry.teacher?.name || "No teacher assigned"}
                              </span>
                              {entry.room && (
                                <span className="flex items-center gap-1">
                                  <MapPin className="size-3 text-emerald-500" />
                                  Room: {entry.room}
                                </span>
                              )}
                            </div>
                          </div>

                          {isManager && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(entry.id)}
                              className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer size-8 align-self-end md:align-self-auto"
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Add Timetable Entry Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <Card className="w-full max-w-md bg-card border-border my-8 animate-in fade-in zoom-in-95 duration-200">
            <CardHeader className="relative text-left pb-4 border-b border-border">
              <CardTitle className="text-xl">Add Timetable Slot</CardTitle>
              <CardDescription>Assign subject hours and teachers to Classrooms.</CardDescription>
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
                  <label htmlFor="entryClass" className="text-sm font-semibold text-foreground">
                    Classroom *
                  </label>
                  <select
                    id="entryClass"
                    value={classId}
                    onChange={(e) => setClassId(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    required
                  >
                    <option value="">Select Classroom...</option>
                    {classesData.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} - {c.section}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="entrySubject" className="text-sm font-semibold text-foreground">
                    Subject *
                  </label>
                  <select
                    id="entrySubject"
                    value={subjectId}
                    onChange={(e) => setSubjectId(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    required
                  >
                    <option value="">Select Subject...</option>
                    {subjectsData
                      .filter((s) => !classId || s.classId === classId)
                      .map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} ({s.code})
                        </option>
                      ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="entryTeacher" className="text-sm font-semibold text-foreground">
                    Assigned Teacher (Optional)
                  </label>
                  <select
                    id="entryTeacher"
                    value={teacherId}
                    onChange={(e) => setTeacherId(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="">Select Teacher...</option>
                    {teachers
                      .filter((t) => t.role === "faculty" || t.role === "teacher")
                      .map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="entryDay" className="text-sm font-semibold text-foreground">
                      Day of Week *
                    </label>
                    <select
                      id="entryDay"
                      value={dayOfWeek}
                      onChange={(e) => setDayOfWeek(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      required
                    >
                      {DAYS_OF_WEEK.map((d) => (
                        <option key={d.value} value={d.value}>
                          {d.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="entryRoom" className="text-sm font-semibold text-foreground">
                      Room (Optional)
                    </label>
                    <Input
                      id="entryRoom"
                      placeholder="e.g. Lab B, R304"
                      value={room}
                      onChange={(e) => setRoom(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="entryStart" className="text-sm font-semibold text-foreground">
                      Start Time *
                    </label>
                    <Input
                      id="entryStart"
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="entryEnd" className="text-sm font-semibold text-foreground">
                      End Time *
                    </label>
                    <Input
                      id="entryEnd"
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </CardContent>

              <div className="flex justify-end gap-3 p-6 border-t border-border">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createTimetableMutation.isPending}>
                  {createTimetableMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Entry"
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
