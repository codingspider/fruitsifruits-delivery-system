<?php

namespace App\Http\Controllers\API;

use App\Models\Flavour;
use App\Models\Product;
use App\Models\MfgRecipe;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\MfgRecipeIngredient;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\API\BaseController;

class RecipeController extends BaseController
{
    public function index(Request $request)
    {
        try {
            $purchases = MfgRecipe::with(['user', 'product'])->latest()->paginate(10);
            return $this->sendResponse($purchases, 'Recipe retrieved successfully.');
        } catch (\Exception $e) {
            return $this->sendError('Server Error: '.$e->getMessage());
        }
    }

    /**
     * Show single product (ingredient)
     */
    public function show($id)
    {
        $product = MfgRecipe::with('recipe_items', 'flavor')->find($id);
        return $this->sendResponse($product, 'Recipe retrieved successfully.');
    }

    /**
     * Edit product (same as show)
     */
    public function edit($id)
    {
        $product = MfgRecipe::with('flavor')->find($id);
        return $this->sendResponse($product, 'Recipe retrieved successfully.');
    }

    /**
     * Store new product (ingredient)
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'product_id'     => 'required',
            'flavour_id'     => 'required',
            'ingredients_cost' => 'required',
            'total_quantity' => 'required',
            'instructions'      => 'nullable',
            'unit' => 'nullable',
        ]);

        if ($validator->fails()) {
            return $this->sendError('Validation Error.', $validator->errors(), 422);
        }

        $recipe = MfgRecipe::where('product_id',$request->product_id)->first();

        if ($recipe) {
            return $this->sendError('Data Error.', 'Recipe already exist for this product', 422);
        }

        DB::beginTransaction();
        try {
            $mfg = new MfgRecipe();
            $mfg->product_id = $request->product_id;
            $mfg->flavour_id = $request->flavour_id;
            $mfg->instructions = $request->notes;
            $mfg->ingredients_cost = $request->ingredients_cost;
            $mfg->total_quantity = $request->total_quantity;
            $mfg->created_by = auth()->user()->id;
            $mfg->save();

            $total = 0;
            foreach($request->products as $product){

                $pro = Product::find($product['product_id']);
                $total += $pro->cost_price * $product['quantity'];

                $line = new MfgRecipeIngredient();
                $line->mfg_recipe_id = $mfg->id;
                $line->product_id = $product['product_id'];
                $line->bottle_id = $product['bottle_id'];
                $line->quantity = $product['quantity'];
                $line->unit = $product['unit'];
                $line->save();
            }

            $flavor = Flavour::find($request->flavour_id);
            if($flavor){
                $flavor->batch_yield = $request->output_quantity;
                $flavor->batch_ingredient_cost = $total / $request->output_quantity ?? 0;
                $flavor->save();
            }
            

            DB::commit();
            return $this->sendResponse($mfg, 'Data saved successfully.');
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
            'product_id'     => 'required',
            'flavour_id'     => 'required',
            'ingredients_cost' => 'required',
            'total_quantity' => 'required',
            'instructions'      => 'nullable',
            'unit' => 'nullable',
        ]);

        if ($validator->fails()) {
            return $this->sendError('Validation Error.', $validator->errors(), 422);
        }

        DB::beginTransaction();
        try {

            // If no ref number submitted, keep old one or set time
            $mfg = MfgRecipe::find($id);
            $mfg->product_id = $request->product_id;
            $mfg->flavour_id = $request->flavour_id;
            $mfg->instructions = $request->instructions;
            $mfg->ingredients_cost = $request->ingredients_cost;
            $mfg->total_quantity = $request->total_quantity;
            $mfg->save();

            $mfg->recipe_items()->delete();

            $total = 0;

            foreach($request->products as $product){

                $pro = Product::find($product['product_id']);
                $total += $pro->cost_price * $product['quantity'];
                
                $line = new MfgRecipeIngredient();
                $line->mfg_recipe_id = $mfg->id;
                $line->product_id = $product['product_id'];
                $line->bottle_id = $product['bottle_id'];
                $line->quantity = $product['quantity'];
                $line->unit = $product['unit'];
                $line->save();
            }


            if ($total != $request->ingredients_cost) {
                $mfg->ingredients_cost = $total;
                $mfg->save();
            }

            $flavor = Flavour::find($request->flavour_id);
            if($flavor){
                $flavor->batch_yield = $request->output_quantity ?? 0;
                $flavor->batch_ingredient_cost = $total / $request->output_quantity ?? 0;
                $flavor->save();
            }


            DB::commit();
            return $this->sendResponse($mfg, 'Data updated successfully.');

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
            $tran = MfgRecipe::find($id);
            $tran->delete();
            return $this->sendResponse([], 'Recipe deleted successfully.');
        } catch (\Exception $e) {
            return $this->sendError('Server Error: '.$e->getMessage(), 500);
        }
    }
}
