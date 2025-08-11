<?php

namespace Database\Seeders;

use App\Models\Address;
use App\Models\Cart;
use App\Models\Invoice;
use App\Models\Product;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Admin',
            'phone' => '6281234567890',
            'role' => 'admin',
        ]);

        User::factory()->create([
            'name' => 'Bagus Syahputra',
            'phone' => '6281234567891',
            'role' => 'user',
        ]);

        User::factory()->create([
            'name' => 'Bambang Santoso',
            'phone' => '6281234567892',
            'role' => 'user',
        ]);

        User::factory()->create([
            'name' => 'Zulkifli Hasan',
            'phone' => '6281234567893',
            'role' => 'user',
        ]);

        Product::factory()->create([
            'name' => 'Madu Hutan Apis cerana',
            'description' => 'Madu hutan asli dengan rasa khas',
            'size' => 100,
            'price' => 50000,
            'stock' => 100,
            'image' => '/product.jpg'
        ]);

        Product::factory()->create([
            'name' => 'Madu Botol',
            'description' => 'Madu manis alami',
            'size' => 250,
            'price' => 75000,
            'stock' => 80,
            'image' => '/product2.jpg'
        ]);

        for ($i = 2; $i <= 4; $i++) {
            Cart::create([
                'user_id' => $i,
            ]);
        }

        Address::create([
            'address_line' => 'tes',
            'district' => 'tes',
            'city' => 'tes',
            'state' => 'tes',
            'postal_code' => 'tes',
            'phone_number' => 'tes',
        ]);

        Invoice::create([
            'id' => 'INV001',
            'cart_id' => 1,
            'rating' => 5,
            'comment' => 'Madunya enak',
            'total' => 0,
            'address_id' => 1
        ]);

        Invoice::create([
            'id' => 'INV002',
            'cart_id' => 2,
            'rating' => 5,
            'comment' => 'Rasa madunya premium sekali',
            'total' => 0,
            'address_id' => 1
        ]);

        Invoice::create([
            'id' => 'INV003',
            'cart_id' => 3,
            'rating' => 5,
            'comment' => 'Madunya kental dan nikmat sekali',
            'total' => 0,
            'address_id' => 1
        ]);
    }
}
