<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;

class PhoneVerificationPromptController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('auth/verify-phone');
    }

    /**
     * Show the email verification prompt page.
     */
    // public function __invoke(Request $request): Response|RedirectResponse
    // {
    //     return $request->user()->hasVerifiedEmail()
    //                 ? redirect()->intended(route('dashboard', absolute: false))
    //                 : Inertia::render('auth/verify-email', ['status' => $request->session()->get('status')]);
    // }
}
