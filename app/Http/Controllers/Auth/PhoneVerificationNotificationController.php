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

        $cachedOtp = Cache::get('otp_' . $request->input('phone'));

        $name = $request->input('name');

        if (!$cachedOtp || $request->otp !== (string) $cachedOtp) {
            return back()->withErrors(['otp' => 'Kode OTP tidak sesuai atau sudah kedaluarsa.']);
        }

        Cache::forget('otp_' . $request->input('phone'));

        if ($name) {
            $user = User::create([
                'name' => $request->input('name'),
                'phone' => $request->input('phone'),
            ]);

            event(new Registered($user));

            Auth::login($user);

            return redirect()->intended(route('dashboard', absolute: false));
        } else if (!$name) {
            $user = User::where('phone', $request->input('phone'))->first();

            if (!$user) {
                return redirect()->back()->withErrors(['phone' => 'Pengguna tidak ditemukan.']);
            }

            Auth::login($user);

            $request->session()->regenerate();

            return redirect()->intended(route('dashboard', absolute: false));
        } else {
            return redirect()->back()->withErrors(['otp' => 'Informasi yang diperlukan tidak lengkap.']);
        }
    }
}
