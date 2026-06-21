import React, { useState } from "react";
import { useCurrentUser } from "@/hooks/queries/useAuth";
import { useClasses } from "@/hooks/queries/useClasses";
import { useSubjects } from "@/hooks/queries/useSubjects";
import {
  useExams,
  useExamResults,
  useScheduleExam,
  useSubmitGrades,
} from "@/hooks/queries/useExams";
import {
  Calendar,
  Plus,
  X,
  FileSpreadsheet,
  AlertCircle,
  Check,
  Loader2,
  BookOpen,
  Award,
  ChevronRight,
  Save,
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

export default function ExamsPage() {
  const { data: userData } = useCurrentUser();
  const user = userData?.user;
  const [activeTab, setActiveTab] = useState<"calendar" | "grading">(
    "calendar",
  );
  const [selectedClassFilter, setSelectedClassFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Scheduling Form States
  const [name, setName] = useState("");
  const [classId, setClassId] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [examDate, setExamDate] = useState("");
  const [maxMarks, setMaxMarks] = useState("100");
  const [submitError, setSubmitError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Grading Console State
  const [selectedExamId, setSelectedExamId] = useState("");
  const [marksState, setMarksState] = useState<
    Record<string, { marksObtained: string; remarks: string }>
  >({});

  const userRole = user?.role || "member";
  const canManage = ["owner", "admin", "principal", "hod", "faculty"].includes(
    userRole,
  );

  // Load Classes
  const { data: classes = [], isLoading: isClassesLoading } = useClasses();

  // Load Subjects
  const { data: subjects = [] } = useSubjects();

  // Load Exams
  const { data: examsRes, isLoading: isExamsLoading } =
    useExams(selectedClassFilter);

  // Load Roster for Grading
  const {
    data: rosterRes,
    isLoading: isRosterLoading,
    error: rosterError,
  } = useExamResults(activeTab === "grading" ? selectedExamId : "");

  // Automatically initialize inputs when roster loads
  // eslint-disable-next-line react-hooks/set-state-in-effect
  React.useEffect(() => {
    if (rosterRes?.roster) {
      const initialMarks: Record<
        string,
        { marksObtained: string; remarks: string }
      > = {};
      rosterRes.roster.forEach((r) => {
        initialMarks[r.studentId] = {
          marksObtained:
            r.marksObtained !== null ? r.marksObtained.toString() : "",
          remarks: r.remarks || "",
        };
      });
      setMarksState(initialMarks);
    }
  }, [rosterRes]);

  const scheduleExamMutation = useScheduleExam();
  const submitGradesMutation = useSubmitGrades(selectedExamId);

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !classId || !subjectId || !examDate || !maxMarks) {
      setSubmitError("Please fill in all fields.");
      return;
    }
    scheduleExamMutation.mutate(
      {
        name,
        classId,
        subjectId,
        examDate,
        maxMarks: parseInt(maxMarks, 10),
      },
      {
        onSuccess: () => {
          setIsModalOpen(false);
          setName("");
          setClassId("");
          setSubjectId("");
          setExamDate("");
          setMaxMarks("100");
          setSubmitError("");
          setSuccessMessage("Exam scheduled successfully.");
          setTimeout(() => setSuccessMessage(""), 5000);
        },
        onError: (err: any) => {
          setSubmitError(err.message || "Failed to schedule exam.");
        },
      },
    );
  };

  const handleMarkChange = (
    studentId: string,
    value: string,
    field: "marksObtained" | "remarks",
  ) => {
    setMarksState((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: value,
      },
    }));
  };

  const handleSaveGrades = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedExamId) return;

    const formattedMarks = Object.entries(marksState).map(
      ([studentId, data]) => ({
        studentId,
        marksObtained: parseFloat(data.marksObtained) || 0,
        remarks: data.remarks,
      }),
    );

    submitGradesMutation.mutate(
      {
        examId: selectedExamId,
        marks: formattedMarks,
      },
      {
        onSuccess: () => {
          setSuccessMessage(
            "Student grades and report roster updated successfully.",
          );
          setTimeout(() => setSuccessMessage(""), 5000);
        },
        onError: (err: any) => {
          setSubmitError(err.message || "Failed to submit marks roster.");
          setTimeout(() => setSubmitError(""), 5000);
        },
      },
    );
  };

  const calculateGradeLive = (scoreStr: string, max: number): string => {
    const score = parseFloat(scoreStr);
    if (isNaN(score) || score < 0) return "-";
    const pct = (score / max) * 100;
    if (pct >= 90) return "A";
    if (pct >= 80) return "B";
    if (pct >= 70) return "C";
    if (pct >= 60) return "D";
    return "F";
  };

  const exams = examsRes?.exams || [];
  const activeRoster = rosterRes?.roster || [];
  const gradingExam = rosterRes?.exam;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="text-left">
          <h1 className="text-3xl font-bold tracking-tight">Exams & Grading</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Schedule midterm / final examinations, manage hall allocations, and
            record student grade lists.
          </p>
        </div>
        {canManage && (
          <Button
            onClick={() => setIsModalOpen(true)}
            className="cursor-pointer"
          >
            <Plus className="size-4 mr-2" />
            Schedule Exam
          </Button>
        )}
      </div>

      {successMessage && (
        <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 p-3 text-sm text-emerald-600 dark:text-emerald-500 border border-emerald-500/20 text-left animate-fade-in">
          <Check className="size-4 shrink-0 text-emerald-500" />
          <span className="text-sm font-semibold">{successMessage}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-border gap-4">
        <button
          onClick={() => setActiveTab("calendar")}
          className={`pb-3 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === "calendar"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Exam Calendar ({exams.length})
        </button>
        <button
          onClick={() => {
            setActiveTab("grading");
            if (exams.length > 0 && !selectedExamId) {
              setSelectedExamId(exams[0].id);
            }
          }}
          className={`pb-3 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === "grading"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Marks Entry Console
        </button>
      </div>

      {/* Exam Calendar Tab */}
      {activeTab === "calendar" && (
        <div className="space-y-4">
          <Card className="border-border bg-card">
            <CardContent className="p-6">
              <div className="max-w-xs text-left space-y-2">
                <label
                  htmlFor="filterClass"
                  className="text-sm font-semibold text-foreground"
                >
                  Filter by Classroom
                </label>
                {isClassesLoading ? (
                  <Skeleton className="h-10 w-full" />
                ) : (
                  <select
                    id="filterClass"
                    value={selectedClassFilter}
                    onChange={(e) => setSelectedClassFilter(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="">All Classrooms</option>
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} - {c.section}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </CardContent>
          </Card>

          {isExamsLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          ) : exams.length === 0 ? (
            <Card className="border-dashed border-2 py-16 flex flex-col items-center justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                <Calendar className="size-6" />
              </div>
              <h3 className="font-semibold text-lg text-foreground">
                No Exams Scheduled
              </h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-sm text-center">
                Get started by scheduling an exam for class streams and adding
                subject marks.
              </p>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {exams.map((exam) => (
                <Card
                  key={exam.id}
                  className="border-border bg-card text-left hover:shadow-md transition-all"
                >
                  <CardHeader className="pb-2 border-b border-border/40">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-primary tracking-wider bg-primary/10 px-2 py-0.5 rounded">
                          Class {exam.schoolClass.name} -{" "}
                          {exam.schoolClass.section}
                        </span>
                        <CardTitle className="text-lg font-bold text-foreground mt-1.5">
                          {exam.name}
                        </CardTitle>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedExamId(exam.id);
                          setActiveTab("grading");
                        }}
                        className="cursor-pointer text-xs"
                      >
                        Grade <ChevronRight className="size-3 ml-1" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-3 space-y-2.5 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <BookOpen className="size-3.5 text-purple-500" />
                      <span>
                        Subject:{" "}
                        <strong className="text-foreground">
                          {exam.subject.name}
                        </strong>{" "}
                        ({exam.subject.code})
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="size-3.5 text-blue-500" />
                      <span>
                        Date:{" "}
                        <strong className="text-foreground">
                          {new Date(exam.examDate).toLocaleDateString(
                            undefined,
                            {
                              weekday: "short",
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            },
                          )}
                        </strong>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award className="size-3.5 text-emerald-500" />
                      <span>
                        Max Marks possible:{" "}
                        <strong className="text-foreground">
                          {exam.maxMarks}
                        </strong>
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Grading / Marks Entry Tab */}
      {activeTab === "grading" && (
        <div className="space-y-4 text-left">
          <Card className="border-border bg-card">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">
                Select Examination Marks Sheet
              </CardTitle>
              <CardDescription>
                Select an exam event to view or enter performance logs.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <select
                  id="selectExamToGrade"
                  value={selectedExamId}
                  onChange={(e) => setSelectedExamId(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">Select an exam...</option>
                  {exams.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.schoolClass.name}-{e.schoolClass.section} | {e.name} (
                      {e.subject.name})
                    </option>
                  ))}
                </select>
              </div>
            </CardContent>
          </Card>

          {!selectedExamId ? (
            <Card className="border-dashed border-2 py-16 flex flex-col items-center justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                <FileSpreadsheet className="size-6" />
              </div>
              <h3 className="font-semibold text-lg text-foreground">
                No Exam Selected
              </h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-sm text-center">
                Please select a scheduled exam from the dropdown list to load
                the students' grading ledger.
              </p>
            </Card>
          ) : isRosterLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-8 w-[250px]" />
              <Card>
                <CardContent className="p-6 space-y-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-10 w-full" />
                  ))}
                </CardContent>
              </Card>
            </div>
          ) : rosterError ? (
            <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-6 text-destructive">
              <h2 className="text-lg font-bold">Error loading roster</h2>
              <p className="text-sm mt-1">
                {rosterError instanceof Error
                  ? rosterError.message
                  : "Something went wrong loading class students."}
              </p>
            </div>
          ) : activeRoster.length === 0 ? (
            <Card className="py-16 text-center text-muted-foreground">
              <p className="text-sm">
                There are no students enrolled in Class{" "}
                {gradingExam?.schoolClass.name}-
                {gradingExam?.schoolClass.section} to enter grades for.
              </p>
            </Card>
          ) : (
            <form onSubmit={handleSaveGrades} className="space-y-4">
              {submitError && (
                <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive border border-destructive/20">
                  <AlertCircle className="size-4 shrink-0 text-destructive" />
                  <span className="text-xs font-semibold">{submitError}</span>
                </div>
              )}

              <Card className="border-border bg-card">
                <CardHeader className="border-b border-border/40 pb-4 flex flex-row flex-wrap items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-lg font-bold text-foreground">
                      Grade Sheet: {gradingExam?.name}
                    </CardTitle>
                    <CardDescription className="text-xs mt-1">
                      Subject: {gradingExam?.subject.name} | Max Marks:{" "}
                      {gradingExam?.maxMarks}
                    </CardDescription>
                  </div>
                  {canManage && (
                    <Button
                      type="submit"
                      disabled={submitGradesMutation.isPending}
                      className="cursor-pointer"
                    >
                      {submitGradesMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="size-4 mr-2" />
                          Save Grades
                        </>
                      )}
                    </Button>
                  )}
                </CardHeader>
                <CardContent className="p-0">
                  <div className="relative w-full overflow-auto">
                    <table className="w-full border-collapse text-left text-sm">
                      <thead>
                        <tr className="border-b border-border font-medium text-muted-foreground bg-muted/30">
                          <th className="p-4 w-[100px]">Roll No</th>
                          <th className="p-4 w-[250px]">Student Name</th>
                          <th className="p-4 w-[160px]">Marks Obtained</th>
                          <th className="p-4 w-[100px] text-center">Grade</th>
                          <th className="p-4">Remarks / Comments</th>
                        </tr>
                      </thead>
                      <tbody>
                        {activeRoster.map((student) => {
                          const stateVal = marksState[student.studentId] || {
                            marksObtained: "",
                            remarks: "",
                          };
                          const liveGrade = calculateGradeLive(
                            stateVal.marksObtained,
                            gradingExam?.maxMarks || 100,
                          );

                          const gradeColor =
                            liveGrade === "A" || liveGrade === "B"
                              ? "bg-emerald-500/10 text-emerald-500"
                              : liveGrade === "C" || liveGrade === "D"
                                ? "bg-amber-500/10 text-amber-500"
                                : liveGrade === "F"
                                  ? "bg-destructive/10 text-destructive font-bold"
                                  : "bg-muted text-muted-foreground";

                          return (
                            <tr
                              key={student.studentId}
                              className="border-b border-border/50 hover:bg-muted/10"
                            >
                              <td className="p-4 font-mono text-muted-foreground">
                                {student.rollNumber || "#"}
                              </td>
                              <td className="p-4 font-semibold text-foreground">
                                {student.name}
                              </td>
                              <td className="p-4">
                                <Input
                                  type="number"
                                  min="0"
                                  max={gradingExam?.maxMarks}
                                  step="0.5"
                                  disabled={!canManage}
                                  placeholder={`Max: ${gradingExam?.maxMarks}`}
                                  value={stateVal.marksObtained}
                                  onChange={(e) =>
                                    handleMarkChange(
                                      student.studentId,
                                      e.target.value,
                                      "marksObtained",
                                    )
                                  }
                                  className="w-[120px] font-semibold text-center"
                                />
                              </td>
                              <td className="p-4 text-center">
                                <span
                                  className={`inline-flex items-center justify-center rounded-full w-8 h-8 font-bold text-xs uppercase ${gradeColor}`}
                                >
                                  {liveGrade}
                                </span>
                              </td>
                              <td className="p-4">
                                <Input
                                  placeholder="Good attempt, needs revision, etc..."
                                  disabled={!canManage}
                                  value={stateVal.remarks}
                                  onChange={(e) =>
                                    handleMarkChange(
                                      student.studentId,
                                      e.target.value,
                                      "remarks",
                                    )
                                  }
                                  className="w-full"
                                />
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </form>
          )}
        </div>
      )}

      {/* Schedule Exam Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <Card className="w-full max-w-md bg-card border-border my-8 animate-in fade-in zoom-in-95 duration-200">
            <CardHeader className="relative text-left pb-4 border-b border-border">
              <CardTitle className="text-xl">Schedule Examination</CardTitle>
              <CardDescription>
                Setup details, syllabus date, and grading constraints.
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

            <form onSubmit={handleScheduleSubmit}>
              <CardContent className="space-y-4 pt-6 text-left">
                {submitError && (
                  <div className="mb-4 flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive border border-destructive/20 animate-fade-in">
                    <AlertCircle className="size-4 shrink-0 text-destructive" />
                    <span className="text-xs font-semibold">{submitError}</span>
                  </div>
                )}

                <div className="space-y-2">
                  <label
                    htmlFor="examName"
                    className="text-sm font-semibold text-foreground"
                  >
                    Exam Name *
                  </label>
                  <Input
                    id="examName"
                    placeholder="e.g. Mid-Term Examination 2026, Weekly Test"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="examClass"
                    className="text-sm font-semibold text-foreground"
                  >
                    Target ClassStream *
                  </label>
                  <select
                    id="examClass"
                    value={classId}
                    onChange={(e) => {
                      setClassId(e.target.value);
                      setSubjectId(""); // reset subject on class switch
                    }}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    required
                  >
                    <option value="">Select Classroom...</option>
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} - {c.section}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="examSubject"
                    className="text-sm font-semibold text-foreground"
                  >
                    Subject *
                  </label>
                  <select
                    id="examSubject"
                    value={subjectId}
                    onChange={(e) => setSubjectId(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    required
                  >
                    <option value="">Select Subject...</option>
                    {subjects
                      .filter((s) => !classId || s.classId === classId)
                      .map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} ({s.code})
                        </option>
                      ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label
                      htmlFor="examDate"
                      className="text-sm font-semibold text-foreground"
                    >
                      Exam Date *
                    </label>
                    <Input
                      id="examDate"
                      type="date"
                      value={examDate}
                      onChange={(e) => setExamDate(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="maxMarks"
                      className="text-sm font-semibold text-foreground"
                    >
                      Maximum Marks *
                    </label>
                    <Input
                      id="maxMarks"
                      type="number"
                      placeholder="100"
                      value={maxMarks}
                      onChange={(e) => setMaxMarks(e.target.value)}
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
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={scheduleExamMutation.isPending}>
                  {scheduleExamMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Scheduling...
                    </>
                  ) : (
                    "Schedule Exam"
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
