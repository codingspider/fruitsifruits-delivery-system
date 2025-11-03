<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SellLine extends Model
{
    protected $guarded = ['id'];

    public function transaction() { 
        return $this->belongsTo(Transaction::class); 
    }
    
    public function product() { 
        return $this->belongsTo(Product::class); 
    }
    
    public function bottle() { 
        return $this->belongsTo(Product::class, 'bottle_id', 'id'); 
    }
    
    public function flavor() { 
        return $this->belongsTo(Flavour::class, 'flavour_id', 'id'); 
    }
}
