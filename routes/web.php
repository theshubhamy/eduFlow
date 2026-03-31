<?php

use App\Http\Controllers\Teams\TeamInvitationController;
use App\Http\Middleware\EnsureTeamMembership;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified', EnsureTeamMembership::class])
    ->group(function () {
        Route::inertia('dashboard', 'dashboard')->name('dashboard');
        
        // Staff & Members
        Route::get('members', [App\Http\Controllers\Academic\MemberController::class, 'index'])->name('members.index');
        
        // Students & Admission
        Route::get('students', [App\Http\Controllers\Academic\AdmissionController::class, 'index'])->name('students.index');
        Route::get('students/create', [App\Http\Controllers\Academic\AdmissionController::class, 'create'])->name('students.create');
        Route::post('students', [App\Http\Controllers\Academic\AdmissionController::class, 'store'])->name('students.store');
        
        Route::get('classes', [App\Http\Controllers\Academic\SchoolClassController::class, 'index'])->name('classes.index');
        Route::post('classes', [App\Http\Controllers\Academic\SchoolClassController::class, 'store'])->name('classes.store');
        Route::delete('classes/{id}', [App\Http\Controllers\Academic\SchoolClassController::class, 'destroy'])->name('classes.destroy');
        Route::get('subjects', [App\Http\Controllers\Academic\SubjectController::class, 'index'])->name('subjects.index');
        Route::post('subjects', [App\Http\Controllers\Academic\SubjectController::class, 'store'])->name('subjects.store');
        Route::delete('subjects/{id}', [App\Http\Controllers\Academic\SubjectController::class, 'destroy'])->name('subjects.destroy');
        
        // Attendance
        Route::get('attendance', [App\Http\Controllers\Academic\AttendanceController::class, 'index'])->name('attendance.index');
        Route::get('attendance/create', [App\Http\Controllers\Academic\AttendanceController::class, 'create'])->name('attendance.create');
        Route::post('attendance', [App\Http\Controllers\Academic\AttendanceController::class, 'store'])->name('attendance.store');

        // Fee Management
        Route::get('fees', [App\Http\Controllers\Academic\FeeController::class, 'index'])->name('fees.index');
        Route::post('fees/category', [App\Http\Controllers\Academic\FeeController::class, 'createCategory'])->name('fees.category.store');
        Route::post('fees/allocate', [App\Http\Controllers\Academic\FeeController::class, 'allocate'])->name('fees.allocate.store');

        Route::get('payments', [App\Http\Controllers\Academic\FeePaymentController::class, 'index'])->name('payments.index');
        Route::post('payments/collect', [App\Http\Controllers\Academic\FeePaymentController::class, 'collect'])->name('payments.collect');
        Route::get('payments/{id}/receipt', [App\Http\Controllers\Academic\FeePaymentController::class, 'downloadReceipt'])->name('payments.receipt');
    });

Route::middleware(['auth'])->group(function () {
    Route::get('invitations/{invitation}/accept', [TeamInvitationController::class, 'accept'])->name('invitations.accept');
});

require __DIR__.'/settings.php';
