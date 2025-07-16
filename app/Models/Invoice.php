<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Invoice extends Model
{
    protected $fillable = [
        'id',
        'cart_id',
        'total',
        'status',
        'address_id',
        'receipt'
    ];

    /**
     * The attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'id' => 'string',
            'cart_id' => 'integer',
            'status' => 'string',
            'total' => 'decimal:0',
            'address_id' => 'integer'
        ];
    }
}
