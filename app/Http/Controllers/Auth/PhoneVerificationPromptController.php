<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class PhoneVerificationPromptController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('auth/verify-phone', [
            'phone' => request()->query('phone'),
            'name' => request()->query('name'),
            'remember' => request()->query('remember'),
        ]);
    }
}
