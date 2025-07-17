<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\DetailCart;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CartController extends Controller
{
    public function store(Request $request)
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
                return response()->json([
                    'message' => 'Jumlah yang diminta melebihi stok yang tersedia',
                    'available_stock' => $product->stock - $existingQuantity,
                ], 422);
            }

            $price = $product->price * $request->quantity;

            if ($existingDetail) {
                $existingDetail->quantity += $request->quantity;
                $existingDetail->price += $price;
                $existingDetail->save();
            } else {
                $existingDetail = DetailCart::create([
                    'cart_id'    => $cart->id,
                    'product_id' => $product->id,
                    'quantity'   => $request->quantity,
                    'price'      => $price,
                ]);
            }

            $cart->subtotal += $price;
            $cart->save();

            DB::commit();

            return response()->json([
                'message' => 'Produk berhasil ditambahkan ke keranjang',
                'cart' => $cart,
                'detail_cart' => $existingDetail,
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Gagal menambahkan produk ke keranjang',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
