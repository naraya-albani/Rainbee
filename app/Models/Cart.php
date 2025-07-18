<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Cart extends Model
{
    protected $fillable = [
        'user_id',
        'subtotal',
        'is_active'
    ];

    /**
     * The attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'user_id' => 'integer',
            'subtotal' => 'decimal:0',
            'is_active' => 'boolean'
        ];
    }

    public function details()
    {
        return $this->hasMany(DetailCart::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function detailCarts()
    {
        return $this->hasMany(DetailCart::class);
    }
}
