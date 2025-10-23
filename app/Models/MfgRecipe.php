<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MfgRecipe extends Model
{
    protected $guarded = ['id'];

    public function recipe_items()
    {
        return $this->hasMany(MfgRecipeIngredient::class);
    }

    public function product() { 
        return $this->belongsTo(Product::class); 
    }
    
    public function user() { 
        return $this->belongsTo(User::class, 'created_by', 'id'); 
    }
}
