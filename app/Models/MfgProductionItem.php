<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MfgProductionItem extends Model
{
    protected $guarded = ['id'];

    public function flavour() { 
        return $this->belongsTo(Flavour::class); 
    }

    public function bottle() { 
        return $this->belongsTo(Product::class, 'bottle_id', 'id'); 
    }
    
}
