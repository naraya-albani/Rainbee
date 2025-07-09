<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Variant extends Model
{
    protected $fillable = [
        'product_id',
        'variant_name',
        'price',
        'stock',
    ];
    
    /**
     * The attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'product_id' => 'integer',
            'price' => 'decimal:2',
            'stock' => 'integer',
        ];
    }
}
