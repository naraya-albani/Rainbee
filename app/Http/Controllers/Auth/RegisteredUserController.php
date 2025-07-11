<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Redis;
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
                'unique:users,phone',
                'regex:/^8\d{10,14}$/',
            ],
        ]);

        $phone = "62" . $request->phone;
        $otp = rand(1000, 9999);

        Cache::put('otp_' . $phone, $otp, now()->addMinutes(5));

        $response = Http::withHeaders([
            'Authorization' => env('TOKEN_FONNTE'),
        ])->post('https://api.fonnte.com/send', [
            'target' => $phone,
            'message' => '*' . $otp . '* adalah kode verifikasi Anda. Jangan berikan kode ini kepada siapa pun.',
        ]);

        logger($response->json());

        session([
            'register_name' => $request->name,
            'register_phone' => $phone,
        ]);

        return redirect()->route('verification');
    }
}
