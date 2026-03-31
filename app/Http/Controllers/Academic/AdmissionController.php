<?php

namespace App\Http\Controllers\Academic;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Student;
use App\Models\SchoolClass;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class AdmissionController extends Controller
{
    public function index(Request $request)
    {
        $schoolId = $request->user()->school_id;

        $students = Student::where('school_id', $schoolId)
            ->with(['user', 'schoolClass'])
            ->paginate(20);

        return Inertia::render('students/index', [
            'students' => $students
        ]);
    }

    public function create(Request $request)
    {
        $schoolId = $request->user()->school_id;

        $classes = SchoolClass::where('school_id', $schoolId)
            ->get(['id', 'name', 'section']);

        return Inertia::render('students/create', [
            'classes' => $classes
        ]);
    }

    public function store(Request $request)
    {
        $schoolId = $request->user()->school_id;

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'class_id' => 'required',
            'roll_number' => 'required|string|max:50',
            'admission_date' => 'required|date',
        ]);

        // 1. Create the User account for the student
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'student',
            'school_id' => $schoolId,
        ]);

        // 2. Create the Student record
        Student::create([
            'user_id' => $user->getKey(),
            'class_id' => $request->class_id,
            'roll_number' => $request->roll_number,
            'admission_date' => $request->admission_date,
            'school_id' => $schoolId,
        ]);

        return redirect()->route('students.index')->with('success', 'Student admitted successfully.');
    }
}
