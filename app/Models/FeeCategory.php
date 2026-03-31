<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable(['school_id', 'name', 'amount', 'periodicity', 'description'])]
class FeeCategory extends Model
{
    //
}
