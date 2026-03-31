<?php

namespace App\Http\Controllers\Academic;

use App\Http\Controllers\Controller;
use App\Models\SchoolClass;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SchoolClassController extends Controller
{
    public function index(Request $request)
    {
        $schoolId = $request->user()->school_id;

        $classes = SchoolClass::where('school_id', $schoolId)
            ->with('students')
            ->orderBy('name')
            ->get()
            ->map(function ($class) {
                return [
                    'id' => $class->id,
                    '_id' => $class->id, // MongoDB compatibility
                    'name' => $class->name,
                    'section' => $class->section,
                    'room_number' => $class->room_number,
                    'students_count' => $class->students ? $class->students->count() : 0,
                    'created_at' => $class->created_at,
                ];
            });

        return Inertia::render('classes/index', [
            'classes' => $classes
        ]);
    }

    public function store(Request $request)
    {
        $schoolId = $request->user()->school_id;

        $request->validate([
            'name' => 'required|string|max:255',
            'section' => 'required|string|max:50',
            'room_number' => 'nullable|string|max:50',
        ]);

        SchoolClass::create([
            'school_id' => $schoolId,
            'name' => $request->name,
            'section' => $request->section,
            'room_number' => $request->room_number,
        ]);

        return redirect()->route('classes.index')->with('success', 'Class created successfully.');
    }

    public function destroy(Request $request, string $id)
    {
        $schoolId = $request->user()->school_id;
        $class = SchoolClass::where('school_id', $schoolId)->findOrFail($id);
        
        // Optionally add validation check: don't delete if students exist
        if ($class->students()->count() > 0) {
            return redirect()->back()->with('error', 'Cannot delete class with enrolled students.');
        }
        
        $class->delete();
        
        return redirect()->route('classes.index')->with('success', 'Class deleted successfully.');
    }
}
