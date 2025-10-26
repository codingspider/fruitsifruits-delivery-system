<?php

namespace App\Http\Controllers\API;

use App\Models\Location;
use Illuminate\Http\Request;
use App\Models\LocationFlavour;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\API\BaseController;

class LocationController extends BaseController
{
    /**
     * List all products (or ingredients if product_type = raw/packaging)
     */
    public function index(Request $request)
    {
        try {
            $locations = Location::latest()->paginate(10);
            return $this->sendResponse($locations, 'Location retrieved successfully.');
        } catch (\Exception $e) {
            return $this->sendError('Server Error: '.$e->getMessage());
        }
    }

    /**
     * Show single product (ingredient)
     */
    public function show($id)
    {
        $product = Location::with('location_flavours')->find($id);
        return $this->sendResponse($product, 'Product retrieved successfully.');
    }

    /**
     * Edit product (same as show)
     */
    public function edit($id)
    {
        $product = Location::with('lines')->find($id);
        return $this->sendResponse($product, 'Product retrieved successfully.');
    }

    /**
     * Store new product (ingredient)
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name'      => 'required',
            'lat'       => 'required',
            'lon'       => 'required',
        ]);

        if ($validator->fails()) {
            return $this->sendError('Validation Error.', $validator->errors(), 422);
        }

        DB::beginTransaction();
        try {

            $location = new Location();
            $location->name = $request->name;
            $location->lat = $request->lat ?? "";
            $location->lon = $request->lon ?? "";
            $location->tax_type = 'percentage';
            $location->tax_amount = $request->tax_amount ?? 0;
            $location->save();

            foreach($request->products as $product){
                $line = new LocationFlavour();
                $line->location_id = $location->id;
                $line->product_id = $product['product_id'];
                $line->flavour_id = $product['flavour_id'];
                $line->bottle_id = $product['bottle_id'];
                $line->deal_quantity = $product['deal_amount'];
                $line->specific_quantity = $product['quantity'];
                $line->price = $product['price'];
                $line->sub_total = $product['price'];
                $line->is_discount = $product['discount_enabled'];
                $line->discount_type = $product['discount_type'];
                $line->discount_amount = $product['discount_value'];
                $line->save();
            }
            

            DB::commit();
            return $this->sendResponse($product, 'Location saved successfully.');
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
            'name'      => 'required',
            'lat'       => 'required',
            'lon'       => 'required',
        ]);

        if ($validator->fails()) {
            return $this->sendError('Validation Error.', $validator->errors(), 422);
        }

        DB::beginTransaction();
        try {

            $location = Location::findOrFail($id);
            $location->name = $request->name;
            $location->lat = $request->lat ?? "";
            $location->lon = $request->lon ?? "";
            $location->tax_type = 'percentage';
            $location->tax_amount = $request->tax_amount ?? 0;
            $location->save();

            // remove previous relations
            LocationFlavour::where('location_id', $location->id)->delete();

            // insert fresh lines
            foreach($request->products as $product){
                $line = new LocationFlavour();
                $line->location_id = $location->id;
                $line->product_id = $product['product_id'];
                $line->flavour_id = $product['flavour_id'];
                $line->bottle_id = $product['bottle_id'];
                $line->deal_quantity = $product['deal_amount'] ?? 0;
                $line->specific_quantity = $product['quantity'] ?? 0;
                $line->price = $product['price'] ?? 0;
                $line->sub_total = $product['price'] ?? 0;

                // ✅ boolean-safe (backend expects 0/1)
                $line->is_discount = !empty($product['discount_enabled']) ? 1 : 0;
                $line->discount_type = $product['discount_type'] ?? null;
                $line->discount_amount = $product['discount_value'] ?? null;

                $line->save();
            }

            DB::commit();
            return $this->sendResponse($location, 'Location updated successfully.');
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
            $tran = Location::find($id);
            $tran->delete();
            return $this->sendResponse([], 'Location deleted successfully.');
        } catch (\Exception $e) {
            return $this->sendError('Server Error: '.$e->getMessage(), 500);
        }
    }
}
