<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable(['school_id', 'student_id', 'fee_allocation_id', 'amount_paid', 'payment_date', 'method', 'status', 'period_identifier', 'receipt_number'])]
class FeePayment extends Model
{
    //
}
