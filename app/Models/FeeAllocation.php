<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable(['school_id', 'fee_category_id', 'student_id', 'class_id', 'start_date', 'end_date'])]
class FeeAllocation extends Model
{
    //
}
