<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Address;
use App\Models\Cart;
use App\Models\DetailCart;
use App\Models\Invoice;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;

class PurchaseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(Invoice::all());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
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

                    // Kurangi stok
                    $product->stock -= $item->quantity;
                    $product->save();

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

            return response()->json([
                'message' => 'Invoice created successfully',
                'invoice' => $invoice,
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to create invoice',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        // Ambil data invoice lengkap
        $invoice = Invoice::with([
            'cart.user',
            'cart.details.product',
            'address'
        ])->findOrFail($id);

        // Format response
        return response()->json([
            'invoice' => [
                'id' => $invoice->id,
                'total' => $invoice->total,
                'status' => $invoice->status,
                'created_at' => $invoice->created_at,
            ],
            'user' => [
                'id' => $invoice->cart->user->id,
                'name' => $invoice->cart->user->name,
                'phone' => $invoice->cart->user->phone,
            ],
            'address' => $invoice->address,
            'cart_details' => $invoice->cart->details->map(function ($item) {
                return [
                    'product_name' => $item->product->name,
                    'quantity' => $item->quantity,
                    'price' => $item->price,
                    'subtotal' => $item->price * $item->quantity,
                ];
            }),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
