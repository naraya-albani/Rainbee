<?php

use App\Models\Cart;
use App\Models\Invoice;
use App\Models\Product;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'user' => Auth::user(),
        'product' => Product::all()
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
    Route::get('produk', function () {
        return Inertia::render('addproduk');
    })->name('produk');
    Route::get('laporan', function () {
        return Inertia::render('laporan');
    })->name('laporan');
    Route::get('keranjang', function () {
        $user = Auth::user();
        $cart = Cart::where('user_id', $user->id)->where('is_active', true)->with(['details.product'])->first();

        return Inertia::render('keranjang', [
            'user' => $user,
            'cart' => $cart
        ]);
    })->name('keranjang');
    Route::get('invoice/{id}', function ($id) {
        $invoice = Invoice::with([
            'cart.user',
            'cart.details.product',
            'address'
        ])->findOrFail($id);

        $user = Auth::user();

        if ($invoice->cart->user_id !== $user->id) {
            abort(403, 'Unauthorized access to this invoice.');
        }

        return Inertia::render('invoice', [
            'invoice' => $invoice,
        ]);
    })->name('invoice');
    Route::get('riwayat', function () {
        return Inertia::render('riwayat', ['user' => Auth::user()]);
    })->name('riwayat');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
