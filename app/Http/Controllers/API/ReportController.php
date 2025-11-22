<?php

namespace App\Http\Controllers\API;

use App\Models\Setting;
use App\Models\Location;
use App\Models\Transaction;
use Illuminate\Http\Request;
use App\Models\MfgProduction;
use App\Http\Controllers\Controller;
use App\Http\Controllers\API\BaseController;

class ReportController extends BaseController
{
    public function profitReport(Request $request)
    {
        try {

            $startDate = $request->start_date;
            $endDate = $request->end_date;

            $locations = Location::with('location_flavours', 'location_flavours.flavour')->latest()->get();

            foreach ($locations as $location) {
                $location->total_tax = getTaxByLocation(
                    $location->id,
                    $startDate,
                    $endDate
                );

                foreach ($location->location_flavours as $lf) {
                    $lf->sold_qty = getSoldQtyByLocation(
                        $location->id,
                        $lf->flavour_id,
                        $startDate,
                        $endDate
                    );
                    
                }
            }
            
            return $this->sendResponse($locations, 'Report retrieved successfully.');

        } catch (\Exception $e) {
            return $this->sendError('Server Error: ' . $e->getMessage());
        }
    }
    
    public function getReturnReport(Request $request)
    {
        try {

            $startDate = $request->start_date;
            $endDate   = $request->end_date;
            $query = Transaction::with([
                'location',
                'sell_returns',
                'sell_returns.flavor',
                'sell_returns.bottle'
            ]);

            $query->whereHas('sell_returns');

            $role = auth()->user()->role;
            if($role == 'dirver'){
                $query->where('created_by', auth()->user()->id);
            }

            if ($startDate) {
                $query->whereDate('created_at', '>=', $startDate);
            }

            if ($endDate) {
                $query->whereDate('created_at', '<=', $endDate);
            }

            if($request->location_id){
                $query->where('location_id', $request->location_id);
            }

            $transactions = $query->groupBy('location_id')->get();

            foreach ($transactions as $transaction) {
                foreach ($transaction->sell_returns as $sr) {
                    $sr->return_qty = getReturnQuantity(
                        $sr->flavour_id,
                        $startDate,
                        $endDate
                    );
                }
            }

            
            return $this->sendResponse($transactions, 'Report retrieved successfully.');

        } catch (\Exception $e) {
            return $this->sendError('Server Error: ' . $e->getMessage());
        }
    }

    public function deliverySummeryReport(Request $request)
    {
        try {
            $query = Transaction::query()
                ->with([
                    'sell',
                    'location:id,name',
                    'sell_lines.product:id,cost_price',
                    'sell_lines.bottle:id,cost_price',
                    'sell_lines.flavor:id,name',
                    'created_by_user:id,name'
                ])
                ->where('transaction_type', 'sell');

            // ✅ Filters
            if ($request->start_date && $request->end_date) {
                $query->whereBetween('created_at', [$request->start_date, $request->end_date]);
            }

            if ($request->location_id) {
                $query->where('location_id', $request->location_id);
            }

            // ✅ Fetch transactions
            $transactions = $query->get();

            // ✅ Group by driver (created_by)
            $grouped = $transactions->groupBy('created_by')->map(function ($driverTrans) {
                $driverName = optional($driverTrans->first()->created_by_user)->name ?? 'Unknown';
                $locationName = optional($driverTrans->first()->location)->name ?? 'N/A';

                $totalDeliveries = $driverTrans->count();

                $totalQty = $driverTrans->sum(function ($t) {
                    return $t->sell_lines->sum('to_be_filled');
                });

                $paidDeliveries = $driverTrans->filter(fn($t) => $t->sell && $t->sell->paid == 1)->count();
                $unpaidDeliveries = $driverTrans->filter(fn($t) => $t->sell && $t->sell->paid != 1)->count();

                $lastDeliveryDate = optional($driverTrans->sortByDesc('created_at')->first())->created_at;

                return [
                    'driver_name' => $driverName,
                    'location_name' => $locationName,
                    'total_deliveries' => $totalDeliveries,
                    'total_quantity' => $totalQty,
                    'paid_deliveries' => $paidDeliveries,
                    'unpaid_deliveries' => $unpaidDeliveries,
                    'last_delivery_date' => $lastDeliveryDate,
                ];
            })->values();

            return $this->sendResponse($grouped, 'Report retrieved successfully.');
        } catch (\Exception $e) {
            return $this->sendError('Server Error: ' . $e->getMessage());
        }
    }

    public function getSellReport(Request $request){
        try {

            $startDate = $request->start_date;
            $endDate = $request->end_date;

            $query = Transaction::query()->with('sell', 'location');
            if ($request->start_date && $request->end_date) {
                $query->whereBetween('created_at', [$request->start_date, $request->end_date]);
            }

            if ($request->location_id) {
                $query->where('location_id', $request->location_id);
            }

            // ✅ Fetch transactions
            $transactions = $query->get();
            
            return $this->sendResponse($transactions ?? [], 'Report retrieved successfully.');

        } catch (\Exception $e) {
            return $this->sendError('Server Error: ' . $e->getMessage());
        }
    }
    
    public function getSellDetail($id){
        try {
            $user = auth()->user();

            // Base query
            $query = Transaction::with([
                'sell',
                'location',
                'sell_lines',
                'sell_lines.product',
                'sell_lines.flavor',
                'sell_lines.bottle'
            ])->where('id', $id);

            // Restrict for driver role
            if ($user->role === 'driver') {
                $query->where('created_by', $user->id);
            }

            // Fetch transaction
            $transaction = $query->firstOrFail();

            // Attach settings safely
            $transaction->setting = Setting::latest()->first();

            return $this->sendResponse($transaction, 'Report retrieved successfully.');

        } catch (\Exception $e) {
            return $this->sendError('Server Error: ' . $e->getMessage());
        }
    }


}
