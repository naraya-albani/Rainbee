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
            'image' => 'https://picsum.photos/id/' . fake()->randomElement(['0', '13', '20']) . '/400/180.webp'
        ];
    }
}
