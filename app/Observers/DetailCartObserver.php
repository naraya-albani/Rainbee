<?php

namespace App\Observers;

use App\Models\Cart;
use App\Models\DetailCart;
use App\Models\Product;

class DetailCartObserver
{
    public function creating(DetailCart $detailCart)
    {
        $product = Product::find($detailCart->product_id);
        $detailCart->price = $product->price * $detailCart->quantity;

        // kurangi stok
        $product->decrement('stock', $detailCart->quantity);
    }

    public function updating(DetailCart $detailCart)
    {
        $product = Product::find($detailCart->product_id);

        // Atur ulang harga berdasarkan quantity baru
        $detailCart->price = $product->price * $detailCart->quantity;

        // Hitung selisih quantity dan update stok
        $originalQuantity = $detailCart->getOriginal('quantity');
        $diff = $detailCart->quantity - $originalQuantity;
        $product->decrement('stock', $diff);
    }

    public function deleting(DetailCart $detailCart)
    {
        // Kembalikan stok produk saat item dihapus
        $product = Product::find($detailCart->product_id);
        $product->increment('stock', $detailCart->quantity);
    }
    /**
     * Handle the DetailCart "created" event.
     */
    public function created(DetailCart $detailCart): void
    {
        $this->recalculateCartSubtotal($detailCart->cart_id);
    }

    /**
     * Handle the DetailCart "updated" event.
     */
    public function updated(DetailCart $detailCart): void
    {
        $originalQty = $detailCart->getOriginal('quantity');
        $newQty = $detailCart->quantity;
        $diff = $newQty - $originalQty;

        $this->recalculateCartSubtotal($detailCart->cart_id);
    }

    /**
     * Handle the DetailCart "deleted" event.
     */
    public function deleted(DetailCart $detailCart): void
    {
        $this->recalculateCartSubtotal($detailCart->cart_id);
    }

    /**
     * Handle the DetailCart "restored" event.
     */
    public function restored(DetailCart $detailCart): void
    {
        //
    }

    /**
     * Handle the DetailCart "force deleted" event.
     */
    public function forceDeleted(DetailCart $detailCart): void
    {
        //
    }

    protected function recalculateCartSubtotal(int $cartId)
    {
        $cart = Cart::with('details')->find($cartId);

        $subtotal = $cart->details->sum(fn($item) => $item->price);

        $cart->update(['subtotal' => $subtotal]);
    }
}
