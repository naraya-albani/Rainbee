<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\DetailCart;
use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CartController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'id' => 'required|exists:users,id',
            'product_id' => 'required|exists:products,id',
            'quantity'   => 'required|integer|min:1',
        ]);

        DB::beginTransaction();

        try {
            $product = Product::findOrFail($request->product_id);
            $cart = Cart::where('user_id', $request->id)
                    ->where('is_active', true)
                    ->first();

            if (!$cart) {
                $cart = Cart::create([
                    'user_id' => $request->id,
                    'subtotal' => 0,
                    'is_active' => true
                ]);
            }

            $existingDetail = DetailCart::where('cart_id', $cart->id)
                ->where('product_id', $product->id)
                ->first();

            $existingQuantity = $existingDetail ? $existingDetail->quantity : 0;
            $totalQuantity = $existingQuantity + $request->quantity;

            if ($totalQuantity > $product->stock) {
                return redirect()->back()->withErrors([
                    'quantity' => 'Jumlah melebihi stok tersedia. Tersisa ' . ($product->stock - $existingQuantity)
                ]);
            }

            if ($existingDetail) {
                $existingDetail->update([
                    'quantity' => $totalQuantity,
                ]);
            } else {
                DetailCart::create([
                    'cart_id'    => $cart->id,
                    'product_id' => $product->id,
                    'quantity'   => $request->quantity,
                ]);
            }

            DB::commit();

            return redirect()->back()->with('success', 'Produk berhasil ditambahkan ke keranjang!');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Gagal menambahkan produk ke keranjang');
        }
    }

    public function destroy($id): RedirectResponse
    {
        $detail = DetailCart::findOrFail($id);

        try {
            $detail->delete();

            return redirect()->back()->with('success', 'Produk berhasil dihapus dari keranjang.');
        } catch (\Exception $e) {
            DB::rollBack();

            return redirect()->back()->withErrors('error', 'Gagal menghapus produk dari keranjang.');
        }
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        $detail = DetailCart::findOrFail($id);
        $detail->quantity = $request->quantity;
        $detail->save();

        return back(); // atau response khusus jika kamu pakai API
    }
}
