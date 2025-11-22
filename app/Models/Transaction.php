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
    
    public function reports() { 
        return $this->hasMany(Report::class); 
    }
    
    public function sell_lines() { 
        return $this->hasMany(SellLine::class); 
    }
    
    public function payment_lines() { 
        return $this->hasMany(PaymentLine::class); 
    }
    
    public function sell_returns() { 
        return $this->hasMany(SellReturn::class); 
    }

    public function sell() { 
        return $this->hasOne(Sell::class); 
    }
    
    public function location() { 
        return $this->belongsTo(Location::class); 
    }

    public function created_by_user() { 
        return $this->belongsTo(User::class,'created_by'); 
    }
}
