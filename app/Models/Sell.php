<?php

namespace App\Models;

use App\Models\Transaction;
use Illuminate\Database\Eloquent\Model;

class Sell extends Model
{
    protected $guarded = ['id'];

    public function transaction() { 
        return $this->belongsTo(Transaction::class); 
    }
}
