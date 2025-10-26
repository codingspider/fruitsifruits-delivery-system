<?php

namespace App\Http\Controllers\API;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Models\DriverJuiceAllocation;
use App\Models\DriverJuiceAllocationLine;
use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\API\BaseController;

class DriverJuiceAllocationController extends BaseController
{
    /**
     * List all products (or ingredients if product_type = raw/packaging)
     */
    public function index(Request $request)
    {
        try {
            $data = DriverJuiceAllocation::with(['driver', 'product'])->latest()->paginate(10);
            return $this->sendResponse($data, 'Data retrieved successfully.');
        } catch (\Exception $e) {
            return $this->sendError('Server Error: '.$e->getMessage());
        }
    }

    /**
     * Show single product (ingredient)
     */
    public function show($id)
    {
        $product = DriverJuiceAllocation::with(['driver', 'product', 'lines', 'lines.bottle', 'lines.flavour'])->find($id);
        return $this->sendResponse($product, 'Product retrieved successfully.');
    }

    /**
     * Edit product (same as show)
     */
    public function edit($id)
    {
        $product = DriverJuiceAllocation::with(['lines', 'lines.bottle', 'lines.flavour'])->find($id);
        return $this->sendResponse($product, 'Product retrieved successfully.');
    }

    /**
     * Store new product (ingredient)
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'driver_id'      => 'required',
            'product_id'       => 'required',
            'allocation_date'       => 'required',
        ]);

        if ($validator->fails()) {
            return $this->sendError('Validation Error.', $validator->errors(), 422);
        }

        DB::beginTransaction();
        try {

            $allocation = new DriverJuiceAllocation();
            $allocation->driver_id = $request->driver_id;
            $allocation->product_id = $request->product_id;
            $allocation->allocation_date = $request->allocation_date;
            $allocation->save();

            foreach($request->lines as $product){
                $line = new DriverJuiceAllocationLine();
                $line->allocation_id = $allocation->id;
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

    /**
     * Update product
     */
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'driver_id'      => 'required',
            'product_id'       => 'required',
            'allocation_date'       => 'required',
        ]);

        if ($validator->fails()) {
            return $this->sendError('Validation Error.', $validator->errors(), 422);
        }

        DB::beginTransaction();
        try {

            $allocation = DriverJuiceAllocation::find($id);
            $allocation->driver_id = $request->driver_id;
            $allocation->product_id = $request->product_id;
            $allocation->allocation_date = $request->allocation_date;
            $allocation->save();

            $allocation->lines()->delete();

            foreach($request->lines as $product){
                $line = new DriverJuiceAllocationLine();
                $line->allocation_id = $allocation->id;
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


    /**
     * Delete product
     */
    public function destroy($id)
    {
        try {
            $tran = DriverJuiceAllocation::find($id);
            $tran->delete();
            return $this->sendResponse([], 'Location deleted successfully.');
        } catch (\Exception $e) {
            return $this->sendError('Server Error: '.$e->getMessage(), 500);
        }
    }

    
}
