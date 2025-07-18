<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => "Madu hutan Apis cerana",
            'description' => null,
            'size' => 100,
            'price' => 50000,
            'stock' => 100,
            'image' => 'produk.jpg'
        ];
    }
}
