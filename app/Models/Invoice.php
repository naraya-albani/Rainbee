<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Invoice extends Model
{
    use HasFactory;
    protected $fillable = [
        'id',
        'cart_id',
        'total',
        'status',
        'address_id',
        'receipt',
        'rating',
        'comment',
        'attachment'
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
            'address_id' => 'integer',
            'rating' => 'integer',
            'attachment' => 'array',
        ];
    }

    public function cart()
    {
        return $this->belongsTo(Cart::class);
    }

    public function address()
    {
        return $this->belongsTo(Address::class);
    }
}
