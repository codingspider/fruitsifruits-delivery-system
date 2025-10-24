<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DriverJuiceAllocation extends Model
{
    protected $guarded = ['id'];

    public function driver()
    {
        return $this->belongsTo(User::class, 'driver_id', 'id');
    }
    
    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id', 'id');
    }

    public function lines()
    {
        return $this->hasMany(DriverJuiceAllocationLine::class, 'allocation_id');
    }
}
