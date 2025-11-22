<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SellReturn extends Model
{
    protected $guarded = ['id'];

    public function transaction() { 
        return $this->belongsTo(Transaction::class, 'transaction_id', 'id'); 
    }
    
    public function bottle() { 
        return $this->belongsTo(Product::class, 'bottle_id', 'id'); 
    }
    
    public function flavor() { 
        return $this->belongsTo(Flavour::class, 'flavour_id', 'id'); 
    }
}
