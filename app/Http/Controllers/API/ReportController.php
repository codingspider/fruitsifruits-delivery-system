<?php

namespace App\Http\Controllers\API;

use App\Models\Transaction;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Controllers\API\BaseController;

class ReportController extends BaseController
{
    public function profitReport(Request $request)
    {
        try {
            $query = Transaction::query()
                ->with([
                    'location:id,name',
                    'sell_lines.product:id,cost_price',
                    'sell_lines.bottle:id,cost_price',
                    'sell_lines.flavor:id,name',
                ]);

            // ✅ Filters
            if ($request->start_date && $request->end_date) {
                $query->whereDate('created_at', '>=', $request->start_date)->whereDate('created_at', '<=', $request->end_date);
            }

            if ($request->location_id) {
                $query->where('location_id', $request->location_id);
            }

            // ✅ Build report
            $data = $query->get()
                ->flatMap(function ($transaction) {
                    return $transaction->sell_lines->map(function ($line) use ($transaction) {
                        $price_per_unit = optional($line->product)->cost_price ?? 0;
                        $cost_per_bottle = optional($line->bottle)->cost_price ?? 0;
                        $net_price = $price_per_unit - $cost_per_bottle;
                        $quantity = $line->remaining ?? 0;
                        $deal_quantity = $line->deal_quantity ?? 0;
                        $deal_cost = $deal_quantity * $quantity;

                        return [
                            'location' => optional($transaction->location)->name ?? 'N/A',
                            'flavor' => optional($line->flavor)->name ?? 'N/A',
                            'total_quantity' => $quantity,
                            'price_per_unit' => round($price_per_unit, 2),
                            'cost_per_bottle' => round($cost_per_bottle, 2),
                            'net_price' => round($net_price, 2),
                            'deal_quantity' => $deal_quantity,
                            'deal_cost' => round($deal_cost, 2),
                            'total_profit' => round($net_price * $quantity, 2),
                        ];
                    });
                })
                ->filter();

            // ✅ Group by location, then flavor
            $grouped = $data
                ->groupBy('location')
                ->map(function ($items, $location) {
                    $flavorGroups = $items->groupBy('flavor')->map(function ($flavorItems, $flavor) {
                        return [
                            'flavor' => $flavor,
                            'total_quantity' => $flavorItems->sum('total_quantity'),
                            'price_per_unit' => round($flavorItems->avg('price_per_unit'), 2),
                            'cost_per_bottle' => round($flavorItems->avg('cost_per_bottle'), 2),
                            'net_price' => round($flavorItems->avg('net_price'), 2),
                            'deal_quantity' => $flavorItems->sum('deal_quantity'),
                            'deal_cost' => round($flavorItems->sum('deal_cost'), 2),
                            'total_profit' => round($flavorItems->sum('total_profit'), 2),
                        ];
                    });

                    return [
                        'location' => $location,
                        'flavors' => $flavorGroups->values(),
                        'total_profit' => round($flavorGroups->sum('total_profit'), 2),
                    ];
                })
                ->values();

            return $this->sendResponse($grouped, 'Report retrieved successfully.');
        } catch (\Exception $e) {
            return $this->sendError('Server Error: ' . $e->getMessage());
        }
    }

}
