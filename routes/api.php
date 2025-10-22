<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\PLanController;
use App\Http\Controllers\API\UserController;
use App\Http\Controllers\API\FlavourController;
use App\Http\Controllers\API\ProductController;
use App\Http\Controllers\API\LocationController;
use App\Http\Controllers\API\PurchaseController;
use App\Http\Controllers\API\RegisterController;
use App\Http\Controllers\API\IngredientController;
use App\Http\Controllers\API\DriverRouteController;
use App\Http\Controllers\API\BottleManageController;
use App\Http\Controllers\API\DriverManageController;
use App\Http\Controllers\API\DriverJuiceAllocationController;


Route::controller(RegisterController::class)->group(function(){
    Route::post('register', 'register');
    Route::post('login', 'login');
    Route::post('forgot-password', 'forgotPassword');
    Route::post('reset-password', 'resetPassword');
});

Route::middleware(['auth:sanctum'])->prefix('superadmin')->group(function () {
    // Add more super admin routes here
    Route::apiResource('plans', PLanController::class);
    Route::apiResource('users', UserController::class);
    Route::apiResource('products', ProductController::class);
    Route::apiResource('bottles', BottleManageController::class);
    Route::apiResource('drivers', DriverManageController::class);
    Route::apiResource('flavours', FlavourController ::class);
    Route::apiResource('purchases', PurchaseController::class);
    Route::apiResource('locations', LocationController::class);
    Route::apiResource('driver/routes', DriverRouteController::class);
    Route::apiResource('driver/juice/allocations', DriverJuiceAllocationController::class);

    Route::get('products/{product}/edit', [ProductController::class, 'edit']);
    Route::get('flavours/{flavour}/edit', [FlavourController::class, 'edit']);
    Route::get('get/products', [ProductController::class, 'getProducts']);
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