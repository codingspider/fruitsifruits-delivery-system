<?php

namespace App\Listeners;

use Illuminate\Auth\Events\Login;
use App\Models\LoginHistory;
use Jenssegers\Agent\Agent;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;

class LogSuccessfulLogin
{
    public function handle(Login $event): void
    {
        $agent = new Agent();

        LoginHistory::create([
            'user_id'    => $event->user->id,
            'ip_address' => request()->ip(),
            'browser'    => $agent->browser(),
            'device'     => $agent->device(),
            'os'         => $agent->platform(),
            'logged_in_at' => now(),
        ]);
    }
}
