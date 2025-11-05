<?php

namespace App\Http\Controllers\API;

use Carbon\Carbon;
use Illuminate\Http\Request;
use App\Models\MfgProduction;
use App\Http\Controllers\Controller;
use App\Http\Controllers\API\BaseController;

class AdminDashboardController extends BaseController
{
    public function getStats(Request $request)
    {
        try {
            $data = [];

            $monthly_production = MfgProduction::whereMonth('mfg_date', Carbon::now()->month)
            ->whereYear('mfg_date', Carbon::now()->year)
            ->sum('quantity');

            $data['monthly_production'] = $monthly_production;
            
            return $this->sendResponse($data, 'Data retrieved successfully.');
        } catch (\Exception $e) {
            return $this->sendError('Server Error: '.$e->getMessage());
        }
    }
}
