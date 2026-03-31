<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Attendance extends Model
{
    use HasFactory;

    protected $connection = 'mongodb';
    protected $collection = 'attendances';

    protected $fillable = [
        'student_id',
        'class_id',
        'school_id',
        'date',
        'status', // present, absent, late
        'remarks',
    ];

    protected $casts = [
        'date' => 'datetime',
    ];

    /**
     * Get the student for the attendance record.
     */
    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class, 'student_id');
    }

    /**
     * Get the class for the attendance record.
     */
    public function schoolClass(): BelongsTo
    {
        return $this->belongsTo(SchoolClass::class, 'class_id');
    }

    /**
     * Get the school for the attendance record.
     */
    public function school(): BelongsTo
    {
        return $this->belongsTo(School::class, 'school_id');
    }
}
