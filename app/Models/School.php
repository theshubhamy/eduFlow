<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;

class School extends Model
{
    use HasFactory;

    protected $connection = 'mongodb';
    protected $collection = 'schools';

    protected $fillable = [
        'name',
        'address',
        'phone',
        'email',
        'website',
        'logo',
    ];

    public function users(): HasMany
    {
        return $this->hasMany(User::class, 'school_id');
    }

    public function classes(): HasMany
    {
        return $this->hasMany(SchoolClass::class, 'school_id');
    }
}
