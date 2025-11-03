<?php

namespace App\Models;

use App\Models\Sell;
use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    protected $guarded = ['id'];

    public function lines() { 
        return $this->hasMany(TransactionLine::class); 
    }
    
    public function sell_lines() { 
        return $this->hasMany(SellLine::class); 
    }

    public function sell() { 
        return $this->hasOne(Sell::class); 
    }
    
    public function location() { 
        return $this->belongsTo(Location::class); 
    }

    public function createdBy() { 
        return $this->belongsTo(User::class,'created_by'); 
    }
}
