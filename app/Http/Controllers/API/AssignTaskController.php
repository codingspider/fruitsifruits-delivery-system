<?php

namespace App\Http\Controllers\API;

use Carbon\Carbon;
use App\Models\Sell;
use App\Models\Location;
use App\Models\SellLine;
use App\Models\SellReturn;
use App\Models\Transaction;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Models\ReturnLeftover;
use App\Models\ReturnLeftoverItem;
use Illuminate\Support\Facades\DB;
use App\Models\DriverRouteLocation;
use App\Http\Controllers\Controller;
use App\Models\DriverJuiceAllocation;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\API\BaseController;

class AssignTaskController extends BaseController
{
    public function index(Request $request)
    {
        try {
            $dayName = Carbon::today()->dayName;
            $datas = DriverRouteLocation::where('user_id', auth()->id())
                ->where('status', 'pending')
                ->where('day', $dayName)
                ->get();

            // Extract unique location ids
            $locationIds = $datas->flatMap(function ($item) {
                $locations = is_string($item->locations)
                    ? json_decode($item->locations, true)
                    : $item->locations;

                return collect($locations)->pluck('location_id');
            })->unique()->values();

            // Fetch the location models
            $locations = Location::whereIn('id', $locationIds)->get();

            // Build final response
            $grouped = $locations->map(function ($loc) use ($datas) {
                // find the matching driver_route_location row
                $route = $datas->first(function ($item) use ($loc) {
                    $locs = is_string($item->locations) ? json_decode($item->locations, true) : $item->locations;
                    return collect($locs)->contains('location_id', $loc->id);
                });

                return [
                    'id'            => $route->id ?? null,
                    'location_id'   => $loc->id,                
                    'location_name' => $loc->name,
                    'lat'           => $loc->lat,
                    'lon'           => $loc->lon,
                    'status'        => $route->status ?? 'inactive',
                    'date'          => Carbon::today()->toDateString()
                ];
            });

            return $this->sendResponse($grouped, 'Data retrieved successfully.');
        } catch (\Exception $e) {
            return $this->sendError('Server Error: ' . $e->getMessage());
        }
    }
    
    public function locationProductDetails($id)
    {
        try {
            $data = DriverRouteLocation::where('user_id', auth()->user()->id)->whereJsonContains('locations', ['location_id' => $id])->where('status', 'pending')->latest()->first();
            return $this->sendResponse($data, 'Data retrieved successfully.');
        } catch (\Exception $e) {
            return $this->sendError('Server Error: ' . $e->getMessage());
        }
    }
    
    public function store(Request $request)
    {
        $request->validate([
            'location_id' => 'required|exists:locations,id',
            'flavours'    => 'required|array',
            'totals'      => 'required|array',
        ]);

        DB::beginTransaction();

        try {
            // 1) Store Signature
            $signaturePath = null;
            if ($request->signature) {
                $signature = $request->signature;

                @list($type, $fileData) = explode(';', $signature);
                @list(, $fileData) = explode(',', $fileData);

                $fileData = base64_decode($fileData);
                $fileName = 'signature_' . time() . '.png';
                Storage::disk('public')->put('signatures/' . $fileName, $fileData);
                $signaturePath = 'signatures/' . $fileName;
            }

            $route = DriverRouteLocation::find($request->route_id);
            $route->status = 'completed';
            $route->save();

            $transaction = new Transaction();
            $transaction->transaction_type = 'delivery';
            $transaction->reference_no  = 'SEL-' . Str::uuid();
            $transaction->total_amount  = $request->totals['grandTotal'] ?? 0;
            $transaction->date  = now();
            $transaction->notes  = $request->remarks ?? null;
            $transaction->created_by  = auth()->user()->id;
            $transaction->save();

            // 2) Create Assignment (main)
            $assignment = Sell::create([
                'transaction_id'  => $transaction->id,
                'location_id'     => $request->location_id,
                'paid'            => $request->payment['paid'] ?? false,
                'payment_method'  => $request->payment['method'] ?? null,
                'remarks'         => $request->remarks ?? null,
                'signature_path'  => $signaturePath,
                'subtotal'        => $request->totals['subtotal'] ?? 0,
                'return_deduction'=> $request->totals['returnDeduction'] ?? 0,
                'tax'             => $request->totals['taxAmount'] ?? 0,
                'grand_total'     => $request->totals['grandTotal'] ?? 0,
            ]);

            // 3) Store flavours (items)
            foreach ($request->flavours as $item) {
                SellLine::create([
                    'transaction_id'  => $transaction->id,
                    'flavour_id'    => $item['flavour_id'] ?? null,
                    'bottle_id'     => $item['bottle_id'] ?? null,
                    'product_id'    => $item['product_id'] ?? null,
                    'remaining'     => $item['remaining'] ?? 0,
                    'to_be_filled'  => $item['toBeFilled'] ?? 0,
                    'price'         => $item['price'] ?? 0,
                    'sub_total'     => $item['sub_total'] ?? ($item['price'] * $item['toBeFilled']),
                ]);
            }

            // 4) Store returns (if any)
            if ($request->returns && is_array($request->returns)) {
                foreach ($request->returns as $ret) {
                    SellReturn::create([
                        'transaction_id'=> $transaction->id,
                        'flavour_id'    => $ret['flavour_id'] ?? null,
                        'bottle_id'     => $ret['bottle_id'] ?? null,
                        'qty'           => $ret['qty'] ?? 0,
                    ]);
                }
            }

            DB::commit();

            return $this->sendResponse($transaction, 'Products retrieved successfully.');

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => false,
                'message' => 'Failed to save assignment',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function driverJuiceAllocation()
    {
        try {
            $data = DriverJuiceAllocation::where('driver_id', auth()->user()->id)->with(['driver', 'product', 'lines', 'lines.bottle', 'lines.flavour'])->whereDate('allocation_date', Carbon::today())->get();
            return $this->sendResponse($data, 'Data retrieved successfully.');
        } catch (\Exception $e) {
            return $this->sendError('Server Error: ' . $e->getMessage());
        }
    }

    public function returnLeftover(Request $request){
        $validator = Validator::make($request->all(), [
            'product_id'       => 'required',
            'allocation_date'       => 'required',
        ]);

        if ($validator->fails()) {
            return $this->sendError('Validation Error.', $validator->errors(), 422);
        }

        DB::beginTransaction();
        try {

            $allocation = new ReturnLeftover();
            $allocation->product_id = $request->product_id;
            $allocation->allocation_date = $request->allocation_date;
            $allocation->driver_id = auth()->user()->id;
            $allocation->save();

            foreach($request->lines as $product){
                $line = new ReturnLeftoverItem();
                $line->return_leftover_id = $allocation->id;
                $line->bottle_id = $product['bottle_id'];
                $line->flavour_id = $product['flavour_id'];
                $line->quantity = $product['quantity'];
                $line->save();
            }
            

            DB::commit();
            return $this->sendResponse($product, 'Data saved successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->sendError('Server Error: '.$e->getMessage(), 500);
        }
    }

}
