<?php

namespace App\Http\Controllers\API;

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

            $query = MfgProduction::query()
                ->with([
                    'location:id,name',
                    'product',
                    'items',
                    'items.flavour:id,name,price,batch_yield,batch_ingredient_cost',
                ]);

            // Filters
            if ($request->start_date && $request->end_date) {
                $query->whereBetween('created_at', [
                    $request->start_date,
                    $request->end_date
                ]);
            }

            if ($request->location_id) {
                $query->where('location_id', $request->location_id);
            }

            $result = $query->get();

            // STEP 1 — Flatten rows
            $rows = $result->flatMap(function ($production) {

                return $production->items->map(function ($line) use ($production) {

                    $flavour = $line->flavour;

                    // Bottle cost calculation
                    $batchYield = $flavour->batch_yield ?? 0;
                    $costPerBottle  = $flavour->batch_ingredient_cost ?? 0;

                    $pricePerUnit = $flavour->price ?? 0;
                    $quantity     = $line->quantity;
                    $netPrice = $pricePerUnit - $costPerBottle;
                    $profit = $netPrice * $quantity;

                    return [
                        'flavor'          => $flavour->name,
                        'product'         => optional($production->product)->name,
                        'total_quantity'  => $quantity,
                        'price_per_unit'  => $pricePerUnit,
                        'cost_per_bottle' => $costPerBottle,
                        'net_price'       => $netPrice,
                        'total_profit'    => $profit,
                    ];
                });
            });

            // STEP 2 — GROUP by flavor
            $final = $rows->groupBy('flavor')->map(function ($group) {

                return [
                    'flavor'          => $group->first()['flavor'],
                    'total_quantity'  => $group->sum('total_quantity'),
                    'price_per_unit'  => $group->first()['price_per_unit'],
                    'cost_per_bottle' => $group->first()['cost_per_bottle'],
                    'net_price'       => $group->first()['net_price'],
                    'total_profit'    => $group->sum('total_profit'),
                ];
            })->values();


            return $this->sendResponse($final, 'Report retrieved successfully.');

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


}
