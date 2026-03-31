<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class TestModel extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'test_collection';
    
    protected $fillable = ['name', 'data'];
}
