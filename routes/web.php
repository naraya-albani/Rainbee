<?php

use App\Http\Controllers\ProdukController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\PurchaseController;
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
    Route::middleware('checkrole:admin')->group(function () {
        Route::get('dashboard', fn() => inertia('dashboard'))->name('dashboard');
        Route::get('produk', fn() => inertia('addproduk'))->name('produk');
        Route::put('produk/{id}', [ProdukController::class, 'update'])->name('produk.update');
        Route::delete('produk/{id}', [ProdukController::class, 'destroy'])->name('produk.destroy');
        
        Route::get('laporan', function () {
            $invoices = Invoice::
                with([
                    'cart.user',
                    'cart.details.product',
                    'address',
                    'cart'
                ])
                ->get();
            return inertia('laporan', [
                'invoice' => $invoices,
            ]);
        })->name('laporan');
    });

    Route::middleware('checkrole:user')->group(function () {
        Route::get('keranjang', function () {
            $user = Auth::user();
            $cart = Cart::where('user_id', $user->id)
                ->where('is_active', true)
                ->with(['details.product'])
                ->first();

            if (!$cart) {
                $cart = (object) [
                    'id' => null,
                    'user_id' => $user->id,
                    'subtotal' => 0,
                    'is_active' => true,
                    'details' => []
                ];
            }

            return inertia('keranjang', [
                'cart' => $cart
            ]);
        })->name('keranjang');

        Route::post('keranjang', [CartController::class, 'store']);

        Route::delete('keranjang/detail/{id}', [CartController::class, 'destroy'])->name('keranjang.detail.destroy');

        Route::put('keranjang/detail/{id}', [CartController::class, 'update'])->name('keranjang.detail.update');

        Route::post('purchase', [PurchaseController::class, 'store'])->name('purchase.store');

        Route::post('feedback/{id}', [PurchaseController::class, 'feedback'])->name('feedback');

        Route::get('riwayat', function () {
            $user = Auth::user();

            $invoices = Invoice::whereHas('cart', function ($query) use ($user) {
                $query->where('user_id', $user->id);
            })
                ->with([
                    'cart.user',
                    'cart.details.product',
                    'address',
                    'cart'
                ])
                ->latest()
                ->get();

            return inertia('riwayat', [
                'invoices' => $invoices,
            ]);
        })->name('riwayat');

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

            return inertia('invoice', ['invoice' => $invoice]);
        })->name('invoice');
    });

    Route::middleware('checkrole:admin,user')->group(function () {
        Route::post('purchase/{id}', [PurchaseController::class, 'update'])->name('purchase.update');
    });
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
