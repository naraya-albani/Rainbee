<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Address;
use App\Models\Invoice;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PurchaseController extends Controller
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

            DB::commit();

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
        //
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
