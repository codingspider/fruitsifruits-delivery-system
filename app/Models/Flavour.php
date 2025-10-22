<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Flavour extends Model
{
    public function location_flavours()
    {
        return $this->hasMany(LocationFlavour::class);
    }
}
