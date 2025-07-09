<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DetailCart extends Model
{
    protected $fillable = [
        'cart_id',
        'variant_id',
        'quantity',
        'price',
    ];

    /**
     * The attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'cart_id' => 'integer',
            'variant_id' => 'integer',
            'quantity' => 'integer',
            'price' => 'decimal:2',
        ];
    }
}
