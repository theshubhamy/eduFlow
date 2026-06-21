import React, { useState } from "react";
import {
  useAttendanceClasses,
  useAttendanceRoster,
  useSaveAttendance,
} from "@/hooks/queries/useAttendance";
import {
  ClipboardList,
  Check,
  Loader2,
  Info,
  Send,
  AlertCircle,
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

interface StudentRoster {
  id: string;
  user: {
    id: string;
    name: string;
  };
}

export default function AttendancePage() {
  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [attendanceState, setAttendanceState] = useState<
    Record<string, string>
  >({});
  const [successMessage, setSuccessMessage] = useState("");
  const [sentAlerts, setSentAlerts] = useState<string[]>([]);
  const [saveError, setSaveError] = useState("");

  // 1. Fetch available classes
  const { data: classesData, isLoading: isClassesLoading } =
    useAttendanceClasses();

  // 2. Fetch roster & existing attendance
  const {
    data: rosterData,
    isLoading: isRosterLoading,
    refetch: refetchRoster,
    isFetching: isRosterFetching,
  } = useAttendanceRoster(selectedClassId, selectedDate);

  // Manual trigger to set state when rosterData is loaded or changes
  React.useEffect(() => {
    if (rosterData) {
      const state: Record<string, string> = {};
      rosterData.students.forEach((student: StudentRoster) => {
        state[student.id] =
          rosterData.existingAttendance[student.id]?.status || "present";
      });
      setAttendanceState(state);
      setSuccessMessage("");
      setSentAlerts([]);
      setSaveError("");
    }
  }, [rosterData]);

  const saveAttendanceMutation = useSaveAttendance(
    selectedClassId,
    selectedDate,
  );

  const handleStatusChange = (studentId: string, status: string) => {
    setAttendanceState((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  const handleMarkAll = (status: string) => {
    if (!rosterData) return;
    const nextState: Record<string, string> = {};
    rosterData.students.forEach((s: StudentRoster) => {
      nextState[s.id] = status;
    });
    setAttendanceState(nextState);
  };

  const handleSave = () => {
    if (!selectedClassId || !selectedDate) {
      setSaveError("Please select both a class and a date.");
      return;
    }
    saveAttendanceMutation.mutate(
      {
        class_id: selectedClassId,
        date: selectedDate,
        attendance: attendanceState,
      },
      {
        onSuccess: (data) => {
          setSuccessMessage("Attendance saved successfully.");
          setSentAlerts(data.notifications || []);
          setSaveError("");
          window.scrollTo({ top: 0, behavior: "smooth" });
        },
        onError: (err: any) => {
          setSaveError(err.message || "Failed to save attendance.");
        },
      },
    );
  };

  const classes = classesData?.classes || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-left">
          Attendance
        </h1>
        <p className="text-muted-foreground text-left text-sm mt-1">
          Take or update daily student attendance rosters. Alerts are
          automatically sent to parents for absences.
        </p>
      </div>

      {successMessage && (
        <div className="mb-4 flex items-start gap-2.5 rounded-lg bg-emerald-500/10 p-3.5 text-sm text-emerald-600 dark:text-emerald-500 border border-emerald-500/20 text-left animate-fade-in">
          <Check className="size-4 shrink-0 text-emerald-500 mt-0.5" />
          <div className="flex flex-col">
            <span className="font-semibold">{successMessage}</span>
            {sentAlerts.length > 0 && (
              <span className="font-normal text-xs text-emerald-600/80 dark:text-emerald-500/80 mt-1 flex items-center gap-1">
                <Send className="size-3" />
                Simulated SMS alerts sent to parents of: {sentAlerts.join(", ")}
              </span>
            )}
          </div>
        </div>
      )}

      {saveError && (
        <div className="mb-4 flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive border border-destructive/20 text-left animate-fade-in">
          <AlertCircle className="size-4 shrink-0 text-destructive" />
          <span className="text-sm font-semibold">{saveError}</span>
        </div>
      )}

      {/* Roster Controls */}
      <Card className="border-border bg-card">
        <CardContent className="p-6">
          <div className="grid gap-4 md:grid-cols-3 items-end">
            <div className="space-y-2 text-left">
              <label
                htmlFor="classSelect"
                className="text-sm font-semibold text-foreground"
              >
                Select ClassRoom *
              </label>
              {isClassesLoading ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <select
                  id="classSelect"
                  value={selectedClassId}
                  onChange={(e) => setSelectedClassId(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="">Choose Class...</option>
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} - {c.section}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="space-y-2 text-left">
              <label
                htmlFor="dateSelect"
                className="text-sm font-semibold text-foreground"
              >
                Attendance Date *
              </label>
              <Input
                id="dateSelect"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="w-full justify-center cursor-pointer"
                disabled={!selectedClassId || isRosterFetching}
                onClick={() => refetchRoster()}
              >
                {isRosterFetching ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Syncing...
                  </>
                ) : (
                  "Refresh Sheet"
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Student Roster Area */}
      {!selectedClassId ? (
        <Card className="border-dashed border-2 py-16 flex flex-col items-center justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
            <ClipboardList className="size-6" />
          </div>
          <h3 className="font-semibold text-lg text-foreground">
            No Class Selected
          </h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm text-center">
            Choose an active classroom and date to load the roster and mark
            student attendance.
          </p>
        </Card>
      ) : isRosterLoading ? (
        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row justify-between items-center pb-4 border-b border-border">
            <Skeleton className="h-6 w-50" />
            <div className="flex gap-2">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-20" />
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center py-2 border-b"
                >
                  <Skeleton className="h-5 w-37.5" />
                  <div className="flex gap-2">
                    <Skeleton className="h-8 w-8 rounded-md" />
                    <Skeleton className="h-8 w-8 rounded-md" />
                    <Skeleton className="h-8 w-8 rounded-md" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : rosterData && rosterData.students.length === 0 ? (
        <Card className="border-dashed border-2 py-16 flex flex-col items-center justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-500/10 text-yellow-500 mb-4">
            <Info className="size-6" />
          </div>
          <h3 className="font-semibold text-lg text-foreground">
            Empty Class Roster
          </h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm text-center">
            There are no students enrolled in {rosterData.class.name} (
            {rosterData.class.section}) yet.
          </p>
        </Card>
      ) : rosterData ? (
        <Card className="border-border bg-card">
          <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-border text-left">
            <div>
              <CardTitle className="text-lg">
                Roster: {rosterData.class.name} ({rosterData.class.section})
              </CardTitle>
              <CardDescription>
                Mark student statuses for{" "}
                {new Date(rosterData.date).toLocaleDateString(undefined, {
                  weekday: "long",
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </CardDescription>
            </div>
            {/* Bulk Actions */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleMarkAll("present")}
                className="text-xs cursor-pointer border-emerald-500/20 hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-500"
              >
                Mark All Present
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleMarkAll("absent")}
                className="text-xs cursor-pointer border-destructive/20 hover:bg-destructive/10 hover:text-destructive"
              >
                Mark All Absent
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border/60">
              {rosterData.students.map((student: StudentRoster) => {
                const currentStatus = attendanceState[student.id] || "present";
                const isModified =
                  currentStatus !==
                  (rosterData.existingAttendance[student.id]?.status ||
                    "present");

                return (
                  <div
                    key={student.id}
                    className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 gap-4 hover:bg-muted/10 transition-colors"
                  >
                    <div className="flex items-center gap-3 text-left">
                      <div className="font-semibold text-foreground">
                        {student.user.name}
                      </div>
                      {isModified && (
                        <span className="inline-flex items-center rounded bg-yellow-500/10 px-1.5 py-0.2 text-[10px] font-semibold text-yellow-600 dark:text-yellow-500">
                          Unsaved Change
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      {/* Present Button */}
                      <button
                        type="button"
                        onClick={() =>
                          handleStatusChange(student.id, "present")
                        }
                        className={`flex-1 sm:flex-initial text-xs font-semibold px-4 py-2 rounded-lg border transition-all cursor-pointer ${
                          currentStatus === "present"
                            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-500 shadow-sm"
                            : "bg-background border-border hover:bg-muted text-muted-foreground"
                        }`}
                      >
                        Present
                      </button>

                      {/* Absent Button */}
                      <button
                        type="button"
                        onClick={() => handleStatusChange(student.id, "absent")}
                        className={`flex-1 sm:flex-initial text-xs font-semibold px-4 py-2 rounded-lg border transition-all cursor-pointer ${
                          currentStatus === "absent"
                            ? "bg-destructive/10 border-destructive/30 text-destructive shadow-sm"
                            : "bg-background border-border hover:bg-muted text-muted-foreground"
                        }`}
                      >
                        Absent
                      </button>

                      {/* Late Button */}
                      <button
                        type="button"
                        onClick={() => handleStatusChange(student.id, "late")}
                        className={`flex-1 sm:flex-initial text-xs font-semibold px-4 py-2 rounded-lg border transition-all cursor-pointer ${
                          currentStatus === "late"
                            ? "bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-500 shadow-sm"
                            : "bg-background border-border hover:bg-muted text-muted-foreground"
                        }`}
                      >
                        Late
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end p-6 border-t border-border">
              <Button
                onClick={handleSave}
                disabled={saveAttendanceMutation.isPending}
                className="w-full sm:w-45 cursor-pointer"
              >
                {saveAttendanceMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving Sheet...
                  </>
                ) : (
                  "Save Attendance"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
