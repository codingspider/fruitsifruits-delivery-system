<?php

namespace App\Http\Middleware;

use Closure;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Config;

class SetUserTimezone
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next)
    {
        $business = Setting::first();
        Config::set('app.timezone', $business->timezone);
        date_default_timezone_set($business->timezone);
        return $next($request);
    }
}
