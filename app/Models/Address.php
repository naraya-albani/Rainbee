<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Address extends Model
{
    protected $fillable = [
        'user_id',
        'address_line',
        'city',
        'state',
        'postal_code',
        'phone_number',
        'address_type',
        'is_default',
        'latitude',
        'longitude',
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
            'postal_code' => 'string',
            'phone_number' => 'string',
            'address_type' => 'string',
            'is_default' => 'boolean',
            'latitude' => 'string',
            'longitude' => 'string',
        ];
    }
}
