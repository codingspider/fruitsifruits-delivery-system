<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $guarded = ['id'];

    public function transactionLines() { 
        return $this->hasMany(TransactionLine::class); 
    }
    
    public function stockMoves() { 
        return $this->hasMany(StockMove::class); 
    }

    public function location_flavours()
    {
        return $this->hasMany(LocationFlavour::class);
    }
}
