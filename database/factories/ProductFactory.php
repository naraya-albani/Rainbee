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
            'name' => fake()->words(3, true),
            'description' => fake()->paragraph(),
            'size' => fake()->numberBetween(100, 500),
            'price' => fake()->randomFloat(0, 10000, 100000),
            'stock' => fake()->numberBetween(1, 50),
            'image' => 'https://picsum.photos/id/' . fake()->randomElement(['0', '13', '20']) . '/400/180.webp'
        ];
    }
}
