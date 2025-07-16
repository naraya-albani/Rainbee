<?php

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome', ['user' => Auth::user()]);
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
        return Inertia::render('keranjang', ['user' => Auth::user()]);
    })->name('keranjang');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
