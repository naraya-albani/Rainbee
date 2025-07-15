<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\DetailCart;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CartController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
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
            $price = $product->price * $request->quantity;

            $cart = Cart::firstOrCreate(
                ['user_id' => $request->id],
                ['subtotal' => 0]
            );

            $detailCart = DetailCart::create([
                'cart_id'   => $cart->id,
                'product_id'=> $product->id,
                'quantity'  => $request->quantity,
                'price'     => $price,
            ]);

            $cart->subtotal += $price;
            $cart->save();

            DB::commit();

            return response()->json([
                'message' => 'Produk berhasil ditambahkan ke keranjang',
                'cart' => $cart,
                'detail_cart' => $detailCart,
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Gagal menambahkan produk ke keranjang',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $cart = Cart::where('user_id', $id)->with(['details.product'])->first();

        if (!$cart) {
            return response()->json([
                'message' => 'Cart not found',
            ], 404);
        }

        return response()->json([
            'cart_id' => $cart->id,
            'subtotal' => $cart->subtotal,
            'details' => $cart->details->map(function ($detail) {
                return [
                    'product_id' => $detail->product_id,
                    'product_name' => $detail->product->name,
                    'image' => $detail->product->image,
                    'size' => $detail->product->size,
                    'quantity' => $detail->quantity,
                    'price' => $detail->price,
                    'total' => $detail->price * $detail->quantity,
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
