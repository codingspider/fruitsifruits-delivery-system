<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TransactionLine extends Model
{
    protected $guarded = ['id'];

    public function transaction() { 
        return $this->belongsTo(Transaction::class); 
    }
    
    public function product() { 
        return $this->belongsTo(Product::class); 
    }

    public function stockMoves() { 
        return $this->hasMany(StockMove::class); 
    }

}
