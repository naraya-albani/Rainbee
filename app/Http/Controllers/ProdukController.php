<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class ProdukController extends Controller
{
    public function index()
    {
        return response()->json(Product::all());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'size' => 'required|integer',
            'price' => 'required|numeric',
            'stock' => 'required|integer',
            'image' => 'nullable|image|max:2048',
        ]);

        try {
            if ($request->hasFile('image')) {
                $path = $request->file('image')->store('produk', 'public');
                $validated['image'] = $path;
            }

            $product = Product::create($validated);

            return response()->json([
                'message' => 'Produk berhasil ditambahkan',
                'data' => $product
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Gagal menambahkan produk',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */

    public function update(Request $request, string $id)
    {
        $product = Product::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'size' => 'sometimes|required|integer',
            'price' => 'sometimes|required|numeric',
            'stock' => 'sometimes|required|integer',
            'image' => 'nullable|image|max:2048',
        ]);

        try {
            if ($request->has('remove_image') && $request->remove_image == '1') {
                if ($product->image) {
                    \Storage::disk('public')->delete($product->image);
                    $product->image = null;
                }
            }

            if ($request->hasFile('image')) {

                if ($product->image) {
                    \Storage::disk('public')->delete($product->image);
                }
                $path = $request->file('image')->store('produk', 'public');
                $validated['image'] = $path;
            }

            $product->update($validated);

            return response()->json([
                'message' => 'Produk berhasil diupdate',
                'data' => $product
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Gagal update produk',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy(string $id)
    {
        $product = Product::findOrFail($id);

        try {

            if ($product->image) {
                \Storage::disk('public')->delete($product->image);
            }
            $product->delete();

            return response()->json([
                'message' => 'Produk berhasil dihapus'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Gagal menghapus produk',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
