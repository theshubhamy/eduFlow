<?php

namespace App\Http\Controllers\Academic;

use App\Http\Controllers\Controller;
use App\Models\FeePayment;
use App\Models\FeeAllocation;
use App\Models\Student;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Str;

class FeePaymentController extends Controller
{
    public function index(Request $request)
    {
        $schoolId = $request->user()->school_id;

        $payments = FeePayment::where('school_id', $schoolId)
            ->with(['student.user', 'feeAllocation.feeCategory'])
            ->latest()
            ->paginate(20);

        return Inertia::render('fees/payments', [
            'payments' => $payments
        ]);
    }

    public function collect(Request $request)
    {
        $request->validate([
            'student_id' => 'required',
            'fee_allocation_id' => 'required',
            'amount_paid' => 'required|numeric|min:0',
            'method' => 'required|string',
            'period_identifier' => 'required|string', // e.g. "April 2026"
        ]);

        $payment = FeePayment::create([
            'school_id' => $request->user()->school_id,
            'student_id' => $request->student_id,
            'fee_allocation_id' => $request->fee_allocation_id,
            'amount_paid' => $request->amount_paid,
            'payment_date' => now(),
            'method' => $request->method,
            'status' => 'paid',
            'period_identifier' => $request->period_identifier,
            'receipt_number' => 'REC-' . strtoupper(Str::random(8)),
        ]);

        return redirect()->back()->with('success', 'Payment collected and receipt generated: ' . $payment->receipt_number);
    }

    public function downloadReceipt($id)
    {
        $payment = FeePayment::with(['student.user', 'feeAllocation.feeCategory'])->findOrFail($id);

        $pdf = Pdf::loadView('receipts.fee', [
            'payment' => $payment
        ]);

        return $pdf->download('Receipt-' . $payment->receipt_number . '.pdf');
    }
}
