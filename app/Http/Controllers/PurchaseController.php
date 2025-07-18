<?php

namespace App\Http\Controllers;

use App\Models\Address;
use App\Models\Cart;
use App\Models\DetailCart;
use App\Models\Invoice;
use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class PurchaseController extends Controller
{


    public function index()
    {
        $invoices = Invoice::with([
            'cart.user', // Tambahkan relasi user dari cart
            'cart.detailCarts.product', // Ambil produk dari detail cart
            'address'
        ])->latest()->get();

        return inertia('Invoice/Index', [
            'invoices' => $invoices,
        ]);
    }
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'phone' => 'required|string|max:15|exists:users,phone',
            'cart_id' => 'required|exists:carts,id',
            'total' => 'required|numeric|min:0',
            'address.address_line' => 'required|string|max:255',
            'address.district' => 'required|string|max:255',
            'address.city' => 'required|string|max:255',
            'address.state' => 'required|string|max:255',
            'address.postal_code' => 'required|string|max:5',
            'address.phone_number' => 'required|string|max:15',
        ]);

        DB::beginTransaction();

        try {
            $address = Address::create([
                'address_line' => $request->address['address_line'],
                'district' => $request->address['district'],
                'city' => $request->address['city'],
                'state' => $request->address['state'],
                'postal_code' => $request->address['postal_code'],
                'phone_number' => $request->address['phone_number'],
            ]);

            $timestamp = now()->format('YmdHis');
            $invoiceId = 'INV' . $timestamp . $request->cart_id;

            $invoice = Invoice::create([
                'id' => $invoiceId,
                'cart_id' => $request->cart_id,
                'total' => $request->total,
                'address_id' => $address->id,
            ]);

            // Ambil semua item dari keranjang
            $items = DetailCart::where('cart_id', $request->cart_id)->get();

            $produkList = "*🛒 Rincian Produk:*\n";
            foreach ($items as $item) {
                $product = Product::find($item->product_id);

                if ($product) {
                    if ($product->stock < $item->quantity) {
                        throw new \Exception("Stok produk '{$product->name}' tidak mencukupi.");
                    }

                    // Tambahkan ke pesan produk
                    $produkList .= "- {$product->name} ({$item->quantity}x) @ Rp" . number_format($product->price, 0, ',', '.') . "\n";
                }
            }

            // Nonaktifkan keranjang
            Cart::where('id', $request->cart_id)->update(['is_active' => false]);

            DB::commit();

            $message = "*🧾 Invoice Pemesanan*\n\n"
                . "*ID Invoice:* {$invoiceId}\n"
                . "*Total:* Rp" . number_format($invoice->total, 0, ',', '.') . "\n\n"
                . $produkList . "\n"
                . "*Alamat Pengiriman:*\n"
                . "{$address->address_line}, {$address->district}, {$address->city}, {$address->state} {$address->postal_code}\n"
                . "*No. Telepon:* +{$address->phone_number}\n\n"
                . "✅ Pesanan Anda telah berhasil dibuat. Silakan lakukan pembayaran sesuai dengan instruksi berikut:\n\n"
                . "*Metode Pembayaran:* Transfer Bank\n"
                . "*Bank:* BCA\n"
                . "*No. Rekening:* 1234567890\n"
                . "*Atas Nama:* PT Contoh Online\n\n"
                . "Mohon konfirmasi setelah melakukan pembayaran.\n"
                . "Terima kasih telah berbelanja di *Rainbee*!";

            Http::withHeaders([
                'Authorization' => env('TOKEN_FONNTE'),
            ])->post('https://api.fonnte.com/send', [
                        'target' => $request->phone,
                        'message' => $message,
                    ]);

            return redirect()->intended(route('invoice', ['id' => $invoiceId], absolute: false));
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->withErrors(['imvoice' => 'Terjadi kesalahan: ' . $e]);
        }
    }

    public function update(Request $request, $id)
    {
        Log::info('File uploaded?', [$request->hasFile('receipt')]);
        Log::info('All request:', $request->all());

        $request->validate([
            'receipt' => 'nullable|image|max:2048',
            'status' => 'nullable|string|in:waiting,approved,rejected,sending,claimed',
        ]);

        $invoice = Invoice::findOrFail($id);

        // Jika ada file receipt yang diunggah
        if ($request->hasFile('receipt')) {
            // Hapus file lama jika ada
            if ($invoice->receipt && Storage::exists($invoice->receipt)) {
                Storage::delete($invoice->receipt);
            }

            // Simpan file baru
            $path = $request->file('receipt')->store('receipts', 'public');

            // Update receipt
            $invoice->receipt = $path;

            // Set status ke 'waiting' (mengoverride status manual jika ada)
            $invoice->status = 'waiting';
        } elseif ($request->filled('status')) {
            // Kalau hanya update status (dan tidak upload receipt)
            $invoice->status = $request->input('status');
        }

        $invoice->save();
    }
}
