<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome', ['user' => auth()->user()]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
    Route::get('produk', function () {
        return Inertia::render('addproduk');
    })->name('produk');
    Route::get('laporan', function () {
        return Inertia::render('Report');
    })->name('laporan');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/keranjang', function () {
        return Inertia::render('keranjang');
    })->name('keranjang');
});



require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
