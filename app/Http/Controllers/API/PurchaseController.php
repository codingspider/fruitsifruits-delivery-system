<?php

namespace App\Http\Controllers\API;

use App\Models\Transaction;
use Illuminate\Http\Request;
use App\Models\TransactionLine;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Services\TransactionService;
use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\API\BaseController;

class PurchaseController extends BaseController
{
    /**
     * List all products (or ingredients if product_type = raw/packaging)
     */
    public function index(Request $request)
    {
        try {
            $purchases = Transaction::where('transaction_type', 'purchase')
            ->latest()
            ->paginate(10);

            return $this->sendResponse($purchases, 'Purchase retrieved successfully.');
        } catch (\Exception $e) {
            return $this->sendError('Server Error: '.$e->getMessage());
        }
    }

    /**
     * Show single product (ingredient)
     */
    public function show($id)
    {
        $product = Transaction::with('lines')->find($id);
        return $this->sendResponse($product, 'Product retrieved successfully.');
    }

    /**
     * Edit product (same as show)
     */
    public function edit($id)
    {
        $product = Transaction::with('lines')->find($id);
        return $this->sendResponse($product, 'Product retrieved successfully.');
    }

    /**
     * Store new product (ingredient)
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'total'     => 'required',
            'date'      => 'required',
            'ref_no' => 'nullable|string|max:255|unique:transactions,reference_no',
        ]);

        if ($validator->fails()) {
            return $this->sendError('Validation Error.', $validator->errors(), 422);
        }

        DB::beginTransaction();
        try {
            if($request->ref_no){
                $ref = $request->ref_no;
            }else{
                $ref = time();
            }
            $tran = new Transaction();
            $tran->date = $request->date;
            $tran->total_amount = $request->total;
            $tran->reference_no = $ref;
            $tran->notes = $request->notes;
            $tran->transaction_type = 'purchase';
            $tran->created_by = auth()->user()->id;
            $tran->save();

            foreach($request->products as $product){
                $line = new TransactionLine();
                $line->transaction_id = $tran->id;
                $line->product_id = $product['product_id'];
                $line->quantity = $product['quantity'];
                $line->unit_cost = $product['price'];
                $line->sub_total = $product['price'] * $product['quantity'];
                $line->save();
            }

            TransactionService::processTransaction($tran);
            

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
            $transaction = Transaction::find($id);
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
            $tran = Transaction::find($id);
            $tran->delete();
            return $this->sendResponse([], 'Product deleted successfully.');
        } catch (\Exception $e) {
            return $this->sendError('Server Error: '.$e->getMessage(), 500);
        }
    }
}
