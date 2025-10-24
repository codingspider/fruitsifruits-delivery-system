<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MfgProduction extends Model
{
    protected $guarded = ['id'];

    public function product() { 
        return $this->belongsTo(Product::class); 
    }
    
    
    public function location() { 
        return $this->belongsTo(Location::class); 
    }
    
    public function user() { 
        return $this->belongsTo(User::class, 'created_by', 'id'); 
    }

    public function items()
    {
        return $this->hasMany(MfgProductionItem::class);
    }
}
