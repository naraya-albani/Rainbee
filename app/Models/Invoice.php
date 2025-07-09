<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Invoice extends Model
{
    protected $fillable = [
        'cart_id',
        'total',
        'status',
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
            'total' => 'decimal:2',
            'status' => 'string',
        ];
    }
}
