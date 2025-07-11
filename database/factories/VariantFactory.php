<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Variant>
 */
class VariantFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'variant_name' => fake()->colorName(),
            'size' => fake()->numberBetween(100, 500),
            'price' => fake()->randomFloat(0, 10000, 100000),
            'stock' => fake()->numberBetween(1, 50),
            'image' => fake()->imageUrl(640, 480, 'fashion'),
        ];
    }
}
