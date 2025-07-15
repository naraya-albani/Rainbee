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

        $name = $request->input('name');
        $phone = $request->input('phone');

        $cachedOtp = Cache::get('otp_' . $phone);

        if (!$cachedOtp || $request->otp !== (string) $cachedOtp) {
            return back()->withErrors(['otp' => 'Kode OTP tidak sesuai atau sudah kedaluarsa.']);
        }

        Cache::forget('otp_' . $phone);

        if ($name) {
            $user = User::create([
                'name' => $name,
                'phone' => $phone,
            ]);

            event(new Registered($user));

            Auth::login($user);
            $request->session()->regenerate();

            return redirect()->intended(route('home', absolute: false));
        }

        $user = User::where('phone', $phone)->first();

        if (!$user) {
            return back()->withErrors(['phone' => 'Pengguna tidak ditemukan.']);
        }

        Auth::login($user);
        $request->session()->regenerate();

        return redirect()->intended(route('home', absolute: false));
    }
}
