<?php

namespace App\Http\Controllers\Academic;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\SchoolClass;
use App\Models\Student;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

use App\Notifications\AttendanceAbsentNotification;

class AttendanceController extends Controller
{
    public function index(Request $request)
    {
        $schoolId = $request->user()->school_id;

        $classes = SchoolClass::where('school_id', $schoolId)
            ->get(['id', 'name', 'section']);

        return Inertia::render('attendance/index', [
            'classes' => $classes
        ]);
    }

    public function create(Request $request)
    {
        $schoolId = $request->user()->school_id;

        $request->validate([
            'class_id' => 'required',
            'date' => 'required|date',
        ]);

        $classId = $request->class_id;
        $date = Carbon::parse($request->date)->startOfDay();

        $class = SchoolClass::where('school_id', $schoolId)->findOrFail($classId);
        $students = Student::where('school_id', $schoolId)
            ->where('class_id', $classId)
            ->with('user:id,name')
            ->get();

        // Fetch existing attendance for this day
        $existingAttendance = Attendance::where('school_id', $schoolId)
            ->where('class_id', $classId)
            ->where('date', $date)
            ->get()
            ->keyBy('student_id');

        return Inertia::render('attendance/create', [
            'class' => $class,
            'date' => $date->toDateString(),
            'students' => $students,
            'existingAttendance' => $existingAttendance,
        ]);
    }

    public function store(Request $request)
    {
        $schoolId = $request->user()->school_id;

        $request->validate([
            'class_id' => 'required',
            'date' => 'required|date',
            'attendance' => 'required|array',
        ]);

        $date = Carbon::parse($request->date)->startOfDay();

        foreach ($request->attendance as $studentId => $status) {
            $attendance = Attendance::updateOrCreate(
                [
                    'student_id' => $studentId,
                    'date' => $date,
                    'school_id' => $schoolId,
                ],
                [
                    'class_id' => $request->class_id,
                    'status' => $status,
                ]
            );

            // Notify parent if student is absent
            if ($status === 'absent') {
                $student = Student::with('user')->find($studentId);
                if ($student && $student->user) {
                    $student->user->notify(new AttendanceAbsentNotification($student, $date));
                }
            }
        }

        return redirect()->route('attendance.index')->with('success', 'Attendance updated and notifications sent.');
    }
}
