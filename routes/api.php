<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\API\PLanController;
use App\Http\Controllers\API\UserController;
use App\Http\Controllers\API\RecipeController;
use App\Http\Controllers\API\ReportController;
use App\Http\Controllers\API\FlavourController;
use App\Http\Controllers\API\ProductController;
use App\Http\Controllers\API\BusinessController;
use App\Http\Controllers\API\LocationController;
use App\Http\Controllers\API\PurchaseController;
use App\Http\Controllers\API\RegisterController;
use App\Http\Controllers\API\JpsReportController;
use App\Http\Controllers\API\AssignTaskController;
use App\Http\Controllers\API\IngredientController;
use App\Http\Controllers\API\ProductionController;
use App\Http\Controllers\API\DriverRouteController;
use App\Http\Controllers\API\BottleManageController;
use App\Http\Controllers\API\DriverManageController;
use App\Http\Controllers\API\DriverProfileController;
use App\Http\Controllers\API\AdminDashboardController;
use App\Http\Controllers\API\DriverJuiceAllocationController;


Route::controller(RegisterController::class)->group(function(){
    Route::post('register', 'register');
    Route::post('login', 'login');
    Route::post('forgot-password', 'forgotPassword');
    Route::post('reset-password', 'resetPassword');
});

Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('logout', [RegisterController::class, 'logout']);
});

Route::middleware(['auth:sanctum'])->prefix('driver')->group(function () {
    Route::get('assign/tasks', [AssignTaskController::class, 'index']);
    Route::get('location/products/details/{id}', [AssignTaskController::class, 'locationProductDetails']);
    Route::post('save/sell/data', [AssignTaskController::class, 'store']);
    Route::get('allocated/juice', [AssignTaskController::class, 'driverJuiceAllocation']);
    Route::post('return/leftover', [AssignTaskController::class, 'returnLeftover']);
    Route::get('profile/data', [DriverProfileController::class, 'profileData']);
    Route::post('profile/update', [DriverProfileController::class, 'profileDataUpdate']);
    Route::post('daily/collection', [DriverProfileController::class, 'dailyCollection']);
    Route::get('get/stats', [DriverProfileController::class, 'getStats']);
    Route::get('get/previous/due', [DriverProfileController::class, 'getPreviousDue']);
    Route::get('get/reports', [DriverProfileController::class, 'getReports']);
    Route::post('make/payment', [DriverProfileController::class, 'makePayment']);
});

Route::middleware(['auth:sanctum'])->prefix('jps')->group(function () {
    Route::get('assign/tasks', [AssignTaskController::class, 'index']);
    Route::post('get/reports', [JpsReportController::class, 'getReport']);
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
    Route::apiResource('recipes', RecipeController::class);
    Route::apiResource('productions', ProductionController::class);

    Route::post('get/profit/report', [ReportController::class, 'profitReport']);
    
    Route::get('products/{product}/edit', [ProductController::class, 'edit']);
    Route::get('flavours/{flavour}/edit', [FlavourController::class, 'edit']);

    Route::get('get/products', [ProductController::class, 'getProducts']);
    Route::get('get/ingredients', [ProductController::class, 'getIngredients']);
    Route::get('get/bottles', [ProductController::class, 'getBottles']);

    Route::get('get/finished/goods', [ProductController::class, 'finishGoods']);

    Route::post('save/business/setting', [BusinessController::class, 'store']);
    Route::get('get/business/data', [BusinessController::class, 'index']);
    Route::get('login-history', [BusinessController::class, 'loginHistory']);
    Route::get('get/timezone', [BusinessController::class, 'timezone']);
    
    Route::post('get/delivery/summery/report', [ReportController::class, 'deliverySummeryReport']);

    Route::get('get/stats', [AdminDashboardController::class, 'getStats']);
    Route::get('get/sells/by/date', [AdminDashboardController::class, 'getSellByDate']);
    Route::get('total-sell-by-date', [AdminDashboardController::class, 'totalSellByDate']);
    Route::get('get/recent/productions', [AdminDashboardController::class, 'getRecentProduction']);
    Route::get('get/recent/payments', [AdminDashboardController::class, 'getRecentPayments']);

    Route::get('/backup-and-download', function () {
        Artisan::call('backup:run');
        $files = Storage::files('private/Laravel');
        $latestFile = collect($files)->sortDesc()->first();
        return Storage::download($latestFile);
    });
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