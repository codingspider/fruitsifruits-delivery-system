<?php

namespace App\Http\Controllers\API;

use Carbon\Carbon;
use App\Models\Transaction;
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

            $transactions = Transaction::withSum([
                'sell_lines as total_remaining' => function ($query) {
                    $query->where('remaining', '>', 0);
                }
            ], 'remaining')
            ->where('transaction_type', 'sell')
            ->having('total_remaining', '>', 0)
            ->orderByDesc('total_remaining')
            ->get();

            $total = $transactions->sum('total_remaining');
            $data['total_collection'] = Transaction::where('transaction_type', 'sell')->where('status', '=', 'paid')->sum('total_amount');
            $data['monthly_production'] = $monthly_production;
            $data['total_delivered'] = $total;
            
            return $this->sendResponse($data, 'Data retrieved successfully.');
        } catch (\Exception $e) {
            return $this->sendError('Server Error: '.$e->getMessage());
        }
    }

    public function getSellByDate(Request $request)
    {
        try {
            // Optional date range filter
            $startDate = $request->start_date ?? now()->subDays(31)->toDateString();
            $endDate = $request->end_date ?? now()->toDateString();

            $transactions = Transaction::where('transaction_type', 'sell')
                ->whereBetween('created_at', [$startDate, $endDate])
                ->selectRaw('DATE(created_at) as date, COUNT(id) as count')
                ->groupByRaw('DATE(created_at)')
                ->orderBy('date', 'asc')
                ->get();

            // Format to match frontend expectation
            $data = $transactions->map(function ($item) {
                return [
                    'date' => $item->date,
                    'count' => (int) $item->count,
                ];
            });

            return $this->sendResponse($data, 'Data retrieved successfully.');
        } catch (\Exception $e) {
            return $this->sendError('Server Error: '.$e->getMessage());
        }
    }

    public function totalSellByDate(Request $request)
    {
        try {
            // Optional date range from request
            $startDate = $request->start_date ?? now()->subDays(31)->toDateString();
            $endDate = $request->end_date ?? now()->toDateString();

            // Group sells by date and count
            $transactions = Transaction::where('transaction_type', 'sell')
                ->whereBetween('created_at', [$startDate, $endDate])
                ->selectRaw('DATE(created_at) as date, SUM(total_amount) as count')
                ->groupByRaw('DATE(created_at)')
                ->orderBy('date', 'asc')
                ->get();

            // Return the chart data
            return $this->sendResponse($transactions, 'Data retrieved successfully.');

        } catch (\Exception $e) {
            return $this->sendError('Server Error: '.$e->getMessage());
        }
    }
    
    public function getRecentProduction(Request $request)
    {
        try {
            $transactions = MfgProduction::latest()->get();
            return $this->sendResponse($transactions, 'Data retrieved successfully.');
        } catch (\Exception $e) {
            return $this->sendError('Server Error: '.$e->getMessage());
        }
    }
    
    public function getRecentPayments(Request $request)
    {
        try {
            $transactions = Transaction::where('status', 'paid')->latest()->get();
            return $this->sendResponse($transactions, 'Data retrieved successfully.');
        } catch (\Exception $e) {
            return $this->sendError('Server Error: '.$e->getMessage());
        }
    }

}
