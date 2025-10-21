<?php

namespace App\Http\Controllers\API;

use App\Models\Bottle;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\API\BaseController;

class BottleManageController extends BaseController
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {
            $data = Product::where('product_type', 'packaging')->paginate(10);
            return $this->sendResponse($data, 'Bottle Cost retrived successfully.');
        } catch (\Exception $e) {
            return $this->sendError('Server Error.'.$e->getMessage());
        }
    }
    
    public function edit($id)
    {
        try {
            $user = Product::find($id);
            return $this->sendResponse($user, 'Bottle Cost retrived successfully.');
        } catch (\Exception $e) {
            return $this->sendError('Server Error.'.$e->getMessage());
        }
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'size'      => 'required',
            'bottle_price'    => 'required',
            'cap_price'    => 'required',
        ]);

        if ($validator->fails()) {
            return $this->sendError('Validation Error.', $validator->errors(), 422);
        }

        DB::beginTransaction();

        try {
            $data = $request->all();
            $price = $data['bottle_price'] + $data['cap_price'];

            $bottle = new Product();
            $bottle->name = $data['size'];
            $bottle->product_type = 'packaging';
            $bottle->unit = 'Pices';
            $bottle->opening_stock = 0;
            $bottle->cost_price = $price;
            $bottle->save();
            DB::commit();

            return $this->sendResponse(['data' => $bottle], 'Ingredient saved successfully.');

        } catch (\Exception $e) {
            DB::rollBack();
            return $this->sendError('Server Error: ' . $e->getMessage(), 500);
        }
    }
    
    public function update(Request $request, $id)
    {
        // Validate request
        $validator = Validator::make($request->all(), [
            'size'      => 'required',
            'bottle_price'    => 'required',
            'cap_price'    => 'required',
        ]);

        if ($validator->fails()) {
            return $this->sendError('Validation Error.', $validator->errors(), 422);
        }

        DB::beginTransaction();

        try {
            $data = $request->all();
            $price = $data['bottle_price'] + $data['cap_price'];
            $bottle = Product::findOrFail($id);
            $bottle->name = $data['size'];
            $bottle->product_type = 'packaging';
            $bottle->unit = 'Pices';
            $bottle->opening_stock = 0;
            $bottle->cost_price = $price;
            $bottle->save();
            DB::commit();

            return $this->sendResponse(['bottle' => $bottle], 'Data updated successfully.');

        } catch (\Exception $e) {
            DB::rollBack();
            return $this->sendError('Server Error: ' . $e->getMessage(), null, 500);
        }
    }

    public function destroy($id)
    {
        try {
            $bottle = Product::find($id);
            if (!$bottle) {
                return $this->sendError('Data not found.', 404);
            }
            $bottle->delete();
            return $this->sendResponse([], 'Data deleted successfully.');
        } catch (\Exception $e) {
            return $this->sendError('Server Error: ' . $e->getMessage(), 500);
        }
    }
}
