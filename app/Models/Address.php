<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Address extends Model
{
    protected $fillable = [
        'address_line',
        'district',
        'city',
        'state',
        'postal_code',
        'phone_number',
    ];

    /**
     * The attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'postal_code' => 'string',
            'phone_number' => 'string',
        ];
    }
}
