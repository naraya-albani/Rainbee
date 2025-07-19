<?php

namespace App\Observers;

use App\Models\Invoice;

class InvoiceObserver
{
    public function updating(Invoice $invoice)
    {
        // Cek apakah status berubah menjadi 'canceled'
        if (
            $invoice->isDirty('status') &&
            $invoice->status === 'canceled'
        ) {
            // Ambil semua item dari detail cart
            $cart = $invoice->cart; // pastikan relasi 'cart' di model Invoice
            if ($cart) {
                foreach ($cart->details as $detail) {
                    $product = $detail->product;
                    if ($product) {
                        $product->increment('stock', $detail->quantity);
                    }
                }
            }
        }
    }
    /**
     * Handle the Invoice "created" event.
     */
    public function created(Invoice $invoice): void
    {
        //
    }

    /**
     * Handle the Invoice "updated" event.
     */
    public function updated(Invoice $invoice): void
    {
        //
    }

    /**
     * Handle the Invoice "deleted" event.
     */
    public function deleted(Invoice $invoice): void
    {
        //
    }

    /**
     * Handle the Invoice "restored" event.
     */
    public function restored(Invoice $invoice): void
    {
        //
    }

    /**
     * Handle the Invoice "force deleted" event.
     */
    public function forceDeleted(Invoice $invoice): void
    {
        //
    }
}
