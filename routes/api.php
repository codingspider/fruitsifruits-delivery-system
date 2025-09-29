<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\PLanController;
use App\Http\Controllers\API\UserController;
use App\Http\Controllers\API\RegisterController;


Route::controller(RegisterController::class)->group(function(){
    Route::post('register', 'register');
    Route::post('login', 'login');
    Route::post('forgot-password', 'forgotPassword');
    Route::post('reset-password', 'resetPassword');
});

Route::middleware(['auth:sanctum'])->prefix('superadmin')->group(function () {
    // Add more super admin routes here
    Route::get('users', [UserController::class, 'index']);
    Route::post('user/store', [UserController::class, 'store']);
    Route::resource('plans', PLanController::class);
});


Route::get('/translations', function (\Illuminate\Http\Request $request) {
    $locale = $request->query('lang', config('app.locale'));

    $supported = ['en', 'bn'];
    if (!in_array($locale, $supported)) {
        $locale = config('app.fallback_locale');
    }

    App::setLocale($locale);

    $translations = trans('message');

    return response()->json([
        'lang' => $locale,
        'messages' => $translations
    ]);
});