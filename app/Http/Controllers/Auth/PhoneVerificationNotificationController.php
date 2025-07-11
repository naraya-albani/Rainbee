<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;

class PhoneVerificationNotificationController extends Controller
{
    /**
     * Send a new email verification notification.
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'otp' => 'required|string|max:4|regex:/^\d{4}$/',
        ]);

        if (!session()->has(['register_name', 'register_phone'])) {
            return redirect()->route('register')->withErrors(['otp' => 'Sesi Anda telah habis. Silakan daftar ulang.']);
        }

        $cachedOtp = Cache::get('otp_' . session('register_phone'));

        if (!$cachedOtp || $request->otp !== (string) $cachedOtp) {
            return back()->withErrors(['otp' => 'Kode OTP tidak sesuai atau sudah kadaluarsa.']);
        }

        Cache::forget('otp_' . session('register_phone'));

        $user = User::create([
            'name' => session('register_name'),
            'phone' => session('register_phone'),
        ]);
        
        session()->forget(['register_name', 'register_phone']);

        event(new Registered($user));

        Auth::login($user);

        return redirect()->intended(route('dashboard', absolute: false));
    }
}
