<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StockMove extends Model
{
    protected $guarded = ['id'];
    public function transactionLine() { return $this->belongsTo(TransactionLine::class); }
    public function product() { return $this->belongsTo(Product::class); }
}
