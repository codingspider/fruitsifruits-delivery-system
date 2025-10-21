<?php

namespace App\Http\Controllers\API;

use App\Models\Product;
use App\Models\Ingredient;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\API\BaseController;

class IngredientController extends BaseController
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {
            $data = Product::whereIn('product_type', ['raw', 'packaging'])->paginate(10);
            return $this->sendResponse($data, 'Ingredient retrived successfully.');
        } catch (\Exception $e) {
            return $this->sendError('Server Error.'.$e->getMessage());
        }
    }
    
    public function edit(Product $product)
    {
        try {
            return $this->sendResponse($product, 'Ingredient retrived successfully.');
        } catch (\Exception $e) {
            return $this->sendError('Server Error.'.$e->getMessage());
        }
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name'      => 'required',
            'cost_per_unit'    => 'required'
        ]);

        if ($validator->fails()) {
            return $this->sendError('Validation Error.', $validator->errors(), 422);
        }

        DB::beginTransaction();

        try {
            $data = $request->all();
            $product = new Product();
            $product->name = $data['name'];
            $product->product_type = 'raw';
            $product->unit = 'Pices';
            $product->opening_stock = 0;
            $product->cost_price = $data['cost_per_unit'];
            $product->save();
            DB::commit();

            return $this->sendResponse(['data' => $product], 'Ingredient saved successfully.');

        } catch (\Exception $e) {
            DB::rollBack();
            return $this->sendError('Server Error: ' . $e->getMessage(), 500);
        }
    }
    
    public function update(Request $request, $id)
    {
        // Validate request
        $validator = Validator::make($request->all(), [
            'name'      => 'required|string|max:255',
            'cost_per_unit'    => 'required',
        ]);

        if ($validator->fails()) {
            return $this->sendError('Validation Error.', $validator->errors(), 422);
        }

        DB::beginTransaction();

        try {
            $ingredient = Product::findOrFail($id);
            $ingredient->name = $request->name;
            $ingredient->cost_per_unit = $request->cost_per_unit;
            $ingredient->save();
            DB::commit();

            return $this->sendResponse(['ingredient' => $ingredient], 'Ingredient updated successfully.');

        } catch (\Exception $e) {
            DB::rollBack();
            return $this->sendError('Server Error: ' . $e->getMessage(), null, 500);
        }
    }

    public function destroy($id)
    {
        try {
            $ingredient = Product::find($id);
            if (!$ingredient) {
                return $this->sendError('ingredient not found.', 404);
            }
            $ingredient->delete();
            return $this->sendResponse([], 'ingredient deleted successfully.');
        } catch (\Exception $e) {
            return $this->sendError('Server Error: ' . $e->getMessage(), 500);
        }
    }
}
