<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    protected $guarded = ['id'];
    public function lines() { return $this->hasMany(TransactionLine::class); }
    public function createdBy() { return $this->belongsTo(User::class,'created_by'); }
}
