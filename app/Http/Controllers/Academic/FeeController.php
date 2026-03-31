<?php

namespace App\Http\Controllers\Academic;

use App\Http\Controllers\Controller;
use App\Models\FeeCategory;
use App\Models\FeeAllocation;
use App\Models\SchoolClass;
use App\Models\Student;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FeeController extends Controller
{
    public function index(Request $request)
    {
        $schoolId = $request->user()->school_id;

        $categories = FeeCategory::where('school_id', $schoolId)->get();
        $allocations = FeeAllocation::where('school_id', $schoolId)
            ->with(['feeCategory', 'schoolClass', 'student'])
            ->get();

        return Inertia::render('fees/index', [
            'categories' => $categories,
            'allocations' => $allocations,
        ]);
    }

    public function createCategory(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0',
            'periodicity' => 'required|in:monthly,term,annual',
            'description' => 'nullable|string',
        ]);

        FeeCategory::create([
            'school_id' => $request->user()->school_id,
            'name' => $request->name,
            'amount' => $request->amount,
            'periodicity' => $request->periodicity,
            'description' => $request->description,
        ]);

        return redirect()->back()->with('success', 'Fee category created.');
    }

    public function allocate(Request $request)
    {
        $request->validate([
            'fee_category_id' => 'required',
            'class_id' => 'nullable',
            'student_id' => 'nullable',
            'start_date' => 'required|date',
            'end_date' => 'required|date',
        ]);

        FeeAllocation::create([
            'school_id' => $request->user()->school_id,
            'fee_category_id' => $request->fee_category_id,
            'class_id' => $request->class_id,
            'student_id' => $request->student_id,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
        ]);

        return redirect()->back()->with('success', 'Fee allocated successfully.');
    }
}
