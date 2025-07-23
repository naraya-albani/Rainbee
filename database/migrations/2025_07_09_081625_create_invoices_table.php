<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('invoices', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->decimal('total', 10, 0);
            $table->enum('status', ['pending', 'waiting', 'approved', 'sending', 'claimed', 'rejected', 'canceled'])->default('pending');
            $table->foreignId('cart_id')->constrained('carts')->onDelete('cascade');
            $table->foreignId('address_id')->constrained('addresses')->onDelete('cascade');
            $table->string('receipt')->nullable();
            $table->integer('rating')->nullable();
            $table->string('comment')->nullable();
            $table->json('attachment')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('invoices');
    }
};
