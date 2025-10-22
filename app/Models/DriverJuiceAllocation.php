<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DriverJuiceAllocation extends Model
{
    protected $fillable = ['driver_id', 'allocation_date'];

    public function driver()
    {
        return $this->belongsTo(User::class, 'driver_id');
    }

    public function lines()
    {
        return $this->hasMany(DriverJuiceAllocationLine::class, 'allocation_id');
    }
}
