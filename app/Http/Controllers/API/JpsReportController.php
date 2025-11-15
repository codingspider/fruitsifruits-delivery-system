<?php

namespace App\Http\Controllers\API;

use Carbon\Carbon;
use Illuminate\Http\Request;
use App\Models\MfgProduction;
use App\Models\MfgProductionItem;
use App\Models\MfgRecipeIngredient;
use App\Http\Controllers\Controller;
use App\Http\Controllers\API\BaseController;

class JpsReportController extends BaseController
{
    public function getReport(Request $request)
    {
        try {
            $startDate = $request->start_date;
            $endDate = $request->end_date;
            $query = MfgProductionItem::query()->with('flavour', 'bottle');

            if($startDate && $endDate){
                $query->whereDate('created_at', '>=', $startDate)->whereDate('created_at', '<=', $endDate);
            }else{
                $query->whereDate('created_at', '=', Carbon::today());
            }
            $data = $query->get();


            $response = $data->map(function ($item) use ($request, $startDate, $endDate) {
                $allocatedQty = getAllocated($startDate, $endDate, $item->flavour_id, $item->bottle_id);
                $deliveredQty = getDelivered($startDate, $endDate, $item->flavour_id, $item->bottle_id);
                $returnedQty = getReturned($startDate, $endDate, $item->flavour_id, $item->bottle_id);

                $remaining = $item->quantity - $allocatedQty + ($allocatedQty - $deliveredQty) + $returnedQty;


                return [
                    'flavour_name'   => $item->flavour?->name,
                    'bottle_name'    => $item->bottle?->name,
                    'produced_qty'  => $item->quantity,
                    'allowcated_qty'     => $allocatedQty,
                    'delivered_qty'     => $deliveredQty,
                    'returned_qty'     => $returnedQty,
                    'remaining_stock'  => $remaining,
                ];
            });

            return $this->sendResponse($response, 'Driver retrived successfully.');

        } catch (\Exception $e) {
            return $this->sendError('Server Error.'.$e->getMessage());
        }
    }
}
