<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LocationFlavour extends Model
{
    public function location()
    {
        return $this->belongsTo(Location::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
    
    public function falvour()
    {
        return $this->belongsTo(Flavour::class);
    }
}
