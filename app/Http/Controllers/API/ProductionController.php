<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Models\MfgProduction;
use App\Models\MfgProductionItem;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\API\BaseController;

class ProductionController extends BaseController
{
    public function index(Request $request)
    {
        try {
            $production = MfgProduction::with(['user', 'product', 'location'])->latest()->paginate(10);
            return $this->sendResponse($production, 'Data retrieved successfully.');
        } catch (\Exception $e) {
            return $this->sendError('Server Error: '.$e->getMessage());
        }
    }

    /**
     * Show single product (ingredient)
     */
    public function show($id)
    {
        $product = MfgProduction::with(['user', 'product', 'location', 'items', 'items.flavour'])->find($id);
        return $this->sendResponse($product, 'Recipe retrieved successfully.');
    }

    /**
     * Store new product (ingredient)
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'product_id'     => 'required',
            'location_id' => 'required',
            'mfg_date' => 'required'
        ]);

        if ($validator->fails()) {
            return $this->sendError('Validation Error.', $validator->errors(), 422);
        }

        DB::beginTransaction();
        try {
            $mfg = new MfgProduction();
            $mfg->product_id = $request->product_id;
            $mfg->location_id = $request->location_id;
            $mfg->ref_no = $request->ref_no;
            $mfg->mfg_date = $request->mfg_date;
            $mfg->created_by = auth()->id();
            $mfg->save();

            // Use a different variable name inside the loop
            foreach ($request->lines as $lineData) {
                $item = new MfgProductionItem();
                $item->mfg_production_id = $mfg->id;
                $item->flavour_id = $lineData['flavour_id'] ?? null;
                $item->size = $lineData['size'] ?? null;
                $item->quantity = $lineData['quantity'] ?? 0;
                $item->save();
            }

            DB::commit();

            return $this->sendResponse($mfg, 'Data saved successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->sendError('Server Error: ' . $e->getMessage(), 500);
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
            $transaction = MfgProduction::find($id);
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
            $tran = MfgProduction::find($id);
            $tran->delete();
            return $this->sendResponse([], 'Data deleted successfully.');
        } catch (\Exception $e) {
            return $this->sendError('Server Error: '.$e->getMessage(), 500);
        }
    }
}
