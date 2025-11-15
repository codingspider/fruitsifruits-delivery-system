<?php

namespace App\Http\Controllers\API;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\API\BaseController;

class ProductController extends BaseController
{
    /**
     * List all products (or ingredients if product_type = raw/packaging)
     */
    public function index(Request $request)
    {
        try {
            $products = Product::whereIn('product_type', ['raw', 'packaging'])
                ->latest()
                ->paginate(10);

            return $this->sendResponse($products, 'Products retrieved successfully.');
        } catch (\Exception $e) {
            return $this->sendError('Server Error: '.$e->getMessage());
        }
    }
    
    public function finishGoods(Request $request)
    {
        try {
            $products = Product::whereIn('product_type', ['finished'])
                ->latest()
                ->paginate(10);

            return $this->sendResponse($products, 'Products retrieved successfully.');
        } catch (\Exception $e) {
            return $this->sendError('Server Error: '.$e->getMessage());
        }
    }
    
    public function getProducts(Request $request)
    {
        try {
            $products = Product::whereIn('product_type', ['finished'])
                ->latest()
                ->paginate(10);

            return $this->sendResponse($products, 'Products retrieved successfully.');
        } catch (\Exception $e) {
            return $this->sendError('Server Error: '.$e->getMessage());
        }
    }
    
    public function getIngredients(Request $request)
    {
        try {
            $products = Product::whereIn('product_type', ['raw'])
                ->latest()
                ->paginate(10);

            return $this->sendResponse($products, 'Products retrieved successfully.');
        } catch (\Exception $e) {
            return $this->sendError('Server Error: '.$e->getMessage());
        }
    }
    
    public function getBottles(Request $request)
    {
        try {
            $products = Product::whereIn('product_type', ['raw', 'packaging'])
                ->where('sub_type', 'bottle')
                ->latest()
                ->paginate(10);

            return $this->sendResponse($products, 'Products retrieved successfully.');
        } catch (\Exception $e) {
            return $this->sendError('Server Error: '.$e->getMessage());
        }
    }

    /**
     * Show single product (ingredient)
     */
    public function show(Product $product)
    {
        return $this->sendResponse($product, 'Product retrieved successfully.');
    }

    /**
     * Edit product (same as show)
     */
    public function edit($id)
    {
        $product = Product::find($id);
        return $this->sendResponse($product, 'Product retrieved successfully.');
    }

    /**
     * Store new product (ingredient)
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name'           => 'required|string|max:255',
            'cost_per_unit'  => 'required|numeric',
            'product_type'   => 'nullable|in:raw,packaging,finished'
        ]);

        if ($validator->fails()) {
            return $this->sendError('Validation Error.', $validator->errors(), 422);
        }

        DB::beginTransaction();
        try {
            $product = new Product();
            $product->name = $request->name;
            $product->product_type = $request->product_type ?? 'raw';
            $product->unit = 'Pieces';
            $product->opening_stock = 0;
            $product->cost_price = $request->cost_per_unit;
            $product->unit = $request->unit;
            $product->save();

            DB::commit();
            return $this->sendResponse($product, 'Product saved successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->sendError('Server Error: '.$e->getMessage(), 500);
        }
    }

    /**
     * Update product
     */
    public function update(Request $request, Product $product)
    {
        $validator = Validator::make($request->all(), [
            'name'           => 'required|string|max:255',
            'cost_per_unit'  => 'required|numeric',
            'unit'  => 'required',
            'product_type'   => 'nullable|in:raw,packaging,finished'
        ]);

        if ($validator->fails()) {
            return $this->sendError('Validation Error.', $validator->errors(), 422);
        }

        DB::beginTransaction();
        try {
            $product->name = $request->name;
            $product->cost_price = $request->cost_per_unit;
            $product->unit = $request->unit;
            $product->save();

            DB::commit();
            return $this->sendResponse($product, 'Product updated successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->sendError('Server Error: '.$e->getMessage(), 500);
        }
    }

    /**
     * Delete product
     */
    public function destroy(Product $product)
    {
        try {
            $product->delete();
            return $this->sendResponse([], 'Product deleted successfully.');
        } catch (\Exception $e) {
            return $this->sendError('Server Error: '.$e->getMessage(), 500);
        }
    }
}
