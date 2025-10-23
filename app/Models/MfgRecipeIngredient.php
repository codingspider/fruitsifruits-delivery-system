<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MfgRecipeIngredient extends Model
{
    protected $guarded = ['id'];

    public function product() { 
        return $this->belongsTo(Product::class); 
    }
    
    public function recipe() { 
        return $this->belongsTo(MfgRecipe::class); 
    }
}
