<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DriverJuiceAllocationLine extends Model
{
    protected $fillable = ['allocation_id', 'product_id', 'flavour_id', 'quantity'];

    public function allocation()
    {
        return $this->belongsTo(DriverJuiceAllocation::class, 'allocation_id');
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function flavour()
    {
        return $this->belongsTo(Flavour::class);
    }
}
