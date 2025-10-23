<?php

namespace App\Http\Controllers\API;

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
        $product = MfgRecipe::with('recipe_items')->find($id);
        return $this->sendResponse($product, 'Recipe retrieved successfully.');
    }

    /**
     * Edit product (same as show)
     */
    public function edit($id)
    {
        $product = MfgRecipe::find($id);
        return $this->sendResponse($product, 'Recipe retrieved successfully.');
    }

    /**
     * Store new product (ingredient)
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'product_id'     => 'required',
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
            $mfg->instructions = $request->notes;
            $mfg->ingredients_cost = $request->ingredients_cost;
            $mfg->total_quantity = $request->total_quantity;
            $mfg->unit = $request->unit;
            $mfg->created_by = auth()->user()->id;
            $mfg->save();

            foreach($request->products as $product){
                $line = new MfgRecipeIngredient();
                $line->mfg_recipe_id = $mfg->id;
                $line->product_id = $product['product_id'];
                $line->quantity = $product['quantity'];
                $line->save();
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
            'total'     => 'required',
            'date'      => 'required',
            'ref_no' => 'nullable|string|max:255|unique:transactions,reference_no,' . $id . ',id',

        ]);

        if ($validator->fails()) {
            return $this->sendError('Validation Error.', $validator->errors(), 422);
        }

        DB::beginTransaction();
        try {

            // If no ref number submitted, keep old one or set time
            $ref = $request->ref_no ?: $transaction->reference_no ?? time();

            // ✅ Update transaction instead of creating new
            $transaction = MfgRecipe::find($id);
            $transaction->date = $request->date;
            $transaction->total_amount = $request->total;
            $transaction->reference_no = $ref;
            $transaction->notes = $request->notes;
            $transaction->save();

            // ✅ Delete old lines before inserting new ones
            $transaction->lines()->delete();

            // ✅ Insert new lines
            foreach ($request->products as $product) {
                $line = new TransactionLine();
                $line->transaction_id = $transaction->id;
                $line->product_id = $product['product_id'];
                $line->quantity = $product['quantity'];
                $line->unit_cost = $product['price'];
                $line->sub_total = $product['price'] * $product['quantity'];
                $line->save();
            }

            // ✅ Recalculate stock etc.
            TransactionService::processTransaction($transaction);

            DB::commit();
            return $this->sendResponse($transaction, 'Transaction updated successfully.');

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
