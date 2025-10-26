<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LocationFlavour extends Model
{
    protected $guarded = ['id'];
    
    public function location()
    {
        return $this->belongsTo(Location::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id', 'id');
    }
    
    public function bottle()
    {
        return $this->belongsTo(Product::class, 'bottle_id', 'id');
    }
    
    public function flavour()
    {
        return $this->belongsTo(Flavour::class, 'flavour_id', 'id');
    }
}
