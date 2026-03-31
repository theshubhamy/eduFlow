<?php

namespace App\Http\Controllers\Academic;

use App\Http\Controllers\Controller;
use App\Models\Subject;
use App\Models\SchoolClass;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SubjectController extends Controller
{
    public function index(Request $request)
    {
        $schoolId = $request->user()->school_id;

        $subjects = Subject::where('school_id', $schoolId)
            ->with(['schoolClass', 'teacher'])
            ->get()
            ->map(function ($subject) {
                return [
                    'id' => $subject->id,
                    '_id' => $subject->id,
                    'name' => $subject->name,
                    'code' => $subject->code,
                    'school_class' => $subject->schoolClass ? [
                        'id' => $subject->schoolClass->id,
                        '_id' => $subject->schoolClass->id,
                        'name' => $subject->schoolClass->name,
                        'section' => $subject->schoolClass->section,
                    ] : null,
                    'teacher' => $subject->teacher ? [
                        'id' => $subject->teacher->id,
                        'name' => $subject->teacher->name,
                    ] : null,
                ];
            });

        $classes = SchoolClass::where('school_id', $schoolId)->get(['id', 'name', 'section']);
        $teachers = User::where('school_id', $schoolId)
            ->whereIn('role', ['admin', 'teacher', 'faculty']) // Assuming these are valid roles
            ->get(['id', 'name']);

        return Inertia::render('subjects/index', [
            'subjects' => $subjects,
            'classes' => $classes,
            'teachers' => $teachers,
        ]);
    }

    public function store(Request $request)
    {
        $schoolId = $request->user()->school_id;

        $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:50',
            'class_id' => 'required|string',
            'teacher_id' => 'required|string',
        ]);

        Subject::create([
            'school_id' => $schoolId,
            'name' => $request->name,
            'code' => $request->code,
            'class_id' => $request->class_id,
            'teacher_id' => $request->teacher_id,
        ]);

        return redirect()->route('subjects.index')->with('success', 'Subject created successfully.');
    }

    public function destroy(Request $request, string $id)
    {
        $schoolId = $request->user()->school_id;
        $subject = Subject::where('school_id', $schoolId)->findOrFail($id);
        
        $subject->delete();
        
        return redirect()->route('subjects.index')->with('success', 'Subject deleted successfully.');
    }
}
