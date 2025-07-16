<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Show the registration page.
     */
    public function create(): Response
    {
        return Inertia::render('auth/register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'phone' => [
                'required',
                'string',
                'max:15',
                'regex:/^8\d{10,14}$/',
            ],
        ]);

        if (User::where('phone', '62' . $request->phone)->exists()) {
            return back()->withErrors(['phone' => 'Nomor telepon sudah terdaftar.']);
        }

        $phone = "62" . $request->phone;

        if (User::where('phone', $phone)->exists()) {
            return redirect()->back()->withErrors(['phone' => 'Nomor telepon sudah terdaftar.']);
        }

        $otp = rand(1000, 9999);

        try {
            Cache::put('otp_' . $phone, $otp, now()->addMinutes(5));

            $response = Http::withHeaders([
                'Authorization' => env('TOKEN_FONNTE'),
            ])->post('https://api.fonnte.com/send', [
                'target' => $phone,
                'message' => '*' . $otp . '* adalah kode verifikasi Anda. Jangan berikan kode ini kepada siapa pun.',
            ]);

            logger($response->json());

            return redirect()->route('verification', ['name' => $request->name, 'phone' => $phone]);
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['otp' => 'Terjadi kesalahan']);
        }
    }
}
