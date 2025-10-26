<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ReturnLeftoverItem extends Model
{
    protected $guarded = ['id'];

    public function allocation()
    {
        return $this->belongsTo(ReturnLeftover::class);
    }

    public function bottle()
    {
        return $this->belongsTo(Product::class, 'bottle_id', 'id');
    }

    public function flavour()
    {
        return $this->belongsTo(Flavour::class);
    }
}
